"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  signIn,
  signUp,
  signOut,
  fetchCurrentSession,
  type SignInPayload,
  type SignUpPayload,
  type AuthUser,
} from "@/features/account/api/auth.api";

export const authKeys = {
  session: ["auth", "session"] as const,
};

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: fetchCurrentSession,
    retry: false,
    staleTime: 5 * 60 * 1000,
    select: (data): AuthUser | null => data?.user ?? null,
  });
}

export function useSignInMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SignInPayload) => signIn(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.session, data);
    },
  });
}

export function useSignUpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SignUpPayload) => signUp(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.session, data);
    },
  });
}

export function useSignOutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.session, null);
      void queryClient.invalidateQueries();
    },
  });
}
