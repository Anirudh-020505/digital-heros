import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data (careful in production!)
  // await prisma.winnerVerification.deleteMany({});
  // await prisma.draw.deleteMany({});
  // await prisma.score.deleteMany({});
  // await prisma.subscription.deleteMany({});
  // await prisma.charity.deleteMany({});
  // await prisma.user.deleteMany({});

  // Seed charities
  const charity1 = await prisma.charity.upsert({
    where: { id: "charity-1" },
    update: {},
    create: {
      id: "charity-1",
      name: "St. Jude Children's Research Hospital",
      description:
        "Fighting childhood cancer and blood disorders through research and treatment.",
      isFeatured: true,
    },
  });

  const charity2 = await prisma.charity.upsert({
    where: { id: "charity-2" },
    update: {},
    create: {
      id: "charity-2",
      name: "The First Tee",
      description:
        "Building character through golf. Youth development through the game.",
      isFeatured: true,
    },
  });

  const charity3 = await prisma.charity.upsert({
    where: { id: "charity-3" },
    update: {},
    create: {
      id: "charity-3",
      name: "Wounded Warrior Project",
      description:
        "Supporting veterans through golf and outdoor programs.",
      isFeatured: false,
    },
  });

  // Seed test users
  const user1 = await prisma.user.upsert({
    where: { email: "subscriber@test.com" },
    update: {},
    create: {
      email: "subscriber@test.com",
      role: "SUBSCRIBER",
      stripeCustomerId: "cus_test_subscriber",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      role: "ADMIN",
      stripeCustomerId: "cus_test_admin",
    },
  });

  // Seed test subscription
  await prisma.subscription.upsert({
    where: {
      userId_plan: {
        userId: user1.id,
        plan: "MONTHLY",
      },
    },
    update: {},
    create: {
      userId: user1.id,
      plan: "MONTHLY",
      status: "ACTIVE",
      stripeSubscriptionId: "sub_test_123",
    },
  });

  // Seed test scores
  const today = new Date();
  for (let i = 0; i < 3; i++) {
    const scoreDate = new Date(today);
    scoreDate.setDate(scoreDate.getDate() - i);
    scoreDate.setHours(0, 0, 0, 0); // Set to start of day

    await prisma.score.upsert({
      where: {
        userId_date: {
          userId: user1.id,
          date: scoreDate,
        },
      },
      update: {},
      create: {
        userId: user1.id,
        value: Math.floor(Math.random() * 45) + 1, // Random 1-45
        date: scoreDate,
      },
    });
  }

  // Seed test draw
  const now = new Date();
  await prisma.draw.upsert({
    where: {
      year_month: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      },
    },
    update: {},
    create: {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      status: "DRAFT",
      winningNumbers: [7, 14, 21, 28, 35],
      jackpotRollover: 0,
    },
  });

  console.log("✅ Seed completed!");
  console.log({
    charities: [charity1, charity2, charity3],
    users: [user1, user2],
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
