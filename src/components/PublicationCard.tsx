import { ExternalLink, Users } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import type { OrcidPublication } from "@/lib/orcid-works";

const ACCENTS = ["bg-cognition", "bg-consciousness", "bg-care"] as const;

const EASE: [number, number, number, number] = [0.2, 0.82, 0.28, 1];

/** Standalone entrance when no stagger parent wraps the card */
const standaloneItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: EASE },
  },
};

function PublicationCardSkeleton() {
  return (
    <div className="h-full rounded-2xl border border-border/90 bg-card/90 backdrop-blur-[2px] shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-muted animate-pulse" />
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:gap-5 sm:p-5">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3 w-2/3 max-w-xs bg-muted rounded animate-pulse" />
          <div className="h-5 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex flex-row flex-wrap gap-2 sm:flex-col sm:items-end sm:gap-2">
          <div className="h-5 w-12 bg-muted rounded-md animate-pulse" />
          <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          <div className="h-8 w-28 bg-muted rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function PublicationCard({
  pub,
  accentIndex,
  showYearBadge = false,
  /** Pass `usePublicationListMotion().item` when the card sits inside a stagger `motion` container */
  listItemVariants,
}: {
  pub: OrcidPublication;
  accentIndex: number;
  showYearBadge?: boolean;
  listItemVariants?: Variants;
}) {
  const accent = ACCENTS[accentIndex % ACCENTS.length];
  const link = pub.doi ? `https://doi.org/${pub.doi}` : pub.url;
  const linkLabel = pub.doi ? "DOI" : "Open";

  const item = listItemVariants ?? standaloneItem;
  const drivenByParent = Boolean(listItemVariants);

  return (
    <motion.article
      variants={item}
      initial="hidden"
      {...(drivenByParent ? {} : { animate: "show" })}
      className="group relative h-full rounded-2xl border border-border/90 bg-card/90 backdrop-blur-[2px] shadow-sm transition-shadow duration-200 hover:border-brand/20 hover:shadow-lg"
      whileHover={{
        y: -2,
        transition: { duration: 0.18, ease: EASE },
      }}
    >
      <div
        className={`absolute left-0 top-2.5 bottom-2.5 w-1 rounded-full ${accent} opacity-90 sm:top-3 sm:bottom-3`}
        aria-hidden
      />
      <div className="flex flex-col gap-3 pl-5 pr-4 py-3 sm:flex-row sm:items-start sm:gap-5 sm:pl-6 sm:pr-5 sm:py-4">
        <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
          {pub.journal && (
            <p className="text-xs font-medium uppercase tracking-wider text-brand/90 line-clamp-2">
              {pub.journal}
            </p>
          )}
          <h3 className="text-base sm:text-lg font-semibold text-foreground leading-snug tracking-tight group-hover:text-brand-deep transition-colors">
            {pub.title}
          </h3>
          {pub.authors && (
            <p className="flex gap-1.5 text-sm leading-snug text-muted-foreground">
              <Users
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/80"
                aria-hidden
              />
              <span className="line-clamp-3">{pub.authors}</span>
            </p>
          )}
        </div>

        <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-2 self-start sm:flex-col sm:items-end sm:gap-2 sm:pt-0.5">
          {showYearBadge && pub.year != null && (
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums text-foreground">
              {pub.year}
            </span>
          )}
          {!showYearBadge && pub.year != null && (
            <span className="text-sm font-medium tabular-nums text-muted-foreground">
              {pub.year}
            </span>
          )}
          {pub.type && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-right sm:max-w-[10rem]">
              {pub.type}
            </span>
          )}
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand/5 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-primary-foreground hover:border-brand transition-colors duration-200 group/link"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover/link:translate-x-0.5" />
              {pub.doi ? (
                <span className="truncate max-w-[10rem] sm:max-w-[11rem]">
                  {pub.doi}
                </span>
              ) : (
                linkLabel
              )}
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export { PublicationCardSkeleton };
