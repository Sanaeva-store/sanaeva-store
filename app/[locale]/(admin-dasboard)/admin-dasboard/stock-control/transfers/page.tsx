import type { Metadata } from "next";
import { createBackofficeTranslator, type Locale } from "@/shared/lib/i18n";
import { TransfersClient } from "@/app/[locale]/(admin-dasboard)/admin-dasboard/stock-control/transfers/transfers-client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "sidebar");
  return { title: `${t("items.stockTransfers")} - Sanaeva Store` };
}

export default async function StockTransfersPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return <TransfersClient />;
}
