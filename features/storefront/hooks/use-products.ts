import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query/query-keys";
import {
  fetchProductsList,
  fetchProductById,
  type ProductListParams,
} from "@/features/storefront/api/products.api";

export function useProductsListQuery(params: ProductListParams = {}) {
  return useQuery({
    queryKey: queryKeys.products.list({
      search: params.search,
      page: params.page,
      category: params.categoryId,
    }),
    queryFn: () => fetchProductsList(params),
  });
}

export function useProductByIdQuery(productId: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: () => fetchProductById(productId),
    enabled: Boolean(productId),
  });
}
