"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import type { Join4cLabPagePayload } from "@/data/join-4c-lab-page";
import { mergeJoin4cLabPayload } from "@/data/join-4c-lab-defaults";
import {
  fetchJoin4cLabRowForAdmin,
  getJoin4cLabDefaultsForAdmin,
  saveJoin4cLabPayload,
} from "@/lib/join-4c-lab/supabase-join-page";

function splitLines(s: string): string[] {
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function joinLines(a: string[]): string {
  return a.join("\n");
}

function normalizeDraft(d: Join4cLabPagePayload): Join4cLabPagePayload {
  const o = structuredClone(d);
  const str = (v: string) => v.trim();
  o.contactEmail = str(o.contactEmail);
  o.heroBadge = str(o.heroBadge);
  o.heroTitle = str(o.heroTitle);
  o.heroSubtitle = str(o.heroSubtitle);
  o.heroBody = str(o.heroBody);
  o.heroPill1 = str(o.heroPill1);
  o.heroPill2 = str(o.heroPill2);
  o.heroPill3 = str(o.heroPill3);
  o.introTitle = str(o.introTitle);
  o.card1Title = str(o.card1Title);
  o.card1Description = str(o.card1Description);
  o.card2Title = str(o.card2Title);
  o.card2Description = str(o.card2Description);
  o.card3Title = str(o.card3Title);
  o.card3Description = str(o.card3Description);
  o.applySectionTitle = str(o.applySectionTitle);
  o.requiredDocumentsHeading = str(o.requiredDocumentsHeading);
  o.applicationStepsHeading = str(o.applicationStepsHeading);
  o.testimonialsTitle = str(o.testimonialsTitle);
  o.testimonialsSubtitle = str(o.testimonialsSubtitle);
  o.testimonialsMobileHint = str(o.testimonialsMobileHint);
  o.testimonialsEmptyMessage = str(o.testimonialsEmptyMessage);
  o.ctaTitle = str(o.ctaTitle);
  o.ctaDescription = str(o.ctaDescription);
  o.ctaButtonText = str(o.ctaButtonText);
  o.ctaButtonLink = str(o.ctaButtonLink);
  o.requiredDocuments = o.requiredDocuments.map(str).filter(Boolean);
  o.applicationSteps = o.applicationSteps.map(str).filter(Boolean);
  return mergeJoin4cLabPayload(o);
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

export default function Join4cLabEditor() {
  const [draft, setDraft] = useState<Join4cLabPagePayload | null>(null);
  const [reqDocText, setReqDocText] = useState("");
  const [appStepText, setAppStepText] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const { payload, updatedAt: u } = await fetchJoin4cLabRowForAdmin();
      setDraft(payload);
      setReqDocText(joinLines(payload.requiredDocuments));
      setAppStepText(joinLines(payload.applicationSteps));
      setUpdatedAt(u);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
      const d = getJoin4cLabDefaultsForAdmin();
      setDraft(d);
      setReqDocText(joinLines(d.requiredDocuments));
      setAppStepText(joinLines(d.applicationSteps));
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
      const merged = normalizeDraft({
        ...draft,
        requiredDocuments: splitLines(reqDocText),
        applicationSteps: splitLines(appStepText),
      });
      await saveJoin4cLabPayload(merged);
      setDraft(merged);
      setReqDocText(joinLines(merged.requiredDocuments));
      setAppStepText(joinLines(merged.applicationSteps));
      setOk("Saved.");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
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
            Join 4C Lab page
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edits the public{" "}
            <Link
              href="/join-4c-lab/"
              className="font-medium text-brand hover:underline"
            >
              /join-4c-lab/
            </Link>{" "}
            page. Student testimonials still come from team members (database)
            plus static fallbacks. Run{" "}
            <code className="rounded bg-muted px-1 text-xs">
              join_4c_lab_page_settings.sql
            </code>{" "}
            in Supabase if saves fail.
          </p>
          {updatedAt ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Last updated: {new Date(updatedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => {
              const d = getJoin4cLabDefaultsForAdmin();
              setDraft(d);
              setReqDocText(joinLines(d.requiredDocuments));
              setAppStepText(joinLines(d.applicationSteps));
              setOk(null);
            }}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted/60 disabled:opacity-50"
          >
            Reset form to defaults
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
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
        <p className="rounded-lg border border-brand/30 bg-brand/5 px-3 py-2 text-sm text-brand">
          {ok}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Hero</h2>
          <Field
            label="Contact email (shown + mailto link)"
            value={draft.contactEmail}
            onChange={(contactEmail) =>
              setDraft((d) => (d ? { ...d, contactEmail } : d))
            }
          />
          <Field label="Badge" value={draft.heroBadge} onChange={(heroBadge) => setDraft((d) => (d ? { ...d, heroBadge } : d))} />
          <Field label="Title" value={draft.heroTitle} onChange={(heroTitle) => setDraft((d) => (d ? { ...d, heroTitle } : d))} />
          <Field
            label="Subtitle (second line)"
            value={draft.heroSubtitle}
            onChange={(heroSubtitle) =>
              setDraft((d) => (d ? { ...d, heroSubtitle } : d))
            }
          />
          <Field
            label="Intro paragraph"
            value={draft.heroBody}
            onChange={(heroBody) => setDraft((d) => (d ? { ...d, heroBody } : d))}
            multiline
            rows={2}
          />
          <Field
            label="Pill 1 (cognition chip)"
            value={draft.heroPill1}
            onChange={(heroPill1) => setDraft((d) => (d ? { ...d, heroPill1 } : d))}
          />
          <Field
            label="Pill 2"
            value={draft.heroPill2}
            onChange={(heroPill2) => setDraft((d) => (d ? { ...d, heroPill2 } : d))}
          />
          <Field
            label="Pill 3"
            value={draft.heroPill3}
            onChange={(heroPill3) => setDraft((d) => (d ? { ...d, heroPill3 } : d))}
          />
        </section>

        <section className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Intro & cards</h2>
          <Field
            label="Section title (above three cards)"
            value={draft.introTitle}
            onChange={(introTitle) =>
              setDraft((d) => (d ? { ...d, introTitle } : d))
            }
            multiline
            rows={2}
          />
          <Field
            label="Card 1 title"
            value={draft.card1Title}
            onChange={(card1Title) =>
              setDraft((d) => (d ? { ...d, card1Title } : d))
            }
          />
          <Field
            label="Card 1 description"
            value={draft.card1Description}
            onChange={(card1Description) =>
              setDraft((d) => (d ? { ...d, card1Description } : d))
            }
            multiline
            rows={3}
          />
          <Field
            label="Card 2 title"
            value={draft.card2Title}
            onChange={(card2Title) =>
              setDraft((d) => (d ? { ...d, card2Title } : d))
            }
          />
          <Field
            label="Card 2 description"
            value={draft.card2Description}
            onChange={(card2Description) =>
              setDraft((d) => (d ? { ...d, card2Description } : d))
            }
            multiline
            rows={3}
          />
          <Field
            label="Card 3 title"
            value={draft.card3Title}
            onChange={(card3Title) =>
              setDraft((d) => (d ? { ...d, card3Title } : d))
            }
          />
          <Field
            label="Card 3 description"
            value={draft.card3Description}
            onChange={(card3Description) =>
              setDraft((d) => (d ? { ...d, card3Description } : d))
            }
            multiline
            rows={3}
          />
        </section>

        <section className="space-y-4 rounded-2xl border border-border/80 bg-card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-foreground">How to apply</h2>
          <Field
            label="Section title"
            value={draft.applySectionTitle}
            onChange={(applySectionTitle) =>
              setDraft((d) => (d ? { ...d, applySectionTitle } : d))
            }
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Left column heading"
              value={draft.requiredDocumentsHeading}
              onChange={(requiredDocumentsHeading) =>
                setDraft((d) =>
                  d ? { ...d, requiredDocumentsHeading } : d,
                )
              }
            />
            <Field
              label="Right column heading"
              value={draft.applicationStepsHeading}
              onChange={(applicationStepsHeading) =>
                setDraft((d) =>
                  d ? { ...d, applicationStepsHeading } : d,
                )
              }
            />
          </div>
          <label className="block text-xs font-medium text-muted-foreground">
            Required documents (one per line)
            <textarea
              className="mt-1 min-h-[140px] w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm"
              value={reqDocText}
              onChange={(e) => setReqDocText(e.target.value)}
              spellCheck
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Application steps (one per line). Use{" "}
            <code className="rounded bg-muted px-1">{"{{email}}"}</code> where
            the contact email should appear.
            <textarea
              className="mt-1 min-h-[140px] w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm"
              value={appStepText}
              onChange={(e) => setAppStepText(e.target.value)}
              spellCheck
            />
          </label>
        </section>

        <section className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Testimonials block</h2>
          <Field
            label="Title"
            value={draft.testimonialsTitle}
            onChange={(testimonialsTitle) =>
              setDraft((d) => (d ? { ...d, testimonialsTitle } : d))
            }
          />
          <Field
            label="Subtitle"
            value={draft.testimonialsSubtitle}
            onChange={(testimonialsSubtitle) =>
              setDraft((d) => (d ? { ...d, testimonialsSubtitle } : d))
            }
            multiline
            rows={2}
          />
          <Field
            label="Mobile hint (small screens)"
            value={draft.testimonialsMobileHint}
            onChange={(testimonialsMobileHint) =>
              setDraft((d) => (d ? { ...d, testimonialsMobileHint } : d))
            }
          />
          <Field
            label="Empty state message"
            value={draft.testimonialsEmptyMessage}
            onChange={(testimonialsEmptyMessage) =>
              setDraft((d) => (d ? { ...d, testimonialsEmptyMessage } : d))
            }
            multiline
            rows={2}
          />
        </section>

        <section className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Bottom CTA</h2>
          <Field
            label="Title"
            value={draft.ctaTitle}
            onChange={(ctaTitle) => setDraft((d) => (d ? { ...d, ctaTitle } : d))}
          />
          <Field
            label="Description"
            value={draft.ctaDescription}
            onChange={(ctaDescription) =>
              setDraft((d) => (d ? { ...d, ctaDescription } : d))
            }
            multiline
            rows={3}
          />
          <Field
            label="Button label"
            value={draft.ctaButtonText}
            onChange={(ctaButtonText) =>
              setDraft((d) => (d ? { ...d, ctaButtonText } : d))
            }
          />
          <Field
            label="Button link (e.g. mailto:…)"
            value={draft.ctaButtonLink}
            onChange={(ctaButtonLink) =>
              setDraft((d) => (d ? { ...d, ctaButtonLink } : d))
            }
            placeholder="mailto:you@example.com"
          />
        </section>
      </div>
    </div>
  );
}
