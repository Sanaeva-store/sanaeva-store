import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiClient from "@/shared/lib/http/api-client";

vi.mock("@/shared/lib/http/api-client", () => ({
  apiRequest: vi.fn(),
}));

const mock = vi.mocked(apiClient.apiRequest);

describe("purchase-orders.api", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetchPurchaseOrders — no params → /api/purchase-orders", async () => {
    const { fetchPurchaseOrders } = await import("@/features/inventory/api/purchase-orders.api");
    mock.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
    await fetchPurchaseOrders();
    expect(mock).toHaveBeenCalledWith("/api/purchase-orders");
  });

  it("fetchPurchaseOrders — builds query for status + supplierId", async () => {
    const { fetchPurchaseOrders } = await import("@/features/inventory/api/purchase-orders.api");
    mock.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
    await fetchPurchaseOrders({ status: "DRAFT", supplierId: "sup-1", page: 2 });
    const url = mock.mock.calls[0][0] as string;
    expect(url).toContain("status=DRAFT");
    expect(url).toContain("supplierId=sup-1");
    expect(url).toContain("page=2");
  });

  it("fetchPurchaseOrderById calls /api/purchase-orders/:id", async () => {
    const { fetchPurchaseOrderById } = await import("@/features/inventory/api/purchase-orders.api");
    mock.mockResolvedValueOnce({ id: "po-1" });
    await fetchPurchaseOrderById("po-1");
    expect(mock).toHaveBeenCalledWith("/api/purchase-orders/po-1");
  });

  it("createPurchaseOrder sends POST with payload", async () => {
    const { createPurchaseOrder } = await import("@/features/inventory/api/purchase-orders.api");
    const payload = {
      supplierId: "sup-1",
      items: [{ variantId: "v1", qty: 10, unitCost: "100.00" }],
    };
    mock.mockResolvedValueOnce({ id: "po-2" });
    await createPurchaseOrder(payload);
    expect(mock).toHaveBeenCalledWith("/api/purchase-orders", {
      method: "POST",
      body: payload,
    });
  });

  it("approvePurchaseOrder sends PATCH /approve with no body", async () => {
    const { approvePurchaseOrder } = await import("@/features/inventory/api/purchase-orders.api");
    mock.mockResolvedValueOnce({ id: "po-1", status: "APPROVED" });
    await approvePurchaseOrder("po-1");
    expect(mock).toHaveBeenCalledWith("/api/purchase-orders/po-1/approve", {
      method: "PATCH",
    });
  });

  it("cancelPurchaseOrder sends PATCH /cancel", async () => {
    const { cancelPurchaseOrder } = await import("@/features/inventory/api/purchase-orders.api");
    mock.mockResolvedValueOnce({ id: "po-1", status: "CANCELLED" });
    await cancelPurchaseOrder("po-1");
    expect(mock).toHaveBeenCalledWith("/api/purchase-orders/po-1/cancel", {
      method: "PATCH",
    });
  });

  it("receivePurchaseOrder sends POST /receive with payload", async () => {
    const { receivePurchaseOrder } = await import("@/features/inventory/api/purchase-orders.api");
    const payload = {
      warehouseId: "wh-1",
      items: [{ variantId: "v1", qty: 5 }],
    };
    mock.mockResolvedValueOnce({ id: "po-1", status: "RECEIVED" });
    await receivePurchaseOrder("po-1", payload);
    expect(mock).toHaveBeenCalledWith("/api/purchase-orders/po-1/receive", {
      method: "POST",
      body: payload,
    });
  });
});
