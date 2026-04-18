# 🗄️ DATABASE SETUP FOR STRIPE - COMPLETE GUIDE

You want to keep **Stripe only** and setup the database. Here's exactly what to do step-by-step.

---

## 📋 YOUR OPTIONS (Pick One)

### Option 1: Supabase (EASIEST - RECOMMENDED) ✅
```
✅ Free tier available
✅ PostgreSQL managed for you
✅ Connection string auto-generated
✅ Built-in backup & security
✅ No server setup needed
✅ Perfect for startups
```

### Option 2: Direct PostgreSQL Server
```
⚠️ More complex setup
- Need to install PostgreSQL
- Need to manage server
- Need to handle backups
- Need to manage security
= Too complicated for now
```

### Option 3: Railway / Render (Cloud Postgres)
```
✅ Simple setup
✅ Connection string provided
✅ Good middle ground
⚠️ Slightly more expensive than Supabase
```

---

## 🎯 I RECOMMEND: SUPABASE (5 MINUTES)

### Step 1: Create Free Supabase Account

**Go to:** https://supabase.com/

1. Click **"Start your project"**
2. Sign up with GitHub/Email
3. Click **"New Project"**
4. Fill in:
   - **Project name:** `digital-heroes` (or any name)
   - **Database password:** Choose a strong password (SAVE THIS!)
   - **Region:** Pick closest to you (e.g., Singapore for India)
5. Click **"Create new project"**
6. Wait 2-3 minutes for it to initialize

### Step 2: Get Your Connection String

Once your project is created:

1. Go to **Settings** (left sidebar)
2. Click **"Database"**
3. You'll see the connection string:

```
postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
```

**Copy the ENTIRE string and send to me** (or use directly)

---

## 🔍 WHAT YOU'LL SEE IN SUPABASE

### After clicking "Database" in Settings:

```
Connection string
────────────────────────────────────────────────────────
postgresql://postgres:your_password@db.abc123xyz.supabase.co:5432/postgres

URI string (for URI format)
────────────────────────────────────────────────────────
postgresql://postgres:your_password@db.abc123xyz.supabase.co:5432/postgres

Connection pooling (use this for production)
────────────────────────────────────────────────────────
postgresql://postgres.abc123xyz:your_password@5432-us-east-1.pooler.supabase.com:6543/postgres
```

**For now, use the regular "Connection string"**

---

## 💾 HOW TO GIVE ME THE CONNECTION STRING

### Method 1: Direct Message (SAFEST)
```
Send me via private message:
postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres

Example:
postgresql://postgres:MyStrongPassword123@db.abc123xyz.supabase.co:5432/postgres
```

### Method 2: Create `.env.local` Locally (You Use It Yourself)
```bash
# On your computer, in the project folder:
cd /Users/anirudhpanigrahy/Downloads/digital-impact-golf-main

# Create .env.local file
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres"
STRIPE_SECRET_KEY="sk_test_YOUR_STRIPE_KEY"
STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_STRIPE_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET"
STRIPE_PRICE_MONTHLY_ID="price_YOUR_MONTHLY"
STRIPE_PRICE_YEARLY_ID="price_YOUR_YEARLY"
JWT_SECRET="any-random-secret-key-here"
EOF
```

### Method 3: Share .env.local File With Me
```bash
# After creating .env.local with your values:
# Upload it to me or share the content
```

---

## 🚀 QUICK CONNECTION STRING GENERATOR

### Your Supabase Dashboard Will Show:

```
Project settings at: https://supabase.com/dashboard/project/[PROJECT_ID]

Click Settings → Database

You'll see:

Project URL (for Storage/API): https://[PROJECT_ID].supabase.co

Connection string:
postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
```

### Copy-Paste Template:
```bash
# BEFORE (template)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"

# AFTER (your actual values)
DATABASE_URL="postgresql://postgres:MyPassword123@db.abc123xyz.supabase.co:5432/postgres"
```

---

## ❓ QUESTIONS & ANSWERS

### Q: What's the password in the connection string?
```
A: The password YOU chose when creating the project
   It's separate from your login password
   Write it down - you'll need it
```

### Q: What's [PROJECT_ID]?
```
A: Unique ID Supabase gives your project
   Example: abc123xyz
   It's shown in the connection string
```

### Q: Does Supabase cost money?
```
A: Free tier includes:
   ✅ 500 MB database storage
   ✅ 2 GB bandwidth
   ✅ Email support
   ✅ Perfect for MVP/testing
   
   For production later:
   💰 $25/month for more storage
```

### Q: Is my password safe in .env.local?
```
A: YES, if you:
   ✅ Add .env.local to .gitignore (already done)
   ✅ Never commit it to Git
   ✅ Never share it publicly
   ✅ Only use locally
   
   For production:
   🔐 Use environment variables in hosting dashboard
```

### Q: Can I use a different database?
```
A: YES, but same steps:
   1. Get connection string from provider
   2. Add to DATABASE_URL in .env.local
   3. Run `bun run db:push`
   4. Done!
```

---

## ✅ COMPLETE SETUP FLOW

### What You Need to Do:

```
1. Go to https://supabase.com
   ↓
2. Create free account & new project
   ↓
3. Wait for project to initialize (2-3 min)
   ↓
4. Go to Settings → Database
   ↓
5. Copy the Connection String
   ↓
6. Create .env.local file locally with:
   - DATABASE_URL (from Supabase)
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET
   - STRIPE_PRICE IDs
   - JWT_SECRET
   ↓
7. Run: bun install
   ↓
8. Run: bun run db:push
   ↓
9. Done! Database is ready
```

---

## 🔐 YOUR COMPLETE .env.local (STRIPE ONLY)

Here's what to put in your `.env.local` file:

```bash
# SUPABASE DATABASE (from https://supabase.com/dashboard)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres"

# STRIPE KEYS (from https://dashboard.stripe.com/keys)
STRIPE_SECRET_KEY="sk_test_YOUR_TEST_KEY_HERE"
STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_TEST_KEY_HERE"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET_HERE"

# STRIPE PRODUCT IDs (Create Monthly & Yearly plans in Stripe)
STRIPE_PRICE_MONTHLY_ID="price_YOUR_MONTHLY_PRODUCT_ID"
STRIPE_PRICE_YEARLY_ID="price_YOUR_YEARLY_PRODUCT_ID"

# AUTH SECRET (generate random: openssl rand -hex 32)
JWT_SECRET="your-random-secret-key-generated-locally"

# APPLICATION
NODE_ENV="development"
APP_URL="http://localhost:5173"
```

---

## 🎯 WHAT HAPPENS AFTER DB SETUP

### After you run `bun run db:push`:

```
1. ✅ Database tables created:
   - users
   - subscriptions
   - scores
   - draws
   - winner_verifications
   - charities

2. ✅ Constraints applied:
   - Unique date per user for scores
   - Unique month/year for draws
   - Foreign key relationships

3. ✅ Ready for data:
   - You can create users
   - Store subscriptions
   - Track scores
   - Manage draws
```

### Your database will have this structure:

```
Supabase Project
├── PostgreSQL Database
│   ├── users table
│   ├── subscriptions table
│   ├── scores table
│   ├── draws table
│   ├── winner_verifications table
│   └── charities table
│
├── Storage (for file uploads)
│   └── winner-proofs bucket
│
└── API Keys & Connection
    ├── DATABASE_URL
    ├── ANON KEY
    ├── SERVICE ROLE KEY
    └── API URL
```

---

## 🚦 TRANSACTION POOL (OPTIONAL)

### What is it?
```
Connection pooling = Managing multiple database connections efficiently
```

### Do you need it now?
```
❌ NO for local development
✅ YES for production with many users

For now:
- Use regular Connection String
- Connection pooling can be added later
```

### When to use Connection Pooling:
```
Later when deploying to production:
1. Supabase → Settings → Database → Connection Pooling
2. Copy the "Pooling Connection String"
3. Use in production environment
4. Handles 100+ concurrent connections
```

For now, just use the regular connection string!

---

## 📋 STEP-BY-STEP CHECKLIST

- [ ] Go to https://supabase.com
- [ ] Create account (free)
- [ ] Create new project
- [ ] Choose region (Singapore for India)
- [ ] Wait for initialization (2-3 min)
- [ ] Go to Settings → Database
- [ ] Copy Connection String
- [ ] Create `.env.local` file locally
- [ ] Paste Connection String into `.env.local`
- [ ] Add STRIPE keys to `.env.local`
- [ ] Add STRIPE product IDs to `.env.local`
- [ ] Add JWT_SECRET to `.env.local`
- [ ] Run `bun install`
- [ ] Run `bun run db:push`
- [ ] Check for success message
- [ ] Database is ready! ✅

---

## 🎊 SUMMARY

### Your Path Forward:

```
1. Supabase Account: 2 minutes
   ↓
2. Get Connection String: 1 minute
   ↓
3. Create .env.local: 2 minutes
   ↓
4. Run setup: 2 minutes
   ↓
5. Database Ready: ✅ 7 MINUTES TOTAL
```

### What to Send Me:

Option A (I setup for you):
```
Send: DATABASE_URL connection string
I will: Update code and test
```

Option B (You setup yourself):
```
You: Create .env.local locally
You: Run `bun install && bun run db:push`
You: Tell me when done
```

---

## ❓ ANY QUESTIONS?

**Common issues:**

| Issue | Solution |
|-------|----------|
| Can't find connection string | Settings → Database (scroll down) |
| Password forgotten | Delete project & create new one |
| Database won't connect | Check password has special characters |
| `bun run db:push` fails | Verify DATABASE_URL in .env.local |

---

**Ready to setup? Go to https://supabase.com and create your project now!** 🚀

Let me know your connection string (or when you finish setup) and I'll help with the next steps! 💚
