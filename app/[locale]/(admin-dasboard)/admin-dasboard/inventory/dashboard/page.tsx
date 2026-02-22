import type { Metadata } from "next";
import { Package, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/shared/ui";

export const metadata: Metadata = {
  title: "Inventory Dashboard - Sanaeva Store",
  description: "Overview of inventory status and alerts",
};

export default function InventoryDashboardPage() {
  // Mock data - will be replaced with real API calls
  const stats = [
    {
      title: "Low Stock Items",
      value: "12",
      icon: AlertTriangle,
      trend: "+2 from yesterday",
      variant: "destructive" as const,
    },
    {
      title: "Inbound Today",
      value: "45",
      icon: TrendingUp,
      trend: "3 shipments",
      variant: "default" as const,
    },
    {
      title: "Adjustments Today",
      value: "8",
      icon: Package,
      trend: "All processed",
      variant: "default" as const,
    },
    {
      title: "Total SKUs",
      value: "1,234",
      icon: Package,
      trend: "+15 this month",
      variant: "default" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Overview of your inventory status and recent activity
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Low Stock Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
          <CardDescription>Items that need restocking soon</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="table" count={5} />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Activity</CardTitle>
          <CardDescription>Latest inventory movements</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="list" count={5} />
        </CardContent>
      </Card>
    </div>
  );
}
