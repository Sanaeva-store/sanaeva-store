import type { PropsWithChildren } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLayoutShell } from "@/app/[locale]/(admin-dasboard)/admin-layout-shell";
import { BACKOFFICE_ALLOWED_ROLES, hasAnyRole } from "@/shared/lib/auth/backoffice-rbac";

const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
] as const;

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

async function fetchBackofficeRoles(): Promise<string[]> {
  const cookieStore = await cookies();
  const sessionFound = SESSION_COOKIE_NAMES.some((name) => cookieStore.has(name));
  if (!sessionFound) return [];

  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  if (!host) return [];

  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");

  try {
    const response = await fetch(`${protocol}://${host}/api/auth/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: cookieStore.toString(),
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

export default async function AdminLayout({
  children,
  params,
}: PropsWithChildren<{ params: Promise<{ locale: string }> }>) {
  const { locale } = (await params) as { locale: string };
  const roles = await fetchBackofficeRoles();

  if (!hasAnyRole(roles, BACKOFFICE_ALLOWED_ROLES)) {
    redirect(`/${locale}`);
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
