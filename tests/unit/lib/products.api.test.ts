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

describe("products.api (catalog)", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("fetchProductsList", () => {
    it("calls /api/catalog/products without params", async () => {
      const { fetchProductsList } = await import("@/features/storefront/api/products.api");
      mockApiRequest.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
      await fetchProductsList();
      expect(mockApiRequest).toHaveBeenCalledWith("/api/catalog/products");
    });

    it("builds query string with all params", async () => {
      const { fetchProductsList } = await import("@/features/storefront/api/products.api");
      mockApiRequest.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
      await fetchProductsList({
        search: "shirt",
        status: "ACTIVE",
        sortBy: "title",
        sortOrder: "asc",
        page: 2,
        limit: 10,
      });
      const url = mockApiRequest.mock.calls[0][0] as string;
      expect(url).toContain("search=shirt");
      expect(url).toContain("status=ACTIVE");
      expect(url).toContain("sortBy=title");
      expect(url).toContain("sortOrder=asc");
      expect(url).toContain("page=2");
      expect(url).toContain("limit=10");
    });

    it("uses uppercase ProductStatus enum values", async () => {
      const { fetchProductsList } = await import("@/features/storefront/api/products.api");
      mockApiRequest.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
      await fetchProductsList({ status: "DRAFT" });
      expect(mockApiRequest.mock.calls[0][0]).toContain("status=DRAFT");
    });
  });

  describe("fetchProductById", () => {
    it("calls /api/catalog/products/:id", async () => {
      const { fetchProductById } = await import("@/features/storefront/api/products.api");
      mockApiRequest.mockResolvedValueOnce({ id: "prod-1", title: "T-Shirt" });
      await fetchProductById("prod-1");
      expect(mockApiRequest).toHaveBeenCalledWith("/api/catalog/products/prod-1");
    });
  });

  describe("createProduct", () => {
    it("sends POST /api/catalog/products", async () => {
      const { createProduct } = await import("@/features/storefront/api/products.api");
      const payload = { title: "New Shirt", status: "ACTIVE" as const };
      mockApiRequest.mockResolvedValueOnce({ id: "prod-2", ...payload });
      await createProduct(payload);
      expect(mockApiRequest).toHaveBeenCalledWith("/api/catalog/products", {
        method: "POST",
        body: payload,
      });
    });
  });

  describe("deleteProduct", () => {
    it("sends DELETE /api/catalog/products/:id", async () => {
      const { deleteProduct } = await import("@/features/storefront/api/products.api");
      mockApiRequest.mockResolvedValueOnce({ id: "prod-1", status: "INACTIVE" });
      await deleteProduct("prod-1");
      expect(mockApiRequest).toHaveBeenCalledWith("/api/catalog/products/prod-1", {
        method: "DELETE",
      });
    });
  });

  describe("fetchVariantsList", () => {
    it("calls /api/catalog/products/:productId/variants", async () => {
      const { fetchVariantsList } = await import("@/features/storefront/api/products.api");
      mockApiRequest.mockResolvedValueOnce([]);
      await fetchVariantsList("prod-1");
      expect(mockApiRequest).toHaveBeenCalledWith(
        "/api/catalog/products/prod-1/variants",
      );
    });
  });

  describe("fetchVariantById", () => {
    it("calls /api/catalog/products/:productId/variants/:variantId", async () => {
      const { fetchVariantById } = await import("@/features/storefront/api/products.api");
      mockApiRequest.mockResolvedValueOnce({ id: "var-1", sku: "SKU-001" });
      await fetchVariantById("prod-1", "var-1");
      expect(mockApiRequest).toHaveBeenCalledWith(
        "/api/catalog/products/prod-1/variants/var-1",
      );
    });
  });

  describe("createVariant", () => {
    it("sends POST /api/catalog/products/:productId/variants", async () => {
      const { createVariant } = await import("@/features/storefront/api/products.api");
      const payload = { sku: "SKU-002", price: 299 };
      mockApiRequest.mockResolvedValueOnce({ id: "var-2", ...payload });
      await createVariant("prod-1", payload);
      expect(mockApiRequest).toHaveBeenCalledWith(
        "/api/catalog/products/prod-1/variants",
        { method: "POST", body: payload },
      );
    });
  });

  describe("deleteVariant", () => {
    it("sends DELETE /api/catalog/products/:productId/variants/:variantId", async () => {
      const { deleteVariant } = await import("@/features/storefront/api/products.api");
      mockApiRequest.mockResolvedValueOnce(undefined);
      await deleteVariant("prod-1", "var-1");
      expect(mockApiRequest).toHaveBeenCalledWith(
        "/api/catalog/products/prod-1/variants/var-1",
        { method: "DELETE" },
      );
    });
  });

  describe("Product Images", () => {
    it("fetchProductImages calls /api/catalog/products/:productId/images", async () => {
      const { fetchProductImages } = await import("@/features/storefront/api/products.api");
      mockApiRequest.mockResolvedValueOnce([]);
      await fetchProductImages("prod-1");
      expect(mockApiRequest).toHaveBeenCalledWith(
        "/api/catalog/products/prod-1/images",
      );
    });

    it("createProductImage sends POST with url and sortOrder", async () => {
      const { createProductImage } = await import("@/features/storefront/api/products.api");
      const payload = { url: "https://cdn.example.com/img.jpg", sortOrder: 1 };
      mockApiRequest.mockResolvedValueOnce({ id: "img-1", ...payload });
      await createProductImage("prod-1", payload);
      expect(mockApiRequest).toHaveBeenCalledWith(
        "/api/catalog/products/prod-1/images",
        { method: "POST", body: payload },
      );
    });

    it("updateProductImage sends PATCH with imageId", async () => {
      const { updateProductImage } = await import("@/features/storefront/api/products.api");
      mockApiRequest.mockResolvedValueOnce({ id: "img-1", sortOrder: 2 });
      await updateProductImage("prod-1", "img-1", { sortOrder: 2 });
      expect(mockApiRequest).toHaveBeenCalledWith(
        "/api/catalog/products/prod-1/images/img-1",
        { method: "PATCH", body: { sortOrder: 2 } },
      );
    });

    it("deleteProductImage sends DELETE for image", async () => {
      const { deleteProductImage } = await import("@/features/storefront/api/products.api");
      mockApiRequest.mockResolvedValueOnce(undefined);
      await deleteProductImage("prod-1", "img-1");
      expect(mockApiRequest).toHaveBeenCalledWith(
        "/api/catalog/products/prod-1/images/img-1",
        { method: "DELETE" },
      );
    });
  });
});
