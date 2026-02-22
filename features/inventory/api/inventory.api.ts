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
  | "ADJUST"
  | "INITIALIZE";

/**
 * Matches backend AdjustmentReason enum (uppercase, exact).
 */
export type AdjustmentReason = "DAMAGE" | "LOST" | "FOUND" | "MANUAL_CORRECTION";

/**
 * LowStockItemDto — returned by GET /api/inventory/low-stock
 * `shortage` is the canonical field (not `deficit`).
 */
export type LowStockItem = {
  variantId: string;
  sku: string;
  warehouseId: string;
  available: number;
  reorderPoint: number;
  shortage: number;
};

/**
 * ReorderSuggestionDto — returned by GET /api/inventory/reorder-suggestions
 */
export type ReorderSuggestion = {
  variantId: string;
  sku: string;
  warehouseId: string;
  available: number;
  reorderPoint: number;
  safetyStock: number;
  leadTimeDays: number;
  shortage: number;
  suggestedOrderQty: number;
  supplierId?: string;
  supplierName?: string;
};

/**
 * InventoryTxnResponseDto — returned by POST /api/inventory/initialize and /adjust
 * `unitCost` is string | null per backend serialization.
 */
export type StockTransaction = {
  id: string;
  type: StockTxnType;
  variantId: string;
  warehouseId: string;
  locationId?: string | null;
  qty: number;
  unitCost?: string | null;
  beforeQty: number;
  afterQty: number;
  reasonCode?: AdjustmentReason | null;
  idempotencyKey?: string | null;
  refType?: string | null;
  refId?: string | null;
  note?: string | null;
  createdById?: string;
  createdAt: string;
};

/**
 * GoodsReceiptResponseDto — returned by POST /api/inventory/receive
 */
export type GoodsReceiptResponseDto = {
  id: string;
  code: string;
  poId?: string | null;
  warehouseId: string;
  status: string;
  receivedAt: string;
  note?: string | null;
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

/**
 * StockBalanceByLocationDto — returned by GET /api/inventory/balance/:variantId/by-location
 */
export type StockBalanceByLocationDto = {
  variantId: string;
  warehouseId: string;
  locations: {
    locationId: string;
    locationCode: string;
    locationName: string;
    onHand: number;
    reserved: number;
    available: number;
  }[];
  consolidated: {
    onHand: number;
    reserved: number;
    available: number;
  };
};

/**
 * ReceivingDiscrepancyDto — returned by GET /api/inventory/receiving/:grnId/discrepancies
 */
export type ReceivingDiscrepancy = {
  id: string;
  grnId: string;
  variantId: string;
  expectedQty: number;
  receivedQty: number;
  difference: number;
  reasonCode: string;
  createdAt: string;
  variant: {
    id: string;
    sku: string;
  };
};

/**
 * StockLotDto — returned by GET /api/inventory/lots
 */
export type StockLot = {
  id: string;
  variantId: string;
  warehouseId: string;
  locationId?: string | null;
  lotNumber: string;
  expiryDate?: string | null;
  receivedAt: string;
  qty: number;
  unitCost?: string | null;
  grnId?: string | null;
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

export type LotsFilters = {
  variantId?: string;
  warehouseId?: string;
  activeOnly?: boolean;
};

export async function fetchLowStock(warehouseId?: string): Promise<LowStockItem[]> {
  const query = warehouseId ? `?warehouseId=${warehouseId}` : "";
  return apiRequest<LowStockItem[]>(`/api/inventory/low-stock${query}`);
}

export async function fetchReorderSuggestions(warehouseId?: string): Promise<ReorderSuggestion[]> {
  const query = warehouseId ? `?warehouseId=${warehouseId}` : "";
  return apiRequest<ReorderSuggestion[]>(`/api/inventory/reorder-suggestions${query}`);
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
  if (filters.limit) params.set("limit", Math.min(Number(filters.limit), 200).toString());
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

export async function fetchStockBalanceByLocation(
  variantId: string,
  warehouseId: string,
): Promise<StockBalanceByLocationDto> {
  return apiRequest<StockBalanceByLocationDto>(
    `/api/inventory/balance/${variantId}/by-location?warehouseId=${warehouseId}`,
  );
}

export async function fetchReceivingDiscrepancies(grnId: string): Promise<ReceivingDiscrepancy[]> {
  return apiRequest<ReceivingDiscrepancy[]>(`/api/inventory/receiving/${grnId}/discrepancies`);
}

export async function completePutaway(grnId: string): Promise<{ grnId: string; putawayAt: string }> {
  return apiRequest<{ grnId: string; putawayAt: string }>(`/api/inventory/putaway/${grnId}`, {
    method: "POST",
  });
}

export async function fetchLots(filters: LotsFilters = {}): Promise<StockLot[]> {
  const params = new URLSearchParams();
  if (filters.variantId) params.set("variantId", filters.variantId);
  if (filters.warehouseId) params.set("warehouseId", filters.warehouseId);
  if (filters.activeOnly !== undefined) params.set("activeOnly", String(filters.activeOnly));
  const query = params.toString();
  return apiRequest<StockLot[]>(`/api/inventory/lots${query ? `?${query}` : ""}`);
}
