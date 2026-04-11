"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import {
  COLLABORATE_CARD_COLORS,
  COLLABORATE_OPPORTUNITY_ICON_KEYS,
  type CollaborateFunder,
  type CollaborateOpportunity,
  type CollaboratePagePayload,
  type CollaboratePartner,
} from "@/data/collaborate-page";
import { mergeCollaboratePayload } from "@/data/collaborate-defaults";
import {
  fetchCollaborateRowForAdmin,
  getCollaborateDefaultsForAdmin,
  saveCollaboratePayload,
} from "@/lib/collaborate/supabase-collaborate-page";

function splitLines(s: string): string[] {
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function joinLines(a: string[]): string {
  return a.join("\n");
}

const ICON_SET = new Set<string>(COLLABORATE_OPPORTUNITY_ICON_KEYS);
const COLOR_SET = new Set<string>(COLLABORATE_CARD_COLORS);

function coerceIcon(s: string): string {
  const t = s.trim();
  return ICON_SET.has(t) ? t : "users";
}

function coerceColor(s: string): string {
  const t = s.trim();
  return COLOR_SET.has(t) ? t : "brand";
}

function normalizeDraft(d: CollaboratePagePayload): CollaboratePagePayload {
  const o = structuredClone(d);
  const str = (v: string) => v.trim();

  o.heroBadgeIcon = coerceIcon(String(o.heroBadgeIcon));
  o.heroBadge = str(o.heroBadge);
  o.heroTitle = str(o.heroTitle);
  o.heroSubtitle = str(o.heroSubtitle);
  o.heroBody = str(o.heroBody);
  o.heroPill1Icon = coerceIcon(String(o.heroPill1Icon));
  o.heroPill1 = str(o.heroPill1);
  o.heroPill2Icon = coerceIcon(String(o.heroPill2Icon));
  o.heroPill2 = str(o.heroPill2);
  o.heroPill3Icon = coerceIcon(String(o.heroPill3Icon));
  o.heroPill3 = str(o.heroPill3);
  o.focusTitle = str(o.focusTitle);
  o.focusSubtitle = str(o.focusSubtitle);
  o.detectionCardIcon = coerceIcon(String(o.detectionCardIcon));
  o.detectionTitle = str(o.detectionTitle);
  o.detectionLead = str(o.detectionLead);
  o.predictionCardIcon = coerceIcon(String(o.predictionCardIcon));
  o.predictionTitle = str(o.predictionTitle);
  o.predictionLead = str(o.predictionLead);
  o.partnershipTitle = str(o.partnershipTitle);
  o.partnershipSubtitle = str(o.partnershipSubtitle);
  o.opportunities = o.opportunities.map((op) => ({
    title: str(op.title),
    description: str(op.description),
    icon: coerceIcon(String(op.icon)),
    color: coerceColor(String(op.color)),
    benefits: op.benefits.map(str).filter(Boolean),
  }));
  o.partnersTitle = str(o.partnersTitle);
  o.partnersSubtitle = str(o.partnersSubtitle);
  o.partnersVisitLabel = str(o.partnersVisitLabel);
  o.partners = o.partners.map((p) => ({
    name: str(p.name),
    type: str(p.type),
    link: str(p.link),
    imageSrc: str(p.imageSrc),
  }));
  o.fundingBadgeIcon = coerceIcon(String(o.fundingBadgeIcon));
  o.fundingBadge = str(o.fundingBadge);
  o.fundingTitle = str(o.fundingTitle);
  o.fundingSubtitle = str(o.fundingSubtitle);
  o.funderAmountCaption = str(o.funderAmountCaption);
  o.funderButtonLabel = str(o.funderButtonLabel);
  o.funders = o.funders.map((f) => ({
    name: str(f.name),
    type: str(f.type),
    amount: str(f.amount),
    link: str(f.link),
    imageSrc: str(f.imageSrc),
  }));
  o.contactPillIcon = coerceIcon(String(o.contactPillIcon));
  o.contactPill = str(o.contactPill);
  o.contactTitle = str(o.contactTitle);
  o.contactBody = str(o.contactBody);
  o.contactEmail = str(o.contactEmail);
  o.contactPhone = str(o.contactPhone);
  o.contactLocation = str(o.contactLocation);
  o.getInTouchTitle = str(o.getInTouchTitle);
  o.contactEmailLabel = str(o.contactEmailLabel);
  o.contactPhoneLabel = str(o.contactPhoneLabel);
  o.contactLocationLabel = str(o.contactLocationLabel);
  o.researchAreasTitle = str(o.researchAreasTitle);
  o.connectTitle = str(o.connectTitle);
  o.connectSubtitle = str(o.connectSubtitle);
  o.googleScholarLabel = str(o.googleScholarLabel);
  o.googleScholarUrl = str(o.googleScholarUrl);
  o.researchGateLabel = str(o.researchGateLabel);
  o.researchGateUrl = str(o.researchGateUrl);
  o.explorePartnershipButtonText = str(o.explorePartnershipButtonText);
  o.detectionBullets = o.detectionBullets.map(str).filter(Boolean);
  o.predictionBullets = o.predictionBullets.map(str).filter(Boolean);
  o.researchAreas = o.researchAreas.map(str).filter(Boolean);

  return mergeCollaboratePayload(o);
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

function IconSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-xs font-medium text-muted-foreground">
      {label}
      <select
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        value={ICON_SET.has(value) ? value : "users"}
        onChange={(e) => onChange(e.target.value)}
      >
        {COLLABORATE_OPPORTUNITY_ICON_KEYS.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
    </label>
  );
}

function ColorSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-xs font-medium text-muted-foreground">
      {label}
      <select
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        value={COLOR_SET.has(value) ? value : "brand"}
        onChange={(e) => onChange(e.target.value)}
      >
        {COLLABORATE_CARD_COLORS.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
    </label>
  );
}

const emptyOpportunity = (): CollaborateOpportunity => ({
  title: "",
  description: "",
  icon: "users",
  color: "brand",
  benefits: [],
});

const emptyPartner = (): CollaboratePartner => ({
  name: "",
  type: "",
  link: "",
  imageSrc: "",
});

const emptyFunder = (): CollaborateFunder => ({
  name: "",
  type: "",
  amount: "",
  link: "",
  imageSrc: "",
});

export default function CollaboratePageEditor() {
  const [draft, setDraft] = useState<CollaboratePagePayload | null>(null);
  const [detectionText, setDetectionText] = useState("");
  const [predictionText, setPredictionText] = useState("");
  const [researchText, setResearchText] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const { payload, updatedAt: u } = await fetchCollaborateRowForAdmin();
      setDraft(payload);
      setDetectionText(joinLines(payload.detectionBullets));
      setPredictionText(joinLines(payload.predictionBullets));
      setResearchText(joinLines(payload.researchAreas));
      setUpdatedAt(u);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
      const d = getCollaborateDefaultsForAdmin();
      setDraft(d);
      setDetectionText(joinLines(d.detectionBullets));
      setPredictionText(joinLines(d.predictionBullets));
      setResearchText(joinLines(d.researchAreas));
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
        detectionBullets: splitLines(detectionText),
        predictionBullets: splitLines(predictionText),
        researchAreas: splitLines(researchText),
      });
      await saveCollaboratePayload(merged);
      setDraft(merged);
      setDetectionText(joinLines(merged.detectionBullets));
      setPredictionText(joinLines(merged.predictionBullets));
      setResearchText(joinLines(merged.researchAreas));
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
            Collaborate page
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edits the public{" "}
            <Link
              href="/collaborate/"
              className="font-medium text-brand hover:underline"
            >
              /collaborate/
            </Link>{" "}
            page. Run{" "}
            <code className="rounded bg-muted px-1 text-xs">
              collaborate_page_settings.sql
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
              const d = getCollaborateDefaultsForAdmin();
              setDraft(d);
              setDetectionText(joinLines(d.detectionBullets));
              setPredictionText(joinLines(d.predictionBullets));
              setResearchText(joinLines(d.researchAreas));
              setOk(null);
              setErr(null);
            }}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted/80"
          >
            Reset to defaults
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-brand-deep disabled:opacity-60"
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
        <p className="rounded-lg border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-brand">
          {ok}
        </p>
      ) : null}

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Hero</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <IconSelect
            label="Badge icon"
            value={draft.heroBadgeIcon}
            onChange={(v) => setDraft({ ...draft, heroBadgeIcon: v })}
          />
          <Field
            label="Badge text"
            value={draft.heroBadge}
            onChange={(v) => setDraft({ ...draft, heroBadge: v })}
          />
          <Field
            label="Title"
            value={draft.heroTitle}
            onChange={(v) => setDraft({ ...draft, heroTitle: v })}
          />
          <Field
            label="Subtitle"
            value={draft.heroSubtitle}
            onChange={(v) => setDraft({ ...draft, heroSubtitle: v })}
          />
        </div>
        <Field
          label="Intro paragraph"
          value={draft.heroBody}
          onChange={(v) => setDraft({ ...draft, heroBody: v })}
          multiline
          rows={4}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <IconSelect
            label="Pill 1 icon"
            value={draft.heroPill1Icon}
            onChange={(v) => setDraft({ ...draft, heroPill1Icon: v })}
          />
          <Field
            label="Pill 1 text"
            value={draft.heroPill1}
            onChange={(v) => setDraft({ ...draft, heroPill1: v })}
          />
          <IconSelect
            label="Pill 2 icon"
            value={draft.heroPill2Icon}
            onChange={(v) => setDraft({ ...draft, heroPill2Icon: v })}
          />
          <Field
            label="Pill 2 text"
            value={draft.heroPill2}
            onChange={(v) => setDraft({ ...draft, heroPill2: v })}
          />
          <IconSelect
            label="Pill 3 icon"
            value={draft.heroPill3Icon}
            onChange={(v) => setDraft({ ...draft, heroPill3Icon: v })}
          />
          <Field
            label="Pill 3 text"
            value={draft.heroPill3}
            onChange={(v) => setDraft({ ...draft, heroPill3: v })}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Research focus
        </h2>
        <Field
          label="Section title"
          value={draft.focusTitle}
          onChange={(v) => setDraft({ ...draft, focusTitle: v })}
        />
        <Field
          label="Section subtitle"
          value={draft.focusSubtitle}
          onChange={(v) => setDraft({ ...draft, focusSubtitle: v })}
          multiline
          rows={2}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3 rounded-lg border border-border/80 p-4">
            <h3 className="text-sm font-medium text-foreground">
              Detection column
            </h3>
            <IconSelect
              label="Card icon"
              value={draft.detectionCardIcon}
              onChange={(v) => setDraft({ ...draft, detectionCardIcon: v })}
            />
            <Field
              label="Title"
              value={draft.detectionTitle}
              onChange={(v) => setDraft({ ...draft, detectionTitle: v })}
            />
            <Field
              label="Lead"
              value={draft.detectionLead}
              onChange={(v) => setDraft({ ...draft, detectionLead: v })}
            />
            <label className="block text-xs font-medium text-muted-foreground">
              Bullets (one per line)
              <textarea
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm"
                rows={6}
                value={detectionText}
                onChange={(e) => setDetectionText(e.target.value)}
              />
            </label>
          </div>
          <div className="space-y-3 rounded-lg border border-border/80 p-4">
            <h3 className="text-sm font-medium text-foreground">
              Prediction column
            </h3>
            <IconSelect
              label="Card icon"
              value={draft.predictionCardIcon}
              onChange={(v) => setDraft({ ...draft, predictionCardIcon: v })}
            />
            <Field
              label="Title"
              value={draft.predictionTitle}
              onChange={(v) => setDraft({ ...draft, predictionTitle: v })}
            />
            <Field
              label="Lead"
              value={draft.predictionLead}
              onChange={(v) => setDraft({ ...draft, predictionLead: v })}
            />
            <label className="block text-xs font-medium text-muted-foreground">
              Bullets (one per line)
              <textarea
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm"
                rows={6}
                value={predictionText}
                onChange={(e) => setPredictionText(e.target.value)}
              />
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Partnership opportunities
        </h2>
        <Field
          label="Section title"
          value={draft.partnershipTitle}
          onChange={(v) => setDraft({ ...draft, partnershipTitle: v })}
        />
        <Field
          label="Section subtitle"
          value={draft.partnershipSubtitle}
          onChange={(v) => setDraft({ ...draft, partnershipSubtitle: v })}
          multiline
          rows={2}
        />
        <Field
          label="Card CTA button text"
          value={draft.explorePartnershipButtonText}
          onChange={(v) =>
            setDraft({ ...draft, explorePartnershipButtonText: v })
          }
        />
        <div className="space-y-6">
          {draft.opportunities.map((op, i) => (
            <div
              key={i}
              className="space-y-3 rounded-lg border border-dashed border-border p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">
                  Opportunity {i + 1}
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md border border-destructive/30 px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      opportunities: draft.opportunities.filter(
                        (_, j) => j !== i,
                      ),
                    })
                  }
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Title"
                  value={op.title}
                  onChange={(v) => {
                    const next = [...draft.opportunities];
                    next[i] = { ...next[i], title: v };
                    setDraft({ ...draft, opportunities: next });
                  }}
                />
                <IconSelect
                  label="Icon"
                  value={op.icon}
                  onChange={(v) => {
                    const next = [...draft.opportunities];
                    next[i] = { ...next[i], icon: v };
                    setDraft({ ...draft, opportunities: next });
                  }}
                />
                <ColorSelect
                  label="Accent color"
                  value={op.color}
                  onChange={(v) => {
                    const next = [...draft.opportunities];
                    next[i] = { ...next[i], color: v };
                    setDraft({ ...draft, opportunities: next });
                  }}
                />
              </div>
              <Field
                label="Description"
                value={op.description}
                onChange={(v) => {
                  const next = [...draft.opportunities];
                  next[i] = { ...next[i], description: v };
                  setDraft({ ...draft, opportunities: next });
                }}
                multiline
                rows={2}
              />
              <label className="block text-xs font-medium text-muted-foreground">
                Benefits (one per line)
                <textarea
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm"
                  rows={4}
                  value={joinLines(op.benefits)}
                  onChange={(e) => {
                    const next = [...draft.opportunities];
                    next[i] = {
                      ...next[i],
                      benefits: splitLines(e.target.value),
                    };
                    setDraft({ ...draft, opportunities: next });
                  }}
                />
              </label>
            </div>
          ))}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted/80"
            onClick={() =>
              setDraft({
                ...draft,
                opportunities: [...draft.opportunities, emptyOpportunity()],
              })
            }
          >
            <Plus className="h-4 w-4" />
            Add opportunity
          </button>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Partners</h2>
        <Field
          label="Section title"
          value={draft.partnersTitle}
          onChange={(v) => setDraft({ ...draft, partnersTitle: v })}
        />
        <Field
          label="Section subtitle"
          value={draft.partnersSubtitle}
          onChange={(v) => setDraft({ ...draft, partnersSubtitle: v })}
          multiline
          rows={2}
        />
        <Field
          label="Link row label (e.g. Visit Website)"
          value={draft.partnersVisitLabel}
          onChange={(v) => setDraft({ ...draft, partnersVisitLabel: v })}
        />
        <div className="space-y-4">
          {draft.partners.map((p, i) => (
            <div
              key={i}
              className="grid gap-3 rounded-lg border border-dashed border-border p-4 sm:grid-cols-2"
            >
              <div className="sm:col-span-2 flex items-center justify-between">
                <span className="text-sm font-medium">Partner {i + 1}</span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md border border-destructive/30 px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      partners: draft.partners.filter((_, j) => j !== i),
                    })
                  }
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              </div>
              <Field
                label="Name"
                value={p.name}
                onChange={(v) => {
                  const next = [...draft.partners];
                  next[i] = { ...next[i], name: v };
                  setDraft({ ...draft, partners: next });
                }}
              />
              <Field
                label="Type / subtitle"
                value={p.type}
                onChange={(v) => {
                  const next = [...draft.partners];
                  next[i] = { ...next[i], type: v };
                  setDraft({ ...draft, partners: next });
                }}
              />
              <Field
                label="URL"
                value={p.link}
                onChange={(v) => {
                  const next = [...draft.partners];
                  next[i] = { ...next[i], link: v };
                  setDraft({ ...draft, partners: next });
                }}
              />
              <Field
                label="Logo image path"
                value={p.imageSrc}
                onChange={(v) => {
                  const next = [...draft.partners];
                  next[i] = { ...next[i], imageSrc: v };
                  setDraft({ ...draft, partners: next });
                }}
                placeholder="/images/partners/..."
              />
            </div>
          ))}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted/80"
            onClick={() =>
              setDraft({
                ...draft,
                partners: [...draft.partners, emptyPartner()],
              })
            }
          >
            <Plus className="h-4 w-4" />
            Add partner
          </button>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Funding</h2>
        <IconSelect
          label="Badge icon"
          value={draft.fundingBadgeIcon}
          onChange={(v) => setDraft({ ...draft, fundingBadgeIcon: v })}
        />
        <Field
          label="Badge text"
          value={draft.fundingBadge}
          onChange={(v) => setDraft({ ...draft, fundingBadge: v })}
        />
        <Field
          label="Section title"
          value={draft.fundingTitle}
          onChange={(v) => setDraft({ ...draft, fundingTitle: v })}
        />
        <Field
          label="Section subtitle"
          value={draft.fundingSubtitle}
          onChange={(v) => setDraft({ ...draft, fundingSubtitle: v })}
          multiline
          rows={2}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Amount box caption"
            value={draft.funderAmountCaption}
            onChange={(v) => setDraft({ ...draft, funderAmountCaption: v })}
          />
          <Field
            label="Button label"
            value={draft.funderButtonLabel}
            onChange={(v) => setDraft({ ...draft, funderButtonLabel: v })}
          />
        </div>
        <div className="space-y-4">
          {draft.funders.map((f, i) => (
            <div
              key={i}
              className="grid gap-3 rounded-lg border border-dashed border-border p-4 sm:grid-cols-2"
            >
              <div className="sm:col-span-2 flex items-center justify-between">
                <span className="text-sm font-medium">Funder {i + 1}</span>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md border border-destructive/30 px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      funders: draft.funders.filter((_, j) => j !== i),
                    })
                  }
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
              </div>
              <Field
                label="Name"
                value={f.name}
                onChange={(v) => {
                  const next = [...draft.funders];
                  next[i] = { ...next[i], name: v };
                  setDraft({ ...draft, funders: next });
                }}
              />
              <Field
                label="Type"
                value={f.type}
                onChange={(v) => {
                  const next = [...draft.funders];
                  next[i] = { ...next[i], type: v };
                  setDraft({ ...draft, funders: next });
                }}
              />
              <Field
                label="Amount (optional)"
                value={f.amount}
                onChange={(v) => {
                  const next = [...draft.funders];
                  next[i] = { ...next[i], amount: v };
                  setDraft({ ...draft, funders: next });
                }}
              />
              <Field
                label="Learn more URL"
                value={f.link}
                onChange={(v) => {
                  const next = [...draft.funders];
                  next[i] = { ...next[i], link: v };
                  setDraft({ ...draft, funders: next });
                }}
              />
              <Field
                label="Logo image path"
                value={f.imageSrc}
                onChange={(v) => {
                  const next = [...draft.funders];
                  next[i] = { ...next[i], imageSrc: v };
                  setDraft({ ...draft, funders: next });
                }}
                placeholder="/images/partners/..."
              />
            </div>
          ))}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted/80"
            onClick={() =>
              setDraft({
                ...draft,
                funders: [...draft.funders, emptyFunder()],
              })
            }
          >
            <Plus className="h-4 w-4" />
            Add funder
          </button>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Contact block</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <IconSelect
            label="Top pill icon"
            value={draft.contactPillIcon}
            onChange={(v) => setDraft({ ...draft, contactPillIcon: v })}
          />
          <Field
            label="Top pill text"
            value={draft.contactPill}
            onChange={(v) => setDraft({ ...draft, contactPill: v })}
          />
        </div>
        <Field
          label="Title"
          value={draft.contactTitle}
          onChange={(v) => setDraft({ ...draft, contactTitle: v })}
        />
        <Field
          label="Body"
          value={draft.contactBody}
          onChange={(v) => setDraft({ ...draft, contactBody: v })}
          multiline
          rows={4}
        />
        <Field
          label="Get in touch — heading"
          value={draft.getInTouchTitle}
          onChange={(v) => setDraft({ ...draft, getInTouchTitle: v })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Email label"
            value={draft.contactEmailLabel}
            onChange={(v) => setDraft({ ...draft, contactEmailLabel: v })}
          />
          <Field
            label="Email address"
            value={draft.contactEmail}
            onChange={(v) => setDraft({ ...draft, contactEmail: v })}
          />
          <Field
            label="Phone label"
            value={draft.contactPhoneLabel}
            onChange={(v) => setDraft({ ...draft, contactPhoneLabel: v })}
          />
          <Field
            label="Phone"
            value={draft.contactPhone}
            onChange={(v) => setDraft({ ...draft, contactPhone: v })}
          />
          <Field
            label="Location label"
            value={draft.contactLocationLabel}
            onChange={(v) => setDraft({ ...draft, contactLocationLabel: v })}
          />
        </div>
        <label className="block text-xs font-medium text-muted-foreground">
          Location (use line breaks for multiple lines)
          <textarea
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            rows={3}
            value={draft.contactLocation}
            onChange={(e) =>
              setDraft({ ...draft, contactLocation: e.target.value })
            }
          />
        </label>
        <Field
          label="Research areas — heading"
          value={draft.researchAreasTitle}
          onChange={(v) => setDraft({ ...draft, researchAreasTitle: v })}
        />
        <label className="block text-xs font-medium text-muted-foreground">
          Research areas (one per line)
          <textarea
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm"
            rows={6}
            value={researchText}
            onChange={(e) => setResearchText(e.target.value)}
          />
        </label>
        <Field
          label="Connect section title"
          value={draft.connectTitle}
          onChange={(v) => setDraft({ ...draft, connectTitle: v })}
        />
        <Field
          label="Connect section subtitle"
          value={draft.connectSubtitle}
          onChange={(v) => setDraft({ ...draft, connectSubtitle: v })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Google Scholar button label"
            value={draft.googleScholarLabel}
            onChange={(v) => setDraft({ ...draft, googleScholarLabel: v })}
          />
          <Field
            label="Google Scholar URL"
            value={draft.googleScholarUrl}
            onChange={(v) => setDraft({ ...draft, googleScholarUrl: v })}
          />
          <Field
            label="ResearchGate button label"
            value={draft.researchGateLabel}
            onChange={(v) => setDraft({ ...draft, researchGateLabel: v })}
          />
          <Field
            label="ResearchGate URL"
            value={draft.researchGateUrl}
            onChange={(v) => setDraft({ ...draft, researchGateUrl: v })}
          />
        </div>
      </section>
    </div>
  );
}
