/**
 * NextAuth configuration object for customizing authentication behavior.
 *
 * - Redirects users to the `/login` route for sign-in instead of the default NextAuth page.
 * - The `providers` array is left empty here and is intended to be populated in a Node.js-only context (e.g., in `auth.ts`) due to dependencies like bcrypt.
 * - The `callbacks.authorized` function controls access to dashboard pages:
 *   - If a user is not authenticated and tries to access a `/dashboard` route, access is denied (triggers redirect to login).
 *   - If an authenticated user accesses a non-dashboard route, they are redirected to `/dashboard`.
 *   - Otherwise, access is allowed.
 *
 * @satisfies {NextAuthConfig}
 * - The authConfig object must be imported in middleware.ts to apply the authentication logic.
 */

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  // whenever a user needs to sign in, NextAuth will redirect them to the `/login` route instead of its default sign-in page.
  pages: {
    signIn: "/login",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  // Disable the callbacks object if you want users to access dashboard pages before they are logged in.
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
