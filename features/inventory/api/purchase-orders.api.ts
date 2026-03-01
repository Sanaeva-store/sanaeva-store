import { apiRequest } from "@/shared/lib/http/api-client";
import type { PaginatedResponse } from "@/shared/types/api";

/**
 * DocStatus enum — matches backend exact values.
 * Source: input-contracts.md
 */
export type DocStatus =
  | "DRAFT"
  | "APPROVED"
  | "SENT"
  | "PARTIAL"
  | "CLOSED"
  | "CANCELLED"
  | "RECEIVED";

export type PurchaseOrderItem = {
  id: string;
  variantId: string;
  qty: number;
  /** Decimal string per backend serialization */
  unitCost: string;
  receivedQty: number;
};

export type PurchaseOrder = {
  id: string;
  code: string;
  supplierId: string;
  status: DocStatus;
  expectedAt?: string | null;
  note?: string | null;
  items: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type PurchaseOrderListResponse = PaginatedResponse<PurchaseOrder>;

export type PurchaseOrderListParams = {
  page?: number;
  limit?: number;
  supplierId?: string;
  status?: DocStatus;
};

export type CreatePurchaseOrderItemPayload = {
  variantId: string;
  qty: number;
  /** Decimal string, e.g. "150.00" */
  unitCost: string;
};

export type CreatePurchaseOrderPayload = {
  supplierId: string;
  expectedAt?: string;
  note?: string;
  items: CreatePurchaseOrderItemPayload[];
};

export type ReceivePurchaseOrderItemPayload = {
  variantId: string;
  qty: number;
  unitCost?: string;
};

export type ReceivePurchaseOrderPayload = {
  warehouseId: string;
  locationId?: string;
  invoiceNumber?: string;
  note?: string;
  items: ReceivePurchaseOrderItemPayload[];
};

export async function fetchPurchaseOrders(
  params: PurchaseOrderListParams = {},
): Promise<PurchaseOrderListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.supplierId) searchParams.set("supplierId", params.supplierId);
  if (params.status) searchParams.set("status", params.status);
  const qs = searchParams.toString();
  return apiRequest<PurchaseOrderListResponse>(
    `/api/purchase-orders${qs ? `?${qs}` : ""}`,
  );
}

export async function fetchPurchaseOrderById(id: string): Promise<PurchaseOrder> {
  return apiRequest<PurchaseOrder>(`/api/purchase-orders/${id}`);
}

export async function createPurchaseOrder(
  payload: CreatePurchaseOrderPayload,
): Promise<PurchaseOrder> {
  return apiRequest<PurchaseOrder>("/api/purchase-orders", {
    method: "POST",
    body: payload,
  });
}

export async function approvePurchaseOrder(id: string): Promise<PurchaseOrder> {
  return apiRequest<PurchaseOrder>(`/api/purchase-orders/${id}/approve`, {
    method: "PATCH",
  });
}

export async function sendPurchaseOrder(id: string): Promise<PurchaseOrder> {
  return apiRequest<PurchaseOrder>(`/api/purchase-orders/${id}/send`, {
    method: "PATCH",
  });
}

export async function receivePurchaseOrder(
  id: string,
  payload: ReceivePurchaseOrderPayload,
): Promise<PurchaseOrder> {
  return apiRequest<PurchaseOrder>(`/api/purchase-orders/${id}/receive`, {
    method: "POST",
    body: payload,
  });
}

export async function cancelPurchaseOrder(id: string): Promise<PurchaseOrder> {
  return apiRequest<PurchaseOrder>(`/api/purchase-orders/${id}/cancel`, {
    method: "PATCH",
  });
}
