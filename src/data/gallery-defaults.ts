/**
 * Merge stored gallery page JSON onto built-in defaults (copy only; images are in `gallery_photos`).
 */

import {
  GALLERY_SECTION_IDS,
  galleryPageDefaults,
  type GalleryPagePayload,
  type GallerySectionId,
  type GallerySectionLabels,
  type GallerySectionVisibility,
} from "./gallery-page";

function isGallerySectionId(x: unknown): x is GallerySectionId {
  return (
    x === "spotlight" ||
    x === "events" ||
    x === "lab" ||
    x === "archive"
  );
}

function mergeSectionOrder(
  def: GallerySectionId[],
  raw: unknown,
): GallerySectionId[] {
  if (!Array.isArray(raw)) {
    return [...def];
  }
  const seen = new Set<GallerySectionId>();
  const out: GallerySectionId[] = [];
  for (const x of raw) {
    if (isGallerySectionId(x) && !seen.has(x)) {
      seen.add(x);
      out.push(x);
    }
  }
  for (const id of GALLERY_SECTION_IDS) {
    if (!seen.has(id)) {
      out.push(id);
    }
  }
  return out;
}

function clone<T>(v: T): T {
  return structuredClone(v);
}

export const GALLERY_DEFAULTS: GalleryPagePayload = clone(galleryPageDefaults);

function mergeVisibility(
  def: GallerySectionVisibility,
  raw: unknown,
): GallerySectionVisibility {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...def };
  }
  const r = raw as Record<string, unknown>;
  return {
    spotlight:
      typeof r.spotlight === "boolean" ? r.spotlight : def.spotlight,
    events: typeof r.events === "boolean" ? r.events : def.events,
    lab: typeof r.lab === "boolean" ? r.lab : def.lab,
    archive: typeof r.archive === "boolean" ? r.archive : def.archive,
  };
}

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
    sectionOrder: mergeSectionOrder(d.sectionOrder, r.sectionOrder),
    sectionVisibility: mergeVisibility(d.sectionVisibility, r.sectionVisibility),
    spotlight: mergeSection(d.spotlight, r.spotlight),
    eventsSection: mergeSection(d.eventsSection, r.eventsSection),
    labSection: mergeSection(d.labSection, r.labSection),
    archiveSection: mergeSection(d.archiveSection, r.archiveSection),
  };
}
