# 🚀 Quick Setup Checklist

## Step-by-Step Supabase Setup

### 1. Create Supabase Project (5 min)
- [ ] Go to https://supabase.com/dashboard
- [ ] Click "New Project"
- [ ] Enter project name: `digital-heroes`
- [ ] Create a secure database password
- [ ] Select your region
- [ ] Wait for database initialization

### 2. Get Connection String (2 min)
- [ ] In Supabase Dashboard → Settings → Database
- [ ] Copy "Connection string" (Postgres, not Pooling)
- [ ] Format: `postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres`

### 3. Create `.env.local` (2 min)
- [ ] Create file at project root: `.env.local`
- [ ] Add DATABASE_URL with your connection string
- [ ] Add STRIPE keys (can get from Stripe dashboard or use test keys)

### 4. Install Dependencies (3 min)
```bash
bun add -D prisma @prisma/client tsx
```

### 5. Run Migrations (2 min)
```bash
bun run db:migrate
```
- [ ] Follow prompts to create initial migration
- [ ] Confirm all tables created in Supabase

### 6. (Optional) Seed Test Data (1 min)
```bash
bun run db:seed
```

---

## 📋 Minimal `.env.local` to Get Started

```
# REQUIRED: Supabase Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"

# STRIPE (can use test keys or skip for now)
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
STRIPE_PRICE_MONTHLY=999
STRIPE_PRICE_YEARLY=9990

# SUPABASE (can get from Settings → API)
SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_ANON_KEY="eyJxxx..."

# APP CONFIG
NODE_ENV="development"
APP_URL="http://localhost:5173"
```

---

## ⏱️ Total Setup Time: ~15 minutes

1. Supabase setup: 5 min
2. Get credentials: 2 min
3. `.env.local` creation: 2 min
4. Install dependencies: 3 min
5. Run migrations: 2 min
6. Seed data (optional): 1 min

---

## 🆘 Troubleshooting

### "Cannot connect to database"
- ✅ Check DATABASE_URL is correctly copied (including password)
- ✅ Verify Supabase project is active
- ✅ Try connecting from Supabase's SQL Editor first

### "Migration failed"
- ✅ Ensure DATABASE_URL is set in `.env.local`
- ✅ Check that Prisma/pg packages are installed
- ✅ Run: `bun run db:push` instead (simpler for first setup)

### "Prisma not found"
- ✅ Run: `bun add -D prisma @prisma/client`
- ✅ Then try migration again

---

## ✅ Status Checklist

When ready, confirm you have:

- [ ] ✅ Supabase project created
- [ ] ✅ DATABASE_URL obtained from Supabase
- [ ] ✅ `.env.local` file created with at least DATABASE_URL
- [ ] ✅ Dependencies installed (`bun add -D prisma @prisma/client`)
- [ ] ✅ Migrations run successfully (tables created in Supabase)

**Then say: "Supabase ready" to proceed to PHASE 2**

---
