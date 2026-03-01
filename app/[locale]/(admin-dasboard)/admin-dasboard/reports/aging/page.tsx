"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/shared/ui";
import { useAgingReportQuery } from "@/features/inventory/hooks/use-reports";
import { useBackofficeTranslations } from "@/shared/lib/i18n";
import { formatDate } from "@/shared/lib/i18n";

export default function ReportAgingPage() {
  const { t, locale } = useBackofficeTranslations("sidebar");
  const [warehouseId, setWarehouseId] = useState("");

  const { data, isLoading, isError, error, refetch } = useAgingReportQuery(
    warehouseId.trim() || undefined,
  );

  const items = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <RotateCcw className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("items.reportAging")}</h1>
          <p className="mt-2 text-muted-foreground">{t("groups.reports")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:w-72">
            <Label htmlFor="agingWarehouse">Warehouse ID (optional)</Label>
            <Input
              id="agingWarehouse"
              placeholder="All warehouses"
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("items.reportAging")}</CardTitle>
          <CardDescription>{items.length} item(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" count={8} />}
          {isError && (
            <ErrorState
              title="Failed to load aging report"
              message={(error as { message?: string })?.message ?? "An unexpected error occurred."}
              retry={() => void refetch()}
            />
          )}
          {!isLoading && !isError && items.length === 0 && (
            <EmptyState title="No aging data" description="No stock aging data available." />
          )}
          {!isLoading && !isError && items.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Received At</TableHead>
                  <TableHead className="text-right">Age (days)</TableHead>
                  <TableHead className="text-right">On Hand</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={`${item.variantId}-${item.warehouseId}-${item.receivedAt}`}>
                    <TableCell className="font-mono">{item.sku}</TableCell>
                    <TableCell className="text-muted-foreground">{item.warehouseId}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(new Date(item.receivedAt), locale)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={item.ageDays > 90 ? "destructive" : "secondary"}>
                        {item.ageDays}d
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{item.onHand}</TableCell>
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
