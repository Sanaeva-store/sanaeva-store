import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/shared/ui";
import { ProductListingClient } from "@/components/components-design/storefront/product-listing-client";

export const metadata: Metadata = {
  title: "Products - Sanaeva Store",
  description: "Browse our collection of fashion and lifestyle products",
};

export default function ProductListingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="mt-2 text-muted-foreground">
          Discover our latest collection
        </p>
      </div>
      <Suspense fallback={<LoadingSkeleton variant="card" count={12} />}>
        <ProductListingClient />
      </Suspense>
    </div>
  );
}
