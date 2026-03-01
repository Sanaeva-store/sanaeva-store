"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Plus, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSkeleton, EmptyState, ErrorState } from "@/shared/ui";
import { formatDate } from "@/shared/lib/i18n/formatters";
import { useBackofficeTranslations } from "@/shared/lib/i18n";
import { useLocale } from "@/shared/lib/i18n/use-locale";
import { useCatalogProductsQuery } from "@/features/inventory/hooks/use-catalog";
import { INVENTORY_FORM_UI } from "@/features/inventory/constants/form-ui";
import type { Product, ProductStatus } from "@/features/storefront/api/products.api";
import type { ApiError } from "@/shared/lib/http/api-client";

const STATUS_VARIANTS: Record<ProductStatus, "success" | "secondary" | "outline"> = {
  ACTIVE: "success",
  DRAFT: "outline",
  INACTIVE: "secondary",
};

export default function ProductsPage() {
  const { t, locale } = useBackofficeTranslations("product-sku");
  const currentLocale = useLocale();
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState<string | undefined>(undefined);

  const { data, isLoading, isError, error, refetch } = useCatalogProductsQuery({
    search: appliedSearch,
    limit: 50,
  });

  const applySearch = () => {
    setAppliedSearch(search.trim() || undefined);
  };

  const resetSearch = () => {
    setSearch("");
    setAppliedSearch(undefined);
  };

  const apiError = error as ApiError | null;
  const products = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button asChild>
          <Link href={`/${currentLocale}/admin-dasboard/inventory/products/new`}>
            <Plus className="mr-2 h-4 w-4" />
            {t("addProduct")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("searchTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[260px] flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("searchPlaceholder")}
                className={INVENTORY_FORM_UI.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") applySearch(); }}
              />
            </div>
            <Button onClick={applySearch} className={INVENTORY_FORM_UI.control}>{t("filter")}</Button>
            <Button
              variant="outline"
              size="icon"
              className={INVENTORY_FORM_UI.iconButton}
              onClick={resetSearch}
              title="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("allProducts")}</CardTitle>
          <CardDescription>{t("allProductsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingSkeleton variant="table" count={8} />}

          {isError && (
            <ErrorState
              title={t("loadError")}
              message={apiError?.message}
              retry={() => void refetch()}
            />
          )}

          {!isLoading && !isError && products.length === 0 && (
            <EmptyState
              icon={Package}
              title={t("noProducts")}
              description={t("noProductsDescription")}
              action={{
                label: t("addProduct"),
                onClick: () => {
                  window.location.href = `/${currentLocale}/admin-dasboard/inventory/products/new`;
                },
              }}
            />
          )}

          {!isLoading && !isError && products.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.name")}</TableHead>
                  <TableHead>{t("table.brand")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead className="text-right">{t("table.variants")}</TableHead>
                  <TableHead>{t("table.createdAt")}</TableHead>
                  <TableHead className="text-right">{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: Product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell className="text-muted-foreground">{product.brand ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[product.status]}>
                        {t(`statusLabels.${product.status}`, product.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{product.variants.length}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(product.createdAt, locale)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/${currentLocale}/admin-dasboard/inventory/products/${product.id}`}>
                          {t("table.viewDetail")}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
