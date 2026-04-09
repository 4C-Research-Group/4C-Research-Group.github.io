"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Row = {
  id: string;
  page_slug: string;
  section_key: string;
  body: string;
};

const PRESET_PAGES = [
  "home",
  "about",
  "research",
  "team",
  "contact",
  "join-4c-lab",
  "collaborate",
] as const;

function groupByPage(rows: Row[]): { slug: string; items: Row[] }[] {
  const map = new Map<string, Row[]>();
  for (const r of rows) {
    const list = map.get(r.page_slug) ?? [];
    list.push(r);
    map.set(r.page_slug, list);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([slug, items]) => ({
      slug,
      items: items.sort((x, y) => x.section_key.localeCompare(y.section_key)),
    }));
}

export default function AdminContentPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [newPage, setNewPage] = useState("home");
  const [newKey, setNewKey] = useState("");
  const [newBody, setNewBody] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("page_content")
        .select("id,page_slug,section_key,body")
        .order("page_slug")
        .order("section_key");
      if (error) throw new Error(error.message);
      setRows((data as Row[]) ?? []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
      setRows([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveRow(id: string, body: string) {
    setSaving(id);
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("page_content")
        .update({ body, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw new Error(error.message);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(null);
    }
  }

  async function addSection() {
    if (!newPage.trim() || !newKey.trim()) {
      setErr("Page and section key are required.");
      return;
    }
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("page_content").insert({
        page_slug: newPage.trim(),
        section_key: newKey.trim(),
        body: newBody,
        updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.message);
      setNewKey("");
      setNewBody("");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Add failed");
    }
  }

  async function deleteRow(id: string) {
    if (!confirm("Delete this section?")) return;
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("page_content").delete().eq("id", id);
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
        Loading content…
      </div>
    );
  }

  const grouped = groupByPage(rows);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Page content</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Text snippets keyed by page and section. For the landing page, use{" "}
          <Link href="/admin/homepage/" className="text-brand hover:underline">
            Homepage
          </Link>{" "}
          (full layout + images). This table is for smaller keyed snippets when
          you wire pages to it.
        </p>
      </div>

      {rows.length === 0 && (
        <p className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
          No entries yet. Add a section below. Example: page{" "}
          <code className="rounded bg-muted px-1">home</code>, section{" "}
          <code className="rounded bg-muted px-1">announcement</code>.
        </p>
      )}

      {err && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {err}
        </div>
      )}

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold">New section</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-xs font-medium text-muted-foreground">
            Page slug
            <select
              className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
              value={newPage}
              onChange={(e) => setNewPage(e.target.value)}
            >
              {PRESET_PAGES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-muted-foreground">
            Section key
            <input
              className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="hero_subtitle"
            />
          </label>
        </div>
        <label className="mt-3 block text-xs font-medium text-muted-foreground">
          Body
          <textarea
            className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
            rows={4}
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
          />
        </label>
        <button
          type="button"
          onClick={() => void addSection()}
          className="mt-3 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-brand-deep"
        >
          Add section
        </button>
      </section>

      <div className="space-y-6">
        {grouped.map((group) => (
          <section key={group.slug} className="space-y-3">
            <h2 className="text-sm font-semibold capitalize text-foreground">
              {group.slug}
            </h2>
            <div className="space-y-4">
              {group.items.map((r) => (
                <RowEditor
                  key={r.id}
                  row={r}
                  saving={saving === r.id}
                  onSave={(body) => void saveRow(r.id, body)}
                  onDelete={() => void deleteRow(r.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function RowEditor({
  row,
  saving,
  onSave,
  onDelete,
}: {
  row: Row;
  saving: boolean;
  onSave: (body: string) => void;
  onDelete: () => void;
}) {
  const [body, setBody] = useState(row.body);
  useEffect(() => {
    setBody(row.body);
  }, [row.id, row.body]);
  return (
    <div className="rounded-xl border border-border/80 bg-background/80 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <code className="text-xs text-muted-foreground">
          {row.page_slug} / {row.section_key}
        </code>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={saving || body === row.body}
            onClick={() => onSave(body)}
            className="rounded-full bg-foreground/90 px-3 py-1 text-xs font-medium text-background hover:bg-foreground disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-full border border-destructive/40 px-3 py-1 text-xs text-destructive hover:bg-destructive/10"
          >
            Delete
          </button>
        </div>
      </div>
      <textarea
        className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
        rows={5}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
    </div>
  );
}
