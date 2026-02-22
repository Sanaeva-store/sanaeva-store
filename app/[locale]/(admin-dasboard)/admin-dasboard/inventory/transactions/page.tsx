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

const TXN_TYPE_COLORS: Record<StockTxnType, string> = {
  INBOUND: "bg-green-100 text-green-800",
  OUTBOUND: "bg-red-100 text-red-800",
  ADJUST: "bg-yellow-100 text-yellow-800",
  INITIALIZE: "bg-blue-100 text-blue-800",
  RESERVE: "bg-purple-100 text-purple-800",
  RELEASE: "bg-indigo-100 text-indigo-800",
  TRANSFER_IN: "bg-teal-100 text-teal-800",
  TRANSFER_OUT: "bg-orange-100 text-orange-800",
};

export default function StockTransactionsPage() {
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
        <h1 className="text-3xl font-bold">Stock Transactions</h1>
        <p className="mt-2 text-muted-foreground">
          Complete history of all inventory movements
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Filter transactions by variant, warehouse, type, or date range</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="filter-variant">Variant ID</Label>
              <Input
                id="filter-variant"
                placeholder="e.g. clvar001"
                className="h-10"
                value={variantId}
                onChange={(e) => setVariantId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-warehouse">Warehouse ID</Label>
              <Input
                id="filter-warehouse"
                placeholder="e.g. clwh001"
                className="h-10"
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-type">Transaction Type</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v === "all" ? "" : (v as StockTxnType))}
              >
                <SelectTrigger id="filter-type" className="h-10">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {stockTxnTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={applyFilters} className="flex-1 h-10">
                <Filter className="mr-2 h-4 w-4" />
                Apply
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" onClick={resetFilters} title="Reset filters">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="filter-from">From Date</Label>
              <Input
                id="filter-from"
                type="date"
                className="h-10"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-to">To Date</Label>
              <Input
                id="filter-to"
                type="date"
                className="h-10"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                {isLoading ? "Loading..." : `${total.toLocaleString()} total records`}
              </CardDescription>
            </div>
            {data && (
              <Badge variant="secondary" className="text-xs">
                Page {appliedFilters.page} of {totalPages}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" count={10} />}

          {isError && (
            <ErrorState
              title="Failed to load transactions"
              message={(error as Error)?.message ?? "An error occurred"}
              retry={() => void refetch()}
            />
          )}

          {!isLoading && !isError && data && data.data.length === 0 && (
            <EmptyState
              title="No transactions found"
              description="Try adjusting your filters or date range."
            />
          )}

          {!isLoading && !isError && data && data.data.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Variant ID</TableHead>
                      <TableHead>Warehouse ID</TableHead>
                      <TableHead className="text-right">Before</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">After</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TXN_TYPE_COLORS[txn.type] ?? "bg-muted text-muted-foreground"}`}
                          >
                            {txn.qty > 0 ? (
                              <ArrowUpRight className="mr-1 h-3 w-3" />
                            ) : (
                              <ArrowDownLeft className="mr-1 h-3 w-3" />
                            )}
                            {txn.type}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{txn.variantId}</TableCell>
                        <TableCell className="font-mono text-xs">{txn.warehouseId}</TableCell>
                        <TableCell className="text-right tabular-nums">{txn.beforeQty}</TableCell>
                        <TableCell className={`text-right tabular-nums font-semibold ${txn.qty > 0 ? "text-green-600" : "text-destructive"}`}>
                          {txn.qty > 0 ? "+" : ""}{txn.qty}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{txn.afterQty}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {txn.reasonCode ?? "—"}
                        </TableCell>
                        <TableCell className="max-w-[160px] truncate text-xs text-muted-foreground">
                          {txn.note ?? "—"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {new Date(txn.createdAt).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {((appliedFilters.page - 1) * limit) + 1}–{Math.min(appliedFilters.page * limit, total)} of {total}
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
