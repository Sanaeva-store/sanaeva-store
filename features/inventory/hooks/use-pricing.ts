import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchPriceLists,
  fetchPriceListById,
  createPriceList,
  updatePriceList,
  fetchPriceListItems,
  addPriceListItem,
  type PriceListListParams,
  type CreatePriceListPayload,
  type UpdatePriceListPayload,
  type AddPriceListItemPayload,
} from "@/features/inventory/api/pricing.api";

const pricingKeys = {
  all: ["price-lists"] as const,
  list: (params: PriceListListParams) =>
    ["price-lists", "list", params.page ?? 1] as const,
  detail: (id: string) => ["price-lists", "detail", id] as const,
  items: (id: string) => ["price-lists", "items", id] as const,
};

export function usePriceListsQuery(params: PriceListListParams = {}) {
  return useQuery({
    queryKey: pricingKeys.list(params),
    queryFn: () => fetchPriceLists(params),
  });
}

export function usePriceListDetailQuery(id: string) {
  return useQuery({
    queryKey: pricingKeys.detail(id),
    queryFn: () => fetchPriceListById(id),
    enabled: Boolean(id),
  });
}

export function useCreatePriceListMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePriceListPayload) => createPriceList(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: pricingKeys.all });
    },
  });
}

export function useUpdatePriceListMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePriceListPayload }) =>
      updatePriceList(id, payload),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: pricingKeys.all });
      void queryClient.invalidateQueries({ queryKey: pricingKeys.detail(id) });
    },
  });
}

export function usePriceListItemsQuery(priceListId: string) {
  return useQuery({
    queryKey: pricingKeys.items(priceListId),
    queryFn: () => fetchPriceListItems(priceListId),
    enabled: Boolean(priceListId),
  });
}

export function useAddPriceListItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      priceListId,
      payload,
    }: {
      priceListId: string;
      payload: AddPriceListItemPayload;
    }) => addPriceListItem(priceListId, payload),
    onSuccess: (_data, { priceListId }) => {
      void queryClient.invalidateQueries({
        queryKey: pricingKeys.items(priceListId),
      });
    },
  });
}
