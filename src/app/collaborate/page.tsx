"use client";

import { useCallback, useEffect, useState } from "react";
import CollaboratePageView from "@/components/collaborate/CollaboratePageView";
import { mergeCollaboratePayload } from "@/data/collaborate-defaults";
import { fetchCollaborateContent } from "@/lib/collaborate/supabase-collaborate-page";

export default function CollaboratePage() {
  const [data, setData] = useState(() => mergeCollaboratePayload(null));

  const load = useCallback(async () => {
    const content = await fetchCollaborateContent();
    setData(content);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return <CollaboratePageView content={data} />;
}
