"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Lock,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import { kmModules } from "@/data/knowledge-mobilization";
import {
  loadKmProgress,
  isModuleUnlocked,
  modulePassed,
  allModulesPassed,
  resetKmProgress,
  type KMStoredProgress,
} from "@/lib/km-progress";

export default function KnowledgeMobilizationHubPage() {
  const [progress, setProgress] = useState<KMStoredProgress | null>(null);

  useEffect(() => {
    setProgress(loadKmProgress());
  }, []);

  const ordered = useMemo(
    () => [...kmModules].sort((a, b) => a.order - b.order),
    [],
  );

  function refreshProgress() {
    setProgress(loadKmProgress());
  }

  function handleReset() {
    if (
      typeof window !== "undefined" &&
      window.confirm(
        "Clear all Knowledge Mobilization progress on this browser? This cannot be undone.",
      )
    ) {
      resetKmProgress();
      refreshProgress();
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        compact
        title="Knowledge Mobilization"
        subtitle="Refresher modules for nurses and staff — review topics and videos, then pass each module quiz (80% or higher) to unlock the next."
      />

      <div className="relative border-t border-border/60">
        <div
          className="pointer-events-none absolute left-0 top-20 h-72 w-72 rounded-full bg-cognition/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-consciousness/10 blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-10 rounded-2xl border border-brand/20 bg-linear-to-br from-brand/5 via-background to-care/5 p-6 sm:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
                  <GraduationCap className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    How it works
                  </h2>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-care" />
                      Open a module and mark each topic as reviewed when you
                      have read or watched it.
                    </li>
                    <li className="flex gap-2">
                      <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-cognition" />
                      Take the end-of-module quiz. You need{" "}
                      <strong className="text-foreground">80% or more</strong>{" "}
                      to pass and unlock the next module.
                    </li>
                    <li className="flex gap-2">
                      <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-consciousness" />
                      If you score below 80%, retake the quiz until you pass —
                      your best score is saved on this device only.
                    </li>
                  </ul>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition hover:border-destructive/40 hover:text-destructive"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset progress
              </button>
            </div>
          </motion.div>

          <ol className="space-y-5">
            {ordered.map((mod, index) => {
              const unlocked = progress
                ? isModuleUnlocked(mod, progress)
                : index === 0;
              const passed = progress
                ? modulePassed(mod.slug, progress)
                : false;
              const mp = progress?.modules[mod.slug];
              const topicTotal = mod.topics.length;
              const reviewed = mp?.reviewedTopicIds.length ?? 0;

              return (
                <motion.li
                  key={mod.slug}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="list-none"
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl border bg-card shadow-sm transition ${
                      passed
                        ? "border-care/30 shadow-care/5"
                        : unlocked
                          ? "border-border/80 hover:border-brand/25 hover:shadow-md"
                          : "border-border/60 opacity-[0.92]"
                    }`}
                  >
                    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                      <div className="flex min-w-0 flex-1 gap-4">
                        <span
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                            passed
                              ? "bg-care/15 text-care"
                              : unlocked
                                ? "bg-brand/15 text-brand"
                                : "bg-muted text-muted-foreground"
                          }`}
                          aria-hidden
                        >
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {mod.title}
                            </h3>
                            {passed ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-care/15 px-2.5 py-0.5 text-xs font-semibold text-care">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Passed
                              </span>
                            ) : null}
                            {!unlocked ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                <Lock className="h-3.5 w-3.5" />
                                Locked
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {mod.summary}
                          </p>
                          <p className="mt-3 text-xs text-muted-foreground">
                            {
                              mod.topics.filter((t) => t.type === "video")
                                .length
                            }{" "}
                            video topic(s) ·{" "}
                            {mod.topics.filter((t) => t.type === "text").length}{" "}
                            text topic(s) · {mod.questions.length} quiz
                            questions
                          </p>
                          {unlocked && !passed && topicTotal > 0 ? (
                            <p className="mt-2 text-xs font-medium text-brand">
                              Topics reviewed: {reviewed} / {topicTotal}
                            </p>
                          ) : null}
                          {mp && mp.attempts > 0 && !passed ? (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Best quiz score: {mp.bestScorePercent}% (need 80%)
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="shrink-0 sm:pl-2">
                        {unlocked ? (
                          <Link
                            href={`/knowledge-mobilization/${mod.slug}/`}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand-deep sm:w-auto"
                          >
                            {passed ? "Review module" : "Open module"}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        ) : (
                          <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-border px-5 py-2.5 text-sm font-medium text-muted-foreground sm:w-auto">
                            <Lock className="h-4 w-4" />
                            Complete previous module
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>

          {progress && allModulesPassed(progress) ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-care/30 bg-linear-to-br from-care/10 via-background to-brand/5 p-8 text-center"
            >
              <CheckCircle2
                className="h-10 w-10 text-care"
                strokeWidth={2}
                aria-hidden
              />
              <div>
                <p className="text-lg font-semibold text-foreground">
                  You passed every module on this device
                </p>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Download a certificate with your name, or print / save as PDF.
                  Use <em>Reset progress</em> only if you need to redo the track
                  for a demo — that also clears your saved certificate name.
                </p>
              </div>
              <Link
                href="/knowledge-mobilization/certificate/"
                className="inline-flex items-center gap-2 rounded-full bg-care px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-95"
              >
                <Award className="h-4 w-4" />
                Get your certificate
              </Link>
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
