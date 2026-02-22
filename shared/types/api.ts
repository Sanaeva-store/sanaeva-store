export type ApiSuccessResponse<TData> = {
  success: true;
  data: TData;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    requestId?: string;
  };
};

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;

/**
 * Paginated list response shape returned by backend services.
 * Top-level fields — no nested meta object.
 * Source: catalog.service.ts, inventory.service.ts, suppliers.service.ts, purchase-orders.service.ts
 */
export type PaginatedResponse<TItem> = {
  data: TItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/**
 * Canonical role strings present in backend @Roles() decorators.
 * NOTE: STAFF and INVENTORY_STAFF are both in use — await BE normalization before locking.
 */
export const AppRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  STORE_MANAGER: "STORE_MANAGER",
  STAFF: "STAFF",
  INVENTORY_STAFF: "INVENTORY_STAFF",
} as const;

export type AppRole = (typeof AppRole)[keyof typeof AppRole];
