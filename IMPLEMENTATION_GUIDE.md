# Digital Heroes - Backend Implementation Guide

## 📋 Project Overview

**Digital Heroes** is a charity golf subscription platform where:
- Subscribers pay monthly/yearly and submit golf scores
- Monthly draws select winners based on score matching
- Prize pools are distributed across tiers (40% Tier 1, 35% Tier 2, 25% Tier 3)
- 10% of revenue goes to charity partnerships

## 🗂️ Architecture

### Tech Stack
- **Frontend**: TanStack Start + React 19 + Vite
- **Backend**: Node.js (API routes via Cloudflare Workers/Next.js)
- **Database**: Supabase (PostgreSQL) + Prisma ORM
- **Payments**: Stripe API
- **Storage**: Supabase Storage (winner proofs)

### Database Models
- `User` - Subscribers and admins
- `Subscription` - Monthly/yearly plans with Stripe integration
- `Score` - Golf scores (1-45) with unique date constraint per user
- `Draw` - Monthly draws with winning numbers and rollover tracking
- `Charity` - Featured charities
- `WinnerVerification` - Prize claims with proof and payout tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Bun (or npm)
- Supabase account
- Stripe account

### Installation

1. **Install dependencies**:
   ```bash
   bun install
   bun add -D prisma @prisma/client tsx
   ```

2. **Set up environment variables** (copy `.env.example` to `.env.local`):
   ```bash
   cp .env.example .env.local
   ```

3. **Configure Supabase connection**:
   - Go to Supabase dashboard
   - Copy PostgreSQL connection string
   - Add to `.env.local` as `DATABASE_URL`

4. **Run migrations**:
   ```bash
   bun run db:migrate
   ```

5. **(Optional) Seed test data**:
   ```bash
   bun run db:seed
   ```

## 📁 Project Structure

```
src/
├── api/                      # API route handlers
│   ├── scores/              # Score management
│   ├── subscriptions/       # Subscription management
│   ├── admin/
│   │   ├── draws/          # Draw management
│   │   └── winners/        # Winner verification
│   └── webhooks/           # Stripe webhooks
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── stripe.ts           # Stripe configuration
│   ├── supabase.ts         # Supabase client
│   └── utils.ts            # Shared utilities
├── types/                   # TypeScript type definitions
├── hooks/                   # React hooks for API calls
└── components/             # Existing UI components

prisma/
├── schema.prisma           # Database schema
├── seed.ts                 # Test data seed
└── migrations/             # Database migrations

.env.example                # Environment variables template
.env.local                  # Local environment (gitignored)
```

## 🔄 API Routes (PHASE 2)

### Score Management
- `POST /api/scores` - Submit a golf score
- `GET /api/scores` - Get user's last 5 scores

### Subscription Management
- `POST /api/subscriptions/checkout` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Admin: Draw Management
- `POST /api/admin/draws` - Create draft draw
- `POST /api/admin/draws/[id]/publish` - Publish draw and calculate winners
- `GET /api/admin/draws/[id]` - Get draw details

### Winner Verification
- `POST /api/admin/winners/verify` - Upload and verify winner proof
- `PATCH /api/admin/winners/[id]` - Approve/reject winner
- `POST /api/admin/winners/[id]/payout` - Process payout

## 🔐 Authentication & Authorization

- Supabase Auth for user authentication (JWT tokens)
- Role-based access control (SUBSCRIBER vs ADMIN)
- API route protection with middleware

## 💳 Stripe Integration

### Webhooks Handled
- `checkout.session.completed` - Create active subscription
- `invoice.payment_failed` - Set subscription to PAST_DUE
- `customer.subscription.updated` - Sync subscription changes
- `customer.subscription.deleted` - Mark subscription as CANCELED

### Pricing
- Monthly: `$9.99` (configurable via `STRIPE_PRICE_MONTHLY`)
- Yearly: `$99.90` (configurable via `STRIPE_PRICE_YEARLY`)

## 📊 Business Logic

### Score Entry
1. Validate score is between 1-45
2. Check for existing score on the same date (409 Conflict if exists)
3. Insert new score in transaction
4. If user has >5 scores, automatically delete oldest score

### Draw Publishing
1. Calculate total active subscriptions
2. Calculate prize pool = (Active Subs × Subscription Fee) × 0.9
3. Charity pool = 10% of revenue
4. Split prize pool:
   - Tier 1 (Jackpot): 40%
   - Tier 2: 35%
   - Tier 3: 25%
5. Match user scores against winning numbers
6. Award prizes to winners
7. If Tier 1 has no winners, rollover amount to next month

### Winner Verification
1. User uploads proof screenshot to Supabase Storage
2. Admin reviews submission (PENDING → APPROVED/REJECTED)
3. If approved, process payout via Stripe
4. Update payoutStatus to PAID

## 📝 Environment Variables

See `.env.example` for complete list:

```
DATABASE_URL              # Supabase PostgreSQL connection
STRIPE_SECRET_KEY        # Stripe secret API key
STRIPE_WEBHOOK_SECRET    # Webhook signature verification
SUPABASE_URL             # Supabase project URL
SUPABASE_ANON_KEY        # Supabase anonymous key
STRIPE_PRICE_MONTHLY     # Monthly subscription price (cents)
STRIPE_PRICE_YEARLY      # Yearly subscription price (cents)
```

## 🧪 Testing

Coming in PHASE 2 - we'll include request examples and test utilities.

## 📚 Additional Resources

- [Prisma Docs](https://www.prisma.io/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [TanStack Start Docs](https://tanstack.com/start)

## ✅ Implementation Checklist

- [ ] Supabase project created and DATABASE_URL obtained
- [ ] `.env.local` file configured
- [ ] Prisma migrations run successfully
- [ ] Test data seeded (optional)
- [ ] PHASE 2: API routes implemented
- [ ] PHASE 3: Frontend hooks and state management wired
- [ ] Stripe integration tested
- [ ] Error handling and validation complete

---

**Next Steps**: Once Supabase is configured, say "**Supabase ready**" to proceed to PHASE 2: Core API Routes.
