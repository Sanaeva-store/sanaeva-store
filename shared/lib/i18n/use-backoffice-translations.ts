"use client";

import { useMemo } from "react";
import { useLocale } from "./use-locale";
import {
  createBackofficeTranslator,
  getBackofficeDictionary,
  type BackofficeNamespace,
} from "./backoffice-dictionary";

export function useBackofficeTranslations(namespace: BackofficeNamespace) {
  const locale = useLocale();

  return useMemo(
    () => ({
      locale,
      dict: getBackofficeDictionary(locale, namespace),
      t: createBackofficeTranslator(locale, namespace),
    }),
    [locale, namespace],
  );
}
