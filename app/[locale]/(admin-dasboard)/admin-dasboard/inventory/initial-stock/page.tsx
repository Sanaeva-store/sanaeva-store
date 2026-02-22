"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, PackagePlus, Warehouse } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useInitializeStockMutation } from "@/features/inventory/hooks/use-inventory";
import type { ApiError } from "@/shared/lib/http/api-client";

const schema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  warehouseId: z.string().min(1, "Warehouse ID is required"),
  locationId: z.string().optional(),
  qty: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be greater than 0"),
  unitCost: z.number().min(0).optional(),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function InitialStockPage() {
  const [successData, setSuccessData] = useState<{
    id: string;
    afterQty: number;
    variantId: string;
  } | null>(null);

  const mutation = useInitializeStockMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { qty: undefined, unitCost: undefined },
  });

  const isPending = mutation.isPending || isSubmitting;

  const onSubmit = async (values: FormValues) => {
    setSuccessData(null);
    const payload = {
      variantId: values.variantId.trim(),
      warehouseId: values.warehouseId.trim(),
      locationId: values.locationId?.trim() || undefined,
      qty: values.qty,
      unitCost: values.unitCost,
      note: values.note?.trim() || undefined,
      idempotencyKey: `init-${new Date().toISOString()}-${values.variantId}`,
    };
    const result = await mutation.mutateAsync(payload);
    setSuccessData({ id: result.id, afterQty: result.afterQty, variantId: result.variantId });
    reset();
  };

  const apiError = mutation.error as ApiError | null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Initial Stock</h1>
        <p className="mt-2 text-muted-foreground">
          Set opening stock levels for product variants
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Initialize Form */}
        <Card className="max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5 text-primary" />
              <CardTitle>Initialize Stock</CardTitle>
            </div>
            <CardDescription>
              Set the opening inventory quantity for a product variant. Each variant can only be initialized once per warehouse.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {successData && (
              <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Stock Initialized</AlertTitle>
                <AlertDescription>
                  Variant <span className="font-mono font-semibold">{successData.variantId}</span> initialized with{" "}
                  <span className="font-semibold">{successData.afterQty}</span> units.{" "}
                  <span className="text-xs text-green-600">TXN: {successData.id}</span>
                </AlertDescription>
              </Alert>
            )}

            {apiError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>
                  {apiError.status === 409
                    ? "Already Initialized"
                    : apiError.status === 422
                      ? "Validation Error"
                      : apiError.status === 403
                        ? "Permission Denied"
                        : "Error"}
                </AlertTitle>
                <AlertDescription className="space-y-1">
                  <p>{apiError.message}</p>
                  {apiError.code && (
                    <p className="text-xs opacity-70">Code: {apiError.code}</p>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="variantId">
                    Variant ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="variantId"
                    placeholder="e.g. clvar001"
                    className="h-10"
                    disabled={isPending}
                    {...register("variantId")}
                  />
                  {errors.variantId && (
                    <p className="mt-1 text-xs text-destructive">{errors.variantId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warehouseId">
                    Warehouse ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="warehouseId"
                    placeholder="e.g. clwh001"
                    className="h-10"
                    disabled={isPending}
                    {...register("warehouseId")}
                  />
                  {errors.warehouseId && (
                    <p className="mt-1 text-xs text-destructive">{errors.warehouseId.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="qty">
                    Quantity <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="qty"
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    min="1"
                    step="1"
                    className="h-10"
                    disabled={isPending}
                    {...register("qty", { valueAsNumber: true })}
                  />
                  {errors.qty && (
                    <p className="mt-1 text-xs text-destructive">{errors.qty.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitCost">Unit Cost (Optional)</Label>
                  <Input
                    id="unitCost"
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="h-10"
                    disabled={isPending}
                    {...register("unitCost", { valueAsNumber: true })}
                  />
                  {errors.unitCost && (
                    <p className="mt-1 text-xs text-destructive">{errors.unitCost.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationId">Location ID (Optional)</Label>
                <Input
                  id="locationId"
                  placeholder="e.g. clloc001"
                  className="h-10"
                  disabled={isPending}
                  {...register("locationId")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="e.g. Opening stock — initial setup"
                  rows={3}
                  disabled={isPending}
                  {...register("note")}
                />
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={isPending}>
                  {isPending ? "Initializing..." : "Initialize Stock"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => { reset(); setSuccessData(null); mutation.reset(); }}
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">How it works</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Initialize stock sets the <strong className="text-foreground">opening quantity</strong> for a product variant in a specific warehouse.
              </p>
              <ul className="space-y-2 pl-4">
                <li className="list-disc">Each variant can only be initialized once per warehouse</li>
                <li className="list-disc">Quantity must be a positive integer (≥ 1)</li>
                <li className="list-disc">Unit cost is optional and stored as reference</li>
                <li className="list-disc">Location ID narrows the stock to a specific bin/shelf</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Required Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Variant ID</span>
                <Badge variant="destructive" className="text-xs">Required</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Warehouse ID</span>
                <Badge variant="destructive" className="text-xs">Required</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Quantity</span>
                <Badge variant="destructive" className="text-xs">Required · integer &gt; 0</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Unit Cost</span>
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Location ID</span>
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Note</span>
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
