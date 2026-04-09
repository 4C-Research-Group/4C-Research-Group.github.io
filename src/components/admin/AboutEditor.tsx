"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  type AboutPayload,
  type AboutTone,
  type HeroPillIcon,
  type MissionCardIcon,
} from "@/data/about-defaults";
import {
  fetchAboutRowForAdmin,
  getAboutDefaultsForAdmin,
  saveAboutPayload,
} from "@/lib/about/supabase-about";
import { uploadHomepageImage } from "@/lib/homepage/homepage-image-storage";

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

export default function AboutEditor() {
  const formId = useId();
  const [draft, setDraft] = useState<AboutPayload | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setErr(null);
    setLoading(true);
    try {
      const { payload, updatedAt: u } = await fetchAboutRowForAdmin();
      setDraft(payload);
      setUpdatedAt(u);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
      setDraft(getAboutDefaultsForAdmin());
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
      await saveAboutPayload(draft);
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
    setDraft(getAboutDefaultsForAdmin());
  }

  if (loading || !draft) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
        Loading about page settings…
      </div>
    );
  }

  const d = draft;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            About page
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Edit the public About page. Run{" "}
            <code className="rounded bg-muted px-1 text-xs">
              supabase/about_page_settings.sql
            </code>{" "}
            once. Images upload to the same{" "}
            <code className="rounded bg-muted px-1 text-xs">
              homepage-images
            </code>{" "}
            bucket as the homepage editor.{" "}
            <Link href="/about/" className="text-brand hover:underline">
              View About
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
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Badge">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.hero.badge}
                onChange={(e) =>
                  setDraft({ ...d, hero: { ...d.hero, badge: e.target.value } })
                }
              />
            </Field>
            <Field label="Title line 1">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.hero.titleLine1}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    hero: { ...d.hero, titleLine1: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Title line 2 (subtitle style)">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                value={d.hero.titleLine2}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    hero: { ...d.hero, titleLine2: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Intro">
              <textarea
                className="min-h-[100px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                value={d.hero.intro}
                onChange={(e) =>
                  setDraft({ ...d, hero: { ...d.hero, intro: e.target.value } })
                }
              />
            </Field>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground">Pill row</p>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted/80"
              onClick={() =>
                setDraft({
                  ...d,
                  hero: {
                    ...d.hero,
                    pills: [
                      ...d.hero.pills,
                      {
                        label: "New",
                        tone: "cognition",
                        icon: "brain",
                      },
                    ],
                  },
                })
              }
            >
              <Plus className="h-3.5 w-3.5" />
              Add pill
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {d.hero.pills.map((pill, i) => (
              <div
                key={i}
                className="grid gap-2 rounded-xl border border-border/80 bg-muted/10 p-3 sm:grid-cols-4"
              >
                <input
                  className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                  value={pill.label}
                  onChange={(e) => {
                    const pills = [...d.hero.pills];
                    pills[i] = { ...pills[i]!, label: e.target.value };
                    setDraft({ ...d, hero: { ...d.hero, pills } });
                  }}
                />
                <select
                  className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                  value={pill.tone}
                  onChange={(e) => {
                    const pills = [...d.hero.pills];
                    pills[i] = {
                      ...pills[i]!,
                      tone: e.target.value as AboutTone,
                    };
                    setDraft({ ...d, hero: { ...d.hero, pills } });
                  }}
                >
                  {(["cognition", "consciousness", "care"] as const).map(
                    (t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ),
                  )}
                </select>
                <select
                  className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                  value={pill.icon}
                  onChange={(e) => {
                    const pills = [...d.hero.pills];
                    pills[i] = {
                      ...pills[i]!,
                      icon: e.target.value as HeroPillIcon,
                    };
                    setDraft({ ...d, hero: { ...d.hero, pills } });
                  }}
                >
                  {(["brain", "heart", "eye"] as const).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="text-xs text-destructive hover:underline"
                  onClick={() =>
                    setDraft({
                      ...d,
                      hero: {
                        ...d.hero,
                        pills: d.hero.pills.filter((_, j) => j !== i),
                      },
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </details>

        <details className="rounded-2xl border border-border bg-card p-5 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            Mission cards
          </summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Section eyebrow">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.missionSection.eyebrow}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    missionSection: {
                      ...d.missionSection,
                      eyebrow: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Section title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.missionSection.title}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    missionSection: {
                      ...d.missionSection,
                      title: e.target.value,
                    },
                  })
                }
              />
            </Field>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted/80"
              onClick={() =>
                setDraft({
                  ...d,
                  missionSection: {
                    ...d.missionSection,
                    cards: [
                      ...d.missionSection.cards,
                      {
                        icon: "circleHelp",
                        tone: "cognition",
                        accentSlot: (d.missionSection.cards.length % 3) as 0 | 1 | 2,
                        title: "New",
                        description: "",
                      },
                    ],
                  },
                })
              }
            >
              <Plus className="h-3.5 w-3.5" />
              Add card
            </button>
          </div>
          <div className="mt-2 space-y-4">
            {d.missionSection.cards.map((card, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/80 bg-muted/10 p-4"
              >
                <div className="mb-2 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                    onClick={() =>
                      setDraft({
                        ...d,
                        missionSection: {
                          ...d.missionSection,
                          cards: d.missionSection.cards.filter((_, j) => j !== i),
                        },
                      })
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="Title">
                    <input
                      className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                      value={card.title}
                      onChange={(e) => {
                        const cards = [...d.missionSection.cards];
                        cards[i] = { ...cards[i]!, title: e.target.value };
                        setDraft({
                          ...d,
                          missionSection: { ...d.missionSection, cards },
                        });
                      }}
                    />
                  </Field>
                  <div className="grid grid-cols-3 gap-2">
                    <Field label="Icon">
                      <select
                        className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                        value={card.icon}
                        onChange={(e) => {
                          const cards = [...d.missionSection.cards];
                          cards[i] = {
                            ...cards[i]!,
                            icon: e.target.value as MissionCardIcon,
                          };
                          setDraft({
                            ...d,
                            missionSection: { ...d.missionSection, cards },
                          });
                        }}
                      >
                        {(
                          ["circleHelp", "search", "target"] as const
                        ).map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Tone">
                      <select
                        className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                        value={card.tone}
                        onChange={(e) => {
                          const cards = [...d.missionSection.cards];
                          cards[i] = {
                            ...cards[i]!,
                            tone: e.target.value as AboutTone,
                          };
                          setDraft({
                            ...d,
                            missionSection: { ...d.missionSection, cards },
                          });
                        }}
                      >
                        {(["cognition", "consciousness", "care"] as const).map(
                          (t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ),
                        )}
                      </select>
                    </Field>
                    <Field label="Accent slot">
                      <select
                        className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                        value={card.accentSlot}
                        onChange={(e) => {
                          const cards = [...d.missionSection.cards];
                          cards[i] = {
                            ...cards[i]!,
                            accentSlot: Number(e.target.value) as 0 | 1 | 2,
                          };
                          setDraft({
                            ...d,
                            missionSection: { ...d.missionSection, cards },
                          });
                        }}
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Description">
                    <textarea
                      className="min-h-[80px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                      value={card.description}
                      onChange={(e) => {
                        const cards = [...d.missionSection.cards];
                        cards[i] = {
                          ...cards[i]!,
                          description: e.target.value,
                        };
                        setDraft({
                          ...d,
                          missionSection: { ...d.missionSection, cards },
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
            Who we are
          </summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Eyebrow">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.whoWeAre.eyebrow}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    whoWeAre: { ...d.whoWeAre, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.whoWeAre.title}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    whoWeAre: { ...d.whoWeAre, title: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Paragraphs (blank line between)">
              <textarea
                className="min-h-[160px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                value={d.whoWeAre.paragraphs.join("\n\n")}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    whoWeAre: {
                      ...d.whoWeAre,
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
              label="Image"
              value={d.whoWeAre.imageSrc}
              onChange={(v) =>
                setDraft({
                  ...d,
                  whoWeAre: { ...d.whoWeAre, imageSrc: v },
                })
              }
            />
            <Field label="Image alt">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.whoWeAre.imageAlt}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    whoWeAre: { ...d.whoWeAre, imageAlt: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="CTA label">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.whoWeAre.ctaLabel}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    whoWeAre: { ...d.whoWeAre, ctaLabel: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="CTA href">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.whoWeAre.ctaHref}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    whoWeAre: { ...d.whoWeAre, ctaHref: e.target.value },
                  })
                }
              />
            </Field>
          </div>
        </details>

        <details className="rounded-2xl border border-border bg-card p-5 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            Leadership / PI
          </summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Eyebrow">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.leadership.eyebrow}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    leadership: { ...d.leadership, eyebrow: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.leadership.title}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    leadership: { ...d.leadership, title: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Subtitle">
              <textarea
                className="min-h-[72px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                value={d.leadership.subtitle}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    leadership: { ...d.leadership, subtitle: e.target.value },
                  })
                }
              />
            </Field>
            <ImgRow
              label="PI photo"
              value={d.leadership.piImageSrc}
              onChange={(v) =>
                setDraft({
                  ...d,
                  leadership: { ...d.leadership, piImageSrc: v },
                })
              }
            />
            <Field label="PI photo alt">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.leadership.piImageAlt}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    leadership: { ...d.leadership, piImageAlt: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="PI name">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.leadership.piName}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    leadership: { ...d.leadership, piName: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="PI role line">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.leadership.piRole}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    leadership: { ...d.leadership, piRole: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="PI bio">
              <textarea
                className="min-h-[140px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                value={d.leadership.piBio}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    leadership: { ...d.leadership, piBio: e.target.value },
                  })
                }
              />
            </Field>
            <Field label="Education box title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.leadership.educationTitle}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    leadership: {
                      ...d.leadership,
                      educationTitle: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Research box title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.leadership.researchBoxTitle}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    leadership: {
                      ...d.leadership,
                      researchBoxTitle: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Education bullets (one per line)">
              <textarea
                className="min-h-[100px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                value={d.leadership.educationBullets.join("\n")}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    leadership: {
                      ...d.leadership,
                      educationBullets: e.target.value
                        .split("\n")
                        .map((l) => l.trim())
                        .filter(Boolean),
                    },
                  })
                }
              />
            </Field>
            <Field label="Research box body">
              <textarea
                className="min-h-[100px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                value={d.leadership.researchBoxBody}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    leadership: {
                      ...d.leadership,
                      researchBoxBody: e.target.value,
                    },
                  })
                }
              />
            </Field>
          </div>
          <p className="mt-4 text-xs font-semibold text-foreground">Links</p>
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted/80"
              onClick={() =>
                setDraft({
                  ...d,
                  leadership: {
                    ...d.leadership,
                    links: [
                      ...d.leadership.links,
                      {
                        label: "Link",
                        href: "/",
                        external: false,
                        variant: "outline",
                      },
                    ],
                  },
                })
              }
            >
              <Plus className="h-3.5 w-3.5" />
              Add link
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {d.leadership.links.map((link, i) => (
              <div
                key={i}
                className="grid gap-2 rounded-xl border border-border/80 bg-muted/10 p-3 sm:grid-cols-2 lg:grid-cols-4"
              >
                <input
                  className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                  value={link.label}
                  placeholder="Label"
                  onChange={(e) => {
                    const links = [...d.leadership.links];
                    links[i] = { ...links[i]!, label: e.target.value };
                    setDraft({ ...d, leadership: { ...d.leadership, links } });
                  }}
                />
                <input
                  className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                  value={link.href}
                  placeholder="URL"
                  onChange={(e) => {
                    const links = [...d.leadership.links];
                    links[i] = { ...links[i]!, href: e.target.value };
                    setDraft({ ...d, leadership: { ...d.leadership, links } });
                  }}
                />
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={link.external}
                    onChange={(e) => {
                      const links = [...d.leadership.links];
                      links[i] = { ...links[i]!, external: e.target.checked };
                      setDraft({ ...d, leadership: { ...d.leadership, links } });
                    }}
                  />
                  External
                </label>
                {!link.external ? (
                  <select
                    className="rounded-lg border border-input bg-background px-2 py-2 text-sm"
                    value={link.variant ?? "outline"}
                    onChange={(e) => {
                      const links = [...d.leadership.links];
                      links[i] = {
                        ...links[i]!,
                        variant: e.target.value as "primary" | "outline",
                      };
                      setDraft({
                        ...d,
                        leadership: { ...d.leadership, links },
                      });
                    }}
                  >
                    <option value="outline">Outline button</option>
                    <option value="primary">Primary gradient</option>
                  </select>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
                <button
                  type="button"
                  className="text-xs text-destructive hover:underline sm:col-span-2 lg:col-span-4"
                  onClick={() =>
                    setDraft({
                      ...d,
                      leadership: {
                        ...d.leadership,
                        links: d.leadership.links.filter((_, j) => j !== i),
                      },
                    })
                  }
                >
                  Remove link
                </button>
              </div>
            ))}
          </div>
        </details>

        <details className="rounded-2xl border border-border bg-card p-5 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            Research focus
          </summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Eyebrow">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.researchFocus.eyebrow}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    researchFocus: {
                      ...d.researchFocus,
                      eyebrow: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.researchFocus.title}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    researchFocus: {
                      ...d.researchFocus,
                      title: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Intro">
              <textarea
                className="min-h-[88px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                value={d.researchFocus.intro}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    researchFocus: {
                      ...d.researchFocus,
                      intro: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Key areas title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.researchFocus.keyAreasTitle}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    researchFocus: {
                      ...d.researchFocus,
                      keyAreasTitle: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Approach title">
              <input
                className="w-full rounded-lg border border-input bg-background px-2 py-2 text-sm"
                value={d.researchFocus.approachTitle}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    researchFocus: {
                      ...d.researchFocus,
                      approachTitle: e.target.value,
                    },
                  })
                }
              />
            </Field>
            <Field label="Key areas (one per line)">
              <textarea
                className="min-h-[160px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                value={d.researchFocus.keyAreas.join("\n")}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    researchFocus: {
                      ...d.researchFocus,
                      keyAreas: e.target.value
                        .split("\n")
                        .map((l) => l.trim())
                        .filter(Boolean),
                    },
                  })
                }
              />
            </Field>
            <Field label="Approach paragraphs (blank line between)">
              <textarea
                className="min-h-[160px] w-full rounded-lg border border-input bg-background px-2 py-2 text-sm sm:col-span-2"
                value={d.researchFocus.approachParagraphs.join("\n\n")}
                onChange={(e) =>
                  setDraft({
                    ...d,
                    researchFocus: {
                      ...d.researchFocus,
                      approachParagraphs: e.target.value
                        .split(/\n\n+/)
                        .map((p) => p.trim())
                        .filter(Boolean),
                    },
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
            {saving ? "Saving…" : "Save about page"}
          </button>
        </div>
      </form>
    </div>
  );
}
