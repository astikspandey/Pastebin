const crypto = require('crypto');

/**
 * Generate SHA256 hash of input
 */
function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Encrypt data using AES-256-CBC with key+epoch
 */
function encrypt(data, key, epoch) {
  const combinedKey = key + epoch.toString();
  const hash = crypto.createHash('sha256').update(combinedKey).digest();
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv('aes-256-cbc', hash, iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    encrypted: encrypted,
    iv: iv.toString('hex')
  };
}

/**
 * Decrypt data using AES-256-CBC with key+epoch
 */
function decrypt(encryptedData, iv, key, epoch) {
  const combinedKey = key + epoch.toString();
  const hash = crypto.createHash('sha256').update(combinedKey).digest();
  const ivBuffer = Buffer.from(iv, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-cbc', hash, ivBuffer);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
}

/**
 * Generate authentication proof: SHA256(key + epoch)
 */
function generateAuthProof(key, epoch) {
  return sha256(key + epoch.toString());
}

/**
 * Verify authentication proof
 */
function verifyAuthProof(proof, key, epoch) {
  const expected = generateAuthProof(key, epoch);
  return proof === expected;
}

module.exports = {
  sha256,
  encrypt,
  decrypt,
  generateAuthProof,
  verifyAuthProof
};
