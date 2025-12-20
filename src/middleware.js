import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Prevent middleware from running on static files or API routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
