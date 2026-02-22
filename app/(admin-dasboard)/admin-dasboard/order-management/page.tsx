import type { Metadata } from "next";
import { ShoppingCart } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/shared/ui";

export const metadata: Metadata = {
  title: "Order Management - Sanaeva Store",
  description: "Manage customer orders and fulfillment status",
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="mt-2 text-muted-foreground">
            Track order lifecycle, payment, and fulfillment
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Queue</CardTitle>
          <CardDescription>Pending, processing, and completed orders</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="table" count={8} />
        </CardContent>
      </Card>
    </div>
  );
}
