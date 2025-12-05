// app/api/skills/route.ts
// Returns a list of all skills in the database.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: { name: "asc" },
            select: { id: true, name: true },
        });

        return NextResponse.json({ skills });
    } catch (e: any) {
        console.error("GET /api/skills error:", e);
        return NextResponse.json(
            { error: "Failed to load skills" },
            { status: 500 }
        );
    }
}
