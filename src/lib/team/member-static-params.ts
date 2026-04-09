import {
  LEGACY_TEAM_MEMBER_SLUGS,
  teamAlumni,
  teamMembers,
} from "@/data/team";

/**
 * Slugs for `generateStaticParams` on `/team/[slug]`.
 * Keep this module free of Supabase so Turbopack + `output: "export"` can analyze it reliably.
 */
export function getTeamMemberSlugsForStaticExport(): { slug: string }[] {
  const slugSet = new Set<string>();
  for (const m of teamMembers) slugSet.add(m.slug);
  for (const m of teamAlumni) slugSet.add(m.slug);
  for (const legacy of Object.keys(LEGACY_TEAM_MEMBER_SLUGS)) {
    slugSet.add(legacy);
  }
  return Array.from(slugSet).sort().map((slug) => ({ slug }));
}
