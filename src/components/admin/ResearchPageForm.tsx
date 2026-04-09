"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { defaultResearchPageDocument } from "@/data/research-page-default";
import { mergeResearchPageDocument } from "@/lib/research-page/document";
import {
  fetchResearchPageForAdmin,
  upsertResearchPageAdmin,
} from "@/lib/research-page/supabase-research-page";
import type {
  ResearchCollaboration,
  ResearchPageDocument,
  ResearchProject,
  ResearchProjectPublication,
  ResearchTheme,
  ResearchThemeIcon,
} from "@/lib/research-page/types";
import { RESEARCH_THEME_ICONS } from "@/lib/research-page/types";

function emptyProject(): ResearchProject {
  return { title: "", description: "", status: "" };
}

function emptyTheme(): ResearchTheme {
  return {
    title: "",
    description: "",
    icon: "Brain",
    gradient: "linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)",
    projects: [emptyProject()],
  };
}

function emptyCollaboration(): ResearchCollaboration {
  return {
    title: "",
    description: "",
    role: "",
    link: "#",
  };
}

export default function ResearchPageForm() {
  const router = useRouter();
  const [doc, setDoc] = useState<ResearchPageDocument | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [published, setPublished] = useState(true);

  const load = useCallback(async () => {
    setErr(null);
    setLoading(true);
    try {
      const row = await fetchResearchPageForAdmin();
      setPublished(row?.published ?? true);
      setDoc(mergeResearchPageDocument(row?.document ?? null));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
      setDoc(defaultResearchPageDocument());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSave() {
    if (!doc) return;
    setErr(null);
    setSaving(true);
    try {
      await upsertResearchPageAdmin({
        document: doc,
        published,
      });
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function setHero(partial: Partial<ResearchPageDocument["hero"]>) {
    setDoc((d) => (d ? { ...d, hero: { ...d.hero, ...partial } } : d));
  }

  function setPillar(i: 0 | 1 | 2, value: string) {
    setDoc((d) => {
      if (!d) return d;
      const pillars = [...d.hero.pillars] as [string, string, string];
      pillars[i] = value;
      return { ...d, hero: { ...d.hero, pillars } };
    });
  }

  function setThemesSection(partial: Partial<ResearchPageDocument["themesSection"]>) {
    setDoc((d) =>
      d ? { ...d, themesSection: { ...d.themesSection, ...partial } } : d,
    );
  }

  function setCollabSection(
    partial: Partial<ResearchPageDocument["collaborationsSection"]>,
  ) {
    setDoc((d) =>
      d
        ? {
            ...d,
            collaborationsSection: { ...d.collaborationsSection, ...partial },
          }
        : d,
    );
  }

  function setCta(partial: Partial<ResearchPageDocument["cta"]>) {
    setDoc((d) => (d ? { ...d, cta: { ...d.cta, ...partial } } : d));
  }

  function setCtaPrimary(partial: Partial<ResearchPageDocument["cta"]["primary"]>) {
    setDoc((d) =>
      d ? { ...d, cta: { ...d.cta, primary: { ...d.cta.primary, ...partial } } } : d,
    );
  }

  function setCtaSecondary(
    partial: Partial<ResearchPageDocument["cta"]["secondary"]>,
  ) {
    setDoc((d) =>
      d
        ? { ...d, cta: { ...d.cta, secondary: { ...d.cta.secondary, ...partial } } }
        : d,
    );
  }

  function updateTheme(ti: number, partial: Partial<ResearchTheme>) {
    setDoc((d) => {
      if (!d) return d;
      const themes = [...d.themes];
      themes[ti] = { ...themes[ti], ...partial };
      return { ...d, themes };
    });
  }

  function updateProject(ti: number, pi: number, partial: Partial<ResearchProject>) {
    setDoc((d) => {
      if (!d) return d;
      const themes = d.themes.map((t, i) => {
        if (i !== ti) return t;
        const projects = t.projects.map((p, j) =>
          j === pi ? { ...p, ...partial } : p,
        );
        return { ...t, projects };
      });
      return { ...d, themes };
    });
  }

  function addTheme() {
    setDoc((d) => (d ? { ...d, themes: [...d.themes, emptyTheme()] } : d));
  }

  function removeTheme(ti: number) {
    setDoc((d) =>
      d && d.themes.length > 1
        ? { ...d, themes: d.themes.filter((_, i) => i !== ti) }
        : d,
    );
  }

  function moveTheme(ti: number, dir: -1 | 1) {
    setDoc((d) => {
      if (!d) return d;
      const j = ti + dir;
      if (j < 0 || j >= d.themes.length) return d;
      const themes = [...d.themes];
      [themes[ti], themes[j]] = [themes[j], themes[ti]];
      return { ...d, themes };
    });
  }

  function addProject(ti: number) {
    setDoc((d) => {
      if (!d) return d;
      const themes = d.themes.map((t, i) =>
        i === ti ? { ...t, projects: [...t.projects, emptyProject()] } : t,
      );
      return { ...d, themes };
    });
  }

  function removeProject(ti: number, pi: number) {
    setDoc((d) => {
      if (!d) return d;
      const themes = d.themes.map((t, i) => {
        if (i !== ti) return t;
        if (t.projects.length <= 1) return t;
        return {
          ...t,
          projects: t.projects.filter((_, j) => j !== pi),
        };
      });
      return { ...d, themes };
    });
  }

  function addPublication(ti: number, pi: number) {
    setDoc((d) => {
      if (!d) return d;
      const themes = d.themes.map((t, i) => {
        if (i !== ti) return t;
        const projects = t.projects.map((p, j) => {
          if (j !== pi) return p;
          return {
            ...p,
            publications: [...(p.publications ?? []), { title: "", link: "" }],
          };
        });
        return { ...t, projects };
      });
      return { ...d, themes };
    });
  }

  function updatePublication(
    ti: number,
    pi: number,
    idx: number,
    partial: Partial<ResearchProjectPublication>,
  ) {
    setDoc((d) => {
      if (!d) return d;
      const themes = d.themes.map((t, i) => {
        if (i !== ti) return t;
        const projects = t.projects.map((p, j) => {
          if (j !== pi || !p.publications) return p;
          const publications = p.publications.map((pub, k) =>
            k === idx ? { ...pub, ...partial } : pub,
          );
          return { ...p, publications };
        });
        return { ...t, projects };
      });
      return { ...d, themes };
    });
  }

  function removePublication(ti: number, pi: number, idx: number) {
    setDoc((d) => {
      if (!d) return d;
      const themes = d.themes.map((t, i) => {
        if (i !== ti) return t;
        const projects = t.projects.map((p, j) => {
          if (j !== pi || !p.publications) return p;
          const publications = p.publications.filter((_, k) => k !== idx);
          return {
            ...p,
            publications: publications.length ? publications : undefined,
          };
        });
        return { ...t, projects };
      });
      return { ...d, themes };
    });
  }

  function setTeamFromText(ti: number, pi: number, text: string) {
    const team = text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    updateProject(ti, pi, { team: team.length ? team : undefined });
  }

  function updateCollab(i: number, partial: Partial<ResearchCollaboration>) {
    setDoc((d) => {
      if (!d) return d;
      const collaborations = d.collaborations.map((c, j) =>
        j === i ? { ...c, ...partial } : c,
      );
      return { ...d, collaborations };
    });
  }

  function addCollaboration() {
    setDoc((d) =>
      d ? { ...d, collaborations: [...d.collaborations, emptyCollaboration()] } : d,
    );
  }

  function removeCollab(i: number) {
    setDoc((d) =>
      d && d.collaborations.length > 1
        ? { ...d, collaborations: d.collaborations.filter((_, j) => j !== i) }
        : d,
    );
  }

  const input =
    "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm";
  const label = "block text-xs font-medium text-muted-foreground";

  if (loading || !doc) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Research page
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Public:{" "}
          <Link href="/research/" className="text-brand hover:underline">
            /research/
          </Link>
          . Apply{" "}
          <code className="rounded bg-muted px-1 text-xs">supabase/research_page.sql</code>
          , then optional{" "}
          <code className="rounded bg-muted px-1 text-xs">npm run seed-research-page</code>
          .
        </p>
      </header>

      {err ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {err}
        </p>
      ) : null}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Published (visitors only see content when published and row exists in Supabase)
      </label>

      <section className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground">Hero</h2>
        <label className={label}>
          Badge
          <input
            className={input}
            value={doc.hero.badge}
            onChange={(e) => setHero({ badge: e.target.value })}
          />
        </label>
        <label className={label}>
          Title
          <input
            className={input}
            value={doc.hero.title}
            onChange={(e) => setHero({ title: e.target.value })}
          />
        </label>
        <label className={label}>
          Subtitle
          <input
            className={input}
            value={doc.hero.subtitle}
            onChange={(e) => setHero({ subtitle: e.target.value })}
          />
        </label>
        <label className={label}>
          Intro
          <textarea
            className={input}
            rows={3}
            value={doc.hero.intro}
            onChange={(e) => setHero({ intro: e.target.value })}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          {([0, 1, 2] as const).map((i) => (
            <label key={i} className={label}>
              Pillar {i + 1}
              <input
                className={input}
                value={doc.hero.pillars[i]}
                onChange={(e) => setPillar(i, e.target.value)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground">Themes section</h2>
        <label className={label}>
          Heading
          <input
            className={input}
            value={doc.themesSection.title}
            onChange={(e) => setThemesSection({ title: e.target.value })}
          />
        </label>
        <label className={label}>
          Intro
          <textarea
            className={input}
            rows={2}
            value={doc.themesSection.intro}
            onChange={(e) => setThemesSection({ intro: e.target.value })}
          />
        </label>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-foreground">Themes &amp; projects</h2>
          <button
            type="button"
            onClick={addTheme}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted/60"
          >
            <Plus className="h-3.5 w-3.5" />
            Add theme
          </button>
        </div>

        {doc.themes.map((theme, ti) => (
          <div
            key={ti}
            className="space-y-4 rounded-2xl border border-border/80 bg-card p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                Theme {ti + 1}
              </span>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  title="Move up"
                  className="rounded-md border border-border p-1.5 hover:bg-muted/60"
                  onClick={() => moveTheme(ti, -1)}
                  disabled={ti === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Move down"
                  className="rounded-md border border-border p-1.5 hover:bg-muted/60"
                  onClick={() => moveTheme(ti, 1)}
                  disabled={ti >= doc.themes.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-md border border-destructive/30 p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-40"
                  onClick={() => removeTheme(ti)}
                  disabled={doc.themes.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <label className={label}>
              Theme title
              <input
                className={input}
                value={theme.title}
                onChange={(e) => updateTheme(ti, { title: e.target.value })}
              />
            </label>
            <label className={label}>
              Theme description
              <textarea
                className={input}
                rows={3}
                value={theme.description}
                onChange={(e) => updateTheme(ti, { description: e.target.value })}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={label}>
                Icon
                <select
                  className={input}
                  value={theme.icon}
                  onChange={(e) =>
                    updateTheme(ti, { icon: e.target.value as ResearchThemeIcon })
                  }
                >
                  {RESEARCH_THEME_ICONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
              </label>
              <label className={label}>
                Gradient (CSS)
                <input
                  className={input}
                  value={theme.gradient}
                  onChange={(e) => updateTheme(ti, { gradient: e.target.value })}
                />
              </label>
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">Projects</span>
                <button
                  type="button"
                  onClick={() => addProject(ti)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  Add project
                </button>
              </div>
              {theme.projects.map((project, pi) => (
                <div
                  key={pi}
                  className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3"
                >
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-destructive hover:underline disabled:opacity-40"
                      onClick={() => removeProject(ti, pi)}
                      disabled={theme.projects.length <= 1}
                    >
                      Remove project
                    </button>
                  </div>
                  <label className={label}>
                    Title
                    <input
                      className={input}
                      value={project.title}
                      onChange={(e) =>
                        updateProject(ti, pi, { title: e.target.value })
                      }
                    />
                  </label>
                  <label className={label}>
                    Description
                    <textarea
                      className={input}
                      rows={3}
                      value={project.description}
                      onChange={(e) =>
                        updateProject(ti, pi, { description: e.target.value })
                      }
                    />
                  </label>
                  <label className={label}>
                    Status
                    <input
                      className={input}
                      value={project.status}
                      onChange={(e) =>
                        updateProject(ti, pi, { status: e.target.value })
                      }
                    />
                  </label>
                  <label className={label}>
                    Funder (optional)
                    <input
                      className={input}
                      value={project.funder ?? ""}
                      onChange={(e) =>
                        updateProject(ti, pi, {
                          funder: e.target.value.trim() || undefined,
                        })
                      }
                    />
                  </label>
                  <label className={label}>
                    Team (one name per line)
                    <textarea
                      className={input}
                      rows={3}
                      value={project.team?.join("\n") ?? ""}
                      onChange={(e) => setTeamFromText(ti, pi, e.target.value)}
                    />
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        Publications
                      </span>
                      <button
                        type="button"
                        className="text-xs text-brand hover:underline"
                        onClick={() => addPublication(ti, pi)}
                      >
                        + Add publication
                      </button>
                    </div>
                    {(project.publications ?? []).map((pub, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-2 rounded-lg border border-border bg-background p-2 sm:flex-row sm:items-end"
                      >
                        <label className={`${label} flex-1`}>
                          Title
                          <input
                            className={input}
                            value={pub.title}
                            onChange={(e) =>
                              updatePublication(ti, pi, idx, {
                                title: e.target.value,
                              })
                            }
                          />
                        </label>
                        <label className={`${label} flex-1`}>
                          Link
                          <input
                            className={input}
                            value={pub.link}
                            onChange={(e) =>
                              updatePublication(ti, pi, idx, {
                                link: e.target.value,
                              })
                            }
                          />
                        </label>
                        <button
                          type="button"
                          className="mb-1 shrink-0 text-destructive hover:underline text-xs"
                          onClick={() => removePublication(ti, pi, idx)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground">
          Collaborations section
        </h2>
        <label className={label}>
          Badge
          <input
            className={input}
            value={doc.collaborationsSection.badge}
            onChange={(e) => setCollabSection({ badge: e.target.value })}
          />
        </label>
        <label className={label}>
          Heading
          <input
            className={input}
            value={doc.collaborationsSection.title}
            onChange={(e) => setCollabSection({ title: e.target.value })}
          />
        </label>
        <label className={label}>
          Intro
          <textarea
            className={input}
            rows={2}
            value={doc.collaborationsSection.intro}
            onChange={(e) => setCollabSection({ intro: e.target.value })}
          />
        </label>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Collaborations</h2>
          <button
            type="button"
            onClick={addCollaboration}
            className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted/60"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
        {doc.collaborations.map((c, i) => (
          <div
            key={i}
            className="space-y-3 rounded-2xl border border-border/80 bg-card p-5"
          >
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs text-destructive hover:underline disabled:opacity-40"
                onClick={() => removeCollab(i)}
                disabled={doc.collaborations.length <= 1}
              >
                Remove card
              </button>
            </div>
            <label className={label}>
              Title
              <input
                className={input}
                value={c.title}
                onChange={(e) => updateCollab(i, { title: e.target.value })}
              />
            </label>
            <label className={label}>
              Description
              <textarea
                className={input}
                rows={3}
                value={c.description}
                onChange={(e) => updateCollab(i, { description: e.target.value })}
              />
            </label>
            <label className={label}>
              Role
              <textarea
                className={input}
                rows={2}
                value={c.role}
                onChange={(e) => updateCollab(i, { role: e.target.value })}
              />
            </label>
            <label className={label}>
              Link (use # if none)
              <input
                className={input}
                value={c.link}
                onChange={(e) => updateCollab(i, { link: e.target.value })}
              />
            </label>
            <label className={label}>
              Funder (optional)
              <input
                className={input}
                value={c.funder ?? ""}
                onChange={(e) =>
                  updateCollab(i, {
                    funder: e.target.value.trim() || undefined,
                  })
                }
              />
            </label>
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground">Call to action</h2>
        <label className={label}>
          Badge
          <input
            className={input}
            value={doc.cta.badge}
            onChange={(e) => setCta({ badge: e.target.value })}
          />
        </label>
        <label className={label}>
          Title
          <input
            className={input}
            value={doc.cta.title}
            onChange={(e) => setCta({ title: e.target.value })}
          />
        </label>
        <label className={label}>
          Intro
          <textarea
            className={input}
            rows={3}
            value={doc.cta.intro}
            onChange={(e) => setCta({ intro: e.target.value })}
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={label}>
            Primary button label
            <input
              className={input}
              value={doc.cta.primary.label}
              onChange={(e) => setCtaPrimary({ label: e.target.value })}
            />
          </label>
          <label className={label}>
            Primary href
            <input
              className={input}
              value={doc.cta.primary.href}
              onChange={(e) => setCtaPrimary({ href: e.target.value })}
            />
          </label>
          <label className={label}>
            Secondary button label
            <input
              className={input}
              value={doc.cta.secondary.label}
              onChange={(e) => setCtaSecondary({ label: e.target.value })}
            />
          </label>
          <label className={label}>
            Secondary href
            <input
              className={input}
              value={doc.cta.secondary.href}
              onChange={(e) => setCtaSecondary({ href: e.target.value })}
            />
          </label>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </button>
        <Link
          href="/admin/"
          className="inline-flex items-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted/60"
        >
          Back
        </Link>
      </div>
    </div>
  );
}
