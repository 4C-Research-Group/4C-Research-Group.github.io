"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import { tagsToJson } from "@/lib/blog/parse-tags";
import type { BlogPost } from "@/lib/blog/supabase-blog";
import type { Database, Json } from "@/lib/supabase/database.types";
import BlogRichTextEditor from "@/components/blog/BlogRichTextEditor";

function slugify(s: string): string {
  const t = s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return t || `post-${Date.now()}`;
}

function blogBodyIsEmpty(html: string): boolean {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length === 0;
}

type Props = {
  mode: "new" | "edit";
  initial?: BlogPost | null;
  /** Community: signed-in members submit drafts; only admins publish or edit later. */
  variant?: "admin" | "community";
};

export default function BlogPostForm({
  mode,
  initial,
  variant = "admin",
}: Props) {
  const router = useRouter();
  const { ready: authReady, userId, name, email } = useAuthProfile();
  const isCommunity = variant === "community";
  const [didPrefillAuthor, setDidPrefillAuthor] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState(initial?.category ?? "General");
  const [readTime, setReadTime] = useState(initial?.read_time ?? "5 min read");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [tagsCsv, setTagsCsv] = useState(initial?.tags.join(", ") ?? "");
  const [authorName, setAuthorName] = useState(initial?.author_name ?? "");
  const [authorRole, setAuthorRole] = useState(initial?.author_role ?? "");
  const [authorImageUrl, setAuthorImageUrl] = useState(
    initial?.author_image_url ?? "",
  );
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [published, setPublished] = useState(initial?.published ?? true);

  useEffect(() => {
    if (!isCommunity || mode !== "new" || didPrefillAuthor || !authReady) return;
    const n = name?.trim() || email?.split("@")[0]?.trim();
    if (n) {
      setAuthorName(n);
      setDidPrefillAuthor(true);
    }
  }, [
    isCommunity,
    mode,
    didPrefillAuthor,
    authReady,
    name,
    email,
  ]);

  const cancelHref = isCommunity ? "/blog/" : "/admin/blog/";
  const afterSaveHref = isCommunity ? "/blog/?submitted=draft" : "/admin/blog/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const finalSlug = (slug.trim() || slugify(title)).trim();
    if (!finalSlug || !title.trim()) {
      setErr("Slug and title are required.");
      return;
    }
    if (blogBodyIsEmpty(content)) {
      setErr("Add some body content to the post.");
      return;
    }
    const tags = tagsCsv
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter(Boolean);

    if (isCommunity && !userId) {
      setErr("You must be signed in to submit a post.");
      return;
    }

    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      type Ins = Database["public"]["Tables"]["blog_posts"]["Insert"];
      const row: Ins = {
        slug: finalSlug,
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        category: category.trim() || "General",
        read_time: readTime.trim() || "5 min read",
        image_url: imageUrl.trim(),
        tags: tagsToJson(tags) as Json,
        featured: isCommunity ? false : featured,
        published: isCommunity ? false : published,
        author_name: authorName.trim() || "4C Research Group",
        author_role: authorRole.trim() || "Research",
        author_image_url: authorImageUrl.trim(),
      };

      if (isCommunity && mode === "new" && userId) {
        row.author_user_id = userId;
      }
      if (mode === "edit") {
        row.author_user_id = initial?.author_user_id ?? null;
      }

      if (mode === "new") {
        const { error } = await supabase.from("blog_posts").insert(row);
        if (error) throw new Error(error.message);
        router.replace(afterSaveHref);
        router.refresh();
        return;
      }

      if (!initial?.id) {
        setErr("Missing post id.");
        return;
      }
      const { error } = await supabase
        .from("blog_posts")
        .update(row)
        .eq("id", initial.id);
      if (error) throw new Error(error.message);
      router.replace(afterSaveHref);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      {err ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {err}
        </p>
      ) : null}

      {isCommunity ? (
        <p className="rounded-lg border border-brand/25 bg-brand/5 px-3 py-2 text-sm text-foreground">
          Your post is saved as a <strong>draft</strong>. It will not appear on
          the public blog until an administrator reviews and publishes it.
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Post</h2>
          <label className="block text-xs font-medium text-muted-foreground">
            URL slug
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-from-title if empty"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Excerpt
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <div className="block">
            <span className="text-xs font-medium text-muted-foreground">Content</span>
            <div className="mt-1">
              <BlogRichTextEditor
                key={mode === "edit" && initial?.id ? initial.id : "new"}
                value={content}
                onChange={setContent}
                placeholder="Write your post…"
              />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Formatting is saved as HTML and shown on the public blog. Use the
            toolbar for headings, lists, links, and images (URL).
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">Meta &amp; author</h2>
          <label className="block text-xs font-medium text-muted-foreground">
            Category
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Read time label
            <input
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Cover image URL
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Tags (comma-separated)
            <input
              value={tagsCsv}
              onChange={(e) => setTagsCsv(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Author name
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Author role
            <input
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-muted-foreground">
            Author image URL
            <input
              value={authorImageUrl}
              onChange={(e) => setAuthorImageUrl(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
          {!isCommunity ? (
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                Published
              </label>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save
        </button>
        <Link
          href={cancelHref}
          className="inline-flex items-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted/60"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
