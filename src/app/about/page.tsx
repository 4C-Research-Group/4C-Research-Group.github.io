"use client";

import { useEffect, useState } from "react";
import { mergeAboutPayload } from "@/data/about-defaults";
import { fetchAboutContent } from "@/lib/about/supabase-about";
import AboutMain from "@/components/about/AboutMain";

export default function AboutPage() {
  const [about, setAbout] = useState(() => mergeAboutPayload(null));

  useEffect(() => {
    let alive = true;
    void (async () => {
      const content = await fetchAboutContent();
      if (alive) setAbout(content);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return <AboutMain about={about} />;
}
