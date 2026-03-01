"use client";

import { useMemo, useState } from "react";
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
import { INVENTORY_FORM_UI } from "@/features/inventory/constants/form-ui";
import type { ApiError } from "@/shared/lib/http/api-client";
import { useBackofficeTranslations } from "@/shared/lib/i18n";

export default function InitialStockPage() {
  const { t } = useBackofficeTranslations("inventory-initial-stock");
  const [successData, setSuccessData] = useState<{
    id: string;
    afterQty: number;
    variantId: string;
  } | null>(null);

  const schema = useMemo(
    () =>
      z.object({
        variantId: z.string().min(1, t("validation.variantRequired")),
        warehouseId: z.string().min(1, t("validation.warehouseRequired")),
        locationId: z.string().optional(),
        qty: z.number().int(t("validation.qtyInteger")).min(1, t("validation.qtyGreaterThanZero")),
        unitCost: z.number().min(0).optional(),
        note: z.string().optional(),
      }),
    [t],
  );

  type FormValues = z.infer<typeof schema>;

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
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5 text-primary" />
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
                    variantId: successData.variantId,
                    afterQty: successData.afterQty,
                    id: successData.id,
                  })}
                </AlertDescription>
              </Alert>
            )}

            {apiError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>
                  {apiError.status === 409
                    ? t("errors.alreadyInitialized")
                    : apiError.status === 422
                      ? t("errors.validation")
                      : apiError.status === 403
                        ? t("errors.permission")
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
                  <Label htmlFor="qty">{t("form.qty")} <span className="text-destructive">*</span></Label>
                  <Input id="qty" type="number" inputMode="numeric" placeholder={t("form.qtyPlaceholder")} min="1" step="1" className={INVENTORY_FORM_UI.control} disabled={isPending} {...register("qty", { valueAsNumber: true })} />
                  {errors.qty && <p className="mt-1 text-xs text-destructive">{errors.qty.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitCost">{t("form.unitCost")}</Label>
                  <Input id="unitCost" type="number" inputMode="decimal" placeholder={t("form.unitCostPlaceholder")} min="0" step="0.01" className={INVENTORY_FORM_UI.control} disabled={isPending} {...register("unitCost", { valueAsNumber: true })} />
                  {errors.unitCost && <p className="mt-1 text-xs text-destructive">{errors.unitCost.message}</p>}
                </div>
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

              <div className="flex gap-3">
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
              <div className="flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">{t("info.howItWorks")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="space-y-2 pl-4">
                <li className="list-disc">{t("info.rule1")}</li>
                <li className="list-disc">{t("info.rule2")}</li>
                <li className="list-disc">{t("info.rule3")}</li>
                <li className="list-disc">{t("info.rule4")}</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("info.requiredFields")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("form.variantId")}</span>
                <Badge variant="destructive" className="text-xs">{t("info.required")}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("form.warehouseId")}</span>
                <Badge variant="destructive" className="text-xs">{t("info.required")}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("form.qty")}</span>
                <Badge variant="destructive" className="text-xs">{t("info.requiredInteger")}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("form.unitCost")}</span>
                <Badge variant="secondary" className="text-xs">{t("info.optional")}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("form.locationId")}</span>
                <Badge variant="secondary" className="text-xs">{t("info.optional")}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("form.note")}</span>
                <Badge variant="secondary" className="text-xs">{t("info.optional")}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
