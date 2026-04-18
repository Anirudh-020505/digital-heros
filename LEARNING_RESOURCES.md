# 🎓 LEARNING RESOURCES & REFERENCES

## Documentation Files (In Order)

### 1. 🎬 Getting Started
- **`00_START_HERE.md`** ← **START HERE**
  - Summary of Phase 1
  - Quick overview
  - Status & next steps

### 2. ⏱️ Quick Setup
- **`QUICK_SETUP.md`** ← **15-MINUTE SETUP**
  - Supabase checklist
  - Env variables
  - Installation commands
  - Troubleshooting

### 3. 🏗️ Architecture
- **`ARCHITECTURE.md`** ← **RECOMMEND READING**
  - System architecture
  - Data flows (score, subscription, draw, verification)
  - Database diagrams
  - API endpoints
  - Prize calculations
  - Error handling

### 4. 📚 Full Guides
- **`IMPLEMENTATION_GUIDE.md`**
  - Project overview
  - Tech stack
  - File structure
  - Environment variables
  - Business logic

- **`SETUP_GUIDE.md`**
  - Detailed Supabase setup
  - Storage bucket creation
  - Stripe setup
  - Connection string guide

### 5. 📦 Reference
- **`DEPENDENCIES.md`**
  - Package list
  - Installation order
  - Verification commands

### 6. ✅ Tracking
- **`IMPLEMENTATION_CHECKLIST.md`**
  - Complete progress tracking
  - Phase-by-phase checklist
  - Status indicators

- **`PHASE_1_SUMMARY.md`**
  - Phase 1 overview
  - Files created
  - Schema explanation
  - What's next

- **`FILE_MANIFEST.md`**
  - Complete file listing
  - What each file does
  - Verification steps

### 7. 🚀 Action
- **`NEXT_STEPS.md`**
  - Visual quick reference
  - Step-by-step next actions
  - Status checklist

---

## External Resources

### Prisma
- [Prisma Docs](https://www.prisma.io/docs/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

### Supabase
- [Supabase Docs](https://supabase.com/docs)
- [Supabase PostgreSQL](https://supabase.com/docs/guides/database/overview)
- [Supabase Storage](https://supabase.com/docs/guides/storage/overview)
- [Supabase Auth](https://supabase.com/docs/guides/auth/overview)

### Stripe
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Testing](https://stripe.com/docs/testing)

### TanStack
- [TanStack Start Docs](https://tanstack.com/start)
- [React Router](https://tanstack.com/router/latest)
- [React Query](https://tanstack.com/query/latest)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Docs](https://zod.dev)

---

## Key Concepts Explained

### Score Entry
```
User submits score between 1-45
↓
System checks if score already exists for today (unique constraint)
↓
If exists: Return 409 Conflict error
↓
If new: Insert score in transaction
↓
Count user's total scores
↓
If > 5 scores: Delete oldest score (auto-cleanup)
↓
Return 200 OK with new score
```

### Prize Pool Calculation
```
Monthly Revenue Calculation:
1. Count active subscriptions
2. Multiply by subscription price ($9.99 or $99.90 yearly)
3. Total = All subscriptions × price

Prize Pool Split:
- 90% goes to winners (prize pool)
- 10% goes to charity partners (charity pool)

Prize Pool Distribution (of the 90%):
- Tier 1 (Jackpot): 40%
- Tier 2: 35%
- Tier 3: 25%

Tier 1 Rollover:
- If NO ONE matches all 5 numbers
- Tier 1 amount rolls over to next month
- Added on top of next month's Tier 1 pool
```

### Winner Matching
```
Draw creates 5 winning numbers: [7, 14, 21, 28, 35]

User has submitted these 5 scores:
- Last week: 7
- 2 weeks ago: 14
- 3 weeks ago: 15
- 4 weeks ago: 21
- 5 weeks ago: 35

Matching Logic:
- Count how many of user's last 5 scores match winning numbers
- This user has 4 matches: 7, 14, 21, 35
- Therefore: Tier 2 winner (4 matches)

Tier Requirements:
- 5 matches = Tier 1 (Jackpot)
- 4 matches = Tier 2
- 3 matches = Tier 3
- 2 or fewer = No prize
```

### Transaction Safety
```
When submitting a score, we wrap in a transaction:

BEGIN TRANSACTION
├─ Insert new score
├─ Count total scores for user
├─ If count > 5:
│  └─ DELETE oldest score by date
└─ COMMIT (all or nothing)

Benefits:
- Prevents partial updates
- Ensures data consistency
- If anything fails: full rollback
```

---

## Common Errors & Solutions

### "Cannot connect to database"
**Solution:**
1. Check DATABASE_URL format in .env.local
2. Verify password is URL-encoded (special chars: %XX)
3. Test connection in Supabase SQL Editor first
4. Ensure Supabase project is "Active" status

### "Prisma client not found"
**Solution:**
```bash
bun add @prisma/client
npx prisma generate
```

### "Port already in use"
**Solution:**
```bash
# Find process using port 5173
lsof -i :5173

# Kill process
kill -9 <PID>
```

### ".env.local not being read"
**Solution:**
1. Ensure file is at project root (not in src/)
2. Verify filename is exactly `.env.local` (not `.env`)
3. Restart dev server after creating file
4. Check that `.env.local` is in `.gitignore`

---

## Testing & Verification

### Verify Database Connection
```bash
# Test connection
bun run db:push --dry-run

# View schema
bunx prisma introspect

# Open visual editor
bun run db:studio
```

### Verify Seed Data
```bash
# Seed test data
bun run db:seed

# Check data in studio
bun run db:studio
# Navigate to tables and verify 20+ records
```

### Verify Stripe Connection
```bash
# (After generating Phase 2)
# Check webhook secret
echo $STRIPE_WEBHOOK_SECRET

# Test with Stripe CLI:
stripe listen --forward-to localhost:5173/api/webhooks/stripe
```

---

## Development Workflow

### Daily Development
```bash
# 1. Start dev server
bun run dev

# 2. In another terminal, watch database changes
bun run db:studio

# 3. Code your API routes
# (Phase 2 files will be in src/api/)

# 4. Test your endpoints
# Use tools like: Postman, Insomnia, curl, or VS Code REST Client

# 5. Check code quality
bun run lint
bun run format
```

### Making Database Changes
```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
bun run db:migrate --name describe_your_change

# 3. Verify in studio
bun run db:studio

# 4. If needed, reset (DEV ONLY):
bunx prisma migrate reset
```

### Deploying
```bash
# 1. Build for production
bun run build

# 2. Verify no errors
bun run lint

# 3. Set production env vars
# (Update .env.production or CI/CD secrets)

# 4. Deploy (depends on your host)
# (Vercel, Netlify, Railway, etc.)
```

---

## Debugging Tips

### Enable SQL Logging
```typescript
// In src/lib/prisma.ts, set:
new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
```

### Use Prisma Studio for Data Inspection
```bash
bun run db:studio
# Opens visual database editor at http://localhost:5555
```

### Check TypeScript Types
```bash
# Check for type errors
bunx tsc --noEmit
```

### Debug API Requests
```bash
# Use curl to test endpoints
curl -X POST http://localhost:5173/api/scores \
  -H "Content-Type: application/json" \
  -d '{"value": 25}'

# Or use VS Code REST Client extension
# Create file: requests.http
POST http://localhost:5173/api/scores
Content-Type: application/json

{
  "value": 25
}
```

---

## Performance Optimization

### Database Queries
- Use selective fields (don't select *all columns)
- Add indexes on frequently queried fields
- Use pagination for large result sets

### Caching Strategy
- Cache user's last 5 scores
- Cache draw information
- Invalidate on updates

### Rate Limiting
- Limit score submissions (1 per minute per user)
- Limit webhook processing
- Add request queuing

---

## Security Checklist

- [ ] Never commit `.env.local`
- [ ] Never log sensitive data
- [ ] Always verify Stripe webhooks
- [ ] Validate all user inputs
- [ ] Use prepared statements (Prisma does this)
- [ ] Implement rate limiting
- [ ] Use HTTPS in production
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Implement request timeouts

---

## Quick Reference: Commands

```bash
# Setup
bun install
bun add prisma @prisma/client stripe @supabase/supabase-js zod
bun add -D tsx @types/node

# Database
bun run db:push              # Create/update tables
bun run db:migrate           # Run migrations
bun run db:seed              # Populate test data
bun run db:studio            # Visual editor (http://localhost:5555)

# Development
bun run dev                  # Start dev server (http://localhost:5173)
bun run lint                 # Check code quality
bun run format               # Auto-format code
bun run build                # Build for production
bun run preview              # Preview production build

# Useful Prisma commands
npx prisma generate         # Regenerate Prisma client
npx prisma introspect       # Introspect database
npx prisma db push          # Push schema to database
npx prisma migrate reset    # Reset database (dev only)
```

---

## Next Steps

1. **Read**: `00_START_HERE.md` (5 min)
2. **Read**: `QUICK_SETUP.md` (10 min)
3. **Setup**: Supabase (15 min)
4. **Install**: Dependencies (3 min)
5. **Run**: Migrations (2 min)
6. **Say**: "Supabase ready" ✨

**Total: 35 minutes to ready state**

Then I'll generate all PHASE 2 API routes! 🚀

---

**Happy coding!** 🎉
