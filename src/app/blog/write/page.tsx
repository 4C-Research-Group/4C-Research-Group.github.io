"use client";

import Link from "next/link";
import { Loader2, PenLine } from "lucide-react";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import BlogPostForm from "@/components/blog/BlogPostForm";

export default function BlogWritePage() {
  const { ready, userId } = useAuthProfile();

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-9 w-9 animate-spin text-brand" aria-hidden />
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <PenLine className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Sign in to write
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Community members can submit blog drafts. An administrator will
          review and publish when ready.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/login/?next=${encodeURIComponent("/blog/write/")}`}
            className="inline-flex rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/signup/"
            className="inline-flex rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted/60"
          >
            Create account
          </Link>
        </div>
        <p className="mt-8">
          <Link href="/blog/" className="text-sm font-medium text-brand hover:underline">
            Back to blog
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8">
        <Link
          href="/blog/"
          className="text-sm font-medium text-brand hover:underline"
        >
          ← Back to blog
        </Link>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Write a blog post
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Submissions are saved as drafts. Only site administrators can edit or
          publish posts.
        </p>
      </div>
      <BlogPostForm mode="new" variant="community" />
    </div>
  );
}
