import type { Metadata } from "next";
import { createBackofficeTranslator, type Locale } from "@/shared/lib/i18n";
import { AuditLogsClient } from "@/app/[locale]/(admin-dasboard)/admin-dasboard/admin/audit-logs/audit-logs-client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "sidebar");
  return { title: `${t("items.auditLogs")} - Sanaeva Store` };
}

export default async function AuditLogsPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return <AuditLogsClient />;
}
