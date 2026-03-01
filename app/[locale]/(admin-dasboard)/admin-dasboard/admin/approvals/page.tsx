import type { Metadata } from "next";
import { createBackofficeTranslator, type Locale } from "@/shared/lib/i18n";
import { ApprovalsClient } from "@/app/[locale]/(admin-dasboard)/admin-dasboard/admin/approvals/approvals-client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "sidebar");
  return { title: `${t("items.approvals")} - Sanaeva Store` };
}

export default async function ApprovalsPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return <ApprovalsClient />;
}
