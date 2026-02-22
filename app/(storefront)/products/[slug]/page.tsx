import type { Metadata } from "next";
import { Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/shared/ui";
import { AddToCartButton } from "@/components/components-design/storefront/add-to-cart-button";

export const metadata: Metadata = {
  title: "Product Details - Sanaeva Store",
  description: "View product details and specifications",
};

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Gallery */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Product Image Gallery</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square overflow-hidden rounded-md border bg-muted"
              >
                <div className="flex h-full items-center justify-center">
                  <p className="text-xs text-muted-foreground">{i}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2">New Arrival</Badge>
            <h1 className="text-3xl font-bold">Product Name - {slug}</h1>
            <p className="mt-2 text-muted-foreground">
              Product category or brand
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">฿1,299</span>
            <span className="text-lg text-muted-foreground line-through">
              ฿1,599
            </span>
            <Badge variant="destructive">-19%</Badge>
          </div>

          <Separator />

          {/* Variant Selector */}
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold">Size</h3>
              <div className="flex gap-2">
                {["XS", "S", "M", "L", "XL"].map((size) => (
                  <Button
                    key={size}
                    variant="outline"
                    size="sm"
                    className="w-12"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold">Color</h3>
              <div className="flex gap-2">
                {["Black", "White", "Blue"].map((color) => (
                  <Button key={color} variant="outline" size="sm">
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm">In Stock - 24 items available</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <AddToCartButton
              item={{
                itemId: slug,
                variantId: slug,
                productName: `Product - ${slug}`,
                unitPrice: 1299,
              }}
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
          <div>
            <h3 className="mb-2 font-semibold">Description</h3>
            <p className="text-sm text-muted-foreground">
              This is a placeholder for the product description. The actual
              description will be loaded from the API and will include detailed
              information about the product, materials, care instructions, and
              more.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
        <LoadingSkeleton variant="card" count={4} />
      </div>
    </div>
  );
}
