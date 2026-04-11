/**
 * Merge stored gallery JSON onto built-in defaults.
 * `events` and `mosaic` are normalized to fixed lengths for layout.
 */

import {
  GALLERY_EVENTS_COUNT,
  GALLERY_MOSAIC_COUNT,
  galleryPageDefaults,
  type GalleryEventItem,
  type GalleryMosaicItem,
  type GalleryPagePayload,
  type GallerySectionLabels,
} from "./gallery-page";

function clone<T>(v: T): T {
  return structuredClone(v);
}

export const GALLERY_DEFAULTS: GalleryPagePayload = clone(galleryPageDefaults);

function mergeSection(
  def: GallerySectionLabels,
  raw: unknown,
): GallerySectionLabels {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...def };
  }
  const r = raw as Record<string, unknown>;
  return {
    eyebrow: typeof r.eyebrow === "string" ? r.eyebrow : def.eyebrow,
    title: typeof r.title === "string" ? r.title : def.title,
    description:
      typeof r.description === "string" ? r.description : def.description,
  };
}

function mergeEvents(raw: unknown): GalleryEventItem[] {
  const def = GALLERY_DEFAULTS.events;
  const out: GalleryEventItem[] = [];
  const arr = Array.isArray(raw) ? raw : [];
  for (let i = 0; i < GALLERY_EVENTS_COUNT; i++) {
    const base = def[Math.min(i, def.length - 1)]!;
    const r = arr[i];
    if (!r || typeof r !== "object" || Array.isArray(r)) {
      out.push(clone(base));
      continue;
    }
    const o = r as Record<string, unknown>;
    out.push({
      src: typeof o.src === "string" ? o.src : base.src,
      alt: typeof o.alt === "string" ? o.alt : base.alt,
      title: typeof o.title === "string" ? o.title : base.title,
    });
  }
  return out;
}

function mergeMosaic(raw: unknown): GalleryMosaicItem[] {
  const def = GALLERY_DEFAULTS.mosaic;
  const out: GalleryMosaicItem[] = [];
  const arr = Array.isArray(raw) ? raw : [];
  for (let i = 0; i < GALLERY_MOSAIC_COUNT; i++) {
    const base = def[Math.min(i, def.length - 1)]!;
    const r = arr[i];
    if (!r || typeof r !== "object" || Array.isArray(r)) {
      out.push(clone(base));
      continue;
    }
    const o = r as Record<string, unknown>;
    out.push({
      src: typeof o.src === "string" ? o.src : base.src,
      alt: typeof o.alt === "string" ? o.alt : base.alt,
    });
  }
  return out;
}

export function mergeGalleryPagePayload(raw: unknown): GalleryPagePayload {
  const d = clone(GALLERY_DEFAULTS);
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return d;
  }
  const r = raw as Record<string, unknown>;

  return {
    pageTitle:
      typeof r.pageTitle === "string" ? r.pageTitle : d.pageTitle,
    intro: typeof r.intro === "string" ? r.intro : d.intro,
    spotlight: mergeSection(d.spotlight, r.spotlight),
    featured: (() => {
      const f = r.featured;
      if (!f || typeof f !== "object" || Array.isArray(f)) return { ...d.featured };
      const o = f as Record<string, unknown>;
      return {
        src: typeof o.src === "string" ? o.src : d.featured.src,
        alt: typeof o.alt === "string" ? o.alt : d.featured.alt,
        caption:
          typeof o.caption === "string" ? o.caption : d.featured.caption,
      };
    })(),
    eventsSection: mergeSection(d.eventsSection, r.eventsSection),
    events: mergeEvents(r.events),
    labSection: mergeSection(d.labSection, r.labSection),
    mosaic: mergeMosaic(r.mosaic),
  };
}
