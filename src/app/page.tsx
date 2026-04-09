"use client";

import { useState, useEffect } from "react";
import { fallbackProjects } from "@/data/projectsData";
import { mergeHomepagePayload } from "@/data/homepage-defaults";
import { fetchPublishedProjectsFromSupabase } from "@/lib/projects/supabase-projects";
import { fetchHomepageContent } from "@/lib/homepage/supabase-homepage";
import HomeMain from "@/components/home/HomeMain";
import type { Project } from "@/data/projectsData";

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>(() =>
    fallbackProjects.slice(0, 3),
  );
  const [home, setHome] = useState(() => mergeHomepagePayload(null));

  useEffect(() => {
    let alive = true;
    void (async () => {
      const [projects, content] = await Promise.all([
        fetchPublishedProjectsFromSupabase(),
        fetchHomepageContent(),
      ]);
      if (!alive) return;
      if (projects?.length) {
        setFeaturedProjects(projects.slice(0, 3));
      }
      setHome(content);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return <HomeMain home={home} featuredProjects={featuredProjects} />;
}
