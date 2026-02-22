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
