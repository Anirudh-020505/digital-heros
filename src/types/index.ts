// src/types/index.ts - Shared type definitions

export type UserRole = "SUBSCRIBER" | "ADMIN";
export type SubscriptionPlan = "MONTHLY" | "YEARLY";
export type SubscriptionStatus = "ACTIVE" | "PAST_DUE" | "CANCELED";
export type DrawStatus = "DRAFT" | "PUBLISHED";
export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PayoutStatus = "PENDING" | "PAID";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  stripeCustomerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeSubscriptionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Score {
  id: string;
  userId: string;
  value: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Draw {
  id: string;
  month: number;
  year: number;
  status: DrawStatus;
  winningNumbers: number[];
  jackpotRollover: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WinnerVerification {
  id: string;
  userId: string;
  drawId: string;
  proofUrl: string;
  status: VerificationStatus;
  payoutStatus: PayoutStatus;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface ScoreEntry {
  value: number;
}

export interface CreateCheckoutSessionRequest {
  plan: SubscriptionPlan;
}

export interface VerifyWinnerRequest {
  drawId: string;
  proofFile: File;
}

export interface PublishDrawRequest {
  winningNumbers: number[];
}
