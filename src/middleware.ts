import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude public paths from session middleware checks
  const isPublicPage =
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/pricing" ||
    pathname === "/verify-email" ||
    pathname.startsWith("/api/pricing") ||
    pathname.startsWith("/api/mentors") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico";

  // Check if session token cookie exists
  const sessionCookie = request.cookies.get("user_session");
  const token = sessionCookie?.value;
  const session = token ? await verifySessionToken(token) : null;

  // 1. Visit landing page (/) or login (/login) while authenticated within 24 hours -> Redirect directly to respective console
  if ((pathname === "/" || pathname === "/login") && session) {
    if (session.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else if (session.role === "mentor") {
      return NextResponse.redirect(new URL("/mentor", request.url));
    } else if (session.role === "student") {
      return NextResponse.redirect(new URL("/student", request.url));
    }
  }

  // 2. Protected console pages
  const isStudentPath = pathname.startsWith("/student") || pathname.startsWith("/api/student/");
  const isMentorPath = pathname.startsWith("/mentor") || pathname.startsWith("/api/mentor/");
  const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api/admin/");

  if (isStudentPath || isMentorPath || isAdminPath) {
    if (!session) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Role permissions check
    if (isStudentPath && session.role !== "student") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden. Student permissions required." }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isMentorPath && session.role !== "mentor") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden. Mentor permissions required." }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAdminPath && session.role !== "admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden. Admin permissions required." }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth APIs)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
