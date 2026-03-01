import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPurchaseOrders,
  fetchPurchaseOrderById,
  createPurchaseOrder,
  approvePurchaseOrder,
  sendPurchaseOrder,
  receivePurchaseOrder,
  cancelPurchaseOrder,
  type PurchaseOrderListParams,
  type CreatePurchaseOrderPayload,
  type ReceivePurchaseOrderPayload,
} from "@/features/inventory/api/purchase-orders.api";

const poKeys = {
  all: ["purchase-orders"] as const,
  list: (params: PurchaseOrderListParams) =>
    ["purchase-orders", "list", params.page ?? 1, params.limit ?? 20, params.supplierId ?? "all", params.status ?? "all"] as const,
  detail: (id: string) => ["purchase-orders", "detail", id] as const,
};

export function usePurchaseOrdersQuery(params: PurchaseOrderListParams = {}) {
  return useQuery({
    queryKey: poKeys.list(params),
    queryFn: () => fetchPurchaseOrders(params),
  });
}

export function usePurchaseOrderDetailQuery(id: string) {
  return useQuery({
    queryKey: poKeys.detail(id),
    queryFn: () => fetchPurchaseOrderById(id),
    enabled: Boolean(id),
  });
}

export function useCreatePurchaseOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePurchaseOrderPayload) =>
      createPurchaseOrder(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: poKeys.all });
    },
  });
}

export function useApprovePurchaseOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approvePurchaseOrder(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: poKeys.all });
      void queryClient.invalidateQueries({ queryKey: poKeys.detail(id) });
    },
  });
}

export function useSendPurchaseOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sendPurchaseOrder(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: poKeys.all });
      void queryClient.invalidateQueries({ queryKey: poKeys.detail(id) });
    },
  });
}

export function useReceivePurchaseOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReceivePurchaseOrderPayload }) =>
      receivePurchaseOrder(id, payload),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: poKeys.all });
      void queryClient.invalidateQueries({ queryKey: poKeys.detail(id) });
    },
  });
}

export function useCancelPurchaseOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelPurchaseOrder(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: poKeys.all });
      void queryClient.invalidateQueries({ queryKey: poKeys.detail(id) });
    },
  });
}
