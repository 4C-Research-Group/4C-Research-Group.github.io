"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { fallbackProjectBySlug } from "@/data/projectsData";
import type { Project } from "@/data/projectsData";
import { fetchProjectBySlugFromSupabase } from "@/lib/projects/supabase-projects";
import ProjectClient from "../[id]/ProjectClient";

/** `undefined` = loading, `null` = not found */
function ProjectLoader({ id }: { id: string }) {
  const [initial, setInitial] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const remote = await fetchProjectBySlugFromSupabase(id);
      if (cancelled) return;
      if (remote) {
        setInitial(remote);
        return;
      }
      const fb = fallbackProjectBySlug(id);
      setInitial(fb ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (initial === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" aria-label="Loading" />
      </div>
    );
  }

  if (initial === null) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">
          This project is not available. It may be unpublished, removed, or the
          link is wrong.
        </p>
        <Link
          href="/projects/"
          className="text-sm font-medium text-brand hover:underline"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  return <ProjectClient initialProject={initial} />;
}

function ProjectViewBody() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id")?.trim() ?? "";

  if (!id) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">Missing project id.</p>
        <Link
          href="/projects/"
          className="text-sm font-medium text-brand hover:underline"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  return <ProjectLoader key={id} id={id} />;
}

export default function ProjectViewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand" aria-label="Loading" />
        </div>
      }
    >
      <ProjectViewBody />
    </Suspense>
  );
}
