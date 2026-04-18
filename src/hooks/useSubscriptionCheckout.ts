// src/hooks/useSubscriptionCheckout.ts - React hook for Stripe checkout

import { useMutation } from "@tanstack/react-query";
import { createSubscriptionCheckout } from "../api/subscriptions.server";

interface UseSubscriptionCheckoutOptions {
  userId: string;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for creating Stripe checkout session
 * Redirects to Stripe when successful
 */
export function useSubscriptionCheckout({
  userId,
  onSuccess,
  onError,
}: UseSubscriptionCheckoutOptions) {
  const mutation = useMutation({
    mutationFn: async (plan: "MONTHLY" | "YEARLY") => {
      const appUrl = process.env.APP_URL || window.location.origin;

      return createSubscriptionCheckout(
        userId,
        plan,
        `${appUrl}/subscription/success`,
        `${appUrl}/subscription/cancel`
      );
    },
    onSuccess: (data) => {
      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      }
      onSuccess?.(data.sessionId);
    },
    onError: (error: any) => {
      onError?.(error);
    },
  });

  return {
    checkout: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * Hook for handling Stripe return (success/cancel)
 */
export function useCheckoutReturn() {
  // Check URL for status parameter
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");

  return {
    isSuccess: status === "success",
    isCanceled: status === "canceled",
    sessionId: params.get("session_id"),
  };
}
