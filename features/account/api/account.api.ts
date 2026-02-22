import { apiRequest } from "@/shared/lib/http/api-client";

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
};

export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  productId: string;
  variantId: string;
  productName: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
};

export type Order = {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type OrderListResponse = {
  items: Order[];
  total: number;
  page: number;
  limit: number;
};

export async function fetchProfile(): Promise<UserProfile> {
  return apiRequest<UserProfile>("/api/account/profile");
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  return apiRequest<UserProfile>("/api/account/profile", {
    method: "PATCH",
    body: payload,
  });
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  return apiRequest<void>("/api/account/password", {
    method: "PATCH",
    body: payload,
  });
}

export async function fetchOrders(page = 1, limit = 10): Promise<OrderListResponse> {
  return apiRequest<OrderListResponse>(
    `/api/account/orders?page=${page}&limit=${limit}`,
  );
}

export async function fetchOrderById(orderId: string): Promise<Order> {
  return apiRequest<Order>(`/api/account/orders/${orderId}`);
}
