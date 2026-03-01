import type { Metadata } from "next";
import { createBackofficeTranslator, type Locale } from "@/shared/lib/i18n";
import { OrdersClient } from "@/app/[locale]/(admin-dasboard)/admin-dasboard/orders/orders-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "order-management");
  return {
    title: `${t("title")} - Sanaeva Store`,
    description: t("subtitle"),
  };
}

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <OrdersClient />;
}
