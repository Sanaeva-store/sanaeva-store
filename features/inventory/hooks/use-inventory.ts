import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query/query-keys";
import {
  fetchLowStock,
  fetchTransactions,
  fetchStockBalance,
  initializeStock,
  adjustStock,
  receiveStock,
  type TransactionFilters,
  type InitializeStockPayload,
  type AdjustStockPayload,
  type ReceiveStockPayload,
} from "@/features/inventory/api/inventory.api";

export function useLowStockQuery(warehouseId?: string) {
  return useQuery({
    queryKey: queryKeys.inventory.lowStock(warehouseId),
    queryFn: () => fetchLowStock(warehouseId),
  });
}

export function useTransactionsQuery(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: queryKeys.inventory.transactions(filters),
    queryFn: () => fetchTransactions(filters),
  });
}

export function useStockBalanceQuery(variantId: string) {
  return useQuery({
    queryKey: ["inventory", "balance", variantId],
    queryFn: () => fetchStockBalance(variantId),
    enabled: Boolean(variantId),
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
