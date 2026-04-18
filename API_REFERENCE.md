# 📚 API REFERENCE GUIDE

Complete documentation of all backend endpoints and their usage.

---

## 🏌️ SCORE MANAGEMENT ENDPOINTS

### Submit Golf Score
**Endpoint**: `src/api/scores.server.ts` → `submitScore()`

**Function Signature**:
```typescript
submitScore(userId: string, value: number): Promise<Score>
```

**Request**:
```typescript
// From hook:
const { submitScore } = useScoreSubmission();
submitScore(25);

// From API:
await submitScore("user-123", 25);
```

**Response Success**:
```typescript
{
  id: "score-abc123",
  userId: "user-123",
  value: 25,
  date: "2024-02-15",
  createdAt: "2024-02-15T10:30:00Z"
}
```

**Response Error** (409 - Conflict):
```typescript
{
  success: false,
  error: {
    code: "DUPLICATE_SCORE",
    message: "You already submitted a score today"
  }
}
```

**Validation**:
- ✅ `value` must be 1-45
- ✅ `userId` must exist
- ✅ Max 1 score per user per day (enforced by DB constraint)
- ✅ Auto-deletes oldest score if user has >5

**Use Case**: Submit daily golf score from scorecard.

---

### Get Recent Scores
**Endpoint**: `src/api/scores.server.ts` → `getScores()`

**Function Signature**:
```typescript
getScores(userId: string): Promise<Score[]>
```

**Request**:
```typescript
// From hook:
const { data: scores } = useRecentScores(userId);

// From API:
const scores = await getScores("user-123");
```

**Response Success**:
```typescript
[
  {
    id: "score-abc123",
    userId: "user-123",
    value: 28,
    date: "2024-02-15",
    createdAt: "2024-02-15T10:30:00Z"
  },
  {
    id: "score-def456",
    userId: "user-123",
    value: 22,
    date: "2024-02-14",
    createdAt: "2024-02-14T09:15:00Z"
  }
  // ... max 5 scores, sorted DESC by date
]
```

**Use Case**: Display player's recent performance.

---

### Delete Score
**Endpoint**: `src/api/scores.server.ts` → `deleteScore()`

**Function Signature**:
```typescript
deleteScore(scoreId: string, userId: string): Promise<void>
```

**Request**:
```typescript
await deleteScore("score-abc123", "user-123");
```

**Response Success**: `204 No Content`

**Use Case**: Admin removes invalid score.

---

### Get All Scores for Draw (Admin)
**Endpoint**: `src/api/scores.server.ts` → `getAllScoresForDrawMatch()`

**Function Signature**:
```typescript
getAllScoresForDrawMatch(): Promise<{ userId: string, scores: number[] }[]>
```

**Response**:
```typescript
[
  {
    userId: "user-123",
    scores: [28, 22, 31, 25, 20]
  },
  {
    userId: "user-456",
    scores: [15, 18, 22, 26, 21]
  }
  // ... all users with scores
]
```

**Use Case**: Used internally by draw publishing to match winners.

---

## 💳 SUBSCRIPTION ENDPOINTS

### Create Checkout Session
**Endpoint**: `src/api/subscriptions.server.ts` → `createSubscriptionCheckout()`

**Function Signature**:
```typescript
createSubscriptionCheckout(
  userId: string,
  plan: "MONTHLY" | "YEARLY",
  successUrl: string,
  cancelUrl: string
): Promise<{ sessionId: string; url: string }>
```

**Request**:
```typescript
// From hook:
const { checkout } = useSubscriptionCheckout({ userId });
await checkout("MONTHLY");

// From API:
const session = await createSubscriptionCheckout(
  "user-123",
  "MONTHLY",
  "https://app.com/success",
  "https://app.com/cancel"
);
```

**Response Success**:
```typescript
{
  sessionId: "cs_test_123abc",
  url: "https://checkout.stripe.com/pay/cs_test_123abc"
}
```

**Frontend Usage**:
```typescript
// Hook handles redirect
const { checkout } = useSubscriptionCheckout();
const handleClick = async () => {
  // Automatically redirects to Stripe
  await checkout("MONTHLY");
};
```

**Use Case**: Start subscription purchase flow.

---

### Check Checkout Return
**Endpoint**: `src/hooks/useSubscriptionCheckout.ts` → `useCheckoutReturn()`

**Function Signature**:
```typescript
useCheckoutReturn(): { status: "success" | "canceled" | null }
```

**Usage**:
```typescript
const { status } = useCheckoutReturn();

if (status === "success") {
  // Show success message
} else if (status === "canceled") {
  // Show retry option
}
```

**Use Case**: Handle return from Stripe checkout page.

---

### Get User Subscriptions
**Endpoint**: `src/api/subscriptions.server.ts` → `getUserSubscriptions()`

**Function Signature**:
```typescript
getUserSubscriptions(userId: string): Promise<Subscription[]>
```

**Response**:
```typescript
[
  {
    id: "sub-abc123",
    userId: "user-123",
    stripeSubscriptionId: "sub_1234567890",
    plan: "MONTHLY",
    status: "ACTIVE",
    currentPeriodStart: "2024-01-15",
    currentPeriodEnd: "2024-02-15",
    createdAt: "2024-01-15",
    updatedAt: "2024-02-15"
  }
]
```

**Use Case**: Display user's active subscriptions.

---

### Get Single Subscription
**Endpoint**: `src/api/subscriptions.server.ts` → `getSubscription()`

**Function Signature**:
```typescript
getSubscription(subscriptionId: string): Promise<Subscription>
```

**Use Case**: Get details of specific subscription.

---

### Update Subscription (Admin)
**Endpoint**: `src/api/subscriptions.server.ts` → `updateSubscription()`

**Function Signature**:
```typescript
updateSubscription(
  subscriptionId: string,
  data: { status?: SubscriptionStatus }
): Promise<Subscription>
```

**Use Case**: Admin manually update subscription status.

---

### Cancel Subscription
**Endpoint**: `src/api/subscriptions.server.ts` → `cancelSubscription()`

**Function Signature**:
```typescript
cancelSubscription(subscriptionId: string): Promise<void>
```

**Response Success**: `204 No Content`

**Use Case**: User cancels subscription.

---

### Get All Active Subscriptions
**Endpoint**: `src/api/subscriptions.server.ts` → `getAllActiveSubscriptions()`

**Function Signature**:
```typescript
getAllActiveSubscriptions(): Promise<Subscription[]>
```

**Use Case**: Internal use for calculating prize pool.

---

### Get Subscription Statistics
**Endpoint**: `src/api/subscriptions.server.ts` → `getSubscriptionStats()`

**Response**:
```typescript
{
  total: 245,
  active: 189,
  pastDue: 15,
  canceled: 41,
  byPlan: {
    MONTHLY: 120,
    YEARLY: 69
  }
}
```

**Use Case**: Dashboard metrics display.

---

## 🎰 DRAW MANAGEMENT ENDPOINTS

### List Draws
**Endpoint**: `src/api/admin/draws.server.ts` → `listDraws()`

**Function Signature**:
```typescript
listDraws(page?: number, limit?: number): Promise<Draw[]>
```

**Response**:
```typescript
[
  {
    id: "draw-abc123",
    month: 2,
    year: 2024,
    status: "PUBLISHED",
    winningNumbers: [7, 14, 21, 28, 35],
    prizePool: 18000,
    tier1Rollover: 0,
    createdAt: "2024-01-15",
    updatedAt: "2024-02-15"
  }
]
```

**Use Case**: Display all past and current draws.

---

### Get Draw Details
**Endpoint**: `src/api/admin/draws.server.ts` → `getDraw()`

**Function Signature**:
```typescript
getDraw(drawId: string): Promise<Draw & { winnerVerifications: WinnerVerification[] }>
```

**Response**:
```typescript
{
  id: "draw-abc123",
  month: 2,
  year: 2024,
  status: "PUBLISHED",
  winningNumbers: [7, 14, 21, 28, 35],
  prizePool: 18000,
  tier1Rollover: 0,
  winnerVerifications: [
    {
      id: "verify-123",
      userId: "winner-1",
      tier: 1,
      prizeAmount: 7200,
      status: "PENDING",
      proofUrl: "https://storage.supabase.co/..."
    }
  ],
  createdAt: "2024-01-15",
  updatedAt: "2024-02-15"
}
```

**Use Case**: View full draw details including winners.

---

### Create Draw
**Endpoint**: `src/api/admin/draws.server.ts` → `createDraw()`

**Function Signature**:
```typescript
createDraw(month: number, year: number): Promise<Draw>
```

**Request**:
```typescript
const draw = await createDraw(2, 2024); // February 2024
```

**Response**:
```typescript
{
  id: "draw-new123",
  month: 2,
  year: 2024,
  status: "DRAFT",
  winningNumbers: null,
  prizePool: 0,
  tier1Rollover: 0,
  createdAt: "2024-02-01"
}
```

**Validation**:
- ✅ month: 1-12
- ✅ year: Valid future year
- ✅ Unique combination (month, year)

**Use Case**: Admin creates new monthly draw.

---

### Update Draw
**Endpoint**: `src/api/admin/draws.server.ts` → `updateDraw()`

**Function Signature**:
```typescript
updateDraw(
  drawId: string,
  data: { winningNumbers?: number[] }
): Promise<Draw>
```

**Request**:
```typescript
const updated = await updateDraw("draw-abc123", {
  winningNumbers: [7, 14, 21, 28, 35]
});
```

**Validation**:
- ✅ 5 numbers required
- ✅ Range 1-45
- ✅ All unique
- ✅ Draw must be DRAFT status

**Use Case**: Set winning numbers before publishing.

---

### Publish Draw
**Endpoint**: `src/api/admin/draws.server.ts` → `publishDraw()`

**Function Signature**:
```typescript
publishDraw(drawId: string): Promise<Draw>
```

**Request**:
```typescript
const published = await publishDraw("draw-abc123");
```

**What Happens** (All in transaction):
1. Get all users' last 5 scores
2. Calculate prize pool from active subscriptions
3. Split by tiers: 40% / 35% / 25%
4. Find winners matching winning numbers:
   - Tier 1: All 5 numbers match
   - Tier 2: 4 numbers match
   - Tier 3: 3 numbers match
5. Handle Tier 1 rollover (if no 5-match winner)
6. Create winner verification records
7. Mark draw as PUBLISHED

**Response**:
```typescript
{
  id: "draw-abc123",
  month: 2,
  year: 2024,
  status: "PUBLISHED",
  winningNumbers: [7, 14, 21, 28, 35],
  prizePool: 18000,
  tier1Rollover: 0,
  createdAt: "2024-01-15",
  updatedAt: "2024-02-15"
}
```

**Use Case**: Finalize draw, calculate winners, create payouts.

---

### Delete Draw
**Endpoint**: `src/api/admin/draws.server.ts` → `deleteDraw()`

**Function Signature**:
```typescript
deleteDraw(drawId: string): Promise<void>
```

**Restrictions**:
- Only DRAFT draws can be deleted
- Response: `204 No Content`

**Use Case**: Cancel draft draw.

---

### Get Draw Statistics
**Endpoint**: `src/api/admin/draws.server.ts` → `getDrawStats()`

**Function Signature**:
```typescript
getDrawStats(drawId: string): Promise<DrawStats>
```

**Response**:
```typescript
{
  totalWinners: 45,
  tier1: { count: 3, paid: 2, pending: 1 },
  tier2: { count: 15, paid: 12, pending: 3 },
  tier3: { count: 27, paid: 20, pending: 7 },
  totalPaid: 32,
  totalPending: 13
}
```

**Use Case**: Dashboard analytics.

---

## 🏆 WINNER VERIFICATION ENDPOINTS

### Upload Winner Proof
**Endpoint**: `src/api/admin/winners.server.ts` → `uploadWinnerVerification()`

**Function Signature**:
```typescript
uploadWinnerVerification(
  userId: string,
  drawId: string,
  file: File
): Promise<WinnerVerification>
```

**Request**:
```typescript
// From hook:
const { uploadProof } = useWinnerVerification({ userId, drawId });
await uploadProof(imageFile);

// From API:
const verification = await uploadWinnerVerification("user-123", "draw-123", file);
```

**File Requirements**:
- ✅ Type: JPEG, PNG, GIF, WebP
- ✅ Size: < 5MB
- ✅ Stored in Supabase "winner-proofs" bucket

**Response**:
```typescript
{
  id: "verify-abc123",
  userId: "user-123",
  drawId: "draw-123",
  tier: 1,
  prizeAmount: 7200,
  status: "PENDING",
  proofUrl: "https://storage.supabase.co/...",
  createdAt: "2024-02-15"
}
```

**Use Case**: Winner submits proof of win.

---

### Get Verification Details
**Endpoint**: `src/api/admin/winners.server.ts` → `getWinnerVerification()`

**Function Signature**:
```typescript
getWinnerVerification(verificationId: string): Promise<WinnerVerification>
```

**Response**:
```typescript
{
  id: "verify-abc123",
  user: {
    id: "user-123",
    email: "winner@example.com"
  },
  draw: {
    id: "draw-123",
    month: 2,
    year: 2024,
    winningNumbers: [7, 14, 21, 28, 35]
  },
  tier: 1,
  prizeAmount: 7200,
  status: "PENDING", // PENDING | APPROVED | REJECTED
  proofUrl: "https://storage.supabase.co/...",
  payoutStatus: null, // null | PROCESSING | PAID
  createdAt: "2024-02-15"
}
```

**Use Case**: Admin reviews verification details.

---

### Approve/Reject Verification
**Endpoint**: `src/api/admin/winners.server.ts` → `approveWinnerVerification()`

**Function Signature**:
```typescript
approveWinnerVerification(
  verificationId: string,
  approved: boolean
): Promise<WinnerVerification>
```

**Request**:
```typescript
// Approve
const verified = await approveWinnerVerification("verify-abc123", true);

// Reject
const rejected = await approveWinnerVerification("verify-abc123", false);
```

**On Rejection**:
- Proof image deleted from storage
- Status set to REJECTED
- Prize not paid out

**Use Case**: Admin verifies or rejects proof.

---

### Process Winner Payout
**Endpoint**: `src/api/admin/winners.server.ts` → `processWinnerPayout()`

**Function Signature**:
```typescript
processWinnerPayout(verificationId: string): Promise<WinnerVerification>
```

**Request**:
```typescript
const payout = await processWinnerPayout("verify-abc123");
```

**What Happens**:
1. Create Stripe payout to winner's connected account
2. Mark payoutStatus as PAID
3. Send confirmation email

**Response**:
```typescript
{
  id: "verify-abc123",
  userId: "user-123",
  tier: 1,
  prizeAmount: 7200,
  status: "APPROVED",
  payoutStatus: "PAID",
  stripePayoutId: "po_1234567890"
}
```

**Use Case**: Disburse prize money to winner.

---

### List Draw Winners
**Endpoint**: `src/api/admin/winners.server.ts` → `listDrawWinners()`

**Function Signature**:
```typescript
listDrawWinners(
  drawId: string,
  status?: "PENDING" | "APPROVED" | "REJECTED"
): Promise<WinnerVerification[]>
```

**Response**:
```typescript
[
  {
    id: "verify-123",
    userId: "winner-1",
    tier: 1,
    prizeAmount: 7200,
    status: "APPROVED",
    proofUrl: "https://storage.supabase.co/..."
  },
  {
    id: "verify-456",
    userId: "winner-2",
    tier: 2,
    prizeAmount: 4410,
    status: "PENDING",
    proofUrl: "https://storage.supabase.co/..."
  }
]
```

**Use Case**: View all winners for a draw.

---

### Delete Verification
**Endpoint**: `src/api/admin/winners.server.ts` → `deleteWinnerVerification()`

**Function Signature**:
```typescript
deleteWinnerVerification(verificationId: string): Promise<void>
```

**Restrictions**:
- Cannot delete if payoutStatus is PAID
- Deletes proof from storage

**Use Case**: Remove erroneous verification.

---

## 🎣 STRIPE WEBHOOK ENDPOINTS

### Main Webhook Handler
**Endpoint**: `src/api/webhooks/stripe.server.ts` → `handleStripeWebhook()`

**URL**: Configure in Stripe dashboard at:
```
https://your-domain.com/api/webhooks/stripe
```

**Events Handled**:

#### 1. `checkout.session.completed`
**When**: Customer completes payment
**Actions**:
- Create/update user in database
- Create subscription record
- Set status to ACTIVE
- Sync with Stripe

#### 2. `invoice.payment_failed`
**When**: Recurring invoice payment fails
**Actions**:
- Update subscription status to PAST_DUE
- Send retry notification to user

#### 3. `customer.subscription.updated`
**When**: Subscription changes (plan change, renewal, etc.)
**Actions**:
- Sync subscription details
- Update billing dates
- Update status

#### 4. `customer.subscription.deleted`
**When**: Subscription is deleted/canceled
**Actions**:
- Mark subscription as CANCELED
- Stop prize eligibility

**Signature Verification**:
```typescript
// Automatically verified using STRIPE_WEBHOOK_SECRET
// Prevents spoofed events
```

**Use Case**: Keep database in sync with Stripe.

---

## 🔒 AUTHENTICATION & MIDDLEWARE

### Extract Auth Token
**Function**: `src/middleware/auth.ts` → `extractAuthToken()`

```typescript
const token = extractAuthToken(headers);
// Extracts from: "Authorization: Bearer <token>"
```

---

### Require Authentication
**Function**: `src/middleware/auth.ts` → `requireAuth()`

```typescript
const user = await requireAuth(headers);
// Throws 401 if no token
// Returns decoded user object
```

---

### Require Admin Role
**Function**: `src/middleware/auth.ts` → `requireAdmin()`

```typescript
const admin = await requireAdmin(headers);
// Throws 403 if not admin
// Returns admin user object
```

---

## 📊 PRIZE CALCULATION EXAMPLES

### Example 1: Simple Draw
```
Active Subscriptions: 200
Monthly Fee: $25
Prize Pool: 200 × $25 × 0.9 = $4,500

Tier Distribution:
- Tier 1 (40%): $1,800
- Tier 2 (35%): $1,575
- Tier 3 (25%): $1,125

Results:
- 2 players match all 5 numbers (Tier 1)
- Prize per Tier 1 winner: $1,800 ÷ 2 = $900

- 5 players match 4 numbers (Tier 2)
- Prize per Tier 2 winner: $1,575 ÷ 5 = $315

- 8 players match 3 numbers (Tier 3)
- Prize per Tier 3 winner: $1,125 ÷ 8 = $140.63
```

### Example 2: Rollover
```
Tier 1 has 0 winners
Tier 1 amount ($1,800) rolls to next month

Next Month:
Previous Rollover: $1,800
New Tier 1 (40%): $1,800
Total Tier 1: $3,600
```

---

## ✅ STATUS CODES

```
200 OK              ✓ Success
201 Created         ✓ Resource created
204 No Content      ✓ Deletion successful

400 Bad Request     ✗ Invalid input
401 Unauthorized    ✗ No auth token
403 Forbidden       ✗ No permission
404 Not Found       ✗ Resource not found
409 Conflict        ✗ Duplicate score date
500 Server Error    ✗ Unexpected error
```

---

## 🧪 TESTING

### Using cURL

**Submit Score**:
```bash
curl -X POST http://localhost:5173/api/scores.server.ts \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"value": 25}'
```

**Create Checkout**:
```bash
curl -X POST http://localhost:5173/api/subscriptions.server.ts \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "MONTHLY",
    "successUrl": "https://app.com/success",
    "cancelUrl": "https://app.com/cancel"
  }'
```

**Publish Draw**:
```bash
curl -X POST http://localhost:5173/api/admin/draws.server.ts \
  -H "Authorization: Bearer YOUR_JWT_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{"drawId": "draw-123"}'
```

---

**All APIs follow consistent patterns for error handling, validation, and response formats.**
