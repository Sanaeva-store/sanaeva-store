import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/shared/ui";
import { createBackofficeTranslator, type Locale } from "@/shared/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "sidebar");
  return { title: `${t("items.reportSnapshot")} - Sanaeva Store` };
}

export default async function ReportSnapshotPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "sidebar");
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Camera className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{t("items.reportSnapshot")}</h1>
          <p className="mt-2 text-muted-foreground">{t("groups.reports")}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("items.reportSnapshot")}</CardTitle>
          <CardDescription>GET /api/reports/snapshot/:date</CardDescription>
        </CardHeader>
        <CardContent><LoadingSkeleton variant="table" count={8} /></CardContent>
      </Card>
    </div>
  );
}
