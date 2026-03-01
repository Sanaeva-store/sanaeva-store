"use client";

import { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState, ErrorState, LoadingSkeleton } from "@/shared/ui";
import {
  useOrdersQuery,
  useReserveOrderStockMutation,
  useReleaseOrderStockMutation,
  useCommitOrderMutation,
} from "@/features/inventory/hooks/use-orders";
import { useBackofficeTranslations } from "@/shared/lib/i18n";

export function OrderManagementClient() {
  const { t } = useBackofficeTranslations("order-management");
  const [page, setPage] = useState(1);
  const limit = 20;

  const params = useMemo(
    () => ({ page, limit, status: "PENDING" as const }),
    [page],
  );

  const { data, isLoading, isError, error, refetch } = useOrdersQuery(params);
  const reserve = useReserveOrderStockMutation();
  const release = useReleaseOrderStockMutation();
  const commit = useCommitOrderMutation();

  const items = data?.data ?? [];
  const maxPage = data?.totalPages ?? 1;
  const isMutating = reserve.isPending || release.isPending || commit.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("queueTitle")}</CardTitle>
          <CardDescription>{t("queueDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" count={7} />}

          {isError && (
            <ErrorState
              title="Failed to load order queue"
              message={(error as Error)?.message}
              retry={() => void refetch()}
            />
          )}

          {!isLoading && !isError && items.length === 0 && (
            <EmptyState title="No pending orders" description="Queue is empty." />
          )}

          {!isLoading && !isError && items.length > 0 && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.code}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{order.status}</Badge>
                        </TableCell>
                        <TableCell>{order.items.length}</TableCell>
                        <TableCell className="text-right">{order.total}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isMutating}
                              onClick={() => reserve.mutate(order.id, { onError: (e) => toast.error((e as Error).message ?? "Reserve failed") })}
                            >
                              Reserve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isMutating}
                              onClick={() => release.mutate(order.id, { onError: (e) => toast.error((e as Error).message ?? "Release failed") })}
                            >
                              Release
                            </Button>
                            <Button
                              size="sm"
                              disabled={isMutating}
                              onClick={() => commit.mutate(order.id, { onError: (e) => toast.error((e as Error).message ?? "Commit failed") })}
                            >
                              Commit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {data?.page ?? 1} of {maxPage} ({data?.total ?? 0} orders)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= maxPage}
                    onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
