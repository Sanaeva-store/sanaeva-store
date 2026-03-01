"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
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
  useStockTransfersQuery,
  useApproveStockTransferMutation,
  useShipStockTransferMutation,
  useCompleteStockTransferMutation,
  useCancelStockTransferMutation,
} from "@/features/inventory/hooks/use-stock-transfers";
import { useBackofficeTranslations } from "@/shared/lib/i18n";

export function TransfersClient() {
  const { t } = useBackofficeTranslations("sidebar");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useStockTransfersQuery({ page, limit: 20 });
  const approve = useApproveStockTransferMutation();
  const ship = useShipStockTransferMutation();
  const complete = useCompleteStockTransferMutation();
  const cancel = useCancelStockTransferMutation();

  const items = data?.data ?? [];
  const maxPage = data?.totalPages ?? 1;
  const isMutating =
    approve.isPending || ship.isPending || complete.isPending || cancel.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ArrowLeftRight className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("items.stockTransfers")}</h1>
          <p className="mt-2 text-muted-foreground">{t("groups.stockControl")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("items.stockTransfers")}</CardTitle>
          <CardDescription>Connected to `GET /api/stock-transfers` + workflow actions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" count={8} />}

          {isError && (
            <ErrorState
              title="Failed to load stock transfers"
              message={(error as Error)?.message}
              retry={() => void refetch()}
            />
          )}

          {!isLoading && !isError && items.length === 0 && (
            <EmptyState title="No transfers" description="No stock transfers found." />
          )}

          {!isLoading && !isError && items.length > 0 && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell className="font-medium">{transfer.code}</TableCell>
                        <TableCell>{transfer.fromWarehouseId}</TableCell>
                        <TableCell>{transfer.toWarehouseId}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{transfer.status}</Badge>
                        </TableCell>
                        <TableCell>{transfer.items.length}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isMutating}
                              onClick={() => approve.mutate(transfer.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isMutating}
                              onClick={() => ship.mutate(transfer.id)}
                            >
                              Ship
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isMutating}
                              onClick={() => complete.mutate(transfer.id)}
                            >
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isMutating}
                              onClick={() => cancel.mutate(transfer.id)}
                            >
                              Cancel
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
                  Page {data?.page ?? 1} of {maxPage} ({data?.total ?? 0} transfers)
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
