// src/lib/validation.ts - Shared validation schemas and utilities

import { z } from "zod";

/**
 * Score entry validation - must be 1-45
 */
export const scoreEntrySchema = z.object({
  value: z.number().int().min(1).max(45),
  date: z.date().optional(), // Defaults to today if not provided
});

export type ScoreEntryInput = z.infer<typeof scoreEntrySchema>;

/**
 * Subscription checkout validation
 */
export const checkoutSessionSchema = z.object({
  plan: z.enum(["MONTHLY", "YEARLY"]),
});

export type CheckoutSessionInput = z.infer<typeof checkoutSessionSchema>;

/**
 * Draw publish validation - 5 winning numbers from 1-45
 */
export const publishDrawSchema = z.object({
  winningNumbers: z
    .array(z.number().int().min(1).max(45))
    .length(5)
    .refine((nums) => new Set(nums).size === 5, {
      message: "Winning numbers must be unique",
    }),
});

export type PublishDrawInput = z.infer<typeof publishDrawSchema>;

/**
 * Error handling utility
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Common error responses
 */
export const ApiErrors = {
  UNAUTHORIZED: () =>
    new ApiError(401, "UNAUTHORIZED", "Authentication required"),
  FORBIDDEN: () =>
    new ApiError(403, "FORBIDDEN", "You do not have permission for this action"),
  NOT_FOUND: (resource: string) =>
    new ApiError(404, "NOT_FOUND", `${resource} not found`),
  CONFLICT: (message: string) =>
    new ApiError(409, "CONFLICT", message),
  VALIDATION_ERROR: (message: string) =>
    new ApiError(400, "VALIDATION_ERROR", message),
  INTERNAL_ERROR: () =>
    new ApiError(
      500,
      "INTERNAL_ERROR",
      "An unexpected error occurred. Please try again later."
    ),
  STRIPE_ERROR: (message: string) =>
    new ApiError(400, "STRIPE_ERROR", message),
  STORAGE_ERROR: (message: string) =>
    new ApiError(400, "STORAGE_ERROR", message),
};

/**
 * Safely parse and validate request data
 */
export async function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("; ");
      throw ApiErrors.VALIDATION_ERROR(message);
    }
    throw ApiErrors.VALIDATION_ERROR("Invalid request data");
  }
}

/**
 * Safe JSON parsing
 */
export function parseJSON<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
