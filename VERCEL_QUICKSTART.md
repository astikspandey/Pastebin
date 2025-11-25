# Vercel Deployment - Quick Reference

## 🚀 One-Command Deploy

```bash
# Install Vercel CLI (once)
npm install -g vercel

# Login (once)
vercel login

# Deploy
./deploy-vercel.sh
```

## ⚡ Manual Deploy

### Pastebin Service

```bash
cd pastebin
vercel --prod
```

### Set Environment Variables

```bash
vercel env add SUPABASE_URL
# Enter: https://juivzmngvrdvmwlesncb.supabase.co

vercel env add SUPABASE_KEY
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1aXZ6bW5ndnJkdm13bGVzbmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMDU3NzAsImV4cCI6MjA3OTU4MTc3MH0.6qy_MRfyh-AhzeWEiqoG7horgcyTvMc2zn2cCtYPL9M

vercel env add PORT
# Enter: 3001
```

### Redeploy After Setting Env Vars

```bash
vercel --prod
```

## 🔗 Your URLs

After deployment, you'll get:
- **Pastebin API**: `https://your-project.vercel.app`
- **Website**: `https://your-website.vercel.app`

## 🎯 Update LangGames

Edit `/Users/astikspandey/Desktop/LangFight/.env`:

```env
PASTEBIN_URL=https://your-project.vercel.app
SITE_ID=langgames_001
SECRET_KEY=5fc4cb0edec80b28daa403c85392c61340ed27d2350f0c855572fb9c30c4e9ca
```

## ✅ Test Deployment

```bash
# Test pastebin
curl https://your-project.vercel.app/handshake?site_id=langgames_001

# Should return:
# {"session_id":"...","challenge":"..."}
```

## 📚 Full Documentation

See `DEPLOY_VERCEL.md` for complete instructions and troubleshooting.

## 🆘 Quick Troubleshooting

**Deployment fails?**
```bash
# Check if vercel.json exists
ls pastebin/vercel.json

# Reinstall dependencies
cd pastebin && npm install
```

**Environment variables not working?**
```bash
# List current variables
vercel env ls

# Pull latest
vercel env pull

# Redeploy
vercel --prod
```

**Site not registered?**
```bash
# Register with your deployed URL
curl -X POST https://your-project.vercel.app/register \
  -H "Content-Type: application/json" \
  -d '{
    "site_id": "langgames_001",
    "secret_key": "5fc4cb0edec80b28daa403c85392c61340ed27d2350f0c855572fb9c30c4e9ca"
  }'
```

## 🎉 Done!

Your encrypted pastebin is now live on Vercel with:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Zero configuration
- ✅ Free hosting
