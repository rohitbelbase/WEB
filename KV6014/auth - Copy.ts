// auth.ts (ASCII-safe)
// ------------------------------------------------------------
// NextAuth config with a Credentials provider for demo only.
// Step 3 will replace the hardcoded user with DB + bcrypt.

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (creds) => {
                const DEMO_EMAIL = "demo@example.com";
                const DEMO_PASSWORD = "password123";

                const email = (creds?.email || "").toLowerCase().trim();
                const password = creds?.password || "";

                if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
                    return { id: "demo-user-id", name: "Demo User", email: DEMO_EMAIL };
                }
                return null; // invalid credentials
            }
        })
    ],
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET
});
