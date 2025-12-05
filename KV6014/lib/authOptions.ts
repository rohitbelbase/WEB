// lib/authOptions.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

const MAX_ATTEMPTS = 5; // how many wrong tries before lock
const LOCKOUT_MINUTES = 15; // lockout duration in minutes

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(creds) {
                const email = (creds?.email || "").toLowerCase().trim();
                const password = creds?.password || "";

                if (!email || !password) {
                    throw new Error("Invalid email or password");
                }

                // 1) Find user
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    // Do not leak whether the user exists
                    throw new Error("Invalid email or password");
                }

                const now = new Date();

                // 2) Check if account is currently locked
                if (user.lockoutUntil && user.lockoutUntil > now) {
                    const remainingMs = user.lockoutUntil.getTime() - now.getTime();
                    const remainingMinutes = Math.ceil(remainingMs / 60000);

                    throw new Error(
                        "Your account is locked due to repeated failed logins. Please try again in " +
                        remainingMinutes +
                        " minute" +
                        (remainingMinutes !== 1 ? "s." : ".")
                    );
                }

                // 3) Check password
                const ok = await compare(password, user.passwordHash);

                if (!ok) {
                    const previousAttempts = user.failedLoginAttempts ?? 0;
                    const newAttempts = previousAttempts + 1;

                    let lockoutUntil: Date | null = null;
                    let failedLoginAttempts = newAttempts;

                    if (newAttempts >= MAX_ATTEMPTS) {
                        lockoutUntil = new Date(
                            now.getTime() + LOCKOUT_MINUTES * 60 * 1000
                        );
                        failedLoginAttempts = 0; // reset after lock is applied
                    }

                    console.log(
                        "[AUTH] Wrong password for",
                        email,
                        "previousAttempts=",
                        previousAttempts,
                        "newAttempts=",
                        newAttempts,
                        "lockoutUntil=",
                        lockoutUntil ? lockoutUntil.toISOString() : "null"
                    );

                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            failedLoginAttempts,
                            lockoutUntil,
                        },
                    });

                    throw new Error("Invalid email or password");
                }

                // 4) Correct password: clear failed attempts and lockout if needed
                if ((user.failedLoginAttempts ?? 0) !== 0 || user.lockoutUntil) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            failedLoginAttempts: 0,
                            lockoutUntil: null,
                        },
                    });
                }

                // 5) TEMPORARY: allow unverified users to log in.
                // TODO: when you implement email / token verification,
                // re-enable a verification gate here so only verified
                // accounts can access the main app.

                // 6) Return user for NextAuth
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    verified: user.verified,
                };
            },
        }),
    ],

    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = {
                    id: (user as any).id,
                    name: user.name,
                    email: user.email,
                    verified: (user as any).verified ?? false,
                };
            }
            return token;
        },
        async session({ session, token }) {
            if ((token as any).user) {
                session.user = (token as any).user as any;
            }
            return session;
        },
    },
};
