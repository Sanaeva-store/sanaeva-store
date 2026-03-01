import { publicEnv } from "@/shared/config/public-env";
import type { ApiResponse } from "@/shared/types/api";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
  cache?: RequestCache;
};

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
};

const buildUrl = (path: string) => {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  if (!publicEnv.apiBaseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_API_BASE_URL. Set it in your environment.",
    );
  }

  const baseUrl = publicEnv.apiBaseUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Allow NEXT_PUBLIC_API_BASE_URL to be either ".../api" or bare host.
  if (
    baseUrl.endsWith("/api") &&
    (normalizedPath === "/api" || normalizedPath.startsWith("/api/"))
  ) {
    return `${baseUrl}${normalizedPath.slice(4)}`;
  }

  return `${baseUrl}${normalizedPath}`;
};

export async function apiRequest<TData>(
  path: string,
  options: RequestOptions = {},
) {
  const response = await fetch(buildUrl(path), {
    method: options.method ?? "GET",
    headers: { ...defaultHeaders, ...options.headers },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
    cache: options.cache ?? "no-store",
  });

  let payload: ApiResponse<TData> | null = null;

  try {
    payload = (await response.json()) as ApiResponse<TData>;
  } catch {
    if (!response.ok) {
      throw new ApiError("Unable to parse error response", response.status);
    }
  }

  if (!response.ok) {
    const message =
      payload && !payload.success
        ? payload.error.message
        : "Request failed unexpectedly";
    const code = payload && !payload.success ? payload.error.code : undefined;
    throw new ApiError(message, response.status, code);
  }

  if (payload && !payload.success) {
    throw new ApiError(payload.error.message, response.status, payload.error.code);
  }

  return payload?.data as TData;
}
