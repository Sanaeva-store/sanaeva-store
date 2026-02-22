import { apiRequest } from "@/shared/lib/http/api-client";
import type { PaginatedResponse } from "@/shared/types/api";

/**
 * ProductStatus — uppercase, matches backend enum exactly.
 * Source: catalog DTO / Prisma schema
 */
export type ProductStatus = "DRAFT" | "ACTIVE" | "INACTIVE";

export type ProductVariant = {
  id: string;
  sku: string;
  barcode?: string;
  color?: string;
  size?: string;
  price: number;
  cost?: number;
  reorderPoint?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * Product model matching backend catalog DTO.
 * Note: no `slug` field — backend schema.prisma does not have slug yet.
 * Use GET /api/catalog/products/:id for product detail.
 */
export type Product = {
  id: string;
  title: string;
  description?: string;
  brand?: string;
  status: ProductStatus;
  categoryIds: string[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
};

/**
 * Query params for GET /api/catalog/products.
 * sortBy: title | createdAt | updatedAt
 * sortOrder: asc | desc
 */
export type ProductListParams = {
  search?: string;
  status?: ProductStatus;
  categoryId?: string;
  brand?: string;
  sortBy?: "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type ProductListResponse = PaginatedResponse<Product>;

export type CreateProductPayload = {
  title: string;
  description?: string;
  brand?: string;
  status?: ProductStatus;
  categoryIds?: string[];
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type CreateVariantPayload = {
  sku: string;
  barcode?: string;
  color?: string;
  size?: string;
  price: number;
  cost?: number;
  reorderPoint?: number;
  isActive?: boolean;
};

export type UpdateVariantPayload = Partial<CreateVariantPayload>;

export async function fetchProductsList(
  params: ProductListParams = {},
): Promise<ProductListResponse> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.categoryId) searchParams.set("categoryId", params.categoryId);
  if (params.brand) searchParams.set("brand", params.brand);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  const qs = query ? `?${query}` : "";
  return apiRequest<ProductListResponse>(`/api/catalog/products${qs}`);
}

export async function fetchProductById(productId: string): Promise<Product> {
  return apiRequest<Product>(`/api/catalog/products/${productId}`);
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  return apiRequest<Product>("/api/catalog/products", { method: "POST", body: payload });
}

export async function updateProduct(id: string, payload: UpdateProductPayload): Promise<Product> {
  return apiRequest<Product>(`/api/catalog/products/${id}`, { method: "PATCH", body: payload });
}

export async function createVariant(productId: string, payload: CreateVariantPayload): Promise<ProductVariant> {
  return apiRequest<ProductVariant>(`/api/catalog/products/${productId}/variants`, {
    method: "POST",
    body: payload,
  });
}

export async function updateVariant(
  productId: string,
  variantId: string,
  payload: UpdateVariantPayload,
): Promise<ProductVariant> {
  return apiRequest<ProductVariant>(`/api/catalog/products/${productId}/variants/${variantId}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function deleteVariant(productId: string, variantId: string): Promise<void> {
  return apiRequest<void>(`/api/catalog/products/${productId}/variants/${variantId}`, {
    method: "DELETE",
  });
}
