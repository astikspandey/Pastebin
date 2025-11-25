# Your Encrypted Pastebin Setup

## ✅ What's Already Configured

1. **Environment Variables**
   - Pastebin service configured with your Supabase credentials
   - Website configured with:
     - Site ID: `12871`
     - Secret Key: `2f4b43cfea16d7f7a28504d3b680b11a63d5b0553071fd667b1fc508be052d73`
     - Pastebin URL: `http://localhost:3001`

2. **Dependencies**
   - All npm packages installed for both services
   - Ready to run

## 🚀 Next Steps

### Step 1: Set Up Database (5 minutes)

Follow the instructions in **SETUP_DATABASE.md**:

1. Go to https://app.supabase.com/project/juivzmngvrdvmwlesncb/sql
2. Click **SQL Editor**
3. Copy the SQL from SETUP_DATABASE.md
4. Paste and click **Run**
5. Verify you see "Success"

### Step 2: Start the Services

**Option A: Using the scripts**

Terminal 1:
```bash
./start-pastebin.sh
```

Terminal 2:
```bash
./start-website.sh
```

**Option B: Manual start**

Terminal 1:
```bash
cd pastebin
npm start
```

Terminal 2:
```bash
cd website
npm start
```

### Step 3: Initialize & Test

1. Open your browser: http://localhost:3000
2. Click the **Register Site** tab
3. Click **Register Now**
4. You should see: "Site registered successfully"
5. Click **Test Connection** to verify the handshake works

### Step 4: Use It!

**Store Data:**
- Go to **Store Data** tab
- Enter a location (e.g., "test")
- Enter JSON data (e.g., `{"hello": "world"}`)
- Click **Store Data**

**Retrieve Data:**
- Go to **Retrieve Data** tab
- Leave location empty (or enter "test")
- Click **Retrieve Data**
- See your decrypted data!

## 🔐 Important Security Info

**Your Secret Key:**
```
2f4b43cfea16d7f7a28504d3b680b11a63d5b0553071fd667b1fc508be052d73
```

**⚠️ IMPORTANT:**
- Never commit this key to git (already in .gitignore)
- Don't share it publicly
- Store it securely (password manager)
- If compromised, generate a new one and re-register

## 📁 File Locations

- **Environment files:**
  - `pastebin/.env` - Pastebin configuration
  - `website/.env` - Website configuration

- **Access URLs:**
  - Website: http://localhost:3000
  - Pastebin API: http://localhost:3001
  - Supabase Dashboard: https://app.supabase.com/project/juivzmngvrdvmwlesncb

## 🛠️ Troubleshooting

**Can't connect to pastebin?**
- Make sure pastebin service is running (Terminal 1)
- Check it's on port 3001: `curl http://localhost:3001/handshake?site_id=12871`

**Handshake fails?**
- Verify database tables exist in Supabase
- Check .env files are correct
- Try registering again

**Database errors?**
- Verify you ran the SQL in Supabase dashboard
- Check your Supabase project is active
- Verify the URL and key in pastebin/.env

## 📖 Documentation

- **SETUP_DATABASE.md** - Database setup guide
- **README.md** - Full documentation
- **QUICKSTART.md** - Quick reference

## 🎉 You're All Set!

Everything is configured and ready. Just need to:
1. Run the SQL in Supabase (5 minutes)
2. Start both services
3. Register your site
4. Start using encrypted storage!
