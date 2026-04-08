import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { TeamMember, TeamMemberCategory } from "@/data/team";

function rowToMember(r: {
  slug: string;
  name: string;
  initials: string;
  role_title: string;
  category: string;
  superpower: string;
  photo_file: string;
}): TeamMember {
  const cat = r.category === "student" ? "student" : "staff";
  return {
    slug: r.slug,
    photoFile: r.photo_file,
    name: r.name,
    initials: r.initials,
    role: r.role_title,
    category: cat as TeamMemberCategory,
    superpower: r.superpower,
  };
}

export type FetchTeamResult = {
  members: TeamMember[];
  alumni: TeamMember[];
  /** True when Supabase returned successfully (use data even if empty). False → use static fallback. */
  usedDatabase: boolean;
};

/** Loads team from public.team_members. On any error, usedDatabase is false (caller may fall back to static data). */
export async function fetchTeamFromSupabase(): Promise<FetchTeamResult> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("team_members")
      .select(
        "slug,name,initials,role_title,category,superpower,photo_file,is_alumni,sort_order"
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
    return { members: active, alumni: alum, usedDatabase: true };
  } catch {
    return { members: [], alumni: [], usedDatabase: false };
  }
}
