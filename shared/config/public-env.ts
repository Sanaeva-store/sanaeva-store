const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const publicEnv = {
  apiBaseUrl: trimTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL ?? ""),
} as const;
