// src/api/admin/winners.server.ts - Winner verification management

import { prisma } from "../../lib/prisma";
import { uploadWinnerProof, deleteWinnerProof } from "../../lib/supabase";
import { stripe } from "../../lib/stripe";
import { ApiErrors } from "../../lib/validation";

/**
 * POST - Upload winner proof screenshot to Supabase Storage
 */
export async function uploadWinnerVerification(
  userId: string,
  drawId: string,
  file: File
) {
  try {
    // Validate file
    if (!file) {
      throw ApiErrors.VALIDATION_ERROR("File is required");
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw ApiErrors.VALIDATION_ERROR("File size must be under 5MB");
    }

    // Check file type (images only)
    if (!file.type.startsWith("image/")) {
      throw ApiErrors.VALIDATION_ERROR("Only image files are allowed");
    }

    // Check verification exists
    const verification = await prisma.winnerVerification.findUnique({
      where: { userId_drawId: { userId, drawId } },
    });

    if (!verification) {
      throw ApiErrors.NOT_FOUND("Winner verification");
    }

    if (verification.status !== "PENDING") {
      throw ApiErrors.CONFLICT("Verification already processed");
    }

    // Upload to Supabase Storage
    const publicUrl = await uploadWinnerProof(userId, file);

    // Update verification with proof URL
    const updated = await prisma.winnerVerification.update({
      where: { id: verification.id },
      data: { proofUrl: publicUrl },
    });

    return {
      id: updated.id,
      proofUrl: publicUrl,
      status: updated.status,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * PATCH - Approve or reject winner verification
 */
export async function approveWinnerVerification(
  verificationId: string,
  approved: boolean
) {
  try {
    const verification = await prisma.winnerVerification.findUnique({
      where: { id: verificationId },
      include: { user: true, draw: true },
    });

    if (!verification) {
      throw ApiErrors.NOT_FOUND("Winner verification");
    }

    if (verification.status !== "PENDING") {
      throw ApiErrors.CONFLICT("Verification already processed");
    }

    const newStatus = approved ? "APPROVED" : "REJECTED";

    // If rejected, delete proof from storage
    if (!approved && verification.proofUrl) {
      try {
        await deleteWinnerProof(verification.proofUrl);
      } catch (err) {
        console.error("Failed to delete proof file:", err);
        // Don't fail the operation if file deletion fails
      }
    }

    const updated = await prisma.winnerVerification.update({
      where: { id: verificationId },
      data: {
        status: newStatus as any,
        proofUrl: !approved ? "" : verification.proofUrl, // Clear proof if rejected
      },
    });

    return updated;
  } catch (error) {
    throw error;
  }
}

/**
 * POST - Process payout for approved winner
 */
export async function processWinnerPayout(verificationId: string) {
  try {
    const verification = await prisma.winnerVerification.findUnique({
      where: { id: verificationId },
      include: { user: true },
    });

    if (!verification) {
      throw ApiErrors.NOT_FOUND("Winner verification");
    }

    if (verification.status !== "APPROVED") {
      throw ApiErrors.CONFLICT(
        "Only approved verifications can be paid out"
      );
    }

    if (verification.payoutStatus === "PAID") {
      throw ApiErrors.CONFLICT("Payout already processed");
    }

    // Get user's Stripe customer ID
    const user = verification.user;
    if (!user.stripeCustomerId) {
      throw ApiErrors.CONFLICT(
        "User does not have Stripe account linked"
      );
    }

    // Calculate payout amount (this would come from draw calculation)
    // For now, this is a placeholder - in production, store the payout amount
    // when creating the verification
    const amount = 0; // TODO: Get from draw/tier calculation

    if (amount <= 0) {
      throw ApiErrors.VALIDATION_ERROR("Invalid payout amount");
    }

    try {
      // Create Stripe payout to customer
      const payout = await stripe.payouts.create({
        amount,
        currency: "usd",
        destination: user.stripeCustomerId,
      } as any);

      // Update verification to mark as paid
      const updated = await prisma.winnerVerification.update({
        where: { id: verificationId },
        data: {
          payoutStatus: "PAID",
        },
      });

      return {
        ...updated,
        stripePayoutId: payout.id,
      };
    } catch (stripeError) {
      throw ApiErrors.STRIPE_ERROR(
        stripeError instanceof Error
          ? stripeError.message
          : "Payout processing failed"
      );
    }
  } catch (error) {
    throw error;
  }
}

/**
 * GET - Get winner verification details
 */
export async function getWinnerVerification(verificationId: string) {
  try {
    const verification = await prisma.winnerVerification.findUnique({
      where: { id: verificationId },
      include: {
        user: {
          select: { id: true, email: true },
        },
        draw: {
          select: { id: true, month: true, year: true, winningNumbers: true },
        },
      },
    });

    if (!verification) {
      throw ApiErrors.NOT_FOUND("Winner verification");
    }

    return verification;
  } catch (error) {
    throw error;
  }
}

/**
 * GET - List winner verifications for a draw
 */
export async function listDrawWinners(drawId: string, status?: string) {
  try {
    const where: any = { drawId };

    if (status) {
      where.status = status;
    }

    const verifications = await prisma.winnerVerification.findMany({
      where,
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return verifications;
  } catch (error) {
    throw ApiErrors.INTERNAL_ERROR();
  }
}

/**
 * DELETE - Delete a verification (admin only, draft only)
 */
export async function deleteWinnerVerification(verificationId: string) {
  try {
    const verification = await prisma.winnerVerification.findUnique({
      where: { id: verificationId },
    });

    if (!verification) {
      throw ApiErrors.NOT_FOUND("Winner verification");
    }

    // Only allow deletion if not approved/paid
    if (verification.status === "APPROVED" && verification.payoutStatus === "PAID") {
      throw ApiErrors.CONFLICT("Cannot delete paid-out verifications");
    }

    // Delete proof from storage if exists
    if (verification.proofUrl) {
      try {
        await deleteWinnerProof(verification.proofUrl);
      } catch (err) {
        console.error("Failed to delete proof file:", err);
      }
    }

    await prisma.winnerVerification.delete({ where: { id: verificationId } });

    return { success: true, id: verificationId };
  } catch (error) {
    throw error;
  }
}
