import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/shared/lib/i18n/config";
import {
  BACKOFFICE_ALLOWED_ROLES,
  getRequiredBackofficeRoles,
  hasAnyRole,
} from "@/shared/lib/auth/backoffice-rbac";

const PROTECTED_PATHS = ["/account", "/orders"];
const AUTH_PATHS = ["/auth/signin", "/auth/signup", "/auth/forgot-password"];
const BACKOFFICE_PATH_PREFIX = "/admin-dasboard";
const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
] as const;

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(",")[0]
      ?.split("-")[0]
      ?.toLowerCase();
    if (preferredLocale && (locales as readonly string[]).includes(preferredLocale)) {
      return preferredLocale;
    }
  }

  return defaultLocale;
}

function getSessionToken(request: NextRequest) {
  for (const cookieName of SESSION_COOKIE_NAMES) {
    const value = request.cookies.get(cookieName)?.value;
    if (value) return value;
  }
  return null;
}

function extractUserRoles(payload: unknown): string[] {
  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;
  const data =
    record.success === true &&
    record.data &&
    typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : record;

  const roles = data.roles;
  if (!Array.isArray(roles)) return [];

  return roles.filter((role): role is string => typeof role === "string");
}

async function fetchBackofficeRoles(request: NextRequest): Promise<string[]> {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return [];

  try {
    const meUrl = new URL("/api/auth/me", request.url);
    const response = await fetch(meUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as unknown;
    return extractUserRoles(payload);
  } catch {
    return [];
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }

  const locale = pathname.split("/")[1];
  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  const isProtected = PROTECTED_PATHS.some((p) => pathWithoutLocale.startsWith(p));
  const isAuthPage = AUTH_PATHS.some((p) => pathWithoutLocale.startsWith(p));
  const isBackofficePath = pathWithoutLocale.startsWith(BACKOFFICE_PATH_PREFIX);

  const isAuthenticated = Boolean(getSessionToken(request));

  if (isProtected && !isAuthenticated) {
    const signInUrl = new URL(`/${locale}/auth/signin`, request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  /**
   * Backoffice auth guard:
   * 1) Require signed-in session.
   * 2) Require allowed backoffice role.
   * 3) Enforce stricter role rules on sensitive sections.
   */
  if (isBackofficePath) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    const userRoles = await fetchBackofficeRoles(request);

    if (!hasAnyRole(userRoles, BACKOFFICE_ALLOWED_ROLES)) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    const requiredRoles = getRequiredBackofficeRoles(pathWithoutLocale);
    if (requiredRoles && !hasAnyRole(userRoles, requiredRoles)) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
