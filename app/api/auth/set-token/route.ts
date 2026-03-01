import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKOFFICE_TOKEN_COOKIE = "backoffice_token";
const BACKOFFICE_REFRESH_COOKIE = "backoffice_refresh";

type SetTokenBody = {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
};

/**
 * POST /api/auth/set-token
 *
 * Called by the admin-login page after a successful call to the backend
 * `/api/auth/login` endpoint. Stores the JWT pair as httpOnly cookies so that
 * server components and middleware can authenticate backoffice requests.
 *
 * Body: { accessToken: string; refreshToken: string; expiresIn?: number }
 */
export async function POST(request: NextRequest) {
  let body: SetTokenBody;

  try {
    body = (await request.json()) as SetTokenBody;
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  const { accessToken, refreshToken, expiresIn = 900 } = body;

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      { message: "accessToken and refreshToken are required" },
      { status: 400 },
    );
  }

  const isProduction = process.env.NODE_ENV === "production";
  const cookieStore = await cookies();
  const maxAge = expiresIn;

  cookieStore.set(BACKOFFICE_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  cookieStore.set(BACKOFFICE_REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ ok: true });
}

/**
 * DELETE /api/auth/set-token
 *
 * Clears backoffice auth cookies (logout).
 */
export async function DELETE() {
  const cookieStore = await cookies();

  cookieStore.delete(BACKOFFICE_TOKEN_COOKIE);
  cookieStore.delete(BACKOFFICE_REFRESH_COOKIE);

  return NextResponse.json({ ok: true });
}
