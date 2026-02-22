"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  signIn,
  signUp,
  signOut,
  forgotPassword,
  fetchCurrentUser,
  type SignInPayload,
  type SignUpPayload,
  type ForgotPasswordPayload,
} from "@/features/account/api/auth.api";

const authKeys = {
  user: ["auth", "user"] as const,
};

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSignInMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SignInPayload) => signIn(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user, data.user);
    },
  });
}

export function useSignUpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SignUpPayload) => signUp(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user, data.user);
    },
  });
}

export function useSignOutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user, null);
      void queryClient.invalidateQueries();
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
  });
}
