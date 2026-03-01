"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSkeleton, EmptyState, ErrorState } from "@/shared/ui";
import { useBackofficeTranslations } from "@/shared/lib/i18n";
import { formatDate, formatCurrency } from "@/shared/lib/i18n/formatters";
import { useLocale } from "@/shared/lib/i18n/use-locale";
import {
  useCatalogProductDetailQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/features/inventory/hooks/use-catalog";
import { createProductSchema } from "@/features/inventory/schemas/create-product.schema";
import type { CreateProductFormValues } from "@/features/inventory/schemas/create-product.schema";
import { INVENTORY_FORM_UI } from "@/features/inventory/constants/form-ui";
import type { ProductStatus } from "@/features/storefront/api/products.api";
import type { ApiError } from "@/shared/lib/http/api-client";
import { BackButton } from "@/components/common/back-button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { ProductImagesSection } from "./product-images-section";

const STATUS_VARIANTS: Record<ProductStatus, "success" | "secondary" | "outline"> = {
  ACTIVE: "success",
  DRAFT: "outline",
  INACTIVE: "secondary",
};

const PRODUCT_STATUSES = ["DRAFT", "ACTIVE", "INACTIVE"] as const;

export default function ProductDetailPage() {
  const { t, locale } = useBackofficeTranslations("product-sku");
  const currentLocale = useLocale();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: product, isLoading, isError, error, refetch } = useCatalogProductDetailQuery(id);
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    values: product
      ? {
          title: product.title,
          description: product.description ?? "",
          brand: product.brand ?? "",
          status: product.status,
          categoryIds: product.categoryIds.join(", "),
        }
      : undefined,
  });

  const isPending = updateMutation.isPending || isSubmitting;
  const apiError = (updateMutation.error ?? error) as ApiError | null;

  const onUpdate = async (values: CreateProductFormValues) => {
    updateMutation.reset();
    const categoryIds =
      values.categoryIds
        ?.split(",")
        .map((id) => id.trim())
        .filter(Boolean) ?? [];

    await updateMutation.mutateAsync(
      {
        id,
        payload: {
          title: values.title.trim(),
          description: values.description?.trim() || undefined,
          brand: values.brand?.trim() || undefined,
          status: values.status,
          categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success(t("detail.updateSuccess"));
          setShowEdit(false);
        },
        onError: (e) => toast.error((e as ApiError)?.message ?? t("detail.updateError")),
      },
    );
  };

  const onDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success(t("detail.deleteSuccess"));
        router.push(`/${currentLocale}/admin-dasboard/inventory/products`);
      },
      onError: (e) => {
        toast.error((e as ApiError)?.message ?? t("detail.deleteError"));
        setShowDeleteConfirm(false);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <BackButton
            fallbackHref={`/${currentLocale}/admin-dasboard/inventory/products`}
            label={t("detail.backToList")}
          />
          <div>
            <h1 className="text-3xl font-bold">
              {isLoading ? "..." : (product?.title ?? t("detail.notFound"))}
            </h1>
            {product && (
              <p className="mt-1 text-sm text-muted-foreground">
                ID: <span className="font-mono">{product.id}</span>
              </p>
            )}
          </div>
        </div>

        {product && !isLoading && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                reset();
                updateMutation.reset();
                setShowEdit((v) => !v);
              }}
              disabled={isPending || deleteMutation.isPending}
            >
              <Pencil className="mr-2 h-4 w-4" />
              {showEdit ? t("detail.cancelEdit") : t("detail.editProduct")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteMutation.isPending || isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("detail.deleteProduct")}
            </Button>
          </div>
        )}
      </div>

      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <LoadingSkeleton variant="form" count={5} />
          </CardContent>
        </Card>
      )}

      {isError && (
        <ErrorState
          title={t("detail.notFound")}
          message={(error as ApiError)?.message ?? t("detail.notFoundDescription")}
          retry={() => void refetch()}
        />
      )}

      {isLoading === false && isError === false && product == null && (
        <ErrorState
          title={t("detail.notFound")}
          message={t("detail.notFoundDescription")}
        />
      )}

      {isLoading === false && isError === false && product != null && (
        <>
          {/* Edit Form */}
          {showEdit && (
            <Card>
              <CardHeader>
                <CardTitle>{t("detail.editProduct")}</CardTitle>
              </CardHeader>
              <CardContent>
                {updateMutation.isError && apiError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>{t("detail.updateError")}</AlertTitle>
                    <AlertDescription>{apiError.message}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSubmit(onUpdate)} className="space-y-4" noValidate>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">
                        {t("create.form.name")} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="edit-title"
                        className={INVENTORY_FORM_UI.control}
                        disabled={isPending}
                        {...register("title")}
                      />
                      {errors.title && (
                        <p className="text-xs text-destructive">{errors.title.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-brand">{t("create.form.brand")}</Label>
                      <Input
                        id="edit-brand"
                        className={INVENTORY_FORM_UI.control}
                        disabled={isPending}
                        {...register("brand")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-status">{t("create.form.status")}</Label>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value ?? ""}
                            onValueChange={(v) => field.onChange(v || undefined)}
                            disabled={isPending}
                          >
                            <SelectTrigger id="edit-status" className={INVENTORY_FORM_UI.selectControl}>
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-categoryIds">{t("create.form.categoryIds")}</Label>
                      <Input
                        id="edit-categoryIds"
                        className={INVENTORY_FORM_UI.control}
                        placeholder={t("create.form.categoryIdsPlaceholder")}
                        disabled={isPending}
                        {...register("categoryIds")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">{t("create.form.descriptionField")}</Label>
                    <Textarea
                      id="edit-description"
                      className={INVENTORY_FORM_UI.tallTextarea}
                      rows={3}
                      disabled={isPending}
                      {...register("description")}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={isPending}>
                      {isPending ? t("detail.saving") : t("detail.saveChanges")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => { reset(); updateMutation.reset(); setShowEdit(false); }}
                    >
                      {t("detail.cancelEdit")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t("detail.info.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">{t("detail.info.name")}</dt>
                  <dd className="font-semibold">{product.title}</dd>
                </div>

                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">{t("detail.info.brand")}</dt>
                  <dd>{product.brand ?? "—"}</dd>
                </div>

                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">{t("detail.info.status")}</dt>
                  <dd>
                    <Badge variant={STATUS_VARIANTS[product.status]}>
                      {t(`statusLabels.${product.status}`, product.status)}
                    </Badge>
                  </dd>
                </div>

                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">{t("detail.info.created")}</dt>
                  <dd className="text-sm">{formatDate(product.createdAt, locale)}</dd>
                </div>

                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">{t("detail.info.updated")}</dt>
                  <dd className="text-sm">{formatDate(product.updatedAt, locale)}</dd>
                </div>

                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">{t("detail.info.categories")}</dt>
                  <dd className="text-sm">
                    {product.categoryIds.length > 0
                      ? product.categoryIds.join(", ")
                      : <span className="text-muted-foreground">{t("detail.info.noCategories")}</span>}
                  </dd>
                </div>

                <div className="col-span-full space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">{t("detail.info.description")}</dt>
                  <dd className="text-sm leading-relaxed whitespace-pre-wrap">
                    {product.description
                      ? product.description
                      : <span className="text-muted-foreground">{t("detail.info.noDescription")}</span>}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Separator />

          {/* Variants */}
          <Card>
            <CardHeader>
              <CardTitle>{t("detail.variants.title")}</CardTitle>
              <CardDescription>{t("detail.variants.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              {product.variants.length === 0 ? (
                <EmptyState
                  title={t("detail.variants.noVariants")}
                  description={t("detail.variants.noVariantsDescription")}
                  className="min-h-[200px]"
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("detail.variants.sku")}</TableHead>
                      <TableHead>{t("detail.variants.barcode")}</TableHead>
                      <TableHead>{t("detail.variants.color")}</TableHead>
                      <TableHead>{t("detail.variants.size")}</TableHead>
                      <TableHead className="text-right">{t("detail.variants.price")}</TableHead>
                      <TableHead className="text-right">{t("detail.variants.cost")}</TableHead>
                      <TableHead className="text-right">{t("detail.variants.reorderPoint")}</TableHead>
                      <TableHead className="text-center">{t("detail.variants.active")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.variants.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-mono text-sm">{v.sku}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{v.barcode ?? "—"}</TableCell>
                        <TableCell>{v.color ?? "—"}</TableCell>
                        <TableCell>{v.size ?? "—"}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(v.price, locale)}
                        </TableCell>
                        <TableCell className="text-right">
                          {v.cost != null ? formatCurrency(v.cost, locale) : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          {v.reorderPoint ?? "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          {v.isActive ? (
                            <CheckCircle className="mx-auto h-4 w-4 text-emerald-500" aria-label={t("detail.variants.yes")} />
                          ) : (
                            <XCircle className="mx-auto h-4 w-4 text-muted-foreground" aria-label={t("detail.variants.no")} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Images */}
          <ProductImagesSection productId={id} />
        </>
      )}

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title={t("detail.deleteConfirmTitle")}
        description={t("detail.deleteConfirmDescription")}
        confirmLabel={t("detail.deleteProduct")}
        cancelLabel={t("detail.cancelEdit")}
        variant="destructive"
        onConfirm={onDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
