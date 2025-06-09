/**
 * Middleware configuration for Next.js authentication using NextAuth.
 *
 * - Imports NextAuth and a custom authentication configuration.
 * - Exports the NextAuth middleware handler for authentication.
 * - Defines a `config` object specifying the matcher pattern to determine which routes the middleware applies to.
 *   - The matcher excludes API routes, Next.js static/image assets, and PNG files from authentication.
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 */

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
// initialize NextAuth with the provided configuration
// This will handle authentication for the application based on the defined providers and callbacks.
export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

/**
 * The advantage of employing Middleware for this task is that the protected routes will not even start
 *  rendering until the Middleware verifies the authentication, enhancing both the security and performance of your application.
 */
