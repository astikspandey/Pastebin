# Deploy Encrypted Pastebin to Vercel

Deploy your encrypted pastebin service to Vercel for free!

## Prerequisites

- [Vercel account](https://vercel.com/signup) (free)
- Vercel CLI: `npm install -g vercel`
- Supabase account (already set up)

## 🚀 Quick Deploy

### Option 1: Vercel CLI (Recommended)

**1. Prepare the pastebin service:**

```bash
cd pastebin
```

**2. Login to Vercel:**

```bash
vercel login
```

**3. Deploy:**

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- Project name? `encrypted-pastebin` (or your choice)
- Directory? `.` (current directory)
- Override settings? **N**

**4. Set environment variables:**

```bash
vercel env add SUPABASE_URL
# Paste: https://juivzmngvrdvmwlesncb.supabase.co

vercel env add SUPABASE_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

vercel env add PORT
# Enter: 3001
```

**5. Deploy to production:**

```bash
vercel --prod
```

**6. Get your URL:**

You'll see something like:
```
✅ Production: https://encrypted-pastebin.vercel.app
```

### Option 2: Vercel Dashboard

**1. Push to GitHub:**

```bash
cd pastebin
git init
git add .
git commit -m "Initial pastebin setup"
gh repo create encrypted-pastebin --public --source=. --push
```

**2. Import to Vercel:**

- Go to https://vercel.com/new
- Import your repository
- Configure project:
  - **Framework Preset**: Other
  - **Root Directory**: `./`
  - **Build Command**: (leave empty)
  - **Output Directory**: (leave empty)

**3. Add environment variables:**

In Project Settings → Environment Variables, add:
- `SUPABASE_URL` = `https://juivzmngvrdvmwlesncb.supabase.co`
- `SUPABASE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- `PORT` = `3001`

**4. Deploy:**

Click **Deploy** and wait for build to complete.

## 📝 Vercel Configuration

Create `vercel.json` in the pastebin directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "PORT": "3001"
  }
}
```

## 🔧 Update Website Configuration

After deploying, update your website's `.env`:

```bash
cd ../website
```

Edit `.env`:
```env
PORT=3000
PASTEBIN_URL=https://encrypted-pastebin.vercel.app
SITE_ID=12871
SECRET_KEY=2f4b43cfea16d7f7a28504d3b680b11a63d5b0553071fd667b1fc508be052d73
```

## 🧪 Test Deployment

```bash
# Test handshake
curl https://encrypted-pastebin.vercel.app/handshake?site_id=12871

# Expected response:
# {"session_id":"...","challenge":"..."}
```

## 🌐 Deploy Website to Vercel (Optional)

**1. Deploy website:**

```bash
cd ../website
vercel
```

**2. Set environment variables:**

```bash
vercel env add PASTEBIN_URL
# Enter: https://encrypted-pastebin.vercel.app

vercel env add SITE_ID
# Enter: 12871

vercel env add SECRET_KEY
# Enter: 2f4b43cfea16d7f7a28504d3b680b11a63d5b0553071fd667b1fc508be052d73
```

**3. Deploy to production:**

```bash
vercel --prod
```

Now you have:
- Pastebin API: `https://encrypted-pastebin.vercel.app`
- Website: `https://your-website.vercel.app`

## 🎯 Update LangGames

Update LangGames `.env` to use deployed pastebin:

```bash
cd ../LangFight
```

Edit `.env`:
```env
PASTEBIN_URL=https://encrypted-pastebin.vercel.app
SITE_ID=langgames_001
SECRET_KEY=5fc4cb0edec80b28daa403c85392c61340ed27d2350f0c855572fb9c30c4e9ca
KEY=5fc4cb0edec80b28daa403c85392c61340ed27d2350f0c855572fb9c30c4e9ca
```

## 📊 Vercel Limits (Free Tier)

- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions
- ⚠️ 10 second function timeout
- ⚠️ 100 requests/minute (hobby)

Perfect for personal use and small projects!

## 🔒 Security Considerations

### Environment Variables
- ✅ Stored securely in Vercel
- ✅ Not visible in logs
- ✅ Encrypted at rest

### HTTPS
- ✅ Automatic SSL/TLS
- ✅ Free certificates
- ✅ Auto-renewal

### Supabase Key
- ⚠️ Use **anon** key (not service_role)
- ✅ Row Level Security policies protect data
- ✅ Data encrypted with secret key

## 🛠️ Troubleshooting

### "Module not found"
```bash
# Make sure package.json exists
cd pastebin
npm install
vercel
```

### "Function timeout"
- Vercel free tier has 10s timeout
- Most operations complete in <1s
- If timeout occurs, optimize database queries

### "Environment variables not found"
```bash
# Check variables are set
vercel env ls

# Pull latest variables
vercel env pull
```

### CORS Issues
The pastebin already has CORS enabled:
```javascript
app.use(cors());
```

If you still have issues, update `server.js`:
```javascript
app.use(cors({
  origin: '*', // or specific domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
```

## 🔄 Updating Deployment

```bash
cd pastebin
# Make changes
vercel --prod
```

Vercel automatically:
- ✅ Builds your app
- ✅ Runs tests
- ✅ Deploys globally
- ✅ Invalidates CDN cache

## 📈 Monitoring

View deployment logs:
```bash
vercel logs
```

Or in dashboard:
- https://vercel.com/dashboard
- Select your project
- Click "Deployments"
- View logs for each deployment

## 🎉 You're Live!

Your encrypted pastebin is now:
- ✅ Hosted on Vercel
- ✅ Accessible globally
- ✅ Running on HTTPS
- ✅ Auto-scaling
- ✅ Zero maintenance

Share your pastebin URL with LangGames or any other app!

## 💡 Pro Tips

1. **Custom Domain**: Add your own domain in Vercel dashboard
2. **Analytics**: Enable Vercel Analytics for traffic insights
3. **Preview Deployments**: Every git push creates a preview URL
4. **Instant Rollbacks**: Revert to any previous deployment instantly

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [Environment Variables](https://vercel.com/docs/environment-variables)
- [Node.js on Vercel](https://vercel.com/docs/runtimes#official-runtimes/node-js)
