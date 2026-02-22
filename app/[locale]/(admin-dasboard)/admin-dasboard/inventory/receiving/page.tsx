"use client";

import { useMemo, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Package, Plus, Trash2 } from "lucide-react";
import { DatePicker } from "@/components/common/date-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useReceiveStockMutation } from "@/features/inventory/hooks/use-inventory";
import type { ApiError } from "@/shared/lib/http/api-client";
import { useBackofficeTranslations } from "@/shared/lib/i18n";

const defaultItem = { variantId: "", qty: 1, unitCost: undefined, lotNumber: "", expiryDate: "" };

export default function GoodsReceivingPage() {
  const { t } = useBackofficeTranslations("inventory-receiving");
  const [successData, setSuccessData] = useState<{
    id: string;
    code: string;
    status: string;
  } | null>(null);

  const schema = useMemo(
    () =>
      z.object({
        warehouseId: z.string().min(1, t("validation.warehouseRequired")),
        locationId: z.string().optional(),
        poId: z.string().optional(),
        invoiceNumber: z.string().optional(),
        note: z.string().optional(),
        items: z
          .array(
            z.object({
              variantId: z.string().min(1, t("validation.variantRequired")),
              qty: z.number().int(t("validation.qtyInteger")).min(1, t("validation.qtyGreaterThanZero")),
              unitCost: z.number().min(0).optional(),
              lotNumber: z.string().optional(),
              expiryDate: z
                .string()
                .optional()
                .refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), t("validation.expiryDateFormat")),
            }),
          )
          .min(1, t("validation.atLeastOneItem")),
      }),
    [t],
  );

  type FormValues = z.infer<typeof schema>;

  const mutation = useReceiveStockMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { items: [defaultItem] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const isPending = mutation.isPending || isSubmitting;

  const onSubmit = async (values: FormValues) => {
    setSuccessData(null);
    mutation.reset();
    const payload = {
      warehouseId: values.warehouseId.trim(),
      locationId: values.locationId?.trim() || undefined,
      poId: values.poId?.trim() || undefined,
      invoiceNumber: values.invoiceNumber?.trim() || undefined,
      note: values.note?.trim() || undefined,
      items: values.items.map((item) => ({
        variantId: item.variantId.trim(),
        qty: item.qty,
        unitCost: item.unitCost,
        lotNumber: item.lotNumber?.trim() || undefined,
        expiryDate: item.expiryDate?.trim() || undefined,
      })),
    };
    const result = await mutation.mutateAsync(payload);
    setSuccessData({ id: result.id, code: result.code, status: result.status });
    reset({ items: [defaultItem] });
  };

  const apiError = mutation.error as ApiError | null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      {successData && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>{t("successTitle", undefined, { code: successData.code })}</AlertTitle>
          <AlertDescription>
            {t("status")}: <Badge variant="outline" className="ml-1">{successData.status}</Badge>{" "}
            <span className="text-xs">{t("id")}: {successData.id}</span>
          </AlertDescription>
        </Alert>
      )}

      {apiError && (
        <Alert variant="destructive">
          <AlertTitle>
            {apiError.status === 422
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle>{t("headerInfo.title")}</CardTitle>
            </div>
            <CardDescription>{t("headerInfo.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="warehouseId">{t("headerInfo.warehouseId")} <span className="text-destructive">*</span></Label>
                <Input id="warehouseId" placeholder={t("headerInfo.warehousePlaceholder")} className="h-10" disabled={isPending} {...register("warehouseId")} />
                {errors.warehouseId && <p className="mt-1 text-xs text-destructive">{errors.warehouseId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationId">{t("headerInfo.locationId")}</Label>
                <Input id="locationId" placeholder={t("headerInfo.locationPlaceholder")} className="h-10" disabled={isPending} {...register("locationId")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="poId">{t("headerInfo.poReference")}</Label>
                <Input id="poId" placeholder={t("headerInfo.poPlaceholder")} className="h-10" disabled={isPending} {...register("poId")} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">{t("headerInfo.invoiceNumber")}</Label>
                <Input id="invoiceNumber" placeholder={t("headerInfo.invoicePlaceholder")} className="h-10" disabled={isPending} {...register("invoiceNumber")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">{t("headerInfo.note")}</Label>
                <Input id="note" placeholder={t("headerInfo.notePlaceholder")} className="h-10" disabled={isPending} {...register("note")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("items.title")}</CardTitle>
                <CardDescription>{t("items.description")}</CardDescription>
              </div>
              <Button type="button" size="sm" variant="outline" disabled={isPending} onClick={() => append(defaultItem)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("items.addItem")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {errors.items?.root && <p className="mb-4 text-sm text-destructive">{errors.items.root.message}</p>}
            {typeof errors.items?.message === "string" && <p className="mb-4 text-sm text-destructive">{errors.items.message}</p>}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px]">{t("items.variantId")} *</TableHead>
                    <TableHead className="min-w-[90px]">{t("items.qty")} *</TableHead>
                    <TableHead className="min-w-[110px]">{t("items.unitCost")}</TableHead>
                    <TableHead className="min-w-[130px]">{t("items.lotNumber")}</TableHead>
                    <TableHead className="min-w-[140px]">{t("items.expiryDate")}</TableHead>
                    <TableHead className="w-[60px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell className="align-top">
                        <Input placeholder="clvar001" className="h-9" disabled={isPending} {...register(`items.${index}.variantId`)} />
                        {errors.items?.[index]?.variantId && <p className="mt-1 text-xs text-destructive">{errors.items[index]?.variantId?.message}</p>}
                      </TableCell>
                      <TableCell className="align-top">
                        <Input type="number" inputMode="numeric" placeholder="1" min="1" step="1" className="h-9" disabled={isPending} {...register(`items.${index}.qty`, { valueAsNumber: true })} />
                        {errors.items?.[index]?.qty && <p className="mt-1 text-xs text-destructive">{errors.items[index]?.qty?.message}</p>}
                      </TableCell>
                      <TableCell className="align-top">
                        <Input type="number" inputMode="decimal" placeholder="0.00" min="0" step="0.01" className="h-9" disabled={isPending} {...register(`items.${index}.unitCost`, { valueAsNumber: true })} />
                      </TableCell>
                      <TableCell className="align-top">
                        <Input placeholder="LOT-2026-001" className="h-9" disabled={isPending} {...register(`items.${index}.lotNumber`)} />
                      </TableCell>
                      <TableCell className="align-top">
                        <Controller
                          name={`items.${index}.expiryDate`}
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              value={field.value || undefined}
                              onChange={(v) => field.onChange(v ?? "")}
                              disabled={isPending}
                              className="h-9"
                            />
                          )}
                        />
                        {errors.items?.[index]?.expiryDate && <p className="mt-1 text-xs text-destructive">{errors.items[index]?.expiryDate?.message}</p>}
                      </TableCell>
                      <TableCell className="align-top">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-muted-foreground hover:text-destructive"
                          disabled={isPending || fields.length === 1}
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{t("items.itemsToReceive", undefined, { count: fields.length })}</p>
              <div className="flex gap-3">
                <Button type="button" variant="outline" disabled={isPending} onClick={() => { reset({ items: [defaultItem] }); setSuccessData(null); mutation.reset(); }}>
                  {t("items.clear")}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? t("items.submitting") : t("items.submit")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
