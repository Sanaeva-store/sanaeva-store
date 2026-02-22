import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/shared/ui";
import { ProductDetailClient } from "@/components/components-design/storefront/product-detail-client";

export const metadata: Metadata = {
  title: "Product Details - Sanaeva Store",
  description: "View product details and specifications",
};

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="grid gap-8 lg:grid-cols-2">
            <LoadingSkeleton variant="card" count={1} className="lg:grid-cols-1" />
            <LoadingSkeleton variant="form" count={5} />
          </div>
        }
      >
        <ProductDetailClient productId={id} />
      </Suspense>
    </div>
  );
}
