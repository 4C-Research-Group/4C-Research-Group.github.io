"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  HOMEPAGE_DEFAULTS,
  type HomepagePayload,
  type PillIcon,
  type PillTone,
  type StatIcon,
  type ThemeColor,
  type ThemeIcon,
} from "@/data/homepage-defaults";
import {
  fetchHomepageRowForAdmin,
  getHomepageDefaultsForAdmin,
  saveHomepagePayload,
} from "@/lib/homepage/supabase-homepage";
import { uploadHomepageImage } from "@/lib/homepage/homepage-image-storage";

function normalizeAdminPayload(p: HomepagePayload): HomepagePayload {
  const o = structuredClone(p);
  const snapDef = HOMEPAGE_DEFAULTS.heroSnapshots;
  while (o.heroSnapshots.length < 3) {
    o.heroSnapshots.push({ ...snapDef[o.heroSnapshots.length]! });
  }
  o.heroSnapshots = o.heroSnapshots.slice(0, 3);
  return o;
}

function ImgRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setBusy(true);
    try {
      onChange(await uploadHomepageImage(f));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/images/... or https://..."
      />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => void onFile(e)}
          className="max-w-full"
        />
        {busy ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brand" />
        ) : null}
      </div>
    </div>
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

export default function HomepageEditor() {
  const formId = useId();
  const [draft, setDraft] = useState<HomepagePayload | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setErr(null);
    setLoading(true);
    try {
      const { payload, updatedAt: u } = await fetchHomepageRowForAdmin();
      setDraft(normalizeAdminPayload(payload));
      setUpdatedAt(u);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
      setDraft(normalizeAdminPayload(getHomepageDefaultsForAdmin()));
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
      await saveHomepagePayload(draft);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function resetToDefaults() {
    if (!confirm("Reset the form to built-in defaults? Nothing is saved until you click Save.")) {
      return;
    }
    setDraft(normalizeAdminPayload(getHomepageDefaultsForAdmin()));
  }

  if (loading || !draft) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
        Loading homepage settings…
      </div>
    );
  }

  const d = draft;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Homepage
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Edit all homepage sections and images. Run{" "}
            <code className="rounded bg-muted px-1 text-xs">
              supabase/homepage_settings.sql
            </code>{" "}
            and{" "}
            <code className="rounded bg-muted px-1 text-xs">
              supabase/storage_homepage_images.sql
            </code>{" "}
            in Supabase if this is your first time.{" "}
            <Link href="/" className="text-brand hover:underline">
              View site
            </Link>
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
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {err}
        </div>
      ) : null}

      <form
        id={formId}
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <details className="rounded-2xl border border-border bg-card p-5 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            Hero
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Badge">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.hero.badge}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    hero: { ...d.hero, badge: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Tagline">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.hero.tagline}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    hero: { ...d.hero, tagline: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Title highlight (e.g. 4C)">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.hero.titleHighlight}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    hero: { ...d.hero, titleHighlight: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Title rest">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.hero.titleRest}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    hero: { ...d.hero, titleRest: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Lead paragraph">
              <textarea
                className="min-h-[88px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.hero.lead}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    hero: { ...d.hero, lead: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Partner blurb">
              <textarea
                className="min-h-[88px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.hero.partnerBlurb}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    hero: { ...d.hero, partnerBlurb: e.target.value },
                  })
                }
              />
            </Field>
            <ImgRow
              label="Hero logo"
              value={d.hero.heroLogoSrc}
              onChange={(v) =>
                setDraft({ ...d, hero: { ...d.hero, heroLogoSrc: v } })
              }
            />
            <ImgRow
              label="Brain pattern (SVG or image)"
              value={d.hero.brainPatternSrc}
              onChange={(v) =>
                setDraft({ ...d, hero: { ...d.hero, brainPatternSrc: v } })
              }
            />
          </div>

          <p className="mt-4 text-xs font-semibold text-foreground">Pill links</p>
          <div className="mt-2 space-y-3">
            {d.hero.pills.map((pill, i) => (
              <div
                key={i}
                className="grid gap-2 rounded-xl border border-border/80 bg-muted/10 p-3 sm:grid-cols-4"
              >
                <input
                  className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                  value={pill.label}
                  placeholder="Label"
                  onChange={(e) => {
                    const pills = [...d.hero.pills];
                    pills[i] = { ...pills[i]!, label: e.target.value };
                    setDraft({ ...d, hero: { ...d.hero, pills } });
                  }}
                />
                <input
                  className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                  value={pill.href}
                  placeholder="/research/"
                  onChange={(e) => {
                    const pills = [...d.hero.pills];
                    pills[i] = { ...pills[i]!, href: e.target.value };
                    setDraft({ ...d, hero: { ...d.hero, pills } });
                  }}
                />
                <select
                  className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                  value={pill.icon}
                  onChange={(e) => {
                    const pills = [...d.hero.pills];
                    pills[i] = {
                      ...pills[i]!,
                      icon: e.target.value as PillIcon,
                    };
                    setDraft({ ...d, hero: { ...d.hero, pills } });
                  }}
                >
                  {(["brain", "microscope", "zap"] as const).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                <select
                  className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                  value={pill.tone}
                  onChange={(e) => {
                    const pills = [...d.hero.pills];
                    pills[i] = {
                      ...pills[i]!,
                      tone: e.target.value as PillTone,
                    };
                    setDraft({ ...d, hero: { ...d.hero, pills } });
                  }}
                >
                  {(["cognition", "consciousness", "care"] as const).map(
                    (k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ),
                  )}
                </select>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs font-semibold text-foreground">Primary CTAs</p>
          <div className="mt-2 space-y-3">
            {d.hero.ctas.map((cta, i) => (
              <div
                key={i}
                className="grid gap-2 rounded-xl border border-border/80 bg-muted/10 p-3 sm:grid-cols-4"
              >
                <input
                  className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                  value={cta.label}
                  onChange={(e) => {
                    const ctas = [...d.hero.ctas];
                    ctas[i] = { ...ctas[i]!, label: e.target.value };
                    setDraft({ ...d, hero: { ...d.hero, ctas } });
                  }}
                />
                <input
                  className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                  value={cta.href}
                  onChange={(e) => {
                    const ctas = [...d.hero.ctas];
                    ctas[i] = { ...ctas[i]!, href: e.target.value };
                    setDraft({ ...d, hero: { ...d.hero, ctas } });
                  }}
                />
                <select
                  className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                  value={cta.variant}
                  onChange={(e) => {
                    const ctas = [...d.hero.ctas];
                    ctas[i] = {
                      ...ctas[i]!,
                      variant: e.target.value as "primary" | "outline" | "ghost",
                    };
                    setDraft({ ...d, hero: { ...d.hero, ctas } });
                  }}
                >
                  <option value="primary">primary</option>
                  <option value="outline">outline</option>
                  <option value="ghost">ghost</option>
                </select>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={!!cta.showArrow}
                    onChange={(e) => {
                      const ctas = [...d.hero.ctas];
                      ctas[i] = { ...ctas[i]!, showArrow: e.target.checked };
                      setDraft({ ...d, hero: { ...d.hero, ctas } });
                    }}
                  />
                  Show arrow
                </label>
              </div>
            ))}
          </div>
        </details>

        <details className="rounded-2xl border border-border bg-card p-5 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            Hero lab snapshots (3)
          </summary>
          <div className="mt-4 grid gap-4">
            {d.heroSnapshots.map((snap, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-2">
                <ImgRow
                  label={`Image ${i + 1}`}
                  value={snap.src}
                  onChange={(v) => {
                    const heroSnapshots = [...d.heroSnapshots];
                    heroSnapshots[i] = { ...heroSnapshots[i]!, src: v };
                    setDraft({ ...d, heroSnapshots });
                  }}
                />
                <Field label="Alt text">
                  <input
                    className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                    value={snap.alt}
                    onChange={(e) => {
                      const heroSnapshots = [...d.heroSnapshots];
                      heroSnapshots[i] = {
                        ...heroSnapshots[i]!,
                        alt: e.target.value,
                      };
                      setDraft({ ...d, heroSnapshots });
                    }}
                  />
                </Field>
              </div>
            ))}
          </div>
        </details>

        <details className="rounded-2xl border border-border bg-card p-5 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            Mission
          </summary>
          <div className="mt-4 grid gap-4">
            <Field label="Title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.mission.title}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    mission: { ...d.mission, title: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Paragraphs (one per line)">
              <textarea
                className="min-h-[120px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.mission.paragraphs.join("\n\n")}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    mission: {
                      ...d.mission,
                      paragraphs: e.target.value
                        .split(/\n\n+/)
                        .map((p) => p.trim())
                        .filter(Boolean),
                    },
                  })
                }
              />
            </Field>
            <ImgRow
              label="Mission image"
              value={d.mission.imageSrc}
              onChange={(v) =>
                setDraft({
                  ...d,
                  mission: { ...d.mission, imageSrc: v },
                })
              }
            />
            <Field label="Image alt">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.mission.imageAlt}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    mission: { ...d.mission, imageAlt: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Overlay title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.mission.overlayTitle}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    mission: { ...d.mission, overlayTitle: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Overlay subtitle">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.mission.overlaySubtitle}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    mission: { ...d.mission, overlaySubtitle: e.target.value },
                  })
                }
              />
            </Field>
          </div>
        </details>

        <details className="rounded-2xl border border-border bg-card p-5 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            Gallery preview
          </summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.gallery.title}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    gallery: { ...d.gallery, title: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Subtitle">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.gallery.subtitle}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    gallery: { ...d.gallery, subtitle: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="View all label">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.gallery.viewAllLabel}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    gallery: { ...d.gallery, viewAllLabel: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="View all href">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.gallery.viewAllHref}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    gallery: { ...d.gallery, viewAllHref: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Bottom CTA label">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.gallery.bottomCtaLabel}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    gallery: { ...d.gallery, bottomCtaLabel: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Bottom CTA href">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.gallery.bottomCtaHref}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    gallery: { ...d.gallery, bottomCtaHref: e.target.value },
                  })
                }
              />
            </Field>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">Grid images</p>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted/80"
              onClick={() =>
                setDraft({
                  ...d,
                  gallery: {
                    ...d.gallery,
                    items: [
                      ...d.gallery.items,
                      {
                        imageSrc: "/images/lab-images/",
                        alt: "Lab preview",
                        span: "",
                      },
                    ],
                  },
                })
              }
            >
              <Plus className="h-3.5 w-3.5" />
              Add tile
            </button>
          </div>
          <div className="mt-2 space-y-3">
            {d.gallery.items.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/80 bg-muted/10 p-3"
              >
                <div className="mb-2 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                    onClick={() => {
                      const items = d.gallery.items.filter((_, j) => j !== i);
                      setDraft({
                        ...d,
                        gallery: { ...d.gallery, items },
                      });
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <ImgRow
                    label="Image URL"
                    value={item.imageSrc}
                    onChange={(v) => {
                      const items = [...d.gallery.items];
                      items[i] = { ...items[i]!, imageSrc: v };
                      setDraft({
                        ...d,
                        gallery: { ...d.gallery, items },
                      });
                    }}
                  />
                  <Field label="Alt">
                    <input
                      className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                      value={item.alt}
                      onChange={(e) => {
                        const items = [...d.gallery.items];
                        items[i] = { ...items[i]!, alt: e.target.value };
                        setDraft({
                          ...d,
                          gallery: { ...d.gallery, items },
                        });
                      }}
                    />
                  </Field>
                  <Field label="Grid span (Tailwind classes)">
                    <input
                      className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                      value={item.span}
                      placeholder="e.g. col-span-2 row-span-2"
                      onChange={(e) => {
                        const items = [...d.gallery.items];
                        items[i] = { ...items[i]!, span: e.target.value };
                        setDraft({
                          ...d,
                          gallery: { ...d.gallery, items },
                        });
                      }}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </details>

        <details className="rounded-2xl border border-border bg-card p-5 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            Impact stats
          </summary>
          <div className="mt-4 space-y-3">
            <Field label="Section title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.impact.title}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    impact: { ...d.impact, title: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Subtitle">
              <textarea
                className="min-h-[72px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.impact.subtitle}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    impact: { ...d.impact, subtitle: e.target.value },
                  })
                }
              />
            </Field>
            {d.impact.stats.map((stat, i) => (
              <div
                key={i}
                className="grid gap-2 rounded-xl border border-border/80 bg-muted/10 p-3 sm:grid-cols-3"
              >
                <input
                  className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                  value={stat.value}
                  placeholder="12+"
                  onChange={(e) => {
                    const stats = [...d.impact.stats];
                    stats[i] = { ...stats[i]!, value: e.target.value };
                    setDraft({ ...d, impact: { ...d.impact, stats } });
                  }}
                />
                <input
                  className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                  value={stat.label}
                  onChange={(e) => {
                    const stats = [...d.impact.stats];
                    stats[i] = { ...stats[i]!, label: e.target.value };
                    setDraft({ ...d, impact: { ...d.impact, stats } });
                  }}
                />
                <select
                  className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                  value={stat.icon}
                  onChange={(e) => {
                    const stats = [...d.impact.stats];
                    stats[i] = {
                      ...stats[i]!,
                      icon: e.target.value as StatIcon,
                    };
                    setDraft({ ...d, impact: { ...d.impact, stats } });
                  }}
                >
                  {(["brain", "book", "users", "award"] as const).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <button
              type="button"
              className="text-xs font-medium text-brand hover:underline"
              onClick={() =>
                setDraft({
                  ...d,
                  impact: {
                    ...d.impact,
                    stats: [
                      ...d.impact.stats,
                      { value: "0", label: "New stat", icon: "brain" },
                    ],
                  },
                })
              }
            >
              + Add stat
            </button>
          </div>
        </details>

        <details className="rounded-2xl border border-border bg-card p-5 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            Research themes
          </summary>
          <div className="mt-4 grid gap-3">
            <Field label="Section title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.researchThemes.title}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    researchThemes: {
                      ...d.researchThemes,
                      title: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Subtitle">
              <textarea
                className="min-h-[72px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.researchThemes.subtitle}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    researchThemes: {
                      ...d.researchThemes,
                      subtitle: e.target.value,
                    },
                  })
                }
              />
            </Field>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">Themes</p>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted/80"
              onClick={() =>
                setDraft({
                  ...d,
                  researchThemes: {
                    ...d.researchThemes,
                    themes: [
                      ...d.researchThemes.themes,
                      {
                        title: "New theme",
                        description: "",
                        icon: "brain",
                        color: "brand",
                        projects: [],
                      },
                    ],
                  },
                })
              }
            >
              <Plus className="h-3.5 w-3.5" />
              Add theme
            </button>
          </div>
          <div className="mt-2 space-y-4">
            {d.researchThemes.themes.map((theme, ti) => (
              <div
                key={ti}
                className="rounded-xl border border-border/80 bg-muted/10 p-4"
              >
                <div className="mb-3 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                    onClick={() => {
                      const themes = d.researchThemes.themes.filter(
                        (_, j) => j !== ti,
                      );
                      setDraft({
                        ...d,
                        researchThemes: { ...d.researchThemes, themes },
                      });
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove theme
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="Title">
                    <input
                      className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                      value={theme.title}
                      onChange={(e) => {
                        const themes = [...d.researchThemes.themes];
                        themes[ti] = {
                          ...themes[ti]!,
                          title: e.target.value,
                        };
                        setDraft({
                          ...d,
                          researchThemes: {
                            ...d.researchThemes,
                            themes,
                          },
                        });
                      }}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Icon">
                      <select
                        className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                        value={theme.icon}
                        onChange={(e) => {
                          const themes = [...d.researchThemes.themes];
                          themes[ti] = {
                            ...themes[ti]!,
                            icon: e.target.value as ThemeIcon,
                          };
                          setDraft({
                            ...d,
                            researchThemes: {
                              ...d.researchThemes,
                              themes,
                            },
                          });
                        }}
                      >
                        {(
                          ["brain", "activity", "eye", "users"] as const
                        ).map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Color">
                      <select
                        className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                        value={theme.color}
                        onChange={(e) => {
                          const themes = [...d.researchThemes.themes];
                          themes[ti] = {
                            ...themes[ti]!,
                            color: e.target.value as ThemeColor,
                          };
                          setDraft({
                            ...d,
                            researchThemes: {
                              ...d.researchThemes,
                              themes,
                            },
                          });
                        }}
                      >
                        {(
                          [
                            "cognition",
                            "consciousness",
                            "care",
                            "brand",
                          ] as const
                        ).map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Description">
                    <textarea
                      className="min-h-[72px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                      value={theme.description}
                      onChange={(e) => {
                        const themes = [...d.researchThemes.themes];
                        themes[ti] = {
                          ...themes[ti]!,
                          description: e.target.value,
                        };
                        setDraft({
                          ...d,
                          researchThemes: {
                            ...d.researchThemes,
                            themes,
                          },
                        });
                      }}
                    />
                  </Field>
                  <Field label="Projects (one per line)">
                    <textarea
                      className="min-h-[100px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                      value={theme.projects.join("\n")}
                      onChange={(e) => {
                        const themes = [...d.researchThemes.themes];
                        themes[ti] = {
                          ...themes[ti]!,
                          projects: e.target.value
                            .split("\n")
                            .map((l) => l.trim())
                            .filter(Boolean),
                        };
                        setDraft({
                          ...d,
                          researchThemes: {
                            ...d.researchThemes,
                            themes,
                          },
                        });
                      }}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </details>

        <details className="rounded-2xl border border-border bg-card p-5 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            Latest news card
          </summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Section title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.news.title}
                onChange={(e) =>
                  setDraft({ ...d, news: { ...d.news, title: e.target.value } })
                }
              />
            </Field>
            <Field label="Badge label">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.news.badgeLabel}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    news: { ...d.news, badgeLabel: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Article title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                value={d.news.articleTitle}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    news: { ...d.news, articleTitle: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Article body">
              <textarea
                className="min-h-[120px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                value={d.news.articleBody}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    news: { ...d.news, articleBody: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="CTA label">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.news.ctaLabel}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    news: { ...d.news, ctaLabel: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="CTA URL">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.news.ctaHref}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    news: { ...d.news, ctaHref: e.target.value },
                  })
                }
              />
            </Field>
            <ImgRow
              label="News image"
              value={d.news.imageSrc}
              onChange={(v) =>
                setDraft({ ...d, news: { ...d.news, imageSrc: v } })
              }
            />
            <Field label="Image alt">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.news.imageAlt}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    news: { ...d.news, imageAlt: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Footer note">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                value={d.news.footerNote}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    news: { ...d.news, footerNote: e.target.value },
                  })
                }
              />
            </Field>
          </div>
        </details>

        <details className="rounded-2xl border border-border bg-card p-5 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            Featured projects (section header only; cards still come from Projects)
          </summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.featured.title}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    featured: { ...d.featured, title: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Subtitle">
              <textarea
                className="min-h-[72px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.featured.subtitle}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    featured: { ...d.featured, subtitle: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="View all label">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.featured.viewAllLabel}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    featured: { ...d.featured, viewAllLabel: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="View all href">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.featured.viewAllHref}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    featured: { ...d.featured, viewAllHref: e.target.value },
                  })
                }
              />
            </Field>
          </div>
        </details>

        <details className="rounded-2xl border border-border bg-card p-5 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            Join community strip
          </summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                value={d.join.title}
                onChange={(e) =>
                  setDraft({ ...d, join: { ...d.join, title: e.target.value } })
                }
              />
            </Field>
            <Field label="Body">
              <textarea
                className="min-h-[100px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                value={d.join.body}
                onChange={(e) =>
                  setDraft({ ...d, join: { ...d.join, body: e.target.value } })
                }
              />
            </Field>
            <Field label="Primary CTA label">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.join.primaryCtaLabel}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    join: { ...d.join, primaryCtaLabel: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Primary CTA href">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.join.primaryCtaHref}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    join: { ...d.join, primaryCtaHref: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Secondary CTA label">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.join.secondaryCtaLabel}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    join: { ...d.join, secondaryCtaLabel: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Secondary CTA href">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.join.secondaryCtaHref}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    join: { ...d.join, secondaryCtaHref: e.target.value },
                  })
                }
              />
            </Field>
          </div>
        </details>

        <details className="rounded-2xl border border-border bg-card p-5 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            Social / stay connected
          </summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.social.title}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    social: { ...d.social, title: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Eyebrow">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.social.eyebrow}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    social: { ...d.social, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Body">
              <textarea
                className="min-h-[100px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                value={d.social.body}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    social: { ...d.social, body: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Button label">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.social.buttonLabel}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    social: { ...d.social, buttonLabel: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Button URL">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.social.buttonHref}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    social: { ...d.social, buttonHref: e.target.value },
                  })
                }
              />
            </Field>
          </div>
        </details>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-brand-deep disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save homepage"}
          </button>
        </div>
      </form>
    </div>
  );
}
