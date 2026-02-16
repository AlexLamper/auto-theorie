import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const planExpiry = (token?.plan as any)?.expiresAt
  const hasExpiredPlan = Boolean(planExpiry && new Date(planExpiry) <= new Date())

  const { pathname } = req.nextUrl;

  if (token?.id && hasExpiredPlan) {
    const targetUrl = new URL("/?expired=1", req.url)
    const response =
      pathname === "/"
        ? NextResponse.next()
        : NextResponse.redirect(targetUrl)

    response.cookies.delete("next-auth.session-token")
    response.cookies.delete("__Secure-next-auth.session-token")
    response.cookies.delete("next-auth.csrf-token")
    response.cookies.delete("__Host-next-auth.csrf-token")
    response.cookies.delete("next-auth.callback-url")
    response.cookies.delete("__Secure-next-auth.callback-url")
    return response
  }

  // Check if user has an active plan
  const hasPlan = 
    token?.plan && 
    (token.plan as any).expiresAt && 
    new Date((token.plan as any).expiresAt) > new Date();

  // 1. World for Users WITH a Plan
  if (hasPlan) {
    // Redirect public sales pages to dashboard
    if (pathname === "/" || pathname === "/prijzen" || pathname === "/aanmelden" || pathname === "/inloggen") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } 
  
  // 2. World for Users WITHOUT a Plan (or not logged in)
  else {
    // Redirect dashboard to pricing
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/prijzen", req.url));
    }
    
    // Optional: Protect deep content routes if they shouldn't be accessible without a plan
    // For now we assume strict specific redirects as requested
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|logo|robots.txt|sitemap).*)',
  ],
};
