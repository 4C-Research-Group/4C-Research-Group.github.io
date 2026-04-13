"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Brain,
  Building,
  Calendar,
  ChevronRight,
  Eye,
  BookOpen,
  Filter,
  FolderKanban,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { fallbackProjects, type Project } from "@/data/projectsData";
import { fetchPublishedProjectsFromSupabase } from "@/lib/projects/supabase-projects";
import { projectDetailHref } from "@/lib/projects/project-detail-href";

const statusStyles: Record<
  Project["status"],
  string
> = {
  active:
    "border-care/35 bg-care/15 text-care backdrop-blur-sm dark:bg-care/20 dark:text-care",
  completed:
    "border-cognition/35 bg-cognition/15 text-cognition backdrop-blur-sm dark:bg-cognition/20 dark:text-cognition",
  upcoming:
    "border-brand/40 bg-brand/12 text-brand backdrop-blur-sm dark:bg-brand/18 dark:text-brand",
};

const categoryIcons: Record<string, typeof Brain> = {
  "Implementation Science": Brain,
  "Clinical Research": Activity,
  "Clinical Trial": Eye,
  Registry: BookOpen,
};

function categoryIconFor(cat: string) {
  return categoryIcons[cat] ?? Brain;
}

export default function ProjectsPage() {
  const reduceMotion = useReducedMotion();
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    let alive = true;
    void (async () => {
      const remote = await fetchPublishedProjectsFromSupabase();
      if (!alive || !remote?.length) return;
      setProjects(remote);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category)));
    return ["all", ...cats];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const categoryMatch =
        selectedCategory === "all" || project.category === selectedCategory;
      const statusMatch =
        selectedStatus === "all" || project.status === selectedStatus;
      const searchMatch =
        searchQuery === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      return categoryMatch && statusMatch && searchMatch;
    });
  }, [projects, selectedCategory, selectedStatus, searchQuery]);

  const activeCount = useMemo(
    () => projects.filter((p) => p.status === "active").length,
    [projects],
  );

  const chipBase =
    "rounded-full border px-3.5 py-2 text-xs font-semibold transition-all duration-200 sm:text-sm";
  const chipIdle =
    "border-border/80 bg-background/80 text-muted-foreground hover:border-brand/25 hover:bg-muted/60 hover:text-foreground";
  const chipOn =
    "border-brand/30 bg-brand text-primary-foreground shadow-md shadow-brand/15";

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-slate-50/95 via-background to-background">
        <div
          className="pointer-events-none absolute inset-0 bg-grid-black/5 mask-[linear-gradient(180deg,white,transparent_80%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 top-0 h-[26rem] w-[26rem] rounded-full bg-brand/12 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-cognition/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-care/8 blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(260px,340px)] lg:gap-14">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center lg:text-left"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand sm:text-[13px]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Active research
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                  Research projects
                </span>
                <span className="mt-3 block text-2xl font-semibold leading-snug tracking-tight text-muted-foreground sm:text-3xl lg:text-[1.65rem]">
                  Advancing pediatric critical care
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
                Outcome-focused work across implementation science, clinical
                research, and trials—supporting brain health in critically ill
                children.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-xl border border-cognition/20 bg-cognition/5 px-3 py-2 text-xs font-medium text-cognition sm:text-sm">
                  <Brain className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  Implementation science
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-consciousness/20 bg-consciousness/5 px-3 py-2 text-xs font-medium text-consciousness sm:text-sm">
                  <Activity
                    className="h-4 w-4 shrink-0 opacity-90"
                    aria-hidden
                  />
                  Clinical research
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-care/20 bg-care/5 px-3 py-2 text-xs font-medium text-care sm:text-sm">
                  <Eye className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  Clinical trials
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.55,
                delay: reduceMotion ? 0 : 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative mx-auto w-full max-w-sm lg:mx-0"
            >
              <div
                className="absolute -inset-1 rounded-[1.35rem] bg-linear-to-br from-cognition/15 via-brand/12 to-care/15 opacity-90 blur-sm"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/90 p-6 shadow-lg ring-1 ring-black/[0.04] backdrop-blur-md sm:p-7">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/12 text-brand">
                    <FolderKanban className="h-5 w-5" aria-hidden />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    Portfolio snapshot
                  </p>
                </div>
                <dl className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border/50 bg-muted/20 px-4 py-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Total
                    </dt>
                    <dd className="mt-1 text-2xl font-bold tabular-nums text-foreground">
                      {projects.length}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-muted/20 px-4 py-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Active
                    </dt>
                    <dd className="mt-1 text-2xl font-bold tabular-nums text-care">
                      {activeCount}
                    </dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  Use filters below to explore by category, status, or keyword.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:py-14">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
          className="mb-10 overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-5 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-6"
        >
          <div className="relative mb-6 max-w-2xl">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search by title, description, or tags…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border/80 bg-background/90 py-3.5 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground/80 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:text-[15px]"
            />
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                <Filter className="h-4 w-4 shrink-0" aria-hidden />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Category
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`${chipBase} ${
                      selectedCategory === category ? chipOn : chipIdle
                    }`}
                  >
                    {category === "all" ? "All" : category}
                  </button>
                ))}
              </div>
            </div>

            <div className="shrink-0 lg:max-w-md">
              <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Status
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["all", "active", "completed", "upcoming"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`${chipBase} ${
                      selectedStatus === status ? chipOn : chipIdle
                    }`}
                  >
                    {status === "all"
                      ? "All"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-5">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredProjects.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {projects.length}
              </span>
            </p>
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-sm font-medium text-brand transition hover:text-brand-deep"
              >
                Clear search
              </button>
            ) : null}
          </div>
        </motion.div>

        {filteredProjects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {filteredProjects.map((project, index) => {
              const CategoryIcon = categoryIconFor(project.category);

              return (
                <motion.div
                  key={project.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.38,
                    delay: reduceMotion ? 0 : Math.min(index * 0.05, 0.35),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group h-full"
                >
                  <Link
                    href={projectDetailHref(project.id)}
                    className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-sm ring-1 ring-black/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-xl hover:shadow-brand/[0.06]">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={project.images[0] || "/images/placeholder.jpg"}
                          alt={project.title}
                          fill
                          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" aria-hidden />
                        <div className="absolute right-3 top-3">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize tracking-wide ${statusStyles[project.status]}`}
                          >
                            {project.status}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/95 text-brand shadow-md backdrop-blur-sm dark:border-white/10 dark:bg-background/90">
                            <CategoryIcon
                              className="h-5 w-5"
                              strokeWidth={1.75}
                              aria-hidden
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                          <span className="inline-flex rounded-lg bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand">
                            {project.category}
                          </span>
                          {project.funding ? (
                            <span className="inline-flex max-w-[55%] items-center gap-1 rounded-lg border border-border/60 bg-muted/30 px-2 py-1 text-[11px] text-muted-foreground">
                              <Building
                                className="h-3 w-3 shrink-0"
                                aria-hidden
                              />
                              <span className="truncate">{project.funding}</span>
                            </span>
                          ) : null}
                        </div>

                        <h2 className="text-lg font-bold leading-snug tracking-tight text-foreground transition group-hover:text-brand sm:text-xl line-clamp-2">
                          {project.title}
                        </h2>

                        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                          {project.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-muted/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 ? (
                            <span className="rounded-md bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                              +{project.tags.length - 3}
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground sm:text-xs">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" aria-hidden />
                              {new Date(project.startDate).getFullYear()}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" aria-hidden />
                              {project.teamMembers?.length ?? 0}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand transition group-hover:gap-1.5">
                            View
                            <ChevronRight
                              className="h-4 w-4"
                              aria-hidden
                            />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-dashed border-border/80 bg-muted/15 py-16 text-center"
          >
            <div className="mx-auto max-w-md px-4">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <Search className="h-7 w-7 text-muted-foreground" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No projects match
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try different filters or clear your search.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                  setSearchQuery("");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-brand-deep"
              >
                Reset filters
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
