# Encrypted Pastebin System

A secure, encrypted pastebin system with two components:
1. **Website**: Main application that stores user data
2. **Pastebin Service**: Separate service that handles encrypted storage using Supabase

## Architecture

The system uses a secure handshake protocol for authentication:

1. Website connects to pastebin with `site_id`
2. Pastebin sends SHA256 hash of secret key as challenge
3. Website confirms by sending the same hash
4. Pastebin confirms ready to receive data
5. Website encrypts data with `secret_key + epoch` and sends it
6. Pastebin stores encrypted data in Supabase
7. Website can retrieve data by providing proof: SHA256(key + epoch)

## Features

- End-to-end encryption using AES-256-CBC
- Secure handshake protocol
- Epoch-based encryption keys for additional security
- Supabase backend for scalable storage
- Simple web interface for testing
- Separate deployable services

## Project Structure

```
Pastebin/
├── website/                 # Main website application
│   ├── server.js           # Express server
│   ├── utils/
│   │   ├── crypto.js       # Encryption utilities
│   │   └── pastebinClient.js # Pastebin API client
│   ├── public/
│   │   ├── index.html      # Web interface
│   │   ├── style.css       # Styles
│   │   └── script.js       # Frontend logic
│   ├── package.json
│   └── .env.example
│
└── pastebin/               # Pastebin service
    ├── server.js           # Express server
    ├── utils/
    │   └── crypto.js       # Encryption utilities
    ├── supabase-schema.sql # Database schema
    ├── package.json
    └── .env.example
```

## Setup Instructions

### Prerequisites

- Node.js 16+ installed
- Supabase account (free tier works)
- Git (optional, for version control)

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** in the dashboard
4. Copy and paste the contents of `pastebin/supabase-schema.sql`
5. Run the SQL to create tables
6. Go to **Settings** > **API** and copy:
   - Project URL
   - Anon public key

### 2. Configure Pastebin Service

```bash
cd pastebin

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your Supabase credentials
# PORT=3001
# SUPABASE_URL=your-project-url
# SUPABASE_KEY=your-anon-key
```

### 3. Configure Website

```bash
cd website

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
# PORT=3000
# PASTEBIN_URL=http://localhost:3001
# SITE_ID=your-unique-site-id (e.g., 12871)
# SECRET_KEY=your-secret-key (generate a strong random key)
```

### 4. Start the Services

**Terminal 1 - Pastebin Service:**
```bash
cd pastebin
npm start
```

**Terminal 2 - Website:**
```bash
cd website
npm start
```

### 5. Initialize the System

1. Open your browser and go to `http://localhost:3000`
2. Click on the **Register Site** tab
3. Click **Register Now** to register your site with the pastebin
4. You should see a success message

### 6. Test the System

1. Go to the **Test Connection** tab
2. Click **Test Handshake**
3. If successful, the handshake protocol is working correctly

### 7. Store and Retrieve Data

**Store Data:**
1. Go to the **Store Data** tab
2. Enter a location/key (e.g., "user_settings")
3. Enter JSON data (e.g., `{"theme": "dark", "language": "en"}`)
4. Click **Store Data**

**Retrieve Data:**
1. Go to the **Retrieve Data** tab
2. Leave location empty to retrieve all data, or enter a specific location
3. Click **Retrieve Data**
4. Your decrypted data will be displayed

## Security Features

### Encryption

- **AES-256-CBC**: Industry-standard encryption algorithm
- **Dynamic Keys**: Encryption key changes with each request (key + epoch)
- **SHA-256 Hashing**: Used for authentication proofs

### Authentication Protocol

1. Pastebin sends SHA256(secret_key) as challenge
2. Website must provide matching hash to proceed
3. Each data request includes SHA256(key + epoch) proof
4. Epoch timestamp prevents replay attacks

### Data Storage

- All data stored in Supabase is encrypted
- Secret keys are never stored in plain text (only SHA256 hash)
- Each paste includes an IV (initialization vector) for added security

## Deployment

### Deploy Pastebin to GitHub Pages + Vercel/Netlify

The pastebin service needs a serverless backend. Options:

**Option 1: Vercel**
```bash
cd pastebin
npm install -g vercel
vercel
```

**Option 2: Netlify**
```bash
cd pastebin
npm install -g netlify-cli
netlify deploy
```

### Deploy Website

Same as above - can be deployed to Vercel, Netlify, or any Node.js hosting platform.

### Environment Variables

Make sure to set environment variables in your deployment platform:
- Vercel: Project Settings > Environment Variables
- Netlify: Site Settings > Build & Deploy > Environment

## API Endpoints

### Pastebin Service

- `GET /handshake?site_id=xxx` - Initialize handshake
- `POST /verify` - Verify handshake
- `POST /store` - Store encrypted data
- `GET /retrieve?site_id=xxx&enc=proof&epo=epoch` - Retrieve data
- `POST /register` - Register new site

### Website API

- `POST /api/register` - Register with pastebin
- `POST /api/store` - Store data
- `GET /api/retrieve?location=xxx` - Retrieve data
- `GET /api/test-handshake` - Test connection

## Protocol Flow

### Storing Data

```
Website                          Pastebin
   |                                |
   |------ GET /handshake --------->|
   |<----- session_id, hash --------|
   |                                |
   |------ POST /verify ----------->|
   |<----- ready -------------------|
   |                                |
   |------ POST /store ------------>|
   |  {                             |
   |    time: epoch,                |
   |    encrypted_info: data,       |
   |    loc: location,              |
   |    iv: iv,                     |
   |    enc: proof                  |
   |  }                             |
   |<----- success -----------------|
```

### Retrieving Data

```
Website                          Pastebin
   |                                |
   |------ GET /retrieve ---------> |
   |  ?site_id=xxx                  |
   |  &enc=SHA256(key+epoch)        |
   |  &epo=epoch                    |
   |  &loc=location                 |
   |                                |
   |<----- encrypted data ----------|
   |                                |
   [Website decrypts locally]
```

## Troubleshooting

### Connection Failed

- Make sure both services are running
- Check that `PASTEBIN_URL` in website/.env matches pastebin service URL
- Verify firewall/network settings

### Handshake Failed

- Ensure `SITE_ID` matches between website and pastebin
- Verify `SECRET_KEY` is correctly set
- Check that site is registered (use /api/register)

### Decryption Failed

- Verify the secret key hasn't changed
- Check that epoch values are consistent
- Ensure data wasn't corrupted during transmission

### Supabase Connection Failed

- Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
- Check that tables were created using the SQL schema
- Ensure Supabase project is active

## Security Considerations

1. **Never commit .env files** - Add `.env` to `.gitignore`
2. **Use strong secret keys** - Generate with `openssl rand -hex 32`
3. **HTTPS in production** - Always use HTTPS for production deployments
4. **Rotate keys periodically** - Change secret keys regularly
5. **Monitor access** - Check Supabase logs for unusual activity

## License

MIT License - Feel free to use and modify as needed.
# Pastebin
