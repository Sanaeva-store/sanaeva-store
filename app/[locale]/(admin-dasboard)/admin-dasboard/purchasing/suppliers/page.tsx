import type { Metadata } from "next";
import { Truck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/shared/ui";
import { createBackofficeTranslator, type Locale } from "@/shared/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "inventory-suppliers");
  return {
    title: `${t("title")} - Sanaeva Store`,
    description: t("subtitle"),
  };
}

export default async function PurchasingSuppliersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "inventory-suppliers");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Truck className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("table.title")}</CardTitle>
          <CardDescription>{t("table.totalSuppliers")}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton variant="table" count={8} />
        </CardContent>
      </Card>
    </div>
  );
}
