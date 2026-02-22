import type { Metadata } from "next";
import { Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/shared/ui";

export const metadata: Metadata = {
  title: "Customers - Sanaeva Store",
  description: "Customer management and segmentation",
};

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="mt-2 text-muted-foreground">
            View customer profiles, segments, and purchase history
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
          <CardDescription>Search and manage customer accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="table" count={8} />
        </CardContent>
      </Card>
    </div>
  );
}
