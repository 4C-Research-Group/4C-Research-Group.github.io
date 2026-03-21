"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, Loader2, RefreshCw, Search } from "lucide-react";
import { FaGoogle, FaOrcid, FaResearchgate } from "react-icons/fa";
import PageHero from "@/components/PageHero";
import { PublicationCard } from "@/components/PublicationCard";
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

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchOrcidPublications(DEFAULT_ORCID_ID);
      setPublications(data);
      setLastFetched(new Date());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error loading publications");
      setPublications([]);
    } finally {
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
          (pub.journal?.toLowerCase().includes(term) ?? false) ||
          (pub.doi?.toLowerCase().includes(term) ?? false) ||
          (pub.type?.toLowerCase().includes(term) ?? false)
      );
    }
    return pubs;
  }, [publications, sortBy, searchTerm]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <PageHero
        compact
        title="Publications"
        subtitle="Our latest research contributions and scholarly work"
      >
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-3 px-2">
          <a
            href={RESEARCHGATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-3 py-2 bg-card border border-border rounded-lg shadow-sm hover:shadow-md hover:border-brand/30 transition-all text-sm text-foreground"
          >
            <FaResearchgate className="text-green-600 mr-2 shrink-0 text-lg" />
            <span className="truncate">ResearchGate</span>
          </a>
          <a
            href={GOOGLE_SCHOLAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-3 py-2 bg-card border border-border rounded-lg shadow-sm hover:shadow-md hover:border-brand/30 transition-all text-sm text-foreground"
          >
            <FaGoogle className="text-blue-500 mr-2 shrink-0 text-lg" />
            <span className="truncate">Google Scholar</span>
          </a>
          <a
            href={ORCID_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-3 py-2 bg-card border border-border rounded-lg shadow-sm hover:shadow-md hover:border-brand/30 transition-all text-sm text-foreground"
          >
            <FaOrcid className="text-green-700 mr-2 shrink-0 text-lg" />
            <span className="truncate">ORCID</span>
          </a>
        </div>
      </PageHero>

      <div className="container mx-auto px-4 py-8 sm:py-10 max-w-7xl">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground">
            <p>
              Loaded live from{" "}
              <a
                href={ORCID_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:text-brand-deep font-medium"
              >
                ORCID
              </a>
              . New works you add there appear here on the next visit.
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
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-brand" />
              <p className="text-sm">Loading publications from ORCID…</p>
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
                  {groupByYear(sortedAndFiltered).map(
                    ([yearLabel, yearPubs], sectionIdx) => (
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
                        <div className="grid gap-5 sm:grid-cols-2">
                          {yearPubs.map((pub, i) => (
                            <PublicationCard
                              key={pub.id}
                              pub={pub}
                              accentIndex={sectionIdx * 48 + i}
                            />
                          ))}
                        </div>
                      </section>
                    )
                  )}
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
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
