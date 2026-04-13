"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { Cormorant_Garamond, Fraunces } from "next/font/google";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Images,
  Sparkles,
  TextQuote,
  X,
  ZoomIn,
} from "lucide-react";
import {
  parseGalleryCustomOrderKey,
  type GalleryCustomSection,
  type GalleryPagePayload,
} from "@/data/gallery-page";
import { GALLERY_ARCHIVE_PAGE_SIZE } from "@/data/gallery-page";
import { resolveGalleryCuratedPhotos } from "@/lib/gallery/gallery-curated-layout";
import type { GalleryPhoto } from "@/lib/gallery/supabase-gallery-photos";

/**
 * Mixkit free license (commercial use): researchers with 3D brain models in a lab —
 * aligned with pediatric neuro / critical care research themes.
 * @see https://mixkit.co/free-stock-video/doctor-and-scientist-look-at-3d-brain-models-in-modern-5644/
 */
const GALLERY_HERO_VIDEO_SRC =
  "https://assets.mixkit.co/videos/5644/5644-720.mp4";

const galleryTitleFont = Fraunces({
  subsets: ["latin"],
  display: "swap",
});

const galleryIntroFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["italic"],
  display: "swap",
});

const LAB_BENTO_CLASS: readonly string[] = [
  "md:col-span-2 md:row-span-2 min-h-[220px] md:min-h-[280px]",
  "md:col-span-2 md:col-start-3 md:row-start-1 min-h-[180px]",
  "md:col-span-2 md:col-start-3 md:row-start-2 min-h-[180px]",
  "md:col-span-1 min-h-[140px]",
  "md:col-span-1 min-h-[140px]",
  "md:col-span-1 min-h-[140px]",
  "md:col-span-1 min-h-[140px]",
  "md:col-span-2 min-h-[160px]",
  "md:col-span-2 min-h-[160px]",
  "md:col-span-4 min-h-[170px]",
];

const EVENT_BENTO_CLASS: readonly string[] = [
  "md:col-span-4 md:row-span-2 md:row-start-1 md:col-start-1 min-h-[240px] md:min-h-0",
  "md:col-span-2 md:row-start-1 md:col-start-5 min-h-[200px]",
  "md:col-span-2 md:row-start-2 md:col-start-5 min-h-[200px]",
  "md:col-span-2 md:row-start-3 md:col-start-1 min-h-[180px]",
  "md:col-span-2 md:row-start-3 md:col-start-3 min-h-[180px]",
  "md:col-span-2 md:row-start-3 md:col-start-5 min-h-[180px]",
];

type LightboxItem = { src: string; alt: string; subtitle?: string };

type SectionAccent = "cognition" | "consciousness" | "care";

const accentBar: Record<SectionAccent, string> = {
  cognition: "bg-cognition",
  consciousness: "bg-consciousness",
  care: "bg-care",
};

function sectionHeading(
  icon: ReactNode,
  eyebrow: string,
  title: string,
  description: string,
  accent: SectionAccent,
) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium text-foreground/80 shadow-sm ring-1 ring-black/[0.03]">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${accentBar[accent]}`}
          aria-hidden
        />
        <span className="text-brand">{icon}</span>
        {eyebrow}
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
    </div>
  );
}

function customSectionHasContent(s: GalleryCustomSection): boolean {
  return (
    s.eyebrow.trim() !== "" ||
    s.title.trim() !== "" ||
    s.description.trim() !== "" ||
    s.body.trim() !== ""
  );
}

/** Same layered halos + motion rhythm as the home hero `HeroLogoGlow` behind the logo. */
function GalleryTitleLogoGlow({
  reduceMotion,
  children,
}: {
  reduceMotion: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative isolate max-w-4xl pb-[0.2em]">
      {!reduceMotion ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-[-1.75rem] inset-y-[-0.85rem] rounded-[2rem] bg-linear-to-br from-brand/25 via-consciousness/20 to-care/20 blur-3xl"
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.45, 0.62, 0.45],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-[-1rem] inset-y-[-0.45rem] rounded-[1.75rem] bg-linear-to-tr from-care/20 via-transparent to-consciousness/15 blur-2xl"
            animate={{
              scale: [1, 1.18, 1],
              opacity: [0.35, 0.55, 0.35],
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />
        </>
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}

export default function GalleryPageView({
  payload,
  photos,
}: {
  payload: GalleryPagePayload;
  photos: GalleryPhoto[];
}) {
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null);
  const [archivePage, setArchivePage] = useState(0);
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const lightboxEase = reduceMotion
    ? { duration: 0.12 }
    : { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const };

  const { hero, sideStrip, events, labGrid, archive } = useMemo(
    () => resolveGalleryCuratedPhotos(photos, payload),
    [photos, payload],
  );

  const archivePages = Math.max(1, Math.ceil(archive.length / GALLERY_ARCHIVE_PAGE_SIZE));
  const archivePageClamped = Math.min(archivePage, archivePages - 1);
  const archiveSlice = useMemo(() => {
    const start = archivePageClamped * GALLERY_ARCHIVE_PAGE_SIZE;
    return archive.slice(start, start + GALLERY_ARCHIVE_PAGE_SIZE);
  }, [archive, archivePageClamped]);

  useEffect(() => {
    if (archivePage > archivePages - 1) setArchivePage(Math.max(0, archivePages - 1));
  }, [archivePage, archivePages]);

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, closeLightbox]);

  const caption = payload.featuredCaption;
  const v = payload.sectionVisibility;

  const noPhotos = photos.length === 0;
  const wantsPhotoGrids =
    v.spotlight || v.events || v.lab || v.archive;

  const orderedBlocks = useMemo(() => {
    const customById = new Map(
      payload.customSections.map((s) => [s.id, s] as const),
    );
    const out: { key: string; node: ReactNode }[] = [];

    for (const entry of payload.sectionOrder) {
      const cid = parseGalleryCustomOrderKey(entry);
      if (cid) {
        const cs = customById.get(cid);
        if (
          cs &&
          cs.enabled &&
          customSectionHasContent(cs)
        ) {
          const accent: SectionAccent =
            out.length % 3 === 0
              ? "cognition"
              : out.length % 3 === 1
                ? "consciousness"
                : "care";
          const hasHead =
            cs.eyebrow.trim() !== "" ||
            cs.title.trim() !== "" ||
            cs.description.trim() !== "";
          out.push({
            key: entry,
            node: (
              <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:py-16">
                {hasHead &&
                  sectionHeading(
                    <TextQuote className="h-4 w-4" aria-hidden />,
                    cs.eyebrow.trim() || "\u00a0",
                    cs.title.trim() || cs.eyebrow.trim() || "Gallery note",
                    cs.description.trim(),
                    accent,
                  )}
                {cs.body.trim() !== "" && (
                  <div
                    className={`mx-auto max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground ${hasHead ? "mt-2" : ""}`}
                  >
                    {cs.body
                      .trim()
                      .split(/\n\n+/)
                      .map((para, i) => (
                        <p key={i} className="whitespace-pre-wrap">
                          {para.trim()}
                        </p>
                      ))}
                  </div>
                )}
              </section>
            ),
          });
        }
        continue;
      }

      if (entry === "spotlight" && !noPhotos && v.spotlight && hero) {
        out.push({
          key: entry,
          node: (
            <section
              className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20"
            >
              {sectionHeading(
                <Sparkles className="h-4 w-4" aria-hidden />,
                payload.spotlight.eyebrow,
                payload.spotlight.title,
                payload.spotlight.description,
                "cognition",
              )}

              <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-12 lg:gap-6">
                <div className="lg:col-span-8">
                  <button
                    type="button"
                    onClick={() =>
                      setLightbox({
                        src: hero.src,
                        alt: hero.alt,
                        subtitle: caption,
                      })
                    }
                    aria-label={`${caption}: open larger preview`}
                    className="group relative block h-full w-full overflow-hidden rounded-3xl border border-border/80 bg-card text-left shadow-lg shadow-black/[0.04] ring-1 ring-black/[0.04] transition hover:border-brand/25 hover:shadow-xl hover:shadow-brand/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                  >
                    <div className="relative aspect-[16/10] w-full lg:aspect-[4/3] lg:min-h-[min(72vh,520px)]">
                      <Image
                        src={hero.src}
                        alt={hero.alt || caption}
                        fill
                        className="object-cover transition duration-300 ease-out group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
                      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                        <div className="absolute inset-0 bg-brand/10 mix-blend-overlay" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                            {caption}
                          </p>
                          <p className="mt-1 max-w-xl text-lg font-semibold text-white sm:text-xl">
                            View larger
                          </p>
                        </div>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-md transition group-hover:bg-white/25 sm:h-12 sm:w-12">
                          <ZoomIn className="h-5 w-5" aria-hidden />
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="flex flex-col gap-4 lg:col-span-4">
                  {sideStrip.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setLightbox({
                          src: item.src,
                          alt: item.alt,
                          subtitle: item.title || undefined,
                        })
                      }
                      aria-label={`Open gallery image: ${item.alt || item.title}`}
                      className="group relative min-h-[160px] flex-1 overflow-hidden rounded-2xl border border-border/80 bg-card text-left shadow-sm ring-1 ring-black/[0.03] transition hover:border-brand/25 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 lg:min-h-0"
                    >
                      <div className="relative aspect-[16/10] h-full min-h-[160px] w-full lg:aspect-auto lg:min-h-[200px]">
                        <Image
                          src={item.src}
                          alt={item.alt || "Gallery image"}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
                        <p className="absolute bottom-3 left-3 right-3 text-left text-sm font-semibold text-white drop-shadow-sm">
                          {item.title || item.alt}
                        </p>
                        <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                          <ZoomIn className="h-3.5 w-3.5" aria-hidden />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ),
        });
        continue;
      }

      if (entry === "events" && !noPhotos && v.events && events.length > 0) {
        out.push({
          key: entry,
          node: (
            <section className="relative bg-muted/25 py-16 lg:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {sectionHeading(
                  <CalendarDays className="h-4 w-4" aria-hidden />,
                  payload.eventsSection.eyebrow,
                  payload.eventsSection.title,
                  payload.eventsSection.description,
                  "consciousness",
                )}

                <div className="grid grid-cols-1 gap-4 md:auto-rows-[minmax(200px,auto)] md:grid-cols-6 md:gap-4">
                  {events.map((item, index) => {
                    const label = (item.title ?? "").trim() || item.alt;
                    return (
                      <button
                        key={`${item.id}-ev-${index}`}
                        type="button"
                        onClick={() =>
                          setLightbox({
                            src: item.src,
                            alt: item.alt,
                            subtitle: (item.title ?? "").trim() || undefined,
                          })
                        }
                        aria-label={`${label}: open larger preview`}
                        className={`group relative min-h-[220px] overflow-hidden rounded-2xl border border-border/80 bg-card text-left shadow-sm ring-1 ring-black/[0.03] transition hover:border-brand/20 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 md:min-h-0 md:h-full ${EVENT_BENTO_CLASS[index] ?? ""}`}
                      >
                        <div className="relative aspect-[4/3] w-full md:absolute md:inset-0 md:aspect-auto md:h-full md:min-h-[200px]">
                          <Image
                            src={item.src}
                            alt={item.alt || label}
                            fill
                            className="object-cover transition duration-300 group-hover:scale-[1.03]"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-90" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                            <p
                              className={`font-semibold text-white drop-shadow-sm ${index === 0 ? "text-base md:text-lg" : "text-sm"}`}
                            >
                              {label}
                            </p>
                          </div>
                          <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
                            <ZoomIn className="h-4 w-4" aria-hidden />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          ),
        });
        continue;
      }

      if (entry === "lab" && !noPhotos && v.lab && labGrid.length > 0) {
        out.push({
          key: entry,
          node: (
            <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
              {sectionHeading(
                <Images className="h-4 w-4" aria-hidden />,
                payload.labSection.eyebrow,
                payload.labSection.title,
                payload.labSection.description,
                "care",
              )}

              <div className="grid grid-cols-2 gap-3 md:auto-rows-[minmax(150px,auto)] md:grid-cols-4 md:gap-4">
                {labGrid.map((item, index) => (
                  <button
                    key={`${item.id}-lab-${index}`}
                    type="button"
                    onClick={() =>
                      setLightbox({
                        src: item.src,
                        alt: item.alt,
                        subtitle: (item.title ?? "").trim() || undefined,
                      })
                    }
                    aria-label={`Open gallery image: ${item.alt || item.title}`}
                    className={`group relative min-h-[140px] overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm ring-1 ring-black/[0.03] transition hover:border-brand/20 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 md:min-h-0 md:h-full ${LAB_BENTO_CLASS[index] ?? ""}`}
                  >
                    <div className="relative aspect-square w-full md:absolute md:inset-0 md:aspect-auto md:h-full md:min-h-[140px]">
                      <Image
                        src={item.src}
                        alt={item.alt || "Gallery image"}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/15" />
                      <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-background/90 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition group-hover:opacity-100">
                        <ZoomIn className="h-3.5 w-3.5" aria-hidden />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ),
        });
        continue;
      }

      if (entry === "archive" && !noPhotos && v.archive && archive.length > 0) {
        out.push({
          key: entry,
          node: (
            <section className="relative bg-muted/20 py-16 lg:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {sectionHeading(
                  <Images className="h-4 w-4" aria-hidden />,
                  payload.archiveSection.eyebrow,
                  payload.archiveSection.title,
                  payload.archiveSection.description,
                  "cognition",
                )}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {archiveSlice.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setLightbox({
                          src: item.src,
                          alt: item.alt,
                          subtitle: (item.title ?? "").trim() || undefined,
                        })
                      }
                      aria-label={`Open gallery image: ${item.alt || item.title}`}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm ring-1 ring-black/[0.03] transition hover:border-brand/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                    >
                      <Image
                        src={item.src}
                        alt={item.alt || "Gallery image"}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                    </button>
                  ))}
                </div>

                {archivePages > 1 && (
                  <nav
                    className="mt-10 flex flex-wrap items-center justify-center gap-3"
                    aria-label="Gallery pages"
                  >
                    <button
                      type="button"
                      disabled={archivePageClamped <= 0}
                      onClick={() => setArchivePage((p) => Math.max(0, p - 1))}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition enabled:hover:bg-muted disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden />
                      Previous
                    </button>
                    <span className="text-sm text-muted-foreground">
                      Page {archivePageClamped + 1} of {archivePages}
                      <span className="mx-1 text-border">·</span>
                      {archive.length} photos
                    </span>
                    <button
                      type="button"
                      disabled={archivePageClamped >= archivePages - 1}
                      onClick={() =>
                        setArchivePage((p) => Math.min(archivePages - 1, p + 1))
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition enabled:hover:bg-muted disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" aria-hidden />
                    </button>
                  </nav>
                )}
              </div>
            </section>
          ),
        });
      }
    }

    return out;
  }, [
    noPhotos,
    payload.sectionOrder,
    payload.customSections,
    payload.spotlight,
    payload.eventsSection,
    payload.labSection,
    payload.archiveSection,
    v.spotlight,
    v.events,
    v.lab,
    v.archive,
    hero,
    sideStrip,
    events,
    labGrid,
    archive,
    archiveSlice,
    archivePages,
    archivePageClamped,
    caption,
    setLightbox,
    setArchivePage,
  ]);

  const hasAnyGalleryContent = orderedBlocks.length > 0;

  const titleGradientShift = reduceMotion
    ? null
    : {
        style: { backgroundSize: "210% auto" as const },
        animate: { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] },
        transition: {
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  const introGradientShift = reduceMotion
    ? null
    : {
        style: { backgroundSize: "200% auto" as const },
        animate: { backgroundPosition: ["0% 45%", "100% 55%", "0% 45%"] },
        transition: {
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  const heroVideoPoster = hero?.src;

  return (
    <div className="min-h-screen bg-background">
      <header className="relative min-h-[min(46vh,22rem)] overflow-hidden border-b border-border/60 sm:min-h-[min(50vh,26rem)]">
        {!reduceMotion && !heroVideoFailed ? (
          <video
            key={GALLERY_HERO_VIDEO_SRC}
            className="absolute inset-0 z-0 h-full w-full object-cover opacity-[0.42] saturate-[0.92]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroVideoPoster}
            aria-hidden
            onError={() => setHeroVideoFailed(true)}
          >
            <source src={GALLERY_HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        ) : null}
        <div
          className="absolute inset-0 z-[1] bg-linear-to-br from-slate-50/92 via-background/88 to-brand-light/45"
          aria-hidden
        />
        {!reduceMotion ? (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -left-[22%] -top-[45%] z-[1] h-[90%] w-[68%] rounded-full bg-cognition/28 blur-[88px]"
              animate={{
                x: [0, 32, -14, 0],
                y: [0, 22, -26, 0],
                scale: [1, 1.07, 1.03, 1],
              }}
              transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -right-[12%] top-[5%] z-[1] h-[75%] w-[58%] rounded-full bg-consciousness/22 blur-[76px]"
              animate={{
                x: [0, -28, 16, 0],
                y: [0, -24, 18, 0],
                scale: [1, 1.06, 1.02, 1],
              }}
              transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute bottom-[-25%] left-[20%] z-[1] h-[55%] w-[55%] rounded-full bg-care/20 blur-[70px]"
              animate={{
                x: [0, -20, 12, 0],
                y: [0, 16, -12, 0],
                opacity: [0.75, 1, 0.82, 0.75],
              }}
              transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 z-[1] bg-linear-to-br from-brand-light/50 via-background to-consciousness/12"
          />
        )}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-grid-black/5 mask-[linear-gradient(to_bottom,white,transparent_88%)]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
            }
          >
            <GalleryTitleLogoGlow reduceMotion={!!reduceMotion}>
              <motion.h1
                {...(titleGradientShift ?? {})}
                className={`text-4xl font-medium leading-[1.22] tracking-tight md:text-5xl md:leading-[1.2] lg:text-6xl lg:leading-[1.18] bg-linear-to-br from-brand via-consciousness to-care bg-clip-text text-transparent ${galleryTitleFont.className}`}
              >
                {payload.pageTitle}
              </motion.h1>
            </GalleryTitleLogoGlow>
            {payload.intro.trim() ? (
              <motion.p
                {...(introGradientShift ?? {})}
                className={`mt-5 max-w-2xl text-lg font-semibold leading-snug tracking-[0.01em] md:text-xl md:leading-snug bg-linear-to-br from-foreground via-consciousness to-brand-deep bg-clip-text text-transparent ${galleryIntroFont.className}`}
              >
                {payload.intro}
              </motion.p>
            ) : null}
          </motion.div>
        </div>
      </header>

      <div className="relative bg-background">
        {noPhotos && wantsPhotoGrids && (
          <section className="mx-auto max-w-7xl px-4 py-8 text-center text-muted-foreground sm:px-6 lg:px-8">
            <p className="text-sm">
              No photos yet. Add images from the admin gallery to fill the photo blocks.
            </p>
          </section>
        )}

        {orderedBlocks.map((block, i) => (
          <div
            key={block.key}
            className={
              i === 0
                ? "pt-8 lg:pt-10"
                : "border-t border-border/50 pt-10 lg:pt-12"
            }
          >
            {block.node}
          </div>
        ))}

        {!noPhotos && !hasAnyGalleryContent && (
          <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <p className="text-sm text-muted-foreground">
              Nothing is visible: built-in photo blocks are off or empty, and there are no enabled
              custom sections with content. Adjust{" "}
              <span className="font-medium text-foreground">Visible sections</span>,{" "}
              <span className="font-medium text-foreground">Custom sections</span>, and{" "}
              <span className="font-medium text-foreground">Section order</span> under{" "}
              <span className="font-medium text-foreground">Admin → Gallery</span>.
            </p>
          </section>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={lightboxEase}
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={lightboxEase}
              className="relative max-h-[90vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute -top-1 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:-right-2 md:-top-12"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <a
                href={lightbox.src}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute -top-1 left-0 z-10 flex h-10 items-center gap-2 rounded-full bg-white/10 px-3 text-sm font-medium text-white transition hover:bg-white/20 md:-top-12"
                aria-label="Open image in new tab"
              >
                <Download className="h-4 w-4" aria-hidden />
                Open
              </a>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl">
                <div className="relative max-h-[80vh] w-full">
                  <Image
                    src={lightbox.src}
                    alt={lightbox.alt}
                    width={1600}
                    height={1000}
                    className="max-h-[80vh] w-full object-contain"
                    sizes="100vw"
                  />
                </div>
                {(lightbox.subtitle || lightbox.alt) && (
                  <div className="border-t border-white/10 bg-black/50 px-4 py-3 text-sm text-white/90">
                    {lightbox.subtitle && (
                      <p className="font-semibold text-white">{lightbox.subtitle}</p>
                    )}
                    <p className={lightbox.subtitle ? "mt-0.5 text-white/70" : ""}>{lightbox.alt}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
