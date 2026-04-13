"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  Users,
  Tag,
  ExternalLink,
  ArrowLeft,
  Brain,
  Activity,
  Eye,
  BookOpen,
  Target,
  FileText,
  Share2,
  Link2,
  Check,
} from "lucide-react";
import { type Project } from "@/data/projectsData";
import { fetchProjectBySlugFromSupabase } from "@/lib/projects/supabase-projects";

const categoryIcons = {
  "Implementation Science": Brain,
  "Clinical Research": Activity,
  "Clinical Trial": Eye,
  Registry: BookOpen,
};

const statusStyles: Record<Project["status"], string> = {
  active: "border-care/35 bg-care/10 text-care",
  completed: "border-cognition/35 bg-cognition/15 text-cognition",
  upcoming:
    "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100",
};

interface ProjectClientProps {
  initialProject: Project;
}

export default function ProjectClient({ initialProject }: ProjectClientProps) {
  const [project, setProject] = useState(initialProject);
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();
  const spring = [0.22, 1, 0.36, 1] as const;
  const fadeUp = reduceMotion ? undefined : { opacity: 0, y: 16 };

  useEffect(() => {
    setProject(initialProject);
  }, [initialProject]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const live = await fetchProjectBySlugFromSupabase(initialProject.id);
      if (!cancelled && live) setProject(live);
    })();
    return () => {
      cancelled = true;
    };
  }, [initialProject.id]);

  const CategoryIcon =
    categoryIcons[project.category as keyof typeof categoryIcons] || Brain;

  const yearRange = `${new Date(project.startDate).getFullYear()} – ${
    project.endDate
      ? new Date(project.endDate).getFullYear()
      : "Present"
  }`;

  const teamCount = project.teamMembers?.length ?? 0;

  async function copyPageUrl() {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const heroImage = project.images[0] || "/images/placeholder.jpg";

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

        <div className="container relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_minmax(280px,480px)] lg:gap-12">
            <motion.div
              initial={fadeUp}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.5,
                ease: spring,
              }}
              className="text-center lg:text-left"
            >
              <Link
                href="/projects/"
                className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-background/80 px-4 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-black/[0.04] backdrop-blur-sm transition hover:border-brand/30 hover:text-brand"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
                Back to projects
              </Link>

              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1.5 text-xs font-semibold text-brand sm:text-[13px]">
                  <CategoryIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {project.category}
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize sm:text-[13px] ${statusStyles[project.status]}`}
                >
                  {project.status}
                </span>
              </div>

              <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                  {project.title}
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
                {project.description}
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-xl border border-cognition/20 bg-cognition/5 px-3 py-2 text-xs font-medium text-cognition sm:text-sm">
                  <Calendar className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  {yearRange}
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-consciousness/20 bg-consciousness/5 px-3 py-2 text-xs font-medium text-consciousness sm:text-sm">
                  <Users className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  {teamCount} team member{teamCount === 1 ? "" : "s"}
                </span>
              </div>

              {project.link ? (
                <div className="mt-8 flex justify-center lg:justify-start">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-brand-deep"
                  >
                    Project site
                    <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                  </a>
                </div>
              ) : null}
            </motion.div>

            <motion.div
              initial={fadeUp}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.55,
                delay: reduceMotion ? 0 : 0.06,
                ease: spring,
              }}
              className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none"
            >
              <div
                className="absolute -inset-1 rounded-[1.35rem] bg-linear-to-br from-cognition/15 via-brand/12 to-care/15 opacity-90 blur-sm"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg ring-1 ring-black/[0.04]">
                <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
                  <Image
                    src={heroImage}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 480px"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="relative">
        <div
          className="pointer-events-none absolute left-[max(0px,calc(50%-40rem))] top-20 h-72 w-72 rounded-full bg-cognition/6 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-[max(0px,calc(50%-38rem))] top-32 h-64 w-64 rounded-full bg-brand/6 blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
            <div className="space-y-10 lg:col-span-2">
              <motion.section
                initial={fadeUp}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.45,
                  ease: spring,
                }}
                className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-8"
              >
                <div className="mb-4 h-1 w-14 rounded-full bg-linear-to-r from-cognition via-brand to-care" />
                <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  Overview
                </h2>
                <div className="prose prose-lg mt-4 max-w-none text-muted-foreground prose-p:leading-relaxed">
                  <p>{project.longDescription || project.description}</p>
                </div>
              </motion.section>

              {project.objectives && project.objectives.length > 0 ? (
                <motion.section
                  initial={fadeUp}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.45,
                    delay: reduceMotion ? 0 : 0.04,
                    ease: spring,
                  }}
                  className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-8"
                >
                  <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/12 text-brand">
                      <Target className="h-4 w-4" aria-hidden />
                    </span>
                    Objectives
                  </h2>
                  <ul className="mt-6 space-y-3">
                    {project.objectives.map((objective, index) => (
                      <motion.li
                        key={index}
                        initial={
                          reduceMotion ? false : { opacity: 0, x: -12 }
                        }
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.35,
                          delay: reduceMotion ? 0 : 0.05 + index * 0.05,
                          ease: spring,
                        }}
                        className="flex gap-3 rounded-2xl border border-border/50 bg-muted/15 px-4 py-3 text-sm leading-relaxed text-muted-foreground sm:text-base"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                          aria-hidden
                        />
                        <span>{objective}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.section>
              ) : null}

              {project.teamMembers && project.teamMembers.length > 0 ? (
                <motion.section
                  initial={fadeUp}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.45,
                    delay: reduceMotion ? 0 : 0.06,
                    ease: spring,
                  }}
                >
                  <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-consciousness/12 text-consciousness">
                      <Users className="h-4 w-4" aria-hidden />
                    </span>
                    Team members
                  </h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {project.teamMembers.map((member, index) => (
                      <motion.div
                        key={index}
                        initial={
                          reduceMotion ? false : { opacity: 0, y: 10 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.35,
                          delay: reduceMotion ? 0 : 0.04 + index * 0.05,
                          ease: spring,
                        }}
                        className="flex items-center justify-between gap-3 rounded-3xl border border-border/60 bg-card/80 p-4 shadow-sm ring-1 ring-black/[0.03] transition hover:border-brand/20 hover:shadow-md"
                      >
                        <div className="min-w-0">
                          <h3 className="font-semibold tracking-tight text-foreground">
                            {member.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {member.role}
                          </p>
                        </div>
                        {member.image ? (
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-border/60">
                            <Image
                              src={member.image}
                              alt={member.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>
                        ) : null}
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ) : null}

              {project.publications && project.publications.length > 0 ? (
                <motion.section
                  initial={fadeUp}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.45,
                    delay: reduceMotion ? 0 : 0.08,
                    ease: spring,
                  }}
                >
                  <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cognition/12 text-cognition">
                      <FileText className="h-4 w-4" aria-hidden />
                    </span>
                    Publications
                  </h2>
                  <div className="mt-6 space-y-4">
                    {project.publications.map((publication, index) => (
                      <motion.div
                        key={index}
                        initial={
                          reduceMotion ? false : { opacity: 0, y: 10 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.35,
                          delay: reduceMotion ? 0 : 0.04 + index * 0.05,
                          ease: spring,
                        }}
                        className="rounded-3xl border border-border/60 bg-card/80 p-5 shadow-sm ring-1 ring-black/[0.03] transition hover:border-brand/15"
                      >
                        <h3 className="font-semibold leading-snug text-foreground">
                          {publication.title}
                        </h3>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm text-muted-foreground">
                            {publication.date}
                          </p>
                          {publication.link ? (
                            <a
                              href={publication.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand underline-offset-4 hover:underline"
                            >
                              View publication
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                            </a>
                          ) : null}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ) : null}
            </div>

            <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <motion.div
                initial={fadeUp}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.45,
                  delay: reduceMotion ? 0 : 0.05,
                  ease: spring,
                }}
                className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm ring-1 ring-black/[0.04] backdrop-blur-md"
              >
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  Project details
                </h3>
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {project.category}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="mt-0.5 font-medium capitalize text-foreground">
                      {project.status}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Start date</dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {new Date(project.startDate).toLocaleDateString()}
                    </dd>
                  </div>
                  {project.endDate ? (
                    <div>
                      <dt className="text-muted-foreground">End date</dt>
                      <dd className="mt-0.5 font-medium text-foreground">
                        {new Date(project.endDate).toLocaleDateString()}
                      </dd>
                    </div>
                  ) : null}
                  {project.funding ? (
                    <div>
                      <dt className="text-muted-foreground">Funding</dt>
                      <dd className="mt-0.5 font-medium text-foreground">
                        {project.funding}
                      </dd>
                    </div>
                  ) : null}
                  {project.link ? (
                    <div>
                      <dt className="text-muted-foreground">Website</dt>
                      <dd className="mt-0.5">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-brand underline-offset-4 hover:underline"
                        >
                          Visit
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                        </a>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </motion.div>

              <motion.div
                initial={fadeUp}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.45,
                  delay: reduceMotion ? 0 : 0.08,
                  ease: spring,
                }}
                className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm ring-1 ring-black/[0.04] backdrop-blur-md"
              >
                <h3 className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground">
                  <Tag className="h-4 w-4 text-brand" aria-hidden />
                  Tags
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-medium text-foreground sm:text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>

              {project.additionalInfo ? (
                <motion.div
                  initial={fadeUp}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.45,
                    delay: reduceMotion ? 0 : 0.1,
                    ease: spring,
                  }}
                  className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm ring-1 ring-black/[0.04] backdrop-blur-md"
                >
                  <h3 className="text-base font-bold tracking-tight text-foreground">
                    Additional information
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {project.additionalInfo}
                  </p>
                </motion.div>
              ) : null}

              <motion.div
                initial={fadeUp}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.45,
                  delay: reduceMotion ? 0 : 0.12,
                  ease: spring,
                }}
                className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm ring-1 ring-black/[0.04] backdrop-blur-md"
              >
                <h3 className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground">
                  <Share2 className="h-4 w-4 text-brand" aria-hidden />
                  Share
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">
                  Copy a link to this project page.
                </p>
                <button
                  type="button"
                  onClick={() => void copyPageUrl()}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-brand/25 bg-brand/10 px-4 py-2.5 text-sm font-semibold text-brand transition hover:border-brand/40 hover:bg-brand/15"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden />
                      Copied
                    </>
                  ) : (
                    <>
                      <Link2 className="h-4 w-4" aria-hidden />
                      Copy link
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          </div>

          {project.images.length > 1 ? (
            <motion.section
              initial={fadeUp}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : 0.1,
                ease: spring,
              }}
              className="mt-14 border-t border-border/40 pt-12"
            >
              <div className="mb-2 h-1 w-14 rounded-full bg-linear-to-r from-cognition via-brand to-care" />
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Project gallery
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.images.slice(1).map((image, index) => (
                  <motion.div
                    key={index}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.35,
                      delay: reduceMotion ? 0 : 0.05 + index * 0.05,
                      ease: spring,
                    }}
                    className="group relative aspect-video overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-sm ring-1 ring-black/[0.04] transition hover:border-brand/20 hover:shadow-md"
                  >
                    <Image
                      src={image}
                      alt={`${project.title} — image ${index + 2}`}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
