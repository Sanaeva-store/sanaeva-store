"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales, localeNames } from "@/shared/lib/i18n";

const LOCALE_FLAGS: Record<string, string> = {
  th: "🇹🇭",
  en: "🇬🇧",
};

export function LanguageSwitcher() {
  const params = useParams<{ locale: string }>();
  const pathname = usePathname();
  const currentLocale = params.locale ?? "th";

  const getLocalePath = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1.5 px-2">
          <span className="text-base leading-none" aria-hidden="true">
            {LOCALE_FLAGS[currentLocale]}
          </span>
          <span className="hidden text-sm sm:inline">
            {localeNames[currentLocale as keyof typeof localeNames]}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {locales.map((locale) => (
          <DropdownMenuItem key={locale} asChild>
            <Link
              href={getLocalePath(locale)}
              className={`flex items-center gap-2.5 ${
                currentLocale === locale ? "bg-accent font-medium" : ""
              }`}
            >
              <span className="text-base leading-none" aria-hidden="true">
                {LOCALE_FLAGS[locale]}
              </span>
              <span>{localeNames[locale]}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
