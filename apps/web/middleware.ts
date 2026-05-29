import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/report", "/profile", "/admin"];

export function middleware(request: NextRequest): NextResponse {
  const { pathname, origin } = request.nextUrl;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Access token is stored client-side (sessionStorage), so the middleware
  // checks for a lightweight session cookie set on login instead.
  const hasSession = request.cookies.has("sw_session");
  if (hasSession) return NextResponse.next();

  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/report/:path*", "/profile/:path*", "/admin/:path*"],
};
