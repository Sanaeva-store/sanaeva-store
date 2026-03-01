"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSkeleton, ErrorState } from "@/shared/ui";
import {
  useStockTransferDetailQuery,
  useApproveStockTransferMutation,
  useShipStockTransferMutation,
  useReceiveStockTransferMutation,
  useCompleteStockTransferMutation,
  useCancelStockTransferMutation,
} from "@/features/inventory/hooks/use-stock-transfers";
import type { TransferStatus } from "@/features/inventory/api/stock-transfers.api";
import { formatDate, useBackofficeTranslations } from "@/shared/lib/i18n";
import { useLocale } from "@/shared/lib/i18n/use-locale";
import { BackButton } from "@/components/common/back-button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

interface Props {
  id: string;
}

export function TransferDetailClient({ id }: Props) {
  const currentLocale = useLocale();
  const { locale } = useBackofficeTranslations("sidebar");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { data: transfer, isLoading, isError, error, refetch } = useStockTransferDetailQuery(id);
  const approve = useApproveStockTransferMutation();
  const ship = useShipStockTransferMutation();
  const receive = useReceiveStockTransferMutation();
  const complete = useCompleteStockTransferMutation();
  const cancel = useCancelStockTransferMutation();

  const isMutating =
    approve.isPending || ship.isPending || receive.isPending || complete.isPending || cancel.isPending;

  if (isLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (isError || !transfer)
    return (
      <ErrorState
        title="Failed to load transfer"
        message={(error as Error)?.message ?? "Not found"}
        retry={() => void refetch()}
      />
    );

  const canApprove = transfer.status === "PENDING";
  const canShip = transfer.status === "APPROVED";
  const canReceive = transfer.status === "IN_TRANSIT";
  const canComplete = transfer.status === "RECEIVED";
  const canCancel = !(["COMPLETED", "CANCELLED"] as TransferStatus[]).includes(transfer.status);

  const onCancelConfirmed = () => {
    cancel.mutate(id, {
      onSuccess: () => { toast.success("Transfer cancelled"); setShowCancelConfirm(false); },
      onError: (e) => { toast.error((e as Error).message ?? "Cancel failed"); setShowCancelConfirm(false); },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BackButton
          fallbackHref={`/${currentLocale}/admin-dasboard/stock-control/transfers`}
          label="Back"
        />
        <ArrowLeftRight className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Transfer: {transfer.code}</h1>
          <p className="text-sm text-muted-foreground">
            {transfer.fromWarehouseId} → {transfer.toWarehouseId}
          </p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {transfer.status}
        </Badge>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Lifecycle transitions for this stock transfer</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="default"
            disabled={!canApprove || isMutating}
            onClick={() =>
              approve.mutate(id, {
                onSuccess: () => toast.success("Transfer approved"),
                onError: (e) => toast.error((e as Error).message ?? "Approve failed"),
              })
            }
          >
            Approve
          </Button>
          <Button
            variant="outline"
            disabled={!canShip || isMutating}
            onClick={() =>
              ship.mutate(id, {
                onSuccess: () => toast.success("Transfer shipped"),
                onError: (e) => toast.error((e as Error).message ?? "Ship failed"),
              })
            }
          >
            Ship
          </Button>
          <Button
            variant="outline"
            disabled={!canReceive || isMutating}
            onClick={() =>
              receive.mutate(
                { id, payload: { items: transfer.items.map((i) => ({ variantId: i.variantId, qty: i.qty })) } },
                {
                  onSuccess: () => toast.success("Transfer received"),
                  onError: (e) => toast.error((e as Error).message ?? "Receive failed"),
                },
              )
            }
          >
            Receive
          </Button>
          <Button
            variant="outline"
            disabled={!canComplete || isMutating}
            onClick={() =>
              complete.mutate(id, {
                onSuccess: () => toast.success("Transfer completed"),
                onError: (e) => toast.error((e as Error).message ?? "Complete failed"),
              })
            }
          >
            Complete
          </Button>
          <Button
            variant="destructive"
            disabled={!canCancel || isMutating}
            onClick={() => setShowCancelConfirm(true)}
          >
            Cancel Transfer
          </Button>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 text-sm md:grid-cols-3">
            <div>
              <span className="font-medium text-muted-foreground">From Warehouse</span>
              <p className="font-mono">{transfer.fromWarehouseId}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">To Warehouse</span>
              <p className="font-mono">{transfer.toWarehouseId}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Created</span>
              <p>{formatDate(new Date(transfer.createdAt), locale)}</p>
            </div>
            {transfer.note && (
              <div className="md:col-span-3">
                <span className="font-medium text-muted-foreground">Note</span>
                <p>{transfer.note}</p>
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Items ({transfer.items.length})</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variant ID</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfer.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.variantId}</TableCell>
                    <TableCell className="text-right">{item.qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showCancelConfirm}
        onOpenChange={setShowCancelConfirm}
        title="Cancel Transfer?"
        description="This action will cancel the stock transfer and cannot be undone."
        confirmLabel="Cancel Transfer"
        cancelLabel="Keep"
        variant="destructive"
        onConfirm={onCancelConfirmed}
        isLoading={cancel.isPending}
      />
    </div>
  );
}
