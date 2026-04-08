"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Users,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { slugifyTeamMember } from "@/lib/team/slug";

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

type RowEdit = {
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

type NewMemberDraft = {
  slug: string;
  name: string;
  initials: string;
  role_title: string;
  category: "staff" | "student";
  superpower: string;
  photo_file: string;
  is_alumni: boolean;
};

const emptyDraft: NewMemberDraft = {
  slug: "",
  name: "",
  initials: "",
  role_title: "",
  category: "staff",
  superpower: "",
  photo_file: "",
  is_alumni: false,
};

function fromServer(r: MemberRow): RowEdit {
  return {
    slug: r.slug,
    name: r.name,
    initials: r.initials,
    role_title: r.role_title,
    category: r.category === "student" ? "student" : "staff",
    superpower: r.superpower,
    photo_file: r.photo_file,
    is_alumni: r.is_alumni,
    sort_order: r.sort_order,
  };
}

function rowEditsDiffer(a: RowEdit, b: RowEdit): boolean {
  return (
    a.slug !== b.slug ||
    a.name !== b.name ||
    a.initials !== b.initials ||
    a.role_title !== b.role_title ||
    a.category !== b.category ||
    a.superpower !== b.superpower ||
    a.photo_file !== b.photo_file ||
    a.is_alumni !== b.is_alumni ||
    a.sort_order !== b.sort_order
  );
}

export default function AdminTeamPage() {
  const [rows, setRows] = useState<MemberRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [adding, setAdding] = useState(false);
  const [syncEpoch, setSyncEpoch] = useState(0);

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
      setSyncEpoch((e) => e + 1);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load team");
      setRows([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function nextSortOrder(list: MemberRow[]): number {
    if (list.length === 0) return 10;
    return Math.max(...list.map((r) => r.sort_order), 0) + 10;
  }

  async function addMember() {
    const name = draft.name.trim();
    const slug =
      draft.slug.trim() || (name ? slugifyTeamMember(name) : "");
    if (!slug || !name) {
      setErr("Name is required; slug is generated from name if left blank.");
      return;
    }
    setAdding(true);
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const sort_order = rows === null ? 10 : nextSortOrder(rows);
      const { error } = await supabase.from("team_members").insert({
        slug,
        name,
        initials: draft.initials.trim(),
        role_title: draft.role_title.trim(),
        category: draft.category,
        superpower: draft.superpower.trim(),
        photo_file: draft.photo_file.trim(),
        is_alumni: draft.is_alumni,
        sort_order,
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

  const newFormDirty =
    draft.name.trim() !== "" ||
    draft.slug.trim() !== "" ||
    draft.initials.trim() !== "" ||
    draft.role_title.trim() !== "" ||
    draft.superpower.trim() !== "" ||
    draft.photo_file.trim() !== "" ||
    draft.is_alumni;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Manage who appears on the public{" "}
          <span className="text-foreground/90">Team</span> page. Each person is a
          card: edit fields, then <strong className="text-foreground">Save</strong>{" "}
          to publish changes (stored in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            public.team_members
          </code>
          ). Photos must exist under{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            public/team/
          </code>{" "}
          as named files.
        </p>
        <ul className="mt-3 list-inside list-disc text-xs text-muted-foreground">
          <li>Explicit save — nothing is written until you save each card.</li>
          <li>
            <strong className="font-medium text-foreground">Alumni</strong> moves
            them to the alumni section on the site.
          </li>
          <li>
            <strong className="font-medium text-foreground">Sort</strong> controls
            order (lower numbers first).
          </li>
        </ul>
      </div>

      {err && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {err}
        </div>
      )}

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Plus className="h-4 w-4" aria-hidden />
          Add member
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          New entries appear on the site after you save. Slug can be left blank
          to generate from the name.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Name *"
            value={draft.name}
            onChange={(name) => setDraft((d) => ({ ...d, name }))}
          />
          <Field
            label="Slug (optional)"
            value={draft.slug}
            onChange={(slug) => setDraft((d) => ({ ...d, slug }))}
            placeholder="auto from name"
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
          <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
            Category
            <select
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
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
            label="Photo filename"
            value={draft.photo_file}
            onChange={(photo_file) => setDraft((d) => ({ ...d, photo_file }))}
            placeholder="team-2.jpg"
          />
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
              Superpower (short bio line)
              <textarea
                className="min-h-[4rem] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                value={draft.superpower}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, superpower: e.target.value }))
                }
                rows={2}
              />
            </label>
          </div>
          <label className="flex items-center gap-2.5 pt-1 text-sm text-foreground sm:col-span-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              checked={draft.is_alumni}
              onChange={(e) =>
                setDraft((d) => ({ ...d, is_alumni: e.target.checked }))
              }
            />
            Alumni (show under Lab Alumni on the site)
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
          <button
            type="button"
            disabled={adding || !draft.name.trim()}
            onClick={() => void addMember()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-brand-deep disabled:opacity-50"
          >
            <Save className="h-4 w-4" aria-hidden />
            {adding ? "Saving…" : "Save new member"}
          </button>
          {newFormDirty && (
            <button
              type="button"
              onClick={() => setDraft(emptyDraft)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted/60"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Clear form
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
            <Users className="h-5 w-5 text-brand" aria-hidden />
            People ({rows.length})
          </h2>
          <p className="text-xs text-muted-foreground">
            One card per person · scroll to edit
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No team members yet. Add someone above or run{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                seed_team_members.sql
              </code>{" "}
              in Supabase to import the legacy list.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {rows.map((r) => (
              <TeamMemberCard
                key={r.id}
                serverRow={r}
                syncEpoch={syncEpoch}
                onSave={(patch) => updateRow(r.id, patch)}
                onDelete={() => removeRow(r.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TeamMemberCard({
  serverRow,
  syncEpoch,
  onSave,
  onDelete,
}: {
  serverRow: MemberRow;
  syncEpoch: number;
  onSave: (patch: Partial<MemberRow>) => Promise<void>;
  onDelete: () => void;
}) {
  const [local, setLocal] = useState<RowEdit>(() => fromServer(serverRow));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocal(fromServer(serverRow));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset after successful load
  }, [syncEpoch]);

  const baseline = useMemo(() => fromServer(serverRow), [serverRow]);
  const dirty = rowEditsDiffer(local, baseline);

  async function handleSave() {
    const slugInput = local.slug.trim();
    const slugFinal = slugifyTeamMember(slugInput) || slugInput;
    if (!slugFinal) {
      return;
    }
    if (slugFinal !== serverRow.slug) {
      const ok = confirm(
        `Change slug from "${serverRow.slug}" to "${slugFinal}"? Links that used the old slug may break.`,
      );
      if (!ok) return;
    }
    setSaving(true);
    try {
      await onSave({
        slug: slugFinal,
        name: local.name.trim(),
        initials: local.initials.trim(),
        role_title: local.role_title.trim(),
        category: local.category,
        superpower: local.superpower.trim(),
        photo_file: local.photo_file.trim(),
        is_alumni: local.is_alumni,
        sort_order: local.sort_order,
      });
    } finally {
      setSaving(false);
    }
  }

  const displayName =
    local.name.trim() || serverRow.name || "Untitled member";

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border/70 bg-muted/20 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:px-5">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-foreground">
            {displayName}
          </h3>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            {local.slug || "—"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {dirty && (
            <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
              Unsaved
            </span>
          )}
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
              local.category === "student"
                ? "bg-brand/15 text-brand"
                : "bg-foreground/10 text-foreground/80"
            }`}
          >
            {local.category === "student" ? "Trainee" : "Staff"}
          </span>
          {local.is_alumni && (
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Alumni
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:p-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="Slug"
          value={local.slug}
          onChange={(slug) => setLocal((s) => ({ ...s, slug }))}
        />
        <Field
          label="Name"
          value={local.name}
          onChange={(name) => setLocal((s) => ({ ...s, name }))}
        />
        <Field
          label="Initials"
          value={local.initials}
          onChange={(initials) => setLocal((s) => ({ ...s, initials }))}
        />
        <Field
          label="Role / title"
          value={local.role_title}
          onChange={(role_title) => setLocal((s) => ({ ...s, role_title }))}
        />
        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          Category
          <select
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
            value={local.category}
            onChange={(e) =>
              setLocal((s) => ({
                ...s,
                category: e.target.value as "staff" | "student",
              }))
            }
          >
            <option value="staff">Staff</option>
            <option value="student">Student / trainee</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
          Sort order
          <input
            type="number"
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
            value={local.sort_order}
            onChange={(e) =>
              setLocal((s) => ({
                ...s,
                sort_order: Number(e.target.value) || 0,
              }))
            }
          />
        </label>
        <Field
          label="Photo filename"
          value={local.photo_file}
          onChange={(photo_file) => setLocal((s) => ({ ...s, photo_file }))}
            placeholder="team-2.jpg"
        />
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
            Superpower
            <textarea
              className="min-h-[4.5rem] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
              value={local.superpower}
              onChange={(e) =>
                setLocal((s) => ({ ...s, superpower: e.target.value }))
              }
              rows={3}
            />
          </label>
        </div>
        <label className="flex items-center gap-2.5 text-sm text-foreground sm:col-span-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input"
            checked={local.is_alumni}
            onChange={(e) =>
              setLocal((s) => ({ ...s, is_alumni: e.target.checked }))
            }
          />
          Alumni (Lab Alumni section)
        </label>
      </div>

      <div className="flex flex-col gap-3 border-t border-border/70 bg-muted/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-xs text-muted-foreground">
          {dirty ? (
            <>
              <span className="font-medium text-amber-700 dark:text-amber-300">
                You have unsaved changes.
              </span>{" "}
              Save to update the live site.
            </>
          ) : (
            <span className="text-muted-foreground/90">Saved — matches database.</span>
          )}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={() => void handleSave()}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-brand-deep disabled:opacity-40"
          >
            <Save className="h-4 w-4 shrink-0" aria-hidden />
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={() => setLocal(fromServer(serverRow))}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/60 disabled:opacity-40"
          >
            <RotateCcw className="h-4 w-4 shrink-0" aria-hidden />
            Revert
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => onDelete()}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-destructive/40 bg-background px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
            Delete
          </button>
        </div>
      </div>
    </article>
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
    <label className="flex flex-col gap-1.5 text-xs font-medium text-muted-foreground">
      {label}
      <input
        className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
