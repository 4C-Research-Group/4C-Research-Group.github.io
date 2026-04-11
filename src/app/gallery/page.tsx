"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import GalleryPageView from "@/components/gallery/GalleryPageView";
import { mergeGalleryPagePayload } from "@/data/gallery-defaults";
import type { GalleryPagePayload } from "@/data/gallery-page";
import { fetchGalleryPhotos, type GalleryPhoto } from "@/lib/gallery/supabase-gallery-photos";
import { fetchGalleryPageContent } from "@/lib/gallery/supabase-gallery-page";

export default function GalleryPage() {
  const [payload, setPayload] = useState<GalleryPagePayload>(() =>
    mergeGalleryPagePayload(null),
  );
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const [p, ph] = await Promise.all([fetchGalleryPageContent(), fetchGalleryPhotos()]);
      if (!alive) return;
      setPayload(p);
      setPhotos(ph);
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-background text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-brand" aria-hidden />
        <p className="text-sm">Loading gallery…</p>
      </div>
    );
  }

  return <GalleryPageView payload={payload} photos={photos} />;
}
