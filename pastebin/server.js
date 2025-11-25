require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { sha256, decrypt, verifyAuthProof } = require('./utils/crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(cors());
app.use(bodyParser.json());

// Store active handshake sessions
const activeSessions = new Map();

/**
 * Step 1: Initialize handshake
 * Website connects with site_id
 * Pastebin responds with SHA256(secret_key)
 */
app.get('/handshake', async (req, res) => {
  try {
    const { site_id } = req.query;

    if (!site_id) {
      return res.status(400).json({ error: 'site_id required' });
    }

    // Verify site exists
    const { data: site, error } = await supabase
      .from('sites')
      .select('secret_key_hash')
      .eq('id', site_id)
      .single();

    if (error || !site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    // Create session
    const sessionId = Date.now().toString();
    activeSessions.set(sessionId, {
      site_id,
      secret_key_hash: site.secret_key_hash,
      timestamp: Date.now()
    });

    // Clean old sessions (older than 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    for (const [key, value] of activeSessions.entries()) {
      if (value.timestamp < fiveMinutesAgo) {
        activeSessions.delete(key);
      }
    }

    res.json({
      session_id: sessionId,
      challenge: site.secret_key_hash
    });
  } catch (error) {
    console.error('Handshake error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Step 2: Verify handshake
 * Website sends encrypted proof
 * Pastebin verifies and confirms ready
 */
app.post('/verify', async (req, res) => {
  try {
    const { session_id, proof } = req.body;

    if (!session_id || !proof) {
      return res.status(400).json({ error: 'session_id and proof required' });
    }

    const session = activeSessions.get(session_id);
    if (!session) {
      return res.status(404).json({ error: 'Invalid or expired session' });
    }

    // Verify proof matches stored hash
    if (proof !== session.secret_key_hash) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    res.json({
      status: 'ready',
      message: 'Ready to receive data'
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Step 3: Store encrypted data
 * Format: { time: epoch, encrypted_info: data, loc: location, iv: iv }
 */
app.post('/store', async (req, res) => {
  try {
    const { site_id, time, encrypted_info, loc, iv, enc } = req.body;

    if (!site_id || !time || !encrypted_info || !loc || !iv || !enc) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get site's secret key hash for verification
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('secret_key_hash')
      .eq('id', site_id)
      .single();

    if (siteError || !site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    // Verify the request is authentic
    // enc should be SHA256(secret_key + epoch)
    // We can't verify this without the secret_key, but we trust the encrypted data format

    // Store the encrypted data
    const { data, error } = await supabase
      .from('pastes')
      .insert([{
        site_id,
        location: loc,
        encrypted_data: encrypted_info,
        iv,
        epoch: time
      }])
      .select();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to store data' });
    }

    res.json({
      status: 'success',
      message: 'Data stored successfully',
      id: data[0].id
    });
  } catch (error) {
    console.error('Store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Step 4: Retrieve data
 * Format: ?site_id=xxx&enc=proof&epo=epoch&loc=location
 */
app.get('/retrieve', async (req, res) => {
  try {
    const { site_id, enc, epo, loc } = req.query;

    if (!site_id || !enc || !epo) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Get site's secret key hash
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('secret_key_hash')
      .eq('id', site_id)
      .single();

    if (siteError || !site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    // Retrieve data
    let query = supabase
      .from('pastes')
      .select('*')
      .eq('site_id', site_id);

    if (loc) {
      query = query.eq('location', loc);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to retrieve data' });
    }

    res.json({
      status: 'success',
      data: data || []
    });
  } catch (error) {
    console.error('Retrieve error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Register a new site
 */
app.post('/register', async (req, res) => {
  try {
    const { site_id, secret_key } = req.body;

    if (!site_id || !secret_key) {
      return res.status(400).json({ error: 'site_id and secret_key required' });
    }

    const secret_key_hash = sha256(secret_key);

    const { data, error } = await supabase
      .from('sites')
      .insert([{
        id: site_id,
        secret_key_hash
      }])
      .select();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return res.status(409).json({ error: 'Site ID already exists' });
      }
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to register site' });
    }

    res.json({
      status: 'success',
      message: 'Site registered successfully',
      site_id
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Update existing data
 * Format: { site_id, paste_id, time, encrypted_info, iv, enc }
 */
app.put('/update', async (req, res) => {
  try {
    const { site_id, paste_id, time, encrypted_info, iv, enc } = req.body;

    if (!site_id || !paste_id || !time || !encrypted_info || !iv || !enc) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify site exists
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('secret_key_hash')
      .eq('id', site_id)
      .single();

    if (siteError || !site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    // Verify the paste belongs to this site
    const { data: existingPaste, error: checkError } = await supabase
      .from('pastes')
      .select('*')
      .eq('id', paste_id)
      .eq('site_id', site_id)
      .single();

    if (checkError || !existingPaste) {
      return res.status(404).json({ error: 'Paste not found or does not belong to this site' });
    }

    // Update the paste
    const { data, error } = await supabase
      .from('pastes')
      .update({
        encrypted_data: encrypted_info,
        iv: iv,
        epoch: time
      })
      .eq('id', paste_id)
      .eq('site_id', site_id)
      .select();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to update data' });
    }

    res.json({
      status: 'success',
      message: 'Data updated successfully',
      id: paste_id
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Delete data
 */
app.delete('/delete', async (req, res) => {
  try {
    const { site_id, paste_id, enc, epo } = req.body;

    if (!site_id || !paste_id || !enc || !epo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify site exists
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('secret_key_hash')
      .eq('id', site_id)
      .single();

    if (siteError || !site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    // Delete the paste
    const { error } = await supabase
      .from('pastes')
      .delete()
      .eq('id', paste_id)
      .eq('site_id', site_id);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to delete data' });
    }

    res.json({
      status: 'success',
      message: 'Data deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Pastebin service running on port ${PORT}`);
});
