# 🗺️ ARCHITECTURE DIAGRAM & FLOW

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      DIGITAL HEROES PLATFORM                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Frontend   │         │   Backend   │         │  Database   │
│ (TanStack)  │◄──────► │   (Node.js) │◄──────► │ (Supabase)  │
│ React 19    │         │   API Routes│         │ PostgreSQL  │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              ├──┐
                              │  ├─► Stripe
                              │  ├─► Supabase Storage
                              │  └─► Prisma ORM
                              │
```

---

## Request Flow

### 1. Score Submission Flow

```
User enters golf score (1-45)
         │
         ▼
   Frontend Hook
   (useScoreSubmission)
         │
         ▼
  POST /api/scores
         │
         ├─ Validate score 1-45
         ├─ Check unique [userId, date]
         ├─ Begin transaction
         ├─ Insert score
         ├─ Count user scores
         ├─ If > 5: Delete oldest
         └─ Commit transaction
         │
         ▼
   200 OK + Score data
         │
         ▼
   Update frontend state
   & refresh list
```

### 2. Subscription Checkout Flow

```
User clicks "Subscribe Monthly/Yearly"
         │
         ▼
   Frontend Hook
   (useSubscriptionCheckout)
         │
         ▼
  POST /api/subscriptions/checkout
         │
         ├─ Get or create Stripe customer
         ├─ Create checkout session
         ├─ Store in database (PENDING status)
         └─ Return sessionId
         │
         ▼
   Redirect to Stripe Checkout
         │
         ├─── Stripe Completes Payment ───┐
         │                                  │
    Payment Fails                   ✓ Payment Succeeds
         │                                  │
         ▼                                  ▼
  POST /api/webhooks/stripe    POST /api/webhooks/stripe
  (invoice.payment_failed)      (checkout.session.completed)
         │                                  │
    Status→PAST_DUE              Status→ACTIVE
```

### 3. Draw Publishing Flow

```
Admin clicks "Publish Draw"
with winning numbers [7, 14, 21, 28, 35]
         │
         ▼
  POST /api/admin/draws/[id]/publish
         │
         ├─ Get all ACTIVE subscriptions
         │
         ├─ Calculate Prize Pool
         │  ├─ Total = (Subs × Fee) × 0.9
         │  └─ Charity = 10% of revenue
         │
         ├─ Split Prize Pool
         │  ├─ Tier 1 (40%): Jackpot
         │  ├─ Tier 2 (35%): Second Prize
         │  └─ Tier 3 (25%): Third Prize
         │
         ├─ Match User Scores
         │  └─ Get all users' last 5 scores
         │  └─ Compare against winning numbers
         │  └─ Count matches per user
         │
         ├─ Calculate Winners by Tier
         │  ├─ 5 matches → Tier 1 (Jackpot)
         │  ├─ 4 matches → Tier 2
         │  └─ 3 matches → Tier 3
         │
         ├─ Distribute Prize Money
         │  ├─ If no Tier 1 winner
         │  │  └─ Rollover Tier 1 pool to next draw
         │  └─ Split pool equally among tier winners
         │
         ├─ Create WinnerVerifications
         │  └─ Status: PENDING (waiting for proof)
         │
         └─ Set Draw Status → PUBLISHED
         │
         ▼
  201 Created + Draw with winners
         │
         ▼
  Winners notified to submit proof
```

### 4. Winner Verification Flow

```
Winner uploads proof screenshot
         │
         ▼
   Frontend Hook
   (useWinnerVerification)
         │
         ▼
  POST /api/admin/winners/verify
         │
         ├─ Validate file
         ├─ Upload to Supabase Storage
         ├─ Update proofUrl
         └─ Status → PENDING (admin review)
         │
         ▼
   200 OK + verification updated
         │
  ┌──────────────┴──────────────┐
  │                             │
  ▼                             ▼
Admin Approves            Admin Rejects
  │                             │
  ├─ Status→APPROVED    Status→REJECTED
  │                             │
  ▼                             ▼
PATCH /api/admin/winners/[id]
  │
  ├─ Create Stripe payout
  ├─ payoutStatus→PENDING
  │
  ▼
POST /api/admin/winners/[id]/payout
  │
  ├─ Stripe transfer initiated
  └─ payoutStatus→PAID
```

---

## Database Relationships

```
┌─────────┐
│  User   │◄─────┐
└────┬────┘      │
     │           │
     ├──────────►Score
     │
     ├──────────►Subscription
     │
     └──────────►WinnerVerification◄──┐
                                      │
                              Draw◄───┘
                              │
                              │
                           Charity
                           (many-to-many
                            via draws)
```

---

## API Endpoints (PHASE 2)

```
Score Management
├─ POST   /api/scores              Submit score (1-45)
└─ GET    /api/scores              Get last 5 scores

Subscriptions
├─ POST   /api/subscriptions/checkout
└─ POST   /api/webhooks/stripe     Webhook handler

Admin: Draws
├─ GET    /api/admin/draws         List all draws
├─ POST   /api/admin/draws         Create draft
├─ GET    /api/admin/draws/[id]    Get draw details
├─ PATCH  /api/admin/draws/[id]    Update draw
├─ DELETE /api/admin/draws/[id]    Delete draft
└─ POST   /api/admin/draws/[id]/publish  Publish & calculate winners

Admin: Winners
├─ POST   /api/admin/winners/verify       Upload proof
├─ GET    /api/admin/winners/[id]        Get verification
├─ PATCH  /api/admin/winners/[id]        Approve/reject
└─ POST   /api/admin/winners/[id]/payout Process payout
```

---

## Data Models (6 Tables)

```
User (n) ──◄────── Subscription (n)
  │                   ├─ plan: MONTHLY | YEARLY
  │                   └─ status: ACTIVE | PAST_DUE | CANCELED
  │
  ├──────────────── Score (n)
  │                 └─ @@unique([userId, date])
  │
  └──────────────── WinnerVerification (n) ──────┐
                    ├─ status: PENDING|APPROVED|REJECTED
                    └─ payoutStatus: PENDING|PAID
                                            │
                                            ▼
                              Draw (m) ┌─── drawId
                              ├─ @@unique([year, month])
                              └─ status: DRAFT|PUBLISHED

Charity (m)
  ├─ isFeatured: boolean
  └─ (linked to draws via app logic)
```

---

## Prize Pool Calculation Example

```
Scenario:
- 1000 active monthly subscribers
- $9.99 monthly price per subscriber
- Total revenue: $9,990

Prize Pool Calculation:
├─ Total revenue: $9,990
├─ Platform fee (10%): $999 → Charity pool
└─ Prize pool (90%): $8,991

Tier Distribution (of $8,991):
├─ Tier 1 (40%): $3,596.40  ← Jackpot
├─ Tier 2 (35%): $3,146.85  ← Second prize
└─ Tier 3 (25%): $2,247.75  ← Third prize

If Tier 1 has 2 winners:
├─ Winner 1: $1,798.20
└─ Winner 2: $1,798.20

If Tier 1 has 0 winners:
└─ $3,596.40 rolls over to next month
```

---

## Error Handling

```
All APIs return standardized responses:

Success (200):
{
  "success": true,
  "data": { ... }
}

Error (4xx/5xx):
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR|NOT_FOUND|CONFLICT|etc",
    "message": "User-friendly error message"
  }
}

Common Status Codes:
├─ 200: Success
├─ 201: Created
├─ 400: Validation error
├─ 401: Unauthorized
├─ 403: Forbidden (admin only)
├─ 404: Not found
├─ 409: Conflict (duplicate score date)
└─ 500: Server error
```

---

## Transaction Safety

```
Critical Operations Wrapped in Transactions:

Score Submission:
1. Begin transaction
2. Insert score
3. Count scores for user
4. If count > 5:
   a. Find oldest score
   b. Delete oldest score
5. Commit or rollback on error

Draw Publishing:
1. Begin transaction
2. Calculate winners
3. Create winner verifications
4. Update draw status
5. Commit or rollback on error
```

---

## Security Layers

```
Request → Authentication → Authorization → Validation → Execute

├─ JWT verification (Supabase Auth)
├─ Admin role check
├─ Input validation (Zod schemas)
├─ Stripe webhook signature
├─ Secure file uploads
└─ SQL injection prevention (Prisma)
```

---

**Architecture Complete!** ✅

Ready to say "**Supabase ready**" to generate PHASE 2? 🚀
