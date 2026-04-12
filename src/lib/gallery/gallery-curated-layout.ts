import {
  defaultGalleryCuratedPhotoAssignments,
  GALLERY_CURATED_COUNT,
  GALLERY_EVENTS_TILE_COUNT,
  GALLERY_LAB_TILE_COUNT,
  type GalleryPagePayload,
} from "@/data/gallery-page";
import type { GalleryPhoto } from "@/lib/gallery/supabase-gallery-photos";

function slotPhoto(
  photos: GalleryPhoto[],
  pickId: string | null | undefined,
  fallbackIndex: number,
): GalleryPhoto | undefined {
  if (pickId) {
    const hit = photos.find((p) => p.id === pickId);
    if (hit) return hit;
  }
  return photos[fallbackIndex];
}

/**
 * Builds the hero, side strip, events grid, lab grid, and archive from gallery order
 * plus optional per-slot photo picks in the page payload.
 */
export function resolveGalleryCuratedPhotos(
  photos: GalleryPhoto[],
  payload: GalleryPagePayload,
): {
  hero: GalleryPhoto | undefined;
  sideStrip: GalleryPhoto[];
  events: GalleryPhoto[];
  labGrid: GalleryPhoto[];
  archive: GalleryPhoto[];
} {
  const a =
    payload.curatedPhotoAssignments ?? defaultGalleryCuratedPhotoAssignments();

  const hero = slotPhoto(photos, a.featuredPhotoId, 0);
  const sideStrip = photos.slice(1, 3);

  const events: GalleryPhoto[] = [];
  for (let i = 0; i < GALLERY_EVENTS_TILE_COUNT; i++) {
    const slot = slotPhoto(photos, a.eventsPhotoIds[i] ?? null, 3 + i);
    if (slot) events.push(slot);
  }

  const labGrid: GalleryPhoto[] = [];
  for (let i = 0; i < GALLERY_LAB_TILE_COUNT; i++) {
    const slot = slotPhoto(photos, a.labPhotoIds[i] ?? null, 9 + i);
    if (slot) labGrid.push(slot);
  }

  const archive = photos.slice(GALLERY_CURATED_COUNT);

  return { hero, sideStrip, events, labGrid, archive };
}
