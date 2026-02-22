"use client";

import { AlertTriangle, ArrowDownLeft, ArrowUpRight, Package, RefreshCw, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ErrorState } from "@/shared/ui";
import {
  useLowStockQuery,
  useTransactionsQuery,
} from "@/features/inventory/hooks/use-inventory";

const today = new Date().toISOString().split("T")[0];

export default function InventoryDashboardPage() {
  const {
    data: lowStockData,
    isLoading: lowStockLoading,
    isError: lowStockError,
    refetch: refetchLowStock,
  } = useLowStockQuery();

  const {
    data: txnData,
    isLoading: txnLoading,
    isError: txnError,
    refetch: refetchTxn,
  } = useTransactionsQuery({ from: today, limit: 10, page: 1 });

  const lowStockCount = lowStockData?.length ?? 0;
  const inboundToday = txnData?.data.filter((t) => t.type === "INBOUND").length ?? 0;
  const adjustmentsToday = txnData?.data.filter((t) => t.type === "ADJUST").length ?? 0;
  const totalTxnToday = txnData?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Overview of your inventory status and recent activity
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { void refetchLowStock(); void refetchTxn(); }}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {lowStockLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
            )}
            <p className="text-xs text-muted-foreground">Below reorder point</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inbound Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {txnLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{inboundToday}</div>
            )}
            <p className="text-xs text-muted-foreground">INBOUND transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adjustments Today</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            {txnLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{adjustmentsToday}</div>
            )}
            <p className="text-xs text-muted-foreground">ADJUST transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movements Today</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {txnLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{totalTxnToday}</div>
            )}
            <p className="text-xs text-muted-foreground">All transaction types</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>Items below their reorder point</CardDescription>
            </div>
            {lowStockData && lowStockData.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {lowStockData.length} item{lowStockData.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {lowStockLoading && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}
          {lowStockError && (
            <ErrorState
              title="Failed to load low stock data"
              retry={() => void refetchLowStock()}
              className="min-h-[120px]"
            />
          )}
          {!lowStockLoading && !lowStockError && lowStockData && lowStockData.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              All products are above their reorder points.
            </p>
          )}
          {!lowStockLoading && !lowStockError && lowStockData && lowStockData.length > 0 && (
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
                {[...lowStockData]
                  .sort((a, b) => b.shortage - a.shortage)
                  .slice(0, 8)
                  .map((item) => (
                    <TableRow key={`${item.variantId}-${item.warehouseId}`}>
                      <TableCell className="font-mono text-sm font-medium">{item.sku}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{item.warehouseId}</TableCell>
                      <TableCell className="text-right tabular-nums">{item.available}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{item.reorderPoint}</TableCell>
                      <TableCell className="text-right tabular-nums font-semibold text-destructive">
                        -{item.shortage}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Stock Activity</CardTitle>
          <CardDescription>Latest inventory movements today</CardDescription>
        </CardHeader>
        <CardContent>
          {txnLoading && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}
          {txnError && (
            <ErrorState
              title="Failed to load transactions"
              retry={() => void refetchTxn()}
              className="min-h-[120px]"
            />
          )}
          {!txnLoading && !txnError && txnData && txnData.data.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No transactions recorded today.
            </p>
          )}
          {!txnLoading && !txnError && txnData && txnData.data.length > 0 && (
            <div className="space-y-2">
              {txnData.data.slice(0, 8).map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-1.5 ${txn.qty > 0 ? "bg-green-100" : "bg-red-100"}`}>
                      {txn.qty > 0 ? (
                        <ArrowUpRight className="h-3.5 w-3.5 text-green-700" />
                      ) : (
                        <ArrowDownLeft className="h-3.5 w-3.5 text-red-700" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{txn.type}</p>
                      <p className="font-mono text-xs text-muted-foreground">{txn.variantId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold tabular-nums ${txn.qty > 0 ? "text-green-600" : "text-destructive"}`}>
                      {txn.qty > 0 ? "+" : ""}{txn.qty}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {txn.beforeQty} → {txn.afterQty}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
