// src/hooks/useWinnerVerification.ts - React hook for winner proof upload

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadWinnerVerification, getWinnerVerification } from "../api/admin/winners.server";

interface UseWinnerVerificationOptions {
  userId: string;
  drawId: string;
  onSuccess?: (proofUrl: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for uploading winner verification proof to Supabase Storage
 */
export function useWinnerVerification({
  userId,
  drawId,
  onSuccess,
  onError,
}: UseWinnerVerificationOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      // Validate file on client side first
      if (!file) {
        throw new Error("File is required");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be under 5MB");
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      return uploadWinnerVerification(userId, drawId, file);
    },
    onSuccess: (data) => {
      // Invalidate verification query
      queryClient.invalidateQueries({
        queryKey: ["winner-verification", userId, drawId],
      });

      onSuccess?.(data.proofUrl);
    },
    onError: (error: any) => {
      onError?.(error);
    },
  });

  return {
    uploadProof: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    proofUrl: mutation.data?.proofUrl,
  };
}

/**
 * Hook for fetching winner verification details
 */
export function useWinnerVerificationDetails(verificationId: string) {
  const query = useQuery({
    queryKey: ["winner-verification", verificationId],
    queryFn: () => getWinnerVerification(verificationId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!verificationId,
  });

  return {
    verification: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
