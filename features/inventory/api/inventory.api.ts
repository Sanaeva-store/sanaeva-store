import { apiRequest } from "@/shared/lib/http/api-client";
import type { PaginatedResponse } from "@/shared/types/api";

/**
 * Matches backend StockTxnType enum (uppercase, exact).
 * Source: inventory DTO / Prisma schema
 */
export type StockTxnType =
  | "INBOUND"
  | "OUTBOUND"
  | "RESERVE"
  | "RELEASE"
  | "TRANSFER_OUT"
  | "TRANSFER_IN"
  | "ADJUST";

/**
 * Matches backend AdjustmentReason enum (uppercase, exact).
 */
export type AdjustmentReason = "DAMAGE" | "LOST" | "FOUND" | "MANUAL_CORRECTION";

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
  type: StockTxnType;
  beforeQty: number;
  afterQty: number;
  qty: number;
  reasonCode?: AdjustmentReason;
  note?: string;
  refType?: string;
  refId?: string;
  createdById?: string;
  createdAt: string;
  unitCost?: number;
};

/**
 * GoodsReceiptResponseDto — returned by POST /api/inventory/receive
 */
export type GoodsReceiptResponseDto = {
  id: string;
  code: string;
  warehouseId: string;
  poId?: string;
  receivedAt: string;
  status: string;
  note?: string;
  transactions: StockTransaction[];
};

/**
 * StockBalanceDto — returned by GET /api/inventory/balance/:variantId
 */
export type StockBalanceDto = {
  variantId: string;
  warehouseId: string;
  locationId?: string;
  onHand: number;
  reserved: number;
  available: number;
};

export type TransactionFilters = {
  variantId?: string;
  warehouseId?: string;
  type?: StockTxnType;
  createdById?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
};

export type TransactionListResponse = PaginatedResponse<StockTransaction>;

export type InitializeStockPayload = {
  variantId: string;
  warehouseId: string;
  locationId?: string;
  qty: number;
  unitCost?: number;
  note?: string;
  idempotencyKey?: string;
};

export type AdjustStockPayload = {
  variantId: string;
  warehouseId: string;
  locationId?: string;
  qty: number;
  reasonCode: AdjustmentReason;
  note?: string;
  idempotencyKey: string;
};

export type ReceiveItem = {
  variantId: string;
  qty: number;
  unitCost?: number;
  lotNumber?: string;
  expiryDate?: string;
};

export type ReceiveStockPayload = {
  warehouseId: string;
  locationId?: string;
  poId?: string;
  invoiceNumber?: string;
  note?: string;
  items: ReceiveItem[];
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
  if (filters.createdById) params.set("createdById", filters.createdById);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const query = params.toString();
  const qs = query ? `?${query}` : "";
  return apiRequest<TransactionListResponse>(`/api/inventory/transactions${qs}`);
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
): Promise<GoodsReceiptResponseDto> {
  return apiRequest<GoodsReceiptResponseDto>("/api/inventory/receive", {
    method: "POST",
    body: payload,
  });
}

export async function fetchStockBalance(
  variantId: string,
  warehouseId?: string,
  locationId?: string,
): Promise<StockBalanceDto> {
  const params = new URLSearchParams();
  if (warehouseId) params.set("warehouseId", warehouseId);
  if (locationId) params.set("locationId", locationId);
  const query = params.toString();
  return apiRequest<StockBalanceDto>(
    `/api/inventory/balance/${variantId}${query ? `?${query}` : ""}`,
  );
}
