"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Beaker,
  Brain,
  Building,
  Calendar,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  Microscope,
  Users,
  Users2,
  BookOpen,
  Zap,
} from "lucide-react";
import type {
  ResearchPageDocument,
  ResearchThemeIcon,
} from "@/lib/research-page/types";

const THEME_ICONS: Record<ResearchThemeIcon, LucideIcon> = {
  Brain,
  Activity,
  Eye,
  Users,
};

const COLLAB_ACCENT = [
  "from-cognition to-cognition/50",
  "from-consciousness to-consciousness/50",
  "from-care to-care/50",
] as const;

type Props = { document: ResearchPageDocument };

export default function ResearchPageView({ document: doc }: Props) {
  const reduceMotion = useReducedMotion();
  const [expandedThemeIndex, setExpandedThemeIndex] = useState<number | null>(
    null,
  );

  const { themeCount, projectCount, fundedProjectCount } = useMemo(() => {
    let projects = 0;
    let funded = 0;
    for (const t of doc.themes) {
      projects += t.projects.length;
      funded += t.projects.filter((p) => p.funder).length;
    }
    return {
      themeCount: doc.themes.length,
      projectCount: projects,
      fundedProjectCount: funded,
    };
  }, [doc.themes]);

  const fadeUp = reduceMotion ? undefined : { opacity: 0, y: 16 };
  const spring = [0.22, 1, 0.36, 1] as const;

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
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(260px,360px)] lg:gap-14">
            <motion.div
              initial={fadeUp}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.5,
                ease: spring,
              }}
              className="text-center lg:text-left"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand sm:text-[13px]">
                <Beaker className="h-3.5 w-3.5" aria-hidden />
                {doc.hero.badge}
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                  {doc.hero.title}
                </span>
                <span className="mt-3 block text-2xl font-semibold leading-snug tracking-tight text-muted-foreground sm:text-3xl lg:text-[1.65rem]">
                  {doc.hero.subtitle}
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
                {doc.hero.intro}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-xl border border-cognition/20 bg-cognition/5 px-3 py-2 text-xs font-medium text-cognition sm:text-sm">
                  <Brain className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  {doc.hero.pillars[0]}
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-consciousness/20 bg-consciousness/5 px-3 py-2 text-xs font-medium text-consciousness sm:text-sm">
                  <Microscope
                    className="h-4 w-4 shrink-0 opacity-90"
                    aria-hidden
                  />
                  {doc.hero.pillars[1]}
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-care/20 bg-care/5 px-3 py-2 text-xs font-medium text-care sm:text-sm">
                  <Zap className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  {doc.hero.pillars[2]}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={fadeUp}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.55,
                delay: reduceMotion ? 0 : 0.06,
                ease: spring,
              }}
              className="relative mx-auto w-full max-w-sm lg:mx-0"
            >
              <div
                className="absolute -inset-1 rounded-[1.35rem] bg-linear-to-br from-cognition/15 via-brand/12 to-care/15 opacity-90 blur-sm"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/90 p-6 shadow-lg ring-1 ring-black/[0.04] backdrop-blur-md sm:p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/12 text-brand">
                  <Beaker className="h-5 w-5" aria-hidden />
                </div>
                <dl className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="rounded-2xl border border-border/50 bg-muted/20 px-3 py-3 sm:px-4">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                      Themes
                    </dt>
                    <dd className="mt-1 text-xl font-bold tabular-nums text-foreground sm:text-2xl">
                      {themeCount}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-muted/20 px-3 py-3 sm:px-4">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                      Projects
                    </dt>
                    <dd className="mt-1 text-xl font-bold tabular-nums text-foreground sm:text-2xl">
                      {projectCount}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-muted/20 px-3 py-3 sm:px-4">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                      Funded
                    </dt>
                    <dd className="mt-1 text-xl font-bold tabular-nums text-care sm:text-2xl">
                      {fundedProjectCount}
                    </dd>
                  </div>
                </dl>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/50 bg-muted/20 py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: spring }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {doc.themesSection.title}
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {doc.themesSection.intro}
            </p>
          </motion.div>

          <div className="mx-auto max-w-5xl space-y-5">
            {doc.themes.map((theme, themeIndex) => {
              const ThemeIcon = THEME_ICONS[theme.icon] ?? Brain;
              const expanded = expandedThemeIndex === themeIndex;
              return (
                <motion.div
                  key={`theme-${themeIndex}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.4,
                    delay: reduceMotion ? 0 : themeIndex * 0.05,
                    ease: spring,
                  }}
                  viewport={{ once: true, amount: 0.08 }}
                  className="group"
                >
                  <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-sm ring-1 ring-black/[0.03] transition duration-300 hover:border-brand/25 hover:shadow-lg">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() =>
                        setExpandedThemeIndex(expanded ? null : themeIndex)
                      }
                      className="w-full px-5 py-5 text-left transition-colors hover:bg-muted/25 sm:px-6 sm:py-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 flex-1 items-start gap-4">
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-md sm:h-14 sm:w-14"
                            style={{ background: theme.gradient }}
                          >
                            <ThemeIcon
                              className="h-6 w-6 text-white sm:h-7 sm:w-7"
                              aria-hidden
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                              {theme.title}
                            </h3>
                            <p className="mt-1 text-sm leading-snug text-muted-foreground line-clamp-2 sm:line-clamp-none">
                              {theme.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-2">
                          <div className="text-right">
                            <div className="text-sm font-semibold text-foreground">
                              {theme.projects.length}{" "}
                              {theme.projects.length === 1
                                ? "project"
                                : "projects"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {theme.projects.filter((p) => p.funder).length}{" "}
                              with funding
                            </div>
                          </div>
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-muted/40 transition-transform duration-200 ${
                              expanded ? "rotate-0" : "group-hover:scale-105"
                            }`}
                          >
                            {expanded ? (
                              <ChevronDown
                                className="h-4 w-4 text-foreground"
                                aria-hidden
                              />
                            ) : (
                              <ChevronRight
                                className="h-4 w-4 text-foreground"
                                aria-hidden
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {expanded ? (
                        <motion.div
                          initial={
                            reduceMotion
                              ? false
                              : { height: 0, opacity: 0 }
                          }
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: {
                              duration: reduceMotion ? 0 : 0.38,
                              ease: spring,
                            },
                            opacity: {
                              duration: reduceMotion ? 0 : 0.25,
                              ease: "easeOut",
                            },
                          }}
                          className="overflow-hidden border-t border-border/60 bg-muted/15"
                        >
                          <div className="p-5 sm:p-7">
                            <p className="mb-8 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                              {theme.description}
                            </p>

                            <div className="grid gap-5 lg:grid-cols-2">
                              {theme.projects.map((project, idx) => (
                                <div
                                  key={`${themeIndex}-${idx}-${project.title}`}
                                  className="rounded-2xl border border-border/60 bg-background/90 p-5 shadow-sm ring-1 ring-black/[0.02] transition duration-200 hover:border-brand/20 hover:shadow-md"
                                >
                                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                                    <h4 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                                      {project.title}
                                    </h4>
                                    {project.funder ? (
                                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-brand/20 bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand">
                                        <Building
                                          className="h-3 w-3"
                                          aria-hidden
                                        />
                                        {project.funder}
                                      </span>
                                    ) : null}
                                  </div>

                                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                                    {project.description}
                                  </p>

                                  {project.publications &&
                                  project.publications.length > 0 ? (
                                    <div className="mb-4">
                                      <h5 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                                        <BookOpen
                                          className="h-4 w-4 text-brand"
                                          aria-hidden
                                        />
                                        Publications (
                                        {project.publications.length})
                                      </h5>
                                      <ul className="space-y-2">
                                        {project.publications.map((pub, i) => (
                                          <li
                                            key={i}
                                            className="flex items-start gap-2 rounded-xl border border-border/50 bg-muted/25 p-3 transition hover:border-brand/25"
                                          >
                                            <ExternalLink
                                              className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                                              aria-hidden
                                            />
                                            <a
                                              href={pub.link}
                                              className="text-sm font-medium text-brand transition hover:text-brand-deep line-clamp-3"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              {pub.title}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ) : null}

                                  {project.team && project.team.length > 0 ? (
                                    <div className="mb-4">
                                      <h5 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                                        <Users2
                                          className="h-4 w-4 text-brand"
                                          aria-hidden
                                        />
                                        Team ({project.team.length})
                                      </h5>
                                      <div className="flex flex-wrap gap-2">
                                        {project.team.map((member, i) => (
                                          <span
                                            key={i}
                                            className="rounded-lg border border-border/50 bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground"
                                          >
                                            {member}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ) : null}

                                  <div className="flex items-center gap-2 rounded-xl bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                                    <Calendar
                                      className="h-3.5 w-3.5 shrink-0"
                                      aria-hidden
                                    />
                                    <span className="font-medium text-foreground/90">
                                      {project.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: spring }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand sm:text-[13px]">
              <Users className="h-3.5 w-3.5" aria-hidden />
              {doc.collaborationsSection.badge}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {doc.collaborationsSection.title}
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {doc.collaborationsSection.intro}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {doc.collaborations.map((collab, index) => {
              const accent = COLLAB_ACCENT[index % COLLAB_ACCENT.length]!;
              return (
                <motion.div
                  key={`${collab.title}-${index}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.38,
                    delay: reduceMotion ? 0 : index * 0.06,
                    ease: spring,
                  }}
                  viewport={{ once: true, amount: 0.12 }}
                  className="group h-full"
                >
                  <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/95 p-6 shadow-sm ring-1 ring-black/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-xl hover:shadow-brand/[0.06] sm:p-7">
                    <div
                      className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${accent}`}
                      aria-hidden
                    />
                    <div className="mb-4 mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-cognition/12 text-cognition">
                      <Users className="h-6 w-6" aria-hidden />
                    </div>
                    <h3 className="text-lg font-bold tracking-tight text-foreground transition group-hover:text-brand sm:text-xl">
                      {collab.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {collab.description}
                    </p>
                    <div className="mt-4 rounded-xl border border-border/50 bg-muted/25 p-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Role
                      </span>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {collab.role}
                      </p>
                    </div>
                    {collab.funder ? (
                      <p className="mt-3 text-xs font-semibold text-brand">
                        Funder: {collab.funder}
                      </p>
                    ) : null}
                    <div className="mt-4">
                      {collab.link !== "#" ? (
                        <a
                          href={collab.link}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:gap-2.5 hover:text-brand-deep"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit website
                          <ExternalLink className="h-4 w-4" aria-hidden />
                        </a>
                      ) : (
                        <span className="text-sm italic text-muted-foreground">
                          Link coming soon
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: spring }}
            className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-foreground px-6 py-12 text-center text-background shadow-2xl sm:px-10 sm:py-14"
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/25 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-care/20 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-consciousness/15 blur-3xl"
              aria-hidden
            />
            <div className="relative mx-auto max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-background/90">
                <Beaker className="h-3.5 w-3.5" aria-hidden />
                {doc.cta.badge}
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {doc.cta.title}
              </h2>
              <p className="mx-auto mt-4 text-base leading-relaxed text-background/85 sm:text-lg">
                {doc.cta.intro}
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href={doc.cta.primary.href}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-background px-7 py-3.5 text-sm font-semibold text-foreground shadow-lg transition hover:bg-background/90 sm:w-auto"
                >
                  {doc.cta.primary.label}
                  <ExternalLink className="h-4 w-4 opacity-80" aria-hidden />
                </Link>
                <Link
                  href={doc.cta.secondary.href}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-transparent px-7 py-3.5 text-sm font-semibold text-background transition hover:bg-white/10 sm:w-auto"
                >
                  {doc.cta.secondary.label}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
