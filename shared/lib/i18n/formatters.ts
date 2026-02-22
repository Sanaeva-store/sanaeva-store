import type { Locale } from "./config";
import { localeFormats, localeCurrencies, defaultLocale } from "./config";

export function formatCurrency(
  amount: number,
  locale?: Locale,
): string {
  const selectedLocale = locale ?? defaultLocale;
  const localeFormat = localeFormats[selectedLocale];
  const currency = localeCurrencies[selectedLocale];

  return new Intl.NumberFormat(localeFormat, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(
  value: number,
  locale?: Locale,
): string {
  const selectedLocale = locale ?? defaultLocale;
  return new Intl.NumberFormat(localeFormats[selectedLocale]).format(value);
}

export function formatDate(
  date: string | Date,
  locale?: Locale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const selectedLocale = locale ?? defaultLocale;
  const formatOptions =
    options && Object.keys(options).length > 0
      ? options
      : { dateStyle: "long" as const };
  return new Intl.DateTimeFormat(localeFormats[selectedLocale], formatOptions).format(d);
}

export function formatRelativeTime(date: string | Date, locale?: Locale): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = Date.now();
  const diffMs = d.getTime() - now;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  const selectedLocale = locale ?? defaultLocale;
  const rtf = new Intl.RelativeTimeFormat(localeFormats[selectedLocale], { numeric: "auto" });

  if (Math.abs(diffDay) >= 1) return rtf.format(diffDay, "day");
  if (Math.abs(diffHour) >= 1) return rtf.format(diffHour, "hour");
  if (Math.abs(diffMin) >= 1) return rtf.format(diffMin, "minute");
  return rtf.format(diffSec, "second");
}
