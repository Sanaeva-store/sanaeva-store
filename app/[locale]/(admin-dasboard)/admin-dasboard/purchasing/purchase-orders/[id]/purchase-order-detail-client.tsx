"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSkeleton, ErrorState } from "@/shared/ui";
import {
  usePurchaseOrderDetailQuery,
  useApprovePurchaseOrderMutation,
  useSendPurchaseOrderMutation,
  useReceivePurchaseOrderMutation,
  useCancelPurchaseOrderMutation,
} from "@/features/inventory/hooks/use-purchase-orders";
import type { DocStatus } from "@/features/inventory/api/purchase-orders.api";
import { formatDate, useBackofficeTranslations } from "@/shared/lib/i18n";
import { useLocale } from "@/shared/lib/i18n/use-locale";
import { BackButton } from "@/components/common/back-button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

const STATUS_VARIANT: Record<DocStatus, "default" | "secondary" | "outline" | "destructive" | "success"> = {
  DRAFT: "secondary",
  APPROVED: "default",
  SENT: "outline",
  PARTIAL: "outline",
  RECEIVED: "success",
  CLOSED: "secondary",
  CANCELLED: "destructive",
};

const receiveItemSchema = z.object({
  variantId: z.string(),
  qty: z.coerce.number().int().positive("Qty must be > 0"),
  unitCost: z.string().optional(),
});

const receiveSchema = z.object({
  warehouseId: z.string().min(1, "Warehouse ID is required"),
  locationId: z.string().optional(),
  invoiceNumber: z.string().optional(),
  note: z.string().optional(),
  items: z.array(receiveItemSchema),
});

type ReceiveFormValues = {
  warehouseId: string;
  locationId?: string;
  invoiceNumber?: string;
  note?: string;
  items: { variantId: string; qty: number; unitCost?: string }[];
};

interface Props {
  id: string;
}

export function PurchaseOrderDetailClient({ id }: Props) {
  const currentLocale = useLocale();
  const { locale } = useBackofficeTranslations("sidebar");
  const [showReceiveForm, setShowReceiveForm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { data: po, isLoading, isError, error, refetch } = usePurchaseOrderDetailQuery(id);
  const approve = useApprovePurchaseOrderMutation();
  const send = useSendPurchaseOrderMutation();
  const receive = useReceivePurchaseOrderMutation();
  const cancel = useCancelPurchaseOrderMutation();

  const isMutating = approve.isPending || send.isPending || receive.isPending || cancel.isPending;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ReceiveFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(receiveSchema) as any,
    defaultValues: {
      warehouseId: "",
      items: po?.items.map((item) => ({ variantId: item.variantId, qty: item.qty, unitCost: item.unitCost })) ?? [],
    },
  });

  const { fields } = useFieldArray({ control, name: "items" });

  const onReceive = (values: ReceiveFormValues) => {
    receive.mutate(
      { id, payload: values },
      {
        onSuccess: () => { toast.success("Received successfully"); setShowReceiveForm(false); },
        onError: (e) => toast.error((e as Error).message ?? "Receive failed"),
      },
    );
  };

  if (isLoading) return <LoadingSkeleton variant="card" count={4} />;
  if (isError || !po)
    return (
      <ErrorState
        title="Failed to load purchase order"
        message={(error as Error)?.message ?? "Not found"}
        retry={() => void refetch()}
      />
    );

  const canApprove = po.status === "DRAFT";
  const canSend = po.status === "APPROVED";
  const canReceive = po.status === "SENT" || po.status === "PARTIAL";
  const canCancel = po.status !== "CANCELLED" && po.status !== "CLOSED" && po.status !== "RECEIVED";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BackButton
          fallbackHref={`/${currentLocale}/admin-dasboard/purchasing/purchase-orders`}
          label="Back"
        />
        <ClipboardList className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">PO: {po.code}</h1>
          <p className="text-sm text-muted-foreground">Supplier: {po.supplierId}</p>
        </div>
        <Badge variant={STATUS_VARIANT[po.status]} className="ml-auto">
          {po.status}
        </Badge>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Workflow transitions for this purchase order</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="default"
            disabled={!canApprove || isMutating}
            onClick={() => approve.mutate(id, { onSuccess: () => toast.success("Approved"), onError: (e) => toast.error((e as Error).message ?? "Approve failed") })}
          >
            Approve
          </Button>
          <Button
            variant="outline"
            disabled={!canSend || isMutating}
            onClick={() => send.mutate(id, { onSuccess: () => toast.success("Sent to supplier"), onError: (e) => toast.error((e as Error).message ?? "Send failed") })}
          >
            Send to Supplier
          </Button>
          <Button
            variant="outline"
            disabled={!canReceive || isMutating}
            onClick={() => setShowReceiveForm((v) => !v)}
          >
            {showReceiveForm ? "Cancel Receive" : "Receive Goods"}
          </Button>
          <Button
            variant="destructive"
            disabled={!canCancel || isMutating}
            onClick={() => setShowCancelConfirm(true)}
          >
            Cancel Order
          </Button>
        </CardContent>
      </Card>

      {/* Receive Form */}
      {showReceiveForm && (
        <Card>
          <CardHeader>
            <CardTitle>Receive Goods</CardTitle>
            <CardDescription>Connected to `POST /api/purchase-orders/:id/receive`</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onReceive)} className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="warehouseId">Warehouse ID *</Label>
                  <Input id="warehouseId" {...register("warehouseId")} />
                  {errors.warehouseId && <p className="text-xs text-destructive">{errors.warehouseId.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="locationId">Location ID</Label>
                  <Input id="locationId" {...register("locationId")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input id="invoiceNumber" {...register("invoiceNumber")} />
                </div>
                <div className="space-y-1.5 md:col-span-3">
                  <Label htmlFor="note">Note</Label>
                  <Input id="note" {...register("note")} />
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium">Line Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Variant ID</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, idx) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Input {...register(`items.${idx}.variantId`)} readOnly className="bg-muted" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" {...register(`items.${idx}.qty`)} className="w-24" />
                          {errors.items?.[idx]?.qty && (
                            <p className="text-xs text-destructive">{errors.items[idx]?.qty?.message}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input {...register(`items.${idx}.unitCost`)} className="w-28" placeholder="optional" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button type="submit" disabled={receive.isPending}>
                {receive.isPending ? "Receiving..." : "Confirm Receipt"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={showCancelConfirm}
        onOpenChange={setShowCancelConfirm}
        title="Cancel Purchase Order?"
        description="This action will cancel the purchase order and cannot be undone."
        confirmLabel="Cancel Order"
        cancelLabel="Keep"
        variant="destructive"
        onConfirm={() => cancel.mutate(id, {
          onSuccess: () => { toast.success("Cancelled"); setShowCancelConfirm(false); },
          onError: (e) => { toast.error((e as Error).message ?? "Cancel failed"); setShowCancelConfirm(false); },
        })}
        isLoading={cancel.isPending}
      />

      {/* PO Details */}
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 text-sm md:grid-cols-3">
            <div>
              <span className="font-medium text-muted-foreground">Expected At</span>
              <p>{po.expectedAt ? formatDate(new Date(po.expectedAt), locale) : "—"}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Created</span>
              <p>{formatDate(new Date(po.createdAt), locale)}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Note</span>
              <p>{po.note ?? "—"}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Items ({po.items.length})</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variant ID</TableHead>
                  <TableHead className="text-right">Ordered</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {po.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.variantId}</TableCell>
                    <TableCell className="text-right">{item.qty}</TableCell>
                    <TableCell className="text-right">{item.receivedQty}</TableCell>
                    <TableCell className="text-right">{item.unitCost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
