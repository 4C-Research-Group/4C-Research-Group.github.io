"use client";

import { useEffect, useState } from "react";
import ResearchPageView from "@/components/research/ResearchPageView";
import { defaultResearchPageDocument } from "@/data/research-page-default";
import { mergeResearchPageDocument } from "@/lib/research-page/document";
import { fetchPublishedResearchPage } from "@/lib/research-page/supabase-research-page";
import type { ResearchPageDocument } from "@/lib/research-page/types";

export default function ResearchPage() {
  const [doc, setDoc] = useState<ResearchPageDocument | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const row = await fetchPublishedResearchPage();
        const merged = mergeResearchPageDocument(row?.document ?? null);
        if (!cancelled) setDoc(merged);
      } catch {
        if (!cancelled) setDoc(defaultResearchPageDocument());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!doc) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading…
    </div>
  );
}

  return <ResearchPageView document={doc} />;
}
