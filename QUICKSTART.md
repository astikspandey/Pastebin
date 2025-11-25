# Quick Start Guide

Get your encrypted pastebin running in 5 minutes!

## Step 1: Install Dependencies

```bash
# Install pastebin dependencies
cd pastebin
npm install

# Install website dependencies
cd ../website
npm install
cd ..
```

## Step 2: Set Up Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run the SQL from `pastebin/supabase-schema.sql` in SQL Editor
4. Copy your Project URL and Anon Key from Settings > API

## Step 3: Configure Environment

**Pastebin (.env):**
```bash
cd pastebin
cp .env.example .env
# Edit .env with your Supabase credentials
```

**Website (.env):**
```bash
cd ../website
cp .env.example .env
# Edit .env:
# - Set PASTEBIN_URL (default: http://localhost:3001)
# - Set SITE_ID (any unique string, e.g., 12871)
# - Set SECRET_KEY (generate with: openssl rand -hex 32)
```

## Step 4: Start Services

**Terminal 1:**
```bash
cd pastebin
npm start
```

**Terminal 2:**
```bash
cd website
npm start
```

## Step 5: Initialize

1. Open browser: `http://localhost:3000`
2. Click **Register Site** tab
3. Click **Register Now**
4. Test with **Test Connection** tab

## You're Ready!

Now you can:
- Store encrypted data in the **Store Data** tab
- Retrieve it in the **Retrieve Data** tab
- All data is encrypted end-to-end!

## Generate Secret Key

```bash
# Linux/Mac
openssl rand -hex 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Need Help?

See the full [README.md](README.md) for detailed documentation.
