// app/profile/edit/page.tsx
import { getCurrentUser } from "@/lib/getCurrentUser";
import ProfileForm from "./ProfileForm";
import SkillsForm from "./SkillsForm";
import AvatarForm from "./AvatarForm";
import DeleteAccount from "./DeleteAccount";
import ChangePasswordForm from "./ChangePasswordForm";
import SignOutButton from "@/components/ui/SignOutButton";

export default async function ProfileEditPage() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <main className="min-h-dvh grid place-items-center p-8">
                <p className="text-sm text-gray-600">
                    You must be signed in to edit your profile.
                </p>
            </main>
        );
    }

    const isVerified = !!user.verified;

    return (
        <main className="min-h-dvh bg-gray-50 px-4 py-10">
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                {/* Header */}
                <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Edit profile</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Signed in as {user.email}
                        </p>

                        <p className="mt-1 text-sm">
                            Verification status:{" "}
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

                    <div className="self-start">
                        <SignOutButton />
                    </div>
                </div>

                {/* Avatar Upload */}
                <AvatarForm initialAvatarUrl={(user as any).avatarUrl ?? null} />

                {/* Basic Info Section */}
                <section className="mt-8">
                    <h2 className="text-lg font-semibold">Basic information</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        This service uses video calls only. Let others know a bit about you
                        and when you are usually free.
                    </p>

                    <ProfileForm
                        initialName={user.name || ""}
                        initialBio={user.bio || ""}
                        initialAge={user.age ?? null}
                        initialAddress={user.address || ""}
                        initialMorning={user.availableMorning ?? false}
                        initialAfternoon={user.availableAfternoon ?? false}
                        initialEvening={user.availableEvening ?? false}
                    />
                </section>

                {/* Skills */}
                <section className="mt-10">
                    <SkillsForm />
                </section>

                {/* Change password */}
                <ChangePasswordForm />

                {/* Danger zone */}
                <DeleteAccount />
            </div>
        </main>
    );
}
