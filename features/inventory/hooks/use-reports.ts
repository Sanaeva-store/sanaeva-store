import { useQuery } from "@tanstack/react-query";
import {
  fetchLowStockReport,
  fetchSnapshotReport,
  fetchTurnoverReport,
  fetchAgingReport,
  fetchDeadStockReport,
  fetchProfitSummary,
  fetchProfitBySku,
  fetchProfitByCategory,
  fetchProfitByOrder,
  fetchDashboardSummary,
  fetchPriceCostAnomalies,
} from "@/features/inventory/api/reports.api";

const reportKeys = {
  all: ["reports"] as const,
  dashboardSummary: () => ["reports", "dashboard-summary"] as const,
  lowStock: (warehouseId?: string) =>
    ["reports", "low-stock", warehouseId ?? "all"] as const,
  snapshot: (date: string) => ["reports", "snapshot", date] as const,
  turnover: (from?: string, to?: string, warehouseId?: string) =>
    ["reports", "turnover", from ?? "", to ?? "", warehouseId ?? "all"] as const,
  aging: (warehouseId?: string) =>
    ["reports", "aging", warehouseId ?? "all"] as const,
  deadStock: (warehouseId?: string) =>
    ["reports", "dead-stock", warehouseId ?? "all"] as const,
  profitSummary: (from?: string, to?: string) =>
    ["reports", "profit-summary", from ?? "", to ?? ""] as const,
  profitBySku: (from?: string, to?: string) =>
    ["reports", "profit-by-sku", from ?? "", to ?? ""] as const,
  profitByCategory: (from?: string, to?: string) =>
    ["reports", "profit-by-category", from ?? "", to ?? ""] as const,
  profitByOrder: (orderId: string) =>
    ["reports", "profit-by-order", orderId] as const,
  priceCostAnomalies: (minMarginPct?: number) =>
    ["reports", "price-cost-anomalies", minMarginPct ?? 0] as const,
};

export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: reportKeys.dashboardSummary(),
    queryFn: fetchDashboardSummary,
  });
}

export function useLowStockReportQuery(warehouseId?: string) {
  return useQuery({
    queryKey: reportKeys.lowStock(warehouseId),
    queryFn: () => fetchLowStockReport(warehouseId),
  });
}

export function useSnapshotReportQuery(date: string) {
  return useQuery({
    queryKey: reportKeys.snapshot(date),
    queryFn: () => fetchSnapshotReport(date),
    enabled: Boolean(date),
  });
}

export function useTurnoverReportQuery(params?: {
  from?: string;
  to?: string;
  warehouseId?: string;
}) {
  return useQuery({
    queryKey: reportKeys.turnover(params?.from, params?.to, params?.warehouseId),
    queryFn: () => fetchTurnoverReport(params),
  });
}

export function useAgingReportQuery(warehouseId?: string) {
  return useQuery({
    queryKey: reportKeys.aging(warehouseId),
    queryFn: () => fetchAgingReport(warehouseId),
  });
}

export function useDeadStockReportQuery(warehouseId?: string) {
  return useQuery({
    queryKey: reportKeys.deadStock(warehouseId),
    queryFn: () => fetchDeadStockReport(warehouseId),
  });
}

export function useProfitSummaryQuery(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: reportKeys.profitSummary(params?.from, params?.to),
    queryFn: () => fetchProfitSummary(params),
  });
}

export function useProfitBySkuQuery(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: reportKeys.profitBySku(params?.from, params?.to),
    queryFn: () => fetchProfitBySku(params),
  });
}

export function useProfitByCategoryQuery(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: reportKeys.profitByCategory(params?.from, params?.to),
    queryFn: () => fetchProfitByCategory(params),
  });
}

export function useProfitByOrderQuery(orderId: string) {
  return useQuery({
    queryKey: reportKeys.profitByOrder(orderId),
    queryFn: () => fetchProfitByOrder(orderId),
    enabled: Boolean(orderId),
  });
}

export function usePriceCostAnomaliesQuery(minMarginPct?: number) {
  return useQuery({
    queryKey: reportKeys.priceCostAnomalies(minMarginPct),
    queryFn: () => fetchPriceCostAnomalies(minMarginPct),
  });
}
