"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Layers,
  Lock,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import { canAccessAdmin } from "@/lib/auth/roles";
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
import KmCertificateHubPreview from "@/components/km/KmCertificateHubPreview";

export default function KnowledgeMobilizationHubPage() {
  const { email: authEmail, ready: authReady, role } = useAuthProfile();
  const reduceMotion = useReducedMotion();
  const spring = [0.22, 1, 0.36, 1] as const;
  const fadeUp = reduceMotion ? undefined : { opacity: 0, y: 16 };
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

  const programCertificateSample = useMemo(() => {
    const first = page.programs.find(
      (p) => modulesForProgramSlugs(p.moduleSlugs, ordered).length > 0,
    );
    if (!first) return null;
    const mods = modulesForProgramSlugs(first.moduleSlugs, ordered);
    return { title: first.title, moduleTitles: mods.map((m) => m.title) };
  }, [page.programs, ordered]);

  const progressStats = useMemo(() => {
    const total = ordered.length;
    const passed = ordered.filter((m) => modulePassed(m.slug, progress)).length;
    return {
      total,
      passed,
      pct: total ? Math.min(100, Math.round((passed / total) * 100)) : 0,
    };
  }, [ordered, progress]);

  const programTrackCount = useMemo(() => {
    if (!curriculumReady) return null;
    return page.programs.filter(
      (p) => modulesForProgramSlugs(p.moduleSlugs, ordered).length > 0,
    ).length;
  }, [curriculumReady, page.programs, ordered]);

  const showAdmin = authReady && canAccessAdmin(role);

  const renderHero = () => (
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
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(280px,400px)] lg:gap-14">
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
              <GraduationCap className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {page.heroBadge}
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                {page.heroTitle}
              </span>
              <span className="mt-3 block text-2xl font-semibold leading-snug tracking-tight text-muted-foreground sm:text-3xl lg:text-[1.65rem]">
                {page.heroSubtitle}
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              {page.heroIntro}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-xl border border-cognition/20 bg-cognition/5 px-3 py-2 text-xs font-medium text-cognition sm:text-sm">
                <BookOpen className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                {page.heroPill1}
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-consciousness/20 bg-consciousness/5 px-3 py-2 text-xs font-medium text-consciousness sm:text-sm">
                <Award className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                {page.heroPill2}
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-care/20 bg-care/5 px-3 py-2 text-xs font-medium text-care sm:text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                {page.heroPill3}
              </span>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link
                href="#km-learning-hub"
                className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-brand-deep"
              >
                View learning path
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </Link>
              <Link
                href="/knowledge-mobilization/start/"
                className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand/30 hover:bg-muted/40"
              >
                New learner setup
              </Link>
            </div>
            {showAdmin ? (
              <div className="mt-4 flex justify-center lg:justify-start">
                <Link
                  href="/admin/knowledge-mobilization/"
                  className="inline-flex items-center gap-2 rounded-2xl border border-brand/25 bg-brand/10 px-5 py-2.5 text-sm font-semibold text-brand transition hover:border-brand/40 hover:bg-brand/15"
                >
                  Manage curriculum
                </Link>
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
            className="relative mx-auto w-full max-w-md lg:mx-0"
          >
            <div
              className="absolute -inset-1 rounded-[1.35rem] bg-linear-to-br from-cognition/15 via-brand/12 to-care/15 opacity-90 blur-sm"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/90 p-6 shadow-lg ring-1 ring-black/[0.04] backdrop-blur-md sm:p-7">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/12 text-brand">
                <GraduationCap className="h-5 w-5" aria-hidden />
              </div>
              <dl className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-border/50 bg-muted/20 px-3 py-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                    Modules
                  </dt>
                  <dd className="mt-1 text-xl font-bold tabular-nums text-foreground sm:text-2xl">
                    {!curriculumReady ? "—" : ordered.length}
                  </dd>
                </div>
                <div className="rounded-2xl border border-border/50 bg-muted/20 px-3 py-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                    Tracks
                  </dt>
                  <dd className="mt-1 text-xl font-bold tabular-nums text-consciousness sm:text-2xl">
                    {!curriculumReady || programTrackCount === null
                      ? "—"
                      : programTrackCount}
                  </dd>
                </div>
                <div className="rounded-2xl border border-border/50 bg-muted/20 px-3 py-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                    Progress
                  </dt>
                  <dd className="mt-1 text-xl font-bold tabular-nums text-care sm:text-2xl">
                    {!curriculumReady || !kmReady
                      ? "—"
                      : `${progressStats.passed}/${progressStats.total}`}
                  </dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );

  if (!curriculumReady || !kmReady) {
    return (
      <div className="min-h-screen bg-background">
        {renderHero()}
        <div className="flex min-h-[42vh] flex-col items-center justify-center gap-4 border-t border-border/50 px-4">
          <div
            className="h-12 w-12 animate-spin rounded-full border-2 border-brand/30 border-t-brand"
            aria-hidden
          />
          <p className="text-sm font-medium text-muted-foreground">
            {!curriculumReady ? "Loading curriculum…" : "Loading your progress…"}
          </p>
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
        className="group flex flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-sm ring-1 ring-black/[0.02] transition duration-200 hover:border-brand/25 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-consciousness/15 to-consciousness/5 text-consciousness ring-1 ring-consciousness/10">
              <Layers className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold tracking-tight text-foreground">
                  {prog.title}
                </h3>
                <span className="rounded-md bg-muted/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {mods.length} module{mods.length === 1 ? "" : "s"}
                </span>
                {programDone ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-care/15 px-2 py-0.5 text-xs font-semibold text-care">
                    <CheckCircle2 className="h-3 w-3" aria-hidden />
                    Complete
                  </span>
                ) : null}
              </div>
              {prog.summary.trim() ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {prog.summary}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <ul className="mt-3 space-y-1.5 border-t border-border/50 pt-3">
          {mods.map((m) => (
            <li key={m.slug}>
              <Link
                href={`/knowledge-mobilization/${m.slug}/`}
                className="flex items-center justify-between gap-2 rounded-lg py-1.5 pl-1 pr-2 text-sm font-medium text-foreground transition hover:bg-muted/60 hover:text-brand"
              >
                <span className="min-w-0 truncate">{m.title}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          {programDone ? (
            <Link
              href={`/knowledge-mobilization/certificate/?program=${encodeURIComponent(prog.id)}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-care px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 sm:w-auto"
            >
              <Award className="h-4 w-4" aria-hidden />
              Micro-credential certificate
            </Link>
          ) : (
            <p className="text-xs leading-relaxed text-muted-foreground">
              Pass each module quiz (80%+) in this track to unlock the certificate.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {renderHero()}

      <div className="relative">
        {syncError ? (
          <div
            role="alert"
            className="border-b border-amber-500/35 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-950 dark:text-amber-50"
          >
            Could not sync progress to your account: {syncError}. Quiz data is
            still saved in this browser.
          </div>
        ) : null}

        <div
          className="pointer-events-none absolute left-[max(0px,calc(50%-40rem))] top-32 h-80 w-80 rounded-full bg-cognition/8 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-[max(0px,calc(50%-38rem))] top-48 h-72 w-72 rounded-full bg-brand/8 blur-3xl"
          aria-hidden
        />

        <main
          id="km-learning-hub"
          className="container relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10"
        >
          {ordered.length > 0 ? (
            <section
              className="mb-8 rounded-2xl border border-border/70 bg-card/60 p-4 shadow-sm ring-1 ring-black/[0.02] backdrop-blur-sm sm:p-5"
              aria-labelledby="km-progress-heading"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2
                    id="km-progress-heading"
                    className="text-sm font-semibold tracking-tight text-foreground"
                  >
                    Your progress
                  </h2>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                    In order · 80% to pass · best score saved
                  </p>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2 sm:max-w-md sm:flex-none">
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-medium tabular-nums text-foreground">
                      {progressStats.passed} / {progressStats.total} modules
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {progressStats.pct}%
                    </span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-valuenow={progressStats.pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Modules completed"
                  >
                    <motion.div
                      className="h-full rounded-full bg-linear-to-r from-cognition via-brand to-care"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressStats.pct}%` }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 rounded-2xl border border-border/80 bg-linear-to-br from-muted/40 via-card to-card p-4 sm:p-5"
            aria-labelledby="km-how-heading"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 flex-1 gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/12 text-brand ring-1 ring-brand/10">
                  <GraduationCap className="h-5 w-5" strokeWidth={2} aria-hidden />
                </div>
                <div className="min-w-0">
                  <h2
                    id="km-how-heading"
                    className="text-base font-semibold tracking-tight text-foreground sm:text-lg"
                  >
                    {page.howItWorksTitle}
                  </h2>
                  {syncsToAccount ? (
                    authEmail ? (
                      <p className="mt-1.5 text-xs font-medium text-care">
                        {page.howItWorksSyncSignedIn}
                      </p>
                    ) : (
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {page.howItWorksSyncAnonymous}
                      </p>
                    )
                  ) : (
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {page.howItWorksSyncGuest}{" "}
                      <Link
                        href="/login/"
                        className="font-medium text-brand underline-offset-2 hover:underline"
                      >
                        {page.howItWorksGuestSignInLinkText}
                      </Link>{" "}
                      {page.howItWorksGuestAfterLink}
                    </p>
                  )}
                  <ul className="mt-3 space-y-2 border-l-2 border-border/70 pl-3 text-xs leading-snug text-muted-foreground sm:text-sm">
                    <li className="flex gap-2">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-care" aria-hidden />
                      <span>{page.howItWorksBullet1}</span>
                    </li>
                    <li className="flex gap-2">
                      <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cognition" aria-hidden />
                      <span>{page.howItWorksBullet2}</span>
                    </li>
                    <li className="flex gap-2">
                      <RotateCcw className="mt-0.5 h-3.5 w-3.5 shrink-0 text-consciousness" aria-hidden />
                      <span>
                        {page.howItWorksBullet3}
                        {syncsToAccount
                          ? authEmail
                            ? " (synced to your account)."
                            : " (synced for this learner session)."
                          : " (on this device)."}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-border bg-background px-3 py-2 text-[11px] font-semibold text-muted-foreground transition hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive sm:text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                Reset progress
              </button>
            </div>
          </motion.section>

          {programsVisible ? (
            <section className="mb-10" aria-labelledby="km-programs-heading">
              <div className="mb-4 max-w-2xl">
                <h2
                  id="km-programs-heading"
                  className="text-xl font-bold tracking-tight text-foreground"
                >
                  {page.programsSectionTitle}
                </h2>
                <p className="mt-1.5 text-sm leading-snug text-muted-foreground">
                  {page.programsSectionIntro}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {page.programs.map((prog) => renderProgramCard(prog))}
              </div>
            </section>
          ) : null}

          <section className="mb-10" aria-labelledby="km-modules-heading">
            <div className="mb-4 flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  id="km-modules-heading"
                  className="text-xl font-bold tracking-tight text-foreground"
                >
                  Learning path
                </h2>
                <p className="mt-0.5 max-w-xl text-xs text-muted-foreground sm:text-sm">
                  Sequential modules · mark topics reviewed before the quiz
                </p>
              </div>
            </div>

            {ordered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/80 bg-muted/15 px-6 py-14 text-center text-sm text-muted-foreground">
                No modules are published yet. Run{" "}
                <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
                  supabase/knowledge_mobilization.sql
                </code>{" "}
                in Supabase, then{" "}
                <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
                  npm run seed-km
                </code>{" "}
                (use{" "}
                <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">
                  -- --force
                </code>
                ). Hub copy:{" "}
                <span className="font-medium text-foreground">Admin → Knowledge Mobilization</span>
                .
              </div>
            ) : (
              <ol className="relative space-y-0">
                {ordered.map((mod, index) => {
                  const unlocked = isModuleUnlocked(mod, ordered, progress);
                  const passed = modulePassed(mod.slug, progress);
                  const mp = progress.modules[mod.slug];
                  const topicTotal = mod.topics.length;
                  const reviewed = mp?.reviewedTopicIds.length ?? 0;
                  const isLast = index === ordered.length - 1;

                  return (
                    <motion.li
                      key={mod.slug}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className="relative list-none"
                    >
                      <div className="flex gap-0 sm:gap-2">
                        <div className="flex w-12 shrink-0 flex-col items-center sm:w-14">
                          <div
                            className={`relative z-[1] flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-bold shadow-sm sm:h-12 sm:w-12 ${
                              passed
                                ? "border-care/40 bg-care/15 text-care"
                                : unlocked
                                  ? "border-brand/35 bg-brand/10 text-brand"
                                  : "border-border bg-muted text-muted-foreground"
                            }`}
                            aria-hidden
                          >
                            {index + 1}
                          </div>
                          {!isLast ? (
                            <div
                              className="mt-0 w-px flex-1 min-h-[1.25rem] bg-border sm:min-h-[1.75rem]"
                              aria-hidden
                            />
                          ) : (
                            <div className="h-2" aria-hidden />
                          )}
                        </div>

                        <div
                          className={`min-w-0 flex-1 ${isLast ? "pb-1" : "pb-6 sm:pb-7"}`}
                        >
                          <div
                            className={`overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-200 ${
                              passed
                                ? "border-care/35 shadow-care/10 ring-1 ring-care/10"
                                : unlocked
                                  ? "border-border/80 hover:border-brand/30 hover:shadow-md"
                                  : "border-border/70 opacity-[0.92]"
                            }`}
                          >
                            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-5">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                                    {mod.title}
                                  </h3>
                                  {passed ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-care/15 px-2 py-0.5 text-xs font-semibold text-care">
                                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                                      Passed
                                    </span>
                                  ) : null}
                                  {!unlocked ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                      <Lock className="h-3.5 w-3.5" aria-hidden />
                                      Locked
                                    </span>
                                  ) : null}
                                </div>
                                <p className="mt-1.5 text-sm leading-snug text-muted-foreground line-clamp-3 sm:line-clamp-none">
                                  {mod.summary}
                                </p>
                                <p className="mt-2 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
                                  <span>
                                    {mod.topics.filter((t) => t.type === "video").length}{" "}
                                    video
                                  </span>
                                  <span className="text-border">·</span>
                                  <span>
                                    {mod.topics.filter((t) => t.type === "audio").length}{" "}
                                    audio
                                  </span>
                                  <span className="text-border">·</span>
                                  <span>
                                    {mod.topics.filter((t) => t.type === "text").length} text
                                  </span>
                                  <span className="text-border">·</span>
                                  <span>{mod.questions.length} quiz questions</span>
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
                              <div className="shrink-0 sm:pl-2">
                                {unlocked ? (
                                  <Link
                                    href={`/knowledge-mobilization/${mod.slug}/`}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-brand-deep sm:w-auto"
                                  >
                                    {passed ? "Review" : "Continue"}
                                    <ArrowRight className="h-4 w-4" aria-hidden />
                                  </Link>
                                ) : (
                                  <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-2.5 text-sm font-medium text-muted-foreground sm:w-auto">
                                    <Lock className="h-4 w-4" aria-hidden />
                                    Complete previous
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </ol>
            )}
          </section>

          {curriculumReady && kmReady ? (
            <KmCertificateHubPreview
              modules={ordered}
              programSample={programCertificateSample}
            />
          ) : null}

          {progress &&
          ordered.length > 0 &&
          allModulesPassed(ordered, progress) ? (
            <motion.aside
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex flex-col items-center gap-4 rounded-2xl border border-care/35 bg-linear-to-br from-care/12 via-background to-brand/5 px-5 py-7 text-center shadow-sm sm:px-8 sm:py-8"
              aria-labelledby="km-full-cert-heading"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-care/20 text-care sm:h-12 sm:w-12">
                <CheckCircle2 className="h-6 w-6" strokeWidth={2} aria-hidden />
              </div>
              <div>
                <h2
                  id="km-full-cert-heading"
                  className="text-lg font-bold tracking-tight text-foreground sm:text-xl"
                >
                  Full track complete
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  You passed every module
                  {syncsToAccount ? "" : " on this device"}. {page.certificateBlurb}
                </p>
              </div>
              <Link
                href="/knowledge-mobilization/certificate/"
                className="inline-flex items-center gap-2 rounded-full bg-care px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-95"
              >
                <Award className="h-4 w-4" aria-hidden />
                Get your certificate
              </Link>
            </motion.aside>
          ) : null}
        </main>
      </div>
    </div>
  );
}
