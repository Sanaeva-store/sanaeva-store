import type { Metadata } from "next";
import { createBackofficeTranslator, type Locale } from "@/shared/lib/i18n";
import { CycleCountClient } from "@/app/[locale]/(admin-dasboard)/admin-dasboard/stock-control/cycle-count/cycle-count-client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "sidebar");
  return { title: `${t("items.cycleCount")} - Sanaeva Store` };
}

export default async function CycleCountPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return <CycleCountClient />;
}
