/**
 * src/middleware.js  — Next.js Edge Middleware
 * ─────────────────────────────────────────────────────────────────────────────
 * Runs on EVERY request before the page is rendered.
 * Protects all private routes by checking for a JWT token in:
 *   1. Cookie "accessToken" or "token"  (set by the auth action)
 *   2. Authorization header (for API-to-API calls)
 *
 * Public routes (no token required):
 *   /login, /signup, /idea-flow, /business-upload, /api/*, /_next/*, /public/*
 */

import { NextResponse } from "next/server";

// Routes accessible WITHOUT authentication
const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/idea-flow",
  "/business-upload",
];

// Prefixes that are always public (static assets, Next internals, API)
const PUBLIC_PREFIXES = [
  "/_next",
  "/api",
  "/favicon",
  "/images",
  "/public",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // ── 1. Always allow public prefixes ────────────────────────────────────────
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // ── 2. Always allow exact public pages ─────────────────────────────────────
  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"))) {
    return NextResponse.next();
  }

  // ── 3. Read token from cookies ─────────────────────────────────────────────
  const accessToken =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("token")?.value;

  const authHeader = request.headers.get("authorization");
  const bearerToken =
    authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const hasToken = !!(accessToken || bearerToken);

  // ── 4. If on login/signup but already authenticated → redirect to dashboard ─
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ── 5. If accessing private route without token → redirect to login ─────────
  if (!hasToken) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the original destination so we can redirect back after login
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 6. Authenticated — allow through ────────────────────────────────────────
  return NextResponse.next();
}

// Only run middleware on non-static paths
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
