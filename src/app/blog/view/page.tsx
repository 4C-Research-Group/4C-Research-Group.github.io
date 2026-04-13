"use client";

import { Suspense, useEffect, useState } from "react";
import BlogCommentsSection from "@/components/blog/BlogCommentsSection";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  Newspaper,
  Tag,
  User,
} from "lucide-react";
import {
  fetchBlogPostBySlugPublic,
  type BlogPost,
} from "@/lib/blog/supabase-blog";

function BlogViewBody() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug")?.trim() ?? "";
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    void (async () => {
      const p = await fetchBlogPostBySlugPublic(slug);
      if (!cancelled) setPost(p);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!slug) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground">Missing article slug.</p>
        <Link href="/blog/" className="text-sm font-medium text-brand hover:underline">
          Back to blog
        </Link>
      </div>
    );
  }

  if (post === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand" aria-label="Loading" />
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">
          This post was not found or is not published.
        </p>
        <Link href="/blog/" className="text-sm font-medium text-brand hover:underline">
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background">
      <section className="relative min-h-[280px] overflow-hidden sm:min-h-[360px]">
        {post.image_url ? (
          <>
            <Image
              src={post.image_url}
              alt=""
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-black/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-brand/25 via-background to-consciousness/20" />
        )}
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col px-4 pb-10 pt-24 sm:px-6 sm:pt-28">
          <Link
            href="/blog/"
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm hover:bg-background"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>
          <span className="mb-3 inline-flex w-fit rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
            {post.category}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.read_time}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-5 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
            {post.author_image_url ? (
              <Image
                src={post.author_image_url}
                alt=""
                width={56}
                height={56}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <User className="h-7 w-7 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground">{post.author_name}</p>
            <p className="text-sm text-muted-foreground">{post.author_role}</p>
          </div>
        </div>

        {post.tags.length > 0 ? (
          <div className="mb-8 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                <Tag className="h-3 w-3" />
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <div
          className="prose prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-brand prose-strong:text-foreground dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Suspense fallback={null}>
          <BlogCommentsSection postId={post.id} />
        </Suspense>

        <div className="mt-12 border-t border-border pt-8">
          <Link
            href="/blog/"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
          >
            <Newspaper className="h-4 w-4" />
            More articles
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function BlogViewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand" aria-label="Loading" />
        </div>
      }
    >
      <BlogViewBody />
    </Suspense>
  );
}
