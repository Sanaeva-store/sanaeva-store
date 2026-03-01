import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiClient from "@/shared/lib/http/api-client";

vi.mock("@/shared/lib/http/api-client", () => ({ apiRequest: vi.fn() }));
const mock = vi.mocked(apiClient.apiRequest);

describe("reports.api", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetchLowStockReport — no params calls /api/reports/low-stock", async () => {
    const { fetchLowStockReport } = await import("@/features/inventory/api/reports.api");
    mock.mockResolvedValueOnce({ items: [], total: 0 });
    await fetchLowStockReport();
    expect(mock).toHaveBeenCalledWith("/api/reports/low-stock");
  });

  it("fetchLowStockReport — appends warehouseId", async () => {
    const { fetchLowStockReport } = await import("@/features/inventory/api/reports.api");
    mock.mockResolvedValueOnce({ items: [], total: 0 });
    await fetchLowStockReport("wh-1");
    expect(mock).toHaveBeenCalledWith("/api/reports/low-stock?warehouseId=wh-1");
  });

  it("fetchSnapshotReport calls /api/reports/snapshot/:date", async () => {
    const { fetchSnapshotReport } = await import("@/features/inventory/api/reports.api");
    mock.mockResolvedValueOnce([]);
    await fetchSnapshotReport("2026-01-31");
    expect(mock).toHaveBeenCalledWith("/api/reports/snapshot/2026-01-31");
  });

  it("fetchTurnoverReport builds query params", async () => {
    const { fetchTurnoverReport } = await import("@/features/inventory/api/reports.api");
    mock.mockResolvedValueOnce([]);
    await fetchTurnoverReport({ from: "2026-01-01", to: "2026-01-31", warehouseId: "wh-1" });
    const url = mock.mock.calls[0][0] as string;
    expect(url).toContain("from=2026-01-01");
    expect(url).toContain("to=2026-01-31");
    expect(url).toContain("warehouseId=wh-1");
  });

  it("fetchDashboardSummary calls /api/reports/dashboard-summary", async () => {
    const { fetchDashboardSummary } = await import("@/features/inventory/api/reports.api");
    mock.mockResolvedValueOnce({ totalOrders: 10, lowStockCount: 3 });
    await fetchDashboardSummary();
    expect(mock).toHaveBeenCalledWith("/api/reports/dashboard-summary");
  });

  it("fetchPriceCostAnomalies — no param → no query string", async () => {
    const { fetchPriceCostAnomalies } = await import("@/features/inventory/api/reports.api");
    mock.mockResolvedValueOnce({ items: [], total: 0 });
    await fetchPriceCostAnomalies();
    expect(mock).toHaveBeenCalledWith("/api/reports/price-cost-anomalies");
  });

  it("fetchPriceCostAnomalies — with minMarginPct", async () => {
    const { fetchPriceCostAnomalies } = await import("@/features/inventory/api/reports.api");
    mock.mockResolvedValueOnce({ items: [], total: 0 });
    await fetchPriceCostAnomalies(20);
    expect(mock).toHaveBeenCalledWith("/api/reports/price-cost-anomalies?minMarginPct=20");
  });

  it("fetchProfitByOrder calls /api/reports/profit-by-order/:id", async () => {
    const { fetchProfitByOrder } = await import("@/features/inventory/api/reports.api");
    mock.mockResolvedValueOnce({ totalRevenue: "1000", grossProfit: "200" });
    await fetchProfitByOrder("ord-1");
    expect(mock).toHaveBeenCalledWith("/api/reports/profit-by-order/ord-1");
  });
});
