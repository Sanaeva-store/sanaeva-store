import { apiRequest } from "@/shared/lib/http/api-client";

export type LowStockReportItem = {
  variantId: string;
  sku: string;
  warehouseId: string;
  available: number;
  reorderPoint: number;
  shortage: number;
};

export type LowStockReport = {
  items: LowStockReportItem[];
  total: number;
};

export type SnapshotReportItem = {
  variantId: string;
  sku: string;
  warehouseId: string;
  onHand: number;
  reserved: number;
  available: number;
  snapshotDate: string;
};

export type TurnoverReportItem = {
  variantId: string;
  sku: string;
  soldQty: number;
  /** Decimal string */
  soldValue: string;
  turnoverRate: number;
  period: string;
};

export type AgingReportItem = {
  variantId: string;
  sku: string;
  warehouseId: string;
  receivedAt: string;
  ageDays: number;
  onHand: number;
};

export type DeadStockItem = {
  variantId: string;
  sku: string;
  warehouseId: string;
  onHand: number;
  lastMovedAt?: string | null;
  ageDays: number;
};

export type ProfitSummaryReport = {
  totalRevenue: string;
  totalCost: string;
  grossProfit: string;
  grossMarginPct: number;
  period: string;
};

export type ProfitBySkuItem = {
  variantId: string;
  sku: string;
  revenue: string;
  cost: string;
  grossProfit: string;
  grossMarginPct: number;
};

export type ProfitByCategoryItem = {
  categoryId: string;
  categoryName: string;
  revenue: string;
  cost: string;
  grossProfit: string;
  grossMarginPct: number;
};

export type PriceCostAnomalyType =
  | "MISSING_COST"
  | "COST_EXCEEDS_PRICE"
  | "ZERO_MARGIN"
  | "BELOW_THRESHOLD";

export type PriceCostAnomalyItem = {
  variantId: string;
  sku: string;
  price: string;
  cost: string | null;
  anomalyType: PriceCostAnomalyType;
  marginPct: number | null;
};

export type PriceCostAnomalyReport = {
  items: PriceCostAnomalyItem[];
  total: number;
};

export type DashboardSummary = {
  totalRevenue: string;
  totalOrders: number;
  pendingOrders: number;
  lowStockCount: number;
  topSellingVariants: {
    variantId: string;
    sku: string;
    soldQty: number;
  }[];
};

export async function fetchLowStockReport(warehouseId?: string): Promise<LowStockReport> {
  const qs = warehouseId ? `?warehouseId=${warehouseId}` : "";
  return apiRequest<LowStockReport>(`/api/reports/low-stock${qs}`);
}

export async function fetchSnapshotReport(date: string): Promise<SnapshotReportItem[]> {
  return apiRequest<SnapshotReportItem[]>(`/api/reports/snapshot/${date}`);
}

export async function fetchTurnoverReport(params?: {
  from?: string;
  to?: string;
  warehouseId?: string;
}): Promise<TurnoverReportItem[]> {
  const searchParams = new URLSearchParams();
  if (params?.from) searchParams.set("from", params.from);
  if (params?.to) searchParams.set("to", params.to);
  if (params?.warehouseId) searchParams.set("warehouseId", params.warehouseId);
  const qs = searchParams.toString();
  return apiRequest<TurnoverReportItem[]>(`/api/reports/turnover${qs ? `?${qs}` : ""}`);
}

export async function fetchAgingReport(warehouseId?: string): Promise<AgingReportItem[]> {
  const qs = warehouseId ? `?warehouseId=${warehouseId}` : "";
  return apiRequest<AgingReportItem[]>(`/api/reports/aging${qs}`);
}

export async function fetchDeadStockReport(warehouseId?: string): Promise<DeadStockItem[]> {
  const qs = warehouseId ? `?warehouseId=${warehouseId}` : "";
  return apiRequest<DeadStockItem[]>(`/api/reports/dead-stock${qs}`);
}

export async function fetchProfitSummary(params?: {
  from?: string;
  to?: string;
}): Promise<ProfitSummaryReport> {
  const searchParams = new URLSearchParams();
  if (params?.from) searchParams.set("from", params.from);
  if (params?.to) searchParams.set("to", params.to);
  const qs = searchParams.toString();
  return apiRequest<ProfitSummaryReport>(`/api/reports/profit-summary${qs ? `?${qs}` : ""}`);
}

export async function fetchProfitBySku(params?: {
  from?: string;
  to?: string;
}): Promise<ProfitBySkuItem[]> {
  const searchParams = new URLSearchParams();
  if (params?.from) searchParams.set("from", params.from);
  if (params?.to) searchParams.set("to", params.to);
  const qs = searchParams.toString();
  return apiRequest<ProfitBySkuItem[]>(`/api/reports/profit-by-sku${qs ? `?${qs}` : ""}`);
}

export async function fetchProfitByCategory(params?: {
  from?: string;
  to?: string;
}): Promise<ProfitByCategoryItem[]> {
  const searchParams = new URLSearchParams();
  if (params?.from) searchParams.set("from", params.from);
  if (params?.to) searchParams.set("to", params.to);
  const qs = searchParams.toString();
  return apiRequest<ProfitByCategoryItem[]>(
    `/api/reports/profit-by-category${qs ? `?${qs}` : ""}`,
  );
}

export async function fetchProfitByOrder(orderId: string): Promise<ProfitSummaryReport> {
  return apiRequest<ProfitSummaryReport>(`/api/reports/profit-by-order/${orderId}`);
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return apiRequest<DashboardSummary>("/api/reports/dashboard-summary");
}

export async function fetchPriceCostAnomalies(
  minMarginPct?: number,
): Promise<PriceCostAnomalyReport> {
  const qs = minMarginPct !== undefined ? `?minMarginPct=${minMarginPct}` : "";
  return apiRequest<PriceCostAnomalyReport>(`/api/reports/price-cost-anomalies${qs}`);
}
