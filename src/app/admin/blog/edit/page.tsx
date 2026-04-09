"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import BlogPostForm from "@/components/blog/BlogPostForm";
import {
  fetchBlogPostByIdForAdmin,
  type BlogPost,
} from "@/lib/blog/supabase-blog";

function AdminBlogEditBody() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id")?.trim() ?? "";
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setErr(null);
    try {
      const p = await fetchBlogPostByIdForAdmin(id);
      setPost(p);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Load failed");
      setPost(null);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!id) {
    return <p className="text-sm text-muted-foreground">Missing post id.</p>;
  }

  if (post === undefined) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  if (err || !post) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">{err ?? "Post not found."}</p>
        <Link href="/admin/blog/" className="text-sm text-brand hover:underline">
          ← All posts
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/admin/blog/"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← All posts
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
          Edit post
        </h1>
      </header>
      <BlogPostForm mode="edit" initial={post} />
    </div>
  );
}

export default function AdminBlogEditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[30vh] items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
          <span className="text-sm">Loading…</span>
        </div>
      }
    >
      <AdminBlogEditBody />
    </Suspense>
  );
}
