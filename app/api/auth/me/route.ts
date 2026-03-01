import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKOFFICE_TOKEN_COOKIE = "backoffice_token";

/**
 * GET /api/auth/me
 *
 * Internal Next.js proxy used by:
 *   - middleware (proxy.ts) to verify backoffice roles on every request
 *   - admin layout (app/[locale]/(admin-dasboard)/layout.tsx) for SSR role check
 *
 * Reads the `backoffice_token` httpOnly cookie and forwards the request to the
 * backend `/api/auth/me` endpoint with an Authorization: Bearer header.
 * Returns the user object (including `roles`) on success.
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(BACKOFFICE_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
  if (!apiBase) {
    return NextResponse.json(
      { message: "API base URL not configured" },
      { status: 500 },
    );
  }

  // Normalise: NEXT_PUBLIC_API_BASE_URL may already end with /api
  const meUrl = apiBase.endsWith("/api")
    ? `${apiBase}/auth/me`
    : `${apiBase}/api/auth/me`;

  try {
    const response = await fetch(meUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: response.status },
      );
    }

    const data = (await response.json()) as unknown;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Failed to reach auth service" },
      { status: 502 },
    );
  }
}
