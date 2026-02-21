import type { Metadata } from "next";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/shared/ui";

export const metadata: Metadata = {
  title: "My Orders - Sanaeva Store",
  description: "View your order history",
};

export default function OrdersPage() {
  // Mock orders - will be replaced with real data
  const orders = [
    {
      id: "ORD-2024-001",
      date: "2024-02-20",
      status: "delivered",
      total: 3597,
      items: 3,
    },
    {
      id: "ORD-2024-002",
      date: "2024-02-18",
      status: "processing",
      total: 1299,
      items: 1,
    },
  ];

  const isEmpty = orders.length === 0;

  if (isEmpty) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="Start shopping to see your orders here"
        action={{
          label: "Start Shopping",
          onClick: () => {},
        }}
      />
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      delivered: "default",
      processing: "secondary",
      cancelled: "destructive",
      pending: "outline",
    };

    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="mt-2 text-muted-foreground">
          View and track your order history
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Placed on {new Date(order.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {order.items} {order.items === 1 ? "item" : "items"}
                  </span>
                  <span className="font-semibold">
                    ฿{order.total.toLocaleString()}
                  </span>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/(user)/orders/${order.id}`}>
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  {order.status === "delivered" && (
                    <Button variant="outline">Review</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
