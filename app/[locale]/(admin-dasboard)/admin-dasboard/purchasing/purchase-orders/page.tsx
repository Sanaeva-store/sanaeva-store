"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LoadingSkeleton, ErrorState, EmptyState } from "@/shared/ui";
import { usePurchaseOrdersQuery } from "@/features/inventory/hooks/use-purchase-orders";
import type { DocStatus } from "@/features/inventory/api/purchase-orders.api";
import { useBackofficeTranslations } from "@/shared/lib/i18n";
import { formatDate } from "@/shared/lib/i18n";

const STATUS_VARIANT: Record<
  DocStatus,
  "default" | "secondary" | "outline" | "destructive" | "success"
> = {
  DRAFT: "secondary",
  APPROVED: "default",
  SENT: "outline",
  PARTIAL: "outline",
  RECEIVED: "success",
  CLOSED: "secondary",
  CANCELLED: "destructive",
};

const DOC_STATUSES: DocStatus[] = [
  "DRAFT",
  "APPROVED",
  "SENT",
  "PARTIAL",
  "RECEIVED",
  "CLOSED",
  "CANCELLED",
];

export default function PurchaseOrdersPage() {
  const { t, locale } = useBackofficeTranslations("sidebar");
  const [page, setPage] = useState(1);
  const limit = 20;
  const [statusFilter, setStatusFilter] = useState<DocStatus | "ALL">("ALL");

  const params = {
    page,
    limit,
    ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
  };

  const { data, isLoading, isError, error, refetch } =
    usePurchaseOrdersQuery(params);

  const orders = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardList className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("items.purchaseOrders")}</h1>
          <p className="mt-2 text-muted-foreground">{t("groups.purchasing")}</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:w-56">
            <Label htmlFor="poStatusFilter">Status</Label>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as DocStatus | "ALL");
                setPage(1);
              }}
            >
              <SelectTrigger id="poStatusFilter">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                {DOC_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("items.purchaseOrders")}</CardTitle>
              <CardDescription className="mt-1">
                {isLoading
                  ? "Loading…"
                  : `${data?.total ?? 0} order(s)`}
              </CardDescription>
            </div>
            {totalPages > 1 && (
              <Badge variant="secondary" className="text-xs">
                Page {page} / {totalPages}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" count={8} />}
          {isError && (
            <ErrorState
              title="Failed to load purchase orders"
              message={
                (error as { message?: string })?.message ??
                "An unexpected error occurred."
              }
              retry={() => void refetch()}
            />
          )}
          {!isLoading && !isError && orders.length === 0 && (
            <EmptyState
              title="No purchase orders"
              description="No purchase orders found for the selected filter."
            />
          )}
          {!isLoading && !isError && orders.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Items</TableHead>
                      <TableHead>Expected</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono font-medium">
                          {order.code}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {order.supplierId}
                        </TableCell>
                        <TableCell>
                          <Badge variant={STATUS_VARIANT[order.status]}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {order.items.length}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {order.expectedAt
                            ? formatDate(new Date(order.expectedAt), locale)
                            : "—"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {formatDate(new Date(order.createdAt), locale)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
