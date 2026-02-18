import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const planExpiry = (token?.plan as any)?.expiresAt
  const hasExpiredPlan = Boolean(planExpiry && new Date(planExpiry) <= new Date())
  const { pathname } = req.nextUrl;

  if (token?.id && hasExpiredPlan) {
    // Determine if we are already on the login page to avoid redirect loops
    const isLoginPage = pathname === "/inloggen";
    
    // If on login page, just clear cookies and return response (let the page load)
    // Otherwise redirect to login page with expired param
    
    let response;
    if (isLoginPage) {
       response = NextResponse.next();
    } else {
       response = NextResponse.redirect(new URL("/inloggen?expired=1", req.url));
    }

    // Force clear all auth cookies with explicit options
    const cookiesToClear = [
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "next-auth.csrf-token",
      "__Host-next-auth.csrf-token",
      "next-auth.callback-url",
      "__Secure-next-auth.callback-url",
    ];

    // Add any other cookies present in the request that look like next-auth cookies
    req.cookies.getAll().forEach((c) => {
      if (c.name.includes("next-auth")) {
        cookiesToClear.push(c.name);
      }
    });
    
    // Remove duplicates
    const uniqueCookiesToClear = [...new Set(cookiesToClear)];

    uniqueCookiesToClear.forEach(cookieName => {
        // Clear with default path (host-only)
        response.cookies.set(cookieName, "", { maxAge: 0, path: "/" });
        
        // Also try clearing for domain logic if applicable
        if (process.env.NEXTAUTH_URL) {
            try {
               const url = new URL(process.env.NEXTAUTH_URL);
               const domain = url.hostname;
               // Identify if we need Secure attribute
               const isSecure = url.protocol === 'https:';
               
               // Manually append the domain-specific clearing cookie to avoid overwriting the previous one
               // construct Set-Cookie header string
               let cookieString = `${cookieName}=; Path=/; Domain=${domain}; Max-Age=0`;
               if (isSecure) cookieString += "; Secure";
               if (cookieName.startsWith("__Secure-")) cookieString += "; Secure"; // Force secure for secure prefix
               
               response.headers.append("Set-Cookie", cookieString);
            } catch (e) {
                // Ignore invalid URL
            }
        }
    });

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
