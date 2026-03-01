"use client";

import { useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
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
import { INVENTORY_FORM_UI } from "@/features/inventory/constants/form-ui";
import type { AdjustmentReason } from "@/features/inventory/api/inventory.api";
import type { ApiError } from "@/shared/lib/http/api-client";
import { useBackofficeTranslations } from "@/shared/lib/i18n";

export default function StockAdjustmentPage() {
  const { t } = useBackofficeTranslations("inventory-adjustment");
  const [successData, setSuccessData] = useState<{
    id: string;
    beforeQty: number;
    afterQty: number;
    qty: number;
  } | null>(null);

  const schema = useMemo(
    () =>
      z.object({
        variantId: z.string().min(1, t("validation.variantRequired")),
        warehouseId: z.string().min(1, t("validation.warehouseRequired")),
        locationId: z.string().optional(),
        direction: z.enum(["increase", "decrease"], { error: t("validation.directionRequired") }),
        qty: z.number().int(t("validation.qtyInteger")).min(1, t("validation.qtyMin")),
        reasonCode: z.enum(["DAMAGE", "LOST", "FOUND", "MANUAL_CORRECTION"], {
          error: t("validation.reasonRequired"),
        }),
        note: z.string().optional(),
      }),
    [t],
  );

  type FormValues = z.infer<typeof schema>;

  const mutation = useAdjustStockMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const direction = useWatch({ control, name: "direction" });
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
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertDescription>{t("notice")}</AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              <CardTitle>{t("form.title")}</CardTitle>
            </div>
            <CardDescription>{t("form.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            {successData && (
              <Alert variant="success" className="mb-6">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>{t("success.title")}</AlertTitle>
                <AlertDescription>
                  {t("success.message", undefined, {
                    beforeQty: successData.beforeQty,
                    afterQty: successData.afterQty,
                    qty: `${successData.qty > 0 ? "+" : ""}${successData.qty}`,
                    id: successData.id,
                  })}
                </AlertDescription>
              </Alert>
            )}

            {apiError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>
                  {apiError.status === 422
                    ? t("errors.validation")
                    : apiError.status === 403
                      ? t("errors.permission")
                      : apiError.status === 409
                        ? t("errors.conflict")
                        : t("errors.generic")}
                </AlertTitle>
                <AlertDescription className="space-y-1">
                  <p>{apiError.message}</p>
                  {apiError.code && <p className="text-xs opacity-70">Code: {apiError.code}</p>}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="variantId">{t("form.variantId")} <span className="text-destructive">*</span></Label>
                  <Input id="variantId" placeholder={t("form.variantPlaceholder")} className={INVENTORY_FORM_UI.control} disabled={isPending} {...register("variantId")} />
                  {errors.variantId && <p className="mt-1 text-xs text-destructive">{errors.variantId.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warehouseId">{t("form.warehouseId")} <span className="text-destructive">*</span></Label>
                  <Input id="warehouseId" placeholder={t("form.warehousePlaceholder")} className={INVENTORY_FORM_UI.control} disabled={isPending} {...register("warehouseId")} />
                  {errors.warehouseId && <p className="mt-1 text-xs text-destructive">{errors.warehouseId.message}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="direction">{t("form.direction")} <span className="text-destructive">*</span></Label>
                  <Controller
                    name="direction"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                        <SelectTrigger id="direction" className={INVENTORY_FORM_UI.selectControl}>
                          <SelectValue placeholder={t("form.selectDirection")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="increase">
                            <span className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-semantic-success-text" />
                              {t("form.increase")}
                            </span>
                          </SelectItem>
                          <SelectItem value="decrease">
                            <span className="flex items-center gap-2">
                              <TrendingDown className="h-4 w-4 text-destructive" />
                              {t("form.decrease")}
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.direction && <p className="mt-1 text-xs text-destructive">{errors.direction.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qty">
                    {t("form.qty")} <span className="text-destructive">*</span>
                    {direction && (
                      <Badge variant={direction === "increase" ? "success" : "destructive"} className="ml-2 text-xs">
                        {direction === "increase" ? "+" : "-"}
                      </Badge>
                    )}
                  </Label>
                  <Input id="qty" type="number" inputMode="numeric" placeholder="0" min="1" step="1" className={INVENTORY_FORM_UI.control} disabled={isPending} {...register("qty", { valueAsNumber: true })} />
                  {errors.qty && <p className="mt-1 text-xs text-destructive">{errors.qty.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reasonCode">{t("form.reasonCode")} <span className="text-destructive">*</span></Label>
                <Controller
                  name="reasonCode"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                      <SelectTrigger id="reasonCode" className={INVENTORY_FORM_UI.selectControl}>
                        <SelectValue placeholder={t("form.selectReason")} />
                      </SelectTrigger>
                      <SelectContent>
                        {adjustmentReasonOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {t(`reasonLabels.${option.value}`, option.label)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.reasonCode && <p className="mt-1 text-xs text-destructive">{errors.reasonCode.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationId">{t("form.locationId")}</Label>
                <Input id="locationId" placeholder={t("form.locationPlaceholder")} className={INVENTORY_FORM_UI.control} disabled={isPending} {...register("locationId")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">{t("form.note")}</Label>
                <Textarea id="note" placeholder={t("form.notePlaceholder")} rows={3} disabled={isPending} {...register("note")} />
              </div>

              <Separator />

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" className="flex-1" disabled={isPending}>
                  {isPending ? t("form.submitting") : t("form.submit")}
                </Button>
                <Button type="button" variant="outline" disabled={isPending} onClick={() => { reset(); setSuccessData(null); mutation.reset(); }}>
                  {t("form.clear")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("rules.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="space-y-2 pl-4">
                <li className="list-disc">{t("rules.item1")}</li>
                <li className="list-disc">{t("rules.item2")}</li>
                <li className="list-disc">{t("rules.item3")}</li>
                <li className="list-disc">{t("rules.item4")}</li>
                <li className="list-disc">{t("rules.item5")}</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("reasonCodes.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {adjustmentReasonOptions.map((opt) => (
                <div key={opt.value} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t(`reasonLabels.${opt.value}`, opt.label)}</span>
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
