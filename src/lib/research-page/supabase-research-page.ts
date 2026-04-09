import type { ResearchPageDocument } from "@/lib/research-page/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/database.types";

export const RESEARCH_PAGE_SLUG = "main";

export type ResearchPageRow = {
  id: string;
  slug: string;
  document: Json;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export async function fetchPublishedResearchPage(): Promise<ResearchPageRow | null> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("research_page")
    .select("id, slug, document, published, created_at, updated_at")
    .eq("slug", RESEARCH_PAGE_SLUG)
    .eq("published", true)
    .maybeSingle();
  if (error || !data) return null;
  return data as ResearchPageRow;
}

export async function fetchResearchPageForAdmin(): Promise<ResearchPageRow | null> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("research_page")
    .select("id, slug, document, published, created_at, updated_at")
    .eq("slug", RESEARCH_PAGE_SLUG)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as ResearchPageRow | null;
}

export async function upsertResearchPageAdmin(payload: {
  document: ResearchPageDocument;
  published: boolean;
}): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("research_page").upsert(
    {
      slug: RESEARCH_PAGE_SLUG,
      document: payload.document as unknown as Json,
      published: payload.published,
    },
    { onConflict: "slug" },
  );
  if (error) throw new Error(error.message);
}
