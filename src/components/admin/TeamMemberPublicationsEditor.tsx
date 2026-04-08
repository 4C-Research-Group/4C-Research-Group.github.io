"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  TEAM_PUBLICATION_STATUSES,
  publicationStatusLabel,
  type TeamPublicationStatus,
} from "@/lib/team/publication-status";

type PubRow = {
  id: string;
  team_member_id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  url: string;
  notes: string;
  status: TeamPublicationStatus;
  sort_order: number;
};

type PubEdit = {
  title: string;
  authors: string;
  venue: string;
  year: string;
  url: string;
  notes: string;
  status: TeamPublicationStatus;
  sort_order: number;
};

function fromRow(r: PubRow): PubEdit {
  return {
    title: r.title,
    authors: r.authors,
    venue: r.venue,
    year: r.year,
    url: r.url,
    notes: r.notes,
    status: TEAM_PUBLICATION_STATUSES.includes(r.status as TeamPublicationStatus)
      ? (r.status as TeamPublicationStatus)
      : "other",
    sort_order: r.sort_order,
  };
}

function editDiffers(a: PubEdit, b: PubRow): boolean {
  return (
    a.title !== b.title ||
    a.authors !== b.authors ||
    a.venue !== b.venue ||
    a.year !== b.year ||
    a.url !== b.url ||
    a.notes !== b.notes ||
    a.status !== b.status ||
    a.sort_order !== b.sort_order
  );
}

export default function TeamMemberPublicationsEditor({
  memberId,
  memberName,
}: {
  memberId: string;
  memberName: string;
}) {
  const [rows, setRows] = useState<PubRow[] | null>(null);
  const [localById, setLocalById] = useState<Record<string, PubEdit>>({});
  const [err, setErr] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [sync, setSync] = useState(0);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("team_member_publications")
        .select("*")
        .eq("team_member_id", memberId)
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      const list = (data as PubRow[]) ?? [];
      setRows(list);
      const next: Record<string, PubEdit> = {};
      for (const r of list) next[r.id] = fromRow(r);
      setLocalById(next);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load publications");
      setRows([]);
      setLocalById({});
    }
  }, [memberId]);

  useEffect(() => {
    void load();
  }, [load, sync]);

  const nextSortOrder = useMemo(() => {
    if (!rows || rows.length === 0) return 10;
    return Math.max(...rows.map((r) => r.sort_order), 0) + 10;
  }, [rows]);

  async function addPublication() {
    setAdding(true);
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("team_member_publications").insert({
        team_member_id: memberId,
        title: "New publication",
        authors: "",
        venue: "",
        year: "",
        url: "",
        notes: "",
        status: "in_preparation",
        sort_order: nextSortOrder,
        updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.message);
      setSync((s) => s + 1);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Add failed");
    } finally {
      setAdding(false);
    }
  }

  async function saveRow(id: string) {
    const local = localById[id];
    if (!local) return;
    setSavingId(id);
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("team_member_publications")
        .update({
          title: local.title.trim() || "Untitled",
          authors: local.authors.trim(),
          venue: local.venue.trim(),
          year: local.year.trim(),
          url: local.url.trim(),
          notes: local.notes.trim(),
          status: local.status,
          sort_order: local.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw new Error(error.message);
      setSync((s) => s + 1);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingId(null);
    }
  }

  async function removeRow(id: string) {
    if (!confirm("Remove this publication?")) return;
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("team_member_publications")
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
      setSync((s) => s + 1);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Delete failed");
    }
  }

  if (rows === null) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-brand" />
        Loading publications…
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-muted/10 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BookOpen className="h-4 w-4 text-brand" aria-hidden />
          Publications for {memberName}
        </h3>
        <button
          type="button"
          disabled={adding}
          onClick={() => void addPublication()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-brand-deep disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          {adding ? "Adding…" : "Add publication"}
        </button>
      </div>
      {err && (
        <p className="mb-3 rounded-lg border border-destructive/40 bg-destructive/10 px-2 py-1.5 text-xs text-destructive">
          {err}
        </p>
      )}
      <p className="mb-4 text-xs text-muted-foreground">
        Set title, optional authors / venue / year, link, notes, and workflow
        status. Each row saves independently.
      </p>
      {rows.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No publications yet — use <strong className="text-foreground">Add publication</strong>.
        </p>
      ) : (
        <ul className="space-y-4">
          {rows.map((r) => {
            const local = localById[r.id] ?? fromRow(r);
            const dirty = editDiffers(local, r);
            return (
              <li
                key={r.id}
                className="rounded-lg border border-border bg-card p-3 shadow-sm"
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  <label className="flex flex-col gap-1 sm:col-span-2 text-[11px] font-medium text-muted-foreground">
                    Title
                    <input
                      className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                      value={local.title}
                      onChange={(e) =>
                        setLocalById((m) => ({
                          ...m,
                          [r.id]: { ...local, title: e.target.value },
                        }))
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[11px] font-medium text-muted-foreground">
                    Authors (optional)
                    <input
                      className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                      value={local.authors}
                      onChange={(e) =>
                        setLocalById((m) => ({
                          ...m,
                          [r.id]: { ...local, authors: e.target.value },
                        }))
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[11px] font-medium text-muted-foreground">
                    Venue / journal
                    <input
                      className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                      value={local.venue}
                      onChange={(e) =>
                        setLocalById((m) => ({
                          ...m,
                          [r.id]: { ...local, venue: e.target.value },
                        }))
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[11px] font-medium text-muted-foreground">
                    Year
                    <input
                      className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                      value={local.year}
                      onChange={(e) =>
                        setLocalById((m) => ({
                          ...m,
                          [r.id]: { ...local, year: e.target.value },
                        }))
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[11px] font-medium text-muted-foreground">
                    URL
                    <input
                      className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                      value={local.url}
                      placeholder="https://…"
                      onChange={(e) =>
                        setLocalById((m) => ({
                          ...m,
                          [r.id]: { ...local, url: e.target.value },
                        }))
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-[11px] font-medium text-muted-foreground">
                    Status
                    <select
                      className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                      value={local.status}
                      onChange={(e) =>
                        setLocalById((m) => ({
                          ...m,
                          [r.id]: {
                            ...local,
                            status: e.target.value as TeamPublicationStatus,
                          },
                        }))
                      }
                    >
                      {TEAM_PUBLICATION_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {publicationStatusLabel[st]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-[11px] font-medium text-muted-foreground">
                    Sort order
                    <input
                      type="number"
                      className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                      value={local.sort_order}
                      onChange={(e) =>
                        setLocalById((m) => ({
                          ...m,
                          [r.id]: {
                            ...local,
                            sort_order: Number(e.target.value) || 0,
                          },
                        }))
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-1 sm:col-span-2 text-[11px] font-medium text-muted-foreground">
                    Notes (optional)
                    <textarea
                      rows={2}
                      className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                      value={local.notes}
                      onChange={(e) =>
                        setLocalById((m) => ({
                          ...m,
                          [r.id]: { ...local, notes: e.target.value },
                        }))
                      }
                    />
                  </label>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={!dirty || savingId === r.id}
                    onClick={() => void saveRow(r.id)}
                    className="inline-flex items-center gap-1 rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-brand-deep disabled:opacity-40"
                  >
                    <Save className="h-3.5 w-3.5" aria-hidden />
                    {savingId === r.id ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    disabled={savingId === r.id}
                    onClick={() => void removeRow(r.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
