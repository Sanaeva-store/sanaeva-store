export const queryKeys = {
  inventory: {
    all: ["inventory"] as const,
    lowStock: (warehouseId?: string) =>
      ["inventory", "low-stock", warehouseId ?? "all"] as const,
    transactions: (filters: {
      warehouseId?: string;
      variantId?: string;
      type?: string;
      createdById?: string;
      from?: string;
      to?: string;
      page?: number;
    }) =>
      [
        "inventory",
        "transactions",
        filters.warehouseId ?? "all",
        filters.variantId ?? "all",
        filters.type ?? "all",
        filters.createdById ?? "all",
        filters.from ?? "",
        filters.to ?? "",
        filters.page ?? 1,
      ] as const,
  },
  products: {
    all: ["products"] as const,
    list: (params: { search?: string; page?: number; category?: string }) =>
      [
        "products",
        "list",
        params.search ?? "",
        params.category ?? "all",
        params.page ?? 1,
      ] as const,
    detail: (productId: string) => ["products", "detail", productId] as const,
  },
  catalog: {
    all: ["catalog-products"] as const,
    list: (params: { search?: string; status?: string; page?: number }) =>
      ["catalog-products", "list", params.page ?? 1, params.search ?? "", params.status ?? "all"] as const,
    detail: (id: string) => ["catalog-products", "detail", id] as const,
    variants: (productId: string) => ["catalog-products", "variants", productId] as const,
    variant: (productId: string, variantId: string) =>
      ["catalog-products", "variant", productId, variantId] as const,
    images: (productId: string) => ["catalog-products", "images", productId] as const,
  },
  purchaseOrders: {
    all: ["purchase-orders"] as const,
    list: (params: { page?: number; status?: string; supplierId?: string }) =>
      ["purchase-orders", "list", params.page ?? 1, params.status ?? "all", params.supplierId ?? "all"] as const,
    detail: (id: string) => ["purchase-orders", "detail", id] as const,
  },
  orders: {
    all: ["orders"] as const,
    summary: () => ["orders", "summary"] as const,
    list: (params: { page?: number; status?: string }) =>
      ["orders", "list", params.page ?? 1, params.status ?? "all"] as const,
    detail: (id: string) => ["orders", "detail", id] as const,
  },
  reports: {
    all: ["reports"] as const,
    dashboardSummary: () => ["reports", "dashboard-summary"] as const,
    lowStock: (warehouseId?: string) => ["reports", "low-stock", warehouseId ?? "all"] as const,
    snapshot: (date: string) => ["reports", "snapshot", date] as const,
    priceCostAnomalies: (minMarginPct?: number) =>
      ["reports", "price-cost-anomalies", minMarginPct ?? 0] as const,
  },
  promotions: {
    all: ["promotions"] as const,
    list: (params: { page?: number; isActive?: boolean }) =>
      ["promotions", "list", params.page ?? 1, params.isActive] as const,
    detail: (id: string) => ["promotions", "detail", id] as const,
    stackingRules: (id: string) => ["promotions", "stacking-rules", id] as const,
  },
  adminUsers: {
    all: ["admin-users"] as const,
    list: (params: { page?: number; status?: string }) =>
      ["admin-users", "list", params.page ?? 1, params.status ?? "all"] as const,
    detail: (id: string) => ["admin-users", "detail", id] as const,
    permissions: () => ["admin-users", "permissions"] as const,
  },
  auditLogs: {
    all: ["audit-logs"] as const,
    list: (params: { page?: number }) =>
      ["audit-logs", "list", params.page ?? 1] as const,
    detail: (id: string) => ["audit-logs", "detail", id] as const,
  },
  approvals: {
    all: ["approvals"] as const,
    list: (page = 1) => ["approvals", "list", page] as const,
    detail: (id: string) => ["approvals", "detail", id] as const,
  },
  stockTransfers: {
    all: ["stock-transfers"] as const,
    list: (params: { page?: number; status?: string }) =>
      ["stock-transfers", "list", params.page ?? 1, params.status ?? "all"] as const,
    detail: (id: string) => ["stock-transfers", "detail", id] as const,
  },
  cycleCount: {
    all: ["cycle-count"] as const,
    list: (params: { page?: number; warehouseId?: string; status?: string }) =>
      ["cycle-count", "list", params.page ?? 1, params.warehouseId ?? "all", params.status ?? "all"] as const,
    detail: (id: string) => ["cycle-count", "detail", id] as const,
  },
  priceLists: {
    all: ["price-lists"] as const,
    list: (page = 1) => ["price-lists", "list", page] as const,
    detail: (id: string) => ["price-lists", "detail", id] as const,
    items: (id: string) => ["price-lists", "items", id] as const,
  },
  suppliers: {
    all: ["suppliers"] as const,
    list: (page = 1) => ["suppliers", "list", page] as const,
    detail: (id: string) => ["suppliers", "detail", id] as const,
  },
  cart: {
    all: ["cart"] as const,
    detail: () => ["cart", "detail"] as const,
  },
  account: {
    all: ["account"] as const,
    profile: () => ["account", "profile"] as const,
    orders: (page = 1) => ["account", "orders", page] as const,
  },
} as const;
