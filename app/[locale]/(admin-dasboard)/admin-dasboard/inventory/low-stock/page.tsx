"use client";

import { useState } from "react";
import { AlertTriangle, RotateCcw, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/shared/ui";
import { useLowStockQuery } from "@/features/inventory/hooks/use-inventory";
import { INVENTORY_FORM_UI } from "@/features/inventory/constants/form-ui";
import { useBackofficeTranslations } from "@/shared/lib/i18n";

export default function LowStockPage() {
  const { t } = useBackofficeTranslations("inventory-low-stock");
  const [warehouseId, setWarehouseId] = useState("");
  const [appliedWarehouseId, setAppliedWarehouseId] = useState<string | undefined>(undefined);

  const { data, isLoading, isError, error, refetch } = useLowStockQuery(appliedWarehouseId);

  const applyFilter = () => {
    setAppliedWarehouseId(warehouseId.trim() || undefined);
  };

  const resetFilter = () => {
    setWarehouseId("");
    setAppliedWarehouseId(undefined);
  };

  const getSeverity = (shortage: number, reorderPoint: number) => {
    const ratio = shortage / Math.max(reorderPoint, 1);
    if (ratio >= 1) return "critical";
    if (ratio >= 0.5) return "warning";
    return "low";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
        {data && (
          <Badge variant="destructive" className="text-sm">
            <AlertTriangle className="mr-1 h-3 w-3" />
            {data.length} {data.length === 1 ? t("badge.item") : t("badge.items")}
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("filter.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[240px] flex-1 space-y-2 sm:max-w-sm">
              <Label htmlFor="wh-filter">{t("filter.warehouseId")}</Label>
                <Input
                  id="wh-filter"
                  placeholder={t("filter.warehousePlaceholder")}
                  className={`${INVENTORY_FORM_UI.control} w-full`}
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") applyFilter(); }}
                />
              </div>
            <Button onClick={applyFilter} className={INVENTORY_FORM_UI.control}>{t("filter.apply")}</Button>
            <Button
              variant="outline"
              size="icon"
              className={INVENTORY_FORM_UI.iconButton}
              onClick={resetFilter}
              title={t("filter.reset")}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("table.title")}</CardTitle>
          <CardDescription>{t("table.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" count={8} />}

          {isError && (
            <ErrorState
              title={t("table.loadFailed")}
              message={(error as Error)?.message ?? undefined}
              retry={() => void refetch()}
            />
          )}

          {!isLoading && !isError && data && data.length === 0 && (
            <EmptyState
              icon={TrendingDown}
              title={t("table.emptyTitle")}
              description={t("table.emptyDescription")}
            />
          )}

          {!isLoading && !isError && data && data.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("table.columns.sku")}</TableHead>
                    <TableHead>{t("table.columns.variantId")}</TableHead>
                    <TableHead>{t("table.columns.warehouseId")}</TableHead>
                    <TableHead className="text-right">{t("table.columns.available")}</TableHead>
                    <TableHead className="text-right">{t("table.columns.reorderPoint")}</TableHead>
                    <TableHead className="text-right">{t("table.columns.shortage")}</TableHead>
                    <TableHead>{t("table.columns.severity")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...data]
                    .sort((a, b) => b.shortage - a.shortage)
                    .map((item) => {
                      const severity = getSeverity(item.shortage, item.reorderPoint);
                      return (
                        <TableRow key={`${item.variantId}-${item.warehouseId}`}>
                          <TableCell className="font-mono text-sm font-medium">{item.sku}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{item.variantId}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">{item.warehouseId}</TableCell>
                          <TableCell className="text-right tabular-nums">{item.available}</TableCell>
                          <TableCell className="text-right tabular-nums text-muted-foreground">{item.reorderPoint}</TableCell>
                          <TableCell className="text-right tabular-nums font-semibold text-destructive">-{item.shortage}</TableCell>
                          <TableCell>
                            {severity === "critical" && (
                              <Badge variant="destructive" className="text-xs">{t("table.severityValues.critical")}</Badge>
                            )}
                            {severity === "warning" && (
                              <Badge variant="warning" className="text-xs">{t("table.severityValues.warning")}</Badge>
                            )}
                            {severity === "low" && (
                              <Badge variant="secondary" className="text-xs">{t("table.severityValues.low")}</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
