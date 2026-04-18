// src/middleware/auth.ts - Authentication middleware

import { ApiErrors } from "../lib/validation";

/**
 * Extract and verify JWT token from request headers
 * In production, integrate with Supabase Auth or your JWT provider
 */
export function extractAuthToken(
  headers: Record<string, string>
): { userId: string; role: "ADMIN" | "SUBSCRIBER" } | null {
  const authHeader = headers.authorization || headers.Authorization;

  if (!authHeader) {
    return null;
  }

  // Format: Bearer <token>
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  // In production: decode and verify JWT with Supabase
  // For now, this is a placeholder
  try {
    // This would normally verify the JWT signature
    // const decoded = verifyJWT(parts[1]);
    // return { userId: decoded.sub, role: decoded.role };

    // Placeholder for testing
    return {
      userId: "test-user-id",
      role: "SUBSCRIBER",
    };
  } catch {
    return null;
  }
}

/**
 * Middleware to require authentication
 */
export function requireAuth(
  headers: Record<string, string>
): { userId: string; role: "ADMIN" | "SUBSCRIBER" } {
  const auth = extractAuthToken(headers);

  if (!auth) {
    throw ApiErrors.UNAUTHORIZED();
  }

  return auth;
}

/**
 * Middleware to require admin role
 */
export function requireAdmin(
  headers: Record<string, string>
): { userId: string; role: "ADMIN" | "SUBSCRIBER" } {
  const auth = requireAuth(headers);

  if (auth.role !== "ADMIN") {
    throw ApiErrors.FORBIDDEN();
  }

  return auth;
}
