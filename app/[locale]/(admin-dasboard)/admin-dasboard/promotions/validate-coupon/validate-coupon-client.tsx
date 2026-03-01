"use client";

import { useState } from "react";
import { Tag } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useValidateCouponMutation } from "@/features/inventory/hooks/use-promotions";
import { useBackofficeTranslations } from "@/shared/lib/i18n";

const schema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  subtotal: z.number().positive("Subtotal must be greater than 0"),
  userId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ValidateCouponClient() {
  const { t } = useBackofficeTranslations("sidebar");
  const [result, setResult] = useState<{
    valid: boolean;
    reason?: string;
    discount?: string;
    finalTotal?: string;
  } | null>(null);

  const mutation = useValidateCouponMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      subtotal: 1000,
      userId: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(
      {
        code: values.code.trim(),
        subtotal: values.subtotal,
        userId: values.userId?.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          setResult({
            valid: data.valid,
            reason: data.reason,
            discount: data.discount,
            finalTotal: data.finalTotal,
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Tag className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("items.couponValidate")}</h1>
          <p className="mt-2 text-muted-foreground">{t("groups.promotions")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("items.couponValidate")}</CardTitle>
          <CardDescription>Connected to `POST /api/promotions/validate-coupon`</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coupon-code">Coupon Code</Label>
              <Input id="coupon-code" placeholder="SAVE10" {...register("code")} />
              {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtotal">Subtotal</Label>
              <Input
                id="subtotal"
                type="number"
                min="0.01"
                step="0.01"
                {...register("subtotal", { valueAsNumber: true })}
              />
              {errors.subtotal && <p className="text-xs text-destructive">{errors.subtotal.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-id">User ID (optional)</Label>
              <Input id="user-id" placeholder="optional" {...register("userId")} />
            </div>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Validating..." : "Validate Coupon"}
            </Button>
          </form>

          {mutation.isError && (
            <Alert variant="destructive">
              <AlertTitle>Validation failed</AlertTitle>
              <AlertDescription>{(mutation.error as Error)?.message}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert>
              <AlertTitle>{result.valid ? "Coupon is valid" : "Coupon is invalid"}</AlertTitle>
              <AlertDescription>
                Reason: {result.reason ?? "-"}
                <br />
                Discount: {result.discount ?? "0"}
                <br />
                Final total: {result.finalTotal ?? "-"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
