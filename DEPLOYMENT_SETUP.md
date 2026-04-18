# 🚀 DEPLOYMENT & SETUP GUIDE

Complete step-by-step guide to configure and deploy your Digital Heroes backend.

---

## 📋 PRE-REQUISITES

Before you begin, ensure you have:

- **Node.js/Bun**: Latest version installed
- **PostgreSQL Database**: Supabase account + database URL
- **Stripe Account**: Test or production keys
- **Supabase Account**: Storage bucket + API keys
- **Git**: For version control

---

## ⚡ QUICK START (5 MINUTES)

### Step 1: Install Dependencies

```bash
cd /Users/anirudhpanigrahy/Downloads/digital-impact-golf-main

# Using Bun (recommended)
bun install

# OR using npm
npm install

# OR using yarn
yarn install
```

**Expected output**: All packages installed successfully

---

### Step 2: Configure Environment Variables

Create `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/digital-heroes"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID_MONTHLY="price_..."
STRIPE_PRICE_ID_YEARLY="price_..."

# Supabase
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Auth
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Config
CHARITY_DONATION_PERCENT="0.1"
MONTHLY_SUBSCRIPTION_PRICE="2500"
YEARLY_SUBSCRIPTION_PRICE="25000"
```

---

### Step 3: Setup Database

```bash
# Run migrations
bun run db:push

# Optional: Seed test data
bun run db:seed
```

---

### Step 4: Start Development Server

```bash
# Start server
bun run dev

# Runs on http://localhost:5173
```

---

## 🔧 DETAILED CONFIGURATION

### Stripe Setup

**Get Your API Keys:**
1. Go to https://dashboard.stripe.com/keys
2. Copy "Secret key" → `STRIPE_SECRET_KEY`
3. Copy "Publishable key" → `STRIPE_PUBLISHABLE_KEY`

**Create Products:**
1. Products → Add Product
2. Monthly Plan: $25/month → Copy Price ID → `STRIPE_PRICE_ID_MONTHLY`
3. Yearly Plan: $250/year → Copy Price ID → `STRIPE_PRICE_ID_YEARLY`

**Setup Webhooks:**
1. Webhooks → Create endpoint
2. URL: `https://your-domain.com/api/webhooks/stripe`
3. Events: 
   - checkout.session.completed
   - invoice.payment_failed
   - customer.subscription.updated
   - customer.subscription.deleted
4. Copy Signing Secret → `STRIPE_WEBHOOK_SECRET`

**Test with Stripe CLI:**
```bash
stripe listen --forward-to localhost:5173/api/webhooks/stripe
stripe trigger checkout.session.completed
```

---

### Supabase Setup

**Get Your Keys:**
1. Go to Supabase Dashboard
2. Settings → API
3. Copy `URL` → `VITE_SUPABASE_URL`
4. Copy `anon public` key → `VITE_SUPABASE_ANON_KEY`
5. Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

**Create Storage Bucket:**
1. Storage → Create new bucket
2. Name: "winner-proofs"
3. Privacy: Private
4. Click Create

**Set RLS Policies:**
```sql
CREATE POLICY "Users can upload"
ON storage.objects FOR INSERT
WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own"
ON storage.objects FOR SELECT
WHERE (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can delete"
ON storage.objects FOR DELETE
WHERE (auth.jwt() ->> 'role' = 'admin');
```

---

## 📦 PROJECT SCRIPTS

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run db:push      # Apply migrations
bun run db:reset     # Reset database (CAUTION!)
bun run db:seed      # Seed test data
```

---

## 🧪 TESTING

### Test Score API
```bash
curl -X POST http://localhost:5173/api/scores.server \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{"value": 25}'
```

### Test Stripe Webhook
```bash
stripe listen --forward-to localhost:5173/api/webhooks/stripe
stripe trigger checkout.session.completed
```

### Test File Upload
```typescript
const { uploadProof } = useWinnerVerification({ userId, drawId });
uploadProof(imageFile);
// File appears in Supabase Storage
```

---

## 🐛 TROUBLESHOOTING

| Error | Solution |
|-------|----------|
| `DATABASE_URL not set` | Add to `.env.local` |
| `@prisma/client not found` | Run `bun install` |
| Webhook fails | Check `STRIPE_WEBHOOK_SECRET` |
| File upload error | Verify Supabase bucket exists |
| Auth errors | Check `JWT_SECRET` is set |

---

## 🚀 DEPLOY TO PRODUCTION

### Option 1: Vercel

```bash
git add .
git commit -m "Deploy backend"
git push origin main

# Then:
# 1. Go to Vercel Dashboard
# 2. Import repository
# 3. Add .env.local variables
# 4. Deploy
# 5. Update Stripe webhook to production URL
```

### Option 2: Railway

```bash
# 1. Create account at railway.app
# 2. Connect GitHub
# 3. Add PostgreSQL service
# 4. Add environment variables
# 5. Deploy
```

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] .env.local configured with production keys
- [ ] Database migrations completed
- [ ] Stripe webhook endpoint configured
- [ ] Supabase Storage bucket created
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Error logging setup
- [ ] Database backups scheduled
- [ ] Test payment processed
- [ ] All webhooks receiving events

---

## 🎉 READY TO GO!

Your backend is configured and ready to deploy! 

**Next:** 
1. Check `API_REFERENCE.md` for endpoint docs
2. See `COMPONENT_EXAMPLES.md` for React integration
3. Review `PHASE_2_3_COMPLETE.md` for architecture

**Questions?** See TROUBLESHOOTING section above.
