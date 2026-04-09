import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { getModuleBySlug, kmModules } from "@/data/knowledge-mobilization";

function staticSlugs(): string[] {
  return [...kmModules].sort((a, b) => a.order - b.order).map((m) => m.slug);
}

/**
 * Slugs to pre-render for `output: "export"`. Uses Supabase at build time when env is set.
 */
export async function getKmModuleSlugsForStaticExport(): Promise<string[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return staticSlugs();
  try {
    const supabase = createClient<Database>(url, key);
    const { data, error } = await supabase
      .from("km_modules")
      .select("slug")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return staticSlugs();
    return data.map((r) => r.slug);
  } catch {
    return staticSlugs();
  }
}

export async function getKmModuleMetaForBuild(
  slug: string,
): Promise<{ title: string; summary: string } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const supabase = createClient<Database>(url, key);
      const { data, error } = await supabase
        .from("km_modules")
        .select("title, summary")
        .eq("slug", slug)
        .maybeSingle();
      if (!error && data) {
        return { title: data.title, summary: data.summary ?? "" };
      }
    } catch {
      /* fall through */
    }
  }
  const mod = getModuleBySlug(slug);
  if (!mod) return null;
  return { title: mod.title, summary: mod.summary };
}
