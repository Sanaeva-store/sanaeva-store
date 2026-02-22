import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Order Confirmed - Sanaeva Store",
  description: "Your order has been confirmed",
};

interface OrderConfirmationPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderConfirmationPage({ searchParams }: OrderConfirmationPageProps) {
  const { orderId } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-lg space-y-8 text-center">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-semantic-success-bg p-4">
            <CheckCircle2 className="h-16 w-16 text-semantic-success-text" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. We&apos;ll send you a confirmation email shortly.
          </p>
        </div>

        {orderId && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-lg font-semibold">{orderId}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Save this number to track your order
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button className="flex-1" asChild>
            <Link href="/orders">
              <Package className="mr-2 h-4 w-4" />
              View My Orders
            </Link>
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
