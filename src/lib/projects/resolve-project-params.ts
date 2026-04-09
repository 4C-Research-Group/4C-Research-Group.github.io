import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { fallbackProjects } from "@/data/projectsData";
import {
  researchProjectRowToProject,
  type ResearchProjectRow,
} from "@/lib/projects/db-map";
import type { Project } from "@/data/projectsData";

function supabaseKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}

/** Slugs for static export: DB published + bundled fallbacks. */
export async function getResearchProjectSlugsForStaticExport(): Promise<
  string[]
> {
  const slugSet = new Set<string>(fallbackProjects.map((p) => p.id));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = supabaseKey();
  if (url && key) {
    try {
      const supabase = createClient<Database>(url, key);
      const { data, error } = await supabase
        .from("research_projects")
        .select("slug")
        .eq("published", true);
      if (!error && data) {
        for (const row of data) {
          if (row.slug) slugSet.add(row.slug);
        }
      }
    } catch {
      /* build without live DB */
    }
  }
  return Array.from(slugSet).sort();
}

/** Build-time row for SSG; falls back to bundled data. */
export async function getResearchProjectForBuild(
  slug: string,
): Promise<Project | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = supabaseKey();
  if (url && key) {
    try {
      const supabase = createClient<Database>(url, key);
      const { data, error } = await supabase
        .from("research_projects")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (!error && data) {
        return researchProjectRowToProject(data as ResearchProjectRow);
      }
    } catch {
      /* fall through */
    }
  }
  const fb = fallbackProjects.find((p) => p.id === slug);
  return fb ?? null;
}
