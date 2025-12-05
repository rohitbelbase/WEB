// app/profile/edit/AvatarForm.tsx
"use client";

import * as React from "react";

type AvatarFormProps = {
    initialAvatarUrl: string | null;
};

export default function AvatarForm(props: AvatarFormProps) {
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(
        props.initialAvatarUrl || null
    );
    const [file, setFile] = React.useState<File | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setMessage(null);
        setError(null);

        const selected = e.target.files?.[0] || null;
        setFile(selected);

        if (selected) {
            const url = URL.createObjectURL(selected);
            setPreviewUrl(url);
        }
    }

    async function onUpload(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!file) {
            setError("Please choose an image first.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/profile/avatar", {
                method: "POST",
                body: formData,
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(data.error || "Failed to upload avatar.");
            } else {
                setMessage("Avatar updated.");
                if (data.avatarUrl) {
                    setPreviewUrl(data.avatarUrl);
                }
            }
        } catch {
            setError("Network error.");
        } finally {
            setLoading(false);
        }
    }

    const displayUrl =
        previewUrl && previewUrl.startsWith("blob:")
            ? previewUrl
            : previewUrl
                ? previewUrl
                : null;

    return (
        <section className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-3">
                <div className="h-24 w-24 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                    {displayUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={displayUrl}
                            alt="Profile avatar"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            No photo
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 text-center">
                    This photo will be used on your profile and in matches.
                </p>
            </div>

            <form onSubmit={onUpload} className="flex-1 space-y-3">
                <div>
                    <label
                        htmlFor="avatar"
                        className="mb-1 block text-sm font-medium text-gray-900"
                    >
                        Profile photo
                    </label>
                    <input
                        id="avatar"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={onFileChange}
                        className="block w-full text-sm text-gray-700"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        JPEG, PNG, or WebP. Maximum 5MB.
                    </p>
                </div>

                {error && (
                    <div className="rounded-lg bg-red-50 p-2 text-sm text-red-700">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="rounded-lg bg-green-50 p-2 text-sm text-green-700">
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !file}
                    className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? "Uploading..." : "Upload photo"}
                </button>
            </form>
        </section>
    );
}
