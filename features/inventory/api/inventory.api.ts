import { apiRequest } from "@/shared/lib/http/api-client";

export type TransactionType =
  | "initialize"
  | "adjust_increase"
  | "adjust_decrease"
  | "receive"
  | "reserve"
  | "release"
  | "commit";

export type LowStockItem = {
  variantId: string;
  variantName: string;
  warehouseId: string;
  warehouseName: string;
  available: number;
  reorderPoint: number;
  deficit: number;
};

export type StockTransaction = {
  id: string;
  variantId: string;
  variantName: string;
  warehouseId: string;
  warehouseName: string;
  type: TransactionType;
  quantityBefore: number;
  quantityAfter: number;
  delta: number;
  reason?: string;
  note?: string;
  referenceId?: string;
  actorId?: string;
  createdAt: string;
};

export type TransactionFilters = {
  variantId?: string;
  warehouseId?: string;
  type?: TransactionType;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
};

export type TransactionListResponse = {
  items: StockTransaction[];
  total: number;
  page: number;
  limit: number;
};

export type InitializeStockPayload = {
  variantId: string;
  warehouseId: string;
  quantity: number;
  note?: string;
  idempotencyKey: string;
};

export type AdjustStockPayload = {
  variantId: string;
  warehouseId: string;
  delta: number;
  reason: string;
  note?: string;
  idempotencyKey: string;
};

export type ReceiveItem = {
  variantId: string;
  quantity: number;
  unitCost?: number;
};

export type ReceiveStockPayload = {
  warehouseId: string;
  poReference?: string;
  invoiceNumber?: string;
  items: ReceiveItem[];
  idempotencyKey: string;
};

export async function fetchLowStock(warehouseId?: string): Promise<LowStockItem[]> {
  const query = warehouseId ? `?warehouseId=${warehouseId}` : "";
  return apiRequest<LowStockItem[]>(`/api/inventory/low-stock${query}`);
}

export async function fetchTransactions(
  filters: TransactionFilters = {},
): Promise<TransactionListResponse> {
  const params = new URLSearchParams();
  if (filters.variantId) params.set("variantId", filters.variantId);
  if (filters.warehouseId) params.set("warehouseId", filters.warehouseId);
  if (filters.type) params.set("type", filters.type);
  if (filters.fromDate) params.set("fromDate", filters.fromDate);
  if (filters.toDate) params.set("toDate", filters.toDate);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const query = params.toString();
  return apiRequest<TransactionListResponse>(
    `/api/inventory/transactions${query ? `?${query}` : ""}`,
  );
}

export async function initializeStock(
  payload: InitializeStockPayload,
): Promise<StockTransaction> {
  return apiRequest<StockTransaction>("/api/inventory/initialize", {
    method: "POST",
    body: payload,
  });
}

export async function adjustStock(
  payload: AdjustStockPayload,
): Promise<StockTransaction> {
  return apiRequest<StockTransaction>("/api/inventory/adjust", {
    method: "POST",
    body: payload,
  });
}

export async function receiveStock(
  payload: ReceiveStockPayload,
): Promise<StockTransaction[]> {
  return apiRequest<StockTransaction[]>("/api/inventory/receive", {
    method: "POST",
    body: payload,
  });
}

export async function fetchStockBalance(variantId: string): Promise<{ available: number; reserved: number }> {
  return apiRequest<{ available: number; reserved: number }>(
    `/api/inventory/balance/${variantId}`,
  );
}
