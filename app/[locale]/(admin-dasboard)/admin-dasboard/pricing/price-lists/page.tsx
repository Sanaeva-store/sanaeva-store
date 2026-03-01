import type { Metadata } from "next";
import { createBackofficeTranslator, type Locale } from "@/shared/lib/i18n";
import { PriceListsClient } from "@/app/[locale]/(admin-dasboard)/admin-dasboard/pricing/price-lists/price-lists-client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "sidebar");
  return { title: `${t("items.priceLists")} - Sanaeva Store` };
}

export default async function PriceListsPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return <PriceListsClient />;
}
