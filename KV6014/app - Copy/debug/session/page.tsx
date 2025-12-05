import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function DebugSessionPage() {
    const session = await getServerSession(authOptions);
    return (
        <main className="min-h-dvh px-4 py-10">
            <h1 className="text-2xl font-semibold">Session Debug</h1>
            <pre className="mt-4 rounded-lg bg-gray-100 p-4 text-sm overflow-auto">
                {JSON.stringify(session, null, 2)}
            </pre>
            <p className="mt-4 text-sm">Sign in at /api/auth/signin with demo@example.com / password123</p>
        </main>
    );
}
