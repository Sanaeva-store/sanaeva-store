import { apiRequest } from "@/shared/lib/http/api-client";
import type { PaginatedResponse } from "@/shared/types/api";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type OrderItem = {
  id: string;
  variantId: string;
  qty: number;
  /** Decimal string */
  unitPrice: string;
  /** Decimal string */
  subtotal: string;
};

export type Order = {
  id: string;
  code: string;
  customerId?: string | null;
  status: OrderStatus;
  /** Decimal string */
  subtotal: string;
  /** Decimal string */
  totalDiscount: string;
  /** Decimal string */
  total: string;
  note?: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type OrderListResponse = PaginatedResponse<Order>;

export type OrderListParams = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  customerId?: string;
  from?: string;
  to?: string;
};

export type CreateOrderItemPayload = {
  variantId: string;
  qty: number;
  unitPrice: number;
};

export type CreateOrderPayload = {
  customerId?: string;
  note?: string;
  items: CreateOrderItemPayload[];
};

export async function fetchOrders(
  params: OrderListParams = {},
): Promise<OrderListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.customerId) searchParams.set("customerId", params.customerId);
  if (params.from) searchParams.set("from", params.from);
  if (params.to) searchParams.set("to", params.to);
  const qs = searchParams.toString();
  return apiRequest<OrderListResponse>(`/api/orders${qs ? `?${qs}` : ""}`);
}

export async function fetchOrderById(id: string): Promise<Order> {
  return apiRequest<Order>(`/api/orders/${id}`);
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return apiRequest<Order>("/api/orders", { method: "POST", body: payload });
}

export async function reserveOrderStock(id: string): Promise<Order> {
  return apiRequest<Order>(`/api/orders/${id}/reserve`, { method: "POST" });
}

export async function releaseOrderStock(id: string): Promise<Order> {
  return apiRequest<Order>(`/api/orders/${id}/release`, { method: "POST" });
}

export async function commitOrder(id: string): Promise<Order> {
  return apiRequest<Order>(`/api/orders/${id}/commit`, { method: "POST" });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  return apiRequest<Order>(`/api/orders/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export async function fetchOrderSummary(): Promise<{
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: string;
}> {
  return apiRequest("/api/orders/summary");
}
