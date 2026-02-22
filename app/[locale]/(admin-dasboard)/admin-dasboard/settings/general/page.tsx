import type { Metadata } from "next";
import { Settings } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/shared/ui";

export const metadata: Metadata = {
  title: "General Settings - Sanaeva Store",
  description: "Configure store-wide administrative settings",
};

export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">General Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage store profile, preferences, and operational defaults
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Configuration</CardTitle>
          <CardDescription>Business profile and default preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="form" count={6} />
        </CardContent>
      </Card>
    </div>
  );
}
