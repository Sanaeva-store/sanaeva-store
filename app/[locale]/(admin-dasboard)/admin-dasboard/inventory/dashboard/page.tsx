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
import { useBackofficeTranslations } from "@/shared/lib/i18n";

const today = new Date().toISOString().split("T")[0];

export default function InventoryDashboardPage() {
  const { t } = useBackofficeTranslations("inventory-dashboard");

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
  const inboundToday = txnData?.data.filter((txn) => txn.type === "INBOUND").length ?? 0;
  const adjustmentsToday = txnData?.data.filter((txn) => txn.type === "ADJUST").length ?? 0;
  const totalTxnToday = txnData?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { void refetchLowStock(); void refetchTxn(); }}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("refresh")}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("kpis.lowStockItems")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {lowStockLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>}
            <p className="text-xs text-muted-foreground">{t("kpis.belowReorder")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("kpis.inboundToday")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-semantic-success-text" />
          </CardHeader>
          <CardContent>
            {txnLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{inboundToday}</div>}
            <p className="text-xs text-muted-foreground">{t("kpis.inboundTransactions")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("kpis.adjustmentsToday")}</CardTitle>
            <Package className="h-4 w-4 text-semantic-warning-text" />
          </CardHeader>
          <CardContent>
            {txnLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{adjustmentsToday}</div>}
            <p className="text-xs text-muted-foreground">{t("kpis.adjustTransactions")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("kpis.totalMovements")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {txnLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalTxnToday}</div>}
            <p className="text-xs text-muted-foreground">{t("kpis.allTransactionTypes")}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("lowStock.title")}</CardTitle>
              <CardDescription>{t("lowStock.description")}</CardDescription>
            </div>
            {lowStockData && lowStockData.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {lowStockData.length} {lowStockData.length === 1 ? t("lowStock.item") : t("lowStock.items")}
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
              title={t("lowStock.loadFailed")}
              retry={() => void refetchLowStock()}
              className="min-h-[120px]"
            />
          )}
          {!lowStockLoading && !lowStockError && lowStockData && lowStockData.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">{t("lowStock.allGood")}</p>
          )}
          {!lowStockLoading && !lowStockError && lowStockData && lowStockData.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("lowStock.columns.sku")}</TableHead>
                  <TableHead>{t("lowStock.columns.warehouse")}</TableHead>
                  <TableHead className="text-right">{t("lowStock.columns.available")}</TableHead>
                  <TableHead className="text-right">{t("lowStock.columns.reorderPoint")}</TableHead>
                  <TableHead className="text-right">{t("lowStock.columns.shortage")}</TableHead>
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
                      <TableCell className="text-right tabular-nums font-semibold text-destructive">-{item.shortage}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("activity.title")}</CardTitle>
          <CardDescription>{t("activity.description")}</CardDescription>
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
              title={t("activity.loadFailed")}
              retry={() => void refetchTxn()}
              className="min-h-[120px]"
            />
          )}
          {!txnLoading && !txnError && txnData && txnData.data.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">{t("activity.empty")}</p>
          )}
          {!txnLoading && !txnError && txnData && txnData.data.length > 0 && (
            <div className="space-y-2">
              {txnData.data.slice(0, 8).map((txn) => (
                <div key={txn.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-1.5 ${txn.qty > 0 ? "bg-semantic-success-bg" : "bg-semantic-error-bg"}`}>
                      {txn.qty > 0 ? (
                        <ArrowUpRight className="h-3.5 w-3.5 text-semantic-success-text" />
                      ) : (
                        <ArrowDownLeft className="h-3.5 w-3.5 text-semantic-error-text" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{txn.type}</p>
                      <p className="font-mono text-xs text-muted-foreground">{txn.variantId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold tabular-nums ${txn.qty > 0 ? "text-semantic-success-text" : "text-destructive"}`}>
                      {txn.qty > 0 ? "+" : ""}
                      {txn.qty}
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
