"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  GraduationCap,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import {
  deleteKmModule,
  emptyKmAdminModule,
  fetchKmCurriculumForAdmin,
  newQuestionDraft,
  newTopicDraft,
  saveKmAdminModule,
  validateKmAdminModuleDraft,
  type KmAdminModuleDraft,
  type KmAdminQuestionDraft,
  type KmAdminTopicDraft,
} from "@/lib/km/supabase-km-curriculum-admin";
import { uploadKmCurriculumAudio } from "@/lib/km/km-audio-storage";
import { uploadKmCurriculumVideo } from "@/lib/km/km-video-storage";

function paragraphsToText(p: string[]): string {
  return p.join("\n\n");
}

function textToParagraphs(t: string): string[] {
  return t
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function moveItem<T>(arr: T[], index: number, delta: -1 | 1): T[] {
  const j = index + delta;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[index], next[j]] = [next[j]!, next[index]!];
  return next;
}

function Field({
  label,
  value,
  onChange,
  multiline,
  rows,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  className?: string;
}) {
  return (
    <label
      className={`block text-xs font-medium text-muted-foreground ${className ?? ""}`}
    >
      {label}
      {multiline ? (
        <textarea
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows ?? 3}
        />
      ) : (
        <input
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

export default function KmCurriculumEditor() {
  const [modules, setModules] = useState<KmAdminModuleDraft[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const selectedIndexRef = useRef(0);
  selectedIndexRef.current = selectedIndex;

  const load = useCallback(async (opts?: { selectModuleId?: string | null; selectSlug?: string }) => {
    setLoading(true);
    setErr(null);
    try {
      const list = await fetchKmCurriculumForAdmin();
      setModules(list);
      setSelectedIndex((prev) => {
        if (opts?.selectModuleId) {
          const idx = list.findIndex((m) => m.dbId === opts.selectModuleId);
          if (idx >= 0) return idx;
        }
        if (opts?.selectSlug) {
          const idx = list.findIndex((m) => m.slug === opts.selectSlug);
          if (idx >= 0) return idx;
        }
        if (list.length === 0) return 0;
        if (prev >= 0 && prev < list.length) return prev;
        return Math.min(prev, list.length - 1);
      });
      setUnsavedChanges(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load curriculum");
      setModules([]);
      setSelectedIndex(0);
      setUnsavedChanges(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (modules.length === 0) return;
    if (selectedIndex >= modules.length) {
      setSelectedIndex(modules.length - 1);
    }
  }, [modules, selectedIndex]);

  const draft = useMemo(() => {
    if (selectedIndex < 0 || selectedIndex >= modules.length) return undefined;
    return modules[selectedIndex];
  }, [modules, selectedIndex]);

  function replaceDraftAt(index: number, next: KmAdminModuleDraft) {
    setUnsavedChanges(true);
    setModules((prev) => prev.map((m, i) => (i === index ? next : m)));
  }

  function addTopicToSelectedModule() {
    setErr(null);
    setOk(null);
    setUnsavedChanges(true);
    setModules((prev) => {
      const i = Math.min(
        Math.max(0, selectedIndexRef.current),
        Math.max(0, prev.length - 1),
      );
      const d = prev[i];
      if (!d) return prev;
      const nextOrder =
        d.topics.reduce((max, t) => Math.max(max, t.sortOrder), -1) + 1;
      return prev.map((m, j) =>
        j === i
          ? { ...d, topics: [...d.topics, newTopicDraft(nextOrder)] }
          : m,
      );
    });
  }

  function addQuestionToSelectedModule() {
    setErr(null);
    setOk(null);
    setUnsavedChanges(true);
    setModules((prev) => {
      const i = Math.min(
        Math.max(0, selectedIndexRef.current),
        Math.max(0, prev.length - 1),
      );
      const d = prev[i];
      if (!d) return prev;
      const nextOrder =
        d.questions.reduce((max, q) => Math.max(max, q.sortOrder), -1) + 1;
      return prev.map((m, j) =>
        j === i
          ? {
              ...d,
              questions: [...d.questions, newQuestionDraft(nextOrder)],
            }
          : m,
      );
    });
  }

  async function handleSave() {
    if (!draft) return;
    const localErrs = validateKmAdminModuleDraft(draft);
    if (localErrs.length) {
      setErr(localErrs.join(" "));
      return;
    }
    setSaving(true);
    setErr(null);
    setOk(null);
    const savedSlug = draft.slug.trim();
    try {
      const { moduleId } = await saveKmAdminModule(draft);
      setOk("Module saved.");
      await load({ selectModuleId: moduleId, selectSlug: savedSlug });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!draft?.dbId) return;
    if (
      !globalThis.confirm(
        "Delete this module and all its topics and questions? Learner progress keys use topic/question IDs — deleting may orphan stored progress.",
      )
    ) {
      return;
    }
    setSaving(true);
    setErr(null);
    setOk(null);
    try {
      await deleteKmModule(draft.dbId);
      setOk("Module deleted.");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  function handleAddModule() {
    const maxOrder = modules.reduce((a, m) => Math.max(a, m.sortOrder), -1);
    const m = emptyKmAdminModule(maxOrder + 1);
    const next = [...modules, m];
    setUnsavedChanges(true);
    setModules(next);
    setSelectedIndex(next.length - 1);
    setOk(null);
    setErr(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
        <span className="text-sm">Loading curriculum…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Knowledge Mobilization — curriculum
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Admins and superusers can edit modules, topics, and quiz questions
            here. Nothing is written to the database until you click{" "}
            <strong className="text-foreground">Save module</strong> (including
            adding or removing topics and questions). After a successful save,
            public learners see updates on the next load.
            Topics can be <strong className="text-foreground">text</strong>,{" "}
            <strong className="text-foreground">video</strong> (URL or upload to{" "}
            <code className="rounded bg-muted px-1">km-videos</code> —{" "}
            <code className="rounded bg-muted px-0.5 text-xs">
              storage_km_videos.sql
            </code>
            ), or <strong className="text-foreground">audio</strong> / podcast-style
            (URL or upload to{" "}
            <code className="rounded bg-muted px-1">km-audio</code> —{" "}
            <code className="rounded bg-muted px-0.5 text-xs">
              storage_km_audio.sql
            </code>
            ). New installs: <code className="text-xs">knowledge_mobilization.sql</code>{" "}
            includes <code className="text-xs">audio</code>; existing DBs: run{" "}
            <code className="text-xs">km_topics_add_audio_type.sql</code>.
            <span className="mt-2 block font-medium text-amber-800 dark:text-amber-200">
              Static hosting (e.g. GitHub Pages): adding a{" "}
              <em>new</em> module slug requires a new site build and deploy so
              the URL is generated; editing existing modules does not.
            </span>
          </p>
          <p className="mt-2 text-sm">
            <Link
              href="/admin/knowledge-mobilization/"
              className="font-medium text-brand hover:underline"
            >
              ← Hub &amp; registration copy
            </Link>
            {" · "}
            <Link
              href="/knowledge-mobilization/"
              className="font-medium text-brand hover:underline"
            >
              View public hub
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/knowledge-mobilization/"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/60"
          >
            <GraduationCap className="h-4 w-4 shrink-0" aria-hidden />
            Hub &amp; registration copy
          </Link>
          <button
            type="button"
            onClick={handleAddModule}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" aria-hidden />
            New module
          </button>
        </div>
      </header>

      {err ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {err}
        </p>
      ) : null}
      {ok ? (
        <p className="rounded-lg border border-care/30 bg-care/10 px-3 py-2 text-sm text-foreground">
          {ok}
        </p>
      ) : null}
      {unsavedChanges && !saving ? (
        <p className="rounded-lg border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-950 dark:border-amber-400/35 dark:bg-amber-400/10 dark:text-amber-50">
          <strong className="font-semibold">Unsaved changes.</strong> Use{" "}
          <strong>Save module</strong> so removals and edits are stored in
          Supabase. Refreshing the page before saving will bring topics and
          questions back as they were last saved.
        </p>
      ) : null}

      {modules.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No modules in the database. Add one, or run{" "}
          <code className="rounded bg-muted px-1 text-xs">npm run seed-km</code>{" "}
          to load defaults.
        </p>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <label className="block min-w-0 flex-1 sm:max-w-md">
            <span className="text-xs font-medium text-muted-foreground">
              Module
            </span>
            <select
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={String(
                modules.length
                  ? Math.min(selectedIndex, modules.length - 1)
                  : 0,
              )}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
            >
              {modules.map((m, i) => (
                <option key={m.dbId ?? `new-${i}`} value={i}>
                  {m.title.trim() || "(untitled)"} — {m.slug || "no slug"}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {draft ? (
        <ModuleForm
          draft={draft}
          disabled={saving}
          onChange={(next) => replaceDraftAt(selectedIndex, next)}
          onAddTopic={addTopicToSelectedModule}
          onAddQuestion={addQuestionToSelectedModule}
          onSave={() => void handleSave()}
          onDelete={draft.dbId ? () => void handleDelete() : undefined}
          saving={saving}
        />
      ) : null}
    </div>
  );
}

function ModuleForm({
  draft,
  disabled,
  onChange,
  onAddTopic,
  onAddQuestion,
  onSave,
  onDelete,
  saving,
}: {
  draft: KmAdminModuleDraft;
  disabled: boolean;
  onChange: (next: KmAdminModuleDraft) => void;
  onAddTopic: () => void;
  onAddQuestion: () => void;
  onSave: () => void;
  onDelete?: () => void;
  saving: boolean;
}) {
  const topicPanelUid = useId().replace(/:/g, "");
  const questionPanelUid = useId().replace(/:/g, "");
  const moduleKey = draft.dbId ?? `new:${draft.slug}:${draft.sortOrder}`;
  const [openTopicRows, setOpenTopicRows] = useState<Set<number>>(() => new Set());
  const [openQuestionRows, setOpenQuestionRows] = useState<Set<number>>(
    () => new Set(),
  );
  const prevModuleKeyRef = useRef(moduleKey);
  const prevTopicLenRef = useRef(draft.topics.length);
  const prevQuestionLenRef = useRef(draft.questions.length);

  useEffect(() => {
    if (prevModuleKeyRef.current !== moduleKey) {
      prevModuleKeyRef.current = moduleKey;
      prevTopicLenRef.current = draft.topics.length;
      prevQuestionLenRef.current = draft.questions.length;
      setOpenTopicRows(new Set());
      setOpenQuestionRows(new Set());
      return;
    }
    const nt = draft.topics.length;
    const pt = prevTopicLenRef.current;
    if (nt > pt) {
      setOpenTopicRows((s) => {
        const next = new Set(s);
        for (let j = pt; j < nt; j++) next.add(j);
        return next;
      });
    } else if (nt < pt) {
      setOpenTopicRows((s) => {
        const next = new Set<number>();
        for (const i of s) {
          if (i < nt) next.add(i);
        }
        return next;
      });
    }
    prevTopicLenRef.current = nt;

    const nq = draft.questions.length;
    const pq = prevQuestionLenRef.current;
    if (nq > pq) {
      setOpenQuestionRows((s) => {
        const next = new Set(s);
        for (let j = pq; j < nq; j++) next.add(j);
        return next;
      });
    } else if (nq < pq) {
      setOpenQuestionRows((s) => {
        const next = new Set<number>();
        for (const i of s) {
          if (i < nq) next.add(i);
        }
        return next;
      });
    }
    prevQuestionLenRef.current = nq;
  }, [moduleKey, draft.topics.length, draft.questions.length]);

  function toggleTopicRow(index: number) {
    setOpenTopicRows((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function toggleQuestionRow(index: number) {
    setOpenQuestionRows((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="space-y-8 rounded-2xl border border-border/80 bg-card/40 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">Module details</h2>
        <div className="flex flex-wrap gap-2">
          {onDelete ? (
            <button
              type="button"
              disabled={disabled}
              onClick={onDelete}
              className="inline-flex items-center gap-2 rounded-lg border border-destructive/40 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Delete module
            </button>
          ) : null}
          <button
            type="button"
            disabled={disabled}
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Save className="h-4 w-4" aria-hidden />
            )}
            Save module
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="URL slug (lowercase, hyphens)"
          value={draft.slug}
          onChange={(slug) => onChange({ ...draft, slug })}
        />
        <Field
          label="Display order (0 = first)"
          value={String(draft.sortOrder)}
          onChange={(v) =>
            onChange({
              ...draft,
              sortOrder: Number.parseInt(v, 10) || 0,
            })
          }
        />
      </div>
      <Field
        label="Title"
        value={draft.title}
        onChange={(title) => onChange({ ...draft, title })}
      />
      <Field
        label="Summary (hub card)"
        value={draft.summary}
        onChange={(summary) => onChange({ ...draft, summary })}
        multiline
        rows={3}
      />

      <section className="space-y-4 border-t border-border/60 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">Topics</h3>
          <div className="flex flex-wrap items-center gap-2">
            {draft.topics.length > 0 ? (
              <>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    setOpenTopicRows(
                      new Set(
                        Array.from(
                          { length: draft.topics.length },
                          (_, idx) => idx,
                        ),
                      ),
                    )
                  }
                  className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline disabled:opacity-45"
                >
                  Expand all
                </button>
                <span className="text-xs text-muted-foreground/60" aria-hidden>
                  ·
                </span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setOpenTopicRows(new Set())}
                  className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline disabled:opacity-45"
                >
                  Collapse all
                </button>
              </>
            ) : null}
            <button
              type="button"
              disabled={disabled}
              onClick={onAddTopic}
              title={disabled ? "Wait for save to finish" : undefined}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Add topic
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Stable{" "}
          <strong className="font-semibold text-foreground mr-0.5">
            topic key
          </strong>
          {" "}
          ties to saved learner progress; change keys only if you accept
          resetting related progress. Use the row headers to show or hide each
          topic&apos;s fields.
        </p>
        {draft.topics.length === 0 ? (
          <p className="text-sm text-muted-foreground">No topics yet.</p>
        ) : (
          <ul className="space-y-2">
            {draft.topics.map((topic, i) => {
              const isOpen = openTopicRows.has(i);
              const panelId = `${topicPanelUid}-panel-${i}`;
              const triggerId = `${topicPanelUid}-trigger-${i}`;
              const label =
                topic.title.trim() ||
                topic.topicKey.trim() ||
                `Topic ${i + 1}`;
              return (
                <li
                  key={`${topic.topicKey}-${i}`}
                  className="overflow-hidden rounded-xl border border-border/70 bg-background/50"
                >
                  <button
                    type="button"
                    disabled={disabled}
                    id={triggerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleTopicRow(i)}
                    className="flex w-full min-w-0 items-center gap-2 px-3 py-2.5 text-left text-sm transition hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-45"
                  >
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                      {label}
                    </span>
                    <span className="hidden shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:inline">
                      {topic.topicType}
                    </span>
                    <code className="hidden max-w-[9rem] shrink-0 truncate text-[11px] text-muted-foreground md:inline">
                      {topic.topicKey || "—"}
                    </code>
                  </button>
                  {isOpen ? (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      className="border-t border-border/60 px-4 pb-4 pt-3"
                    >
                      <TopicEditor
                        topic={topic}
                        moduleSlug={draft.slug}
                        disabled={disabled}
                        onChange={(t) =>
                          onChange({
                            ...draft,
                            topics: draft.topics.map((x, j) =>
                              j === i ? t : x,
                            ),
                          })
                        }
                        onMoveUp={
                          i > 0
                            ? () =>
                                onChange({
                                  ...draft,
                                  topics: moveItem(draft.topics, i, -1),
                                })
                            : undefined
                        }
                        onMoveDown={
                          i < draft.topics.length - 1
                            ? () =>
                                onChange({
                                  ...draft,
                                  topics: moveItem(draft.topics, i, 1),
                                })
                            : undefined
                        }
                        onRemove={() =>
                          onChange({
                            ...draft,
                            topics: draft.topics.filter((_, j) => j !== i),
                          })
                        }
                      />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-4 border-t border-border/60 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            Quiz questions (exactly 4 options each)
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {draft.questions.length > 0 ? (
              <>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    setOpenQuestionRows(
                      new Set(
                        Array.from(
                          { length: draft.questions.length },
                          (_, idx) => idx,
                        ),
                      ),
                    )
                  }
                  className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline disabled:opacity-45"
                >
                  Expand all
                </button>
                <span className="text-xs text-muted-foreground/60" aria-hidden>
                  ·
                </span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setOpenQuestionRows(new Set())}
                  className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline disabled:opacity-45"
                >
                  Collapse all
                </button>
              </>
            ) : null}
            <button
              type="button"
              disabled={disabled}
              onClick={onAddQuestion}
              title={disabled ? "Wait for save to finish" : undefined}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Add question
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Stable{" "}
          <strong className="font-semibold text-foreground mr-0.5">
            question key
          </strong>
          {" "}
          ties to saved learner progress. Use the row headers to show or hide
          each question&apos;s fields.
        </p>
        {draft.questions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No questions yet.</p>
        ) : (
          <ul className="space-y-2">
            {draft.questions.map((q, i) => {
              const isOpen = openQuestionRows.has(i);
              const panelId = `${questionPanelUid}-panel-${i}`;
              const triggerId = `${questionPanelUid}-trigger-${i}`;
              const promptPreview =
                q.prompt.trim().replace(/\s+/g, " ").slice(0, 72) || "";
              const label =
                promptPreview ||
                q.questionKey.trim() ||
                `Question ${i + 1}`;
              return (
                <li
                  key={`${q.questionKey}-${i}`}
                  className="overflow-hidden rounded-xl border border-border/70 bg-background/50"
                >
                  <button
                    type="button"
                    disabled={disabled}
                    id={triggerId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleQuestionRow(i)}
                    className="flex w-full min-w-0 items-center gap-2 px-3 py-2.5 text-left text-sm transition hover:bg-muted/50 disabled:pointer-events-none disabled:opacity-45"
                  >
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                      {label}
                    </span>
                    <span className="hidden shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:inline">
                      Opt {q.correctIndex + 1}
                    </span>
                    <code className="hidden max-w-[9rem] shrink-0 truncate text-[11px] text-muted-foreground md:inline">
                      {q.questionKey || "—"}
                    </code>
                  </button>
                  {isOpen ? (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      className="border-t border-border/60 px-4 pb-4 pt-3"
                    >
                      <QuestionEditor
                        question={q}
                        disabled={disabled}
                        onChange={(nq) =>
                          onChange({
                            ...draft,
                            questions: draft.questions.map((x, j) =>
                              j === i ? nq : x,
                            ),
                          })
                        }
                        onMoveUp={
                          i > 0
                            ? () =>
                                onChange({
                                  ...draft,
                                  questions: moveItem(draft.questions, i, -1),
                                })
                            : undefined
                        }
                        onMoveDown={
                          i < draft.questions.length - 1
                            ? () =>
                                onChange({
                                  ...draft,
                                  questions: moveItem(draft.questions, i, 1),
                                })
                            : undefined
                        }
                        onRemove={() =>
                          onChange({
                            ...draft,
                            questions: draft.questions.filter((_, j) => j !== i),
                          })
                        }
                      />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function TopicEditor({
  topic,
  moduleSlug,
  disabled,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  topic: KmAdminTopicDraft;
  /** Used for storage path; empty slug falls back to `module`. */
  moduleSlug: string;
  disabled: boolean;
  onChange: (t: KmAdminTopicDraft) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove: () => void;
}) {
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const [videoUploadBusy, setVideoUploadBusy] = useState(false);
  const [videoUploadErr, setVideoUploadErr] = useState<string | null>(null);
  const [audioUploadBusy, setAudioUploadBusy] = useState(false);
  const [audioUploadErr, setAudioUploadErr] = useState<string | null>(null);
  const paraText = paragraphsToText(topic.paragraphs);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={disabled || !onMoveUp}
          onClick={onMoveUp}
          className="rounded border border-border p-1 disabled:opacity-40"
          aria-label="Move up"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={disabled || !onMoveDown}
          onClick={onMoveDown}
          className="rounded border border-border p-1 disabled:opacity-40"
          aria-label="Move down"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onRemove}
          title="Removes this topic from the draft only—click Save module to update the database"
          className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Topic key (stable id)"
          value={topic.topicKey}
          onChange={(topicKey) => onChange({ ...topic, topicKey })}
        />
        <label className="block text-xs font-medium text-muted-foreground">
          Type
          <select
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            value={topic.topicType}
            disabled={disabled}
            onChange={(e) => {
              const v = e.target.value;
              const topicType =
                v === "video" ? "video" : v === "audio" ? "audio" : "text";
              onChange({ ...topic, topicType });
            }}
          >
            <option value="text">Text</option>
            <option value="video">Video</option>
            <option value="audio">Audio (podcast-style)</option>
          </select>
        </label>
      </div>
      <Field
        label="Title"
        value={topic.title}
        onChange={(title) => onChange({ ...topic, title })}
      />
      {topic.topicType === "video" ? (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="min-w-0 flex-1">
              <Field
                label="Video URL (YouTube watch or embed, youtu.be, Vimeo, Supabase public URL, or .mp4 — watch links are converted to embeds automatically)"
                value={topic.embedUrl}
                onChange={(embedUrl) => onChange({ ...topic, embedUrl })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Or upload
              </span>
              <input
                ref={videoFileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                className="sr-only"
                disabled={disabled || videoUploadBusy}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  setVideoUploadErr(null);
                  setVideoUploadBusy(true);
                  try {
                    const { publicUrl } = await uploadKmCurriculumVideo(
                      file,
                      moduleSlug,
                    );
                    onChange({ ...topic, embedUrl: publicUrl });
                  } catch (err) {
                    setVideoUploadErr(
                      err instanceof Error ? err.message : "Upload failed",
                    );
                  } finally {
                    setVideoUploadBusy(false);
                  }
                }}
              />
              <button
                type="button"
                disabled={disabled || videoUploadBusy}
                onClick={() => videoFileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted/60 disabled:opacity-50"
              >
                {videoUploadBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
                ) : (
                  <Upload className="h-4 w-4 shrink-0" aria-hidden />
                )}
                {videoUploadBusy ? "Uploading…" : "Upload MP4 / WebM / MOV"}
              </button>
            </div>
          </div>
          {videoUploadErr ? (
            <p className="text-xs text-destructive">{videoUploadErr}</p>
          ) : null}
          <p className="text-[11px] text-muted-foreground">
            Uploads go to the public <code className="rounded bg-muted px-1">km-videos</code>{" "}
            bucket (max 100MB). Admins need the storage policies from{" "}
            <code className="rounded bg-muted px-0.5">storage_km_videos.sql</code>.
          </p>
          <Field
            label="Video caption (optional)"
            value={topic.videoCaption}
            onChange={(videoCaption) => onChange({ ...topic, videoCaption })}
          />
        </>
      ) : null}
      {topic.topicType === "audio" ? (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="min-w-0 flex-1">
              <Field
                label="Audio URL (MP3/M4A public link, Supabase URL, or embed iframe src)"
                value={topic.embedUrl}
                onChange={(embedUrl) => onChange({ ...topic, embedUrl })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Or upload
              </span>
              <input
                ref={audioFileInputRef}
                type="file"
                accept="audio/mpeg,audio/mp4,audio/wav,audio/webm,audio/ogg,.mp3,.m4a,.wav,.webm,.ogg"
                className="sr-only"
                disabled={disabled || audioUploadBusy}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  setAudioUploadErr(null);
                  setAudioUploadBusy(true);
                  try {
                    const { publicUrl } = await uploadKmCurriculumAudio(
                      file,
                      moduleSlug,
                    );
                    onChange({ ...topic, embedUrl: publicUrl });
                  } catch (err) {
                    setAudioUploadErr(
                      err instanceof Error ? err.message : "Upload failed",
                    );
                  } finally {
                    setAudioUploadBusy(false);
                  }
                }}
              />
              <button
                type="button"
                disabled={disabled || audioUploadBusy}
                onClick={() => audioFileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted/60 disabled:opacity-50"
              >
                {audioUploadBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
                ) : (
                  <Upload className="h-4 w-4 shrink-0" aria-hidden />
                )}
                {audioUploadBusy ? "Uploading…" : "Upload MP3 / M4A / WAV"}
              </button>
            </div>
          </div>
          {audioUploadErr ? (
            <p className="text-xs text-destructive">{audioUploadErr}</p>
          ) : null}
          <p className="text-[11px] text-muted-foreground">
            Uploads use public <code className="rounded bg-muted px-1">km-audio</code>{" "}
            (max 100MB). Run <code className="rounded bg-muted px-0.5">storage_km_audio.sql</code>{" "}
            in Supabase.
          </p>
          <Field
            label="Episode intro or source line (optional, shown under player)"
            value={topic.videoCaption}
            onChange={(videoCaption) => onChange({ ...topic, videoCaption })}
          />
        </>
      ) : null}
      <Field
        label="Body paragraphs (blank line between paragraphs)"
        value={paraText}
        onChange={(v) => onChange({ ...topic, paragraphs: textToParagraphs(v) })}
        multiline
        rows={6}
      />
    </div>
  );
}

function QuestionEditor({
  question,
  disabled,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  question: KmAdminQuestionDraft;
  disabled: boolean;
  onChange: (q: KmAdminQuestionDraft) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={disabled || !onMoveUp}
          onClick={onMoveUp}
          className="rounded border border-border p-1 disabled:opacity-40"
          aria-label="Move up"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={disabled || !onMoveDown}
          onClick={onMoveDown}
          className="rounded border border-border p-1 disabled:opacity-40"
          aria-label="Move down"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onRemove}
          title="Removes this question from the draft only—click Save module to update the database"
          className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>
      <Field
        label="Question key (stable id)"
        value={question.questionKey}
        onChange={(questionKey) => onChange({ ...question, questionKey })}
      />
      <Field
        label="Prompt"
        value={question.prompt}
        onChange={(prompt) => onChange({ ...question, prompt })}
        multiline
        rows={2}
      />
      <label className="block text-xs font-medium text-muted-foreground">
        Correct answer
        <select
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={question.correctIndex}
          disabled={disabled}
          onChange={(e) =>
            onChange({
              ...question,
              correctIndex: Number(e.target.value) as 0 | 1 | 2 | 3,
            })
          }
        >
          <option value={0}>Option 1</option>
          <option value={1}>Option 2</option>
          <option value={2}>Option 3</option>
          <option value={3}>Option 4</option>
        </select>
      </label>
      {[0, 1, 2, 3].map((idx) => (
        <Field
          key={idx}
          label={`Option ${idx + 1}`}
          value={question.options[idx]!}
          onChange={(v) => {
            const next = [...question.options] as [
              string,
              string,
              string,
              string,
            ];
            next[idx] = v;
            onChange({ ...question, options: next });
          }}
        />
      ))}
    </div>
  );
}
