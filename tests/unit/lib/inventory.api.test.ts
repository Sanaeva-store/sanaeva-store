import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiClient from "@/shared/lib/http/api-client";

vi.mock("@/shared/lib/http/api-client", () => ({
  apiRequest: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    code?: string;
    constructor(message: string, status: number, code?: string) {
      super(message);
      this.status = status;
      this.code = code;
    }
  },
}));

const mockApiRequest = vi.mocked(apiClient.apiRequest);

describe("inventory.api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchLowStock", () => {
    it("calls /api/inventory/low-stock without warehouseId", async () => {
      const { fetchLowStock } = await import("@/features/inventory/api/inventory.api");
      mockApiRequest.mockResolvedValueOnce([]);
      await fetchLowStock();
      expect(mockApiRequest).toHaveBeenCalledWith("/api/inventory/low-stock");
    });

    it("appends warehouseId query param when provided", async () => {
      const { fetchLowStock } = await import("@/features/inventory/api/inventory.api");
      mockApiRequest.mockResolvedValueOnce([]);
      await fetchLowStock("wh-1");
      expect(mockApiRequest).toHaveBeenCalledWith(
        "/api/inventory/low-stock?warehouseId=wh-1",
      );
    });
  });

  describe("fetchTransactions", () => {
    it("builds correct query string with all filters", async () => {
      const { fetchTransactions } = await import("@/features/inventory/api/inventory.api");
      mockApiRequest.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
      await fetchTransactions({
        variantId: "v1",
        warehouseId: "wh1",
        type: "INBOUND",
        from: "2026-01-01",
        to: "2026-01-31",
        page: 2,
        limit: 50,
      });
      const url = mockApiRequest.mock.calls[0][0] as string;
      expect(url).toContain("variantId=v1");
      expect(url).toContain("warehouseId=wh1");
      expect(url).toContain("type=INBOUND");
      expect(url).toContain("from=2026-01-01");
      expect(url).toContain("to=2026-01-31");
      expect(url).toContain("page=2");
      expect(url).toContain("limit=50");
    });

    it("caps limit at 200", async () => {
      const { fetchTransactions } = await import("@/features/inventory/api/inventory.api");
      mockApiRequest.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 200, totalPages: 0 });
      await fetchTransactions({ limit: 999 });
      const url = mockApiRequest.mock.calls[0][0] as string;
      expect(url).toContain("limit=200");
    });
  });

  describe("initializeStock", () => {
    it("sends POST /api/inventory/initialize with correct payload", async () => {
      const { initializeStock } = await import("@/features/inventory/api/inventory.api");
      const payload = { variantId: "v1", warehouseId: "wh1", qty: 10 };
      mockApiRequest.mockResolvedValueOnce({ id: "txn-1", type: "INITIALIZE" });
      await initializeStock(payload);
      expect(mockApiRequest).toHaveBeenCalledWith(
        "/api/inventory/initialize",
        { method: "POST", body: payload },
      );
    });
  });

  describe("adjustStock", () => {
    it("sends POST /api/inventory/adjust with idempotencyKey required", async () => {
      const { adjustStock } = await import("@/features/inventory/api/inventory.api");
      const payload = {
        variantId: "v1",
        warehouseId: "wh1",
        qty: -5,
        reasonCode: "DAMAGE" as const,
        idempotencyKey: "idem-123",
      };
      mockApiRequest.mockResolvedValueOnce({ id: "txn-2", type: "ADJUST" });
      await adjustStock(payload);
      expect(mockApiRequest).toHaveBeenCalledWith("/api/inventory/adjust", {
        method: "POST",
        body: payload,
      });
    });
  });

  describe("receiveStock", () => {
    it("sends POST /api/inventory/receive and returns GoodsReceiptResponseDto", async () => {
      const { receiveStock } = await import("@/features/inventory/api/inventory.api");
      const payload = {
        warehouseId: "wh1",
        items: [{ variantId: "v1", qty: 20 }],
      };
      mockApiRequest.mockResolvedValueOnce({ id: "grn-1", code: "GRN-001", transactions: [] });
      const result = await receiveStock(payload);
      expect(result).toMatchObject({ id: "grn-1", code: "GRN-001" });
    });
  });

  describe("fetchStockBalance", () => {
    it("calls correct URL with optional params", async () => {
      const { fetchStockBalance } = await import("@/features/inventory/api/inventory.api");
      mockApiRequest.mockResolvedValueOnce({ variantId: "v1", onHand: 10, reserved: 0, available: 10 });
      await fetchStockBalance("v1", "wh1", "loc1");
      const url = mockApiRequest.mock.calls[0][0] as string;
      expect(url).toContain("/api/inventory/balance/v1");
      expect(url).toContain("warehouseId=wh1");
      expect(url).toContain("locationId=loc1");
    });

    it("calls without optional params", async () => {
      const { fetchStockBalance } = await import("@/features/inventory/api/inventory.api");
      mockApiRequest.mockResolvedValueOnce({ variantId: "v1", onHand: 5 });
      await fetchStockBalance("v1");
      expect(mockApiRequest).toHaveBeenCalledWith("/api/inventory/balance/v1");
    });
  });

  describe("completePutaway", () => {
    it("sends POST /api/inventory/putaway/:grnId", async () => {
      const { completePutaway } = await import("@/features/inventory/api/inventory.api");
      mockApiRequest.mockResolvedValueOnce({ grnId: "grn-1", putawayAt: "2026-02-24" });
      await completePutaway("grn-1");
      expect(mockApiRequest).toHaveBeenCalledWith(
        "/api/inventory/putaway/grn-1",
        { method: "POST" },
      );
    });
  });
});
