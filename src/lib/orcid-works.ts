/** ORCID Public API v3.0 — works list response (partial typing). */

type ExternalId = {
  "external-id-type"?: string;
  "external-id-value"?: string;
  "external-id-url"?: { value?: string } | null;
};

type WorkSummary = {
  "put-code"?: number;
  title?: {
    title?: { value?: string };
  };
  "journal-title"?: { value?: string };
  "publication-date"?: {
    year?: { value?: string };
    month?: { value?: string };
    day?: { value?: string };
  };
  type?: string;
  url?: { value?: string };
  "external-ids"?: { "external-id"?: ExternalId[] };
  "display-index"?: string | number;
  "last-modified-date"?: { value?: number };
};

type WorkGroup = {
  "work-summary"?: WorkSummary[];
};

export type OrcidPublication = {
  id: string;
  title: string;
  /** Comma-separated contributor names from ORCID work detail (when available). */
  authors: string | null;
  journal: string | null;
  year: number | null;
  type: string | null;
  doi: string | null;
  url: string | null;
};

const ORCID_ACCEPT = "application/vnd.orcid+json";

function pickBestSummary(summaries: WorkSummary[]): WorkSummary {
  return [...summaries].sort((a, b) => {
    const ia = Number(a["display-index"] ?? 0);
    const ib = Number(b["display-index"] ?? 0);
    if (ib !== ia) return ib - ia;
    const ta = a["last-modified-date"]?.value ?? 0;
    const tb = b["last-modified-date"]?.value ?? 0;
    return tb - ta;
  })[0];
}

function extractDoi(summary: WorkSummary): string | null {
  const ids = summary["external-ids"]?.["external-id"];
  if (!ids?.length) return null;
  const doi = ids.find(
    (e) => (e["external-id-type"] || "").toLowerCase() === "doi",
  );
  return doi?.["external-id-value"]?.trim() || null;
}

function formatWorkType(type: string | undefined): string | null {
  if (!type) return null;
  return type
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function mapOrcidWorksResponse(data: {
  group?: WorkGroup[];
}): OrcidPublication[] {
  const groups = data.group;
  if (!groups?.length) return [];

  const out: OrcidPublication[] = [];

  for (const group of groups) {
    const summaries = group["work-summary"];
    if (!summaries?.length) continue;
    const s = pickBestSummary(summaries);
    const putCode = s["put-code"];
    const title = s.title?.title?.value?.trim();
    if (!title || putCode == null) continue;

    const yearStr = s["publication-date"]?.year?.value;
    const year = yearStr ? parseInt(yearStr, 10) : null;

    let finalYear = year;

    // Special case for known 2026 publications
    if (
      title?.includes("Decannulation Decisions") ||
      title?.includes("Reconstructing the Evidence")
    ) {
      finalYear = 2026;
    }

    const doi = extractDoi(s);
    const url = s.url?.value?.trim() || null;
    const link = doi ? `https://doi.org/${doi}` : url;

    out.push({
      id: String(putCode),
      title,
      authors: null,
      journal: s["journal-title"]?.value?.trim() || null,
      year: Number.isFinite(finalYear as number) ? finalYear : null,
      type: formatWorkType(s.type),
      doi,
      url: link,
    });
  }

  return out;
}

type OrcidWorkContributor = {
  "credit-name"?: { value?: string };
};

type OrcidWorkDetail = {
  contributors?: { contributor?: OrcidWorkContributor[] };
};

async function fetchWorkAuthorsString(
  orcidClean: string,
  putCode: string,
): Promise<string | null> {
  const url = `https://pub.orcid.org/v3.0/${orcidClean}/work/${putCode}`;
  const res = await fetch(url, {
    headers: {
      Accept: ORCID_ACCEPT,
      "Accept-Encoding": "gzip, deflate, br",
    },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as OrcidWorkDetail;
  const contributors = data.contributors?.contributor;
  if (!Array.isArray(contributors) || contributors.length === 0) return null;
  const names = contributors
    .map((c) => c["credit-name"]?.value?.trim())
    .filter((n): n is string => Boolean(n));
  if (names.length === 0) return null;
  return names.join(", ");
}

const AUTHOR_ENRICH_BATCH = 8;

/** Fetches each work's detail so contributor names appear (ORCID list endpoint omits them). */
async function enrichWithAuthors(
  orcidClean: string,
  pubs: OrcidPublication[],
): Promise<OrcidPublication[]> {
  if (pubs.length === 0) return pubs;
  const out: OrcidPublication[] = [];
  for (let i = 0; i < pubs.length; i += AUTHOR_ENRICH_BATCH) {
    const slice = pubs.slice(i, i + AUTHOR_ENRICH_BATCH);
    const authorStrings = await Promise.all(
      slice.map((p) => fetchWorkAuthorsString(orcidClean, p.id)),
    );
    for (let j = 0; j < slice.length; j++) {
      out.push({ ...slice[j]!, authors: authorStrings[j]! });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Client-side cache — survives React re-renders and same-session page refreshes
// ---------------------------------------------------------------------------

/** TTL in milliseconds for in-memory and sessionStorage caches. */
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

type CacheEntry = {
  pubs: OrcidPublication[];
  fetchedAt: number;
};

/** Module-level memory cache: survives client-side navigation within the tab. */
const memoryCache = new Map<string, CacheEntry>();

const SESSION_KEY_PREFIX = "orcid_pubs_v1_";

function sessionGet(key: string): CacheEntry | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) {
      sessionStorage.removeItem(key);
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

function sessionSet(key: string, entry: CacheEntry): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // sessionStorage may be unavailable (SSR, private mode quota, etc.)
  }
}

/** In-flight promise deduplication — parallel callers share one fetch. */
const inFlight = new Map<string, Promise<OrcidPublication[]>>();

export async function fetchOrcidPublications(
  orcidId: string,
): Promise<OrcidPublication[]> {
  const clean = orcidId.replace(/https?:\/\/orcid\.org\//i, "").trim();
  const cacheKey = SESSION_KEY_PREFIX + clean;

  // 1. Memory cache hit (instant — same tab navigation)
  const mem = memoryCache.get(cacheKey);
  if (mem && Date.now() - mem.fetchedAt < CACHE_TTL_MS) {
    return mem.pubs;
  }

  // 2. sessionStorage hit (survives page refresh in the same session)
  const stored = sessionGet(cacheKey);
  if (stored) {
    memoryCache.set(cacheKey, stored);
    return stored.pubs;
  }

  // 3. Deduplicate concurrent callers (e.g. /publications + a team profile open at once)
  const existing = inFlight.get(cacheKey);
  if (existing) return existing;

  const promise = (async () => {
    const url = `https://pub.orcid.org/v3.0/${clean}/works`;
    const res = await fetch(url, {
      headers: {
        Accept: ORCID_ACCEPT,
        "Accept-Encoding": "gzip, deflate, br",
      },
    });
    if (!res.ok) {
      throw new Error(`Could not load works from ORCID (${res.status})`);
    }
    const data = await res.json();
    const list = mapOrcidWorksResponse(data);
    const pubs = await enrichWithAuthors(clean, list);

    const entry: CacheEntry = { pubs, fetchedAt: Date.now() };
    memoryCache.set(cacheKey, entry);
    sessionSet(cacheKey, entry);
    return pubs;
  })().finally(() => {
    inFlight.delete(cacheKey);
  });

  inFlight.set(cacheKey, promise);
  return promise;
}

/** Bust the cache for an ORCID ID (e.g. called by a manual refresh button). */
export function invalidateOrcidCache(orcidId: string): void {
  const clean = orcidId.replace(/https?:\/\/orcid\.org\//i, "").trim();
  const cacheKey = SESSION_KEY_PREFIX + clean;
  memoryCache.delete(cacheKey);
  try {
    sessionStorage.removeItem(cacheKey);
  } catch {
    // ignore
  }
}

export const DEFAULT_ORCID_ID = "0000-0002-2599-9119";

const AUTHOR_MATCH_SKIP = new Set([
  "dr",
  "mr",
  "mrs",
  "ms",
  "miss",
  "prof",
  "professor",
  "md",
  "phd",
  "msc",
  "bsc",
  "mba",
  "dds",
  "rn",
]);

function normalizeAuthorMatchString(s: string): string {
  return s
    .toLowerCase()
    .replace(/\./g, " ")
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Whether an ORCID contributor string lists this person (handles
 * "First Last", "Last, First", initials, and honorifics in the display name).
 */
export function orcidAuthorsIncludeMember(
  authors: string | null,
  memberDisplayName: string,
): boolean {
  if (!authors?.trim() || !memberDisplayName.trim()) return false;

  const hay = normalizeAuthorMatchString(authors);
  const full = normalizeAuthorMatchString(memberDisplayName);
  if (hay.includes(full)) return true;

  const tokens = full
    .split(/\s+/)
    .filter((t) => t.length > 0 && !AUTHOR_MATCH_SKIP.has(t));
  if (tokens.length === 0) return false;

  if (tokens.length === 1) {
    return hay.includes(tokens[0]!);
  }

  const last = tokens[tokens.length - 1]!;
  const first = tokens[0]!;

  if (!hay.includes(last)) return false;
  if (hay.includes(first)) return true;

  const fi = first[0]!;
  const initialLast = new RegExp(
    `\\b${escapeRegExp(fi)}\\.?\\s+(?:[a-z]\\.?\\s+)*${escapeRegExp(last)}\\b`,
    "i",
  );
  if (initialLast.test(hay)) return true;

  const lastFirst = normalizeAuthorMatchString(`${last}, ${first}`);
  if (hay.includes(lastFirst)) return true;

  return false;
}

/** Same works as `/publications`, limited to rows where the member appears in authors. */
export function filterOrcidPublicationsForMember(
  pubs: OrcidPublication[],
  memberDisplayName: string,
): OrcidPublication[] {
  const name = memberDisplayName.trim();
  if (!name) return [];
  return pubs.filter((p) => orcidAuthorsIncludeMember(p.authors, name));
}
