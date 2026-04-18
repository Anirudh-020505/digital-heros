# 🚀 QUICK START - STRIPE + SUPABASE ONLY (15 MINUTES)

**Your exact step-by-step path to get everything working.**

---

## ⏱️ TIMELINE

```
Supabase setup:        5 min
Stripe setup:          5 min  
.env.local creation:   2 min
Database migration:    2 min
                    ─────────
Total:               14 minutes ⚡
```

---

## 🎯 STEP 1: SUPABASE SETUP (5 MINUTES)

### 1.1 Go to Supabase
```
https://supabase.com
```

### 1.2 Click "Start your project" or Sign Up
```
- Sign up with GitHub (easiest)
- Or email
```

### 1.3 Create New Project
```
Project name: digital-heroes
Database password: [Create strong password - WRITE THIS DOWN]
Region: Singapore (closest to India) or your region
Click "Create new project"
```

### 1.4 Wait 2-3 Minutes
```
Supabase will initialize your database
You'll see a loading screen
Wait for it to complete
```

### 1.5 Get Connection String
```
Go to: Settings (left sidebar)
Click: Database
Scroll down to: "Connection string"
Copy the entire string:
postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
```

**SAVE THIS! ↑ This is your DATABASE_URL**

---

## 💳 STEP 2: STRIPE SETUP (5 MINUTES)

### 2.1 Go to Stripe
```
https://dashboard.stripe.com/register
```

### 2.2 Sign Up
```
- Email address
- Password
- Business info (India-based OK)
- Click "Create account"
```

### 2.3 Get API Keys
```
Go to: https://dashboard.stripe.com/keys
You'll see:
- Publishable key (starts with pk_test_)
- Secret key (starts with sk_test_)

Copy both:
✅ STRIPE_SECRET_KEY = sk_test_...
✅ STRIPE_PUBLISHABLE_KEY = pk_test_...
```

### 2.4 Create Webhook Secret
```
Go to: https://dashboard.stripe.com/webhooks
Click: "+ Add endpoint"
URL: http://localhost:5173/api/webhooks/stripe
Events to send:
  - checkout.session.completed
  - invoice.payment_failed
  - customer.subscription.updated
  - customer.subscription.deleted
Click: "Add endpoint"
Copy the Signing secret:
✅ STRIPE_WEBHOOK_SECRET = whsec_...
```

### 2.5 Create Products
```
Go to: https://dashboard.stripe.com/products
Click: "+ New"

Product 1:
- Name: Monthly Golf Plan
- Price: $25.00
- Billing period: Monthly
- Click "Save"
- Copy the Price ID: price_...
✅ STRIPE_PRICE_MONTHLY_ID = price_...

Product 2:
- Name: Yearly Golf Plan
- Price: $250.00
- Billing period: Yearly
- Click "Save"
- Copy the Price ID: price_...
✅ STRIPE_PRICE_YEARLY_ID = price_...
```

---

## 📝 STEP 3: CREATE .env.local (2 MINUTES)

### 3.1 Open Terminal

```bash
cd /Users/anirudhpanigrahy/Downloads/digital-impact-golf-main
```

### 3.2 Create .env.local File

```bash
cat > .env.local << 'EOF'
# Database (from Supabase)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres"

# Stripe (from Stripe Dashboard)
STRIPE_SECRET_KEY="sk_test_YOUR_SECRET_KEY"
STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_PUBLISHABLE_KEY"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET"
STRIPE_PRICE_MONTHLY_ID="price_YOUR_MONTHLY_ID"
STRIPE_PRICE_YEARLY_ID="price_YOUR_YEARLY_ID"

# Auth Secret (generate random)
JWT_SECRET="super-secret-key-change-this-in-production"

# App Settings
NODE_ENV="development"
APP_URL="http://localhost:5173"
EOF
```

### 3.3 Fill in Your Actual Values

Replace these with YOUR values from Supabase & Stripe:
```bash
DATABASE_URL="postgresql://postgres:MyPassword123@db.abc123xyz.supabase.co:5432/postgres"
STRIPE_SECRET_KEY="sk_test_abc123xyz..."
STRIPE_PUBLISHABLE_KEY="pk_test_abc123xyz..."
STRIPE_WEBHOOK_SECRET="whsec_abc123xyz..."
STRIPE_PRICE_MONTHLY_ID="price_1234567890"
STRIPE_PRICE_YEARLY_ID="price_0987654321"
```

### 3.4 Verify .env.local

```bash
# Check file was created
cat .env.local

# You should see your values
# Don't commit this file!
```

---

## 🗄️ STEP 4: DATABASE MIGRATION (2 MINUTES)

### 4.1 Install Dependencies

```bash
bun install
```

**Wait for it to complete (1-2 min)**

### 4.2 Run Database Migrations

```bash
bun run db:push
```

**What this does:**
- ✅ Creates 6 database tables
- ✅ Sets up relationships
- ✅ Applies constraints
- ✅ Ready for data

**Expected output:**
```
✔ Loaded env from .env.local
✔ Prepared generated Prisma Client
✔ Your database is now in sync with your Prisma schema.

✔ Generated Prisma Client (5.x.x) to ./node_modules/@prisma/client in XXms
```

---

## ✅ STEP 5: TEST IT WORKS (1 MINUTE)

### 5.1 Start Development Server

```bash
bun run dev
```

**Wait for:**
```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 5.2 Open Browser

```
Go to: http://localhost:5173
You should see your app
```

### 5.3 Database Connection Works?

```bash
# In another terminal, test database:
bun run db:seed

# This creates test data
# If it succeeds, database is connected! ✅
```

---

## 📋 COMPLETE SETUP CHECKLIST

- [ ] Supabase project created
- [ ] Connection string copied
- [ ] Stripe account created
- [ ] Stripe API keys copied
- [ ] Stripe webhook secret copied
- [ ] Stripe price IDs copied
- [ ] .env.local file created locally
- [ ] All values filled in .env.local
- [ ] `bun install` completed
- [ ] `bun run db:push` succeeded
- [ ] `bun run dev` started
- [ ] App running on http://localhost:5173
- [ ] ✅ DONE!

---

## 🧪 TEST PAYMENT FLOW

### 5.4 Test Stripe Integration

```bash
# Keep dev server running (from above)

# In another terminal:
stripe listen --forward-to localhost:5173/api/webhooks/stripe

# This listens for Stripe webhooks locally

# In yet another terminal:
stripe trigger checkout.session.completed

# This simulates a payment
# Check your database - subscription should be created!
```

---

## 🎉 YOU'RE DONE!

### What's Now Working:

✅ Database connected to Supabase
✅ Stripe payment processing ready
✅ Webhooks configured
✅ Authentication setup
✅ Golf scores can be tracked
✅ Subscriptions can be created
✅ Draws can be managed

---

## 🔧 TROUBLESHOOTING

### Problem: `bun install` fails
```bash
# Clear cache and retry
rm -rf bun.lockb node_modules
bun install
```

### Problem: `bun run db:push` fails
```
Make sure:
✅ .env.local exists
✅ DATABASE_URL is correct
✅ Supabase project initialized
✅ Check for typos in connection string
```

### Problem: Port 5173 already in use
```bash
# Kill the process using it
# Or use a different port:
bun run dev --port 3000
```

### Problem: Stripe webhook not working
```
Make sure:
✅ webhook secret matches in .env.local
✅ stripe listen command is running
✅ stripe trigger command sent event
```

---

## 📱 NEXT STEPS

### After Everything Works:

1. **Test Score Submission**
   - Navigate to score form
   - Submit a score (1-45)
   - Check database for saved score

2. **Test Subscription**
   - Click subscribe button
   - You'll be redirected to Stripe test checkout
   - Use test card: 4242 4242 4242 4242
   - Any future expiry date
   - Any 3-digit CVC
   - Check database for subscription created

3. **Test Admin Features**
   - Login as admin
   - Create a draw
   - Upload test file as winner
   - Verify workflow

4. **Read Documentation**
   - API_REFERENCE.md - All endpoints
   - COMPONENT_EXAMPLES.md - React patterns
   - DEPLOYMENT_SETUP.md - Production guide

---

## 🚀 PRODUCTION DEPLOYMENT

Once everything works locally:

1. Get Stripe live keys (not test keys)
2. Update .env.local with live keys
3. Deploy to Vercel/Railway/Heroku
4. Update webhook URL in Stripe dashboard
5. Update DATABASE_URL for production database
6. Done!

(See DEPLOYMENT_SETUP.md for detailed steps)

---

## 📞 HELP NEEDED?

### Stuck at any step?

1. Check the file names again (case-sensitive)
2. Verify all values copied correctly
3. Check connection string has password replaced
4. Read the specific error message carefully
5. Search Google for the error
6. Ask me with the error message

---

## ✨ YOU NOW HAVE:

```
✅ Working database (Supabase)
✅ Working payments (Stripe)
✅ Working authentication (JWT)
✅ Working score tracking
✅ Working subscriptions
✅ Working draws
✅ Working admin panel
✅ Working API endpoints

All in 15 minutes! 🎉
```

**Next:** Read documentation files to understand the code better.

**Then:** Start customizing and adding features!

---

**Congratulations! Your Digital Heroes backend is now fully operational!** 🚀

Questions? Check CONNECTION_STRING_SIMPLE.md or MESSAGE ME!
