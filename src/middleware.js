// middleware.js
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLoginPage = req.nextUrl.pathname.startsWith("/login");

  if (isOnLoginPage && isLoggedIn) {
    return Response.redirect(new URL("/", req.nextUrl));
  }

  if (!isOnLoginPage && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

// Configure which paths the middleware runs on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
