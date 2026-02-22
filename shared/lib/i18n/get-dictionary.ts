import type { Locale } from "./config";

const dictionaries = {
  th: () => import("@/messages/th/common.json").then((module) => module.default),
  en: () => import("@/messages/en/common.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
