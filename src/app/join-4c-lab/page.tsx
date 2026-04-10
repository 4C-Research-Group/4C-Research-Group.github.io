"use client";

import { useEffect, useState } from "react";
import Join4cLabView from "@/components/join-4c-lab/Join4cLabView";
import { mergeJoin4cLabPayload } from "@/data/join-4c-lab-defaults";
import { fetchJoin4cLabContent } from "@/lib/join-4c-lab/supabase-join-page";

export default function Join4CLabPage() {
  const [data, setData] = useState(() => mergeJoin4cLabPayload(null));

  useEffect(() => {
    let alive = true;
    void (async () => {
      const content = await fetchJoin4cLabContent();
      if (alive) setData(content);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return <Join4cLabView content={data} />;
}
