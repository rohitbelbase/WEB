// app/profile/page.tsx
import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProfileViewPage() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <main className="min-h-dvh grid place-items-center p-8">
                <p className="text-sm text-gray-600">
                    You must be signed in to view your profile.
                </p>
            </main>
        );
    }

    const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
            skills: {
                include: {
                    skill: true,
                },
            },
        },
    });

    if (!fullUser) {
        return (
            <main className="min-h-dvh grid place-items-center p-8">
                <p className="text-sm text-gray-600">Profile not found.</p>
            </main>
        );
    }

    const isVerified = !!fullUser.verified;

    const availability: string[] = [];
    if (fullUser.availableMorning) availability.push("Morning");
    if (fullUser.availableAfternoon) availability.push("Afternoon");
    if (fullUser.availableEvening) availability.push("Evening");

    const skillNames =
        fullUser.skills?.map((us) => us.skill?.name).filter(Boolean) ?? [];

    return (
        <main className="min-h-dvh bg-gray-50 px-4 py-10">
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-200">
                            {fullUser.avatarUrl ? (
                                <img
                                    src={fullUser.avatarUrl}
                                    alt="Profile avatar"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
                                    No image
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold">{fullUser.name}</h1>
                            <p className="mt-1 text-sm text-gray-600">{fullUser.email}</p>
                            <p className="mt-1 text-sm">
                                Status:{" "}
                                <span
                                    className={
                                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
                                        (isVerified
                                            ? "bg-green-50 text-green-700"
                                            : "bg-red-50 text-red-700")
                                    }
                                >
                                    {isVerified ? "Verified" : "Not verified"}
                                </span>
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/profile/edit"
                        className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
                    >
                        Edit profile
                    </Link>
                </div>

                {/* Basic info */}
                <section className="mt-6 space-y-4">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">About you</h2>
                        <p className="mt-1 text-sm text-gray-800 whitespace-pre-line">
                            {fullUser.bio && fullUser.bio.trim()
                                ? fullUser.bio
                                : "No bio added yet."}
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Age</h2>
                            <p className="mt-1 text-sm text-gray-800">
                                {fullUser.age ? fullUser.age : "Not set"}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                                Area / address
                            </h2>
                            <p className="mt-1 text-sm text-gray-800">
                                {fullUser.address && fullUser.address.trim()
                                    ? fullUser.address
                                    : "Not set"}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Availability */}
                <section className="mt-8">
                    <h2 className="text-sm font-semibold text-gray-900">
                        Video call availability
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Times of day when you are usually free for an online session.
                    </p>

                    {availability.length === 0 ? (
                        <p className="mt-2 text-sm text-gray-800">
                            No availability set. Edit your profile to choose when you are
                            usually free.
                        </p>
                    ) : (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {availability.map((slot) => (
                                <span
                                    key={slot}
                                    className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800"
                                >
                                    {slot}
                                </span>
                            ))}
                        </div>
                    )}
                </section>

                {/* Skills */}
                <section className="mt-8">
                    <h2 className="text-sm font-semibold text-gray-900">Skills</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Skills you can help someone with.
                    </p>

                    {skillNames.length === 0 ? (
                        <p className="mt-2 text-sm text-gray-800">
                            No skills selected yet. Edit your profile to add skills.
                        </p>
                    ) : (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {skillNames.map((name) => (
                                <span
                                    key={name}
                                    className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                                >
                                    {name}
                                </span>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
