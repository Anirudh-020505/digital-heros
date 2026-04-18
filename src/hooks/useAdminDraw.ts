// src/hooks/useAdminDraw.ts - React hook for draw management (admin only)

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  listDraws,
  getDraw,
  createDraw,
  updateDraw,
  deleteDraw,
  publishDraw,
  getDrawStats,
} from "../api/admin/draws.server";

/**
 * Hook for managing draws (admin)
 */
export function useAdminDraws() {
  const queryClient = useQueryClient();

  // List draws
  const listQuery = useQuery({
    queryKey: ["draws", "list"],
    queryFn: () => listDraws(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create draw
  const createMutation = useMutation({
    mutationFn: (data: { month: number; year: number }) =>
      createDraw(data.month, data.year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draws"] });
    },
  });

  // Delete draw
  const deleteMutation = useMutation({
    mutationFn: (drawId: string) => deleteDraw(drawId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draws"] });
    },
  });

  return {
    draws: listQuery.data?.data || [],
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    createDraw: createMutation.mutate,
    isCreating: createMutation.isPending,
    deleteDraw: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    refetch: listQuery.refetch,
  };
}

/**
 * Hook for single draw details and editing
 */
export function useDrawDetails(drawId: string) {
  const queryClient = useQueryClient();

  // Get draw
  const drawQuery = useQuery({
    queryKey: ["draw", drawId],
    queryFn: () => getDraw(drawId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!drawId,
  });

  // Update draw (set winning numbers)
  const updateMutation = useMutation({
    mutationFn: (data: { winningNumbers: number[] }) =>
      updateDraw(drawId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draw", drawId] });
    },
  });

  // Publish draw (calculate winners)
  const publishMutation = useMutation({
    mutationFn: () => publishDraw(drawId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draw", drawId] });
      queryClient.invalidateQueries({ queryKey: ["draws"] });
    },
  });

  // Get draw stats
  const statsQuery = useQuery({
    queryKey: ["draw-stats", drawId],
    queryFn: () => getDrawStats(drawId),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!drawId,
  });

  return {
    draw: drawQuery.data,
    isLoading: drawQuery.isLoading,
    error: drawQuery.error,
    
    updateDraw: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    publishDraw: publishMutation.mutate,
    isPublishing: publishMutation.isPending,
    publishError: publishMutation.error,

    stats: statsQuery.data,
    statsLoading: statsQuery.isLoading,

    refetch: drawQuery.refetch,
  };
}

/**
 * Hook for draw statistics dashboard
 */
export function useDrawStats(drawId?: string) {
  const statsQuery = useQuery({
    queryKey: ["draw-stats", drawId],
    queryFn: () => (drawId ? getDrawStats(drawId) : Promise.resolve(null)),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!drawId,
  });

  return {
    stats: statsQuery.data,
    isLoading: statsQuery.isLoading,
    error: statsQuery.error,
    refetch: statsQuery.refetch,
  };
}
