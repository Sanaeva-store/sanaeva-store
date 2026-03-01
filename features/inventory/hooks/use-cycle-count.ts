import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchCycleCounts,
  fetchCycleCountById,
  createCycleCount,
  submitCycleCount,
  closeCycleCount,
  type CycleCountListParams,
  type CreateCycleCountPayload,
  type SubmitCountPayload,
} from "@/features/inventory/api/cycle-count.api";

const cycleCountKeys = {
  all: ["cycle-count"] as const,
  list: (params: CycleCountListParams) =>
    ["cycle-count", "list", params.page ?? 1, params.warehouseId ?? "all", params.status ?? "all"] as const,
  detail: (id: string) => ["cycle-count", "detail", id] as const,
};

export function useCycleCountsQuery(params: CycleCountListParams = {}) {
  return useQuery({
    queryKey: cycleCountKeys.list(params),
    queryFn: () => fetchCycleCounts(params),
  });
}

export function useCycleCountDetailQuery(id: string) {
  return useQuery({
    queryKey: cycleCountKeys.detail(id),
    queryFn: () => fetchCycleCountById(id),
    enabled: Boolean(id),
  });
}

export function useCreateCycleCountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCycleCountPayload) => createCycleCount(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cycleCountKeys.all });
    },
  });
}

export function useSubmitCycleCountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SubmitCountPayload }) =>
      submitCycleCount(id, payload),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: cycleCountKeys.all });
      void queryClient.invalidateQueries({ queryKey: cycleCountKeys.detail(id) });
    },
  });
}

export function useCloseCycleCountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => closeCycleCount(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: cycleCountKeys.all });
      void queryClient.invalidateQueries({ queryKey: cycleCountKeys.detail(id) });
    },
  });
}
