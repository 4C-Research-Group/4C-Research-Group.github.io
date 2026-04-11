"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { AdminImagePickButton } from "@/components/admin/AdminImagePickButton";
import type { GalleryPagePayload, GallerySectionLabels } from "@/data/gallery-page";
import { GALLERY_EVENTS_COUNT, GALLERY_MOSAIC_COUNT } from "@/data/gallery-page";
import { mergeGalleryPagePayload } from "@/data/gallery-defaults";
import {
  fetchGalleryPageRowForAdmin,
  getGalleryPageDefaultsForAdmin,
  saveGalleryPagePayload,
} from "@/lib/gallery/supabase-gallery-page";
import { uploadHomepageImage } from "@/lib/homepage/homepage-image-storage";

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
    spotlight: sec(d.spotlight),
    featured: {
      src: t(d.featured.src),
      alt: t(d.featured.alt),
      caption: t(d.featured.caption),
    },
    eventsSection: sec(d.eventsSection),
    events: d.events.map((e) => ({
      src: t(e.src),
      alt: t(e.alt),
      title: t(e.title),
    })),
    labSection: sec(d.labSection),
    mosaic: d.mosaic.map((m) => ({
      src: t(m.src),
      alt: t(m.alt),
    })),
  });
}

export default function GalleryPageEditor() {
  const [draft, setDraft] = useState<GalleryPagePayload | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
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

  async function onUpload(key: string, files: FileList | null) {
    const f = files?.[0];
    if (!f || !draft) return;
    setUploading(key);
    setErr(null);
    try {
      const url = await uploadHomepageImage(f, "gallery");
      setDraft((d) => {
        if (!d) return d;
        if (key === "featured") {
          return { ...d, featured: { ...d.featured, src: url } };
        }
        if (key.startsWith("event-")) {
          const i = Number(key.slice(6));
          if (Number.isNaN(i)) return d;
          const events = [...d.events];
          if (events[i]) events[i] = { ...events[i]!, src: url };
          return { ...d, events };
        }
        if (key.startsWith("mosaic-")) {
          const i = Number(key.slice(7));
          if (Number.isNaN(i)) return d;
          const mosaic = [...d.mosaic];
          if (mosaic[i]) mosaic[i] = { ...mosaic[i]!, src: url };
          return { ...d, mosaic };
        }
        return d;
      });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

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
            Edits the public{" "}
            <Link href="/gallery/" className="font-medium text-brand hover:underline">
              /gallery/
            </Link>{" "}
            page. Run{" "}
            <code className="rounded bg-muted px-1 text-xs">supabase/gallery_page_settings.sql</code>{" "}
            in Supabase if saves fail. Images upload to the same bucket as the homepage (
            <code className="rounded bg-muted px-1 text-xs">homepage-images/gallery/</code>
            ).
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
            Reset to defaults
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-brand-deep disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
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

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Page header</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Page title (H1)"
            value={draft.pageTitle}
            onChange={(pageTitle) => setDraft({ ...draft, pageTitle })}
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
        label="Spotlight (above featured layout)"
        s={draft.spotlight}
        onChange={(spotlight) => setDraft({ ...draft, spotlight })}
      />

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Featured image</h2>
        <Field
          label="Image URL"
          value={draft.featured.src}
          onChange={(src) => setDraft({ ...draft, featured: { ...draft.featured, src } })}
          placeholder="https://… or /images/…"
        />
        <div className="flex flex-wrap items-center gap-2">
          <AdminImagePickButton
            busy={uploading === "featured"}
            variant="muted"
            onPick={(fl) => void onUpload("featured", fl)}
          >
            Upload to storage
          </AdminImagePickButton>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Alt text"
            value={draft.featured.alt}
            onChange={(alt) => setDraft({ ...draft, featured: { ...draft.featured, alt } })}
          />
          <Field
            label="Caption (overlay label)"
            value={draft.featured.caption}
            onChange={(caption) =>
              setDraft({ ...draft, featured: { ...draft.featured, caption } })
            }
          />
        </div>
      </section>

      <SectionFields
        label="Events & workshops (section header)"
        s={draft.eventsSection}
        onChange={(eventsSection) => setDraft({ ...draft, eventsSection })}
      />

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">
          Event tiles ({GALLERY_EVENTS_COUNT} — bento layout)
        </h2>
        <div className="space-y-6">
          {draft.events.map((ev, i) => (
            <div
              key={i}
              className="space-y-2 rounded-xl border border-border/70 bg-muted/15 p-4"
            >
              <p className="text-xs font-semibold text-muted-foreground">Event {i + 1}</p>
              <Field
                label="Image URL"
                value={ev.src}
                onChange={(src) => {
                  const events = [...draft.events];
                  events[i] = { ...events[i]!, src };
                  setDraft({ ...draft, events });
                }}
              />
              <AdminImagePickButton
                busy={uploading === `event-${i}`}
                variant="muted"
                onPick={(fl) => void onUpload(`event-${i}`, fl)}
              >
                Upload
              </AdminImagePickButton>
              <div className="grid gap-3 md:grid-cols-2">
                <Field
                  label="Card title"
                  value={ev.title}
                  onChange={(title) => {
                    const events = [...draft.events];
                    events[i] = { ...events[i]!, title };
                    setDraft({ ...draft, events });
                  }}
                />
                <Field
                  label="Alt text"
                  value={ev.alt}
                  onChange={(alt) => {
                    const events = [...draft.events];
                    events[i] = { ...events[i]!, alt };
                    setDraft({ ...draft, events });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <SectionFields
        label="Lab & field (section header)"
        s={draft.labSection}
        onChange={(labSection) => setDraft({ ...draft, labSection })}
      />

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">
          Mosaic ({GALLERY_MOSAIC_COUNT} images)
        </h2>
        <p className="text-xs text-muted-foreground">
          The first two images appear as vertical strips beside the featured image on large
          screens; images 3–12 fill the Lab & field bento grid below.
        </p>
        <div className="space-y-6">
          {draft.mosaic.map((m, i) => (
            <div
              key={i}
              className="space-y-2 rounded-xl border border-border/70 bg-muted/15 p-4"
            >
              <p className="text-xs font-semibold text-muted-foreground">
                Image {i + 1}
                {i < 2 ? " (side rail)" : " (bento)"}
              </p>
              <Field
                label="Image URL"
                value={m.src}
                onChange={(src) => {
                  const mosaic = [...draft.mosaic];
                  mosaic[i] = { ...mosaic[i]!, src };
                  setDraft({ ...draft, mosaic });
                }}
              />
              <AdminImagePickButton
                busy={uploading === `mosaic-${i}`}
                variant="muted"
                onPick={(fl) => void onUpload(`mosaic-${i}`, fl)}
              >
                Upload
              </AdminImagePickButton>
              <Field
                label="Alt text"
                value={m.alt}
                onChange={(alt) => {
                  const mosaic = [...draft.mosaic];
                  mosaic[i] = { ...mosaic[i]!, alt };
                  setDraft({ ...draft, mosaic });
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
