// src/api/scores.server.ts - Score management server functions

import { prisma } from "../lib/prisma";
import { validateRequest } from "../lib/validation";
import { scoreEntrySchema } from "../lib/validation";
import { ApiErrors } from "../lib/validation";

interface ScoreResponse {
  id: string;
  value: number;
  date: string;
  createdAt: string;
}

/**
 * POST - Submit a golf score (1-45)
 * Auto-deletes oldest score if user has >5 scores
 * Validates unique [userId, date] constraint
 */
export async function submitScore(userId: string, value: number) {
  try {
    // Validate score is 1-45
    const validated = await validateRequest(scoreEntrySchema, { value });

    // Use today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if score already exists for today (unique constraint)
    const existingScore = await prisma.score.findFirst({
      where: {
        userId,
        date: {
          gte: new Date(today),
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existingScore) {
      throw ApiErrors.CONFLICT(
        `Score already submitted for today (${today.toISOString().split("T")[0]})`
      );
    }

    // Begin transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Insert new score
      const score = await tx.score.create({
        data: {
          userId,
          value: validated.value,
          date: today,
        },
      });

      // 2. Count total scores for user
      const scoreCount = await tx.score.count({ where: { userId } });

      // 3. If >5 scores, delete oldest
      if (scoreCount > 5) {
        const oldestScore = await tx.score.findFirst({
          where: { userId },
          orderBy: { date: "asc" },
        });

        if (oldestScore) {
          await tx.score.delete({ where: { id: oldestScore.id } });
        }
      }

      return score;
    });

    return {
      id: result.id,
      value: result.value,
      date: result.date.toISOString().split("T")[0],
      createdAt: result.createdAt.toISOString(),
    } as ScoreResponse;
  } catch (error) {
    throw error;
  }
}

/**
 * GET - Fetch user's last 5 scores ordered by date descending
 */
export async function getScores(userId: string) {
  try {
    const scores = await prisma.score.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
    });

    return scores.map((s) => ({
      id: s.id,
      value: s.value,
      date: s.date.toISOString().split("T")[0],
      createdAt: s.createdAt.toISOString(),
    })) as ScoreResponse[];
  } catch (error) {
    throw ApiErrors.INTERNAL_ERROR();
  }
}

/**
 * DELETE - Delete a specific score (for admin or user's own score)
 */
export async function deleteScore(scoreId: string, userId: string) {
  try {
    const score = await prisma.score.findUnique({ where: { id: scoreId } });

    if (!score) {
      throw ApiErrors.NOT_FOUND("Score");
    }

    if (score.userId !== userId) {
      throw ApiErrors.FORBIDDEN();
    }

    await prisma.score.delete({ where: { id: scoreId } });

    return { success: true, id: scoreId };
  } catch (error) {
    throw error;
  }
}

/**
 * GET - Get all users' scores (admin only - for draw matching)
 */
export async function getAllScoresForDrawMatch() {
  try {
    const users = await prisma.user.findMany({
      include: {
        scores: {
          orderBy: { date: "desc" },
          take: 5,
        },
      },
    });

    return users;
  } catch (error) {
    throw ApiErrors.INTERNAL_ERROR();
  }
}
