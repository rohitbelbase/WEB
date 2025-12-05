"use client";
/*
  FormInput (ASCII-safe)
  - Labeled input with optional hint and error text.
  - Accessible: ties hint/error via aria-describedby and sets aria-invalid.
*/
import * as React from "react";

export default function FormInput({
    id, label, type = "text", value, onChange, placeholder, required, hint, error,
}: {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    required?: boolean;
    hint?: string;
    error?: string | null;
}) {
    const hintId = hint ? id + "-hint" : undefined;
    const errId = error ? id + "-error" : undefined;

    return (
        <div className="mb-4">
            <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-900">{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                aria-describedby={[hintId, errId].filter(Boolean).join(" ") || undefined}
                aria-invalid={!!error || undefined}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/30"
            />
            {hint ? <p id={hintId} className="mt-1 text-xs text-gray-600">{hint}</p> : null}
            {error ? <p id={errId} className="mt-1 text-xs text-red-600">{error}</p> : null}
        </div>
    );
}

