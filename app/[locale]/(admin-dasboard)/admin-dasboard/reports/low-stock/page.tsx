"use client";

import { useState } from "react";
import { TrendingDown } from "lucide-react";
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
import { useLowStockReportQuery } from "@/features/inventory/hooks/use-reports";
import { useBackofficeTranslations } from "@/shared/lib/i18n";

export default function ReportLowStockPage() {
  const { t } = useBackofficeTranslations("sidebar");
  const [warehouseId, setWarehouseId] = useState("");

  const { data, isLoading, isError, error, refetch } = useLowStockReportQuery(
    warehouseId.trim() || undefined,
  );

  const items = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingDown className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("items.reportLowStock")}</h1>
          <p className="mt-2 text-muted-foreground">{t("groups.reports")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:w-72">
            <Label htmlFor="warehouseId">Warehouse ID (optional)</Label>
            <Input
              id="warehouseId"
              placeholder="All warehouses"
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("items.reportLowStock")}</CardTitle>
          <CardDescription>
            {data ? `${data.total} item(s) below reorder point` : "Loading…"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" count={8} />}
          {isError && (
            <ErrorState
              title="Failed to load report"
              message={
                (error as { message?: string })?.message ??
                "An unexpected error occurred."
              }
              retry={() => void refetch()}
            />
          )}
          {!isLoading && !isError && items.length === 0 && (
            <EmptyState
              title="No low-stock items"
              description="All SKUs are above their reorder points."
            />
          )}
          {!isLoading && !isError && items.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead className="text-right">Available</TableHead>
                  <TableHead className="text-right">Reorder Point</TableHead>
                  <TableHead className="text-right">Shortage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={`${item.variantId}-${item.warehouseId}`}>
                    <TableCell className="font-mono">{item.sku}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.warehouseId}
                    </TableCell>
                    <TableCell className="text-right">{item.available}</TableCell>
                    <TableCell className="text-right">{item.reorderPoint}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">{item.shortage}</Badge>
                    </TableCell>
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
