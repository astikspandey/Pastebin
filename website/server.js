require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PastebinClient = require('./utils/pastebinClient');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize pastebin client
const pastebinClient = new PastebinClient(
  process.env.PASTEBIN_URL,
  process.env.SITE_ID,
  process.env.SECRET_KEY
);

/**
 * Register this site with the pastebin
 */
app.post('/api/register', async (req, res) => {
  try {
    const result = await pastebinClient.register();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
});

/**
 * Store user data
 */
app.post('/api/store', async (req, res) => {
  try {
    const { location, data } = req.body;

    if (!location || !data) {
      return res.status(400).json({ error: 'location and data required' });
    }

    const result = await pastebinClient.store(location, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Store failed',
      message: error.message
    });
  }
});

/**
 * Retrieve user data
 */
app.get('/api/retrieve', async (req, res) => {
  try {
    const { location } = req.query;
    const result = await pastebinClient.retrieve(location);
    res.json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({
      error: 'Retrieve failed',
      message: error.message
    });
  }
});

/**
 * Test handshake
 */
app.get('/api/test-handshake', async (req, res) => {
  try {
    const result = await pastebinClient.handshake();
    res.json({ status: 'success', message: 'Handshake successful' });
  } catch (error) {
    res.status(500).json({
      error: 'Handshake failed',
      message: error.message
    });
  }
});

/**
 * Update existing data
 */
app.put('/api/update', async (req, res) => {
  try {
    const { paste_id, data } = req.body;

    if (!paste_id || !data) {
      return res.status(400).json({ error: 'paste_id and data required' });
    }

    const result = await pastebinClient.update(paste_id, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Update failed',
      message: error.message
    });
  }
});

/**
 * Delete data
 */
app.delete('/api/delete/:paste_id', async (req, res) => {
  try {
    const { paste_id } = req.params;

    if (!paste_id) {
      return res.status(400).json({ error: 'paste_id required' });
    }

    const result = await pastebinClient.delete(paste_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Delete failed',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Website running on http://localhost:${PORT}`);
});
