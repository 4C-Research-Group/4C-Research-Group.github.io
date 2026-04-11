/**
 * Merge stored gallery page JSON onto built-in defaults (copy only; images are in `gallery_photos`).
 */

import {
  GALLERY_SECTION_IDS,
  galleryPageDefaults,
  defaultGalleryCustomSection,
  galleryCustomOrderKey,
  isGallerySectionId,
  parseGalleryCustomOrderKey,
  type GalleryCustomSection,
  type GalleryPagePayload,
  type GallerySectionLabels,
  type GallerySectionVisibility,
} from "./gallery-page";

function clone<T>(v: T): T {
  return structuredClone(v);
}

export const GALLERY_DEFAULTS: GalleryPagePayload = clone(galleryPageDefaults);

function mergeCustomSectionRow(
  def: GalleryCustomSection,
  raw: Record<string, unknown>,
): GalleryCustomSection {
  const id =
    typeof raw.id === "string" && raw.id.trim() ? raw.id.trim() : def.id;
  return {
    id,
    enabled: typeof raw.enabled === "boolean" ? raw.enabled : def.enabled,
    eyebrow: typeof raw.eyebrow === "string" ? raw.eyebrow : def.eyebrow,
    title: typeof raw.title === "string" ? raw.title : def.title,
    description:
      typeof raw.description === "string" ? raw.description : def.description,
    body: typeof raw.body === "string" ? raw.body : def.body,
  };
}

function mergeCustomSections(
  def: GalleryCustomSection[],
  raw: unknown,
): GalleryCustomSection[] {
  if (!Array.isArray(raw)) {
    return def.map((s) => ({ ...s }));
  }
  const out: GalleryCustomSection[] = [];
  for (const x of raw) {
    if (!x || typeof x !== "object" || Array.isArray(x)) continue;
    const r = x as Record<string, unknown>;
    const id = typeof r.id === "string" && r.id.trim() ? r.id.trim() : "";
    if (!id) continue;
    const defRow = def.find((s) => s.id === id);
    out.push(
      mergeCustomSectionRow(defRow ?? defaultGalleryCustomSection(id), r),
    );
  }
  return out;
}

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

function mergeSectionOrder(
  def: string[],
  raw: unknown,
  customIds: Set<string>,
): string[] {
  const builtinSeen = new Set<string>();
  const customKeySeen = new Set<string>();
  const out: string[] = [];

  const consider = (k: string) => {
    if (isGallerySectionId(k)) {
      if (!builtinSeen.has(k)) {
        builtinSeen.add(k);
        out.push(k);
      }
      return;
    }
    const cid = parseGalleryCustomOrderKey(k);
    if (cid && customIds.has(cid) && !customKeySeen.has(k)) {
      customKeySeen.add(k);
      out.push(k);
    }
  };

  if (Array.isArray(raw)) {
    for (const x of raw) {
      if (typeof x === "string") consider(x);
    }
  } else {
    for (const k of def) consider(k);
  }

  for (const id of GALLERY_SECTION_IDS) {
    if (!builtinSeen.has(id)) {
      out.push(id);
    }
  }
  return out;
}

function appendMissingCustomOrderKeys(
  order: string[],
  sections: GalleryCustomSection[],
): string[] {
  const seen = new Set(order);
  const next = [...order];
  for (const s of sections) {
    const k = galleryCustomOrderKey(s.id);
    if (!seen.has(k)) {
      next.push(k);
      seen.add(k);
    }
  }
  return next;
}

function stripOrphanCustomKeys(
  order: string[],
  customIds: Set<string>,
): string[] {
  return order.filter((k) => {
    const cid = parseGalleryCustomOrderKey(k);
    if (cid) return customIds.has(cid);
    return true;
  });
}

export function mergeGalleryPagePayload(raw: unknown): GalleryPagePayload {
  const d = clone(GALLERY_DEFAULTS);
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return d;
  }
  const r = raw as Record<string, unknown>;

  const customSections = mergeCustomSections(d.customSections, r.customSections);
  const customIds = new Set(customSections.map((s) => s.id));

  let sectionOrder = mergeSectionOrder(
    d.sectionOrder,
    r.sectionOrder,
    customIds,
  );
  sectionOrder = stripOrphanCustomKeys(sectionOrder, customIds);
  sectionOrder = appendMissingCustomOrderKeys(sectionOrder, customSections);

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
    sectionOrder,
    customSections,
    sectionVisibility: mergeVisibility(d.sectionVisibility, r.sectionVisibility),
    spotlight: mergeSection(d.spotlight, r.spotlight),
    eventsSection: mergeSection(d.eventsSection, r.eventsSection),
    labSection: mergeSection(d.labSection, r.labSection),
    archiveSection: mergeSection(d.archiveSection, r.archiveSection),
  };
}
