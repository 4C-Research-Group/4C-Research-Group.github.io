import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Project } from "@/data/projectsData";
import { researchProjectRowToProject } from "@/lib/projects/db-map";

/** Published projects for public pages (anon key). */
export async function fetchPublishedProjectsFromSupabase(): Promise<
  Project[] | null
> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("research_projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });
    if (error) {
      console.warn("[projects]", error.message);
      return null;
    }
    if (!data?.length) return null;
    return data.map(researchProjectRowToProject);
  } catch {
    return null;
  }
}

export async function fetchProjectBySlugFromSupabase(
  slug: string,
): Promise<Project | null> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("research_projects")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) {
      console.warn("[projects]", error.message);
      return null;
    }
    if (!data) return null;
    return researchProjectRowToProject(data);
  } catch {
    return null;
  }
}

export type AdminResearchProjectRow = {
  project: Project;
  published: boolean;
  sort_order: number;
};

/** All rows for admin (includes drafts). */
export async function fetchAllResearchProjectsForAdmin(): Promise<
  AdminResearchProjectRow[]
> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("research_projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    project: researchProjectRowToProject(row),
    published: row.published,
    sort_order: row.sort_order,
  }));
}
