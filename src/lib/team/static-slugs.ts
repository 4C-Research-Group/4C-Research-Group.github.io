import { createClient } from "@supabase/supabase-js";
import {
  LEGACY_TEAM_MEMBER_SLUGS,
  teamAlumni,
  teamMembers,
} from "@/data/team";
import type { Database } from "@/lib/supabase/database.types";

/** All `/team/[slug]/` paths for static export: static seed data plus DB slugs at build time when env is set. */
export async function getAllTeamMemberSlugsForStaticParams(): Promise<
  { slug: string }[]
> {
  const slugSet = new Set<string>();
  for (const m of teamMembers) slugSet.add(m.slug);
  for (const m of teamAlumni) slugSet.add(m.slug);
  for (const legacy of Object.keys(LEGACY_TEAM_MEMBER_SLUGS)) {
    slugSet.add(legacy);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_KEY;
  if (url && key) {
    try {
      const supabase = createClient<Database>(url, key);
      const { data, error } = await supabase
        .from("team_members")
        .select("slug");
      if (!error && data) {
        for (const row of data) {
          if (row.slug) slugSet.add(row.slug);
        }
      }
    } catch {
      /* build without live DB */
    }
  }

  return Array.from(slugSet).sort().map((slug) => ({ slug }));
}
