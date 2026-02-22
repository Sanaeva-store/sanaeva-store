"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight, Filter, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/shared/ui";
import { stockTxnTypeOptions } from "@/shared/constants/options";
import { useTransactionsQuery } from "@/features/inventory/hooks/use-inventory";
import type { StockTxnType } from "@/features/inventory/api/inventory.api";
import { formatDate, formatNumber, useBackofficeTranslations } from "@/shared/lib/i18n";

const TXN_TYPE_COLORS: Record<StockTxnType, string> = {
  INBOUND: "bg-semantic-success-bg text-semantic-success-text",
  OUTBOUND: "bg-semantic-error-bg text-semantic-error-text",
  ADJUST: "bg-semantic-warning-bg text-semantic-warning-text",
  INITIALIZE: "bg-semantic-info-bg text-semantic-info-text",
  RESERVE: "bg-secondary text-secondary-foreground",
  RELEASE: "bg-muted text-muted-foreground",
  TRANSFER_IN: "bg-semantic-success-bg text-semantic-success-text",
  TRANSFER_OUT: "bg-semantic-warning-bg text-semantic-warning-text",
};

export default function StockTransactionsPage() {
  const { t, locale } = useBackofficeTranslations("inventory-transactions");
  const [variantId, setVariantId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [type, setType] = useState<StockTxnType | "">("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const limit = 20;

  const [appliedFilters, setAppliedFilters] = useState({
    variantId: "",
    warehouseId: "",
    type: "" as StockTxnType | "",
    from: "",
    to: "",
    page: 1,
    limit,
  });

  const { data, isLoading, isError, error, refetch } = useTransactionsQuery({
    variantId: appliedFilters.variantId || undefined,
    warehouseId: appliedFilters.warehouseId || undefined,
    type: (appliedFilters.type as StockTxnType) || undefined,
    from: appliedFilters.from || undefined,
    to: appliedFilters.to || undefined,
    page: appliedFilters.page,
    limit: appliedFilters.limit,
  });

  const applyFilters = () => {
    setAppliedFilters({ variantId, warehouseId, type, from, to, page: 1, limit });
  };

  const resetFilters = () => {
    setVariantId("");
    setWarehouseId("");
    setType("");
    setFrom("");
    setTo("");
    setAppliedFilters({ variantId: "", warehouseId: "", type: "", from: "", to: "", page: 1, limit });
  };

  const goToPage = (newPage: number) => {
    setAppliedFilters((prev) => ({ ...prev, page: newPage }));
  };

  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("filters.title")}</CardTitle>
          <CardDescription>{t("filters.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="filter-variant">{t("filters.variantId")}</Label>
              <Input
                id="filter-variant"
                placeholder={t("filters.variantPlaceholder")}
                className="h-10"
                value={variantId}
                onChange={(e) => setVariantId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-warehouse">{t("filters.warehouseId")}</Label>
              <Input
                id="filter-warehouse"
                placeholder={t("filters.warehousePlaceholder")}
                className="h-10"
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-type">{t("filters.transactionType")}</Label>
              <Select value={type} onValueChange={(v) => setType(v === "all" ? "" : (v as StockTxnType))}>
                <SelectTrigger id="filter-type" className="h-10">
                  <SelectValue placeholder={t("filters.allTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.allTypes")}</SelectItem>
                  {stockTxnTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(`typeLabels.${option.value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={applyFilters} className="h-10 flex-1">
                <Filter className="mr-2 h-4 w-4" />
                {t("filters.apply")}
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" onClick={resetFilters} title={t("filters.reset")}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="filter-from">{t("filters.fromDate")}</Label>
              <Input id="filter-from" type="date" className="h-10" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-to">{t("filters.toDate")}</Label>
              <Input id="filter-to" type="date" className="h-10" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("table.title")}</CardTitle>
              <CardDescription>
                {isLoading
                  ? t("table.loading")
                  : `${formatNumber(total, locale)} ${t("table.totalRecords")}`}
              </CardDescription>
            </div>
            {data && (
              <Badge variant="secondary" className="text-xs">
                {t("table.pageOf", undefined, { page: appliedFilters.page, totalPages })}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" count={10} />}

          {isError && (
            <ErrorState
              title={t("table.loadFailed")}
              message={(error as Error)?.message ?? ""}
              retry={() => void refetch()}
            />
          )}

          {!isLoading && !isError && data && data.data.length === 0 && (
            <EmptyState title={t("table.emptyTitle")} description={t("table.emptyDescription")} />
          )}

          {!isLoading && !isError && data && data.data.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("table.columns.type")}</TableHead>
                      <TableHead>{t("table.columns.variantId")}</TableHead>
                      <TableHead>{t("table.columns.warehouseId")}</TableHead>
                      <TableHead className="text-right">{t("table.columns.before")}</TableHead>
                      <TableHead className="text-right">{t("table.columns.qty")}</TableHead>
                      <TableHead className="text-right">{t("table.columns.after")}</TableHead>
                      <TableHead>{t("table.columns.reason")}</TableHead>
                      <TableHead>{t("table.columns.note")}</TableHead>
                      <TableHead>{t("table.columns.date")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TXN_TYPE_COLORS[txn.type] ?? "bg-muted text-muted-foreground"}`}
                          >
                            {txn.qty > 0 ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownLeft className="mr-1 h-3 w-3" />}
                            {t(`typeLabels.${txn.type}`, txn.type)}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{txn.variantId}</TableCell>
                        <TableCell className="font-mono text-xs">{txn.warehouseId}</TableCell>
                        <TableCell className="text-right tabular-nums">{txn.beforeQty}</TableCell>
                        <TableCell className={`text-right tabular-nums font-semibold ${txn.qty > 0 ? "text-semantic-success-text" : "text-destructive"}`}>
                          {txn.qty > 0 ? "+" : ""}
                          {txn.qty}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{txn.afterQty}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{txn.reasonCode ?? "—"}</TableCell>
                        <TableCell className="max-w-[160px] truncate text-xs text-muted-foreground">{txn.note ?? "—"}</TableCell>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {formatDate(new Date(txn.createdAt), locale, {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t("table.showing", undefined, {
                    start: (appliedFilters.page - 1) * limit + 1,
                    end: Math.min(appliedFilters.page * limit, total),
                    total,
                  })}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={appliedFilters.page <= 1}
                    onClick={() => goToPage(appliedFilters.page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    {appliedFilters.page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={appliedFilters.page >= totalPages}
                    onClick={() => goToPage(appliedFilters.page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
