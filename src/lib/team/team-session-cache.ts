import type { TeamMember } from "@/data/team";

const STORAGE_KEY = "4c:team-cache-v1";

function isTeamMember(x: unknown): x is TeamMember {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  const cat = o.category;
  return (
    typeof o.slug === "string" &&
    typeof o.photoFile === "string" &&
    typeof o.name === "string" &&
    typeof o.initials === "string" &&
    typeof o.role === "string" &&
    typeof o.superpower === "string" &&
    (cat === "staff" || cat === "student")
  );
}

/** Last successful Supabase team payload for this tab (instant paint on revisit / refresh). */
export function readTeamSessionCache(): {
  members: TeamMember[];
  alumni: TeamMember[];
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const { members, alumni } = parsed as Record<string, unknown>;
    if (!Array.isArray(members) || !Array.isArray(alumni)) return null;
    if (!members.every(isTeamMember) || !alumni.every(isTeamMember)) {
      return null;
    }
    return {
      members: members as TeamMember[],
      alumni: alumni as TeamMember[],
    };
  } catch {
    return null;
  }
}

export function writeTeamSessionCache(
  members: TeamMember[],
  alumni: TeamMember[],
): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ members, alumni }));
  } catch {
    /* quota / private mode */
  }
}
