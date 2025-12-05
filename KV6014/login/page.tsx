"use client";
/*
  LOGIN PAGE - ASCII safe
  -----------------------
  This page:
   - validates email and password
   - uses signIn("credentials") from NextAuth
   - redirects to /profile/edit on success
*/

import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";

export default function LoginPage() {
    const router = useRouter();

    // Controlled form state
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    // UX flags and errors
    const [loading, setLoading] = React.useState(false);
    const [formError, setFormError] = React.useState<string | null>(null);
    const [emailError, setEmailError] = React.useState<string | null>(null);
    const [passwordError, setPasswordError] = React.useState<string | null>(null);

    function getFriendlyMessage(serverMessage: string): string {
        const lower = serverMessage.toLowerCase();

        // Lockout messages
        if (lower.includes("locked")) {
            return serverMessage; // already a friendly message from authOptions
        }

        // Verification required
        if (lower.includes("verify your account")) {
            return (
                "Please verify your account before signing in.\n" +
                "Go to the verification page and complete verification."
            );
        }

        // Invalid credentials
        if (lower.includes("invalid email or password")) {
            return "Incorrect email or password. Please try again.";
        }

        // Fallback
        return "Unable to sign in. Please try again.";
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);
        setEmailError(null);
        setPasswordError(null);

        // Basic client validation
        let hasError = false;
        if (!email.includes("@")) {
            setEmailError("Enter a valid email.");
            hasError = true;
        }
        if (password.length < 6) {
            setPasswordError("Minimum 6 characters.");
            hasError = true;
        }
        if (hasError) return;

        setLoading(true);
        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                const msg = getFriendlyMessage(res.error);
                setFormError(msg);
            } else {
                router.push("/profile/edit");
            }
        } catch {
            setFormError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-dvh bg-gray-50 px-4 pb-20">
            <div className="mx-auto mt-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold">Sign in</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Please sign in with your registered email and password.
                </p>

                <form onSubmit={onSubmit} className="mt-6" noValidate>
                    <FormInput
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="you@example.com"
                        required
                        hint="Use the same email you used to sign up."
                        error={emailError}
                    />

                    <FormInput
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        required
                        hint="At least 6 characters."
                        error={passwordError}
                    />

                    {formError ? (
                        <div
                            role="alert"
                            className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 whitespace-pre-line"
                        >
                            {formError}
                            {formError.toLowerCase().includes("verify your account") && (
                                <div className="mt-2">
                                    <a
                                        href="/verify"
                                        className="underline underline-offset-2 text-red-700"
                                    >
                                        Go to verification page
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : null}

                    <div className="mt-4 flex items-center justify-between">
                        <Button type="submit" loading={loading} aria-label="Sign in">
                            Continue
                        </Button>
                        <a
                            className="text-sm text-gray-600 underline underline-offset-2"
                            href="/signup"
                        >
                            Create account
                        </a>
                    </div>
                </form>

                <div className="mt-6 rounded-lg bg-gray-50 p-3 text-xs text-gray-700">
                    <p className="font-semibold">Notes</p>
                    <ul className="mt-2 list-disc pl-5">
                        <li>Uses signIn("credentials") from NextAuth.</li>
                        <li>Shows friendly messages for lockout and verification.</li>
                        <li>Redirects to /profile/edit on success.</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
