import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query/query-keys";
import {
  fetchProductsList,
  fetchProductBySlug,
  type ProductListParams,
} from "@/features/storefront/api/products.api";

export function useProductsListQuery(params: ProductListParams = {}) {
  return useQuery({
    queryKey: queryKeys.products.list({
      search: params.search,
      page: params.page,
      category: params.category,
    }),
    queryFn: () => fetchProductsList(params),
  });
}

export function useProductBySlugQuery(slug: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => fetchProductBySlug(slug),
    enabled: Boolean(slug),
  });
}
