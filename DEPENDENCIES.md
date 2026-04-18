# Backend Dependencies to Install

Run this command to install all required backend packages:

```bash
bun add prisma @prisma/client stripe @supabase/supabase-js zod
bun add -D tsx @types/node
```

## Package Breakdown

### Core ORM & Database
- `prisma` - Modern ORM for database migrations
- `@prisma/client` - Prisma client for database operations

### Payment Processing
- `stripe` - Stripe SDK for payment handling

### Database Client
- `@supabase/supabase-js` - Supabase client for auth, storage, realtime

### Validation
- `zod` - Schema validation (you already have this!)

### Development Tools
- `tsx` - Run TypeScript files directly
- `@types/node` - Node.js type definitions

## Installation Order

1. **First, install core packages:**
   ```bash
   bun add prisma @prisma/client
   ```

2. **Then install remaining packages:**
   ```bash
   bun add stripe @supabase/supabase-js zod
   bun add -D tsx @types/node
   ```

3. **Update package.json scripts (already done):**
   ```json
   {
     "db:migrate": "prisma migrate dev",
     "db:seed": "tsx prisma/seed.ts",
     "db:studio": "prisma studio",
     "db:push": "prisma db push"
   }
   ```

## Verify Installation

```bash
# Check Prisma is installed
bunx prisma --version

# Test database connection
bun run db:push

# View data with Prisma Studio
bun run db:studio
```

## Next Steps

Once all packages are installed:

1. Create `.env.local` with DATABASE_URL
2. Run `bun run db:push` (or `bun run db:migrate`)
3. Optionally run `bun run db:seed` for test data
4. Say "Supabase ready" to proceed to PHASE 2
