import { mergeGalleryPagePayload } from "@/data/gallery-defaults";
import type { GalleryPagePayload } from "@/data/gallery-page";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/database.types";

export const GALLERY_PAGE_ROW_ID = "default";

export async function fetchGalleryPageContent(): Promise<GalleryPagePayload> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("gallery_page_settings")
      .select("payload")
      .eq("id", GALLERY_PAGE_ROW_ID)
      .maybeSingle();
    if (error) {
      console.warn("[gallery]", error.message);
      return mergeGalleryPagePayload(null);
    }
    return mergeGalleryPagePayload(data?.payload ?? null);
  } catch {
    return mergeGalleryPagePayload(null);
  }
}

export async function fetchGalleryPageRowForAdmin(): Promise<{
  payload: GalleryPagePayload;
  updatedAt: string | null;
}> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("gallery_page_settings")
    .select("payload,updated_at")
    .eq("id", GALLERY_PAGE_ROW_ID)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const merged = mergeGalleryPagePayload(data?.payload ?? null);
  return {
    payload: merged,
    updatedAt: data?.updated_at ?? null,
  };
}

export async function saveGalleryPagePayload(
  payload: GalleryPagePayload,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const now = new Date().toISOString();
  const jsonPayload = JSON.parse(JSON.stringify(payload)) as Json;
  const { error } = await supabase.from("gallery_page_settings").upsert(
    {
      id: GALLERY_PAGE_ROW_ID,
      payload: jsonPayload,
      updated_at: now,
    },
    { onConflict: "id" },
  );
  if (error) throw new Error(error.message);
}

export function getGalleryPageDefaultsForAdmin(): GalleryPagePayload {
  return structuredClone(mergeGalleryPagePayload(null));
}
