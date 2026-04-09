import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { getKmModuleSlugsForStaticExport } from "@/lib/km/resolve-km-slugs";
import { getResearchProjectSlugsForStaticExport } from "@/lib/projects/resolve-project-params";
import { getAllTeamMemberSlugsForStaticParams } from "@/lib/team/static-slugs";
import { absoluteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

/** Indexable static routes (no `admin`, `dashboard`, or auth). */
const STATIC_PATHS = [
  "",
  "about",
  "about-pi",
  "accessibility",
  "blog",
  "blog/view",
  "collaborate",
  "contact",
  "gallery",
  "join-4c-lab",
  "knowledge-mobilization",
  "knowledge-mobilization/certificate",
  "projects",
  "projects/view",
  "publications",
  "research",
  "team",
  "privacy-policy",
  "terms-of-service",
] as const;

async function publishedBlogViewUrls(): Promise<string[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY?.trim();
  if (!url || !key) return [];
  try {
    const supabase = createClient<Database>(url, key);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("published", true);
    if (error || !data?.length) return [];
    return data
      .map((r) => r.slug?.trim())
      .filter(Boolean)
      .map((slug) => {
        const u = new URL(absoluteUrl("blog/view"));
        u.searchParams.set("slug", slug!);
        return u.toString();
      });
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastMod = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: path === "" ? absoluteUrl("") : absoluteUrl(path),
    lastModified: lastMod,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.includes("knowledge-mobilization") ? 0.85 : 0.7,
  }));

  const [teamParams, projectIds, kmSlugs, blogUrls] = await Promise.all([
    getAllTeamMemberSlugsForStaticParams(),
    getResearchProjectSlugsForStaticExport(),
    getKmModuleSlugsForStaticExport(),
    publishedBlogViewUrls(),
  ]);

  const teamEntries: MetadataRoute.Sitemap = teamParams.map(({ slug }) => ({
    url: absoluteUrl(`team/${slug}`),
    lastModified: lastMod,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const projectEntries: MetadataRoute.Sitemap = projectIds.map((id) => ({
    url: absoluteUrl(`projects/${id}`),
    lastModified: lastMod,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const kmEntries: MetadataRoute.Sitemap = kmSlugs.map((moduleSlug) => ({
    url: absoluteUrl(`knowledge-mobilization/${moduleSlug}`),
    lastModified: lastMod,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogUrls.map((url) => ({
    url,
    lastModified: lastMod,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...teamEntries,
    ...projectEntries,
    ...kmEntries,
    ...blogEntries,
  ];
}
