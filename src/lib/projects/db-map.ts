import type { Project, TeamMember } from "@/data/projectsData";
import type { Json } from "@/lib/supabase/database.types";
import type { Database } from "@/lib/supabase/database.types";

export type ResearchProjectRow =
  Database["public"]["Tables"]["research_projects"]["Row"];

function parseTeamMembers(raw: Json): TeamMember[] {
  if (!Array.isArray(raw)) return [];
  const out: TeamMember[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const name = typeof o.name === "string" ? o.name : "";
    const role = typeof o.role === "string" ? o.role : "";
    const image = typeof o.image === "string" ? o.image : undefined;
    if (name)
      out.push(image ? { name, role, image } : { name, role });
  }
  return out;
}

function parsePublications(
  raw: Json,
): NonNullable<Project["publications"]> {
  if (!Array.isArray(raw)) return [];
  const out: NonNullable<Project["publications"]> = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const title = typeof o.title === "string" ? o.title : "";
    const link = typeof o.link === "string" ? o.link : "";
    const date = typeof o.date === "string" ? o.date : "";
    if (title) out.push({ title, link, date });
  }
  return out;
}

function dateIso(d: string | null): string {
  if (!d) return "";
  return d.length >= 10 ? d.slice(0, 10) : d;
}

export function researchProjectRowToProject(row: ResearchProjectRow): Project {
  const gallery =
    row.gallery_urls?.filter(Boolean) ?? [];
  const images =
    gallery.length > 0 ? gallery : ["/images/placeholder.jpg"];

  return {
    id: row.slug,
    title: row.title,
    description: row.description,
    longDescription: row.long_description || undefined,
    category: row.category,
    status: row.status as Project["status"],
    startDate: dateIso(row.start_date),
    endDate: row.end_date ? dateIso(row.end_date) : undefined,
    images,
    tags: [...(row.tags ?? [])],
    link: row.link?.trim() || undefined,
    funding: row.funding?.trim() || undefined,
    objectives:
      row.objectives?.length ? [...row.objectives] : undefined,
    teamMembers: (() => {
      const t = parseTeamMembers(row.team_members as Json);
      return t.length > 0 ? t : undefined;
    })(),
    publications: (() => {
      const p = parsePublications(row.publications as Json);
      return p.length > 0 ? p : undefined;
    })(),
    additionalInfo: row.additional_info?.trim() || undefined,
  };
}

export function projectToResearchRowUpdate(
  p: Project,
  extra?: { published?: boolean; sort_order?: number },
): Database["public"]["Tables"]["research_projects"]["Update"] {
  return {
    slug: p.id,
    title: p.title,
    description: p.description,
    long_description: p.longDescription ?? "",
    category: p.category,
    status: p.status,
    start_date: p.startDate.slice(0, 10),
    end_date: p.endDate?.slice(0, 10) ?? null,
    link: p.link ?? "",
    funding: p.funding ?? "",
    additional_info: p.additionalInfo ?? "",
    tags: p.tags,
    objectives: p.objectives ?? [],
    team_members: (p.teamMembers ?? []) as unknown as Json,
    publications: (p.publications ?? []) as unknown as Json,
    gallery_urls: p.images.filter(Boolean),
    ...(extra?.published !== undefined ? { published: extra.published } : {}),
    ...(extra?.sort_order !== undefined ? { sort_order: extra.sort_order } : {}),
  };
}

export function projectToResearchInsert(
  p: Project,
  sort_order: number,
  published: boolean,
): Database["public"]["Tables"]["research_projects"]["Insert"] {
  return {
    slug: p.id,
    title: p.title,
    description: p.description,
    long_description: p.longDescription ?? "",
    category: p.category,
    status: p.status,
    start_date: p.startDate.slice(0, 10),
    end_date: p.endDate?.slice(0, 10) ?? null,
    link: p.link ?? "",
    funding: p.funding ?? "",
    additional_info: p.additionalInfo ?? "",
    tags: p.tags,
    objectives: p.objectives ?? [],
    team_members: (p.teamMembers ?? []) as unknown as Json,
    publications: (p.publications ?? []) as unknown as Json,
    gallery_urls: p.images.filter(Boolean),
    published,
    sort_order,
  };
}
