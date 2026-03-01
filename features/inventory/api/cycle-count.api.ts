import { apiRequest } from "@/shared/lib/http/api-client";
import type { PaginatedResponse } from "@/shared/types/api";

export type CycleCountStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

export type CycleCountItem = {
  id: string;
  sessionId: string;
  variantId: string;
  locationId?: string | null;
  expectedQty: number;
  countedQty?: number | null;
  difference?: number | null;
};

export type CycleCountSession = {
  id: string;
  code: string;
  warehouseId: string;
  status: CycleCountStatus;
  note?: string | null;
  items: CycleCountItem[];
  startedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CycleCountListResponse = PaginatedResponse<CycleCountSession>;

export type CycleCountListParams = {
  page?: number;
  limit?: number;
  warehouseId?: string;
  status?: CycleCountStatus;
};

export type CreateCycleCountPayload = {
  warehouseId: string;
  note?: string;
  variantIds?: string[];
};

export type SubmitCountItemPayload = {
  variantId: string;
  locationId?: string;
  countedQty: number;
};

export type SubmitCountPayload = {
  items: SubmitCountItemPayload[];
};

export async function fetchCycleCounts(
  params: CycleCountListParams = {},
): Promise<CycleCountListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.warehouseId) searchParams.set("warehouseId", params.warehouseId);
  if (params.status) searchParams.set("status", params.status);
  const qs = searchParams.toString();
  return apiRequest<CycleCountListResponse>(
    `/api/cycle-count${qs ? `?${qs}` : ""}`,
  );
}

export async function fetchCycleCountById(id: string): Promise<CycleCountSession> {
  return apiRequest<CycleCountSession>(`/api/cycle-count/${id}`);
}

export async function createCycleCount(
  payload: CreateCycleCountPayload,
): Promise<CycleCountSession> {
  return apiRequest<CycleCountSession>("/api/cycle-count", {
    method: "POST",
    body: payload,
  });
}

export async function submitCycleCount(
  id: string,
  payload: SubmitCountPayload,
): Promise<CycleCountSession> {
  return apiRequest<CycleCountSession>(`/api/cycle-count/${id}/count`, {
    method: "POST",
    body: payload,
  });
}

export async function closeCycleCount(id: string): Promise<CycleCountSession> {
  return apiRequest<CycleCountSession>(`/api/cycle-count/${id}/close`, {
    method: "POST",
  });
}
