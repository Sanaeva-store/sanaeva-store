import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  backofficeLogin,
  backofficeRefresh,
  backofficeLogout,
  fetchBackofficeMe,
  fetchBackofficeSessions,
  type LoginPayload,
  type RefreshPayload,
  type LogoutPayload,
} from "@/features/inventory/api/backoffice-auth.api";

const backofficeAuthKeys = {
  me: () => ["backoffice-auth", "me"] as const,
  sessions: () => ["backoffice-auth", "sessions"] as const,
};

export function useBackofficeMeQuery(enabled = true) {
  return useQuery({
    queryKey: backofficeAuthKeys.me(),
    queryFn: fetchBackofficeMe,
    enabled,
    retry: false,
  });
}

export function useBackofficeSessionsQuery() {
  return useQuery({
    queryKey: backofficeAuthKeys.sessions(),
    queryFn: fetchBackofficeSessions,
  });
}

export function useBackofficeLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => backofficeLogin(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["backoffice-auth"] });
    },
  });
}

export function useBackofficeRefreshMutation() {
  return useMutation({
    mutationFn: (payload: RefreshPayload) => backofficeRefresh(payload),
  });
}

export function useBackofficeLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LogoutPayload) => backofficeLogout(payload),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
