"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  fetchAllBlogPostsForAdmin,
  type BlogPost,
} from "@/lib/blog/supabase-blog";
import { blogPostHref } from "@/lib/blog/blog-post-href";

export default function AdminBlogListPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const list = await fetchAllBlogPostsForAdmin();
      setPosts(list);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
      setPosts([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(id: string, title: string) {
    if (!confirm(`Delete “${title}”?`)) return;
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw new Error(error.message);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Delete failed");
    }
  }

  if (posts === null) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
        <span className="text-sm">Loading posts…</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Blog posts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Public list: <Link href="/blog/" className="text-brand hover:underline">/blog/</Link>
            . New posts open at{" "}
            <code className="rounded bg-muted px-1 text-xs">/blog/view/?slug=…</code>
          </p>
        </div>
        <Link
          href="/admin/blog/new/"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          New post
        </Link>
      </header>

      {err ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {err}
        </p>
      ) : null}

      {posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No posts yet. Add one or run{" "}
          <code className="rounded bg-muted px-1 text-xs">npm run seed-blog</code>.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border/80 bg-card">
          {posts.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground">{p.title}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-mono">{p.slug}</span>
                  {" · "}
                  {p.published ? (
                    <span className="text-care">published</span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400">draft</span>
                  )}
                  {p.featured ? " · featured" : ""}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  href={blogPostHref(p.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted/60"
                >
                  View
                </Link>
                <Link
                  href={`/admin/blog/edit/?id=${encodeURIComponent(p.id)}`}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted/60"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => void remove(p.id, p.title)}
                  className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
