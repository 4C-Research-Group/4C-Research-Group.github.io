import { createClient } from "@supabase/supabase-js";
import { getTeamMemberSlugsForStaticExport } from "@/lib/team/member-static-params";
import type { Database } from "@/lib/supabase/database.types";

/** Sitemap: static slugs plus any extra `team_members.slug` values from Supabase at build time. */
export async function getAllTeamMemberSlugsForStaticParams(): Promise<
  { slug: string }[]
> {
  const slugSet = new Set<string>();
  for (const { slug } of getTeamMemberSlugsForStaticExport()) {
    slugSet.add(slug);
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

export { getTeamMemberSlugsForStaticExport } from "@/lib/team/member-static-params";
