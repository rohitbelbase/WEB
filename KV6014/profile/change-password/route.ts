// app/api/profile/change-password/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const email = session.user.email;

        const body = (await req.json().catch(() => null)) as
            | {
                currentPassword?: string;
                newPassword?: string;
            }
            | null;

        if (!body) {
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const currentPassword = body.currentPassword || "";
        const newPassword = body.newPassword || "";

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: "Both current and new passwords are required." },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "New password must be at least 6 characters long." },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Should not happen if session is valid, but handle anyway
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const ok = await compare(currentPassword, user.passwordHash);
        if (!ok) {
            return NextResponse.json(
                { error: "Current password is incorrect." },
                { status: 400 }
            );
        }

        const newHash = await hash(newPassword, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: newHash,
                failedLoginAttempts: 0,
                lockoutUntil: null,
            },
        });

        return NextResponse.json(
            { ok: true, message: "Password updated" },
            { status: 200 }
        );
    } catch (err) {
        console.error("Change password error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
