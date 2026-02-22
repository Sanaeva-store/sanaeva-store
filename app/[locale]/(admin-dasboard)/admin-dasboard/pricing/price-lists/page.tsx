import type { Metadata } from "next";
import { List } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/shared/ui";
import { createBackofficeTranslator, type Locale } from "@/shared/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "sidebar");
  return { title: `${t("items.priceLists")} - Sanaeva Store` };
}

export default async function PriceListsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "sidebar");
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <List className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("items.priceLists")}</h1>
          <p className="mt-2 text-muted-foreground">{t("groups.pricing")}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("items.priceLists")}</CardTitle>
          <CardDescription>GET /api/catalog/price-lists</CardDescription>
        </CardHeader>
        <CardContent><LoadingSkeleton variant="table" count={8} /></CardContent>
      </Card>
    </div>
  );
}
