import { apiRequest } from "@/shared/lib/http/api-client";
import type { AppRole } from "@/shared/types/api";

/**
 * Backoffice admin auth API.
 * Uses /api/auth/* endpoints (distinct from storefront auth).
 * Source: frontend-integration-contract-v1.md
 */

export type BackofficeUser = {
  id: string;
  email: string;
  name: string;
  roles: AppRole[];
};

export type BackofficeTokens = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
};

export type BackofficeLoginResponse = {
  user: BackofficeUser;
  tokens: BackofficeTokens;
};

export type BackofficeSession = {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  userAgent?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RefreshPayload = {
  refreshToken: string;
};

export type LogoutPayload = {
  refreshToken: string;
};

export async function backofficeLogin(
  payload: LoginPayload,
): Promise<BackofficeLoginResponse> {
  return apiRequest<BackofficeLoginResponse>("/api/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function backofficeRefresh(
  payload: RefreshPayload,
): Promise<BackofficeTokens> {
  return apiRequest<BackofficeTokens>("/api/auth/refresh", {
    method: "POST",
    body: payload,
  });
}

export async function backofficeLogout(payload: LogoutPayload): Promise<void> {
  return apiRequest<void>("/api/auth/logout", {
    method: "POST",
    body: payload,
  });
}

export async function fetchBackofficeMe(): Promise<BackofficeUser> {
  return apiRequest<BackofficeUser>("/api/auth/me");
}

export async function fetchBackofficeSessions(): Promise<BackofficeSession[]> {
  return apiRequest<BackofficeSession[]>("/api/auth/sessions");
}
