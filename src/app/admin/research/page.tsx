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

export default function AdminResearchPage() {
  const router = useRouter();
  const [doc, setDoc] = useState<ResearchPageDocument | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [published, setPublished] = useState(true);
  const [selectedThemeIndex, setSelectedThemeIndex] = useState<number | null>(null);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    setLoading(true);
    try {
      const row = await fetchResearchPageForAdmin();
      setPublished(row?.published ?? true);
      const mergedDoc = mergeResearchPageDocument(row?.document ?? null);
      setDoc(mergedDoc);
      // Auto-select first theme and project if available
      if (mergedDoc.themes.length > 0) {
        setSelectedThemeIndex(0);
        setSelectedProjectIndex(0);
      }
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

  // Helper functions for theme and project management
  function selectTheme(index: number) {
    setSelectedThemeIndex(index);
    setSelectedProjectIndex(0); // Reset to first project when theme changes
  }

  function selectProject(index: number) {
    setSelectedProjectIndex(index);
  }

  function getCurrentTheme() {
    if (selectedThemeIndex === null || !doc) return null;
    return doc.themes[selectedThemeIndex];
  }

  function getCurrentProject() {
    const theme = getCurrentTheme();
    if (!theme || selectedProjectIndex === null) return null;
    return theme.projects[selectedProjectIndex];
  }

  function updateCurrentTheme(partial: Partial<ResearchTheme>) {
    if (selectedThemeIndex === null || !doc) return;
    const themes = [...doc.themes];
    themes[selectedThemeIndex] = { ...themes[selectedThemeIndex], ...partial };
    setDoc({ ...doc, themes });
  }

  function updateCurrentProject(partial: Partial<ResearchProject>) {
    const theme = getCurrentTheme();
    if (!theme || selectedProjectIndex === null || !doc) return;
    const themes = [...doc.themes];
    const projects = [...theme.projects];
    projects[selectedProjectIndex] = { ...projects[selectedProjectIndex], ...partial };
    themes[selectedThemeIndex] = { ...theme, projects };
    setDoc({ ...doc, themes });
  }

  function addTheme() {
    if (!doc) return;
    const newTheme = emptyTheme();
    setDoc({ ...doc, themes: [...doc.themes, newTheme] });
    setSelectedThemeIndex(doc.themes.length);
    setSelectedProjectIndex(0);
  }

  function removeCurrentTheme() {
    if (selectedThemeIndex === null || !doc || doc.themes.length <= 1) return;
    const themes = doc.themes.filter((_, i) => i !== selectedThemeIndex);
    setDoc({ ...doc, themes });
    setSelectedThemeIndex(Math.max(0, selectedThemeIndex - 1));
    setSelectedProjectIndex(0);
  }

  function moveTheme(dir: -1 | 1) {
    if (selectedThemeIndex === null || !doc) return;
    const newIndex = selectedThemeIndex + dir;
    if (newIndex < 0 || newIndex >= doc.themes.length) return;
    const themes = [...doc.themes];
    [themes[selectedThemeIndex], themes[newIndex]] = [themes[newIndex], themes[selectedThemeIndex]];
    setDoc({ ...doc, themes });
    setSelectedThemeIndex(newIndex);
  }

  function addProjectToCurrentTheme() {
    const theme = getCurrentTheme();
    if (!theme || selectedThemeIndex === null || !doc) return;
    const themes = [...doc.themes];
    themes[selectedThemeIndex] = { ...theme, projects: [...theme.projects, emptyProject()] };
    setDoc({ ...doc, themes });
    setSelectedProjectIndex(theme.projects.length); // Select new project
  }

  function removeCurrentProject() {
    const theme = getCurrentTheme();
    if (!theme || selectedProjectIndex === null || !doc || theme.projects.length <= 1) return;
    const themes = [...doc.themes];
    const projects = theme.projects.filter((_, i) => i !== selectedProjectIndex);
    themes[selectedThemeIndex] = { ...theme, projects };
    setDoc({ ...doc, themes });
    setSelectedProjectIndex(Math.max(0, selectedProjectIndex - 1)); // Select previous project
  }

  function addPublicationToCurrentProject() {
    const project = getCurrentProject();
    if (!project || !getCurrentTheme() || selectedThemeIndex === null || selectedProjectIndex === null || !doc) return;
    const themes = [...doc.themes];
    const projects = [...getCurrentTheme()!.projects];
    projects[selectedProjectIndex] = {
      ...project,
      publications: [...(project.publications ?? []), { title: "", link: "" }],
    };
    themes[selectedThemeIndex] = { ...getCurrentTheme()!, projects };
    setDoc({ ...doc, themes });
  }

  function updateCurrentPublication(idx: number, partial: Partial<ResearchProjectPublication>) {
    const project = getCurrentProject();
    if (!project || !project.publications || !getCurrentTheme() || selectedThemeIndex === null || selectedProjectIndex === null || !doc) return;
    const themes = [...doc.themes];
    const projects = [...getCurrentTheme()!.projects];
    const publications = [...project.publications];
    publications[idx] = { ...publications[idx], ...partial };
    projects[selectedProjectIndex] = { ...project, publications };
    themes[selectedThemeIndex] = { ...getCurrentTheme()!, projects };
    setDoc({ ...doc, themes });
  }

  function removeCurrentPublication(idx: number) {
    const project = getCurrentProject();
    if (!project || !project.publications || !getCurrentTheme() || selectedThemeIndex === null || selectedProjectIndex === null || !doc) return;
    const themes = [...doc.themes];
    const projects = [...getCurrentTheme()!.projects];
    const publications = project.publications.filter((_, i) => i !== idx);
    projects[selectedProjectIndex] = {
      ...project,
      publications: publications.length ? publications : undefined,
    };
    themes[selectedThemeIndex] = { ...getCurrentTheme()!, projects };
    setDoc({ ...doc, themes });
  }

  function setTeamFromText(text: string) {
    const team = text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    updateCurrentProject({ team: team.length ? team : undefined });
  }

  // Other document sections
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
        <span className="text-sm">Loading research page...</span>
      </div>
    );
  }

  const currentTheme = getCurrentTheme();
  const currentProject = getCurrentProject();

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

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-muted-foreground">
          Theme
          <select
            className="ml-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={selectedThemeIndex ?? ""}
            onChange={(e) => {
              const index = Number(e.target.value);
              if (!isNaN(index)) selectTheme(index);
            }}
          >
            {doc.themes.map((theme, i) => (
              <option key={i} value={i}>
                {theme.title || `Theme ${i + 1}`}
              </option>
            ))}
          </select>
        </label>
        
        {currentTheme && (
          <label className="text-sm font-medium text-muted-foreground">
            Project
            <select
              className="ml-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              value={selectedProjectIndex ?? ""}
              onChange={(e) => {
                const index = Number(e.target.value);
                if (!isNaN(index)) selectProject(index);
              }}
            >
              {currentTheme.projects.map((project, i) => (
                <option key={i} value={i}>
                  {project.title || `Project ${i + 1}`}
                </option>
              ))}
            </select>
          </label>
        )}

        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </button>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published
        </label>
      </div>

      {/* Theme Management */}
      {currentTheme && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Theme Details</h2>
              <div className="flex gap-1">
                <button
                  type="button"
                  title="Move up"
                  className="rounded-md border border-border p-1.5 hover:bg-muted/60"
                  onClick={() => moveTheme(-1)}
                  disabled={selectedThemeIndex === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Move down"
                  className="rounded-md border border-border p-1.5 hover:bg-muted/60"
                  onClick={() => moveTheme(1)}
                  disabled={selectedThemeIndex >= doc.themes.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-md border border-destructive/30 p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-40"
                  onClick={removeCurrentTheme}
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
                value={currentTheme.title}
                onChange={(e) => updateCurrentTheme({ title: e.target.value })}
              />
            </label>
            <label className={label}>
              Theme description
              <textarea
                className={input}
                rows={3}
                value={currentTheme.description}
                onChange={(e) => updateCurrentTheme({ description: e.target.value })}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={label}>
                Icon
                <select
                  className={input}
                  value={currentTheme.icon}
                  onChange={(e) =>
                    updateCurrentTheme({ icon: e.target.value as ResearchThemeIcon })
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
                  value={currentTheme.gradient}
                  onChange={(e) => updateCurrentTheme({ gradient: e.target.value })}
                />
              </label>
            </div>
          </div>

          {/* Project Management */}
          {currentProject && (
            <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Project Details</h2>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={addProjectToCurrentTheme}
                    className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    Add project
                  </button>
                  <button
                    type="button"
                    className="text-xs text-destructive hover:underline disabled:opacity-40"
                    onClick={removeCurrentProject}
                    disabled={currentTheme.projects.length <= 1}
                  >
                    Remove project
                  </button>
                </div>
              </div>
              
              <label className={label}>
                Title
                <input
                  className={input}
                  value={currentProject.title}
                  onChange={(e) => updateCurrentProject({ title: e.target.value })}
                />
              </label>
              <label className={label}>
                Description
                <textarea
                  className={input}
                  rows={3}
                  value={currentProject.description}
                  onChange={(e) => updateCurrentProject({ description: e.target.value })}
                />
              </label>
              <label className={label}>
                Status
                <input
                  className={input}
                  value={currentProject.status}
                  onChange={(e) => updateCurrentProject({ status: e.target.value })}
                />
              </label>
              <label className={label}>
                Funder (optional)
                <input
                  className={input}
                  value={currentProject.funder ?? ""}
                  onChange={(e) =>
                    updateCurrentProject({
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
                  value={currentProject.team?.join("\n") ?? ""}
                  onChange={(e) => setTeamFromText(e.target.value)}
                />
              </label>
              
              {/* Publications */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Publications
                  </span>
                  <button
                    type="button"
                    className="text-xs text-brand hover:underline"
                    onClick={addPublicationToCurrentProject}
                  >
                    + Add publication
                  </button>
                </div>
                {(currentProject.publications ?? []).map((pub, idx) => (
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
                          updateCurrentPublication(idx, {
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
                          updateCurrentPublication(idx, {
                            link: e.target.value,
                          })
                        }
                      />
                    </label>
                    <button
                      type="button"
                      className="mb-1 shrink-0 text-destructive hover:underline text-xs"
                      onClick={() => removeCurrentPublication(idx)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Theme Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={addTheme}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted/60"
        >
          <Plus className="h-4 w-4" />
          Add New Theme
        </button>
      </div>

      {/* Other Sections (Hero, Collaborations, CTA) */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Other Page Sections</h2>
        
        {/* Hero Section */}
        <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground">Hero Section</h3>
          <div className="grid gap-4 sm:grid-cols-2">
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
            <label className={`${label} sm:col-span-2`}>
              Subtitle
              <input
                className={input}
                value={doc.hero.subtitle}
                onChange={(e) => setHero({ subtitle: e.target.value })}
              />
            </label>
            <label className={`${label} sm:col-span-2`}>
              Intro
              <textarea
                className={input}
                rows={3}
                value={doc.hero.intro}
                onChange={(e) => setHero({ intro: e.target.value })}
              />
            </label>
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
        </div>

        {/* Themes Section Header */}
        <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground">Themes Section Header</h3>
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
        </div>

        {/* Collaborations */}
        <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground">Collaborations Section</h3>
          <div className="grid gap-4 sm:grid-cols-2">
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
            <label className={`${label} sm:col-span-2`}>
              Intro
              <textarea
                className={input}
                rows={2}
                value={doc.collaborationsSection.intro}
                onChange={(e) => setCollabSection({ intro: e.target.value })}
              />
            </label>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">Collaboration Partners</span>
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
              <div key={i} className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-destructive hover:underline disabled:opacity-40"
                    onClick={() => removeCollab(i)}
                    disabled={doc.collaborations.length <= 1}
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className={label}>
                    Title
                    <input
                      className={input}
                      value={c.title}
                      onChange={(e) => updateCollab(i, { title: e.target.value })}
                    />
                  </label>
                  <label className={label}>
                    Link
                    <input
                      className={input}
                      value={c.link}
                      onChange={(e) => updateCollab(i, { link: e.target.value })}
                    />
                  </label>
                  <label className={`${label} sm:col-span-2`}>
                    Description
                    <textarea
                      className={input}
                      rows={2}
                      value={c.description}
                      onChange={(e) => updateCollab(i, { description: e.target.value })}
                    />
                  </label>
                  <label className={`${label} sm:col-span-2`}>
                    Role
                    <textarea
                      className={input}
                      rows={2}
                      value={c.role}
                      onChange={(e) => updateCollab(i, { role: e.target.value })}
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
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground">Call to Action</h3>
          <div className="grid gap-4 sm:grid-cols-2">
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
            <label className={`${label} sm:col-span-2`}>
              Intro
              <textarea
                className={input}
                rows={3}
                value={doc.cta.intro}
                onChange={(e) => setCta({ intro: e.target.value })}
              />
            </label>
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
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
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
