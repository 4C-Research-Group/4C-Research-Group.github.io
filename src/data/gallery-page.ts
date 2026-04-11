/** Public + admin JSON shape for `/gallery` copy (stored in `gallery_page_settings.payload`). */

export type GallerySectionLabels = {
  eyebrow: string;
  title: string;
  description: string;
};

/** Fixed set of gallery blocks; `sectionOrder` permutes their vertical order on the page. */
export type GallerySectionId = "spotlight" | "events" | "lab" | "archive";

export const GALLERY_SECTION_IDS: readonly GallerySectionId[] = [
  "spotlight",
  "events",
  "lab",
  "archive",
];

export const GALLERY_SECTION_ORDER_LABELS: Record<GallerySectionId, string> = {
  spotlight: "Spotlight & hero layout",
  events: "Events & workshops",
  lab: "Lab & field",
  archive: "Archive / all photos",
};

/** Toggle each layout block on the public gallery (photos still use fixed sort slots). */
export type GallerySectionVisibility = {
  /** Hero + two side images + spotlight heading. */
  spotlight: boolean;
  /** Six event tiles + section heading. */
  events: boolean;
  /** Lab bento grid + section heading. */
  lab: boolean;
  /** Paginated archive + section heading. */
  archive: boolean;
};

/**
 * All images live in `gallery_photos`, ordered by `sort_order`.
 * Positions 0–18 are the curated “bento” area; 19+ appear in the paginated archive.
 *
 * 0: featured (large) · 1–2: side rail · 3–8: events bento (6) · 9–18: lab bento (10)
 */
export const GALLERY_CURATED_COUNT = 19;

export const GALLERY_ARCHIVE_PAGE_SIZE = 36;

export type GalleryPagePayload = {
  pageTitle: string;
  intro: string;
  /** Label on the hero image (first photo in sort order). */
  featuredCaption: string;
  /** Top-to-bottom order of the four blocks (visibility still applies per block). */
  sectionOrder: GallerySectionId[];
  sectionVisibility: GallerySectionVisibility;
  spotlight: GallerySectionLabels;
  eventsSection: GallerySectionLabels;
  labSection: GallerySectionLabels;
  archiveSection: GallerySectionLabels;
};

const spotlight: GallerySectionLabels = {
  eyebrow: "Spotlight",
  title: "Featured photo",
  description:
    "One strong image at the top sets tone: lab milestone, keynote moment, or a human story from critical care research.",
};

const eventsSection: GallerySectionLabels = {
  eyebrow: "On the calendar",
  title: "Events & workshops",
  description: "Symposia, KM sessions, and partner-facing gatherings.",
};

const labSection: GallerySectionLabels = {
  eyebrow: "More moments",
  title: "Lab & field",
  description: "Day-to-day lab life, posters, collaboration, and candid team moments.",
};

const archiveSection: GallerySectionLabels = {
  eyebrow: "Library",
  title: "All photos",
  description: "Browse the full gallery—new images can be added anytime from the admin.",
};

const sectionVisibility: GallerySectionVisibility = {
  spotlight: true,
  events: true,
  lab: true,
  archive: true,
};

const sectionOrder: GallerySectionId[] = [...GALLERY_SECTION_IDS];

export const galleryPageDefaults: GalleryPagePayload = {
  pageTitle: "Gallery",
  intro:
    "Visual stories from our research, knowledge mobilization, and the people who make pediatric critical care science happen.",
  featuredCaption: "Featured",
  sectionOrder,
  sectionVisibility,
  spotlight,
  eventsSection,
  labSection,
  archiveSection,
};
