// src/hooks/useScoreSubmission.ts - React hook for score submission

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submitScore, getScores } from "../api/scores.server";

interface UseScoreSubmissionOptions {
  userId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for submitting a golf score
 * Handles validation, error states, and automatic retry
 */
export function useScoreSubmission({
  userId,
  onSuccess,
  onError,
}: UseScoreSubmissionOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (score: number) => {
      return submitScore(userId, score);
    },
    onSuccess: (data) => {
      // Invalidate scores query to refetch
      queryClient.invalidateQueries({ queryKey: ["scores", userId] });

      // Call user callback
      onSuccess?.();
    },
    onError: (error: any) => {
      // Handle specific error cases
      if (error?.code === "CONFLICT") {
        // Score already submitted today
        const message = error.message || "You already submitted a score today";
        onError?.(new Error(message));
      } else {
        onError?.(error);
      }
    },
  });

  return {
    submitScore: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
}

/**
 * Hook for fetching user's recent scores
 */
export function useRecentScores(userId: string) {
  const query = useQuery({
    queryKey: ["scores", userId],
    queryFn: () => getScores(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return {
    scores: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
