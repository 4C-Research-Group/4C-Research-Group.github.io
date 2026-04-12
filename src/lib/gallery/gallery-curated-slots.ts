import { GALLERY_CURATED_COUNT } from "@/data/gallery-page";
import type { GalleryPhoto } from "@/lib/gallery/supabase-gallery-photos";

/**
 * Build the photo list shown on `/gallery`: first 19 slots follow manual picks where set,
 * then remaining photos in `sort_order` for the archive.
 */
export function orderGalleryPhotosForView(
  sortedPhotos: GalleryPhoto[],
  curatedSlotPhotoIds: string[] | undefined | null,
): GalleryPhoto[] {
  const n = GALLERY_CURATED_COUNT;
  const raw = Array.isArray(curatedSlotPhotoIds) ? curatedSlotPhotoIds : [];
  const slots: string[] = [];
  for (let i = 0; i < n; i++) {
    slots.push(typeof raw[i] === "string" ? raw[i]!.trim() : "");
  }

  const byId = new Map(sortedPhotos.map((p) => [p.id, p] as const));
  const used = new Set<string>();
  const placed: (GalleryPhoto | null)[] = Array(n).fill(null);

  for (let i = 0; i < n; i++) {
    const id = slots[i] ?? "";
    if (!id) continue;
    const p = byId.get(id);
    if (p && !used.has(p.id)) {
      placed[i] = p;
      used.add(p.id);
    }
  }

  const pool = sortedPhotos.filter((p) => !used.has(p.id));
  for (let i = 0; i < n; i++) {
    if (placed[i] == null && pool.length > 0) {
      const next = pool.shift()!;
      placed[i] = next;
      used.add(next.id);
    }
  }

  const curatedOrdered = placed.filter((x): x is GalleryPhoto => x != null);
  const archive = sortedPhotos.filter((p) => !used.has(p.id));
  return [...curatedOrdered, ...archive];
}
