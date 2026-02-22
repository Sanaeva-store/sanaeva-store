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

export default function LowStockPage() {
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
          <h1 className="text-3xl font-bold">Low Stock Alerts</h1>
          <p className="mt-2 text-muted-foreground">
            Items below their reorder point that need restocking
          </p>
        </div>
        {data && (
          <Badge variant="destructive" className="text-sm">
            <AlertTriangle className="mr-1 h-3 w-3" />
            {data.length} item{data.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-2">
              <Label htmlFor="wh-filter">Warehouse ID</Label>
              <Input
                id="wh-filter"
                placeholder="e.g. clwh001"
                className="h-10 w-[200px]"
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") applyFilter(); }}
              />
            </div>
            <Button onClick={applyFilter} className="h-10">Apply</Button>
            <Button variant="outline" size="icon" className="h-10 w-10" onClick={resetFilter} title="Reset">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Items</CardTitle>
          <CardDescription>
            Products below their reorder point — sorted by shortage severity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" count={8} />}

          {isError && (
            <ErrorState
              title="Failed to load low stock data"
              message={(error as Error)?.message ?? "An error occurred"}
              retry={() => void refetch()}
            />
          )}

          {!isLoading && !isError && data && data.length === 0 && (
            <EmptyState
              icon={TrendingDown}
              title="No low stock items"
              description="All products are above their reorder points."
            />
          )}

          {!isLoading && !isError && data && data.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Variant ID</TableHead>
                    <TableHead>Warehouse ID</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead className="text-right">Reorder Point</TableHead>
                    <TableHead className="text-right">Shortage</TableHead>
                    <TableHead>Severity</TableHead>
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
                          <TableCell className="text-right tabular-nums font-semibold text-destructive">
                            -{item.shortage}
                          </TableCell>
                          <TableCell>
                            {severity === "critical" && (
                              <Badge variant="destructive" className="text-xs">Critical</Badge>
                            )}
                            {severity === "warning" && (
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs hover:bg-yellow-100">Warning</Badge>
                            )}
                            {severity === "low" && (
                              <Badge variant="secondary" className="text-xs">Low</Badge>
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
