import { redirect } from "next/navigation";
import type { Locale } from "@/shared/lib/i18n";

export default async function LocaleRootPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/storefront`);
}
