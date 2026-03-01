import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiClient from "@/shared/lib/http/api-client";

vi.mock("@/shared/lib/http/api-client", () => ({ apiRequest: vi.fn() }));
const mock = vi.mocked(apiClient.apiRequest);

describe("orders.api", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetchOrders — no params", async () => {
    const { fetchOrders } = await import("@/features/inventory/api/orders.api");
    mock.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
    await fetchOrders();
    expect(mock).toHaveBeenCalledWith("/api/orders");
  });

  it("fetchOrders — builds query for status + pagination", async () => {
    const { fetchOrders } = await import("@/features/inventory/api/orders.api");
    mock.mockResolvedValueOnce({ data: [], total: 0, page: 2, limit: 20, totalPages: 0 });
    await fetchOrders({ status: "PENDING", page: 2, limit: 10 });
    const url = mock.mock.calls[0][0] as string;
    expect(url).toContain("status=PENDING");
    expect(url).toContain("page=2");
    expect(url).toContain("limit=10");
  });

  it("fetchOrderById calls /api/orders/:id", async () => {
    const { fetchOrderById } = await import("@/features/inventory/api/orders.api");
    mock.mockResolvedValueOnce({ id: "ord-1" });
    await fetchOrderById("ord-1");
    expect(mock).toHaveBeenCalledWith("/api/orders/ord-1");
  });

  it("createOrder sends POST /api/orders", async () => {
    const { createOrder } = await import("@/features/inventory/api/orders.api");
    const payload = { items: [{ variantId: "v1", qty: 1, unitPrice: 299 }] };
    mock.mockResolvedValueOnce({ id: "ord-2" });
    await createOrder(payload);
    expect(mock).toHaveBeenCalledWith("/api/orders", { method: "POST", body: payload });
  });

  it("reserveOrderStock sends POST /api/orders/:id/reserve", async () => {
    const { reserveOrderStock } = await import("@/features/inventory/api/orders.api");
    mock.mockResolvedValueOnce({ id: "ord-1" });
    await reserveOrderStock("ord-1");
    expect(mock).toHaveBeenCalledWith("/api/orders/ord-1/reserve", { method: "POST" });
  });

  it("releaseOrderStock sends POST /api/orders/:id/release", async () => {
    const { releaseOrderStock } = await import("@/features/inventory/api/orders.api");
    mock.mockResolvedValueOnce({ id: "ord-1" });
    await releaseOrderStock("ord-1");
    expect(mock).toHaveBeenCalledWith("/api/orders/ord-1/release", { method: "POST" });
  });

  it("commitOrder sends POST /api/orders/:id/commit", async () => {
    const { commitOrder } = await import("@/features/inventory/api/orders.api");
    mock.mockResolvedValueOnce({ id: "ord-1" });
    await commitOrder("ord-1");
    expect(mock).toHaveBeenCalledWith("/api/orders/ord-1/commit", { method: "POST" });
  });

  it("updateOrderStatus sends PATCH /api/orders/:id/status with status body", async () => {
    const { updateOrderStatus } = await import("@/features/inventory/api/orders.api");
    mock.mockResolvedValueOnce({ id: "ord-1", status: "SHIPPED" });
    await updateOrderStatus("ord-1", "SHIPPED");
    expect(mock).toHaveBeenCalledWith("/api/orders/ord-1/status", {
      method: "PATCH",
      body: { status: "SHIPPED" },
    });
  });

  it("fetchOrderSummary calls /api/orders/summary", async () => {
    const { fetchOrderSummary } = await import("@/features/inventory/api/orders.api");
    mock.mockResolvedValueOnce({ totalOrders: 10, pendingOrders: 2 });
    await fetchOrderSummary();
    expect(mock).toHaveBeenCalledWith("/api/orders/summary");
  });
});
