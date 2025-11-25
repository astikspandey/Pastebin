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
