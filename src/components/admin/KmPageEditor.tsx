"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Loader2, Plus, Save, Trash2 } from "lucide-react";
import type { KmPagePayload, KmProgramGroup } from "@/data/km-page";
import { mergeKmPagePayload } from "@/data/km-page-defaults";
import {
  fetchKmPageRowForAdmin,
  getKmPageDefaultsForAdmin,
  saveKmPagePayload,
} from "@/lib/km/supabase-km-page";

function splitLines(s: string): string[] {
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function joinLines(a: string[]): string {
  return a.join("\n");
}

function newProgramId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `km-prog-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeDraft(
  d: KmPagePayload,
  slugTexts: Record<string, string>,
): KmPagePayload {
  const o = structuredClone(d);
  const str = (v: unknown) => String(v ?? "").trim();

  o.heroBadge = str(o.heroBadge);
  o.heroTitle = str(o.heroTitle);
  o.heroSubtitle = str(o.heroSubtitle);
  o.heroIntro = str(o.heroIntro);
  o.heroPill1 = str(o.heroPill1);
  o.heroPill2 = str(o.heroPill2);
  o.heroPill3 = str(o.heroPill3);
  o.howItWorksTitle = str(o.howItWorksTitle);
  o.howItWorksSyncSignedIn = str(o.howItWorksSyncSignedIn);
  o.howItWorksSyncGuest = str(o.howItWorksSyncGuest);
  o.howItWorksGuestSignInLinkText = str(o.howItWorksGuestSignInLinkText);
  o.howItWorksGuestAfterLink = str(o.howItWorksGuestAfterLink);
  o.howItWorksSyncAnonymous = str(o.howItWorksSyncAnonymous);
  o.howItWorksBullet1 = str(o.howItWorksBullet1);
  o.howItWorksBullet2 = str(o.howItWorksBullet2);
  o.howItWorksBullet3 = str(o.howItWorksBullet3);
  o.programsSectionTitle = str(o.programsSectionTitle);
  o.programsSectionIntro = str(o.programsSectionIntro);
  o.startPageTitle = str(o.startPageTitle);
  o.startPageIntro = str(o.startPageIntro);
  o.startPrivacyNote = str(o.startPrivacyNote);
  o.startSubmitLabel = str(o.startSubmitLabel);
  o.startFullNameLabel = str(o.startFullNameLabel);
  o.startUseSeparateNamesHint = str(o.startUseSeparateNamesHint);
  o.certificateBlurb = str(o.certificateBlurb);

  o.programs = o.programs.map((p) => {
    const id = str(p.id) || newProgramId();
    const slugSource = slugTexts[id] ?? joinLines(p.moduleSlugs);
    return {
      id,
      title: str(p.title),
      summary: str(p.summary),
      moduleSlugs: splitLines(slugSource),
    };
  });

  return mergeKmPagePayload(o);
}

function slugTextsFromPrograms(programs: KmProgramGroup[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of programs) {
    out[p.id] = joinLines(p.moduleSlugs);
  }
  return out;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}) {
  return (
    <label className="block text-xs font-medium text-muted-foreground">
      {label}
      {multiline ? (
        <textarea
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows ?? 3}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

export default function KmPageEditor() {
  const [draft, setDraft] = useState<KmPagePayload | null>(null);
  const [programSlugTexts, setProgramSlugTexts] = useState<
    Record<string, string>
  >({});
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const { payload, updatedAt: u } = await fetchKmPageRowForAdmin();
      setDraft(payload);
      setProgramSlugTexts(slugTextsFromPrograms(payload.programs));
      setUpdatedAt(u);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
      const d = getKmPageDefaultsForAdmin();
      setDraft(d);
      setProgramSlugTexts(slugTextsFromPrograms(d.programs));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!draft) return;
    setSaving(true);
    setErr(null);
    setOk(null);
    try {
      const merged = normalizeDraft(draft, programSlugTexts);
      await saveKmPagePayload(merged);
      setDraft(merged);
      setProgramSlugTexts(slugTextsFromPrograms(merged.programs));
      setOk("Saved.");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function resetToDefaults() {
    const d = getKmPageDefaultsForAdmin();
    setDraft(d);
    setProgramSlugTexts(slugTextsFromPrograms(d.programs));
    setOk(null);
    setErr(null);
  }

  function addProgram() {
    if (!draft) return;
    const id = newProgramId();
    setDraft({
      ...draft,
      programs: [
        ...draft.programs,
        { id, title: "", summary: "", moduleSlugs: [] },
      ],
    });
    setProgramSlugTexts((t) => ({ ...t, [id]: "" }));
  }

  function removeProgram(id: string) {
    if (!draft) return;
    setDraft({
      ...draft,
      programs: draft.programs.filter((p) => p.id !== id),
    });
    setProgramSlugTexts((t) => {
      const next = { ...t };
      delete next[id];
      return next;
    });
  }

  if (loading || !draft) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Knowledge Mobilization
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Hub hero, how-it-works copy, registration screen text, certificate
            blurb, and program groupings (micro-credentials / tracks). For
            modules, topics, and quiz questions use{" "}
            <Link
              href="/admin/knowledge-mobilization/curriculum/"
              className="font-medium text-brand hover:underline"
            >
              Curriculum editor
            </Link>
            . Public hub:{" "}
            <Link
              href="/knowledge-mobilization/"
              className="font-medium text-brand hover:underline"
            >
              /knowledge-mobilization/
            </Link>
            . Run{" "}
            <code className="rounded bg-muted px-1 text-xs">
              supabase/km_page_settings.sql
            </code>{" "}
            if saves fail.
          </p>
          {updatedAt ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Last updated: {new Date(updatedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/knowledge-mobilization/curriculum/"
            className="inline-flex items-center gap-2 rounded-lg border border-brand/35 bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand/15"
          >
            <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
            Curriculum &amp; quizzes
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={resetToDefaults}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground"
          >
            Reset form to defaults
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Save className="h-4 w-4" aria-hidden />
            )}
            Save
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

      <section className="space-y-4 rounded-2xl border border-border/80 bg-card/40 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground">Hub hero</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Badge"
            value={draft.heroBadge}
            onChange={(v) => setDraft({ ...draft, heroBadge: v })}
          />
          <Field
            label="Title"
            value={draft.heroTitle}
            onChange={(v) => setDraft({ ...draft, heroTitle: v })}
          />
        </div>
        <Field
          label="Subtitle"
          value={draft.heroSubtitle}
          onChange={(v) => setDraft({ ...draft, heroSubtitle: v })}
        />
        <Field
          label="Intro"
          value={draft.heroIntro}
          onChange={(v) => setDraft({ ...draft, heroIntro: v })}
          multiline
          rows={3}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Pill 1"
            value={draft.heroPill1}
            onChange={(v) => setDraft({ ...draft, heroPill1: v })}
          />
          <Field
            label="Pill 2"
            value={draft.heroPill2}
            onChange={(v) => setDraft({ ...draft, heroPill2: v })}
          />
          <Field
            label="Pill 3"
            value={draft.heroPill3}
            onChange={(v) => setDraft({ ...draft, heroPill3: v })}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border/80 bg-card/40 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground">How it works</h2>
        <Field
          label="Section title"
          value={draft.howItWorksTitle}
          onChange={(v) => setDraft({ ...draft, howItWorksTitle: v })}
        />
        <Field
          label="Sync note — signed in (email account)"
          value={draft.howItWorksSyncSignedIn}
          onChange={(v) => setDraft({ ...draft, howItWorksSyncSignedIn: v })}
          multiline
          rows={2}
        />
        <Field
          label="Sync note — guest (text before sign-in link)"
          value={draft.howItWorksSyncGuest}
          onChange={(v) => setDraft({ ...draft, howItWorksSyncGuest: v })}
          multiline
          rows={2}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Guest — sign-in link label"
            value={draft.howItWorksGuestSignInLinkText}
            onChange={(v) =>
              setDraft({ ...draft, howItWorksGuestSignInLinkText: v })
            }
          />
          <Field
            label="Guest — text after link"
            value={draft.howItWorksGuestAfterLink}
            onChange={(v) =>
              setDraft({ ...draft, howItWorksGuestAfterLink: v })
            }
          />
        </div>
        <Field
          label="Sync note — anonymous learner session"
          value={draft.howItWorksSyncAnonymous}
          onChange={(v) => setDraft({ ...draft, howItWorksSyncAnonymous: v })}
          multiline
          rows={3}
        />
        <Field
          label="Bullet 1"
          value={draft.howItWorksBullet1}
          onChange={(v) => setDraft({ ...draft, howItWorksBullet1: v })}
          multiline
          rows={2}
        />
        <Field
          label="Bullet 2"
          value={draft.howItWorksBullet2}
          onChange={(v) => setDraft({ ...draft, howItWorksBullet2: v })}
          multiline
          rows={2}
        />
        <Field
          label="Bullet 3 (app adds device/session suffix in the UI)"
          value={draft.howItWorksBullet3}
          onChange={(v) => setDraft({ ...draft, howItWorksBullet3: v })}
          multiline
          rows={2}
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-border/80 bg-card/40 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Programs &amp; tracks
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Each program is a micro-credential track: list 2+ module slugs (one
              per line). When a learner passes every listed module, the hub offers a
              certificate that names the program and lists only those modules. Slugs
              must match published modules. Empty list hides the section on the hub.
            </p>
          </div>
          <button
            type="button"
            onClick={addProgram}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Add program
          </button>
        </div>
        <Field
          label="Section title"
          value={draft.programsSectionTitle}
          onChange={(v) => setDraft({ ...draft, programsSectionTitle: v })}
        />
        <Field
          label="Section intro"
          value={draft.programsSectionIntro}
          onChange={(v) => setDraft({ ...draft, programsSectionIntro: v })}
          multiline
          rows={2}
        />
        {draft.programs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No programs yet.</p>
        ) : (
          <ul className="space-y-4">
            {draft.programs.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-border/70 bg-background/60 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-muted-foreground">
                    id: {p.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeProgram(p.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    Remove
                  </button>
                </div>
                <div className="space-y-3">
                  <Field
                    label="Title"
                    value={p.title}
                    onChange={(v) =>
                      setDraft({
                        ...draft,
                        programs: draft.programs.map((x) =>
                          x.id === p.id ? { ...x, title: v } : x,
                        ),
                      })
                    }
                  />
                  <Field
                    label="Summary"
                    value={p.summary}
                    onChange={(v) =>
                      setDraft({
                        ...draft,
                        programs: draft.programs.map((x) =>
                          x.id === p.id ? { ...x, summary: v } : x,
                        ),
                      })
                    }
                    multiline
                    rows={2}
                  />
                  <label className="block text-xs font-medium text-muted-foreground">
                    Module slugs (one per line)
                    <textarea
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm"
                      rows={4}
                      value={programSlugTexts[p.id] ?? ""}
                      onChange={(e) =>
                        setProgramSlugTexts((t) => ({
                          ...t,
                          [p.id]: e.target.value,
                        }))
                      }
                      placeholder={"picu-neuro-basics\nanother-module-slug"}
                    />
                  </label>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4 rounded-2xl border border-border/80 bg-card/40 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground">
          Registration gate (/knowledge-mobilization/start)
        </h2>
        <Field
          label="Page title"
          value={draft.startPageTitle}
          onChange={(v) => setDraft({ ...draft, startPageTitle: v })}
        />
        <Field
          label="Intro"
          value={draft.startPageIntro}
          onChange={(v) => setDraft({ ...draft, startPageIntro: v })}
          multiline
          rows={3}
        />
        <Field
          label="Privacy note"
          value={draft.startPrivacyNote}
          onChange={(v) => setDraft({ ...draft, startPrivacyNote: v })}
          multiline
          rows={3}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Submit button label"
            value={draft.startSubmitLabel}
            onChange={(v) => setDraft({ ...draft, startSubmitLabel: v })}
          />
          <Field
            label="Full name field label"
            value={draft.startFullNameLabel}
            onChange={(v) => setDraft({ ...draft, startFullNameLabel: v })}
          />
        </div>
        <Field
          label="Hint for separate first/last names"
          value={draft.startUseSeparateNamesHint}
          onChange={(v) =>
            setDraft({ ...draft, startUseSeparateNamesHint: v })
          }
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-border/80 bg-card/40 p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-foreground">Certificate</h2>
        <Field
          label="Blurb (hub certificate card)"
          value={draft.certificateBlurb}
          onChange={(v) => setDraft({ ...draft, certificateBlurb: v })}
          multiline
          rows={4}
        />
      </section>
    </div>
  );
}
