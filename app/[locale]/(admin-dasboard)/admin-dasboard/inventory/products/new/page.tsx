"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, PackagePlus } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { useBackofficeTranslations } from "@/shared/lib/i18n";
import { useLocale } from "@/shared/lib/i18n/use-locale";
import { useCreateProductMutation } from "@/features/inventory/hooks/use-catalog";
import { INVENTORY_FORM_UI } from "@/features/inventory/constants/form-ui";
import { createProductSchema } from "@/features/inventory/schemas/create-product.schema";
import type { CreateProductFormValues } from "@/features/inventory/schemas/create-product.schema";
import type { ApiError } from "@/shared/lib/http/api-client";

const PRODUCT_STATUSES = ["DRAFT", "ACTIVE", "INACTIVE"] as const;

export default function CreateProductPage() {
  const { t } = useBackofficeTranslations("product-sku");
  const locale = useLocale();
  const router = useRouter();
  const [createdTitle, setCreatedTitle] = useState<string | null>(null);

  const schema = useMemo(() => createProductSchema, []);

  const mutation = useCreateProductMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      brand: "",
      status: undefined,
      categoryIds: "",
    },
  });

  const isPending = mutation.isPending || isSubmitting;

  const onSubmit = async (values: CreateProductFormValues) => {
    setCreatedTitle(null);
    mutation.reset();

    const categoryIds =
      values.categoryIds
        ?.split(",")
        .map((id) => id.trim())
        .filter(Boolean) ?? [];

    const result = await mutation.mutateAsync({
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      brand: values.brand?.trim() || undefined,
      status: values.status,
      categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
    });

    setCreatedTitle(result.title);
    reset();

    // Navigate to detail page after a brief success moment
    setTimeout(() => {
      router.push(`/${locale}/admin-dasboard/inventory/products/${result.id}`);
    }, 1500);
  };

  const apiError = mutation.error as ApiError | null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${locale}/admin-dasboard/inventory/products`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("create.backToList")}
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{t("create.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("create.subtitle")}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5 text-primary" />
              <CardTitle>{t("create.form.title")}</CardTitle>
            </div>
            <CardDescription>{t("create.form.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            {createdTitle && (
              <Alert variant="success" className="mb-6">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>{t("create.success.title")}</AlertTitle>
                <AlertDescription>
                  {t("create.success.message", undefined, { title: createdTitle })}
                </AlertDescription>
              </Alert>
            )}

            {apiError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>
                  {apiError.status === 422
                    ? t("create.errors.validation")
                    : apiError.status === 403
                      ? t("create.errors.permission")
                      : t("create.errors.generic")}
                </AlertTitle>
                <AlertDescription className="space-y-1">
                  <p>{apiError.message}</p>
                  {apiError.code && (
                    <p className="text-xs opacity-70">Code: {apiError.code}</p>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  {t("create.form.name")}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  className={INVENTORY_FORM_UI.control}
                  placeholder={t("create.form.namePlaceholder")}
                  disabled={isPending}
                  {...register("title")}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">{t("create.form.descriptionField")}</Label>
                <Textarea
                  id="description"
                  className={INVENTORY_FORM_UI.tallTextarea}
                  placeholder={t("create.form.descriptionPlaceholder")}
                  rows={4}
                  disabled={isPending}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Brand */}
                <div className="space-y-2">
                  <Label htmlFor="brand">{t("create.form.brand")}</Label>
                  <Input
                    id="brand"
                    className={INVENTORY_FORM_UI.control}
                    placeholder={t("create.form.brandPlaceholder")}
                    disabled={isPending}
                    {...register("brand")}
                  />
                  {errors.brand && (
                    <p className="mt-1 text-xs text-destructive">{errors.brand.message}</p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">{t("create.form.status")}</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={(v) => field.onChange(v || undefined)}
                        disabled={isPending}
                      >
                        <SelectTrigger id="status" className={INVENTORY_FORM_UI.selectControl}>
                          <SelectValue placeholder={t("create.form.selectStatus")} />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCT_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {t(`statusLabels.${s}`, s)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.status && (
                    <p className="mt-1 text-xs text-destructive">{errors.status.message}</p>
                  )}
                </div>
              </div>

              {/* Category IDs */}
              <div className="space-y-2">
                <Label htmlFor="categoryIds">{t("create.form.categoryIds")}</Label>
                <Input
                  id="categoryIds"
                  className={INVENTORY_FORM_UI.control}
                  placeholder={t("create.form.categoryIdsPlaceholder")}
                  disabled={isPending}
                  {...register("categoryIds")}
                />
                <p className="text-xs text-muted-foreground">{t("create.form.categoryIdsHelper")}</p>
                {errors.categoryIds && (
                  <p className="mt-1 text-xs text-destructive">{errors.categoryIds.message}</p>
                )}
              </div>

              <Separator />

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" className="flex-1" disabled={isPending}>
                  {isPending ? t("create.form.submitting") : t("create.form.submit")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => {
                    reset();
                    setCreatedTitle(null);
                    mutation.reset();
                  }}
                >
                  {t("create.form.cancel")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Contract Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="space-y-2 pl-4">
              <li className="list-disc">
                <span className="font-medium">title</span> — required, max 255 chars
              </li>
              <li className="list-disc">
                <span className="font-medium">description</span> — optional, max 2000 chars
              </li>
              <li className="list-disc">
                <span className="font-medium">brand</span> — optional, max 100 chars
              </li>
              <li className="list-disc">
                <span className="font-medium">status</span> — DRAFT | ACTIVE | INACTIVE (defaults to DRAFT on backend)
              </li>
              <li className="list-disc">
                <span className="font-medium">categoryIds</span> — optional array of category IDs
              </li>
              <li className="list-disc">
                On success, redirects to the new product&rsquo;s detail page.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
