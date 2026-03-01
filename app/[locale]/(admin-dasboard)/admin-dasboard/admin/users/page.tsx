import type { Metadata } from "next";
import { createBackofficeTranslator, type Locale } from "@/shared/lib/i18n";
import { AdminUsersClient } from "@/app/[locale]/(admin-dasboard)/admin-dasboard/admin/users/admin-users-client";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "sidebar");
  return { title: `${t("items.adminUsers")} - Sanaeva Store` };
}

export default async function AdminUsersPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return <AdminUsersClient />;
}
