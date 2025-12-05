// app/profile/edit/ChangePasswordForm.tsx
"use client";

import * as React from "react";
import { signOut } from "next-auth/react";

export default function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/profile/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(data.error || "Could not change password.");
            } else {
                setMessage("Password updated. You will be signed out.");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

                setTimeout(() => {
                    signOut({ callbackUrl: "/login" });
                }, 1000);
            }
        } catch {
            setError("Network error.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="mt-10 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold">Change password</h2>
            <p className="mt-1 text-sm text-gray-600">
                Update your password. After changing, you will need to sign in again.
            </p>

            <form onSubmit={onSubmit} className="mt-4 max-w-md space-y-4" noValidate>
                <div>
                    <label
                        htmlFor="currentPassword"
                        className="mb-1 block text-sm font-medium text-gray-900"
                    >
                        Current password
                    </label>
                    <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30"
                    />
                </div>

                <div>
                    <label
                        htmlFor="newPassword"
                        className="mb-1 block text-sm font-medium text-gray-900"
                    >
                        New password
                    </label>
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Minimum 6 characters.
                    </p>
                </div>

                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="mb-1 block text-sm font-medium text-gray-900"
                    >
                        Confirm new password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30"
                    />
                </div>

                {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Change password"}
                </button>
            </form>
        </section>
    );
}
