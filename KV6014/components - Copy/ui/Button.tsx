"use client";
/*
  Button (ASCII-safe)
  - Has loading state and aria-busy for accessibility.
*/
import * as React from "react";

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean };

export default function Button({ loading, children, className = "", ...rest }: BtnProps) {
    return (
        <button
            {...rest}
            aria-busy={loading || undefined}
            disabled={loading || rest.disabled}
            className={
                "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition " +
                "bg-black text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 disabled:opacity-50 " +
                className
            }
        >
            {loading ? "Please wait..." : children}
        </button>
    );
}
