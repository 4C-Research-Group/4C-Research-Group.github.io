import type { TeamMember, TeamMemberCategory } from "@/data/team";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { writeTeamSessionCache } from "@/lib/team/team-session-cache";

function rowToMember(r: {
  slug: string;
  name: string;
  initials: string;
  role_title: string;
  category: string;
  superpower: string;
  photo_file: string;
  degree?: string | null;
}): TeamMember {
  const cat = r.category === "student" ? "student" : "staff";
  const deg = (r.degree ?? "").trim();
  return {
    slug: r.slug,
    photoFile: r.photo_file,
    name: r.name,
    initials: r.initials,
    role: r.role_title,
    category: cat as TeamMemberCategory,
    superpower: r.superpower,
    ...(deg ? { degree: deg } : {}),
  };
}

export type FetchTeamResult = {
  members: TeamMember[];
  alumni: TeamMember[];
  /** True when Supabase returned successfully (use data even if empty). False → use static fallback. */
  usedDatabase: boolean;
};

let inFlightTeamFetch: Promise<FetchTeamResult> | null = null;

/** Loads team from public.team_members. On any error, usedDatabase is false (caller may fall back to static data). */
export async function fetchTeamFromSupabase(): Promise<FetchTeamResult> {
  if (inFlightTeamFetch) return inFlightTeamFetch;

  inFlightTeamFetch = (async (): Promise<FetchTeamResult> => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("team_members")
        .select(
          "slug,name,initials,role_title,category,superpower,photo_file,is_alumni,sort_order,degree"
        )
        .order("sort_order", { ascending: true });
      if (error) {
        console.warn("[team]", error.message);
        return { members: [], alumni: [], usedDatabase: false };
      }
      const rows = data ?? [];
      const active: TeamMember[] = [];
      const alum: TeamMember[] = [];
      for (const r of rows) {
        const m = rowToMember(r);
        if (r.is_alumni) alum.push(m);
        else active.push(m);
      }
      const result: FetchTeamResult = {
        members: active,
        alumni: alum,
        usedDatabase: true,
      };
      writeTeamSessionCache(active, alum);
      return result;
    } catch {
      return { members: [], alumni: [], usedDatabase: false };
    }
  })();

  try {
    return await inFlightTeamFetch;
  } finally {
    inFlightTeamFetch = null;
  }
}
