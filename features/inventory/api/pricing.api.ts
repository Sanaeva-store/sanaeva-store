import { apiRequest } from "@/shared/lib/http/api-client";
import type { PaginatedResponse } from "@/shared/types/api";

export type PriceList = {
  id: string;
  name: string;
  description?: string | null;
  isDefault: boolean;
  validFrom?: string | null;
  validTo?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PriceListItem = {
  id: string;
  priceListId: string;
  variantId: string;
  /** Decimal string */
  price: string;
  createdAt: string;
  updatedAt: string;
};

export type PriceListListResponse = PaginatedResponse<PriceList>;

export type PriceListListParams = {
  page?: number;
  limit?: number;
};

export type CreatePriceListPayload = {
  name: string;
  description?: string;
  isDefault?: boolean;
  validFrom?: string;
  validTo?: string;
};

export type UpdatePriceListPayload = Partial<CreatePriceListPayload>;

export type AddPriceListItemPayload = {
  variantId: string;
  price: number;
};

export async function fetchPriceLists(
  params: PriceListListParams = {},
): Promise<PriceListListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  const qs = searchParams.toString();
  return apiRequest<PriceListListResponse>(
    `/api/catalog/price-lists${qs ? `?${qs}` : ""}`,
  );
}

export async function fetchPriceListById(id: string): Promise<PriceList> {
  return apiRequest<PriceList>(`/api/catalog/price-lists/${id}`);
}

export async function createPriceList(
  payload: CreatePriceListPayload,
): Promise<PriceList> {
  return apiRequest<PriceList>("/api/catalog/price-lists", {
    method: "POST",
    body: payload,
  });
}

export async function updatePriceList(
  id: string,
  payload: UpdatePriceListPayload,
): Promise<PriceList> {
  return apiRequest<PriceList>(`/api/catalog/price-lists/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function fetchPriceListItems(priceListId: string): Promise<PriceListItem[]> {
  return apiRequest<PriceListItem[]>(`/api/catalog/price-lists/${priceListId}/items`);
}

export async function addPriceListItem(
  priceListId: string,
  payload: AddPriceListItemPayload,
): Promise<PriceListItem> {
  return apiRequest<PriceListItem>(
    `/api/catalog/price-lists/${priceListId}/items`,
    { method: "POST", body: payload },
  );
}
