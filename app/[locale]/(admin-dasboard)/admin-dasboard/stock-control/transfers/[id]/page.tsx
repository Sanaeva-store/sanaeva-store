import type { Metadata } from "next";
import { createBackofficeTranslator, type Locale } from "@/shared/lib/i18n";
import { TransferDetailClient } from "./transfer-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale; id: string };
  const t = createBackofficeTranslator(locale, "sidebar");
  return { title: `${t("items.stockTransfers")} Detail - Sanaeva Store` };
}

export default async function TransferDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return <TransferDetailClient id={id} />;
}
