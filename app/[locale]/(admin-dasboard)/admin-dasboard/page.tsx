import type { Metadata } from "next";
import { createBackofficeTranslator, type Locale } from "@/shared/lib/i18n";
import { DashboardClient } from "./dashboard-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "dashboard-overview");

  return {
    title: `${t("meta.title")} - Sanaeva Store`,
    description: t("meta.description"),
  };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <DashboardClient />;
}
