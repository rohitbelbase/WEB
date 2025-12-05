// app/api/profile/delete/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const userId = session.user.id;

        // Delete user's related data first
        await prisma.userSkill.deleteMany({
            where: { userId },
        });

        // Finally: delete the user
        await prisma.user.delete({
            where: { id: userId },
        });

        return NextResponse.json(
            { ok: true, message: "Account deleted" },
            { status: 200 }
        );
    } catch (err) {
        console.error("Delete account error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
