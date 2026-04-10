"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CalendarDays, Download, Images, Sparkles, X, ZoomIn } from "lucide-react";

/** Seeded picsum URLs for stable static export; replace with site images when available. */
const FEATURED = {
  src: "https://picsum.photos/seed/4c-gallery-featured/1920/1080",
  alt: "Featured image from the 4C Research Group",
  caption: "Featured",
};

const EVENTS_AND_WORKSHOPS = [
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
] as const;

const OTHER_GALLERY = [
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
] as const;

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

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null);
  const reduceMotion = useReducedMotion();

  const closeLightbox = useCallback(() => setLightbox(null), []);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-linear-to-b from-muted/40 via-background to-background">
        <header className="mx-auto max-w-7xl px-4 pt-6 pb-2 sm:px-6 lg:px-8 lg:pt-8">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Cognition · Consciousness · Critical Care
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Gallery
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Visual stories from our research, knowledge mobilization, and the people who
            make pediatric critical care science happen.
          </p>
        </header>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(hsl(var(--border)) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
            maskImage:
              "linear-gradient(to bottom, black 0%, transparent 55%, transparent 100%)",
          }}
          aria-hidden
        />

        {/* Featured */}
        <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-20 lg:pt-8">
          {sectionHeading(
            <Sparkles className="h-4 w-4" aria-hidden />,
            "Spotlight",
            "Featured photo",
            "One strong image at the top sets tone: lab milestone, keynote moment, or a human story from critical care research.",
            "cognition",
          )}

          <motion.button
            type="button"
            {...(reduceMotion
              ? {}
              : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45 } })}
            onClick={() =>
              setLightbox({
                src: FEATURED.src,
                alt: FEATURED.alt,
                subtitle: FEATURED.caption,
              })
            }
            aria-label={`${FEATURED.caption}: open larger preview`}
            className="group relative mx-auto block w-full max-w-5xl overflow-hidden rounded-3xl border border-border/80 bg-card text-left shadow-lg shadow-black/[0.04] ring-1 ring-black/[0.04] transition hover:border-brand/25 hover:shadow-xl hover:shadow-brand/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <div className="relative aspect-[21/9] w-full sm:aspect-[2.4/1]">
              <Image
                src={FEATURED.src}
                alt={FEATURED.alt}
                fill
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute inset-0 bg-brand/10 mix-blend-overlay" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6 sm:p-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                    {FEATURED.caption}
                  </p>
                  <p className="mt-1 max-w-xl text-lg font-semibold text-white sm:text-xl">
                    View larger
                  </p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-md transition group-hover:bg-white/25">
                  <ZoomIn className="h-5 w-5" aria-hidden />
                </span>
              </div>
            </div>
          </motion.button>
        </section>

        {/* Events & workshops */}
        <section className="relative border-t border-border/50 bg-muted/25 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {sectionHeading(
              <CalendarDays className="h-4 w-4" aria-hidden />,
              "On the calendar",
              "Events & workshops",
              "Symposia, KM sessions, and partner-facing gatherings.",
              "consciousness",
            )}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {EVENTS_AND_WORKSHOPS.map((item, index) => (
                <motion.button
                  key={item.src}
                  type="button"
                  {...(reduceMotion
                    ? {}
                    : {
                        initial: { opacity: 0, y: 14 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.4, delay: index * 0.05 },
                      })}
                  onClick={() =>
                    setLightbox({
                      src: item.src,
                      alt: item.alt,
                      subtitle: item.title,
                    })
                  }
                  aria-label={`${item.title}: open larger preview`}
                  className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card text-left shadow-sm ring-1 ring-black/[0.03] transition hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-sm font-semibold text-white drop-shadow-sm">{item.title}</p>
                    </div>
                    <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
                      <ZoomIn className="h-4 w-4" aria-hidden />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Other images — masonry-style columns */}
        <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          {sectionHeading(
            <Images className="h-4 w-4" aria-hidden />,
            "More moments",
            "Lab & field",
            "Day-to-day lab life, posters, collaboration, and candid team moments.",
            "care",
          )}

          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {OTHER_GALLERY.map((item, index) => (
              <motion.button
                key={item.src}
                type="button"
                {...(reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 12 },
                      animate: { opacity: 1, y: 0 },
                      transition: { duration: 0.35, delay: Math.min(index * 0.04, 0.4) },
                    })}
                onClick={() => setLightbox({ src: item.src, alt: item.alt })}
                aria-label={`Open gallery image: ${item.alt}`}
                className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm ring-1 ring-black/[0.03] transition hover:border-brand/20 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                <div className="relative w-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={900}
                    height={1200}
                    className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/15" />
                  <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-background/90 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition group-hover:opacity-100">
                    <ZoomIn className="h-3.5 w-3.5" aria-hidden />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
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
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
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
