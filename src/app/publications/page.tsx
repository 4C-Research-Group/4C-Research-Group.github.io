"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ExternalLink,
  Loader2,
  RefreshCw,
  Search,
  BookOpen,
  Users,
  FileText,
  Sparkles,
} from "lucide-react";
import { FaGoogle, FaOrcid, FaResearchgate } from "react-icons/fa";
import {
  PublicationCard,
  PublicationCardSkeleton,
} from "@/components/PublicationCard";
import {
  DEFAULT_ORCID_ID,
  fetchOrcidPublications,
  type OrcidPublication,
} from "@/lib/orcid-works";

function groupByYear(pubs: OrcidPublication[]): [string, OrcidPublication[]][] {
  const map = new Map<string, OrcidPublication[]>();
  for (const p of pubs) {
    const key = p.year != null ? String(p.year) : "Other";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(p);
  }
  const entries = [...map.entries()];
  entries.sort((a, b) => {
    if (a[0] === "Other") return 1;
    if (b[0] === "Other") return -1;
    return Number(b[0]) - Number(a[0]);
  });
  return entries;
}

const ORCID_PROFILE_URL = "https://orcid.org/0000-0002-2599-9119";
const RESEARCHGATE_URL =
  "https://www.researchgate.net/profile/Saptharishi-Lalgudi-Ganesan";
const GOOGLE_SCHOLAR_URL =
  "https://scholar.google.com/citations?user=iuxSVQwAAAAJ&hl=en";

export default function PublicationsPage() {
  const [publications, setPublications] = useState<OrcidPublication[]>([]);
  const [sortBy, setSortBy] = useState<"year" | "title">("year");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const reduceMotion = useReducedMotion();
  const spring = [0.22, 1, 0.36, 1] as const;
  const fadeUp = reduceMotion ? undefined : { opacity: 0, y: 16 };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchOrcidPublications(DEFAULT_ORCID_ID, {
        onListLoaded: (partial) => {
          setPublications(partial);
          setLoading(false);
        },
      });

      setPublications(data);
      setLoading(false);
      setLastFetched(new Date());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error loading publications");
      setPublications([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sortedAndFiltered = useMemo(() => {
    let pubs = [...publications];
    if (sortBy === "year") {
      pubs.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    } else {
      pubs.sort((a, b) => a.title.localeCompare(b.title));
    }
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      pubs = pubs.filter(
        (pub) =>
          pub.title.toLowerCase().includes(term) ||
          (pub.authors?.toLowerCase().includes(term) ?? false) ||
          (pub.journal?.toLowerCase().includes(term) ?? false) ||
          (pub.doi?.toLowerCase().includes(term) ?? false) ||
          (pub.type?.toLowerCase().includes(term) ?? false),
      );
    }
    return pubs;
  }, [publications, sortBy, searchTerm]);

  const renderHero = () => (
    <section className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-slate-50/95 via-background to-background">
      <div
        className="pointer-events-none absolute inset-0 bg-grid-black/5 mask-[linear-gradient(180deg,white,transparent_80%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-0 h-[26rem] w-[26rem] rounded-full bg-brand/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-cognition/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-care/8 blur-3xl"
        aria-hidden
      />

      <div className="container relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(280px,400px)] lg:gap-14">
          <motion.div
            initial={fadeUp}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.5,
              ease: spring,
            }}
            className="text-center lg:text-left"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand sm:text-[13px]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Research Output
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                Publications
              </span>
              <span className="mt-3 block text-2xl font-semibold leading-snug tracking-tight text-muted-foreground sm:text-3xl lg:text-[1.65rem]">
                Our latest research contributions and scholarly work
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              Explore our peer-reviewed publications, articles, and academic
              contributions to pediatric critical care and neuroscience research.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-xl border border-cognition/20 bg-cognition/5 px-3 py-2 text-xs font-medium text-cognition sm:text-sm">
                <BookOpen className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                Peer-Reviewed Articles
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-consciousness/20 bg-consciousness/5 px-3 py-2 text-xs font-medium text-consciousness sm:text-sm">
                <Users className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                Collaborative Research
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-care/20 bg-care/5 px-3 py-2 text-xs font-medium text-care sm:text-sm">
                <ExternalLink className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                Open Access
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={fadeUp}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.55,
              delay: reduceMotion ? 0 : 0.06,
              ease: spring,
            }}
            className="relative mx-auto w-full max-w-md lg:mx-0"
          >
            <div
              className="absolute -inset-1 rounded-[1.35rem] bg-linear-to-br from-cognition/15 via-brand/12 to-care/15 opacity-90 blur-sm"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/90 p-6 shadow-lg ring-1 ring-black/[0.04] backdrop-blur-md sm:p-7">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/12 text-brand">
                <FileText className="h-5 w-5" aria-hidden />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand/90">
                Live bibliography
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-foreground sm:text-4xl">
                {loading ? "—" : publications.length}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Works synced from ORCID
                {loading ? " (loading…)" : ""}
              </p>

              <div className="mt-6 space-y-2 border-t border-border/50 pt-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Profiles
                </p>
                <a
                  href={RESEARCHGATE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center gap-3 rounded-xl border border-border/70 bg-background/80 px-4 py-3 text-sm font-medium text-foreground transition hover:border-brand/30 hover:bg-muted/40"
                >
                  <FaResearchgate className="shrink-0 text-lg text-green-600" />
                  <span className="truncate">ResearchGate</span>
                  <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                </a>
                <a
                  href={GOOGLE_SCHOLAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center gap-3 rounded-xl border border-border/70 bg-background/80 px-4 py-3 text-sm font-medium text-foreground transition hover:border-brand/30 hover:bg-muted/40"
                >
                  <FaGoogle className="shrink-0 text-lg text-blue-500" />
                  <span className="truncate">Google Scholar</span>
                  <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                </a>
                <a
                  href={ORCID_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center gap-3 rounded-xl border border-border/70 bg-background/80 px-4 py-3 text-sm font-medium text-foreground transition hover:border-brand/30 hover:bg-muted/40"
                >
                  <FaOrcid className="shrink-0 text-lg text-green-700" />
                  <span className="truncate">ORCID</span>
                  <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {renderHero()}

      <div className="container mx-auto px-4 py-8 sm:py-10 max-w-7xl">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              Loaded live from{" "}
              <a
                href={ORCID_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:text-brand-deep font-medium"
              >
                ORCID
              </a>
              {loading && (
                <span className="flex items-center gap-1 text-xs">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Updating...
                </span>
              )}
              {!loading && <span>.</span>} New works you add there appear here
              on the next visit.
            </p>
            {lastFetched && !loading && (
              <span className="text-xs sm:text-sm tabular-nums">
                Updated {lastFetched.toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                placeholder="Search by title, journal, DOI, or type…"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search publications"
              />
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  sortBy === "year"
                    ? "bg-brand text-primary-foreground border-brand"
                    : "bg-card text-foreground border-border hover:border-brand/40"
                }`}
                onClick={() => setSortBy("year")}
              >
                Sort by year
              </button>
              <button
                type="button"
                className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  sortBy === "title"
                    ? "bg-brand text-primary-foreground border-brand"
                    : "bg-card text-foreground border-border hover:border-brand/40"
                }`}
                onClick={() => setSortBy("title")}
              >
                Sort by title
              </button>
              <button
                type="button"
                onClick={() => load()}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-muted/80 text-sm font-medium transition-colors disabled:opacity-50"
                aria-label="Refresh from ORCID"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {loading && (
            <div className="space-y-14">
              {/* Show skeleton cards in year-grouped layout */}
              <div className="relative">
                <div
                  className="pointer-events-none absolute left-[7.25rem] top-0 bottom-0 hidden lg:block w-px bg-linear-to-b from-cognition/50 via-consciousness/40 to-care/50 opacity-30"
                  aria-hidden
                />
                {/* Skeleton for 2026 */}
                <section className="relative mb-14 last:mb-0 lg:pl-32">
                  <div className="mb-6 flex items-baseline gap-3 lg:absolute lg:left-0 lg:top-1 lg:mb-0 lg:w-24 lg:flex-col lg:items-end lg:text-right">
                    <span className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
                      2026
                    </span>
                    <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground lg:mt-1">
                      Loading...
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-5">
                    <PublicationCardSkeleton />
                    <PublicationCardSkeleton />
                  </div>
                </section>
                {/* Skeleton for 2025 */}
                <section className="relative mb-14 last:mb-0 lg:pl-32">
                  <div className="mb-6 flex items-baseline gap-3 lg:absolute lg:left-0 lg:top-1 lg:mb-0 lg:w-24 lg:flex-col lg:items-end lg:text-right">
                    <span className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
                      2025
                    </span>
                    <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground lg:mt-1">
                      Loading...
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-5">
                    <PublicationCardSkeleton />
                    <PublicationCardSkeleton />
                  </div>
                </section>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 text-destructive px-4 py-6 text-center space-y-3">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => load()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-primary-foreground text-sm font-medium hover:bg-brand-deep"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && sortedAndFiltered.length > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              Showing {sortedAndFiltered.length} of {publications.length}{" "}
              publication{publications.length === 1 ? "" : "s"}
              {searchTerm.trim() ? " (filtered)" : ""}
            </p>
          )}

          {!loading && !error && sortedAndFiltered.length > 0 && (
            <>
              {sortBy === "year" ? (
                <div className="relative">
                  <div
                    className="pointer-events-none absolute left-[7.25rem] top-0 bottom-0 hidden lg:block w-px bg-linear-to-b from-cognition/50 via-consciousness/40 to-care/50"
                    aria-hidden
                  />
                  {(() => {
                    let globalIndex = 0;
                    return groupByYear(sortedAndFiltered).map(
                      ([yearLabel, yearPubs]) => (
                        <section
                          key={yearLabel}
                          className="relative mb-14 last:mb-0 lg:pl-32"
                        >
                          <div className="mb-6 flex items-baseline gap-3 lg:absolute lg:left-0 lg:top-1 lg:mb-0 lg:w-24 lg:flex-col lg:items-end lg:text-right">
                            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground tabular-nums">
                              {yearLabel === "Other" ? "Other" : yearLabel}
                            </span>
                            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground lg:mt-1">
                              {yearPubs.length} work
                              {yearPubs.length === 1 ? "" : "s"}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-5">
                            {yearPubs.map((pub) => {
                              const currentIndex = globalIndex++;
                              return (
                                <PublicationCard
                                  key={pub.id}
                                  pub={pub}
                                  accentIndex={currentIndex}
                                />
                              );
                            })}
                          </div>
                        </section>
                      ),
                    );
                  })()}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {sortedAndFiltered.map((pub, i) => (
                    <PublicationCard
                      key={pub.id}
                      pub={pub}
                      accentIndex={i}
                      showYearBadge
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {!loading && !error && publications.length === 0 && (
            <div className="text-center py-12 rounded-xl border border-dashed border-border bg-muted/30 px-4">
              <p className="text-muted-foreground text-base sm:text-lg mb-6">
                No public works were returned from this ORCID record.
              </p>
              <a
                href={ORCID_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-deep text-primary-foreground font-medium rounded-lg transition-colors text-sm sm:text-base"
              >
                View ORCID profile
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {!loading &&
            !error &&
            publications.length > 0 &&
            sortedAndFiltered.length === 0 && (
              <p className="text-center py-12 text-muted-foreground">
                No publications match your search.
              </p>
            )}
        </div>
      </div>
    </div>
  );
}
