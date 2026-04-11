/** Public + admin JSON shape for `/gallery` (stored in `gallery_page_settings.payload`). */

export type GallerySectionLabels = {
  eyebrow: string;
  title: string;
  description: string;
};

export type GalleryFeatured = {
  src: string;
  alt: string;
  caption: string;
};

export type GalleryEventItem = {
  src: string;
  alt: string;
  title: string;
};

export type GalleryMosaicItem = {
  src: string;
  alt: string;
};

export type GalleryPagePayload = {
  pageTitle: string;
  intro: string;
  spotlight: GallerySectionLabels;
  featured: GalleryFeatured;
  eventsSection: GallerySectionLabels;
  events: GalleryEventItem[];
  labSection: GallerySectionLabels;
  /** First two appear beside the featured image; remaining tiles fill the Lab & field bento. */
  mosaic: GalleryMosaicItem[];
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

const defaultEvents: GalleryEventItem[] = [
  {
    src: "https://picsum.photos/seed/4c-event-01/900/700",
    alt: "Research symposium",
    title: "Research symposium",
  },
  {
    src: "https://picsum.photos/seed/4c-event-02/900/700",
    alt: "Team retreat",
    title: "Team retreat",
  },
  {
    src: "https://picsum.photos/seed/4c-event-03/900/700",
    alt: "Knowledge mobilization training",
    title: "KM training",
  },
  {
    src: "https://picsum.photos/seed/4c-event-04/900/700",
    alt: "Community talk",
    title: "Community talk",
  },
  {
    src: "https://picsum.photos/seed/4c-event-05/900/700",
    alt: "Collaboration day",
    title: "Collaboration day",
  },
  {
    src: "https://picsum.photos/seed/4c-event-06/900/700",
    alt: "Annual showcase",
    title: "Annual showcase",
  },
];

const defaultMosaic: GalleryMosaicItem[] = [
  { src: "https://picsum.photos/seed/4c-misc-a/700/900", alt: "Lab life" },
  { src: "https://picsum.photos/seed/4c-misc-b/800/600", alt: "Research setting" },
  { src: "https://picsum.photos/seed/4c-misc-c/700/700", alt: "Team moment" },
  { src: "https://picsum.photos/seed/4c-misc-d/900/650", alt: "Clinical collaboration" },
  { src: "https://picsum.photos/seed/4c-misc-e/750/950", alt: "Poster or presentation" },
  { src: "https://picsum.photos/seed/4c-misc-f/820/620", alt: "Workspace detail" },
  { src: "https://picsum.photos/seed/4c-misc-g/760/840", alt: "Group discussion" },
  { src: "https://picsum.photos/seed/4c-misc-h/880/660", alt: "Field or site visit" },
  { src: "https://picsum.photos/seed/4c-misc-i/720/920", alt: "Celebration or milestone" },
  { src: "https://picsum.photos/seed/4c-misc-j/800/800", alt: "Equipment or methods" },
  { src: "https://picsum.photos/seed/4c-misc-k/840/640", alt: "Conference or travel" },
  { src: "https://picsum.photos/seed/4c-misc-l/780/880", alt: "Candid lab moment" },
];

export const GALLERY_EVENTS_COUNT = 6;
export const GALLERY_MOSAIC_COUNT = 12;

export const galleryPageDefaults: GalleryPagePayload = {
  pageTitle: "Gallery",
  intro:
    "Visual stories from our research, knowledge mobilization, and the people who make pediatric critical care science happen.",
  spotlight,
  featured: {
    src: "https://picsum.photos/seed/4c-gallery-featured/1920/1080",
    alt: "Featured image from the 4C Research Group",
    caption: "Featured",
  },
  eventsSection,
  events: defaultEvents,
  labSection,
  mosaic: defaultMosaic,
};
