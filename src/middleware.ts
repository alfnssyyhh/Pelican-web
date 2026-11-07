import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // 1. Subdomain rewriting: if accessing via admin.pelican-ms.com or admin.*
  const isAdminSubdomain = host.startsWith("admin.");

  // If on admin subdomain and accessing non-admin, non-api route, rewrite internally to '/admin'
  let targetPathname = pathname;
  if (isAdminSubdomain && !pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    targetPathname = `/admin${pathname === "/" ? "" : pathname}`;
  }

  // 2. Authentication check for Admin pages and Admin API routes
  if (targetPathname.startsWith("/admin") || targetPathname.startsWith("/api/admin")) {
    const isLoginPage = targetPathname === "/admin/login";
    const isLoginApi = targetPathname === "/api/admin/login" || targetPathname === "/api/admin/logout";

    const sessionCookie = request.cookies.get(SESSION_COOKIE);
    const session = sessionCookie?.value ? await verifySessionToken(sessionCookie.value) : null;

    if (!session && !isLoginPage && !isLoginApi) {
      if (targetPathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { error: "Akses ditolak. Sesi tidak sah atau telah kedaluwarsa." },
          { status: 401 }
        );
      }
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", targetPathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session && isLoginPage) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // Rewrite if admin subdomain
  const response =
    isAdminSubdomain && !pathname.startsWith("/admin") && !pathname.startsWith("/api")
      ? NextResponse.rewrite(new URL(targetPathname, request.url))
      : NextResponse.next();

  // 3. Set OWASP Hardening Security Headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.googleapis.com; style-src 'self' 'unsafe-inline' https://*.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://*.gstatic.com; connect-src 'self' https:; frame-src 'self' https://*.google.com https://*.google.co.id;"
  );

  // 4. Automatic locale detection for first-time visitors
  if (
    !request.cookies.get("NEXT_LOCALE") &&
    !targetPathname.startsWith("/admin") &&
    !targetPathname.startsWith("/api")
  ) {
    const acceptLanguage = request.headers.get("accept-language") || "";
    const detectedLocale = acceptLanguage.toLowerCase().includes("id") ? "id" : "en";
    response.cookies.set("NEXT_LOCALE", detectedLocale, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|uploads/).*)",
  ],
};
