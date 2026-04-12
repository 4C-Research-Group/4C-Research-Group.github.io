"use client";

import { GALLERY_CURATED_COUNT } from "@/data/gallery-page";
import type { GalleryPhoto } from "@/lib/gallery/supabase-gallery-photos";

function slotLabel(index: number): string {
  if (index === 0) return "Featured photo (large hero)";
  if (index === 1) return "Side image (top)";
  if (index === 2) return "Side image (bottom)";
  if (index >= 3 && index <= 8) {
    return `Events & workshops · tile ${index - 2} of 6`;
  }
  return `Lab & field · tile ${index - 8} of 10`;
}

function photoOptionLabel(p: GalleryPhoto): string {
  const t = (p.title || p.alt || "Untitled").trim();
  const short = t.length > 56 ? `${t.slice(0, 54)}…` : t;
  return `${short} · ${p.id.slice(0, 8)}…`;
}

export default function GalleryCuratedSlotsPanel({
  photos,
  slotPhotoIds,
  onChange,
  onReloadPhotos,
}: {
  photos: GalleryPhoto[];
  slotPhotoIds: string[];
  onChange: (next: string[]) => void;
  onReloadPhotos: () => void | Promise<void>;
}) {
  const n = GALLERY_CURATED_COUNT;
  const slots =
    slotPhotoIds.length === n
      ? [...slotPhotoIds]
      : [...slotPhotoIds, ...Array(n - slotPhotoIds.length).fill("")].slice(0, n);

  function setSlot(i: number, photoId: string) {
    const next = [...slots];
    next[i] = photoId;
    onChange(next);
  }

  function clearAll() {
    onChange(Array.from({ length: n }, () => ""));
  }

  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Featured, events &amp; lab — which photos?
          </h2>
          <p className="mt-1 max-w-3xl text-xs text-muted-foreground">
            Pick a photo for each slot, or leave <span className="font-medium text-foreground">Auto</span>{" "}
            to use the order from the <strong className="text-foreground">Photos</strong> list above
            (first unused photo fills each empty slot). Click{" "}
            <strong className="text-foreground">Save copy</strong> below to store these picks.
            Duplicate IDs in two slots: the first slot wins.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void onReloadPhotos()}
            className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-muted/60"
          >
            Reload photo list
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-muted/60"
          >
            Clear all picks (use auto order)
          </button>
        </div>
      </div>

      {photos.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Add photos in the panel above first; then you can assign them here.
        </p>
      ) : (
        <div className="space-y-6">
          <fieldset className="space-y-3 rounded-xl border border-border/80 bg-muted/10 p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Spotlight (featured + side strip)
            </legend>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <label key={i} className="block text-xs font-medium text-muted-foreground">
                  {slotLabel(i)}
                  <select
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm text-foreground"
                    value={slots[i] ?? ""}
                    onChange={(e) => setSlot(i, e.target.value)}
                  >
                    <option value="">Auto (from photo list order)</option>
                    {photos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {photoOptionLabel(p)}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3 rounded-xl border border-border/80 bg-muted/10 p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Events &amp; workshops (six tiles)
            </legend>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, j) => j + 3).map((i) => (
                <label key={i} className="block text-xs font-medium text-muted-foreground">
                  {slotLabel(i)}
                  <select
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm text-foreground"
                    value={slots[i] ?? ""}
                    onChange={(e) => setSlot(i, e.target.value)}
                  >
                    <option value="">Auto (from photo list order)</option>
                    {photos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {photoOptionLabel(p)}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3 rounded-xl border border-border/80 bg-muted/10 p-4">
            <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Lab &amp; field (ten tiles)
            </legend>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 10 }, (_, j) => j + 9).map((i) => (
                <label key={i} className="block text-xs font-medium text-muted-foreground">
                  {slotLabel(i)}
                  <select
                    className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm text-foreground"
                    value={slots[i] ?? ""}
                    onChange={(e) => setSlot(i, e.target.value)}
                  >
                    <option value="">Auto (from photo list order)</option>
                    {photos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {photoOptionLabel(p)}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      )}
    </section>
  );
}
