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
    (e) => (e["external-id-type"] || "").toLowerCase() === "doi"
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
    const doi = extractDoi(s);
    const url = s.url?.value?.trim() || null;
    const link = doi ? `https://doi.org/${doi}` : url;

    out.push({
      id: String(putCode),
      title,
      journal: s["journal-title"]?.value?.trim() || null,
      year: Number.isFinite(year as number) ? year : null,
      type: formatWorkType(s.type),
      doi,
      url: link,
    });
  }

  return out;
}

export async function fetchOrcidPublications(
  orcidId: string
): Promise<OrcidPublication[]> {
  const clean = orcidId.replace(/https?:\/\/orcid\.org\//i, "").trim();
  const url = `https://pub.orcid.org/v3.0/${clean}/works`;
  const res = await fetch(url, {
    headers: { Accept: ORCID_ACCEPT },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Could not load works from ORCID (${res.status})`);
  }
  const data = await res.json();
  return mapOrcidWorksResponse(data);
}

export const DEFAULT_ORCID_ID = "0000-0002-2599-9119";
