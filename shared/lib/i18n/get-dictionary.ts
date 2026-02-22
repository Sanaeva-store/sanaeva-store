import type { Locale } from "./config";
import {
  backofficeNamespaces,
  getBackofficeDictionary,
  type BackofficeNamespace,
} from "./backoffice-dictionary";

const dictionaries = {
  th: () => import("@/messages/th/common.json").then((module) => module.default),
  en: () => import("@/messages/en/common.json").then((module) => module.default),
};

export type DictionaryNamespace = "common" | BackofficeNamespace;

function isBackofficeNamespace(namespace: string): namespace is BackofficeNamespace {
  return (backofficeNamespaces as readonly string[]).includes(namespace);
}

export const getDictionary = async (
  locale: Locale,
  namespaces?: DictionaryNamespace[],
) => {
  const common = await dictionaries[locale]();

  if (!namespaces || namespaces.length === 0 || namespaces.includes("common")) {
    return common;
  }

  return namespaces.reduce<Record<string, unknown>>((acc, namespace) => {
    if (isBackofficeNamespace(namespace)) {
      acc[namespace] = getBackofficeDictionary(locale, namespace);
    }
    return acc;
  }, {});
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
