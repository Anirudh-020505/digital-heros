// datasource config for Prisma migrations
// Connection URL is handled via DATABASE_URL environment variable
export const config = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres:DigitalHeros125@db.afsyzqlikjwpoditqulz.supabase.co:6543/postgres?schema=public",
    },
  },
};

