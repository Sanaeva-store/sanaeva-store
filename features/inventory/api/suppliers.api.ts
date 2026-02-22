import { apiRequest } from "@/shared/lib/http/api-client";
import type { PaginatedResponse } from "@/shared/types/api";

/**
 * Supplier model matching backend DTO exactly.
 * Fields: id, name, email, phone, isActive, timestamps.
 * Removed: code, contactName, address, note (not in backend schema).
 */
export type Supplier = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SupplierListResponse = PaginatedResponse<Supplier>;

/**
 * Create payload — only fields accepted by POST /api/suppliers DTO.
 */
export type CreateSupplierPayload = {
  name: string;
  email?: string;
  phone?: string;
};

/**
 * Update payload — same fields as create, all optional (PATCH /api/suppliers/:id).
 */
export type UpdateSupplierPayload = Partial<CreateSupplierPayload>;

/**
 * Fetch suppliers list.
 * NOTE: backend does not support `search` param yet — only page/limit.
 */
export async function fetchSuppliers(params: { page?: number; limit?: number } = {}): Promise<SupplierListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
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

/**
 * Toggle supplier active/inactive status.
 * PATCH /api/suppliers/:id/status — no request body.
 */
export async function toggleSupplierStatus(id: string): Promise<Supplier> {
  return apiRequest<Supplier>(`/api/suppliers/${id}/status`, { method: "PATCH" });
}
