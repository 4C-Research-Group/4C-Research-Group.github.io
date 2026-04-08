import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  teamAlumni,
  type TeamMember,
  type TeamMemberCategory,
} from "@/data/team";
import {
  normalizePublicationStatus,
  type TeamPublicationStatus,
} from "@/lib/team/publication-status";

export type TeamMemberPortfolio = TeamMember & {
  id: string;
  bio: string;
  email: string;
  linkedinUrl: string;
  isAlumni: boolean;
};

export type TeamMemberPublication = {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  url: string;
  notes: string;
  status: TeamPublicationStatus;
  sortOrder: number;
};

/** Fallback when Supabase is unavailable: show card + superpower only. */
export function staticTeamMemberToPortfolio(m: TeamMember): TeamMemberPortfolio {
  const isAlumni = teamAlumni.some((a) => a.slug === m.slug);
  return {
    ...m,
    id: "",
    bio: "",
    email: "",
    linkedinUrl: "",
    isAlumni,
  };
}

function rowToMember(r: {
  id: string;
  slug: string;
  name: string;
  initials: string;
  role_title: string;
  category: string;
  superpower: string;
  photo_file: string;
  is_alumni: boolean;
  bio?: string | null;
  email?: string | null;
  linkedin_url?: string | null;
}): TeamMemberPortfolio {
  const cat = r.category === "student" ? "student" : "staff";
  return {
    id: r.id,
    slug: r.slug,
    photoFile: r.photo_file,
    name: r.name,
    initials: r.initials,
    role: r.role_title,
    category: cat as TeamMemberCategory,
    superpower: r.superpower,
    bio: (r.bio ?? "").trim(),
    email: (r.email ?? "").trim(),
    linkedinUrl: (r.linkedin_url ?? "").trim(),
    isAlumni: r.is_alumni,
  };
}

function rowToPublication(r: {
  id: string;
  title: string;
  authors: string | null;
  venue: string | null;
  year: string | null;
  url: string | null;
  notes: string | null;
  status: string | null;
  sort_order: number | null;
}): TeamMemberPublication {
  return {
    id: r.id,
    title: r.title,
    authors: r.authors ?? "",
    venue: r.venue ?? "",
    year: r.year ?? "",
    url: r.url ?? "",
    notes: r.notes ?? "",
    status: normalizePublicationStatus(r.status),
    sortOrder: r.sort_order ?? 0,
  };
}

export async function fetchTeamPortfolioBySlug(slug: string): Promise<{
  member: TeamMemberPortfolio | null;
  publications: TeamMemberPublication[];
  usedDatabase: boolean;
}> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data: row, error } = await supabase
      .from("team_members")
      .select(
        "id,slug,name,initials,role_title,category,superpower,photo_file,is_alumni,bio,email,linkedin_url"
      )
      .eq("slug", slug)
      .maybeSingle();
    if (error) {
      console.warn("[team portfolio]", error.message);
      return { member: null, publications: [], usedDatabase: false };
    }
    if (!row) {
      return { member: null, publications: [], usedDatabase: true };
    }
    const member = rowToMember(row);
    const { data: pubRows, error: pubErr } = await supabase
      .from("team_member_publications")
      .select(
        "id,title,authors,venue,year,url,notes,status,sort_order"
      )
      .eq("team_member_id", member.id)
      .order("sort_order", { ascending: true });
    if (pubErr) {
      console.warn("[team portfolio] pubs", pubErr.message);
      return { member, publications: [], usedDatabase: true };
    }
    return {
      member,
      publications: (pubRows ?? []).map(rowToPublication),
      usedDatabase: true,
    };
  } catch {
    return { member: null, publications: [], usedDatabase: false };
  }
}
