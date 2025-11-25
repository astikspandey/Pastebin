#!/bin/bash

echo "=================================="
echo "Encrypted Pastebin Setup"
echo "=================================="
echo ""

# Generate a random secret key
SECRET_KEY=$(openssl rand -hex 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo "Installing dependencies..."
echo ""

# Install pastebin dependencies
echo "📦 Installing pastebin dependencies..."
cd pastebin
npm install --silent
cd ..

# Install website dependencies
echo "📦 Installing website dependencies..."
cd website
npm install --silent
cd ..

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "=================================="
echo "Next Steps:"
echo "=================================="
echo ""
echo "1. Set up Supabase:"
echo "   - Go to https://supabase.com"
echo "   - Create a new project"
echo "   - Run SQL from pastebin/supabase-schema.sql"
echo "   - Get your Project URL and Anon Key"
echo ""
echo "2. Configure pastebin/.env:"
echo "   PORT=3001"
echo "   SUPABASE_URL=your-project-url"
echo "   SUPABASE_KEY=your-anon-key"
echo ""
echo "3. Configure website/.env:"
echo "   PORT=3000"
echo "   PASTEBIN_URL=http://localhost:3001"
echo "   SITE_ID=12871"
echo "   SECRET_KEY=$SECRET_KEY"
echo ""
echo "   ⚠️  Save this secret key! Generated: $SECRET_KEY"
echo ""
echo "4. Start the services:"
echo "   Terminal 1: cd pastebin && npm start"
echo "   Terminal 2: cd website && npm start"
echo ""
echo "5. Open http://localhost:3000 and click 'Register Site'"
echo ""
echo "=================================="
echo "Setup complete! See QUICKSTART.md for details."
echo "=================================="
