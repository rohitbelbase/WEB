// app/profile/edit/SkillsForm.tsx
"use client";

import * as React from "react";

type Skill = {
    id: string;
    name: string;
};

export default function SkillsForm() {
    const [skills, setSkills] = React.useState<Skill[]>([]);
    const [selected, setSelected] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [msg, setMsg] = React.useState<string | null>(null);
    const [err, setErr] = React.useState<string | null>(null);

    // Load skills + user's selected skills
    React.useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const [allRes, mineRes] = await Promise.all([
                    fetch("/api/skills"),
                    fetch("/api/profile/skills"),
                ]);

                if (!allRes.ok || !mineRes.ok) {
                    throw new Error("Failed to load skills");
                }

                const allData = await allRes.json();
                const mineData = await mineRes.json();

                if (cancelled) return;

                setSkills(allData.skills || []);
                setSelected(mineData.selected || []);
            } catch {
                setErr("Failed to load skills.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    function toggleSkill(id: string) {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }

    async function saveSkills() {
        setSaving(true);
        setMsg(null);
        setErr(null);

        try {
            const res = await fetch("/api/profile/skills", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skillIds: selected }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Save failed");
            }

            setMsg("Skills saved.");
        } catch (e: any) {
            setErr(e.message || "Save failed.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <section className="mt-10">
                <p className="text-sm text-gray-600">Loading skills...</p>
            </section>
        );
    }

    if (err) {
        return (
            <section className="mt-10">
                <div className="rounded bg-red-50 p-3 text-sm text-red-700">{err}</div>
            </section>
        );
    }

    return (
        <section className="mt-10">
            <h2 className="text-xl font-semibold">Skills</h2>
            <p className="mt-1 text-sm text-gray-600">Tick the skills you can help with.</p>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {skills.map((skill) => (
                    <label
                        key={skill.id}
                        className="flex items-center gap-2 rounded-lg border border-gray-200 p-2"
                    >
                        <input
                            type="checkbox"
                            checked={selected.includes(skill.id)}
                            onChange={() => toggleSkill(skill.id)}
                        />
                        <span className="text-sm">{skill.name}</span>
                    </label>
                ))}
            </div>

            {msg && (
                <div className="mt-3 rounded bg-green-50 p-2 text-sm text-green-700">
                    {msg}
                </div>
            )}
            {err && (
                <div className="mt-3 rounded bg-red-50 p-2 text-sm text-red-700">
                    {err}
                </div>
            )}

            <button
                onClick={saveSkills}
                disabled={saving}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
                {saving ? "Saving..." : "Save skills"}
            </button>
        </section>
    );
}
