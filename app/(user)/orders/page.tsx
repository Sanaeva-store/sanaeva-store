"use client";

import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/shared/ui";
import { useOrdersQuery } from "@/features/account/hooks/use-account";
import type { OrderStatus } from "@/features/account/api/account.api";

const STATUS_VARIANT: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  delivered: "default",
  processing: "secondary",
  cancelled: "destructive",
  pending: "outline",
  shipped: "secondary",
};

export default function OrdersPage() {
  const { data, isLoading, isError, refetch } = useOrdersQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="mt-2 text-muted-foreground">View and track your order history</p>
        </div>
        <LoadingSkeleton variant="list" count={3} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load orders"
        message="We couldn't fetch your orders. Please try again."
        retry={() => void refetch()}
      />
    );
  }

  const orders = data?.items ?? [];

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="Start shopping to see your orders here"
        action={{
          label: "Start Shopping",
          onClick: () => { window.location.href = "/products"; },
        }}
      />
    );
  }

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
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANT[order.status] ?? "default"}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </span>
                  <span className="font-semibold">
                    ฿{order.total.toLocaleString("th-TH")}
                  </span>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/orders/${order.id}`}>
                      View Details
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
