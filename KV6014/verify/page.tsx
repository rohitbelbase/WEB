"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";

export default function VerifyPage() {
    const sessionHook = useSession();
    const sessionData = sessionHook.data;
    const sessionStatus = sessionHook.status;
    const updateSession = sessionHook.update;

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    if (sessionStatus === "loading") {
        return <p>Loading...</p>;
    }

    const isVerified =
        sessionData && sessionData.user && sessionData.user.verified;

    async function handleVerify() {
        setLoading(true);
        setMsg(null);

        try {
            const res = await fetch("/api/profile/verify", { method: "POST" });

            if (!res.ok) {
                throw new Error("Could not verify");
            }

            const data = await res.json();

            await updateSession({
                ...sessionData,
                user: {
                    ...sessionData.user,
                    verified: data.user.verified,
                },
            });

            setMsg("Your account is now verified!");
        } catch (err) {
            setMsg("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-dvh bg-gray-50 px-4 pb-20">
            <div className="mx-auto mt-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                <h1 className="text-2xl font-semibold">Account Verification</h1>
                <p className="text-gray-600 mt-1">
                    Please verify your account to continue.
                </p>

                <div className="mt-6">
                    <p className="text-sm mb-4">
                        Status:{" "}
                        <span className={isVerified ? "text-green-600" : "text-red-600"}>
                            {isVerified ? "Verified" : "Not Verified"}
                        </span>
                    </p>

                    {!isVerified && (
                        <Button loading={loading} onClick={handleVerify}>
                            Verify my account
                        </Button>
                    )}

                    {msg && (
                        <p className="mt-3 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {msg}
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}
