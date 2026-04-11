"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import GalleryPhotosPanel from "@/components/admin/GalleryPhotosPanel";
import type { GalleryPagePayload, GallerySectionLabels } from "@/data/gallery-page";
import { mergeGalleryPagePayload } from "@/data/gallery-defaults";
import {
  fetchGalleryPageRowForAdmin,
  getGalleryPageDefaultsForAdmin,
  saveGalleryPagePayload,
} from "@/lib/gallery/supabase-gallery-page";

function Field({
  label,
  value,
  onChange,
  multiline,
  rows,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block text-xs font-medium text-muted-foreground">
      {label}
      {multiline ? (
        <textarea
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows ?? 3}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

function SectionFields({
  label,
  s,
  onChange,
}: {
  label: string;
  s: GallerySectionLabels;
  onChange: (next: GallerySectionLabels) => void;
}) {
  return (
    <fieldset className="space-y-3 rounded-xl border border-border/80 bg-card/40 p-4">
      <legend className="px-1 text-sm font-semibold text-foreground">{label}</legend>
      <Field
        label="Eyebrow"
        value={s.eyebrow}
        onChange={(eyebrow) => onChange({ ...s, eyebrow })}
      />
      <Field label="Title" value={s.title} onChange={(title) => onChange({ ...s, title })} />
      <Field
        label="Description"
        value={s.description}
        onChange={(description) => onChange({ ...s, description })}
        multiline
        rows={3}
      />
    </fieldset>
  );
}

function normalizeDraft(d: GalleryPagePayload): GalleryPagePayload {
  const t = (x: string) => x.trim();
  const sec = (s: GallerySectionLabels): GallerySectionLabels => ({
    eyebrow: t(s.eyebrow),
    title: t(s.title),
    description: t(s.description),
  });
  return mergeGalleryPagePayload({
    pageTitle: t(d.pageTitle),
    intro: t(d.intro),
    featuredCaption: t(d.featuredCaption),
    spotlight: sec(d.spotlight),
    eventsSection: sec(d.eventsSection),
    labSection: sec(d.labSection),
    archiveSection: sec(d.archiveSection),
  });
}

export default function GalleryPageEditor() {
  const [draft, setDraft] = useState<GalleryPagePayload | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const { payload, updatedAt: u } = await fetchGalleryPageRowForAdmin();
      setDraft(payload);
      setUpdatedAt(u);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
      setDraft(getGalleryPageDefaultsForAdmin());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!draft) return;
    setSaving(true);
    setErr(null);
    setOk(null);
    try {
      const merged = normalizeDraft(draft);
      await saveGalleryPagePayload(merged);
      setDraft(merged);
      setOk("Saved.");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !draft) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Gallery page</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Copy below is stored in{" "}
            <code className="rounded bg-muted px-1 text-xs">gallery_page_settings</code>. Photos live
            in <code className="rounded bg-muted px-1 text-xs">gallery_photos</code> (unlimited
            count). Public page:{" "}
            <Link href="/gallery/" className="font-medium text-brand hover:underline">
              /gallery/
            </Link>
            . Run{" "}
            <code className="rounded bg-muted px-1 text-xs">supabase/gallery_page_settings.sql</code>{" "}
            and{" "}
            <code className="rounded bg-muted px-1 text-xs">supabase/gallery_photos.sql</code> in
            Supabase if needed. Uploads use{" "}
            <code className="rounded bg-muted px-1 text-xs">homepage-images/gallery/</code>.
          </p>
          {updatedAt ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Last updated: {new Date(updatedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => setDraft(getGalleryPageDefaultsForAdmin())}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/60 disabled:opacity-50"
          >
            Reset copy to defaults
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-brand-deep disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save copy
          </button>
        </div>
      </header>

      {err && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {err}
        </div>
      )}
      {ok && (
        <div className="rounded-lg border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-brand">
          {ok}
        </div>
      )}

      <GalleryPhotosPanel />

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Page header</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Page title (H1)"
            value={draft.pageTitle}
            onChange={(pageTitle) => setDraft({ ...draft, pageTitle })}
          />
          <Field
            label="Hero label (first photo in list)"
            value={draft.featuredCaption}
            onChange={(featuredCaption) => setDraft({ ...draft, featuredCaption })}
            placeholder="e.g. Featured"
          />
        </div>
        <Field
          label="Intro paragraph"
          value={draft.intro}
          onChange={(intro) => setDraft({ ...draft, intro })}
          multiline
          rows={3}
        />
      </section>

      <SectionFields
        label="Spotlight (above hero layout)"
        s={draft.spotlight}
        onChange={(spotlight) => setDraft({ ...draft, spotlight })}
      />

      <SectionFields
        label="Events & workshops (section header)"
        s={draft.eventsSection}
        onChange={(eventsSection) => setDraft({ ...draft, eventsSection })}
      />

      <SectionFields
        label="Lab & field (section header)"
        s={draft.labSection}
        onChange={(labSection) => setDraft({ ...draft, labSection })}
      />

      <SectionFields
        label="Archive / full gallery (section header)"
        s={draft.archiveSection}
        onChange={(archiveSection) => setDraft({ ...draft, archiveSection })}
      />
    </div>
  );
}
