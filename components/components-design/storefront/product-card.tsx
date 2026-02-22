"use client";

import Link from "next/link";
import { ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartActions } from "@/features/cart/store/cart.selectors";
import type { Product } from "@/features/storefront/api/products.api";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartActions();
  const activeVariant = product.variants.find((v) => v.isActive) ?? product.variants[0];
  const price = activeVariant?.price ?? 0;
  const isOutOfStock = product.variants.every((v) => !v.isActive);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!activeVariant || isOutOfStock) return;
    addItem({
      itemId: activeVariant.id,
      variantId: activeVariant.id,
      productName: product.title,
      unitPrice: price,
      quantity: 1,
    });
  };

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <div className="flex h-full items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground/30 transition-transform group-hover:scale-110" />
          </div>
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
          {product.brand && (
            <Badge className="absolute left-2 top-2" variant="secondary">
              {product.brand}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-2 font-semibold leading-tight">{product.title}</h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>
          )}
          <p className="mt-2 text-lg font-bold">
            ฿{price.toLocaleString("th-TH")}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          size="sm"
          variant={isOutOfStock ? "secondary" : "default"}
          disabled={isOutOfStock}
          onClick={handleQuickAdd}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
