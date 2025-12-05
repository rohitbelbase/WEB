// app/api/profile/update/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

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
                name?: string;
                bio?: string;
                age?: number | null;
                address?: string;
                availableMorning?: boolean;
                availableAfternoon?: boolean;
                availableEvening?: boolean;
                avatarDataUrl?: string;
            }
            | null;

        if (!body) {
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const data: any = {};

        if (typeof body.name === "string") {
            const trimmed = body.name.trim();
            if (!trimmed) {
                return NextResponse.json({ error: "Name is required" }, { status: 400 });
            }
            data.name = trimmed;
        }

        if (typeof body.bio === "string") {
            data.bio = body.bio.trim() || null;
        }

        if (body.age !== undefined) {
            if (body.age === null || body.age === 0) {
                data.age = null;
            } else if (typeof body.age === "number" && body.age > 0 && body.age < 130) {
                data.age = Math.floor(body.age);
            } else {
                return NextResponse.json(
                    { error: "Age must be between 1 and 129" },
                    { status: 400 }
                );
            }
        }

        if (typeof body.address === "string") {
            data.address = body.address.trim() || null;
        }

        if (typeof body.availableMorning === "boolean") {
            data.availableMorning = body.availableMorning;
        }
        if (typeof body.availableAfternoon === "boolean") {
            data.availableAfternoon = body.availableAfternoon;
        }
        if (typeof body.availableEvening === "boolean") {
            data.availableEvening = body.availableEvening;
        }

        if (typeof body.avatarDataUrl === "string") {
            const trimmed = body.avatarDataUrl.trim();
            if (trimmed === "") {
                data.avatarUrl = null;
            } else if (trimmed.startsWith("data:image/")) {
                data.avatarUrl = trimmed;
            }
        }

        if (Object.keys(data).length === 0) {
            return NextResponse.json(
                { error: "No valid fields to update" },
                { status: 400 }
            );
        }

        const updated = await prisma.user.update({
            where: { email },
            data,
            select: {
                id: true,
                name: true,
                bio: true,
                age: true,
                address: true,
                availableMorning: true,
                availableAfternoon: true,
                availableEvening: true,
                avatarUrl: true,
            },
        });

        return NextResponse.json({ ok: true, user: updated }, { status: 200 });
    } catch (err) {
        console.error("Profile update error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
