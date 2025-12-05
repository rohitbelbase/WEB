import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const body = (await req.json().catch(() => null)) as {
            name?: string; email?: string; password?: string;
        } | null;

        if (!body?.name || !body?.email || !body?.password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const name = body.name.trim();
        const email = body.email.toLowerCase().trim();
        const password = body.password;

        if (password.length < 6) {
            return NextResponse.json({ error: "Password too short" }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        await prisma.user.create({ data: { name, email, passwordHash } });

        return NextResponse.json({ ok: true, message: "Account created" }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
