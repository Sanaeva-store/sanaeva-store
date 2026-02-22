import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/shared/ui";

export const metadata: Metadata = {
  title: "Analytics - Sanaeva Store",
  description: "Sales and operational analytics overview",
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-2 text-muted-foreground">
          Track revenue, orders, and operations performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {["Revenue", "Orders", "AOV", "Conversion"].map((title) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <LoadingSkeleton variant="form" count={1} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trend Charts</CardTitle>
          <CardDescription>Daily and monthly performance trends</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="card" count={2} />
        </CardContent>
      </Card>
    </div>
  );
}
