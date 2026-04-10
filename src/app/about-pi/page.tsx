"use client";

import { useEffect, useState } from "react";
import AboutPiView from "@/components/about-pi/AboutPiView";
import { mergeAboutPiPayload } from "@/data/about-pi-defaults";
import { fetchAboutPiContent } from "@/lib/about-pi/supabase-about-pi";

export default function AboutPiPage() {
  const [data, setData] = useState(() => mergeAboutPiPayload(null));

  useEffect(() => {
    let alive = true;
    void (async () => {
      const content = await fetchAboutPiContent();
      if (alive) setData(content);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return <AboutPiView d={data} />;
}
