"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Layers,
  Lock,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import { useKmProgress } from "@/contexts/KmProgressContext";
import type { KmProgramGroup } from "@/data/km-page";
import { mergeKmPagePayload } from "@/data/km-page-defaults";
import type { KmPagePayload } from "@/data/km-page";
import type { KMModule } from "@/data/knowledge-mobilization";
import {
  isModuleUnlocked,
  modulePassed,
  allModulesPassed,
  listedModulesPassed,
} from "@/lib/km-progress";
import { modulesForProgramSlugs } from "@/lib/km/km-modules-for-slugs";
import {
  fetchKmCurriculumFromSupabase,
  orderedKmModulesFromFetch,
} from "@/lib/km/supabase-km-curriculum";
import { fetchKmPageContent } from "@/lib/km/supabase-km-page";

export default function KnowledgeMobilizationHubPage() {
  const { email: authEmail } = useAuthProfile();
  const {
    ready: kmReady,
    progress,
    resetAll,
    syncsToAccount,
    syncError,
  } = useKmProgress();
  const [page, setPage] = useState<KmPagePayload>(() => mergeKmPagePayload(null));
  const [ordered, setOrdered] = useState<KMModule[]>([]);
  const [curriculumReady, setCurriculumReady] = useState(false);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const [result, copy] = await Promise.all([
        fetchKmCurriculumFromSupabase(),
        fetchKmPageContent(),
      ]);
      if (!alive) return;
      setOrdered(orderedKmModulesFromFetch(result));
      setPage(copy);
      setCurriculumReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  function handleReset() {
    if (typeof window === "undefined") return;
    const msg = syncsToAccount
      ? "Clear all Knowledge Mobilization progress for your account and this browser? This removes your saved progress in the cloud for this login."
      : "Clear all Knowledge Mobilization progress on this browser? This cannot be undone.";
    if (window.confirm(msg)) {
      resetAll();
    }
  }

  const renderHero = () => (
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
            <GraduationCap className="h-4 w-4" aria-hidden />
            {page.heroBadge}
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
              {page.heroTitle}
            </span>
            <span className="mt-2 block text-3xl font-semibold text-muted-foreground sm:text-4xl lg:text-5xl">
              {page.heroSubtitle}
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {page.heroIntro}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 rounded-lg bg-cognition/10 px-4 py-2 text-cognition">
              <BookOpen className="h-4 w-4" aria-hidden />
              {page.heroPill1}
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-consciousness/10 px-4 py-2 text-consciousness">
              <Award className="h-4 w-4" aria-hidden />
              {page.heroPill2}
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-care/10 px-4 py-2 text-care">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              {page.heroPill3}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );

  if (!curriculumReady || !kmReady) {
    return (
      <div className="min-h-screen bg-background">
        {renderHero()}
        <div className="flex min-h-[40vh] items-center justify-center border-t border-border/60">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="h-11 w-11 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            <p className="text-sm">
              {!curriculumReady ? "Loading curriculum…" : "Loading progress…"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const programsVisible =
    page.programs.length > 0 &&
    page.programs.some((p) => modulesForProgramSlugs(p.moduleSlugs, ordered).length > 0);

  function renderProgramCard(prog: KmProgramGroup) {
    const mods = modulesForProgramSlugs(prog.moduleSlugs, ordered);
    if (mods.length === 0) return null;
    const programDone = listedModulesPassed(mods, progress);
    return (
      <div
        key={prog.id}
        className="rounded-2xl border border-border/80 bg-card/80 p-5 shadow-sm ring-1 ring-black/[0.03]"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-consciousness/12 text-consciousness">
            <Layers className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-foreground">{prog.title}</h3>
              {programDone ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-care/15 px-2 py-0.5 text-xs font-semibold text-care">
                  <CheckCircle2 className="h-3 w-3" aria-hidden />
                  Micro-credential complete
                </span>
              ) : null}
            </div>
            {prog.summary.trim() ? (
              <p className="mt-1 text-sm text-muted-foreground">{prog.summary}</p>
            ) : null}
            <ul className="mt-3 space-y-2">
              {mods.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/knowledge-mobilization/${m.slug}/`}
                    className="text-sm font-medium text-brand hover:underline"
                  >
                    {m.title}
                  </Link>
                </li>
              ))}
            </ul>
            {programDone ? (
              <Link
                href={`/knowledge-mobilization/certificate/?program=${encodeURIComponent(prog.id)}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-care/40 bg-care/10 px-4 py-2 text-sm font-semibold text-care transition hover:bg-care/15"
              >
                <Award className="h-4 w-4" aria-hidden />
                Certificate for this micro-credential
              </Link>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                Pass every module above (80%+ on each quiz) to unlock this
                micro-credential certificate.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {renderHero()}

      <div className="relative border-t border-border/60">
        {syncError ? (
          <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-900 dark:text-amber-100">
            Could not sync progress to your account: {syncError}. Quiz data is
            still saved in this browser.
          </div>
        ) : null}
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
                    {page.howItWorksTitle}
                  </h2>
                  {syncsToAccount ? (
                    authEmail ? (
                      <p className="mt-1 text-xs font-medium text-care">
                        {page.howItWorksSyncSignedIn}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {page.howItWorksSyncAnonymous}
                      </p>
                    )
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {page.howItWorksSyncGuest}{" "}
                      <Link
                        href="/login/"
                        className="font-medium text-brand hover:underline"
                      >
                        {page.howItWorksGuestSignInLinkText}
                      </Link>{" "}
                      {page.howItWorksGuestAfterLink}
                    </p>
                  )}
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-care" />
                      {page.howItWorksBullet1}
                    </li>
                    <li className="flex gap-2">
                      <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-cognition" />
                      {page.howItWorksBullet2}
                    </li>
                    <li className="flex gap-2">
                      <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-consciousness" />
                      {page.howItWorksBullet3}
                      {syncsToAccount
                        ? authEmail
                          ? " (synced to your account)."
                          : " (synced for this learner session)."
                        : " (on this device)."}
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

          {programsVisible ? (
            <section className="mb-12">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                {page.programsSectionTitle}
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                {page.programsSectionIntro}
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {page.programs.map((prog) => renderProgramCard(prog))}
              </div>
            </section>
          ) : null}

          {ordered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground">
              No modules are published yet. Run{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                supabase/knowledge_mobilization.sql
              </code>{" "}
              in Supabase, then{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                npm run seed-km
              </code>{" "}
              (use{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                -- --force
              </code>{" "}
              to replace existing rows). Hub copy is editable under{" "}
              <span className="font-medium text-foreground">Admin → Knowledge Mobilization</span>
              after running{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                supabase/km_page_settings.sql
              </code>
              .
            </p>
          ) : (
            <ol className="space-y-5">
              {ordered.map((mod, index) => {
                const unlocked = isModuleUnlocked(mod, ordered, progress);
                const passed = modulePassed(mod.slug, progress);
                const mp = progress.modules[mod.slug];
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
                              video ·{" "}
                              {
                                mod.topics.filter((t) => t.type === "audio")
                                  .length
                              }{" "}
                              audio ·{" "}
                              {
                                mod.topics.filter((t) => t.type === "text")
                                  .length
                              }{" "}
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
                                Best quiz score: {mp.bestScorePercent}% (need
                                80%)
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
          )}

          {progress &&
          ordered.length > 0 &&
          allModulesPassed(ordered, progress) ? (
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
                  You passed every module
                  {syncsToAccount ? "" : " on this device"}
                </p>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  {page.certificateBlurb}
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
