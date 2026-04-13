"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2, MessageCircle, Reply, Trash2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import { canAccessAdmin } from "@/lib/auth/roles";
import {
  fetchCommentsForPost,
  type BlogComment,
} from "@/lib/blog/blog-comments";

const MAX_DEPTH = 8;
const MAX_BODY = 8000;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function displayNameForComment(c: BlogComment): string {
  const n = c.author_display_name?.trim();
  return n || "Member";
}

type Props = {
  postId: string;
};

export default function BlogCommentsSection({ postId }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { ready: authReady, userId, name, email, role } = useAuthProfile();
  const isAdmin = canAccessAdmin(role);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [rootText, setRootText] = useState("");
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const loginNext = useMemo(() => {
    const q = searchParams.toString();
    return `${pathname}${q ? `?${q}` : ""}`;
  }, [pathname, searchParams]);

  const load = useCallback(async () => {
    setLoading(true);
    const list = await fetchCommentsForPost(postId);
    setComments(list);
    setLoading(false);
  }, [postId]);

  useEffect(() => {
    void load();
  }, [load]);

  const byParent = useMemo(() => {
    const m = new Map<string | null, BlogComment[]>();
    for (const c of comments) {
      const k = c.parent_id;
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(c);
    }
    return m;
  }, [comments]);

  async function submitComment(parentId: string | null) {
    setErr(null);
    const raw = parentId ? replyText : rootText;
    const t = raw.trim();
    if (!t) {
      setErr("Write something before posting.");
      return;
    }
    if (t.length > MAX_BODY) {
      setErr(`Comments are limited to ${MAX_BODY} characters.`);
      return;
    }
    if (!userId) return;
    setSubmitting(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const author_display_name =
        name?.trim() || email?.split("@")[0]?.trim() || "Member";
      const { error } = await supabase.from("blog_post_comments").insert({
        post_id: postId,
        parent_id: parentId,
        user_id: userId,
        author_display_name,
        body: t,
      });
      if (error) throw new Error(error.message);
      if (parentId) {
        setReplyText("");
        setReplyParentId(null);
      } else {
        setRootText("");
      }
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not post comment.");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeComment(id: string) {
    if (!confirm("Delete this comment?")) return;
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("blog_post_comments")
        .delete()
        .eq("id", id);
      if (error) throw new Error(error.message);
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  function CommentTree({
    parentId,
    depth,
  }: {
    parentId: string | null;
    depth: number;
  }) {
    const items = byParent.get(parentId) ?? [];
    if (items.length === 0) return null;
    return (
      <ul
        className={
          parentId
            ? "mt-3 space-y-3 border-l border-border/80 pl-4"
            : "space-y-4"
        }
      >
        {items.map((c) => {
          const canDelete = userId && (c.user_id === userId || isAdmin);
          const showReplyBox = replyParentId === c.id;
          const canReply = Boolean(userId && depth < MAX_DEPTH - 1);
          return (
            <li key={c.id}>
              <div className="rounded-xl border border-border/70 bg-card/60 px-3 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {displayNameForComment(c)}
                  </p>
                  <time
                    className="text-xs text-muted-foreground"
                    dateTime={c.created_at}
                  >
                    {new Date(c.created_at).toLocaleString()}
                  </time>
                </div>
                <p
                  className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: escapeHtml(c.body).replace(/\n/g, "<br />"),
                  }}
                />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {canReply ? (
                    <button
                      type="button"
                      onClick={() => {
                        setReplyParentId(showReplyBox ? null : c.id);
                        setReplyText("");
                      }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                    >
                      <Reply className="h-3 w-3" aria-hidden />
                      Reply
                    </button>
                  ) : null}
                  {canDelete ? (
                    <button
                      type="button"
                      onClick={() => void removeComment(c.id)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-destructive hover:underline"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden />
                      Delete
                    </button>
                  ) : null}
                </div>
                {showReplyBox ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      maxLength={MAX_BODY}
                      placeholder="Write a reply…"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                      aria-label="Reply text"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => void submitComment(c.id)}
                        className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                      >
                        {submitting ? "Posting…" : "Post reply"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setReplyParentId(null);
                          setReplyText("");
                        }}
                        className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted/50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
              <CommentTree parentId={c.id} depth={depth + 1} />
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section
      className="mt-14 border-t border-border pt-10"
      aria-labelledby="blog-comments-heading"
    >
      <h2
        id="blog-comments-heading"
        className="flex items-center gap-2 text-lg font-bold text-foreground"
      >
        <MessageCircle className="h-5 w-5 text-brand" aria-hidden />
        Comments
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Signed-in members can join the discussion. Replies are threaded.
      </p>

      {err ? (
        <p
          className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {err}
        </p>
      ) : null}

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-brand" aria-hidden />
          Loading comments…
        </div>
      ) : (
        <div className="mt-6">
          <CommentTree parentId={null} depth={0} />
        </div>
      )}

      {!authReady ? null : !userId ? (
        <p className="mt-6 text-sm text-muted-foreground">
          <Link
            href={`/login/?next=${encodeURIComponent(loginNext)}`}
            className="font-medium text-brand hover:underline"
          >
            Sign in
          </Link>{" "}
          to leave a comment.
        </p>
      ) : (
        <div className="mt-8">
          <p className="mb-2 text-sm font-medium text-foreground">
            Add a comment
          </p>
          <textarea
            value={rootText}
            onChange={(e) => setRootText(e.target.value)}
            rows={4}
            maxLength={MAX_BODY}
            placeholder="Share your thoughts…"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            aria-label="New comment"
          />
          <button
            type="button"
            disabled={submitting}
            onClick={() => void submitComment(null)}
            className="mt-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {submitting ? "Posting…" : "Post comment"}
          </button>
        </div>
      )}
    </section>
  );
}
