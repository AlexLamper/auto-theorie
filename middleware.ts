import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── Public routes ──────────────────────────────────────────────────────
// These routes are accessible to EVERYONE regardless of auth/plan status.
// Add exact paths or prefixes here as needed.
const PUBLIC_PATHS = [
  "/",
  "/inloggen",
  "/aanmelden",
  "/prijzen",
  "/contact",
  "/informatie",
  "/veelgestelde-vragen",
  "/privacy-policy",
  "/terms-of-service",
  "/hulpmiddelen",
  "/verkeersborden",
  "/betaling",
  "/not-found",
];

/**
 * Returns true when the pathname matches a public route.
 * Exact matches and prefix matches (e.g. /informatie/artikelen) are both supported.
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

// ── Protected routes (require an active plan) ──────────────────────────
const PROTECTED_PATHS = [
  "/dashboard",
  "/leren",
  "/oefenexamens",
  "/account",
];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

// ── Helper: clear every next-auth cookie we can find ───────────────────
function clearAuthCookies(req: NextRequest, res: NextResponse): void {
  const names = new Set([
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.callback-url",
  ]);

  // Also grab any cookie whose name contains "next-auth"
  req.cookies.getAll().forEach((c) => {
    if (c.name.includes("next-auth")) names.add(c.name);
  });

  names.forEach((name) => {
    // Primary: set via the cookies API (path=/)
    res.cookies.set(name, "", { path: "/", maxAge: 0 });

    // Secondary: append a raw Set-Cookie header so both host-only and
    // domain-scoped variants are covered (avoids the NextResponse Map
    // overwrite issue).
    const secure =
      name.startsWith("__Secure-") || name.startsWith("__Host-");
    let raw = `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
    if (secure) raw += "; Secure";
    res.headers.append("Set-Cookie", raw);
  });
}

// ── Middleware ──────────────────────────────────────────────────────────
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const planExpiry = (token?.plan as any)?.expiresAt;
  const hasExpiredPlan = Boolean(
    planExpiry && new Date(planExpiry) <= new Date()
  );
  const hasPlan =
    token?.plan &&
    (token.plan as any).expiresAt &&
    new Date((token.plan as any).expiresAt) > new Date();

  // ─── 1. Expired plan – clear session & redirect only on PROTECTED routes ─
  if (token?.id && hasExpiredPlan) {
    // On the login page itself: just clear cookies and let the page render
    if (pathname === "/inloggen") {
      const res = NextResponse.next();
      clearAuthCookies(req, res);
      return res;
    }

    // Public routes should ALWAYS be accessible, even with a stale token.
    // We still clear cookies so the stale session is removed on the next
    // request, but we do NOT redirect away from the page.
    if (isPublicRoute(pathname)) {
      const res = NextResponse.next();
      clearAuthCookies(req, res);
      return res;
    }

    // Protected route → redirect to login with expired flag & clear cookies
    const res = NextResponse.redirect(
      new URL("/inloggen?expired=1", req.url)
    );
    clearAuthCookies(req, res);
    return res;
  }

  // ─── 2. Active plan – redirect marketing pages to dashboard ──────────
  if (hasPlan) {
    if (
      pathname === "/" ||
      pathname === "/prijzen" ||
      pathname === "/aanmelden" ||
      pathname === "/inloggen"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // ─── 3. No plan / not logged in – protect dashboard & content ────────
  if (!hasPlan && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL("/prijzen", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api          (API routes)
     * - _next/static (static files)
     * - _next/image  (image optimisation)
     * - favicon.ico  (favicon)
     * - public assets (images, logo, robots, sitemap)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|logo|robots.txt|sitemap).*)",
  ],
};
