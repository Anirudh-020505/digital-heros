// src/lib/helpers/draw-engine.ts - Core draw calculation logic

import { prisma } from "../prisma";
import type { Draw, Score } from "@prisma/client";

interface WinnerMatch {
  userId: string;
  matchCount: number;
  scores: Score[];
}

interface TierDistribution {
  tier: 1 | 2 | 3;
  prizeAmount: number;
  winnerCount: number;
  amountPerWinner: number;
}

/**
 * Calculate the total prize pool from active subscriptions
 */
export async function calculatePrizePool(): Promise<{
  totalRevenue: number;
  prizePool: number;
  charityPool: number;
}> {
  // Get count of active subscriptions
  const activeMonthly = await prisma.subscription.count({
    where: { status: "ACTIVE", plan: "MONTHLY" },
  });

  const activeYearly = await prisma.subscription.count({
    where: { status: "ACTIVE", plan: "YEARLY" },
  });

  // Revenue calculation (prices in cents, convert to dollars)
  const monthlyPrice = parseInt(process.env.STRIPE_PRICE_MONTHLY || "999") / 100; // $9.99
  const yearlyPrice = parseInt(process.env.STRIPE_PRICE_YEARLY || "9990") / 100; // $99.90

  // Monthly revenue (annualize yearly)
  const totalRevenue =
    activeMonthly * monthlyPrice + activeYearly * (yearlyPrice / 12);

  // Split: 90% to prizes, 10% to charity
  const charityPercentage =
    parseInt(process.env.CHARITY_POOL_PERCENTAGE || "10") / 100;
  const charityPool = totalRevenue * charityPercentage;
  const prizePool = totalRevenue * (1 - charityPercentage);

  return { totalRevenue, prizePool, charityPool };
}

/**
 * Split prize pool into tiers: 40% Tier 1, 35% Tier 2, 25% Tier 3
 */
export function splitPrizePool(
  prizePool: number,
  tier1Rollover: number
): Record<1 | 2 | 3, number> {
  const tier1 = prizePool * 0.4 + tier1Rollover; // 40% + any rollover
  const tier2 = prizePool * 0.35; // 35%
  const tier3 = prizePool * 0.25; // 25%

  return { 1: tier1, 2: tier2, 3: tier3 };
}

/**
 * Find all users' last 5 scores and match against winning numbers
 */
export async function findWinnersByTier(
  winningNumbers: number[]
): Promise<Map<1 | 2 | 3, WinnerMatch[]>> {
  // Get all users with scores (last 5)
  const users = await prisma.user.findMany({
    include: {
      scores: {
        orderBy: { date: "desc" },
        take: 5,
      },
    },
  });

  const winnersByTier = new Map<1 | 2 | 3, WinnerMatch[]>();
  winnersByTier.set(1, []); // 5 matches
  winnersByTier.set(2, []); // 4 matches
  winnersByTier.set(3, []); // 3 matches

  // Check each user's scores against winning numbers
  for (const user of users) {
    if (user.scores.length === 0) continue;

    // Count matches
    const userScoreValues = user.scores.map((s) => s.value);
    const matchCount = userScoreValues.filter((score) =>
      winningNumbers.includes(score)
    ).length;

    // Determine tier (5 matches = Tier 1, 4 = Tier 2, 3 = Tier 3)
    let tier: 1 | 2 | 3 | null = null;
    if (matchCount === 5) tier = 1;
    else if (matchCount === 4) tier = 2;
    else if (matchCount === 3) tier = 3;

    if (tier) {
      winnersByTier.get(tier)!.push({
        userId: user.id,
        matchCount,
        scores: user.scores,
      });
    }
  }

  return winnersByTier;
}

/**
 * Calculate distribution: if Tier 1 has no winners, return rollover amount
 */
export function calculateDistribution(
  winnersByTier: Map<1 | 2 | 3, WinnerMatch[]>,
  tierPrizes: Record<1 | 2 | 3, number>
): {
  distribution: TierDistribution[];
  tier1Rollover: number;
} {
  const distribution: TierDistribution[] = [];
  let tier1Rollover = 0;

  // Tier 1
  const tier1Winners = winnersByTier.get(1) || [];
  if (tier1Winners.length === 0) {
    // No winners in Tier 1 - rollover the prize to next month
    tier1Rollover = tierPrizes[1];
  } else {
    const amountPerWinner = tierPrizes[1] / tier1Winners.length;
    distribution.push({
      tier: 1,
      prizeAmount: tierPrizes[1],
      winnerCount: tier1Winners.length,
      amountPerWinner,
    });
  }

  // Tier 2
  const tier2Winners = winnersByTier.get(2) || [];
  if (tier2Winners.length > 0) {
    const amountPerWinner = tierPrizes[2] / tier2Winners.length;
    distribution.push({
      tier: 2,
      prizeAmount: tierPrizes[2],
      winnerCount: tier2Winners.length,
      amountPerWinner,
    });
  }

  // Tier 3
  const tier3Winners = winnersByTier.get(3) || [];
  if (tier3Winners.length > 0) {
    const amountPerWinner = tierPrizes[3] / tier3Winners.length;
    distribution.push({
      tier: 3,
      prizeAmount: tierPrizes[3],
      winnerCount: tier3Winners.length,
      amountPerWinner,
    });
  }

  return { distribution, tier1Rollover };
}

/**
 * Create winner verification records for all winners
 */
export async function createWinnerVerifications(
  drawId: string,
  winnersByTier: Map<1 | 2 | 3, WinnerMatch[]>
): Promise<string[]> {
  const allWinners = [
    ...new Set([
      ...(winnersByTier.get(1) || []),
      ...(winnersByTier.get(2) || []),
      ...(winnersByTier.get(3) || []),
    ].map((w) => w.userId)),
  ];

  const verifications = await Promise.all(
    allWinners.map((userId) =>
      prisma.winnerVerification.create({
        data: {
          userId,
          drawId,
          proofUrl: "", // Empty initially, user uploads later
          status: "PENDING",
          payoutStatus: "PENDING",
        },
      })
    )
  );

  return verifications.map((v) => v.id);
}

/**
 * Get detailed winner information for a draw
 */
export async function getDrawWinners(drawId: string) {
  const verifications = await prisma.winnerVerification.findMany({
    where: { drawId },
    include: {
      user: {
        select: { id: true, email: true },
      },
    },
  });

  return verifications;
}

/**
 * Validate winning numbers are 5 unique numbers between 1-45
 */
export function validateWinningNumbers(numbers: number[]): boolean {
  if (numbers.length !== 5) return false;
  if (new Set(numbers).size !== 5) return false; // Must be unique
  return numbers.every((n) => n >= 1 && n <= 45);
}

/**
 * Calculate total prize for a winner based on their tier and distribution
 */
export function calculateWinnerPrize(
  distribution: TierDistribution[],
  tier: 1 | 2 | 3
): number {
  const tierDist = distribution.find((d) => d.tier === tier);
  return tierDist ? tierDist.amountPerWinner : 0;
}
