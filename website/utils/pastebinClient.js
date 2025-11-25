const axios = require('axios');
const { sha256, encrypt, decrypt, generateAuthProof } = require('./crypto');

class PastebinClient {
  constructor(pastebinUrl, siteId, secretKey) {
    this.pastebinUrl = pastebinUrl;
    this.siteId = siteId;
    this.secretKey = secretKey;
  }

  /**
   * Perform handshake with pastebin
   */
  async handshake() {
    try {
      // Step 1: Initiate handshake
      const response = await axios.get(`${this.pastebinUrl}/handshake`, {
        params: { site_id: this.siteId }
      });

      const { session_id, challenge } = response.data;

      // Step 2: Verify we have the correct secret key
      const ourHash = sha256(this.secretKey);
      if (ourHash !== challenge) {
        throw new Error('Secret key mismatch');
      }

      // Step 3: Send verification
      const verifyResponse = await axios.post(`${this.pastebinUrl}/verify`, {
        session_id,
        proof: ourHash
      });

      if (verifyResponse.data.status !== 'ready') {
        throw new Error('Handshake verification failed');
      }

      return true;
    } catch (error) {
      console.error('Handshake failed:', error.message);
      throw error;
    }
  }

  /**
   * Store data in pastebin
   */
  async store(location, data) {
    try {
      // Perform handshake first
      await this.handshake();

      // Get current epoch
      const epoch = Math.floor(Date.now() / 1000);

      // Encrypt the data
      const { encrypted, iv } = encrypt(data, this.secretKey, epoch);

      // Generate auth proof
      const authProof = generateAuthProof(this.secretKey, epoch);

      // Send to pastebin
      const response = await axios.post(`${this.pastebinUrl}/store`, {
        site_id: this.siteId,
        time: epoch,
        encrypted_info: encrypted,
        loc: location, // Store location as plain text for querying
        iv: iv,
        enc: authProof
      });

      return response.data;
    } catch (error) {
      console.error('Store failed:', error.message);
      throw error;
    }
  }

  /**
   * Retrieve data from pastebin
   */
  async retrieve(location = null) {
    try {
      const epoch = Math.floor(Date.now() / 1000);
      const authProof = generateAuthProof(this.secretKey, epoch);

      const params = {
        site_id: this.siteId,
        enc: authProof,
        epo: epoch
      };

      if (location) {
        params.loc = location; // Send location as plain text
      }

      const response = await axios.get(`${this.pastebinUrl}/retrieve`, { params });

      // Decrypt the retrieved data
      const decryptedData = response.data.data.map(item => {
        try {
          const decrypted = decrypt(item.encrypted_data, item.iv, this.secretKey, item.epoch);
          return {
            id: item.id,
            location: item.location,
            data: decrypted,
            epoch: item.epoch,
            created_at: item.created_at
          };
        } catch (error) {
          console.error('Failed to decrypt item:', item.id);
          return null;
        }
      }).filter(item => item !== null);

      return decryptedData;
    } catch (error) {
      console.error('Retrieve failed:', error.message);
      throw error;
    }
  }

  /**
   * Register this site with the pastebin
   */
  async register() {
    try {
      const response = await axios.post(`${this.pastebinUrl}/register`, {
        site_id: this.siteId,
        secret_key: this.secretKey
      });

      return response.data;
    } catch (error) {
      console.error('Registration failed:', error.message);
      throw error;
    }
  }

  /**
   * Update existing data in pastebin
   */
  async update(pasteId, data) {
    try {
      // Perform handshake first
      await this.handshake();

      // Get current epoch
      const epoch = Math.floor(Date.now() / 1000);

      // Encrypt the new data
      const { encrypted, iv } = encrypt(data, this.secretKey, epoch);

      // Generate auth proof
      const authProof = generateAuthProof(this.secretKey, epoch);

      // Send update to pastebin
      const response = await axios.put(`${this.pastebinUrl}/update`, {
        site_id: this.siteId,
        paste_id: pasteId,
        time: epoch,
        encrypted_info: encrypted,
        iv: iv,
        enc: authProof
      });

      return response.data;
    } catch (error) {
      console.error('Update failed:', error.message);
      throw error;
    }
  }

  /**
   * Delete data from pastebin
   */
  async delete(pasteId) {
    try {
      const epoch = Math.floor(Date.now() / 1000);
      const authProof = generateAuthProof(this.secretKey, epoch);

      const response = await axios.delete(`${this.pastebinUrl}/delete`, {
        data: {
          site_id: this.siteId,
          paste_id: pasteId,
          enc: authProof,
          epo: epoch
        }
      });

      return response.data;
    } catch (error) {
      console.error('Delete failed:', error.message);
      throw error;
    }
  }
}

module.exports = PastebinClient;
