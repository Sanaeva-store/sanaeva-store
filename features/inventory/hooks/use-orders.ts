import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrders,
  fetchOrderById,
  createOrder,
  reserveOrderStock,
  releaseOrderStock,
  commitOrder,
  updateOrderStatus,
  fetchOrderSummary,
  type OrderListParams,
  type CreateOrderPayload,
  type OrderStatus,
} from "@/features/inventory/api/orders.api";

const orderKeys = {
  all: ["orders"] as const,
  summary: () => ["orders", "summary"] as const,
  list: (params: OrderListParams) =>
    ["orders", "list", params.page ?? 1, params.status ?? "all", params.customerId ?? "all"] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
};

export function useOrderSummaryQuery() {
  return useQuery({
    queryKey: orderKeys.summary(),
    queryFn: fetchOrderSummary,
  });
}

export function useOrdersQuery(params: OrderListParams = {}) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => fetchOrders(params),
  });
}

export function useOrderDetailQuery(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => fetchOrderById(id),
    enabled: Boolean(id),
  });
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useReserveOrderStockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reserveOrderStock(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
  });
}

export function useReleaseOrderStockMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => releaseOrderStock(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
  });
}

export function useCommitOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => commitOrder(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
      void queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
  });
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
      void queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
  });
}
