"use client";

import { useMutation } from "@tanstack/react-query";
import {
  backofficeLogin,
  backofficeLogout,
  type LoginPayload,
} from "@/features/inventory/api/backoffice-auth.api";

/**
 * Persists the backoffice JWT pair as httpOnly cookies via the
 * `/api/auth/set-token` Next.js route so that Server Components and
 * middleware can read them without exposing tokens to client JS.
 */
async function persistTokens(args: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}): Promise<void> {
  const response = await fetch("/api/auth/set-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!response.ok) {
    throw new Error("Failed to persist backoffice session");
  }
}

async function clearTokens(): Promise<void> {
  await fetch("/api/auth/set-token", { method: "DELETE" });
}

/**
 * useBackofficeSignInMutation
 *
 * 1. Calls the backend `/api/auth/login` endpoint.
 * 2. Stores the returned JWT pair as httpOnly cookies.
 *
 * Usage:
 * ```tsx
 * const { mutate: signIn, isPending, error } = useBackofficeSignInMutation();
 * signIn({ email, password }, { onSuccess: () => router.replace("/en/admin-dasboard") });
 * ```
 */
export function useBackofficeSignInMutation() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const data = await backofficeLogin(payload);
      await persistTokens({
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
        expiresIn: data.tokens.expiresIn,
      });
      return data;
    },
  });
}

/**
 * useBackofficeSignOutMutation
 *
 * Calls the backend logout endpoint (invalidates refresh token) and clears
 * the httpOnly cookies.
 */
export function useBackofficeSignOutMutation() {
  return useMutation({
    mutationFn: async (refreshToken: string) => {
      await backofficeLogout({ refreshToken });
      await clearTokens();
    },
  });
}
