// lib/getCurrentUser.ts
// Helper to get the logged-in user from NextAuth on the server.

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    return session?.user || null;
}
