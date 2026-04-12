import { ExternalLink, Users } from "lucide-react";
import { motion } from "framer-motion";
import type { OrcidPublication } from "@/lib/orcid-works";

const ACCENTS = ["bg-cognition", "bg-consciousness", "bg-care"] as const;

// Loading skeleton component
function PublicationCardSkeleton() {
  return (
    <div className="h-full rounded-xl border border-border/90 bg-card/90 backdrop-blur-[2px] shadow-sm overflow-hidden">
      <div className="h-0.5 w-full bg-muted animate-pulse" />
      <div className="p-3 sm:p-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-10 bg-muted rounded-md animate-pulse" />
          <div className="h-3.5 w-16 bg-muted rounded-md animate-pulse" />
        </div>
        <div className="h-3.5 w-full bg-muted rounded animate-pulse" />
        <div className="h-3.5 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-3.5 w-1/2 bg-muted rounded animate-pulse" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-8 w-24 bg-muted rounded-full animate-pulse" />
          <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function PublicationCard({
  pub,
  accentIndex,
  showYearBadge = false,
}: {
  pub: OrcidPublication;
  accentIndex: number;
  showYearBadge?: boolean;
}) {
  const accent = ACCENTS[accentIndex % ACCENTS.length];
  const link = pub.doi ? `https://doi.org/${pub.doi}` : pub.url;
  const linkLabel = pub.doi ? "DOI" : "Open";

  return (
    <motion.article
      className="group relative h-full rounded-xl border border-border/90 bg-card/90 backdrop-blur-[2px] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-md"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: accentIndex * 0.03,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -3,
        transition: { duration: 0.15 },
      }}
    >
      <motion.div
        className={`absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full ${accent} opacity-90`}
        aria-hidden
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{
          duration: 0.4,
          delay: accentIndex * 0.03 + 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ transformOrigin: "top" }}
      />
      <div className="pl-4 pr-3 py-3 sm:pl-5 sm:pr-4 sm:py-3.5">
        <motion.div
          className="flex flex-wrap items-center gap-1.5 mb-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: accentIndex * 0.03 + 0.1 }}
        >
          {showYearBadge && pub.year != null && (
            <motion.span
              className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-foreground"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: accentIndex * 0.03 + 0.15 }}
            >
              {pub.year}
            </motion.span>
          )}
          {pub.type && (
            <motion.span
              className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: accentIndex * 0.03 + 0.2 }}
            >
              {pub.type}
            </motion.span>
          )}
        </motion.div>
        {pub.journal && (
          <motion.p
            className="text-[11px] font-medium uppercase tracking-wider text-brand/90 mb-1 line-clamp-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: accentIndex * 0.03 + 0.15 }}
          >
            {pub.journal}
          </motion.p>
        )}
        <motion.h3
          className="text-sm sm:text-base font-semibold text-foreground leading-snug tracking-tight group-hover:text-brand-deep transition-colors"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: accentIndex * 0.03 + 0.2 }}
        >
          {pub.title}
        </motion.h3>
        {pub.authors && (
          <motion.p
            className="mt-1.5 flex gap-1.5 text-xs sm:text-sm leading-snug text-muted-foreground"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: accentIndex * 0.03 + 0.22 }}
          >
            <Users
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/80"
              aria-hidden
            />
            <span className="line-clamp-3">{pub.authors}</span>
          </motion.p>
        )}
        {!showYearBadge && pub.year != null && (
          <motion.p
            className="mt-1.5 text-xs tabular-nums text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: accentIndex * 0.03 + 0.25 }}
          >
            {pub.year}
          </motion.p>
        )}
        {link && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: accentIndex * 0.03 + 0.3 }}
          >
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center gap-1 rounded-full border border-brand/25 bg-brand/5 px-2.5 py-1 text-[11px] font-semibold text-brand hover:bg-brand hover:text-primary-foreground hover:border-brand transition-all duration-200 group/link"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover/link:translate-x-0.5" />
              {pub.doi ? (
                <span className="truncate max-w-[min(100%,28rem)]">
                  {pub.doi}
                </span>
              ) : (
                linkLabel
              )}
            </a>
          </motion.div>
        )}
      </div>
    </motion.article>
  );
}

export { PublicationCardSkeleton };
