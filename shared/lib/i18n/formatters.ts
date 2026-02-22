const DEFAULT_LOCALE = "th-TH";
const DEFAULT_CURRENCY = "THB";

export function formatCurrency(
  amount: number,
  options?: { locale?: string; currency?: string },
): string {
  const locale = options?.locale ?? DEFAULT_LOCALE;
  const currency = options?.currency ?? DEFAULT_CURRENCY;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(
  value: number,
  options?: { locale?: string },
): string {
  return new Intl.NumberFormat(options?.locale ?? DEFAULT_LOCALE).format(value);
}

export function formatDate(
  date: string | Date,
  options?: {
    locale?: string;
    dateStyle?: Intl.DateTimeFormatOptions["dateStyle"];
    timeStyle?: Intl.DateTimeFormatOptions["timeStyle"];
  },
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(options?.locale ?? DEFAULT_LOCALE, {
    dateStyle: options?.dateStyle ?? "long",
    timeStyle: options?.timeStyle,
  }).format(d);
}

export function formatRelativeTime(date: string | Date, locale?: string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = Date.now();
  const diffMs = d.getTime() - now;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat(locale ?? DEFAULT_LOCALE, { numeric: "auto" });

  if (Math.abs(diffDay) >= 1) return rtf.format(diffDay, "day");
  if (Math.abs(diffHour) >= 1) return rtf.format(diffHour, "hour");
  if (Math.abs(diffMin) >= 1) return rtf.format(diffMin, "minute");
  return rtf.format(diffSec, "second");
}
