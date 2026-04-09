"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Project } from "@/data/projectsData";
import { fallbackProjects } from "@/data/projectsData";
import {
  fetchAllResearchProjectsForAdmin,
  type AdminResearchProjectRow,
} from "@/lib/projects/supabase-projects";
import {
  projectToResearchInsert,
  projectToResearchRowUpdate,
} from "@/lib/projects/db-map";
import { uploadProjectGalleryImage } from "@/lib/projects/project-image-storage";

function slugifyTitle(title: string): string {
  const s = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s || `project-${Date.now()}`;
}

function formToProject(
  slug: string,
  fields: {
    title: string;
    description: string;
    longDescription: string;
    category: string;
    status: Project["status"];
    startDate: string;
    endDate: string;
    link: string;
    funding: string;
    additionalInfo: string;
    tagsCsv: string;
    objectivesText: string;
    teamJson: string;
    publicationsJson: string;
    galleryText: string;
  },
): Project {
  const tags = fields.tagsCsv
    .split(/[,，]/)
    .map((t) => t.trim())
    .filter(Boolean);
  const objectives = fields.objectivesText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  let teamMembers: Project["teamMembers"];
  try {
    const parsed = JSON.parse(fields.teamJson.trim() || "[]") as unknown;
    teamMembers = Array.isArray(parsed)
      ? (parsed as Project["teamMembers"])
      : undefined;
  } catch {
    teamMembers = undefined;
  }
  let publications: Project["publications"];
  try {
    const parsed = JSON.parse(
      fields.publicationsJson.trim() || "[]",
    ) as unknown;
    publications = Array.isArray(parsed)
      ? (parsed as NonNullable<Project["publications"]>)
      : undefined;
  } catch {
    publications = undefined;
  }
  const images = fields.galleryText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const imgs =
    images.length > 0 ? images : ["/images/placeholder.jpg"];

  return {
    id: slug,
    title: fields.title.trim(),
    description: fields.description.trim(),
    longDescription: fields.longDescription.trim() || undefined,
    category: fields.category.trim(),
    status: fields.status,
    startDate: fields.startDate.slice(0, 10) || "2020-01-01",
    endDate: fields.endDate.trim() ? fields.endDate.slice(0, 10) : undefined,
    images: imgs,
    tags,
    link: fields.link.trim() || undefined,
    funding: fields.funding.trim() || undefined,
    objectives: objectives.length ? objectives : undefined,
    teamMembers,
    publications: publications?.length ? publications : undefined,
    additionalInfo: fields.additionalInfo.trim() || undefined,
  };
}

function projectToForm(p: Project) {
  return {
    title: p.title,
    description: p.description,
    longDescription: p.longDescription ?? "",
    category: p.category,
    status: p.status,
    startDate: p.startDate.slice(0, 10),
    endDate: p.endDate?.slice(0, 10) ?? "",
    link: p.link ?? "",
    funding: p.funding ?? "",
    additionalInfo: p.additionalInfo ?? "",
    tagsCsv: p.tags.join(", "),
    objectivesText: (p.objectives ?? []).join("\n"),
    teamJson: JSON.stringify(p.teamMembers ?? [], null, 2),
    publicationsJson: JSON.stringify(p.publications ?? [], null, 2),
    galleryText: p.images.join("\n"),
  };
}

export default function AdminProjectsPage() {
  const [items, setItems] = useState<AdminResearchProjectRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [originalSlug, setOriginalSlug] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [published, setPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [form, setForm] = useState(() => projectToForm(fallbackProjects[0]!));

  const load = useCallback(async () => {
    setErr(null);
    try {
      const list = await fetchAllResearchProjectsForAdmin();
      setItems(list);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
      setItems([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function pickRow(row: AdminResearchProjectRow) {
    const p = row.project;
    setOriginalSlug(p.id);
    setSlug(p.id);
    setForm(projectToForm(p));
    setPublished(row.published);
    setSortOrder(row.sort_order);
  }

  function startNew() {
    setOriginalSlug(null);
    setSlug(slugifyTitle("New project"));
    setForm({
      title: "New project",
      description: "",
      longDescription: "",
      category: "Clinical Research",
      status: "active",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "",
      link: "",
      funding: "",
      additionalInfo: "",
      tagsCsv: "",
      objectivesText: "",
      teamJson: "[]",
      publicationsJson: "[]",
      galleryText: "/images/placeholder.jpg",
    });
    setPublished(true);
    setSortOrder(items?.length ?? 0);
  }

  async function save() {
    setSaving(true);
    setErr(null);
    try {
      const p = formToProject(slug, form);
      const supabase = getSupabaseBrowserClient();
      if (originalSlug) {
        const { error } = await supabase
          .from("research_projects")
          .update(
            projectToResearchRowUpdate(p, {
              published,
              sort_order: sortOrder,
            }),
          )
          .eq("slug", originalSlug);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from("research_projects")
          .insert(
            projectToResearchInsert(p, sortOrder, published),
          );
        if (error) throw new Error(error.message);
      }
      await load();
      setOriginalSlug(p.id);
      setSlug(p.id);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!originalSlug) return;
    if (!confirm(`Delete project “${originalSlug}”?`)) return;
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("research_projects")
        .delete()
        .eq("slug", originalSlug);
      if (error) throw new Error(error.message);
      setOriginalSlug(null);
      setSlug("");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function onGalleryUpload(files: FileList | null) {
    if (!files?.length || !slug.trim()) return;
    setErr(null);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const { publicUrl } = await uploadProjectGalleryImage(file, slug);
        urls.push(publicUrl);
      }
      setForm((f) => ({
        ...f,
        galleryText: [...f.galleryText.split("\n").filter(Boolean), ...urls].join(
          "\n",
        ),
      }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    }
  }

  const list = items ?? [];

  if (items === null) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
        <span className="text-sm">Loading projects…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Research projects
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit fields below or upload gallery images (stored in{" "}
          <code className="rounded bg-muted px-1 text-xs">project-images</code>).
          Run <code className="rounded bg-muted px-1 text-xs">npm run seed-projects</code>{" "}
          once to copy bundled projects into the database.
        </p>
      </header>

      {err ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {err}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-muted-foreground">
          Select
          <select
            className="ml-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            value={originalSlug ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) return;
              const row = list.find((x) => x.project.id === v);
              if (row) pickRow(row);
            }}
          >
            <option value="">— New or pick below —</option>
            {list.map((row) => (
              <option key={row.project.id} value={row.project.id}>
                {row.project.title} ({row.project.id})
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => startNew()}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted/60"
        >
          <Plus className="h-4 w-4" />
          New project
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
        {originalSlug ? (
          <button
            type="button"
            onClick={() => void remove()}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/40 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        ) : null}
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No rows in{" "}
          <code className="rounded bg-muted px-1">research_projects</code>. Seed
          the table or create a new project.
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Core</h2>
          <label className="block text-xs font-medium text-muted-foreground">
            URL slug (id)
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Title
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Short description
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={3}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Long description
            <textarea
              value={form.longDescription}
              onChange={(e) =>
                setForm((f) => ({ ...f, longDescription: e.target.value }))
              }
              rows={6}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-muted-foreground">
              Category
              <input
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as Project["status"],
                  }))
                }
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="active">active</option>
                <option value="completed">completed</option>
                <option value="upcoming">upcoming</option>
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-muted-foreground">
              Start date
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startDate: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              End date
              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endDate: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
          </div>
          <label className="block text-xs font-medium text-muted-foreground">
            External link
            <input
              value={form.link}
              onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Funding
            <input
              value={form.funding}
              onChange={(e) =>
                setForm((f) => ({ ...f, funding: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Additional info
            <textarea
              value={form.additionalInfo}
              onChange={(e) =>
                setForm((f) => ({ ...f, additionalInfo: e.target.value }))
              }
              rows={3}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Sort order
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
                className="w-24 rounded-lg border border-border bg-background px-2 py-1 text-sm"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Lists &amp; media</h2>
          <label className="block text-xs font-medium text-muted-foreground">
            Tags (comma-separated)
            <input
              value={form.tagsCsv}
              onChange={(e) =>
                setForm((f) => ({ ...f, tagsCsv: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Objectives (one per line)
            <textarea
              value={form.objectivesText}
              onChange={(e) =>
                setForm((f) => ({ ...f, objectivesText: e.target.value }))
              }
              rows={5}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Team members (JSON array of {"{ name, role, image? }"})
            <textarea
              value={form.teamJson}
              onChange={(e) =>
                setForm((f) => ({ ...f, teamJson: e.target.value }))
              }
              rows={6}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Publications (JSON array of {"{ title, link, date }"})
            <textarea
              value={form.publicationsJson}
              onChange={(e) =>
                setForm((f) => ({ ...f, publicationsJson: e.target.value }))
              }
              rows={5}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Gallery image URLs (one per line; first = hero)
            <textarea
              value={form.galleryText}
              onChange={(e) =>
                setForm((f) => ({ ...f, galleryText: e.target.value }))
              }
              rows={5}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs"
            />
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm hover:bg-muted/60">
            <Upload className="h-4 w-4" />
            Upload images
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(e) => void onGalleryUpload(e.target.files)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
