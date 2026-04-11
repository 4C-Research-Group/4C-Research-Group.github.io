"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Loader2, Save } from "lucide-react";
import GalleryPhotosPanel from "@/components/admin/GalleryPhotosPanel";
import {
  GALLERY_SECTION_IDS,
  GALLERY_SECTION_ORDER_LABELS,
  type GalleryPagePayload,
  type GallerySectionId,
  type GallerySectionLabels,
} from "@/data/gallery-page";
import { mergeGalleryPagePayload } from "@/data/gallery-defaults";
import {
  fetchGalleryPageRowForAdmin,
  getGalleryPageDefaultsForAdmin,
  saveGalleryPagePayload,
} from "@/lib/gallery/supabase-gallery-page";

function moveSectionOrder(
  order: GallerySectionId[],
  from: number,
  to: number,
): GallerySectionId[] {
  if (to < 0 || to >= order.length || from === to) {
    return order;
  }
  const next = [...order];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
}

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
    sectionOrder: d.sectionOrder,
    sectionVisibility: d.sectionVisibility,
    spotlight: sec(d.spotlight),
    eventsSection: sec(d.eventsSection),
    labSection: sec(d.labSection),
    archiveSection: sec(d.archiveSection),
  });
}

function VisibilityToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-lg border border-border/80 bg-background px-3 py-2.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/40">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
      </span>
    </label>
  );
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

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Visible sections</h2>
        <p className="text-xs text-muted-foreground">
          Hide blocks on the public page without removing photos or copy. Photo order (slots) is
          unchanged—reorder in the photo list when you are ready. Use{" "}
          <span className="font-medium text-foreground">Section order</span> below to change top-to-bottom
          placement.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <VisibilityToggle
            label="Spotlight & hero layout"
            description="Large hero, two side images, and spotlight heading."
            checked={draft.sectionVisibility.spotlight}
            onChange={(spotlight) =>
              setDraft({
                ...draft,
                sectionVisibility: { ...draft.sectionVisibility, spotlight },
              })
            }
          />
          <VisibilityToggle
            label="Events & workshops"
            description="Six event tiles and that section heading."
            checked={draft.sectionVisibility.events}
            onChange={(events) =>
              setDraft({
                ...draft,
                sectionVisibility: { ...draft.sectionVisibility, events },
              })
            }
          />
          <VisibilityToggle
            label="Lab & field"
            description="Bento grid and section heading."
            checked={draft.sectionVisibility.lab}
            onChange={(lab) =>
              setDraft({
                ...draft,
                sectionVisibility: { ...draft.sectionVisibility, lab },
              })
            }
          />
          <VisibilityToggle
            label="Archive / all photos"
            description="Paginated grid and section heading."
            checked={draft.sectionVisibility.archive}
            onChange={(archive) =>
              setDraft({
                ...draft,
                sectionVisibility: { ...draft.sectionVisibility, archive },
              })
            }
          />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground">Section order</h2>
          <button
            type="button"
            onClick={() =>
              setDraft({ ...draft, sectionOrder: [...GALLERY_SECTION_IDS] })
            }
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/60"
          >
            Reset to default order
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Public page order (top → bottom). Sections that are hidden or have no images are skipped;
          they still keep their place in this list for when you show them again.
        </p>
        <ol className="space-y-2">
          {draft.sectionOrder.map((id, index) => (
            <li
              key={id}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-border/70 bg-muted/10 px-3 py-2.5"
            >
              <span className="w-7 shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 text-sm font-medium text-foreground">
                {GALLERY_SECTION_ORDER_LABELS[id]}
              </span>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() =>
                    setDraft({
                      ...draft,
                      sectionOrder: moveSectionOrder(draft.sectionOrder, index, index - 1),
                    })
                  }
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted disabled:opacity-40"
                  aria-label="Move section up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={index >= draft.sectionOrder.length - 1}
                  onClick={() =>
                    setDraft({
                      ...draft,
                      sectionOrder: moveSectionOrder(draft.sectionOrder, index, index + 1),
                    })
                  }
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted disabled:opacity-40"
                  aria-label="Move section down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ol>
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
