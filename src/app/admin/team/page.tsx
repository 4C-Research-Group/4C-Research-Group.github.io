"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type MemberRow = {
  id: string;
  slug: string;
  name: string;
  initials: string;
  role_title: string;
  category: string;
  superpower: string;
  photo_file: string;
  is_alumni: boolean;
  sort_order: number;
};

type Draft = {
  slug: string;
  name: string;
  initials: string;
  role_title: string;
  category: "staff" | "student";
  superpower: string;
  photo_file: string;
  is_alumni: boolean;
  sort_order: number;
};

const emptyDraft: Draft = {
  slug: "",
  name: "",
  initials: "",
  role_title: "",
  category: "staff",
  superpower: "",
  photo_file: "",
  is_alumni: false,
  sort_order: 0,
};

export default function AdminTeamPage() {
  const [rows, setRows] = useState<MemberRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      setRows((data as MemberRow[]) ?? []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load team");
      setRows([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addMember() {
    if (!draft.slug.trim() || !draft.name.trim()) {
      setErr("Slug and name are required.");
      return;
    }
    setAdding(true);
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("team_members").insert({
        slug: draft.slug.trim(),
        name: draft.name.trim(),
        initials: draft.initials.trim(),
        role_title: draft.role_title.trim(),
        category: draft.category,
        superpower: draft.superpower.trim(),
        photo_file: draft.photo_file.trim(),
        is_alumni: draft.is_alumni,
        sort_order: draft.sort_order,
        updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.message);
      setDraft(emptyDraft);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Insert failed");
    } finally {
      setAdding(false);
    }
  }

  async function updateRow(id: string, patch: Partial<MemberRow>) {
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("team_members")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw new Error(error.message);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function removeRow(id: string) {
    if (!confirm("Remove this person from the database?")) return;
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw new Error(error.message);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Delete failed");
    }
  }

  if (rows === null) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
        Loading team…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Photos: place files under{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            public/team/
          </code>{" "}
          and set the filename (e.g. photo.jpg).
        </p>
      </div>

      {err && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {err}
        </div>
      )}

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Plus className="h-4 w-4" aria-hidden />
          Add member
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Slug (URL id)"
            value={draft.slug}
            onChange={(slug) => setDraft((d) => ({ ...d, slug }))}
            placeholder="jane-doe"
          />
          <Field
            label="Name"
            value={draft.name}
            onChange={(name) => setDraft((d) => ({ ...d, name }))}
          />
          <Field
            label="Initials"
            value={draft.initials}
            onChange={(initials) => setDraft((d) => ({ ...d, initials }))}
          />
          <Field
            label="Role / title"
            value={draft.role_title}
            onChange={(role_title) => setDraft((d) => ({ ...d, role_title }))}
          />
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Category
            <select
              className="rounded-lg border border-input bg-background px-2 py-2 text-sm text-foreground"
              value={draft.category}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  category: e.target.value as "staff" | "student",
                }))
              }
            >
              <option value="staff">Staff</option>
              <option value="student">Student / trainee</option>
            </select>
          </label>
          <Field
            label="Photo file"
            value={draft.photo_file}
            onChange={(photo_file) => setDraft((d) => ({ ...d, photo_file }))}
            placeholder="team-2.jpg"
          />
          <Field
            label="Superpower"
            value={draft.superpower}
            onChange={(superpower) => setDraft((d) => ({ ...d, superpower }))}
          />
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Sort order
            <input
              type="number"
              className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
              value={draft.sort_order}
              onChange={(e) =>
                setDraft((d) => ({ ...d, sort_order: Number(e.target.value) }))
              }
            />
          </label>
          <label className="flex items-center gap-2 pt-6 text-sm text-foreground">
            <input
              type="checkbox"
              checked={draft.is_alumni}
              onChange={(e) =>
                setDraft((d) => ({ ...d, is_alumni: e.target.checked }))
              }
            />
            Alumni (former member)
          </label>
        </div>
        <button
          type="button"
          disabled={adding}
          onClick={() => void addMember()}
          className="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-brand-deep disabled:opacity-50"
        >
          {adding ? "Saving…" : "Add to team"}
        </button>
      </section>

      <section className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Cat.</th>
              <th className="px-3 py-2">Photo</th>
              <th className="px-3 py-2">Alum</th>
              <th className="px-3 py-2">Sort</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border/70">
                <td className="px-3 py-2">
                  <input
                    className="w-full min-w-[8rem] rounded border border-transparent bg-transparent px-1 py-0.5 text-sm hover:border-input"
                    defaultValue={r.name}
                    onBlur={(e) => {
                      if (e.target.value !== r.name)
                        void updateRow(r.id, { name: e.target.value });
                    }}
                  />
                  <div className="text-xs text-muted-foreground">{r.slug}</div>
                </td>
                <td className="px-3 py-2">
                  <input
                    className="w-full min-w-[8rem] rounded border border-transparent px-1 py-0.5 text-sm hover:border-input"
                    defaultValue={r.role_title}
                    onBlur={(e) => {
                      if (e.target.value !== r.role_title)
                        void updateRow(r.id, { role_title: e.target.value });
                    }}
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    className="rounded border border-input bg-background px-1 py-1 text-xs"
                    defaultValue={r.category}
                    onChange={(e) =>
                      void updateRow(r.id, { category: e.target.value })
                    }
                  >
                    <option value="staff">staff</option>
                    <option value="student">student</option>
                  </select>
                </td>
                <td className="px-3 py-2">
                  <input
                    className="w-24 rounded border border-transparent px-1 text-xs hover:border-input"
                    defaultValue={r.photo_file}
                    onBlur={(e) => {
                      if (e.target.value !== r.photo_file)
                        void updateRow(r.id, { photo_file: e.target.value });
                    }}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    defaultChecked={r.is_alumni}
                    onChange={(e) =>
                      void updateRow(r.id, { is_alumni: e.target.checked })
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    className="w-14 rounded border border-input px-1 py-0.5 text-xs"
                    defaultValue={r.sort_order}
                    onBlur={(e) =>
                      void updateRow(r.id, {
                        sort_order: Number(e.target.value),
                      })
                    }
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => void removeRow(r.id)}
                    className="inline-flex rounded-lg p-1.5 text-destructive hover:bg-destructive/10"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">
            No rows yet. Add members here, or they will fall back to the static
            file until the table has data.
          </p>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
      {label}
      <input
        className="rounded-lg border border-input bg-background px-2 py-2 text-sm text-foreground"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
