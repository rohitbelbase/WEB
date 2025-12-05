"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:opacity-90"
    >
      Sign out
    </button>
  );
}
