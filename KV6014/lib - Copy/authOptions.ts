import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
                if (!email || !password) return null;

                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) return null;

                const ok = await bcrypt.compare(password, user.passwordHash);
                if (!ok) return null;

                return { id: user.id, name: user.name, email: user.email };
            },
        }),
    ],
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.user = { id: user.id, name: user.name, email: user.email };
            return token;
        },
        async session({ session, token }) {
            if (token && (token as any).user) {
                session.user = (token as any).user as any;
            }
            return session;
        },
    },
};
