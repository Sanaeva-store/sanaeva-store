import type { Metadata } from "next";
import { createBackofficeTranslator, type Locale } from "@/shared/lib/i18n";
import { AuditLogDetailClient } from "./audit-log-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale; id: string };
  const t = createBackofficeTranslator(locale, "sidebar");
  return { title: `${t("items.auditLogs")} Detail - Sanaeva Store` };
}

export default async function AuditLogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return <AuditLogDetailClient id={id} />;
}
