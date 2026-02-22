import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/shared/ui";

export const metadata: Metadata = {
  title: "Sanaeva Store - Fashion & Lifestyle",
  description: "Discover the latest fashion trends and lifestyle products",
};

export default function StorefrontHomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">New Collection 2024</Badge>
            <h1 className="mb-6 text-5xl font-bold tracking-tight">
              Discover Your Style
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Explore our curated collection of fashion and lifestyle products
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/products">View Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <p className="mt-2 text-muted-foreground">
            Find what you&apos;re looking for
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {["Women", "Men", "Accessories"].map((category) => (
            <Card key={category} className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted">
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">{category}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{category}</h3>
                  <Button variant="link" className="mt-2 p-0">
                    Explore <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">New Arrivals</h2>
              <p className="mt-2 text-muted-foreground">
                Check out our latest products
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">View All</Link>
            </Button>
          </div>
          <LoadingSkeleton variant="card" count={4} />
        </div>
      </section>

      {/* Trust Signals */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { title: "Free Shipping", desc: "On orders over ฿1,000" },
            { title: "Easy Returns", desc: "30-day return policy" },
            { title: "Secure Payment", desc: "100% secure checkout" },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
