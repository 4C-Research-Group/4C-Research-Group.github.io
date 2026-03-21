import { ExternalLink } from "lucide-react";
import type { OrcidPublication } from "@/lib/orcid-works";

const ACCENTS = ["bg-cognition", "bg-consciousness", "bg-care"] as const;

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
    <article className="group relative h-full rounded-2xl border border-border/90 bg-card/90 backdrop-blur-[2px] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-lg">
      <div
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${accent} opacity-90`}
        aria-hidden
      />
      <div className="pl-5 pr-4 py-4 sm:pl-6 sm:pr-5 sm:py-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {showYearBadge && pub.year != null && (
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-semibold tabular-nums text-foreground">
              {pub.year}
            </span>
          )}
          {pub.type && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {pub.type}
            </span>
          )}
        </div>
        {pub.journal && (
          <p className="text-xs font-medium uppercase tracking-wider text-brand/90 mb-2 line-clamp-2">
            {pub.journal}
          </p>
        )}
        <h3 className="text-base sm:text-lg font-semibold text-foreground leading-snug tracking-tight group-hover:text-brand-deep transition-colors">
          {pub.title}
        </h3>
        {!showYearBadge && pub.year != null && (
          <p className="mt-2 text-sm tabular-nums text-muted-foreground">
            {pub.year}
          </p>
        )}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand/5 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-primary-foreground hover:border-brand transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            {pub.doi ? (
              <span className="truncate max-w-[220px] sm:max-w-[280px]">
                {pub.doi}
              </span>
            ) : (
              linkLabel
            )}
          </a>
        )}
      </div>
    </article>
  );
}
