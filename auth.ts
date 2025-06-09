import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import postgres from "postgres";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import { authConfig } from "./auth.config";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
// Promise<User | undefined> is the return type of getUser function.
// output is a User object(its shape is like the User) or undefined if no user is found.
async function getUser(email: string): Promise<User | undefined> {
  try {
    // user is an array of User objects, we expect only one user to match the email, [{}].
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0]; // Return the first user found(an object), or undefined if no user matches
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

/**
 * Initializes NextAuth authentication with custom configuration and providers.
 *
 * Exports the `auth`, `signIn`, and `signOut` methods for authentication handling.
 * Uses a credentials provider that validates user email and password using Zod schema validation.
 * Finally, we should connect auth logic with the login form.
 */
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      // authorize function to handle the authentication logic
      // use zod to validate the email and password before checking if the user exists in the database
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await getUser(email);
          if (!user) return null;

          // user.password is a hashed password stored in the database
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
