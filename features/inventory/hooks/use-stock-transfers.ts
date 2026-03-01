import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchStockTransfers,
  fetchStockTransferById,
  createStockTransfer,
  approveStockTransfer,
  shipStockTransfer,
  receiveStockTransfer,
  completeStockTransfer,
  cancelStockTransfer,
  type StockTransferListParams,
  type CreateStockTransferPayload,
  type ReceiveStockTransferPayload,
} from "@/features/inventory/api/stock-transfers.api";

const transferKeys = {
  all: ["stock-transfers"] as const,
  list: (params: StockTransferListParams) =>
    ["stock-transfers", "list", params.page ?? 1, params.status ?? "all"] as const,
  detail: (id: string) => ["stock-transfers", "detail", id] as const,
};

export function useStockTransfersQuery(params: StockTransferListParams = {}) {
  return useQuery({
    queryKey: transferKeys.list(params),
    queryFn: () => fetchStockTransfers(params),
  });
}

export function useStockTransferDetailQuery(id: string) {
  return useQuery({
    queryKey: transferKeys.detail(id),
    queryFn: () => fetchStockTransferById(id),
    enabled: Boolean(id),
  });
}

export function useCreateStockTransferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStockTransferPayload) =>
      createStockTransfer(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transferKeys.all });
    },
  });
}

export function useApproveStockTransferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveStockTransfer(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: transferKeys.all });
      void queryClient.invalidateQueries({ queryKey: transferKeys.detail(id) });
    },
  });
}

export function useShipStockTransferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => shipStockTransfer(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: transferKeys.all });
      void queryClient.invalidateQueries({ queryKey: transferKeys.detail(id) });
    },
  });
}

export function useReceiveStockTransferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ReceiveStockTransferPayload;
    }) => receiveStockTransfer(id, payload),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: transferKeys.all });
      void queryClient.invalidateQueries({ queryKey: transferKeys.detail(id) });
    },
  });
}

export function useCompleteStockTransferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => completeStockTransfer(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: transferKeys.all });
      void queryClient.invalidateQueries({ queryKey: transferKeys.detail(id) });
    },
  });
}

export function useCancelStockTransferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelStockTransfer(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: transferKeys.all });
      void queryClient.invalidateQueries({ queryKey: transferKeys.detail(id) });
    },
  });
}
