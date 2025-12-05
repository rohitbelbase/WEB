// app/profile/edit/ProfileForm.tsx
"use client";
/*
  Profile form for updating:
  - name
  - bio
  - age
  - address
  - video call availability (morning / afternoon / evening)
*/

import * as React from "react";

type ProfileFormProps = {
    initialName: string;
    initialBio: string;
    initialAge: number | null;
    initialAddress: string;
    initialMorning: boolean;
    initialAfternoon: boolean;
    initialEvening: boolean;
};

export default function ProfileForm(props: ProfileFormProps) {
    const [name, setName] = React.useState(props.initialName);
    const [bio, setBio] = React.useState(props.initialBio || "");
    const [age, setAge] = React.useState<string>(
        props.initialAge ? String(props.initialAge) : ""
    );
    const [address, setAddress] = React.useState(props.initialAddress || "");
    const [morning, setMorning] = React.useState(props.initialMorning);
    const [afternoon, setAfternoon] = React.useState(props.initialAfternoon);
    const [evening, setEvening] = React.useState(props.initialEvening);

    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!name.trim()) {
            setError("Name is required.");
            return;
        }

        let ageNumber: number | null = null;
        if (age.trim()) {
            const parsed = parseInt(age.trim(), 10);
            if (Number.isNaN(parsed) || parsed <= 0 || parsed >= 130) {
                setError("Age must be between 1 and 129.");
                return;
            }
            ageNumber = parsed;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    bio: bio.trim(),
                    age: ageNumber,
                    address: address.trim(),
                    availableMorning: morning,
                    availableAfternoon: afternoon,
                    availableEvening: evening,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(data.error || "Failed to save.");
            } else {
                setMessage("Profile updated.");
            }
        } catch {
            setError("Network error.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="mt-4 max-w-xl space-y-5" noValidate>
            {/* Name */}
            <div>
                <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium text-gray-900"
                >
                    Name
                </label>
                <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30"
                />
            </div>

            {/* Bio */}
            <div>
                <label
                    htmlFor="bio"
                    className="mb-1 block text-sm font-medium text-gray-900"
                >
                    About you
                </label>
                <textarea
                    id="bio"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30"
                />
                <p className="mt-1 text-xs text-gray-500">
                    Share a short summary of your experience or what you can help with.
                </p>
            </div>

            {/* Age and address */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="age"
                        className="mb-1 block text-sm font-medium text-gray-900"
                    >
                        Age
                    </label>
                    <input
                        id="age"
                        type="number"
                        min={1}
                        max={129}
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30"
                    />
                </div>

                <div>
                    <label
                        htmlFor="address"
                        className="mb-1 block text-sm font-medium text-gray-900"
                    >
                        Area or address
                    </label>
                    <input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        For example: city, town, or part of the city.
                    </p>
                </div>
            </div>

            {/* Video call availability */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                    Video call availability
                </h3>
                <p className="mt-1 text-xs text-gray-600">
                    When are you usually free for an online session?
                </p>

                <div className="mt-3 space-y-2 text-sm text-gray-800">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={morning}
                            onChange={(e) => setMorning(e.target.checked)}
                        />
                        <span>Morning</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={afternoon}
                            onChange={(e) => setAfternoon(e.target.checked)}
                        />
                        <span>Afternoon</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={evening}
                            onChange={(e) => setEvening(e.target.checked)}
                        />
                        <span>Evening</span>
                    </label>
                </div>
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
                className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save changes"}
            </button>
        </form>
    );
}
