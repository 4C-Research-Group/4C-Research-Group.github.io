/** One award entry for a team member profile (stored in team_members.awards jsonb). */

export type TeamMemberAward = {
  title: string;
  /** Organization or body that granted the award */
  issuer: string;
  year: string;
  details: string;
};

export function emptyTeamMemberAward(): TeamMemberAward {
  return { title: "", issuer: "", year: "", details: "" };
}

export function parseTeamMemberAwards(value: unknown): TeamMemberAward[] {
  if (!Array.isArray(value)) return [];
  const out: TeamMemberAward[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    out.push({
      title: typeof o.title === "string" ? o.title : "",
      issuer: typeof o.issuer === "string" ? o.issuer : "",
      year: typeof o.year === "string" ? o.year : "",
      details: typeof o.details === "string" ? o.details : "",
    });
  }
  return out;
}

/** Strip empty rows; keep entries with any non-whitespace field (title recommended). */
export function normalizeAwardsForDb(awards: TeamMemberAward[]): TeamMemberAward[] {
  return awards
    .map((a) => ({
      title: a.title.trim(),
      issuer: a.issuer.trim(),
      year: a.year.trim(),
      details: a.details.trim(),
    }))
    .filter((a) => a.title || a.issuer || a.year || a.details);
}

export function awardsPayloadEqual(a: TeamMemberAward[], b: TeamMemberAward[]): boolean {
  return (
    JSON.stringify(normalizeAwardsForDb(a)) === JSON.stringify(normalizeAwardsForDb(b))
  );
}
