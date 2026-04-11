"use client";

import { useEffect, useState } from "react";
import GalleryPageView from "@/components/gallery/GalleryPageView";
import { mergeGalleryPagePayload } from "@/data/gallery-defaults";
import type { GalleryPagePayload } from "@/data/gallery-page";
import { withLabPlaceholdersIfEmpty } from "@/data/gallery-lab-placeholders";
import {
  fetchGalleryPhotos,
  type GalleryPhoto,
} from "@/lib/gallery/supabase-gallery-photos";
import { fetchGalleryPageContent } from "@/lib/gallery/supabase-gallery-page";

export default function GalleryPage() {
  const [payload, setPayload] = useState<GalleryPagePayload>(() =>
    mergeGalleryPagePayload(null),
  );
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() =>
    withLabPlaceholdersIfEmpty([]),
  );

  useEffect(() => {
    let alive = true;
    void (async () => {
      const [p, ph] = await Promise.all([
        fetchGalleryPageContent(),
        fetchGalleryPhotos(),
      ]);
      if (!alive) return;
      setPayload(p);
      setPhotos(withLabPlaceholdersIfEmpty(ph));
    })();
    return () => {
      alive = false;
    };
  }, []);

  return <GalleryPageView payload={payload} photos={photos} />;
}
