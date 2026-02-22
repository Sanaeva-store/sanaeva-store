"use client";

import { useParams } from "next/navigation";
import type { Locale } from "./config";

export function useLocale(): Locale {
  const params = useParams();
  return (params?.locale as Locale) ?? "th";
}
