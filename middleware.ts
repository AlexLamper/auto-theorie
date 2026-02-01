import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const blockedRoutes: string[] = [];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (blockedRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/app/not-found";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/leren/:path*"],
};
