import { apiRequest } from "@/shared/lib/http/api-client";
import type { PaginatedResponse } from "@/shared/types/api";

export type PromotionType = "PERCENTAGE" | "FIXED_AMOUNT" | "BUY_X_GET_Y" | "FREE_SHIPPING";

export type Promotion = {
  id: string;
  name: string;
  code?: string | null;
  type: PromotionType;
  /** Decimal string */
  discountValue: string;
  minOrderAmount?: string | null;
  maxUsageCount?: number | null;
  usedCount: number;
  isActive: boolean;
  startsAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PromotionListResponse = PaginatedResponse<Promotion>;

export type PromotionListParams = {
  page?: number;
  limit?: number;
  isActive?: boolean;
};

export type CreatePromotionPayload = {
  name: string;
  code?: string;
  type: PromotionType;
  discountValue: number;
  minOrderAmount?: number;
  maxUsageCount?: number;
  startsAt?: string;
  expiresAt?: string;
};

export type UpdatePromotionPayload = Partial<CreatePromotionPayload>;

export type StackingRule = {
  id: string;
  promotionId: string;
  allowedWithPromotionId: string;
  createdAt: string;
};

export type CreateStackingRulePayload = {
  allowedWithPromotionId: string;
};

export type SimulateDiscountPayload = {
  codes: string[];
  subtotal: number;
  userId?: string;
};

export type SimulateDiscountResult = {
  breakdown: {
    code: string;
    discountAmount: string;
  }[];
  totalDiscount: string;
  finalTotal: string;
};

export type ValidateCouponPayload = {
  code: string;
  subtotal: number;
  userId?: string;
};

export type CouponValidationResult = {
  valid: boolean;
  code: string;
  reason?: string;
  discount?: string;
  finalTotal?: string;
};

export type CalculateDiscountPayload = {
  codes: string[];
  subtotal: number;
  userId?: string;
};

export async function fetchPromotions(
  params: PromotionListParams = {},
): Promise<PromotionListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.isActive !== undefined)
    searchParams.set("isActive", String(params.isActive));
  const qs = searchParams.toString();
  return apiRequest<PromotionListResponse>(`/api/promotions${qs ? `?${qs}` : ""}`);
}

export async function fetchPromotionById(id: string): Promise<Promotion> {
  return apiRequest<Promotion>(`/api/promotions/${id}`);
}

export async function createPromotion(
  payload: CreatePromotionPayload,
): Promise<Promotion> {
  return apiRequest<Promotion>("/api/promotions", {
    method: "POST",
    body: payload,
  });
}

export async function updatePromotion(
  id: string,
  payload: UpdatePromotionPayload,
): Promise<Promotion> {
  return apiRequest<Promotion>(`/api/promotions/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function togglePromotion(id: string): Promise<Promotion> {
  return apiRequest<Promotion>(`/api/promotions/${id}/toggle`, {
    method: "POST",
  });
}

export async function simulateDiscount(
  payload: SimulateDiscountPayload,
): Promise<SimulateDiscountResult> {
  return apiRequest<SimulateDiscountResult>("/api/promotions/simulate", {
    method: "POST",
    body: payload,
  });
}

export async function validateCoupon(
  payload: ValidateCouponPayload,
): Promise<CouponValidationResult> {
  return apiRequest<CouponValidationResult>("/api/promotions/validate-coupon", {
    method: "POST",
    body: payload,
  });
}

export async function calculateDiscount(
  payload: CalculateDiscountPayload,
): Promise<SimulateDiscountResult> {
  return apiRequest<SimulateDiscountResult>("/api/promotions/calculate-discount", {
    method: "POST",
    body: payload,
  });
}

export async function fetchStackingRules(promotionId: string): Promise<StackingRule[]> {
  return apiRequest<StackingRule[]>(`/api/promotions/${promotionId}/stacking-rules`);
}

export async function createStackingRule(
  promotionId: string,
  payload: CreateStackingRulePayload,
): Promise<StackingRule> {
  return apiRequest<StackingRule>(`/api/promotions/${promotionId}/stacking-rules`, {
    method: "POST",
    body: payload,
  });
}
