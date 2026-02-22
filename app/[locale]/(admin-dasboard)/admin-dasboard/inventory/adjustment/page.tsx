"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Info, SlidersHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { adjustmentReasonOptions } from "@/shared/constants/options";
import { useAdjustStockMutation } from "@/features/inventory/hooks/use-inventory";
import type { AdjustmentReason } from "@/features/inventory/api/inventory.api";
import type { ApiError } from "@/shared/lib/http/api-client";

const schema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  warehouseId: z.string().min(1, "Warehouse ID is required"),
  locationId: z.string().optional(),
  direction: z.enum(["increase", "decrease"], { error: "Select adjustment direction" }),
  qty: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
  reasonCode: z.enum(["DAMAGE", "LOST", "FOUND", "MANUAL_CORRECTION"], {
    error: "Reason code is required",
  }),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function StockAdjustmentPage() {
  const [successData, setSuccessData] = useState<{
    id: string;
    beforeQty: number;
    afterQty: number;
    qty: number;
  } | null>(null);

  const mutation = useAdjustStockMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const direction = watch("direction");
  const isPending = mutation.isPending || isSubmitting;

  const onSubmit = async (values: FormValues) => {
    setSuccessData(null);
    mutation.reset();
    const signedQty = values.direction === "decrease" ? -values.qty : values.qty;
    const payload = {
      variantId: values.variantId.trim(),
      warehouseId: values.warehouseId.trim(),
      locationId: values.locationId?.trim() || undefined,
      qty: signedQty,
      reasonCode: values.reasonCode as AdjustmentReason,
      note: values.note?.trim() || undefined,
      idempotencyKey: `adj-${new Date().toISOString()}-${values.variantId}`,
    };
    const result = await mutation.mutateAsync(payload);
    setSuccessData({
      id: result.id,
      beforeQty: result.beforeQty,
      afterQty: result.afterQty,
      qty: result.qty,
    });
    reset();
  };

  const apiError = mutation.error as ApiError | null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock Adjustment</h1>
        <p className="mt-2 text-muted-foreground">
          Increase or decrease inventory levels with full traceability
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          All adjustments are tracked and require a reason code for audit purposes. Quantity cannot be zero.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              <CardTitle>Adjustment Form</CardTitle>
            </div>
            <CardDescription>
              Adjust stock levels for a specific variant and warehouse location
            </CardDescription>
          </CardHeader>
          <CardContent>
            {successData && (
              <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Adjustment Submitted</AlertTitle>
                <AlertDescription>
                  Stock changed from{" "}
                  <span className="font-semibold">{successData.beforeQty}</span> →{" "}
                  <span className="font-semibold">{successData.afterQty}</span>{" "}
                  ({successData.qty > 0 ? "+" : ""}{successData.qty} units).{" "}
                  <span className="text-xs text-green-600">TXN: {successData.id}</span>
                </AlertDescription>
              </Alert>
            )}

            {apiError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>
                  {apiError.status === 422
                    ? "Validation Error"
                    : apiError.status === 403
                      ? "Permission Denied"
                      : apiError.status === 409
                        ? "Conflict"
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
                  <Label htmlFor="direction">
                    Direction <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    name="direction"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPending}
                      >
                        <SelectTrigger id="direction" className="h-10">
                          <SelectValue placeholder="Select direction..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="increase">
                            <span className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              Increase
                            </span>
                          </SelectItem>
                          <SelectItem value="decrease">
                            <span className="flex items-center gap-2">
                              <TrendingDown className="h-4 w-4 text-destructive" />
                              Decrease
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.direction && (
                    <p className="mt-1 text-xs text-destructive">{errors.direction.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qty">
                    Quantity <span className="text-destructive">*</span>
                    {direction && (
                      <Badge
                        variant={direction === "increase" ? "default" : "destructive"}
                        className="ml-2 text-xs"
                      >
                        {direction === "increase" ? "+" : "-"}
                      </Badge>
                    )}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="reasonCode">
                  Reason Code <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="reasonCode"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger id="reasonCode" className="h-10">
                        <SelectValue placeholder="Select reason..." />
                      </SelectTrigger>
                      <SelectContent>
                        {adjustmentReasonOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.reasonCode && (
                  <p className="mt-1 text-xs text-destructive">{errors.reasonCode.message}</p>
                )}
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
                  placeholder="Add details about this adjustment..."
                  rows={3}
                  disabled={isPending}
                  {...register("note")}
                />
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={isPending}>
                  {isPending ? "Submitting..." : "Submit Adjustment"}
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
              <CardTitle className="text-base">Adjustment Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="space-y-2 pl-4">
                <li className="list-disc">Quantity cannot be zero — use at least 1</li>
                <li className="list-disc">Decrease will send a negative qty to the API</li>
                <li className="list-disc">Reason code must match one of the backend enums exactly</li>
                <li className="list-disc">Each submission generates a unique idempotency key</li>
                <li className="list-disc">Backend will reject if stock would go below zero</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reason Codes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {adjustmentReasonOptions.map((opt) => (
                <div key={opt.value} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{opt.label}</span>
                  <Badge variant="outline" className="font-mono text-xs">{opt.value}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
