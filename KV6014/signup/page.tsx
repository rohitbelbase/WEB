// app/signup/page.tsx
"use client";
/*
  SIGN-UP PAGE
  ------------
  - Validates: name, email format, password length, confirmation.
  - Calls POST /api/auth/signup.
  - On success: shows success message, then redirects to /verify.
*/

import * as React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";

function validateEmail(v: string) {
    return v.includes("@");
}
function validatePassword(v: string) {
    return v.length >= 6;
}

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirm, setConfirm] = React.useState("");

    const [loading, setLoading] = React.useState(false);
    const [formError, setFormError] = React.useState<string | null>(null);
    const [formSuccess, setFormSuccess] = React.useState<string | null>(null);

    const [nameError, setNameError] = React.useState<string | null>(null);
    const [emailError, setEmailError] = React.useState<string | null>(null);
    const [passwordError, setPasswordError] = React.useState<string | null>(null);
    const [confirmError, setConfirmError] = React.useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);
        setNameError(null);
        setEmailError(null);
        setPasswordError(null);
        setConfirmError(null);

        let hasError = false;
        if (!name.trim()) {
            setNameError("Enter your name.");
            hasError = true;
        }
        if (!validateEmail(email)) {
            setEmailError("Enter a valid email.");
            hasError = true;
        }
        if (!validatePassword(password)) {
            setPasswordError("Minimum 6 characters.");
            hasError = true;
        }
        if (confirm !== password) {
            setConfirmError("Passwords do not match.");
            hasError = true;
        }
        if (hasError) return;

        setLoading(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    password,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setFormError(data.error || "Could not sign up.");
            } else {
                setFormSuccess(
                    "Account created. Please verify your account on the next page."
                );
                // Short delay so user sees the success message
                setTimeout(() => {
                    router.push("/verify");
                }, 800);
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
                <h1 className="text-2xl font-semibold">Create an account</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Create your account, then we will take you to the verification step.
                </p>

                <form onSubmit={onSubmit} className="mt-6" noValidate>
                    <FormInput
                        id="name"
                        label="Full name"
                        value={name}
                        onChange={setName}
                        required
                        hint="Your display name."
                        error={nameError}
                    />
                    <FormInput
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={setEmail}
                        required
                        hint="Use a valid email."
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
                    <FormInput
                        id="confirm"
                        label="Confirm password"
                        type="password"
                        value={confirm}
                        onChange={setConfirm}
                        required
                        hint="Must match password."
                        error={confirmError}
                    />

                    {formError ? (
                        <div
                            role="alert"
                            className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                        >
                            {formError}
                        </div>
                    ) : null}

                    {formSuccess ? (
                        <div
                            role="status"
                            className="mb-3 rounded-lg bg-green-50 p-3 text-sm text-green-700"
                        >
                            {formSuccess}
                        </div>
                    ) : null}

                    <div className="mt-4 flex items-center justify-between">
                        <Button type="submit" loading={loading} aria-label="Create account">
                            Create account
                        </Button>
                        <a
                            className="text-sm text-gray-600 underline underline-offset-2"
                            href="/login"
                        >
                            Have an account? Sign in
                        </a>
                    </div>
                </form>
            </div>
        </main>
    );
}
