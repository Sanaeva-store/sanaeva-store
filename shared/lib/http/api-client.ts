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

function extractErrorInfo(payload: unknown): { message: string; code?: string } {
  if (!payload || typeof payload !== "object") {
    return { message: "Request failed unexpectedly" };
  }

  const record = payload as Record<string, unknown>;

  // Contract shape: { success: false, error: { code, message } }
  const nestedError =
    record.error && typeof record.error === "object"
      ? (record.error as Record<string, unknown>)
      : null;
  const nestedMessage =
    nestedError && typeof nestedError.message === "string"
      ? nestedError.message
      : null;
  const nestedCode =
    nestedError && typeof nestedError.code === "string"
      ? nestedError.code
      : undefined;
  if (nestedMessage) {
    return { message: nestedMessage, code: nestedCode };
  }

  // Compatibility shape: { message, code }
  const topMessage =
    typeof record.message === "string" && record.message.trim().length > 0
      ? record.message
      : null;
  const topCode =
    typeof record.code === "string" && record.code.trim().length > 0
      ? record.code
      : undefined;

  return {
    message: topMessage ?? "Request failed unexpectedly",
    code: topCode,
  };
}

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
};

const buildUrl = (path: string) => {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  // In browser, route all `/api/*` requests through Next.js route handlers.
  // This enables secure server-side token forwarding from httpOnly cookies.
  if (typeof window !== "undefined" && path.startsWith("/api/")) {
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
    const { message, code } = extractErrorInfo(payload);
    throw new ApiError(message, response.status, code);
  }

  if (payload && typeof payload === "object" && "success" in payload) {
    const typed = payload as ApiResponse<TData>;
    if (!typed.success) {
      const { message, code } = extractErrorInfo(payload);
      throw new ApiError(message, response.status, code);
    }
    return typed.data;
  }

  // Compatibility: some endpoints return raw JSON payloads (without { success, data } envelope).
  return payload as TData;
}
