// src/api/webhooks/stripe.server.ts - Stripe webhook handler

import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe, verifyStripeWebhookSignature } from "../../lib/stripe";
import { ApiErrors } from "../../lib/validation";

/**
 * Handle Stripe webhook events
 * Verifies signature and routes to appropriate handler
 */
export async function handleStripeWebhook(
  body: string | Buffer,
  signature: string
) {
  try {
    // Verify webhook signature
    const event = verifyStripeWebhookSignature(body, signature);

    switch (event.type) {
      case "checkout.session.completed":
        return handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );

      case "invoice.payment_failed":
        return handleInvoicePaymentFailed(
          event.data.object as Stripe.Invoice
        );

      case "customer.subscription.updated":
        return handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );

      case "customer.subscription.deleted":
        return handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );

      default:
        // Silently ignore other events
        return { success: true, message: "Event ignored" };
    }
  } catch (error) {
    console.error("Stripe webhook error:", error);
    throw ApiErrors.STRIPE_ERROR(
      error instanceof Error ? error.message : "Webhook verification failed"
    );
  }
}

/**
 * Handle checkout.session.completed - User completed subscription payment
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!customerId || !subscriptionId) {
    throw new Error("Missing customer or subscription ID");
  }

  // Get subscription details to determine plan
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Get customer email
  const customer = await stripe.customers.retrieve(customerId);
  const email = (customer as Stripe.Customer).email;

  if (!email) {
    throw new Error("Customer has no email");
  }

  // Get or create user
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        role: "SUBSCRIBER",
        stripeCustomerId: customerId,
      },
    });
  } else {
    // Update Stripe customer ID if not set
    if (!user.stripeCustomerId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }
  }

  // Determine plan from subscription items
  const plan =
    subscription.items.data[0]?.plan?.interval === "year" ? "YEARLY" : "MONTHLY";

  // Create or update subscription
  await prisma.subscription.upsert({
    where: { userId_plan: { userId: user.id, plan } },
    create: {
      userId: user.id,
      plan,
      status: "ACTIVE",
      stripeSubscriptionId: subscriptionId,
    },
    update: {
      status: "ACTIVE",
      stripeSubscriptionId: subscriptionId,
    },
  });

  return {
    success: true,
    message: "Subscription created",
    userId: user.id,
  };
}

/**
 * Handle invoice.payment_failed - Subscription payment failed
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    return { success: true, message: "No subscription ID" };
  }

  // Find subscription
  const subscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!subscription) {
    return { success: true, message: "Subscription not found" };
  }

  // Update status to PAST_DUE
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { status: "PAST_DUE" },
  });

  return {
    success: true,
    message: "Subscription marked as past due",
    subscriptionId: subscription.id,
  };
}

/**
 * Handle customer.subscription.updated - Subscription changes
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;

  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!existing) {
    return { success: true, message: "Subscription not found" };
  }

  // Determine status from subscription
  let status: "ACTIVE" | "PAST_DUE" | "CANCELED" = "ACTIVE";
  if (subscription.status === "past_due") status = "PAST_DUE";
  else if (subscription.status === "canceled") status = "CANCELED";

  // Update subscription
  await prisma.subscription.update({
    where: { id: existing.id },
    data: { status },
  });

  return {
    success: true,
    message: "Subscription updated",
    status,
  };
}

/**
 * Handle customer.subscription.deleted - Subscription canceled
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;

  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!existing) {
    return { success: true, message: "Subscription not found" };
  }

  // Mark as CANCELED
  await prisma.subscription.update({
    where: { id: existing.id },
    data: { status: "CANCELED" },
  });

  return {
    success: true,
    message: "Subscription canceled",
    subscriptionId: existing.id,
  };
}
