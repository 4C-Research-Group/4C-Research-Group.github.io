/**
 * Merge stored gallery page JSON onto built-in defaults (copy only; images are in `gallery_photos`).
 */

import {
  galleryPageDefaults,
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
    featuredCaption:
      typeof r.featuredCaption === "string"
        ? r.featuredCaption
        : typeof (r.featured as Record<string, unknown> | undefined)?.caption ===
            "string"
          ? String((r.featured as Record<string, unknown>).caption)
          : d.featuredCaption,
    spotlight: mergeSection(d.spotlight, r.spotlight),
    eventsSection: mergeSection(d.eventsSection, r.eventsSection),
    labSection: mergeSection(d.labSection, r.labSection),
    archiveSection: mergeSection(d.archiveSection, r.archiveSection),
  };
}
