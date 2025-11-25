# Database Setup Guide

You need to run the SQL schema in your Supabase dashboard to create the required tables.

## Step-by-Step Instructions

### 1. Open Supabase Dashboard

Go to: https://app.supabase.com/project/juivzmngvrdvmwlesncb

### 2. Navigate to SQL Editor

- In the left sidebar, click on **SQL Editor**
- Or click the **SQL** icon

### 3. Copy the SQL Below

Copy all of this SQL code:

```sql
-- Create table for storing site credentials
CREATE TABLE IF NOT EXISTS sites (
  id TEXT PRIMARY KEY,
  secret_key_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create table for storing encrypted data
CREATE TABLE IF NOT EXISTS pastes (
  id SERIAL PRIMARY KEY,
  site_id TEXT NOT NULL REFERENCES sites(id),
  location TEXT NOT NULL,
  encrypted_data TEXT NOT NULL,
  iv TEXT NOT NULL,
  epoch BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_location ON pastes(site_id, location);
CREATE INDEX IF NOT EXISTS idx_site_id ON pastes(site_id);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE pastes ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed)
CREATE POLICY "Allow all operations on sites" ON sites FOR ALL USING (true);
CREATE POLICY "Allow all operations on pastes" ON pastes FOR ALL USING (true);
```

### 4. Paste and Run

- Paste the SQL into the editor
- Click the **Run** button (or press Cmd/Ctrl + Enter)
- Wait for "Success. No rows returned"

### 5. Verify Tables

You should see in the left sidebar under **Table Editor**:
- ✅ sites
- ✅ pastes

## What These Tables Do

### `sites` table
Stores registered sites and their encrypted credentials:
- `id`: Your site ID (e.g., "12871")
- `secret_key_hash`: SHA256 hash of your secret key
- `created_at`: When the site was registered

### `pastes` table
Stores all encrypted data:
- `id`: Auto-incrementing ID
- `site_id`: Which site owns this data
- `location`: Encrypted location identifier
- `encrypted_data`: Your encrypted data
- `iv`: Initialization vector for decryption
- `epoch`: Timestamp when encrypted
- `created_at`: When stored

## Optional: Enable Automatic ID Reset

To allow the reset script to automatically reset IDs back to 1:

### Copy and run this SQL (optional):

```sql
CREATE OR REPLACE FUNCTION reset_paste_sequence()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  ALTER SEQUENCE pastes_id_seq RESTART WITH 1;
END;
$$;

GRANT EXECUTE ON FUNCTION reset_paste_sequence() TO anon;
GRANT EXECUTE ON FUNCTION reset_paste_sequence() TO authenticated;
```

**What this does:** When you run `./reset.sh`, it will automatically reset the paste IDs to start from 1 again.

**Without this:** The reset script will still work, but you'll need to manually reset the sequence in Supabase if you want IDs to start from 1.

## Done!

Once you see "Success", your database is ready. Proceed to start the services!
