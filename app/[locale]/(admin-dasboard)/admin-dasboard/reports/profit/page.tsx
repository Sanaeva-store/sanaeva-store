import type { Metadata } from "next";
import { DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/shared/ui";
import { createBackofficeTranslator, type Locale } from "@/shared/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "sidebar");
  return { title: `${t("items.reportProfit")} - Sanaeva Store` };
}

export default async function ReportProfitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "sidebar");
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DollarSign className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("items.reportProfit")}</h1>
          <p className="mt-2 text-muted-foreground">{t("groups.reports")}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("items.reportProfit")}</CardTitle>
          <CardDescription>GET /api/reports/profit-summary</CardDescription>
        </CardHeader>
        <CardContent><LoadingSkeleton variant="table" count={8} /></CardContent>
      </Card>
    </div>
  );
}
