# 🚀 VERCEL SERVERLESS DEPLOYMENT GUIDE

**Deploy your Digital Heroes golf app to Vercel in 10 minutes.**

---

## ⚠️ IMPORTANT: Database Connection Issue

Your Supabase database is currently **unreachable** from your local machine. This is likely because:

1. **Supabase firewall** - Blocks external connections by default
2. **IP restriction** - Your IP may not be whitelisted
3. **Network issue** - Temporary connectivity problem

**Solution for development:** Use Supabase's connection pooler (PgBouncer) instead of direct connection.

---

## 📋 STEP 1: FIX SUPABASE CONNECTION (5 MINUTES)

### 1.1 Use Connection Pooler Instead of Direct Connection

Go to Supabase Dashboard:
```
Settings → Database → Connection string
Switch from: "Connection string" 
To: "Connection pooling"
```

Copy the pooling connection string (uses port 6543):
```
postgresql://postgres:[PASSWORD]@[PROJECT].supabase.co:6543/postgres?schema=public
```

This URL works better for:
- Serverless functions (Vercel)
- Multiple concurrent connections
- Network isolation

### 1.2 Update .env.local

Replace your `DATABASE_URL` with the connection pooling string:

```bash
DATABASE_URL="postgresql://postgres:DigitalHeros125@db.afsyzqlikjwpoditqulz.supabase.co:6543/postgres?schema=public"
```

### 1.3 Test Connection Locally

```bash
cd /Users/anirudhpanigrahy/Downloads/digital-impact-golf-main

# Test the new connection string
DATABASE_URL="postgresql://postgres:DigitalHeros125@db.afsyzqlikjwpoditqulz.supabase.co:6543/postgres?schema=public" npx prisma db push
```

If it works, you'll see:
```
✔ Database synced with schema
✔ All models synced successfully
```

---

## 🎯 STEP 2: PREPARE FOR VERCEL DEPLOYMENT (5 MINUTES)

### 2.1 Create .env.production

Create a new file: `.env.production`

```bash
cat > .env.production << 'EOF'
# Production Database (Connection Pooler for Vercel)
DATABASE_URL="postgresql://postgres:DigitalHeros125@db.afsyzqlikjwpoditqulz.supabase.co:6543/postgres?schema=public"

# Stripe (Live Keys - DO NOT USE TEST KEYS IN PRODUCTION)
STRIPE_SECRET_KEY="sk_live_YOUR_LIVE_SECRET_KEY"
STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_LIVE_PUBLISHABLE_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_LIVE_WEBHOOK_SECRET"
STRIPE_PRICE_MONTHLY_ID="prod_YOUR_LIVE_MONTHLY"
STRIPE_PRICE_YEARLY_ID="prod_YOUR_LIVE_YEARLY"

# Auth Secret
JWT_SECRET="your-production-secret-key-change-this"

# App Settings
NODE_ENV="production"
APP_URL="https://your-app-domain.vercel.app"
EOF
```

**⚠️ DO NOT commit .env.production to Git!**
Add to `.gitignore`:
```
.env.local
.env.production
```

### 2.2 Update package.json Build Script

Ensure your `package.json` has:

```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "start": "node dist/server.js",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev"
  }
}
```

### 2.3 Create Vercel Configuration

File already created: `vercel.json`

Vercel will automatically:
- Install dependencies
- Build your app
- Deploy to serverless functions
- Set environment variables

---

## 📱 STEP 3: DEPLOY TO VERCEL (5 MINUTES)

### 3.1 Login to Vercel

```bash
npm install -g vercel
vercel login
```

Follow the prompts to authenticate with GitHub/GitLab/Bitbucket

### 3.2 Deploy Your App

From your project directory:

```bash
cd /Users/anirudhpanigrahy/Downloads/digital-impact-golf-main
vercel
```

When prompted:
```
? Set up and deploy "~/Downloads/digital-impact-golf-main"? [Y/n] Y
? Which scope do you want to deploy to? [Your Name]
? Link to existing project? [y/N] N
? What's your project's name? digital-heroes
? In which directory is your code located? ./
? Want to modify these settings? [y/N] N
```

Vercel will then:
- Build your app ✅
- Create deployment ✅
- Provide live URL ✅

### 3.3 Add Environment Variables to Vercel

After first deployment, go to:
```
Vercel Dashboard → Project → Settings → Environment Variables
```

Add all variables from `.env.production`:
```
DATABASE_URL = postgresql://postgres:DigitalHeros125@...
STRIPE_SECRET_KEY = sk_test_...
STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_WEBHOOK_SECRET = whsec_...
STRIPE_PRICE_MONTHLY_ID = prod_...
STRIPE_PRICE_YEARLY_ID = prod_...
JWT_SECRET = your-secret
NODE_ENV = production
APP_URL = https://your-app-domain.vercel.app
```

### 3.4 Redeploy with Environment Variables

After adding env vars:

```bash
vercel --prod
```

This deploys with your environment variables configured.

---

## ✅ VERIFICATION CHECKLIST

- [ ] Connection pooling enabled in Supabase
- [ ] Local `.env.local` uses pooling connection
- [ ] Prisma migration successful locally
- [ ] `.env.production` created (not committed)
- [ ] `vercel.json` configured
- [ ] Deployed to Vercel
- [ ] Environment variables set in Vercel dashboard
- [ ] Redeployed with `vercel --prod`
- [ ] App running at live URL
- [ ] Database queries working
- [ ] Stripe payments working
- [ ] Webhooks receiving events

---

## 🔧 TROUBLESHOOTING

### "Can't reach database server"
**Solution:** Use connection pooling URL instead of direct connection
```
Change port 5432 → 6543
Add ?schema=public to URL
```

### "Migration failed on Vercel"
**Solution:** Migrations run automatically. If they fail:
```bash
# Manually trigger migration
vercel env pull  # Get env vars
npm run db:push
```

### "Stripe webhook not working"
**Solution:** Update webhook URL in Stripe dashboard to your Vercel URL:
```
https://your-app-domain.vercel.app/api/webhooks/stripe
```

### "Build fails on Vercel"
**Solution:** Check build logs
```bash
vercel logs --follow
```

---

## 📊 MONITORING & LOGS

### View Live Logs
```bash
vercel logs --follow
```

### View Specific Deployment
```bash
vercel deployments list
vercel logs [DEPLOYMENT_ID]
```

### Check Errors
```bash
vercel logs --follow --level error
```

---

## 🔐 SECURITY BEST PRACTICES

1. **Never commit `.env.local` or `.env.production`**
   ```bash
   echo ".env.local" >> .gitignore
   echo ".env.production" >> .gitignore
   ```

2. **Use Stripe live keys in production only**
   - Development: Use test keys (sk_test_, pk_test_)
   - Production: Use live keys (sk_live_, pk_live_)

3. **Rotate JWT_SECRET regularly**
   ```bash
   # Generate new random secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Monitor Supabase connection limits**
   - Check: Supabase Dashboard → Logs
   - Limit: Connection pooler has max 15 connections

5. **Keep secrets out of logs**
   - Vercel logs redact sensitive data automatically
   - Don't log `DATABASE_URL` or `STRIPE_SECRET_KEY`

---

## 🚀 PRODUCTION OPTIMIZATION

### Enable Automatic Deployments
```
Vercel Dashboard → Project → Git
Enable: Automatic deployments on push
```

### Add Custom Domain
```
Vercel Dashboard → Project → Domains
Add: your-domain.com
Follow DNS setup instructions
```

### Configure Caching
Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ]
}
```

### Monitor Performance
```
Vercel Analytics → Real Experience Monitoring
Vercel Speed Insights → Performance metrics
```

---

## 📞 FINAL SETUP

**Your app is now live! Next steps:**

1. ✅ Test all features on production
2. ✅ Update Stripe webhook URLs
3. ✅ Test payment flow end-to-end
4. ✅ Monitor logs for errors
5. ✅ Set up error tracking (Sentry)
6. ✅ Configure custom domain
7. ✅ Enable HTTPS (automatic)

---

## 🎉 DEPLOYMENT COMPLETE!

**Your Digital Heroes app is now running on Vercel serverless!**

Live URL: `https://your-app-name.vercel.app`

Questions? Check Vercel docs: https://vercel.com/docs
