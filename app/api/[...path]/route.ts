import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKOFFICE_TOKEN_COOKIE = "backoffice_token";

function buildBackendUrl(request: NextRequest, path: string[]) {
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
  if (!apiBase) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const base = apiBase.endsWith("/api") ? apiBase : `${apiBase}/api`;
  const joinedPath = path.join("/");
  return `${base}/${joinedPath}${request.nextUrl.search}`;
}

async function forward(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const targetUrl = buildBackendUrl(request, path);

  const requestHeaders = new Headers();
  const accept = request.headers.get("accept");
  const contentType = request.headers.get("content-type");

  if (accept) requestHeaders.set("accept", accept);
  if (contentType) requestHeaders.set("content-type", contentType);

  const token = (await cookies()).get(BACKOFFICE_TOKEN_COOKIE)?.value;
  if (token && !requestHeaders.has("authorization")) {
    requestHeaders.set("authorization", `Bearer ${token}`);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: requestHeaders,
    body,
    cache: "no-store",
  });

  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export const GET = forward;
export const POST = forward;
export const PATCH = forward;
export const PUT = forward;
export const DELETE = forward;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
