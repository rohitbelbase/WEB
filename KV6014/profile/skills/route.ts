// app/api/profile/skills/route.ts
// GET  -> returns ids of skills selected by the current user
// POST -> replaces the user's selected skills with the provided list

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET: return [{ skillId, ... }] as simple array of ids
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                skills: {
                    select: { skillId: true },
                },
            },
        });

        const selected = (user?.skills || []).map((s) => s.skillId);

        return NextResponse.json({ selected });
    } catch (e: any) {
        console.error("GET /api/profile/skills error:", e);
        return NextResponse.json(
            { error: "Failed to load user skills" },
            { status: 500 }
        );
    }
}

// POST: overwrite the user's skills with the given skillIds
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = (await req.json().catch(() => null)) as
            | { skillIds?: string[] }
            | null;

        const skillIds = Array.isArray(body?.skillIds) ? body!.skillIds : [];

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Clear existing skills for user
        await prisma.userSkill.deleteMany({
            where: { userId: user.id },
        });

        // Add new skills (if any)
        if (skillIds.length > 0) {
            await prisma.userSkill.createMany({
                data: skillIds.map((skillId) => ({
                    userId: user.id,
                    skillId,
                })),
            });
        }

        return NextResponse.json({ ok: true });
    } catch (e: any) {
        console.error("POST /api/profile/skills error:", e);
        return NextResponse.json(
            { error: "Failed to save user skills" },
            { status: 500 }
        );
    }
}
