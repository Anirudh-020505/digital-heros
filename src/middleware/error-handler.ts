// src/middleware/error-handler.ts - Global error handling

import type { ApiResponse } from "../types";
import { ApiError } from "../lib/validation";

export class HttpException extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

/**
 * Format error response
 */
export function formatErrorResponse<T>(
  error: unknown
): ApiResponse<T> & { statusCode: number } {
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }

  if (error instanceof HttpException) {
    return {
      statusCode: error.statusCode,
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    };
  }

  if (error instanceof Error) {
    // Generic error - don't leak details in production
    const isDev = process.env.NODE_ENV === "development";
    return {
      statusCode: 500,
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: isDev ? error.message : "An unexpected error occurred",
      },
    };
  }

  return {
    statusCode: 500,
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  };
}

/**
 * Safe async wrapper for API handlers
 */
export async function asyncHandler<T>(
  fn: () => Promise<T>
): Promise<{ data: T; statusCode: number } | { error: unknown; statusCode: number }> {
  try {
    const data = await fn();
    return { data, statusCode: 200 };
  } catch (error) {
    const formatted = formatErrorResponse(error);
    return {
      error: formatted,
      statusCode: formatted.statusCode,
    };
  }
}
