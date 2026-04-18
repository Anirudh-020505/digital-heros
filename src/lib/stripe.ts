// src/lib/stripe.ts - Stripe configuration and utilities

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const STRIPE_PRICE_MONTHLY = parseInt(
  process.env.STRIPE_PRICE_MONTHLY || "999"
);
export const STRIPE_PRICE_YEARLY = parseInt(
  process.env.STRIPE_PRICE_YEARLY || "9990"
);

/**
 * Verify Stripe webhook signature
 */
export function verifyStripeWebhookSignature(
  body: string | Buffer,
  signature: string
): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }

  return stripe.webhooks.constructEvent(body, signature, secret);
}

/**
 * Create Stripe checkout session for subscription
 */
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
}: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

/**
 * Get or create Stripe customer
 */
export async function getOrCreateStripeCustomer(
  email: string,
  customerId?: string
) {
  if (customerId) {
    return stripe.customers.retrieve(customerId);
  }

  return stripe.customers.create({ email });
}
