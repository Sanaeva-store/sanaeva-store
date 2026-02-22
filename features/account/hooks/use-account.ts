import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query/query-keys";
import {
  fetchProfile,
  updateProfile,
  changePassword,
  fetchOrders,
  fetchOrderById,
  type UpdateProfilePayload,
  type ChangePasswordPayload,
} from "@/features/account/api/account.api";

export function useProfileQuery() {
  return useQuery({
    queryKey: queryKeys.account.profile(),
    queryFn: fetchProfile,
  });
}

export function useOrdersQuery(page = 1) {
  return useQuery({
    queryKey: queryKeys.account.orders(page),
    queryFn: () => fetchOrders(page),
  });
}

export function useOrderDetailQuery(orderId: string) {
  return useQuery({
    queryKey: ["account", "orders", "detail", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: Boolean(orderId),
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.profile() });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  });
}
