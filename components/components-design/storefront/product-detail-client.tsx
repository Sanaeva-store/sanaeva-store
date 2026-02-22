"use client";

import { useState } from "react";
import { Heart, Share2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/shared/ui";
import { AddToCartButton } from "@/components/components-design/storefront/add-to-cart-button";
import { useProductByIdQuery } from "@/features/storefront/hooks/use-products";
import type { ProductVariant } from "@/features/storefront/api/products.api";

interface ProductDetailClientProps {
  productId: string;
}

export function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const { data: product, isLoading, isError, refetch } = useProductByIdQuery(productId);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-md" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
          </div>
          <Skeleton className="h-10 w-40" />
          <Separator />
          <div className="space-y-3">
            <Skeleton className="h-4 w-16" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-9 w-12" />)}
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-12" />
            <Skeleton className="h-12 w-12" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <ErrorState
        title="Product not found"
        message="We couldn't load this product. It may have been removed or the link is incorrect."
        retry={() => void refetch()}
      />
    );
  }

  const activeVariant = selectedVariant ?? product.variants.find((v) => v.isActive) ?? product.variants[0];
  const price = activeVariant?.price ?? 0;

  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))] as string[];
  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))] as string[];

  const isOutOfStock = product.variants.every((v) => !v.isActive);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Product Gallery */}
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
          <div className="flex h-full items-center justify-center">
            <Package className="h-24 w-24 text-muted-foreground/30" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square overflow-hidden rounded-md border bg-muted"
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          {product.brand && (
            <Badge variant="secondary" className="mb-2">
              {product.brand}
            </Badge>
          )}
          <h1 className="text-3xl font-bold">{product.title}</h1>
          {product.status === "ACTIVE" ? (
            <Badge className="mt-2" variant="outline">Active</Badge>
          ) : (
            <Badge className="mt-2" variant="destructive">{product.status}</Badge>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">
            ฿{price.toLocaleString("th-TH")}
          </span>
        </div>

        <Separator />

        {/* Variant Selector */}
        {(sizes.length > 0 || colors.length > 0) && (
          <div className="space-y-4">
            {sizes.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const variant = product.variants.find((v) => v.size === size && v.isActive);
                    const isSelected = activeVariant?.size === size;
                    return (
                      <Button
                        key={size}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        className="w-12"
                        disabled={!variant}
                        onClick={() => variant && setSelectedVariant(variant)}
                      >
                        {size}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => {
                    const variant = product.variants.find((v) => v.color === color && v.isActive);
                    const isSelected = activeVariant?.color === color;
                    return (
                      <Button
                        key={color}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        disabled={!variant}
                        onClick={() => variant && setSelectedVariant(variant)}
                      >
                        {color}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          {isOutOfStock ? (
            <>
              <div className="h-2 w-2 rounded-full bg-destructive" />
              <span className="text-sm text-destructive">Out of Stock</span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm">In Stock</span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <AddToCartButton
            item={{
              itemId: activeVariant?.id ?? product.id,
              variantId: activeVariant?.id ?? product.id,
              productName: product.title,
              unitPrice: price,
            }}
            disabled={isOutOfStock || !activeVariant}
          />
          <Button variant="outline" size="lg" aria-label="Add to wishlist">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" aria-label="Share product">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        <Separator />

        {/* Product Description */}
        {product.description && (
          <div>
            <h3 className="mb-2 font-semibold">Description</h3>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>
        )}

        {/* SKU */}
        {activeVariant?.sku && (
          <p className="text-xs text-muted-foreground">SKU: {activeVariant.sku}</p>
        )}
      </div>
    </div>
  );
}
