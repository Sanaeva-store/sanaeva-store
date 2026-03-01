import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiClient from "@/shared/lib/http/api-client";

vi.mock("@/shared/lib/http/api-client", () => ({
  apiRequest: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

const mockApiRequest = vi.mocked(apiClient.apiRequest);

describe("suppliers.api", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("fetchSuppliers", () => {
    it("calls /api/suppliers without params", async () => {
      const { fetchSuppliers } = await import("@/features/inventory/api/suppliers.api");
      mockApiRequest.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
      await fetchSuppliers();
      expect(mockApiRequest).toHaveBeenCalledWith("/api/suppliers");
    });

    it("builds query string for page and limit", async () => {
      const { fetchSuppliers } = await import("@/features/inventory/api/suppliers.api");
      mockApiRequest.mockResolvedValueOnce({ data: [], total: 0, page: 2, limit: 5, totalPages: 0 });
      await fetchSuppliers({ page: 2, limit: 5 });
      expect(mockApiRequest).toHaveBeenCalledWith("/api/suppliers?page=2&limit=5");
    });
  });

  describe("fetchSupplierById", () => {
    it("calls /api/suppliers/:id", async () => {
      const { fetchSupplierById } = await import("@/features/inventory/api/suppliers.api");
      mockApiRequest.mockResolvedValueOnce({ id: "sup-1", name: "ACME" });
      await fetchSupplierById("sup-1");
      expect(mockApiRequest).toHaveBeenCalledWith("/api/suppliers/sup-1");
    });
  });

  describe("createSupplier", () => {
    it("sends POST /api/suppliers with payload", async () => {
      const { createSupplier } = await import("@/features/inventory/api/suppliers.api");
      const payload = { name: "ACME", email: "acme@example.com" };
      mockApiRequest.mockResolvedValueOnce({ id: "sup-2", ...payload, isActive: true });
      await createSupplier(payload);
      expect(mockApiRequest).toHaveBeenCalledWith("/api/suppliers", {
        method: "POST",
        body: payload,
      });
    });
  });

  describe("updateSupplier", () => {
    it("sends PATCH /api/suppliers/:id with partial payload", async () => {
      const { updateSupplier } = await import("@/features/inventory/api/suppliers.api");
      mockApiRequest.mockResolvedValueOnce({ id: "sup-1", name: "Updated" });
      await updateSupplier("sup-1", { name: "Updated" });
      expect(mockApiRequest).toHaveBeenCalledWith("/api/suppliers/sup-1", {
        method: "PATCH",
        body: { name: "Updated" },
      });
    });
  });

  describe("toggleSupplierStatus", () => {
    it("sends PATCH /api/suppliers/:id/status with no body", async () => {
      const { toggleSupplierStatus } = await import("@/features/inventory/api/suppliers.api");
      mockApiRequest.mockResolvedValueOnce({ id: "sup-1", isActive: false });
      await toggleSupplierStatus("sup-1");
      expect(mockApiRequest).toHaveBeenCalledWith("/api/suppliers/sup-1/status", {
        method: "PATCH",
      });
    });
  });
});
