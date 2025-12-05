"use client";

import * as React from "react";
import { signOut } from "next-auth/react";

export default function DeleteAccount() {
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    async function onDelete() {
        setError(null);
        setMessage(null);

        const confirmDelete = window.confirm(
            "Are you sure? This will permanently delete your account."
        );

        if (!confirmDelete) return;

        setLoading(true);
        try {
            const res = await fetch("/api/profile/delete", {
                method: "POST",
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(data.error || "Account deletion failed.");
            } else {
                setMessage("Account deleted. Redirecting...");
                setTimeout(() => {
                    signOut({ callbackUrl: "/signup" });
                }, 800);
            }
        } catch {
            setError("Network error.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="mt-10 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-red-700">Danger zone</h2>
            <p className="mt-1 text-sm text-gray-600">
                This action is permanent and cannot be undone.
            </p>

            {error && (
                <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}
            {message && (
                <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                    {message}
                </div>
            )}

            <button
                onClick={onDelete}
                disabled={loading}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
                {loading ? "Deleting..." : "Delete my account"}
            </button>
        </section>
    );
}
