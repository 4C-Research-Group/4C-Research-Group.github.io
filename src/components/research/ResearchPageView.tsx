"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
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

type Props = { document: ResearchPageDocument };

export default function ResearchPageView({ document: doc }: Props) {
  const [expandedThemeIndex, setExpandedThemeIndex] = useState<number | null>(
    null,
  );

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-background to-brand-light/30">
        <div className="absolute inset-0 bg-grid-black/5 mask-[linear-gradient(to_bottom_right,white,transparent,white)]" />
        <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-medium text-brand">
              <Beaker className="h-4 w-4" />
              {doc.hero.badge}
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {doc.hero.title}
              <span className="block text-3xl font-semibold text-muted-foreground sm:text-4xl lg:text-5xl">
                {doc.hero.subtitle}
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {doc.hero.intro}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 rounded-lg bg-cognition/10 px-4 py-2 text-cognition">
                <Brain className="h-4 w-4" />
                {doc.hero.pillars[0]}
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-consciousness/10 px-4 py-2 text-consciousness">
                <Microscope className="h-4 w-4" />
                {doc.hero.pillars[1]}
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-care/10 px-4 py-2 text-care">
                <Zap className="h-4 w-4" />
                {doc.hero.pillars[2]}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {doc.themesSection.title}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {doc.themesSection.intro}
            </p>
          </motion.div>

          <div className="mx-auto max-w-5xl space-y-6">
            {doc.themes.map((theme, themeIndex) => {
              const ThemeIcon = THEME_ICONS[theme.icon] ?? Brain;
              const expanded = expandedThemeIndex === themeIndex;
              return (
                <motion.div
                  key={`theme-${themeIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: themeIndex * 0.1,
                  }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-brand/20 hover:shadow-lg">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedThemeIndex(expanded ? null : themeIndex)
                      }
                      className="w-full px-6 py-5 text-left transition-colors hover:bg-muted/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-xl"
                            style={{
                              background: theme.gradient.replace(
                                "135deg",
                                "to bottom right",
                              ),
                            }}
                          >
                            <ThemeIcon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-foreground">
                              {theme.title}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                              {theme.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-medium text-foreground">
                              {theme.projects.length} Projects
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {theme.projects.filter((p) => p.funder).length}{" "}
                              Funded
                            </div>
                          </div>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-transform duration-200 group-hover:scale-110">
                            {expanded ? (
                              <ChevronDown className="h-4 w-4 text-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
                            opacity: { duration: 0.3, ease: "easeOut" },
                          }}
                          className="border-t border-border bg-muted/20 overflow-hidden"
                        >
                          <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-6"
                          >
                            <div className="mb-6">
                              <p className="text-sm leading-relaxed text-muted-foreground">
                                {theme.description}
                              </p>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-2">
                              {theme.projects.map((project, idx) => (
                                <motion.div
                                  key={`${themeIndex}-${idx}-${project.title}`}
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  exit={{ y: 20, opacity: 0 }}
                                  transition={{
                                    duration: 0.3,
                                    delay: 0.1 + idx * 0.08,
                                    ease: "easeOut",
                                  }}
                                  className="rounded-xl border border-border bg-background p-5"
                                >
                                  <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                                    <h4 className="text-lg font-bold text-foreground">
                                      {project.title}
                                    </h4>
                                    {project.funder ? (
                                      <motion.span
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        transition={{
                                          duration: 0.2,
                                          delay: 0.2 + idx * 0.08,
                                        }}
                                        className="shrink-0 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand"
                                      >
                                        <Building className="mr-1 h-3 w-3 inline" />
                                        {project.funder}
                                      </motion.span>
                                    ) : null}
                                  </div>

                                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                                    {project.description}
                                  </p>

                                  {project.publications &&
                                    project.publications.length > 0 && (
                                      <div className="mb-4">
                                        <h5 className="mb-3 flex items-center text-sm font-semibold text-foreground">
                                          <BookOpen className="mr-2 h-4 w-4 text-brand" />
                                          Key Publications (
                                          {project.publications.length})
                                        </h5>
                                        <div className="space-y-2">
                                          {project.publications.map(
                                            (pub, i) => (
                                              <motion.div
                                                key={i}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: -20, opacity: 0 }}
                                                transition={{
                                                  duration: 0.2,
                                                  delay:
                                                    0.3 +
                                                    idx * 0.08 +
                                                    i * 0.05,
                                                }}
                                                className="flex items-start gap-2 rounded-lg bg-muted/30 p-3"
                                              >
                                                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                                                <a
                                                  href={pub.link}
                                                  className="text-sm text-brand hover:text-brand-deep transition-colors line-clamp-2"
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                >
                                                  {pub.title}
                                                </a>
                                              </motion.div>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}

                                  {project.team && project.team.length > 0 && (
                                    <div className="mb-4">
                                      <h5 className="mb-3 flex items-center text-sm font-semibold text-foreground">
                                        <Users2 className="mr-2 h-4 w-4 text-brand" />
                                        Team Members ({project.team.length})
                                      </h5>
                                      <motion.div
                                        initial={{ y: 10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 10, opacity: 0 }}
                                        transition={{
                                          duration: 0.2,
                                          delay: 0.3 + idx * 0.08,
                                        }}
                                        className="flex flex-wrap gap-2"
                                      >
                                        {project.team.map((member, i) => (
                                          <motion.span
                                            key={i}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            transition={{
                                              duration: 0.15,
                                              delay:
                                                0.35 +
                                                idx * 0.08 +
                                                i * 0.03,
                                            }}
                                            className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground"
                                          >
                                            {member}
                                          </motion.span>
                                        ))}
                                      </motion.div>
                                    </div>
                                  )}

                                  <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 10, opacity: 0 }}
                                    transition={{
                                      duration: 0.2,
                                      delay: 0.4 + idx * 0.08,
                                    }}
                                    className="flex items-center justify-between rounded-lg bg-muted/20 p-3"
                                  >
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3" />
                                      {project.status}
                                    </div>
                                  </motion.div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-linear-to-br from-slate-50 to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-medium text-brand">
              <Users className="h-4 w-4" />
              {doc.collaborationsSection.badge}
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {doc.collaborationsSection.title}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {doc.collaborationsSection.intro}
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {doc.collaborations.map((collab, index) => (
              <motion.div
                key={`${collab.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cognition/15">
                    <Users className="h-6 w-6 text-cognition" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-brand transition-colors">
                    {collab.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    {collab.description}
                  </p>
                  <div className="mb-4 rounded-lg bg-muted/30 p-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Role
                    </span>
                    <p className="mt-1 text-sm text-foreground">{collab.role}</p>
                  </div>
                  {collab.funder ? (
                    <p className="mb-4 text-xs font-medium text-brand">
                      Funder: {collab.funder}
                    </p>
                  ) : null}
                  {collab.link !== "#" ? (
                    <a
                      href={collab.link}
                      className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-deep transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground italic">
                      Link Coming Soon
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="rounded-3xl border border-border bg-linear-to-br from-card via-background to-muted/30 p-8 sm:p-12 shadow-lg shadow-brand/5">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-medium text-brand">
                <Beaker className="h-4 w-4" />
                {doc.cta.badge}
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {doc.cta.title}
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                {doc.cta.intro}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={doc.cta.primary.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-deep"
                >
                  {doc.cta.primary.label}
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link
                  href={doc.cta.secondary.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand/40 hover:bg-brand/5"
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
