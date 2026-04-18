// src/api/subscriptions.server.ts - Subscription management

import { prisma } from "../lib/prisma";
import { stripe, createCheckoutSession, getOrCreateStripeCustomer, STRIPE_PRICE_MONTHLY, STRIPE_PRICE_YEARLY } from "../lib/stripe";
import { validateRequest, checkoutSessionSchema, ApiErrors } from "../lib/validation";

/**
 * POST - Create Stripe checkout session
 */
export async function createSubscriptionCheckout(
  userId: string,
  plan: "MONTHLY" | "YEARLY",
  successUrl: string,
  cancelUrl: string
) {
  try {
    // Validate plan
    const validated = await validateRequest(checkoutSessionSchema, { plan });

    // Get user
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw ApiErrors.NOT_FOUND("User");
    }

    // Get or create Stripe customer
    const customer = await getOrCreateStripeCustomer(
      user.email,
      user.stripeCustomerId || undefined
    );

    // Update user with Stripe customer ID if new
    if (!user.stripeCustomerId) {
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customer.id },
      });
    }

    // Create checkout session
    const priceId =
      validated.plan === "MONTHLY"
        ? process.env.STRIPE_PRICE_MONTHLY_ID
        : process.env.STRIPE_PRICE_YEARLY_ID;

    if (!priceId) {
      throw ApiErrors.VALIDATION_ERROR(
        `Price ID not configured for ${validated.plan}`
      );
    }

    const session = await createCheckoutSession({
      customerId: customer.id,
      priceId,
      successUrl,
      cancelUrl,
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * GET - Get user's current subscriptions
 */
export async function getUserSubscriptions(userId: string) {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return subscriptions;
  } catch (error) {
    throw ApiErrors.INTERNAL_ERROR();
  }
}

/**
 * GET - Get specific subscription
 */
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });

    if (!subscription) {
      throw ApiErrors.NOT_FOUND("Subscription");
    }

    return subscription;
  } catch (error) {
    throw error;
  }
}

/**
 * PATCH - Update subscription (admin only)
 */
export async function updateSubscription(
  subscriptionId: string,
  data: { status?: string }
) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw ApiErrors.NOT_FOUND("Subscription");
    }

    // Validate status
    const validStatuses = ["ACTIVE", "PAST_DUE", "CANCELED"];
    if (data.status && !validStatuses.includes(data.status)) {
      throw ApiErrors.VALIDATION_ERROR("Invalid subscription status");
    }

    const updated = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: data.status as any,
      },
    });

    return updated;
  } catch (error) {
    throw error;
  }
}

/**
 * DELETE - Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw ApiErrors.NOT_FOUND("Subscription");
    }

    if (subscription.stripeSubscriptionId) {
      try {
        // Cancel in Stripe
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      } catch (stripeErr) {
        console.error("Failed to cancel Stripe subscription:", stripeErr);
        // Continue - we still want to update our database
      }
    }

    // Update in database
    const updated = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: "CANCELED" },
    });

    return updated;
  } catch (error) {
    throw error;
  }
}

/**
 * GET - Get all active subscriptions (admin - for draw calculation)
 */
export async function getAllActiveSubscriptions() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { status: "ACTIVE" },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });

    return subscriptions;
  } catch (error) {
    throw ApiErrors.INTERNAL_ERROR();
  }
}

/**
 * GET - Get subscription stats
 */
export async function getSubscriptionStats() {
  try {
    const [total, active, pastDue, canceled] = await Promise.all([
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.subscription.count({ where: { status: "PAST_DUE" } }),
      prisma.subscription.count({ where: { status: "CANCELED" } }),
    ]);

    const [monthlyActive, yearlyActive] = await Promise.all([
      prisma.subscription.count({
        where: { status: "ACTIVE", plan: "MONTHLY" },
      }),
      prisma.subscription.count({
        where: { status: "ACTIVE", plan: "YEARLY" },
      }),
    ]);

    return {
      total,
      byStatus: { active, pastDue, canceled },
      byPlan: { monthly: monthlyActive, yearly: yearlyActive },
    };
  } catch (error) {
    throw ApiErrors.INTERNAL_ERROR();
  }
}
