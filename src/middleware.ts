import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

const publicRoutes = new Set([
  "/",
  "/login",
  "/sign-up",
  "/kakao/start",
  "/kakao/complete",
  "/search",
  "/course",
]);

const guestRoutes = new Set([
  "/login",
  "/sign-up",
  "/kakao/start",
  "/kakao/complete",
  "/search",
  "/course",
]);

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const session = await getSession();
  const isLoggedIn = Boolean(session.id);
  const isPublicRoute = publicRoutes.has(pathname);
  const isGuestRoute = guestRoutes.has(pathname);

  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (isLoggedIn && isGuestRoute) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
