import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  title: string;
  sort_order: number;
};

function mapRow(r: {
  id: string;
  src: string;
  alt: string | null;
  title: string | null;
  sort_order: number;
}): GalleryPhoto {
  return {
    id: r.id,
    src: r.src,
    alt: r.alt ?? "",
    title: r.title ?? "",
    sort_order: r.sort_order,
  };
}

/** Public site: all photos, stable order (safe for 150+ rows in one query). */
export async function fetchGalleryPhotos(): Promise<GalleryPhoto[]> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("id,src,alt,title,sort_order")
      .order("sort_order", { ascending: true });
    if (error) {
      console.warn("[gallery_photos]", error.message);
      return [];
    }
    return (data ?? []).map((r) => mapRow(r as Parameters<typeof mapRow>[0]));
  } catch {
    return [];
  }
}

export async function fetchGalleryPhotosForAdmin(): Promise<GalleryPhoto[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("id,src,alt,title,sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => mapRow(r as Parameters<typeof mapRow>[0]));
}

export async function insertGalleryPhoto(input: {
  src: string;
  alt?: string;
  title?: string;
  sort_order?: number;
}): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  let sort_order = input.sort_order;
  if (sort_order === undefined) {
    const { data: maxRow } = await supabase
      .from("gallery_photos")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    sort_order = (maxRow?.sort_order ?? -1) + 1;
  }
  const { error } = await supabase.from("gallery_photos").insert({
    src: input.src,
    alt: input.alt ?? "",
    title: input.title ?? "",
    sort_order,
  });
  if (error) throw new Error(error.message);
}

export async function updateGalleryPhoto(
  id: string,
  patch: Partial<Pick<GalleryPhoto, "src" | "alt" | "title" | "sort_order">>,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("gallery_photos").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteGalleryPhoto(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Set sort_order to 0..n-1 in the given order. */
export async function reorderGalleryPhotos(orderedIds: string[]): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("gallery_photos")
      .update({ sort_order: i })
      .eq("id", orderedIds[i]!);
    if (error) throw new Error(error.message);
  }
}
