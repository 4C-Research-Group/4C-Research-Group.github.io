"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  CirclePlay,
  FileText,
  Lock,
} from "lucide-react";
import {
  KM_PASS_PERCENT,
  type KMModule,
  type KMTopic,
} from "@/data/knowledge-mobilization";
import {
  allTopicsReviewed,
  loadKmProgress,
  markTopicReviewed,
  recordQuizAttempt,
  unmarkTopicReviewed,
  modulePassed,
} from "@/lib/km-progress";
import {
  fetchKmCurriculumFromSupabase,
  orderedKmModulesFromFetch,
} from "@/lib/km/supabase-km-curriculum";

function TopicBlock({
  topic,
  moduleSlug,
  reviewed,
  defaultOpen,
  onToggleReviewed,
}: {
  topic: KMTopic;
  moduleSlug: string;
  reviewed: boolean;
  defaultOpen: boolean;
  onToggleReviewed: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-muted/40"
        aria-expanded={open}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              topic.type === "video"
                ? "bg-consciousness/12 text-consciousness"
                : "bg-cognition/12 text-cognition"
            }`}
          >
            {topic.type === "video" ? (
              <CirclePlay className="h-5 w-5" strokeWidth={2} />
            ) : (
              <FileText className="h-5 w-5" strokeWidth={2} />
            )}
          </span>
          <span className="min-w-0">
            <span className="block font-semibold text-foreground">
              {topic.title}
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {topic.type === "video" ? "Video + text" : "Text"}
            </span>
          </span>
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border/60"
          >
            <div className="space-y-4 px-5 py-5">
              {topic.type === "video" && topic.embedUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
                  <iframe
                    src={topic.embedUrl}
                    title={topic.videoCaption ?? topic.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              ) : topic.type === "video" ? (
                <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/50 p-6 text-center text-sm text-muted-foreground">
                  {topic.videoCaption ??
                    "Video embed will appear here once your team adds an approved URL in the curriculum file."}
                </div>
              ) : null}

              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                {topic.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 transition hover:border-brand/25">
                <input
                  type="checkbox"
                  checked={reviewed}
                  onChange={() => {
                    if (reviewed) {
                      unmarkTopicReviewed(moduleSlug, topic.id);
                    } else {
                      markTopicReviewed(moduleSlug, topic.id);
                    }
                    onToggleReviewed();
                  }}
                  className="mt-1 h-4 w-4 rounded border-border text-brand focus:ring-brand"
                />
                <span>
                  <span className="font-semibold text-foreground">
                    I have reviewed this topic
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Mark when you have read or watched the material. The module
                    quiz unlocks after every topic is checked.
                  </span>
                </span>
              </label>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function ModuleRunner({ moduleSlug }: { moduleSlug: string }) {
  const [curriculumReady, setCurriculumReady] = useState(false);
  const [module, setModule] = useState<KMModule | null>(null);
  const [ordered, setOrdered] = useState<KMModule[]>([]);
  const [tick, setTick] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitted, setSubmitted] = useState<{
    scorePercent: number;
    passed: boolean;
    correctCount: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const result = await fetchKmCurriculumFromSupabase();
      const list = orderedKmModulesFromFetch(result);
      if (!alive) return;
      setOrdered(list);
      setModule(list.find((m) => m.slug === moduleSlug) ?? null);
      setCurriculumReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [moduleSlug]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const progressSnapshot = useMemo(() => {
    void tick;
    return loadKmProgress();
  }, [tick]);

  const topicsReady = module ? allTopicsReviewed(module, progressSnapshot) : false;
  const alreadyPassed = module
    ? modulePassed(module.slug, progressSnapshot)
    : false;

  const selfIndex = module
    ? ordered.findIndex((m) => m.slug === module.slug)
    : -1;
  const nextModule = selfIndex >= 0 ? ordered[selfIndex + 1] : undefined;

  function setAnswer(questionId: string, optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setSubmitted(null);
  }

  function handleSubmitQuiz() {
    if (!module) return;
    let correct = 0;
    const total = module.questions.length;
    for (const q of module.questions) {
      const a = answers[q.id];
      if (a === q.correctIndex) correct += 1;
    }
    const scorePercent = total === 0 ? 0 : Math.round((correct / total) * 100);
    const { passed } = recordQuizAttempt(module.slug, scorePercent);
    refresh();
    setSubmitted({
      scorePercent,
      passed,
      correctCount: correct,
      total,
    });
  }

  function handleRetake() {
    setAnswers({});
    setSubmitted(null);
  }

  const allAnswered =
    !!module &&
    module.questions.length > 0 &&
    module.questions.every(
      (q) => typeof answers[q.id] === "number" && answers[q.id] !== null,
    );

  if (!curriculumReady) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-11 w-11 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-sm">Loading module…</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-[60vh] bg-background px-4 py-20">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold text-foreground">Module not found</h1>
          <p className="mt-2 text-muted-foreground">
            There is no module with this link, or it has not been published yet.
          </p>
          <Link
            href="/knowledge-mobilization/"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-deep"
          >
            <ArrowLeft className="h-4 w-4" />
            All modules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/60 bg-linear-to-br from-brand-light/60 via-background to-consciousness/10">
        <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <Link
            href="/knowledge-mobilization/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand transition hover:gap-2.5"
          >
            <ArrowLeft className="h-4 w-4" />
            All modules
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Module {module.order + 1}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {module.title}
          </h1>
          <p className="mt-3 text-muted-foreground">{module.summary}</p>
          {alreadyPassed ? (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-care/12 px-3 py-1.5 text-sm font-medium text-care">
              <CheckCircle2 className="h-4 w-4" />
              You have already passed this module on this device.
            </p>
          ) : null}
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <section aria-labelledby="topics-heading" className="space-y-4">
          <h2
            id="topics-heading"
            className="text-xl font-bold tracking-tight text-foreground"
          >
            Topics
          </h2>
          <p className="text-sm text-muted-foreground">
            Work through each topic, then confirm you have reviewed it. The quiz
            below stays locked until all boxes are checked.
          </p>
          <div className="space-y-4">
            {module.topics.map((topic, ti) => (
              <TopicBlock
                key={topic.id}
                topic={topic}
                moduleSlug={module.slug}
                defaultOpen={ti === 0}
                reviewed={
                  progressSnapshot.modules[
                    module.slug
                  ]?.reviewedTopicIds.includes(topic.id) ?? false
                }
                onToggleReviewed={refresh}
              />
            ))}
          </div>
        </section>

        <section
          aria-labelledby="quiz-heading"
          className="mt-14 border-t border-border/60 pt-12"
        >
          <div className="flex flex-wrap items-center gap-3">
            <h2
              id="quiz-heading"
              className="text-xl font-bold tracking-tight text-foreground"
            >
              Module quiz
            </h2>
            {!topicsReady ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                Review all topics first
              </span>
            ) : (
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                Pass at {KM_PASS_PERCENT}%+ to unlock the next module
              </span>
            )}
          </div>

          <div
            className={`mt-6 space-y-8 ${!topicsReady ? "pointer-events-none opacity-50" : ""}`}
            aria-hidden={!topicsReady}
          >
            {module.questions.map((q, qi) => (
              <fieldset
                key={q.id}
                disabled={!topicsReady}
                className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm"
              >
                <legend className="sr-only">
                  Question {qi + 1} of {module.questions.length}
                </legend>
                <p className="text-sm font-medium text-foreground">
                  <span className="mr-2 text-brand">{qi + 1}.</span>
                  {q.prompt}
                </p>
                <ul className="mt-4 space-y-2">
                  {q.options.map((opt, oi) => {
                    const selected = answers[q.id] === oi;
                    return (
                      <li key={oi}>
                        <label
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${
                            selected
                              ? "border-brand/50 bg-brand/5"
                              : "border-transparent bg-muted/40 hover:border-border"
                          }`}
                        >
                          <input
                            type="radio"
                            className="mt-1 h-4 w-4 border-border text-brand focus:ring-brand"
                            name={q.id}
                            checked={selected}
                            onChange={() => setAnswer(q.id, oi)}
                          />
                          <span className="text-muted-foreground">{opt}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            ))}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={!topicsReady || !allAnswered || submitted !== null}
                onClick={handleSubmitQuiz}
                className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-brand/20 transition hover:bg-brand-deep disabled:pointer-events-none disabled:opacity-40"
              >
                Submit answers
              </button>
              {submitted && !submitted.passed ? (
                <button
                  type="button"
                  onClick={handleRetake}
                  className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold transition hover:border-brand/30"
                >
                  Retake quiz
                </button>
              ) : null}
            </div>
          </div>

          <AnimatePresence>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-8 rounded-2xl border p-6 ${
                  submitted.passed
                    ? "border-care/30 bg-care/5"
                    : "border-amber-500/35 bg-amber-500/5"
                }`}
                role="status"
              >
                <p className="text-lg font-semibold text-foreground">
                  Your score: {submitted.scorePercent}% (
                  {submitted.correctCount} / {submitted.total} correct)
                </p>
                {submitted.passed ? (
                  <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                    <p className="font-medium text-care">
                      You passed — great work. You can open the next module from
                      the hub.
                    </p>
                    {nextModule ? (
                      <Link
                        href={`/knowledge-mobilization/${nextModule.slug}/`}
                        className="inline-flex items-center gap-2 font-semibold text-brand hover:underline"
                      >
                        Next: {nextModule.title}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <div className="space-y-3">
                        <p>You have completed every module in this track.</p>
                        <Link
                          href="/knowledge-mobilization/certificate/"
                          className="inline-flex items-center gap-2 font-semibold text-care hover:underline"
                        >
                          <Award className="h-4 w-4" />
                          Get your certificate
                        </Link>
                      </div>
                    )}
                    <Link
                      href="/knowledge-mobilization/"
                      className="block pt-1 text-brand hover:underline"
                    >
                      Back to all modules
                    </Link>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    You need at least {KM_PASS_PERCENT}% to pass. Review the
                    topics, tap{" "}
                    <strong className="text-foreground">Retake quiz</strong> to
                    clear your choices, then submit again. Your best score on
                    this device is saved when you pass.
                  </p>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
