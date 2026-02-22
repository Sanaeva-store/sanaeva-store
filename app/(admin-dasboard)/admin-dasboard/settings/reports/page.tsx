import type { Metadata } from "next";
import { FileText } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/shared/ui";

export const metadata: Metadata = {
  title: "Report Settings - Sanaeva Store",
  description: "Configure report exports and schedules",
};

export default function ReportSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Report Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Configure reporting templates, exports, and delivery preferences
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reporting Configuration</CardTitle>
          <CardDescription>Export format, delivery schedule, and recipients</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="form" count={5} />
        </CardContent>
      </Card>
    </div>
  );
}
