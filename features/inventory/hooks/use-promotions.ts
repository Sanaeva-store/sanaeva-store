import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPromotions,
  fetchPromotionById,
  createPromotion,
  updatePromotion,
  togglePromotion,
  simulateDiscount,
  validateCoupon,
  calculateDiscount,
  fetchStackingRules,
  createStackingRule,
  type PromotionListParams,
  type CreatePromotionPayload,
  type UpdatePromotionPayload,
  type SimulateDiscountPayload,
  type ValidateCouponPayload,
  type CalculateDiscountPayload,
  type CreateStackingRulePayload,
} from "@/features/inventory/api/promotions.api";

const promotionKeys = {
  all: ["promotions"] as const,
  list: (params: PromotionListParams) =>
    ["promotions", "list", params.page ?? 1, params.isActive] as const,
  detail: (id: string) => ["promotions", "detail", id] as const,
  stackingRules: (id: string) => ["promotions", "stacking-rules", id] as const,
};

export function usePromotionsQuery(params: PromotionListParams = {}) {
  return useQuery({
    queryKey: promotionKeys.list(params),
    queryFn: () => fetchPromotions(params),
  });
}

export function usePromotionDetailQuery(id: string) {
  return useQuery({
    queryKey: promotionKeys.detail(id),
    queryFn: () => fetchPromotionById(id),
    enabled: Boolean(id),
  });
}

export function useCreatePromotionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePromotionPayload) => createPromotion(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: promotionKeys.all });
    },
  });
}

export function useUpdatePromotionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePromotionPayload }) =>
      updatePromotion(id, payload),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: promotionKeys.all });
      void queryClient.invalidateQueries({ queryKey: promotionKeys.detail(id) });
    },
  });
}

export function useTogglePromotionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => togglePromotion(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: promotionKeys.all });
      void queryClient.invalidateQueries({ queryKey: promotionKeys.detail(id) });
    },
  });
}

export function useSimulateDiscountMutation() {
  return useMutation({
    mutationFn: (payload: SimulateDiscountPayload) => simulateDiscount(payload),
  });
}

export function useValidateCouponMutation() {
  return useMutation({
    mutationFn: (payload: ValidateCouponPayload) => validateCoupon(payload),
  });
}

export function useCalculateDiscountMutation() {
  return useMutation({
    mutationFn: (payload: CalculateDiscountPayload) => calculateDiscount(payload),
  });
}

export function useStackingRulesQuery(promotionId: string) {
  return useQuery({
    queryKey: promotionKeys.stackingRules(promotionId),
    queryFn: () => fetchStackingRules(promotionId),
    enabled: Boolean(promotionId),
  });
}

export function useCreateStackingRuleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      promotionId,
      payload,
    }: {
      promotionId: string;
      payload: CreateStackingRulePayload;
    }) => createStackingRule(promotionId, payload),
    onSuccess: (_data, { promotionId }) => {
      void queryClient.invalidateQueries({
        queryKey: promotionKeys.stackingRules(promotionId),
      });
    },
  });
}
