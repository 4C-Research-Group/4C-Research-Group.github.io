"use client";

import { useEffect, useState } from "react";
import GalleryPageView from "@/components/gallery/GalleryPageView";
import { mergeGalleryPagePayload } from "@/data/gallery-defaults";
import type { GalleryPagePayload } from "@/data/gallery-page";
import { fetchGalleryPageContent } from "@/lib/gallery/supabase-gallery-page";

export default function GalleryPage() {
  const [payload, setPayload] = useState<GalleryPagePayload>(() =>
    mergeGalleryPagePayload(null),
  );

  useEffect(() => {
    let alive = true;
    void (async () => {
      const data = await fetchGalleryPageContent();
      if (alive) setPayload(data);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return <GalleryPageView payload={payload} />;
}
