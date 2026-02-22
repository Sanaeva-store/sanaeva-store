import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchSuppliers,
  fetchSupplierById,
  createSupplier,
  updateSupplier,
  type CreateSupplierPayload,
  type UpdateSupplierPayload,
} from "@/features/inventory/api/suppliers.api";

const supplierKeys = {
  all: ["suppliers"] as const,
  list: (params: { page?: number; search?: string }) =>
    ["suppliers", "list", params.page ?? 1, params.search ?? ""] as const,
  detail: (id: string) => ["suppliers", "detail", id] as const,
};

export function useSuppliersQuery(params: { page?: number; search?: string } = {}) {
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
