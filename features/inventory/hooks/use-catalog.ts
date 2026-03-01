import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProductsList,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchVariantsList,
  fetchVariantById,
  createVariant,
  updateVariant,
  deleteVariant,
  fetchProductImages,
  createProductImage,
  updateProductImage,
  deleteProductImage,
  type ProductListParams,
  type CreateProductPayload,
  type UpdateProductPayload,
  type CreateVariantPayload,
  type UpdateVariantPayload,
  type CreateProductImagePayload,
  type UpdateProductImagePayload,
} from "@/features/storefront/api/products.api";

const catalogKeys = {
  all: ["catalog-products"] as const,
  list: (params: ProductListParams) =>
    ["catalog-products", "list", params.page ?? 1, params.search ?? "", params.status ?? "all"] as const,
  detail: (id: string) => ["catalog-products", "detail", id] as const,
  variants: (productId: string) =>
    ["catalog-products", "variants", productId] as const,
  variant: (productId: string, variantId: string) =>
    ["catalog-products", "variant", productId, variantId] as const,
  images: (productId: string) =>
    ["catalog-products", "images", productId] as const,
};

// ─── Products ─────────────────────────────────────────────────────────────────

export function useCatalogProductsQuery(params: ProductListParams = {}) {
  return useQuery({
    queryKey: catalogKeys.list(params),
    queryFn: () => fetchProductsList(params),
  });
}

export function useCatalogProductDetailQuery(id: string) {
  return useQuery({
    queryKey: catalogKeys.detail(id),
    queryFn: () => fetchProductById(id),
    enabled: Boolean(id),
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductPayload }) =>
      updateProduct(id, payload),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.all });
      void queryClient.invalidateQueries({ queryKey: catalogKeys.detail(id) });
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

// ─── Variants ─────────────────────────────────────────────────────────────────

export function useVariantsQuery(productId: string) {
  return useQuery({
    queryKey: catalogKeys.variants(productId),
    queryFn: () => fetchVariantsList(productId),
    enabled: Boolean(productId),
  });
}

export function useVariantDetailQuery(productId: string, variantId: string) {
  return useQuery({
    queryKey: catalogKeys.variant(productId, variantId),
    queryFn: () => fetchVariantById(productId, variantId),
    enabled: Boolean(productId) && Boolean(variantId),
  });
}

export function useCreateVariantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, payload }: { productId: string; payload: CreateVariantPayload }) =>
      createVariant(productId, payload),
    onSuccess: (_data, { productId }) => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.variants(productId) });
      void queryClient.invalidateQueries({ queryKey: catalogKeys.detail(productId) });
    },
  });
}

export function useUpdateVariantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      variantId,
      payload,
    }: {
      productId: string;
      variantId: string;
      payload: UpdateVariantPayload;
    }) => updateVariant(productId, variantId, payload),
    onSuccess: (_data, { productId, variantId }) => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.variants(productId) });
      void queryClient.invalidateQueries({
        queryKey: catalogKeys.variant(productId, variantId),
      });
    },
  });
}

export function useDeleteVariantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      variantId,
    }: {
      productId: string;
      variantId: string;
    }) => deleteVariant(productId, variantId),
    onSuccess: (_data, { productId }) => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.variants(productId) });
      void queryClient.invalidateQueries({ queryKey: catalogKeys.detail(productId) });
    },
  });
}

// ─── Product Images ───────────────────────────────────────────────────────────

export function useProductImagesQuery(productId: string) {
  return useQuery({
    queryKey: catalogKeys.images(productId),
    queryFn: () => fetchProductImages(productId),
    enabled: Boolean(productId),
  });
}

export function useCreateProductImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string;
      payload: CreateProductImagePayload;
    }) => createProductImage(productId, payload),
    onSuccess: (_data, { productId }) => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.images(productId) });
    },
  });
}

export function useUpdateProductImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      imageId,
      payload,
    }: {
      productId: string;
      imageId: string;
      payload: UpdateProductImagePayload;
    }) => updateProductImage(productId, imageId, payload),
    onSuccess: (_data, { productId }) => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.images(productId) });
    },
  });
}

export function useDeleteProductImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      imageId,
    }: {
      productId: string;
      imageId: string;
    }) => deleteProductImage(productId, imageId),
    onSuccess: (_data, { productId }) => {
      void queryClient.invalidateQueries({ queryKey: catalogKeys.images(productId) });
    },
  });
}
