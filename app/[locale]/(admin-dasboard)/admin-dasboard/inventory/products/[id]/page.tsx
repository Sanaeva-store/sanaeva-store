"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSkeleton, EmptyState, ErrorState } from "@/shared/ui";
import { useBackofficeTranslations } from "@/shared/lib/i18n";
import { formatDate, formatCurrency } from "@/shared/lib/i18n/formatters";
import { useLocale } from "@/shared/lib/i18n/use-locale";
import { useCatalogProductDetailQuery } from "@/features/inventory/hooks/use-catalog";
import type { ProductStatus } from "@/features/storefront/api/products.api";
import type { ApiError } from "@/shared/lib/http/api-client";

const STATUS_VARIANTS: Record<ProductStatus, "success" | "secondary" | "outline"> = {
  ACTIVE: "success",
  DRAFT: "outline",
  INACTIVE: "secondary",
};

export default function ProductDetailPage() {
  const { t, locale } = useBackofficeTranslations("product-sku");
  const currentLocale = useLocale();
  const params = useParams();
  const id = params?.id as string;

  const { data: product, isLoading, isError, error, refetch } = useCatalogProductDetailQuery(id);

  const apiError = error as ApiError | null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/${currentLocale}/admin-dasboard/inventory/products`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("detail.backToList")}
          </Link>
        </Button>
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
          message={apiError?.message ?? t("detail.notFoundDescription")}
          retry={() => void refetch()}
        />
      )}

      {!isLoading && !isError && !product && (
        <ErrorState
          title={t("detail.notFound")}
          message={t("detail.notFoundDescription")}
        />
      )}

      {!isLoading && !isError && product && (
        <>
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

                {product.description && (
                  <div className="col-span-full space-y-1">
                    <dt className="text-sm font-medium text-muted-foreground">{t("detail.info.description")}</dt>
                    <dd className="text-sm leading-relaxed whitespace-pre-wrap">{product.description}</dd>
                  </div>
                )}

                {!product.description && (
                  <div className="col-span-full space-y-1">
                    <dt className="text-sm font-medium text-muted-foreground">{t("detail.info.description")}</dt>
                    <dd className="text-sm text-muted-foreground">{t("detail.info.noDescription")}</dd>
                  </div>
                )}
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
        </>
      )}
    </div>
  );
}
