import { apiRequest } from "@/shared/lib/http/api-client";

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
};

export type PaymentMethod = "card" | "promptpay" | "bank_transfer";

export type CheckoutPreviewRequest = {
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
};

export type CheckoutPreviewResponse = {
  items: Array<{
    variantId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
};

export type PlaceOrderRequest = {
  idempotencyKey: string;
  items: Array<{
    variantId: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
};

export type PlaceOrderResponse = {
  orderId: string;
  status: string;
  total: number;
};

export async function previewCheckout(
  payload: CheckoutPreviewRequest,
): Promise<CheckoutPreviewResponse> {
  return apiRequest<CheckoutPreviewResponse>("/api/storefront/checkout/preview", {
    method: "POST",
    body: payload,
  });
}

export async function placeOrder(
  payload: PlaceOrderRequest,
): Promise<PlaceOrderResponse> {
  return apiRequest<PlaceOrderResponse>("/api/storefront/orders", {
    method: "POST",
    body: payload,
  });
}
