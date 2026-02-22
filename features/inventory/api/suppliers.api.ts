import { apiRequest } from "@/shared/lib/http/api-client";

export type Supplier = {
  id: string;
  code: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export type SupplierListResponse = {
  items: Supplier[];
  total: number;
  page: number;
  limit: number;
};

export type CreateSupplierPayload = {
  code: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  note?: string;
};

export type UpdateSupplierPayload = Partial<CreateSupplierPayload>;

export async function fetchSuppliers(params: { page?: number; limit?: number; search?: string } = {}): Promise<SupplierListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  const query = searchParams.toString();
  return apiRequest<SupplierListResponse>(`/api/suppliers${query ? `?${query}` : ""}`);
}

export async function fetchSupplierById(id: string): Promise<Supplier> {
  return apiRequest<Supplier>(`/api/suppliers/${id}`);
}

export async function createSupplier(payload: CreateSupplierPayload): Promise<Supplier> {
  return apiRequest<Supplier>("/api/suppliers", { method: "POST", body: payload });
}

export async function updateSupplier(id: string, payload: UpdateSupplierPayload): Promise<Supplier> {
  return apiRequest<Supplier>(`/api/suppliers/${id}`, { method: "PATCH", body: payload });
}
