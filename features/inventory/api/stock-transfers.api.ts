import { apiRequest } from "@/shared/lib/http/api-client";
import type { PaginatedResponse } from "@/shared/types/api";

export type TransferStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "IN_TRANSIT"
  | "RECEIVED"
  | "COMPLETED"
  | "CANCELLED";

export type StockTransferItem = {
  id: string;
  variantId: string;
  qty: number;
  receivedQty?: number | null;
};

export type StockTransfer = {
  id: string;
  code: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  status: TransferStatus;
  note?: string | null;
  items: StockTransferItem[];
  createdAt: string;
  updatedAt: string;
};

export type StockTransferListResponse = PaginatedResponse<StockTransfer>;

export type StockTransferListParams = {
  page?: number;
  limit?: number;
  status?: TransferStatus;
};

export type CreateStockTransferItemPayload = {
  variantId: string;
  qty: number;
};

export type CreateStockTransferPayload = {
  fromWarehouseId: string;
  toWarehouseId: string;
  note?: string;
  items: CreateStockTransferItemPayload[];
};

export type ReceiveStockTransferItemPayload = {
  variantId: string;
  qty: number;
};

export type ReceiveStockTransferPayload = {
  items: ReceiveStockTransferItemPayload[];
  note?: string;
};

export async function fetchStockTransfers(
  params: StockTransferListParams = {},
): Promise<StockTransferListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  const qs = searchParams.toString();
  return apiRequest<StockTransferListResponse>(
    `/api/stock-transfers${qs ? `?${qs}` : ""}`,
  );
}

export async function fetchStockTransferById(id: string): Promise<StockTransfer> {
  return apiRequest<StockTransfer>(`/api/stock-transfers/${id}`);
}

export async function createStockTransfer(
  payload: CreateStockTransferPayload,
): Promise<StockTransfer> {
  return apiRequest<StockTransfer>("/api/stock-transfers", {
    method: "POST",
    body: payload,
  });
}

export async function approveStockTransfer(id: string): Promise<StockTransfer> {
  return apiRequest<StockTransfer>(`/api/stock-transfers/${id}/approve`, {
    method: "POST",
  });
}

export async function shipStockTransfer(id: string): Promise<StockTransfer> {
  return apiRequest<StockTransfer>(`/api/stock-transfers/${id}/ship`, {
    method: "POST",
  });
}

export async function receiveStockTransfer(
  id: string,
  payload: ReceiveStockTransferPayload,
): Promise<StockTransfer> {
  return apiRequest<StockTransfer>(`/api/stock-transfers/${id}/receive`, {
    method: "POST",
    body: payload,
  });
}

export async function completeStockTransfer(id: string): Promise<StockTransfer> {
  return apiRequest<StockTransfer>(`/api/stock-transfers/${id}/complete`, {
    method: "POST",
  });
}

export async function cancelStockTransfer(id: string): Promise<StockTransfer> {
  return apiRequest<StockTransfer>(`/api/stock-transfers/${id}/cancel`, {
    method: "POST",
  });
}
