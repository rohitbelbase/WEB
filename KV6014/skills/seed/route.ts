// app/api/skills/seed/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const DEFAULT_SKILLS = [
    "Email & Messaging",
    "Video Calls",
    "Online Safety",
    "Document Editing",
    "Spreadsheets",
    "Presentation Tools",
    "Smartphone Basics",
    "Tablet Basics",
    "Social Media",
    "Online Banking",
];

async function runSeed() {
    try {
        const count = await prisma.skill.count();

        if (count === 0) {
            await prisma.skill.createMany({
                data: DEFAULT_SKILLS.map((name) => ({ name }))
            });
            return NextResponse.json({ ok: true, message: "Seeded skills" });
        }

        return NextResponse.json({ ok: true, message: "Skills already exist" });
    } catch (e: any) {
        console.error("SEED ERROR:", e);
        return NextResponse.json(
            { error: String(e) },
            { status: 500 }
        );
    }
}

export async function POST() {
    return runSeed();
}

export async function GET() {
    // convenience for browser
    return runSeed();
}
