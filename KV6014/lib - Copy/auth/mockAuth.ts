"use client";
/*
  mockSignIn (ASCII-safe)
  - Fake "network" login for Week 1.
  - Replace with Firebase/Auth.js/custom API later.
*/
export async function mockSignIn(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!email.includes("@")) return resolve({ ok: false, error: "Please use a valid email address." });
            if (password.length < 6) return resolve({ ok: false, error: "Password must be at least 6 characters." });
            resolve({ ok: true });
        }, 400);
    });
}
