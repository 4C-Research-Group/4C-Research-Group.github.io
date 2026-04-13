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
      <div className="flex min-h-[50vh] items-center justify-center bg-background text-sm text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-9 w-9 animate-spin rounded-full border-2 border-brand/30 border-t-brand"
            aria-hidden
          />
          <span>Loading…</span>
        </div>
      </div>
    );
  }

  return <ResearchPageView document={doc} />;
}
