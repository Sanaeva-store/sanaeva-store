import type { Metadata } from "next";
import { createBackofficeTranslator, type Locale } from "@/shared/lib/i18n";
import { ValidateCouponClient } from "@/app/[locale]/(admin-dasboard)/admin-dasboard/promotions/validate-coupon/validate-coupon-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const t = createBackofficeTranslator(locale, "sidebar");
  return { title: `${t("items.couponValidate")} - Sanaeva Store` };
}

export default async function ValidateCouponPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <ValidateCouponClient />;
}
