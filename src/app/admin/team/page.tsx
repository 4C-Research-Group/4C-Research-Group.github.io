"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Users,
} from "lucide-react";
import TeamPhotoField from "@/components/admin/TeamPhotoField";
import TeamMemberPublicationsEditor from "@/components/admin/TeamMemberPublicationsEditor";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { slugifyTeamMember } from "@/lib/team/slug";
import {
  deleteTeamPhotoAtPublicUrl,
  teamPhotoPathFromPublicUrl,
  uploadTeamMemberPhoto,
  validateTeamPhotoFile,
} from "@/lib/team/team-photo-storage";

type MemberRow = {
  id: string;
  slug: string;
  name: string;
  initials: string;
  role_title: string;
  category: string;
  superpower: string;
  photo_file: string;
  is_alumni: boolean;
  sort_order: number;
  bio: string;
  email: string;
  linkedin_url: string;
  degree?: string;
  orcid_url?: string;
  google_scholar_url?: string;
  researchgate_url?: string;
};

type RowEdit = {
  slug: string;
  name: string;
  initials: string;
  role_title: string;
  category: "staff" | "student";
  superpower: string;
  photo_file: string;
  is_alumni: boolean;
  sort_order: number;
  bio: string;
  email: string;
  linkedin_url: string;
  degree: string;
  orcid_url: string;
  google_scholar_url: string;
  researchgate_url: string;
};

function fromServer(r: MemberRow): RowEdit {
  return {
    slug: r.slug,
    name: r.name,
    initials: r.initials,
    role_title: r.role_title,
    category: r.category === "student" ? "student" : "staff",
    superpower: r.superpower,
    photo_file: r.photo_file,
    is_alumni: r.is_alumni,
    sort_order: r.sort_order,
    bio: r.bio ?? "",
    email: r.email ?? "",
    linkedin_url: r.linkedin_url ?? "",
    degree: r.degree ?? "",
    orcid_url: r.orcid_url ?? "",
    google_scholar_url: r.google_scholar_url ?? "",
    researchgate_url: r.researchgate_url ?? "",
  };
}

function rowEditsDiffer(a: RowEdit, b: RowEdit): boolean {
  return (
    a.slug !== b.slug ||
    a.name !== b.name ||
    a.initials !== b.initials ||
    a.role_title !== b.role_title ||
    a.category !== b.category ||
    a.superpower !== b.superpower ||
    a.photo_file !== b.photo_file ||
    a.is_alumni !== b.is_alumni ||
    a.sort_order !== b.sort_order ||
    a.bio !== b.bio ||
    a.email !== b.email ||
    a.linkedin_url !== b.linkedin_url ||
    a.degree !== b.degree ||
    a.orcid_url !== b.orcid_url ||
    a.google_scholar_url !== b.google_scholar_url ||
    a.researchgate_url !== b.researchgate_url
  );
}

export default function AdminTeamPage() {
  const [items, setItems] = useState<MemberRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [originalId, setOriginalId] = useState<string | null>(null);
  const [form, setForm] = useState<RowEdit>({
    slug: "",
    name: "",
    initials: "",
    role_title: "",
    category: "staff",
    superpower: "",
    photo_file: "",
    is_alumni: false,
    sort_order: 0,
    bio: "",
    email: "",
    linkedin_url: "",
    degree: "",
    orcid_url: "",
    google_scholar_url: "",
    researchgate_url: "",
  });
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      setItems((data as MemberRow[]) ?? []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
      setItems([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function pickRow(row: MemberRow) {
    setOriginalId(row.id);
    setForm(fromServer(row));
    setPendingPhoto(null);
  }

  function startNew() {
    setOriginalId(null);
    setForm({
      slug: "",
      name: "",
      initials: "",
      role_title: "",
      category: "staff",
      superpower: "",
      photo_file: "",
      is_alumni: false,
      sort_order: items ? Math.max(...items.map(r => r.sort_order), 0) + 10 : 10,
      bio: "",
      email: "",
      linkedin_url: "",
      degree: "",
      orcid_url: "",
      google_scholar_url: "",
      researchgate_url: "",
    });
    setPendingPhoto(null);
  }

  async function save() {
    setSaving(true);
    setErr(null);
    try {
      const slugInput = form.slug.trim();
      const slugFinal = slugifyTeamMember(slugInput) || slugInput;
      if (!slugFinal || !form.name.trim()) {
        throw new Error("Name is required; slug is generated from name if left blank.");
      }
      
      if (pendingPhoto) {
        const photoErr = validateTeamPhotoFile(pendingPhoto);
        if (photoErr) {
          throw new Error(photoErr);
        }
      }

      let photo_file = form.photo_file.trim();
      if (pendingPhoto) {
        const { publicUrl } = await uploadTeamMemberPhoto(pendingPhoto, slugFinal);
        if (originalId && teamPhotoPathFromPublicUrl(form.photo_file.trim())) {
          await deleteTeamPhotoAtPublicUrl(form.photo_file.trim());
        }
        photo_file = publicUrl;
      }

      const supabase = getSupabaseBrowserClient();
      const updateData = {
        slug: slugFinal,
        name: form.name.trim(),
        initials: form.initials.trim(),
        role_title: form.role_title.trim(),
        category: form.category,
        superpower: form.superpower.trim(),
        photo_file,
        is_alumni: form.is_alumni,
        sort_order: form.sort_order,
        bio: form.bio.trim(),
        email: form.email.trim(),
        linkedin_url: form.linkedin_url.trim(),
        degree: form.degree.trim(),
        orcid_url: form.orcid_url.trim(),
        google_scholar_url: form.google_scholar_url.trim(),
        researchgate_url: form.researchgate_url.trim(),
        updated_at: new Date().toISOString(),
      };

      if (originalId) {
        const { error } = await supabase
          .from("team_members")
          .update(updateData)
          .eq("id", originalId);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from("team_members")
          .insert(updateData);
        if (error) throw new Error(error.message);
      }

      await load();
      if (!originalId) {
        // Get the newly created member's ID
        const { data } = await supabase
          .from("team_members")
          .select("id")
          .eq("slug", slugFinal)
          .single();
        if (data) {
          setOriginalId(data.id);
        }
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!originalId) return;
    const member = items?.find(m => m.id === originalId);
    if (!member) return;
    if (!confirm(`Delete team member "${member.name}"?`)) return;
    
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", originalId);
      if (error) throw new Error(error.message);
      
      // Delete photo if it's a Supabase storage photo
      if (teamPhotoPathFromPublicUrl(member.photo_file.trim())) {
        await deleteTeamPhotoAtPublicUrl(member.photo_file.trim());
      }
      
      setOriginalId(null);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Delete failed");
    }
  }

  const list = items ?? [];
  const baseline = originalId ? items?.find(m => m.id === originalId) : null;
  const dirty = baseline ? rowEditsDiffer(form, fromServer(baseline)) || pendingPhoto !== null : true;

  if (items === null) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
        <span className="text-sm">Loading team members...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Team members
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit fields below or upload photos. Each member has a portfolio page at{" "}
          <code className="rounded bg-muted px-1 text-xs">/team/slug/</code>.
          Legacy headshots belong in{" "}
          <code className="rounded bg-muted px-1 text-xs">public/images/team/</code>{" "}
          (not <code className="rounded bg-muted px-1 text-xs">public/team/</code>, which clashes with those URLs).
          Run <code className="rounded bg-muted px-1 text-xs">seed_team_members.sql</code>{" "}
          once to import legacy team members. For degree + ORCID / Scholar / ResearchGate
          fields, run{" "}
          <code className="rounded bg-muted px-1 text-xs">
            team_member_degree_academic_urls.sql
          </code>{" "}
          in Supabase if those columns are missing.
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
            value={originalId ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) return;
              const row = list.find((x) => x.id === v);
              if (row) pickRow(row);
            }}
          >
            <option value="">Select a member...</option>
            {list.map((row) => (
              <option key={row.id} value={row.id}>
                {row.name} ({row.slug})
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
          New member
        </button>
        <button
          type="button"
          disabled={saving || !dirty}
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
        {originalId ? (
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
          No team members in database. Add someone above or run the seed script.
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Core Information</h2>
          
          <Field
            label="Name *"
            value={form.name}
            onChange={(name) => setForm((f) => ({ ...f, name }))}
          />
          
          <Field
            label="Slug (optional)"
            value={form.slug}
            onChange={(slug) => setForm((f) => ({ ...f, slug }))}
            placeholder="auto from name"
          />
          
          <Field
            label="Initials"
            value={form.initials}
            onChange={(initials) => setForm((f) => ({ ...f, initials }))}
          />
          
          <Field
            label="Role / title"
            value={form.role_title}
            onChange={(role_title) => setForm((f) => ({ ...f, role_title }))}
          />
          
          <label className="block text-xs font-medium text-muted-foreground">
            Category
            <select
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  category: e.target.value as "staff" | "student",
                }))
              }
            >
              <option value="staff">Staff</option>
              <option value="student">Student / trainee</option>
            </select>
          </label>
          
          <label className="block text-xs font-medium text-muted-foreground">
            Sort order
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          
          <label className="flex items-center gap-2.5 pt-1 text-sm text-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              checked={form.is_alumni}
              onChange={(e) => setForm((f) => ({ ...f, is_alumni: e.target.checked }))}
            />
            Alumni (show under Lab Alumni on the site)
          </label>
        </div>

        <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Profile & Media</h2>
          
          <div className="space-y-3">
            <TeamPhotoField
              storedRaw={form.photo_file}
              onStoredRawChange={(photo_file) =>
                setForm((f) => ({ ...f, photo_file }))
              }
              pendingFile={pendingPhoto}
              onPendingFileChange={setPendingPhoto}
              disabled={saving}
            />
            <Field
              label="Image URL or legacy filename (optional)"
              value={form.photo_file}
              onChange={(photo_file) => setForm((f) => ({ ...f, photo_file }))}
              placeholder="https://... or team-2.jpg"
            />
          </div>
          
          <label className="block text-xs font-medium text-muted-foreground">
            Superpower (short bio line)
            <textarea
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={form.superpower}
              onChange={(e) => setForm((f) => ({ ...f, superpower: e.target.value }))}
              rows={2}
            />
          </label>
          
          <label className="block text-xs font-medium text-muted-foreground">
            Portfolio bio (longer; optional)
            <textarea
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              rows={4}
              placeholder="Shown on /team/slug/ under About"
            />
          </label>
          
          <Field
            label="Email (portfolio)"
            value={form.email}
            onChange={(email) => setForm((f) => ({ ...f, email }))}
            placeholder="name@example.com"
          />

          <label className="block text-xs font-medium text-muted-foreground">
            Degree / qualifications (optional)
            <textarea
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={form.degree}
              onChange={(e) =>
                setForm((f) => ({ ...f, degree: e.target.value }))
              }
              rows={2}
              placeholder="e.g. PhD candidate, Neuroscience · MD · BSc (Hons)"
            />
            <span className="mt-1 block text-[11px] font-normal text-muted-foreground">
              Shown on the team grid and profile when filled (useful for students).
            </span>
          </label>

          <div className="space-y-3 border-t border-border/60 pt-4">
            <p className="text-xs font-semibold text-foreground">
              Professional links (optional)
            </p>
            <Field
              label="LinkedIn"
              value={form.linkedin_url}
              onChange={(linkedin_url) =>
                setForm((f) => ({ ...f, linkedin_url }))
              }
              placeholder="https://www.linkedin.com/in/..."
            />
            <Field
              label="ORCID"
              value={form.orcid_url}
              onChange={(orcid_url) => setForm((f) => ({ ...f, orcid_url }))}
              placeholder="https://orcid.org/0000-0000-0000-0000"
            />
            <Field
              label="Google Scholar"
              value={form.google_scholar_url}
              onChange={(google_scholar_url) =>
                setForm((f) => ({ ...f, google_scholar_url }))
              }
              placeholder="https://scholar.google.com/citations?user=..."
            />
            <Field
              label="ResearchGate"
              value={form.researchgate_url}
              onChange={(researchgate_url) =>
                setForm((f) => ({ ...f, researchgate_url }))
              }
              placeholder="https://www.researchgate.net/profile/..."
            />
          </div>
        </div>
      </div>

      {originalId && (
        <div className="rounded-2xl border border-border/80 bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Publications</h2>
          <TeamMemberPublicationsEditor
            memberId={originalId}
            memberName={form.name || "Untitled member"}
          />
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-xs font-medium text-muted-foreground">
      {label}
      <input
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
