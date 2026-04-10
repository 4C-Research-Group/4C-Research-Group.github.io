"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AdminImagePickButton } from "@/components/admin/AdminImagePickButton";
import type { AboutPiPagePayload } from "@/data/about-pi";
import { mergeAboutPiPayload } from "@/data/about-pi-defaults";
import {
  fetchAboutPiRowForAdmin,
  getAboutPiDefaultsForAdmin,
  saveAboutPiPayload,
} from "@/lib/about-pi/supabase-about-pi";
import { uploadHomepageImage } from "@/lib/homepage/homepage-image-storage";

const PI_ARRAY_SECTIONS: {
  field: keyof AboutPiPagePayload;
  label: string;
}[] = [
  { field: "currentPositions", label: "Current positions & leadership" },
  { field: "education", label: "Education & training" },
  { field: "professionalExperience", label: "Professional experience" },
  { field: "researchAwards", label: "Honors, awards & recognition" },
  { field: "traineeScholarAwards", label: "Trainee scholarships & awards" },
  {
    field: "leadershipDevelopmentAwards",
    label: "Leadership development awards",
  },
  { field: "grantsOngoing", label: "Peer-reviewed grants — ongoing" },
  { field: "grantsCompleted", label: "Peer-reviewed grants — completed" },
  { field: "languages", label: "Language proficiency" },
  { field: "invitedLectures", label: "Invited lectures" },
  { field: "peerReviewBlocks", label: "Editorial & peer review" },
  { field: "skillCategories", label: "Skills (by category)" },
  { field: "volunteering", label: "Volunteering" },
  { field: "recommendations", label: "Recommendations" },
  { field: "licenses", label: "Licenses & certifications" },
  { field: "committeesAndLeadership", label: "Committees & leadership roles" },
  { field: "membershipsAll", label: "Society memberships" },
  { field: "publicationHighlights", label: "Selected publication highlights" },
  { field: "organizations", label: "Organizations (flat list)" },
];

function normalizeDraft(d: AboutPiPagePayload): AboutPiPagePayload {
  const o = structuredClone(d);
  o.name = o.name.trim();
  o.title = o.title.trim();
  o.imageSrc = o.imageSrc.trim();
  o.datePrepared = o.datePrepared.trim();
  o.heroLines = o.heroLines.map((x) => x.trim()).filter(Boolean);
  o.aboutIntro = o.aboutIntro.map((x) => x.trim()).filter(Boolean);
  o.linkedinUrl = o.linkedinUrl?.trim() ?? "";
  o.googleScholarUrl = o.googleScholarUrl?.trim() ?? "";
  o.researchgateUrl = o.researchgateUrl?.trim() ?? "";
  o.orcidUrl = o.orcidUrl?.trim() ?? "";
  o.biographical.legalName = o.biographical.legalName.trim();
  o.biographical.telephone = o.biographical.telephone.trim();
  o.biographical.fax = o.biographical.fax.trim();
  o.biographical.administrativeAssistant =
    o.biographical.administrativeAssistant.trim();
  o.biographical.practiceLines = o.biographical.practiceLines
    .map((x) => x.trim())
    .filter(Boolean);
  o.biographical.emails = o.biographical.emails
    .map((x) => x.trim())
    .filter(Boolean);
  o.biographical.publishedAuthorLines = o.biographical.publishedAuthorLines
    .map((x) => x.trim())
    .filter(Boolean);
  return mergeAboutPiPayload(o);
}

function JsonBlock({
  label,
  value,
  onApply,
}: {
  label: string;
  value: unknown;
  onApply: (parsed: unknown) => void;
}) {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
    setErr(null);
  }, [value]);

  return (
    <details className="rounded-xl border border-border bg-card/40">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
        {label} (JSON)
      </summary>
      <div className="space-y-2 border-t border-border p-4">
        <textarea
          className="min-h-[180px] w-full rounded-lg border border-input bg-background p-3 font-mono text-xs leading-relaxed"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
        />
        {err ? (
          <p className="text-xs text-destructive">{err}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Edit the JSON array, then Apply. Save publishes the whole page.
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            try {
              const p = JSON.parse(text) as unknown;
              onApply(p);
              setErr(null);
            } catch (e) {
              setErr(e instanceof Error ? e.message : "Invalid JSON");
            }
          }}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted/80"
        >
          Apply to draft
        </button>
      </div>
    </details>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export default function AboutPiEditor() {
  const formId = useId();
  const [draft, setDraft] = useState<AboutPiPagePayload | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imgBusy, setImgBusy] = useState(false);

  const load = useCallback(async () => {
    setErr(null);
    setLoading(true);
    try {
      const { payload, updatedAt: u } = await fetchAboutPiRowForAdmin();
      setDraft(normalizeDraft(payload));
      setUpdatedAt(u);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
      setDraft(normalizeDraft(getAboutPiDefaultsForAdmin()));
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
    try {
      const normalized = normalizeDraft(draft);
      await saveAboutPiPayload(normalized);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function resetToDefaults() {
    if (
      !confirm(
        "Reset the form to built-in defaults? Nothing is saved until you click Save.",
      )
    ) {
      return;
    }
    setDraft(normalizeDraft(getAboutPiDefaultsForAdmin()));
  }

  async function onImagePicked(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    setImgBusy(true);
    try {
      const url = await uploadHomepageImage(f);
      setDraft((d) => (d ? { ...d, imageSrc: url } : d));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setImgBusy(false);
    }
  }

  function patchBiographical(
    patch: Partial<AboutPiPagePayload["biographical"]>,
  ) {
    setDraft((d) =>
      d
        ? {
            ...d,
            biographical: { ...d.biographical, ...patch },
          }
        : d,
    );
  }

  if (loading || !draft) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
        Loading About PI content…
      </div>
    );
  }

  const d = draft;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            About PI page
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Full curriculum-style profile for{" "}
            <Link href="/about-pi/" className="text-brand hover:underline">
              /about-pi/
            </Link>
            . Run{" "}
            <code className="rounded bg-muted px-1 text-xs">
              supabase/about_pi_page_settings.sql
            </code>{" "}
            in Supabase if this is your first time. Use{" "}
            <code className="rounded bg-muted px-1 text-xs">
              supabase/storage_homepage_images.sql
            </code>{" "}
            for image uploads.
          </p>
          {updatedAt ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Last saved: {new Date(updatedAt).toLocaleString()}
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              No row in database yet — defaults shown; Save will create it.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/80"
          >
            Reload
          </button>
          <button
            type="button"
            onClick={resetToDefaults}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/80"
          >
            Reset form
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-brand-deep disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </header>

      {err ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {err}
        </p>
      ) : null}

      <form
        id={formId}
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <section className="space-y-4 rounded-2xl border border-border bg-card/50 p-5">
          <h2 className="text-lg font-semibold text-foreground">
            Hero &amp; social
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={d.name}
                onChange={(e) =>
                  setDraft({ ...d, name: e.target.value })
                }
              />
            </Field>
            <Field label="Title pills (pipe-separated, e.g. Role A | Role B)">
              <input
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={d.title}
                onChange={(e) =>
                  setDraft({ ...d, title: e.target.value })
                }
              />
            </Field>
          </div>
          <Field label="Headshot URL">
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={d.imageSrc}
              onChange={(e) =>
                setDraft({ ...d, imageSrc: e.target.value })
              }
              placeholder="/images/team/... or Supabase public URL"
            />
          </Field>
          <AdminImagePickButton
            busy={imgBusy}
            onPick={(fl) => void onImagePicked(fl)}
          >
            {imgBusy ? "Uploading…" : "Upload headshot (homepage images bucket)"}
          </AdminImagePickButton>
          <Field label="CV current as of (date string)">
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={d.datePrepared}
              onChange={(e) =>
                setDraft({ ...d, datePrepared: e.target.value })
              }
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="LinkedIn URL">
              <input
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={d.linkedinUrl ?? ""}
                onChange={(e) =>
                  setDraft({ ...d, linkedinUrl: e.target.value })
                }
              />
            </Field>
            <Field label="Google Scholar URL">
              <input
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={d.googleScholarUrl ?? ""}
                onChange={(e) =>
                  setDraft({ ...d, googleScholarUrl: e.target.value })
                }
              />
            </Field>
            <Field label="ResearchGate URL">
              <input
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={d.researchgateUrl ?? ""}
                onChange={(e) =>
                  setDraft({ ...d, researchgateUrl: e.target.value })
                }
              />
            </Field>
            <Field label="ORCID URL">
              <input
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={d.orcidUrl ?? ""}
                onChange={(e) =>
                  setDraft({ ...d, orcidUrl: e.target.value })
                }
              />
            </Field>
          </div>
          <Field label="Hero lines (one per line)">
            <textarea
              className="min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={d.heroLines.join("\n")}
              onChange={(e) =>
                setDraft({
                  ...d,
                  heroLines: e.target.value.split("\n"),
                })
              }
            />
          </Field>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card/50 p-5">
          <h2 className="text-lg font-semibold text-foreground">
            About (overview)
          </h2>
          <Field label="Intro paragraphs (blank line between paragraphs)">
            <textarea
              className="min-h-[140px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed"
              value={d.aboutIntro.join("\n\n")}
              onChange={(e) =>
                setDraft({
                  ...d,
                  aboutIntro: e.target.value
                    .split(/\n\n+/)
                    .map((x) => x.trim())
                    .filter(Boolean),
                })
              }
            />
          </Field>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card/50 p-5">
          <h2 className="text-lg font-semibold text-foreground">
            Biographical &amp; contact
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Legal name">
              <input
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={d.biographical.legalName}
                onChange={(e) =>
                  patchBiographical({ legalName: e.target.value })
                }
              />
            </Field>
            <Field label="Telephone">
              <input
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={d.biographical.telephone}
                onChange={(e) =>
                  patchBiographical({ telephone: e.target.value })
                }
              />
            </Field>
            <Field label="Fax">
              <input
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={d.biographical.fax}
                onChange={(e) => patchBiographical({ fax: e.target.value })}
              />
            </Field>
            <Field label="Administrative assistant">
              <input
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={d.biographical.administrativeAssistant}
                onChange={(e) =>
                  patchBiographical({ administrativeAssistant: e.target.value })
                }
              />
            </Field>
          </div>
          <Field label="Practice address (one line per line)">
            <textarea
              className="min-h-[88px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={d.biographical.practiceLines.join("\n")}
              onChange={(e) =>
                patchBiographical({
                  practiceLines: e.target.value.split("\n"),
                })
              }
            />
          </Field>
          <Field label="Email addresses (one per line)">
            <textarea
              className="min-h-[72px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={d.biographical.emails.join("\n")}
              onChange={(e) =>
                patchBiographical({
                  emails: e.target.value.split("\n"),
                })
              }
            />
          </Field>
          <Field label="Published author names (one per line)">
            <textarea
              className="min-h-[88px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={d.biographical.publishedAuthorLines.join("\n")}
              onChange={(e) =>
                patchBiographical({
                  publishedAuthorLines: e.target.value.split("\n"),
                })
              }
            />
          </Field>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card/50 p-5">
          <h2 className="text-lg font-semibold text-foreground">
            CV text (sections F–J)
          </h2>
          <Field label="Full verbatim block (shown in expandable section on the public page)">
            <textarea
              className="min-h-[220px] w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-xs leading-relaxed"
              value={d.cvFullTextSectionsFJ}
              onChange={(e) =>
                setDraft({ ...d, cvFullTextSectionsFJ: e.target.value })
              }
              spellCheck={false}
            />
          </Field>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Lists &amp; tables (JSON)
          </h2>
          <p className="text-sm text-muted-foreground">
            Each block is a JSON array. Use Apply to merge into the draft, then
            Save to publish.
          </p>
          <div className="space-y-2">
            {PI_ARRAY_SECTIONS.map(({ field, label }) => (
              <JsonBlock
                key={field}
                label={label}
                value={d[field]}
                onApply={(parsed) => {
                  if (!Array.isArray(parsed)) {
                    alert(`${label}: JSON must be an array.`);
                    return;
                  }
                  setDraft((prev) =>
                    prev ? { ...prev, [field]: parsed } : prev,
                  );
                }}
              />
            ))}
          </div>
        </section>
      </form>
    </div>
  );
}
