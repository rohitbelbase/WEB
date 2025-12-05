import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const email = session.user.email;

    const user = await prisma.user.update({
        where: { email },
        data: { verified: true },
    });

    return NextResponse.json({
        ok: true,
        user: {
            id: user.id,
            verified: user.verified,
            email: user.email,
        },
    });
}
