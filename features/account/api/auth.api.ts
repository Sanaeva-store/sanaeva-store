import { apiRequest } from "@/shared/lib/http/api-client";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "customer" | "admin" | "staff";
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  token: string;
  password: string;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};

export async function signIn(payload: SignInPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/auth/signin", {
    method: "POST",
    body: payload,
  });
}

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: payload,
  });
}

export async function signOut(): Promise<void> {
  return apiRequest<void>("/api/auth/signout", { method: "POST" });
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  return apiRequest<void>("/api/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  return apiRequest<void>("/api/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  return apiRequest<AuthUser>("/api/auth/me");
}
