import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiClient from "@/shared/lib/http/api-client";

vi.mock("@/shared/lib/http/api-client", () => ({ apiRequest: vi.fn() }));
const mock = vi.mocked(apiClient.apiRequest);

describe("stock-transfers.api", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetchStockTransfers — no params", async () => {
    const { fetchStockTransfers } = await import("@/features/inventory/api/stock-transfers.api");
    mock.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
    await fetchStockTransfers();
    expect(mock).toHaveBeenCalledWith("/api/stock-transfers");
  });

  it("createStockTransfer sends POST with payload", async () => {
    const { createStockTransfer } = await import("@/features/inventory/api/stock-transfers.api");
    const payload = {
      fromWarehouseId: "wh-1",
      toWarehouseId: "wh-2",
      items: [{ variantId: "v1", qty: 5 }],
    };
    mock.mockResolvedValueOnce({ id: "tr-1" });
    await createStockTransfer(payload);
    expect(mock).toHaveBeenCalledWith("/api/stock-transfers", {
      method: "POST",
      body: payload,
    });
  });

  it("approveStockTransfer sends POST /approve", async () => {
    const { approveStockTransfer } = await import("@/features/inventory/api/stock-transfers.api");
    mock.mockResolvedValueOnce({ id: "tr-1", status: "APPROVED" });
    await approveStockTransfer("tr-1");
    expect(mock).toHaveBeenCalledWith("/api/stock-transfers/tr-1/approve", {
      method: "POST",
    });
  });

  it("shipStockTransfer sends POST /ship", async () => {
    const { shipStockTransfer } = await import("@/features/inventory/api/stock-transfers.api");
    mock.mockResolvedValueOnce({ id: "tr-1", status: "IN_TRANSIT" });
    await shipStockTransfer("tr-1");
    expect(mock).toHaveBeenCalledWith("/api/stock-transfers/tr-1/ship", {
      method: "POST",
    });
  });

  it("receiveStockTransfer sends POST /receive with items payload", async () => {
    const { receiveStockTransfer } = await import("@/features/inventory/api/stock-transfers.api");
    const payload = { items: [{ variantId: "v1", qty: 5 }] };
    mock.mockResolvedValueOnce({ id: "tr-1", status: "RECEIVED" });
    await receiveStockTransfer("tr-1", payload);
    expect(mock).toHaveBeenCalledWith("/api/stock-transfers/tr-1/receive", {
      method: "POST",
      body: payload,
    });
  });

  it("completeStockTransfer sends POST /complete", async () => {
    const { completeStockTransfer } = await import("@/features/inventory/api/stock-transfers.api");
    mock.mockResolvedValueOnce({ id: "tr-1", status: "COMPLETED" });
    await completeStockTransfer("tr-1");
    expect(mock).toHaveBeenCalledWith("/api/stock-transfers/tr-1/complete", {
      method: "POST",
    });
  });

  it("cancelStockTransfer sends POST /cancel", async () => {
    const { cancelStockTransfer } = await import("@/features/inventory/api/stock-transfers.api");
    mock.mockResolvedValueOnce({ id: "tr-1", status: "CANCELLED" });
    await cancelStockTransfer("tr-1");
    expect(mock).toHaveBeenCalledWith("/api/stock-transfers/tr-1/cancel", {
      method: "POST",
    });
  });
});

describe("cycle-count.api", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetchCycleCounts — no params", async () => {
    const { fetchCycleCounts } = await import("@/features/inventory/api/cycle-count.api");
    mock.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
    await fetchCycleCounts();
    expect(mock).toHaveBeenCalledWith("/api/cycle-count");
  });

  it("createCycleCount sends POST with warehouseId", async () => {
    const { createCycleCount } = await import("@/features/inventory/api/cycle-count.api");
    const payload = { warehouseId: "wh-1" };
    mock.mockResolvedValueOnce({ id: "cc-1", status: "OPEN" });
    await createCycleCount(payload);
    expect(mock).toHaveBeenCalledWith("/api/cycle-count", {
      method: "POST",
      body: payload,
    });
  });

  it("submitCycleCount sends POST /count with items", async () => {
    const { submitCycleCount } = await import("@/features/inventory/api/cycle-count.api");
    const payload = { items: [{ variantId: "v1", countedQty: 10 }] };
    mock.mockResolvedValueOnce({ id: "cc-1", status: "IN_PROGRESS" });
    await submitCycleCount("cc-1", payload);
    expect(mock).toHaveBeenCalledWith("/api/cycle-count/cc-1/count", {
      method: "POST",
      body: payload,
    });
  });

  it("closeCycleCount sends POST /close", async () => {
    const { closeCycleCount } = await import("@/features/inventory/api/cycle-count.api");
    mock.mockResolvedValueOnce({ id: "cc-1", status: "CLOSED" });
    await closeCycleCount("cc-1");
    expect(mock).toHaveBeenCalledWith("/api/cycle-count/cc-1/close", {
      method: "POST",
    });
  });
});

describe("pricing.api", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetchPriceLists — no params", async () => {
    const { fetchPriceLists } = await import("@/features/inventory/api/pricing.api");
    mock.mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 });
    await fetchPriceLists();
    expect(mock).toHaveBeenCalledWith("/api/catalog/price-lists");
  });

  it("createPriceList sends POST", async () => {
    const { createPriceList } = await import("@/features/inventory/api/pricing.api");
    const payload = { name: "Wholesale" };
    mock.mockResolvedValueOnce({ id: "pl-1", name: "Wholesale" });
    await createPriceList(payload);
    expect(mock).toHaveBeenCalledWith("/api/catalog/price-lists", {
      method: "POST",
      body: payload,
    });
  });

  it("fetchPriceListItems calls /api/catalog/price-lists/:id/items", async () => {
    const { fetchPriceListItems } = await import("@/features/inventory/api/pricing.api");
    mock.mockResolvedValueOnce([]);
    await fetchPriceListItems("pl-1");
    expect(mock).toHaveBeenCalledWith("/api/catalog/price-lists/pl-1/items");
  });

  it("addPriceListItem sends POST with variantId + price", async () => {
    const { addPriceListItem } = await import("@/features/inventory/api/pricing.api");
    const payload = { variantId: "v1", price: 249 };
    mock.mockResolvedValueOnce({ id: "pli-1" });
    await addPriceListItem("pl-1", payload);
    expect(mock).toHaveBeenCalledWith("/api/catalog/price-lists/pl-1/items", {
      method: "POST",
      body: payload,
    });
  });
});

describe("backoffice-auth.api", () => {
  beforeEach(() => vi.clearAllMocks());

  it("backofficeLogin sends POST /api/auth/login", async () => {
    const { backofficeLogin } = await import("@/features/inventory/api/backoffice-auth.api");
    const payload = { email: "admin@example.com", password: "secret123" };
    mock.mockResolvedValueOnce({ user: { id: "usr-1" }, tokens: { accessToken: "tok" } });
    await backofficeLogin(payload);
    expect(mock).toHaveBeenCalledWith("/api/auth/login", {
      method: "POST",
      body: payload,
    });
  });

  it("backofficeLogout sends POST /api/auth/logout", async () => {
    const { backofficeLogout } = await import("@/features/inventory/api/backoffice-auth.api");
    mock.mockResolvedValueOnce(undefined);
    await backofficeLogout({ refreshToken: "rt-1" });
    expect(mock).toHaveBeenCalledWith("/api/auth/logout", {
      method: "POST",
      body: { refreshToken: "rt-1" },
    });
  });

  it("fetchBackofficeMe calls GET /api/auth/me", async () => {
    const { fetchBackofficeMe } = await import("@/features/inventory/api/backoffice-auth.api");
    mock.mockResolvedValueOnce({ id: "usr-1", email: "admin@example.com" });
    await fetchBackofficeMe();
    expect(mock).toHaveBeenCalledWith("/api/auth/me");
  });

  it("fetchBackofficeSessions calls GET /api/auth/sessions", async () => {
    const { fetchBackofficeSessions } = await import("@/features/inventory/api/backoffice-auth.api");
    mock.mockResolvedValueOnce([]);
    await fetchBackofficeSessions();
    expect(mock).toHaveBeenCalledWith("/api/auth/sessions");
  });
});
