import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Package, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Order Confirmation - Sanaeva Store",
  description: "Your order has been confirmed",
};

export default function OrderConfirmationPage() {
  // Mock order data
  const order = {
    id: "ORD-2024-001",
    date: new Date().toLocaleDateString("th-TH"),
    status: "confirmed",
    total: 3597,
    items: [
      { name: "Product A", variant: "Size M, Black", quantity: 2, price: 1299 },
      { name: "Product B", variant: "Size L, White", quantity: 1, price: 899 },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Message */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-semibold">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-semibold">{order.date}</p>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="mb-3 font-semibold">Items</h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">{item.variant}</p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>฿{order.total.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              John Doe<br />
              123 Main St<br />
              Bangkok, Bangkok 10110<br />
              Phone: 0812345678
            </p>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Credit/Debit Card</p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button className="flex-1" asChild>
            <Link href="/(user)/orders">
              <Package className="mr-2 h-4 w-4" />
              View Order Status
            </Link>
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/(storefront)/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
