"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { locales, localeNames } from "@/shared/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const localeFlags: Record<string, string> = {
  th: "🇹🇭",
  en: "🇬🇧",
};

interface LangSwitcherProps {
  variant?: "light" | "dark";
}

export function LangSwitcher({ variant = "light" }: LangSwitcherProps) {
  const params = useParams<{ locale: string }>();
  const pathname = usePathname();
  const currentLocale = params.locale ?? "th";

  const getLocalePath = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const isDark = variant === "dark";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isDark
              ? "text-gray-300 hover:bg-white/10 hover:text-white"
              : "text-secondary-500 hover:bg-primary-50 hover:text-primary-700"
          }`}
        >
          <span className="text-base leading-none">{localeFlags[currentLocale]}</span>
          <span>{localeNames[currentLocale as keyof typeof localeNames]}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {locales.map((locale) => (
          <DropdownMenuItem key={locale} asChild>
            <Link
              href={getLocalePath(locale)}
              className={`flex items-center gap-2.5 w-full ${
                currentLocale === locale ? "bg-primary-50 font-medium text-primary-700" : ""
              }`}
            >
              <span className="text-base leading-none">{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
