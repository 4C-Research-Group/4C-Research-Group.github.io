"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Save,
  Trash2,
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
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load curriculum");
      setModules([]);
      setSelectedIndex(0);
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
    setModules((prev) => prev.map((m, i) => (i === index ? next : m)));
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
            in Supabase. Public learners see changes immediately in the app.
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
        <button
          type="button"
          onClick={handleAddModule}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" aria-hidden />
          New module
        </button>
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
  onSave,
  onDelete,
  saving,
}: {
  draft: KmAdminModuleDraft;
  disabled: boolean;
  onChange: (next: KmAdminModuleDraft) => void;
  onSave: () => void;
  onDelete?: () => void;
  saving: boolean;
}) {
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
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground disabled:opacity-60"
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
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">Topics</h3>
          <button
            type="button"
            disabled={disabled}
            onClick={() =>
              onChange({
                ...draft,
                topics: [...draft.topics, newTopicDraft(draft.topics.length)],
              })
            }
            className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add topic
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Stable <strong>topic key</strong> ties to saved learner progress; change
          keys only if you accept resetting related progress.
        </p>
        {draft.topics.length === 0 ? (
          <p className="text-sm text-muted-foreground">No topics yet.</p>
        ) : (
          <ul className="space-y-6">
            {draft.topics.map((topic, i) => (
              <li
                key={`${topic.topicKey}-${i}`}
                className="rounded-xl border border-border/70 bg-background/50 p-4"
              >
                <TopicEditor
                  topic={topic}
                  disabled={disabled}
                  onChange={(t) =>
                    onChange({
                      ...draft,
                      topics: draft.topics.map((x, j) => (j === i ? t : x)),
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
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4 border-t border-border/60 pt-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            Quiz questions (exactly 4 options each)
          </h3>
          <button
            type="button"
            disabled={disabled}
            onClick={() =>
              onChange({
                ...draft,
                questions: [
                  ...draft.questions,
                  newQuestionDraft(draft.questions.length),
                ],
              })
            }
            className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add question
          </button>
        </div>
        {draft.questions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No questions yet.</p>
        ) : (
          <ul className="space-y-6">
            {draft.questions.map((q, i) => (
              <li
                key={`${q.questionKey}-${i}`}
                className="rounded-xl border border-border/70 bg-background/50 p-4"
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
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function TopicEditor({
  topic,
  disabled,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  topic: KmAdminTopicDraft;
  disabled: boolean;
  onChange: (t: KmAdminTopicDraft) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove: () => void;
}) {
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
            onChange={(e) =>
              onChange({
                ...topic,
                topicType: e.target.value === "video" ? "video" : "text",
              })
            }
          >
            <option value="text">Text</option>
            <option value="video">Video</option>
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
          <Field
            label="Embed or video URL (YouTube embed, Vimeo, or .mp4 link)"
            value={topic.embedUrl}
            onChange={(embedUrl) => onChange({ ...topic, embedUrl })}
          />
          <Field
            label="Video caption (optional)"
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
