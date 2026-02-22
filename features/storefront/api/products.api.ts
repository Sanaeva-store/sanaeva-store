import { apiRequest } from "@/shared/lib/http/api-client";

export type ProductStatus = "active" | "inactive" | "draft";

export type ProductVariant = {
  id: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: Record<string, string>;
  imageUrl?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: ProductStatus;
  categoryId?: string;
  categoryName?: string;
  images: string[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
};

export type ProductListParams = {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "popular";
};

export type ProductListResponse = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
};

export async function fetchProductsList(
  params: ProductListParams = {},
): Promise<ProductListResponse> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.category) searchParams.set("category", params.category);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.sort) searchParams.set("sort", params.sort);

  const query = searchParams.toString();
  return apiRequest<ProductListResponse>(
    `/api/catalog/products${query ? `?${query}` : ""}`,
  );
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  return apiRequest<Product>(`/api/catalog/products/slug/${slug}`);
}

export async function fetchProductById(productId: string): Promise<Product> {
  return apiRequest<Product>(`/api/catalog/products/${productId}`);
}
