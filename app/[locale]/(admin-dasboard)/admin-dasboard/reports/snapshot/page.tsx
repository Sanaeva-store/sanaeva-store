"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/shared/ui";
import { useSnapshotReportQuery } from "@/features/inventory/hooks/use-reports";
import { useBackofficeTranslations } from "@/shared/lib/i18n";

export default function ReportSnapshotPage() {
  const { t } = useBackofficeTranslations("sidebar");
  const [date, setDate] = useState("");

  const { data, isLoading, isError, error, refetch } = useSnapshotReportQuery(
    date.trim(),
  );

  const items = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Camera className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("items.reportSnapshot")}</h1>
          <p className="mt-2 text-muted-foreground">{t("groups.reports")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
          <CardDescription>Choose a date to view the inventory snapshot.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:w-64">
            <Label htmlFor="snapshotDate">Snapshot Date</Label>
            <Input
              id="snapshotDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("items.reportSnapshot")}</CardTitle>
          <CardDescription>
            {date ? `Snapshot for ${date} — ${items.length} item(s)` : "Select a date above to load the report."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!date && <p className="text-sm text-muted-foreground">Pick a date to view stock snapshot.</p>}
          {date && isLoading && <LoadingSkeleton variant="table" count={8} />}
          {date && isError && (
            <ErrorState
              title="Failed to load snapshot"
              message={(error as { message?: string })?.message ?? "An unexpected error occurred."}
              retry={() => void refetch()}
            />
          )}
          {date && !isLoading && !isError && items.length === 0 && (
            <EmptyState title="No data" description="No snapshot records for this date." />
          )}
          {date && !isLoading && !isError && items.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead className="text-right">On Hand</TableHead>
                  <TableHead className="text-right">Reserved</TableHead>
                  <TableHead className="text-right">Available</TableHead>
                  <TableHead>Snapshot Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={`${item.variantId}-${item.warehouseId}`}>
                    <TableCell className="font-mono">{item.sku}</TableCell>
                    <TableCell className="text-muted-foreground">{item.warehouseId}</TableCell>
                    <TableCell className="text-right">{item.onHand}</TableCell>
                    <TableCell className="text-right">{item.reserved}</TableCell>
                    <TableCell className="text-right">{item.available}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{item.snapshotDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
