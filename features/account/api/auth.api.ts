import { publicEnv } from "@/shared/config/public-env";
import { ApiError } from "@/shared/lib/http/api-client";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  image?: string;
};

export type AuthSession = {
  user: AuthUser;
  session: {
    id: string;
    expiresAt: string;
    token: string;
  };
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  email: string;
  password: string;
  name: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

const authBase = () => {
  const base = (publicEnv.apiBaseUrl || "").replace(/\/+$/, "");
  if (!base) {
    return "/api/auth/api";
  }
  return base.endsWith("/api") ? `${base}/auth/api` : `${base}/api/auth/api`;
};

async function authFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${authBase()}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...init,
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const message = typeof json.message === "string" ? json.message : "Auth request failed";
    throw new ApiError(message, res.status);
  }
  return json as T;
}

export async function signIn(payload: SignInPayload): Promise<AuthSession> {
  return authFetch<AuthSession>("/sign-in/email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function signUp(payload: SignUpPayload): Promise<AuthSession> {
  return authFetch<AuthSession>("/sign-up/email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function signOut(): Promise<void> {
  await authFetch<unknown>("/sign-out", { method: "POST" });
}

export async function fetchCurrentSession(): Promise<AuthSession | null> {
  try {
    return await authFetch<AuthSession>("/session");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}
