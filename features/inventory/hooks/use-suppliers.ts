import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchSuppliers,
  fetchSupplierById,
  createSupplier,
  updateSupplier,
  toggleSupplierStatus,
  type CreateSupplierPayload,
  type UpdateSupplierPayload,
} from "@/features/inventory/api/suppliers.api";

const supplierKeys = {
  all: ["suppliers"] as const,
  list: (params: { page?: number }) =>
    ["suppliers", "list", params.page ?? 1] as const,
  detail: (id: string) => ["suppliers", "detail", id] as const,
};

export function useSuppliersQuery(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: supplierKeys.list(params),
    queryFn: () => fetchSuppliers(params),
  });
}

export function useSupplierDetailQuery(id: string) {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => fetchSupplierById(id),
    enabled: Boolean(id),
  });
}

export function useCreateSupplierMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSupplierPayload) => createSupplier(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: supplierKeys.all });
    },
  });
}

export function useUpdateSupplierMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSupplierPayload }) =>
      updateSupplier(id, payload),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      void queryClient.invalidateQueries({ queryKey: supplierKeys.detail(id) });
    },
  });
}

export function useToggleSupplierStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleSupplierStatus(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      void queryClient.invalidateQueries({ queryKey: supplierKeys.detail(id) });
    },
  });
}
