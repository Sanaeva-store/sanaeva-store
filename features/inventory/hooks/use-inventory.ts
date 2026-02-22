import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query/query-keys";
import {
  fetchLowStock,
  fetchReorderSuggestions,
  fetchTransactions,
  fetchStockBalance,
  fetchStockBalanceByLocation,
  fetchReceivingDiscrepancies,
  completePutaway,
  fetchLots,
  initializeStock,
  adjustStock,
  receiveStock,
  type TransactionFilters,
  type InitializeStockPayload,
  type AdjustStockPayload,
  type ReceiveStockPayload,
  type LotsFilters,
} from "@/features/inventory/api/inventory.api";

export function useLowStockQuery(warehouseId?: string) {
  return useQuery({
    queryKey: queryKeys.inventory.lowStock(warehouseId),
    queryFn: () => fetchLowStock(warehouseId),
  });
}

export function useReorderSuggestionsQuery(warehouseId?: string) {
  return useQuery({
    queryKey: ["inventory", "reorder-suggestions", warehouseId ?? "all"] as const,
    queryFn: () => fetchReorderSuggestions(warehouseId),
  });
}

export function useTransactionsQuery(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: queryKeys.inventory.transactions(filters),
    queryFn: () => fetchTransactions(filters),
  });
}

export function useStockBalanceQuery(
  variantId: string,
  warehouseId?: string,
  locationId?: string,
) {
  return useQuery({
    queryKey: ["inventory", "balance", variantId, warehouseId ?? "all", locationId ?? "all"] as const,
    queryFn: () => fetchStockBalance(variantId, warehouseId, locationId),
    enabled: Boolean(variantId),
  });
}

export function useStockBalanceByLocationQuery(variantId: string, warehouseId: string) {
  return useQuery({
    queryKey: ["inventory", "balance-by-location", variantId, warehouseId] as const,
    queryFn: () => fetchStockBalanceByLocation(variantId, warehouseId),
    enabled: Boolean(variantId) && Boolean(warehouseId),
  });
}

export function useReceivingDiscrepanciesQuery(grnId: string) {
  return useQuery({
    queryKey: ["inventory", "discrepancies", grnId] as const,
    queryFn: () => fetchReceivingDiscrepancies(grnId),
    enabled: Boolean(grnId),
  });
}

export function useLotsQuery(filters: LotsFilters = {}) {
  return useQuery({
    queryKey: ["inventory", "lots", filters.variantId ?? "all", filters.warehouseId ?? "all", filters.activeOnly ?? true] as const,
    queryFn: () => fetchLots(filters),
  });
}

export function useInitializeStockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: InitializeStockPayload) => initializeStock(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
}

export function useAdjustStockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdjustStockPayload) => adjustStock(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
}

export function useReceiveStockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReceiveStockPayload) => receiveStock(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
}

export function useCompletePutawayMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grnId: string) => completePutaway(grnId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
}
