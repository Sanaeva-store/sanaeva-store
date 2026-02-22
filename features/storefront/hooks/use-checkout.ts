"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  previewCheckout,
  placeOrder,
  type CheckoutPreviewRequest,
  type PlaceOrderRequest,
} from "@/features/storefront/api/checkout.api";

export function useCheckoutPreviewQuery(payload: CheckoutPreviewRequest | null) {
  return useQuery({
    queryKey: ["checkout", "preview", payload],
    queryFn: () => previewCheckout(payload!),
    enabled: Boolean(payload && payload.items.length > 0),
    staleTime: 30 * 1000,
    retry: 1,
  });
}

export function usePlaceOrderMutation() {
  return useMutation({
    mutationFn: (payload: PlaceOrderRequest) => placeOrder(payload),
    retry: 0,
  });
}
