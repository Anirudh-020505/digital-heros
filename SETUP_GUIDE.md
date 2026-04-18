# Digital Heroes - Complete Setup Guide

## PHASE 1: Supabase Setup (PostgreSQL + Auth + Storage)

### Step 1: Create Supabase Project
1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in:
   - **Project Name**: `digital-heroes` (or your preference)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Wait for database to initialize (2-5 minutes)

### Step 2: Get Connection Details
1. In Supabase Dashboard, go to **Settings → Database**
2. Under "Connection string", select **Postgres** (not "Pooling")
3. Copy the connection string, it will look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your database password

### Step 3: Create `.env.local` File
Create a file at the root of your project:

```bash
touch .env.local
```

Add this content (update with your actual values):

```
# Supabase Database
DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@db.xxxxx.supabase.co:5432/postgres"

# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY="sk_test_xxxxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"

# Stripe Pricing (in cents)
STRIPE_PRICE_MONTHLY=999
STRIPE_PRICE_YEARLY=9990

# Supabase Auth & Storage
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_ANON_KEY="eyJxxx..."
SUPABASE_SERVICE_ROLE_KEY="eyJxxx..."

# App Config
NODE_ENV="development"
APP_URL="http://localhost:5173"
CHARITY_POOL_PERCENTAGE=10
```

### Step 4: Install Prisma Dependencies
```bash
bun add -D prisma @prisma/client
```

### Step 5: Run Initial Migration
```bash
npx prisma migrate dev --name init
```

This will:
- Connect to your Supabase database
- Create all tables from schema.prisma
- Generate Prisma Client

### Step 6: (Optional) Seed Test Data
After migration succeeds, run:
```bash
npx prisma db seed
```

We'll create a seed file in the next phase.

---

## Stripe Setup (Parallel)

1. Go to https://stripe.com/dashboard
2. Get your **Secret Key** and **Publishable Key** from API Keys section
3. Create a webhook endpoint (we'll do this in PHASE 2)

---

## Supabase Storage Setup (For Winner Verification Uploads)

1. In Supabase Dashboard, go to **Storage**
2. Create new bucket: `winner-proofs`
3. Set to **Private** (we'll authenticate uploads)
4. In bucket settings, enable RLS (Row Level Security)

---

## Ready? Tell me when you have:
- ✅ DATABASE_URL from Supabase
- ✅ `.env.local` file created
- ✅ `bun add -D prisma @prisma/client` installed

Then say **"Supabase ready"** and I'll generate PHASE 2 API routes!
