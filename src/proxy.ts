import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCookieCache } from "better-auth/cookies";

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

const ROLE_GUARDS: { prefix: string; roles: string[] }[] = [
  { prefix: "/admin", roles: ["ADMIN", "SUPER_ADMIN"] },
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  const cache = await getCookieCache(request, {
    secret: process.env.BETTER_AUTH_SECRET,
  }).catch(() => null);
  const role = (cache?.user?.role as string | undefined) ?? null;

  if (!isProtected) {
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
    if (isAuthPage && cache) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (!cache) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  for (const guard of ROLE_GUARDS) {
    if (pathname.startsWith(guard.prefix) && (!role || !guard.roles.includes(role))) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
