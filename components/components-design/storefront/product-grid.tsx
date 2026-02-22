"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState, LoadingSkeleton } from "@/shared/ui";
import { ProductCard } from "@/components/components-design/storefront/product-card";
import { useProductsListQuery } from "@/features/storefront/hooks/use-products";
import type { ProductListParams } from "@/features/storefront/api/products.api";

interface ProductGridProps {
  params: ProductListParams;
}

export function ProductGrid({ params }: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, isLoading, isError, refetch } = useProductsListQuery(params);

  const setPage = useCallback(
    (page: number) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set("page", String(page));
      router.push(`?${next.toString()}`);
    },
    [router, searchParams],
  );

  if (isLoading) {
    return <LoadingSkeleton variant="card" count={12} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load products"
        message="We couldn't fetch the product list. Please try again."
        retry={() => void refetch()}
      />
    );
  }

  const products = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? 1;

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center">
        <div className="rounded-full bg-muted p-4">
          <PackageOpen className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No products found</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Try adjusting your search or filter to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
