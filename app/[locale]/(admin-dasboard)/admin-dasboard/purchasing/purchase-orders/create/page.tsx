"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, ClipboardList, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCreatePurchaseOrderMutation } from "@/features/inventory/hooks/use-purchase-orders";

const itemSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  qty: z.coerce.number().int().positive("Qty must be > 0"),
  unitCost: z.string().optional(),
});

const createSchema = z.object({
  supplierId: z.string().min(1, "Supplier ID is required"),
  expectedAt: z.string().optional(),
  note: z.string().optional(),
  items: z.array(itemSchema).min(1, "At least one item is required"),
});

type CreateFormValues = {
  supplierId: string;
  expectedAt?: string;
  note?: string;
  items: { variantId: string; qty: number; unitCost?: string }[];
};

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const routeParams = useParams<{ locale: string }>();
  const locale = routeParams.locale ?? "th";

  const createMutation = useCreatePurchaseOrderMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createSchema) as any,
    defaultValues: {
      supplierId: "",
      items: [{ variantId: "", qty: 1, unitCost: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const onSubmit = (values: CreateFormValues) => {
    createMutation.mutate(
      {
        supplierId: values.supplierId,
        expectedAt: values.expectedAt || undefined,
        note: values.note || undefined,
        items: values.items.map((i) => ({
          variantId: i.variantId,
          qty: i.qty,
          unitCost: i.unitCost || "0",
        })),
      },
      {
        onSuccess: (po) => {
          toast.success(`Purchase order ${po.code} created`);
          router.push(`/${locale}/admin-dasboard/admin-dasboard/purchasing/purchase-orders/${po.id}`);
        },
        onError: (e) => toast.error((e as Error).message ?? "Create failed"),
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <ClipboardList className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Create Purchase Order</h1>
          <p className="text-sm text-muted-foreground">Connected to `POST /api/purchase-orders`</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit as Parameters<typeof handleSubmit>[0])} className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Enter the purchase order header information</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="supplierId">Supplier ID *</Label>
              <Input id="supplierId" {...register("supplierId")} />
              {errors.supplierId && (
                <p className="text-xs text-destructive">{errors.supplierId.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="expectedAt">Expected At</Label>
              <Input id="expectedAt" type="date" {...register("expectedAt")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="note">Note</Label>
              <Input id="note" {...register("note")} />
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Line Items</CardTitle>
                <CardDescription>Add the items to order</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ variantId: "", qty: 1, unitCost: "" })}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {errors.items && typeof errors.items.message === "string" && (
              <p className="mb-2 text-xs text-destructive">{errors.items.message}</p>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Variant ID *</TableHead>
                  <TableHead className="w-28">Qty *</TableHead>
                  <TableHead className="w-32">Unit Cost</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, idx) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Input {...register(`items.${idx}.variantId`)} placeholder="variant-uuid" />
                      {errors.items?.[idx]?.variantId && (
                        <p className="text-xs text-destructive">{errors.items[idx]?.variantId?.message}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input type="number" min={1} {...register(`items.${idx}.qty`)} />
                      {errors.items?.[idx]?.qty && (
                        <p className="text-xs text-destructive">{errors.items[idx]?.qty?.message}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input {...register(`items.${idx}.unitCost`)} placeholder="optional" />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        disabled={fields.length === 1}
                        onClick={() => remove(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Purchase Order"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
