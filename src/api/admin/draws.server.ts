// src/api/admin/draws.server.ts - Draw management (CRUD)

import { prisma } from "../../lib/prisma";
import { validateRequest, publishDrawSchema, ApiErrors } from "../../lib/validation";
import {
  calculatePrizePool,
  splitPrizePool,
  findWinnersByTier,
  calculateDistribution,
  createWinnerVerifications,
  validateWinningNumbers,
} from "../../lib/helpers/draw-engine";

/**
 * GET - List all draws (with pagination)
 */
export async function listDraws(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;

    const [draws, total] = await Promise.all([
      prisma.draw.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.draw.count(),
    ]);

    return {
      data: draws,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw ApiErrors.INTERNAL_ERROR();
  }
}

/**
 * GET - Get a specific draw
 */
export async function getDraw(drawId: string) {
  try {
    const draw = await prisma.draw.findUnique({
      where: { id: drawId },
      include: {
        winnerVerifications: {
          include: {
            user: {
              select: { id: true, email: true },
            },
          },
        },
      },
    });

    if (!draw) {
      throw ApiErrors.NOT_FOUND("Draw");
    }

    return draw;
  } catch (error) {
    throw error;
  }
}

/**
 * POST - Create a new draft draw
 */
export async function createDraw(month: number, year: number) {
  try {
    // Validate month (1-12)
    if (month < 1 || month > 12) {
      throw ApiErrors.VALIDATION_ERROR("Month must be between 1 and 12");
    }

    // Check if draw already exists for this month/year
    const existing = await prisma.draw.findUnique({
      where: { year_month: { year, month } },
    });

    if (existing) {
      throw ApiErrors.CONFLICT(
        `Draw already exists for ${year}-${month.toString().padStart(2, "0")}`
      );
    }

    // Create draft draw
    const draw = await prisma.draw.create({
      data: {
        year,
        month,
        status: "DRAFT",
        winningNumbers: [], // Empty until published
        jackpotRollover: 0,
      },
    });

    return draw;
  } catch (error) {
    throw error;
  }
}

/**
 * PATCH - Update a draft draw
 */
export async function updateDraw(
  drawId: string,
  data: { winningNumbers?: number[] }
) {
  try {
    const draw = await prisma.draw.findUnique({ where: { id: drawId } });

    if (!draw) {
      throw ApiErrors.NOT_FOUND("Draw");
    }

    if (draw.status !== "DRAFT") {
      throw ApiErrors.CONFLICT("Can only update draft draws");
    }

    const updates: any = {};

    if (data.winningNumbers) {
      if (!validateWinningNumbers(data.winningNumbers)) {
        throw ApiErrors.VALIDATION_ERROR(
          "Winning numbers must be 5 unique numbers between 1 and 45"
        );
      }
      updates.winningNumbers = data.winningNumbers;
    }

    const updated = await prisma.draw.update({
      where: { id: drawId },
      data: updates,
    });

    return updated;
  } catch (error) {
    throw error;
  }
}

/**
 * DELETE - Delete a draft draw
 */
export async function deleteDraw(drawId: string) {
  try {
    const draw = await prisma.draw.findUnique({ where: { id: drawId } });

    if (!draw) {
      throw ApiErrors.NOT_FOUND("Draw");
    }

    if (draw.status !== "DRAFT") {
      throw ApiErrors.CONFLICT("Can only delete draft draws");
    }

    await prisma.draw.delete({ where: { id: drawId } });

    return { success: true, id: drawId };
  } catch (error) {
    throw error;
  }
}

/**
 * POST - Publish draw and calculate winners
 * Main business logic: Prize calculation, winner matching, distribution
 */
export async function publishDraw(drawId: string) {
  try {
    const draw = await prisma.draw.findUnique({ where: { id: drawId } });

    if (!draw) {
      throw ApiErrors.NOT_FOUND("Draw");
    }

    if (draw.status === "PUBLISHED") {
      throw ApiErrors.CONFLICT("Draw already published");
    }

    if (!draw.winningNumbers || draw.winningNumbers.length === 0) {
      throw ApiErrors.VALIDATION_ERROR("Winning numbers not set");
    }

    // Validate winning numbers
    if (!validateWinningNumbers(draw.winningNumbers)) {
      throw ApiErrors.VALIDATION_ERROR("Invalid winning numbers");
    }

    // Execute in transaction
    const published = await prisma.$transaction(async (tx) => {
      // 1. Calculate prize pool from active subscriptions
      const { totalRevenue, prizePool, charityPool } =
        await calculatePrizePool();

      // 2. Split prize pool into tiers (40% / 35% / 25%)
      const tierPrizes = splitPrizePool(prizePool, draw.jackpotRollover);

      // 3. Find all users and match scores against winning numbers
      const winnersByTier = await findWinnersByTier(draw.winningNumbers);

      // 4. Calculate distribution and check for rollover
      const { distribution, tier1Rollover } = calculateDistribution(
        winnersByTier,
        tierPrizes
      );

      // 5. Create winner verification records
      await createWinnerVerifications(drawId, winnersByTier);

      // 6. Update draw status to PUBLISHED
      const updatedDraw = await tx.draw.update({
        where: { id: drawId },
        data: {
          status: "PUBLISHED",
          jackpotRollover: tier1Rollover, // Carry forward to next month
        },
      });

      return {
        draw: updatedDraw,
        financials: {
          totalRevenue,
          prizePool,
          charityPool,
        },
        distribution,
        winnerCount: Array.from(winnersByTier.values()).reduce(
          (sum, winners) => sum + winners.length,
          0
        ),
      };
    });

    return published;
  } catch (error) {
    throw error;
  }
}

/**
 * Get draw statistics
 */
export async function getDrawStats(drawId: string) {
  try {
    const draw = await prisma.draw.findUnique({
      where: { id: drawId },
      include: {
        winnerVerifications: true,
      },
    });

    if (!draw) {
      throw ApiErrors.NOT_FOUND("Draw");
    }

    const stats = {
      totalWinners: draw.winnerVerifications.length,
      pendingVerifications: draw.winnerVerifications.filter(
        (w) => w.status === "PENDING"
      ).length,
      approvedWinners: draw.winnerVerifications.filter(
        (w) => w.status === "APPROVED"
      ).length,
      rejectedWinners: draw.winnerVerifications.filter(
        (w) => w.status === "REJECTED"
      ).length,
      paidOut: draw.winnerVerifications.filter(
        (w) => w.payoutStatus === "PAID"
      ).length,
      jackpotRollover: draw.jackpotRollover,
    };

    return stats;
  } catch (error) {
    throw ApiErrors.INTERNAL_ERROR();
  }
}
