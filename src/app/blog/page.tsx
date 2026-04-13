"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Clock,
  Loader2,
  Newspaper,
  Search,
  Sparkles,
  Tag,
} from "lucide-react";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import { canAccessAdmin } from "@/lib/auth/roles";
import {
  fetchPublishedBlogPosts,
  uniqueCategories,
  type BlogPost,
} from "@/lib/blog/supabase-blog";
import { blogPostHref } from "@/lib/blog/blog-post-href";

function BlogIndexContent() {
  const reduceMotion = useReducedMotion();
  const spring = [0.22, 1, 0.36, 1] as const;
  const fadeUp = reduceMotion ? undefined : { opacity: 0, y: 16 };

  const searchParams = useSearchParams();
  const submittedDraft = searchParams.get("submitted") === "draft";
  const { ready: authReady, role, userId } = useAuthProfile();
  const showAdmin = authReady && canAccessAdmin(role);
  const showWrite = authReady && !!userId;
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "title">("newest");

  useEffect(() => {
    let alive = true;
    void (async () => {
      const list = await fetchPublishedBlogPosts();
      if (!alive) return;
      setPosts(list);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(() => {
    const u = uniqueCategories(posts);
    return ["all", ...u];
  }, [posts]);

  const featured = useMemo(
    () => posts.filter((p) => p.featured).slice(0, 3),
    [posts],
  );

  const filtered = useMemo(() => {
    let list = posts.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
    list = [...list].sort((a, b) => {
      if (sort === "newest")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      if (sort === "oldest")
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      return a.title.localeCompare(b.title);
    });
    return list;
  }, [posts, category, search, sort]);

  const featuredVisible = useMemo(() => {
    const ids = new Set(filtered.map((p) => p.id));
    return featured.filter((f) => ids.has(f.id));
  }, [featured, filtered]);

  const gridPosts = useMemo(() => {
    const ids = new Set(featuredVisible.map((p) => p.id));
    return filtered.filter((p) => !ids.has(p.id));
  }, [filtered, featuredVisible]);

  const featuredTotal = useMemo(
    () => posts.filter((p) => p.featured).length,
    [posts],
  );
  const categoryCount = useMemo(
    () => Math.max(0, categories.length - 1),
    [categories],
  );

  const renderHero = () => (
    <section className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-slate-50/95 via-background to-background">
      <div
        className="pointer-events-none absolute inset-0 bg-grid-black/5 mask-[linear-gradient(180deg,white,transparent_80%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-0 h-[26rem] w-[26rem] rounded-full bg-brand/12 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-cognition/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-care/8 blur-3xl"
        aria-hidden
      />

      <div className="container relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(280px,400px)] lg:gap-14">
          <motion.div
            initial={fadeUp}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.5,
              ease: spring,
            }}
            className="text-center lg:text-left"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand sm:text-[13px]">
              <Newspaper className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Research Updates
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                Blog
              </span>
              <span className="mt-3 block text-2xl font-semibold leading-snug tracking-tight text-muted-foreground sm:text-3xl lg:text-[1.65rem]">
                Research updates, lab news, and perspectives from the 4C
                Research Group
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              Stay informed about our latest research findings, team
              achievements, and insights into pediatric critical care and
              neuroscience.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-xl border border-cognition/20 bg-cognition/5 px-3 py-2 text-xs font-medium text-cognition sm:text-sm">
                <Sparkles className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                Featured Articles
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-consciousness/20 bg-consciousness/5 px-3 py-2 text-xs font-medium text-consciousness sm:text-sm">
                <Tag className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                Categorized Topics
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-care/20 bg-care/5 px-3 py-2 text-xs font-medium text-care sm:text-sm">
                <Calendar className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                Regular Updates
              </span>
            </div>
            {submittedDraft ? (
              <p
                className="mt-8 rounded-2xl border border-care/25 bg-care/5 px-4 py-3 text-center text-sm text-foreground lg:text-left"
                role="status"
              >
                Thanks — your draft was submitted. An administrator will review
                it before it appears here.
              </p>
            ) : null}
            {showWrite || showAdmin ? (
              <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                {showWrite ? (
                  <Link
                    href="/blog/write/"
                    className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand/30 hover:bg-muted/40"
                  >
                    Write a post
                  </Link>
                ) : null}
                {showAdmin ? (
                  <Link
                    href="/admin/blog/"
                    className="inline-flex items-center gap-2 rounded-2xl border border-brand/25 bg-brand/10 px-5 py-2.5 text-sm font-semibold text-brand transition hover:border-brand/40 hover:bg-brand/15"
                  >
                    Manage posts
                  </Link>
                ) : null}
              </div>
            ) : null}
          </motion.div>

          <motion.div
            initial={fadeUp}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.55,
              delay: reduceMotion ? 0 : 0.06,
              ease: spring,
            }}
            className="relative mx-auto w-full max-w-md lg:mx-0"
          >
            <div
              className="absolute -inset-1 rounded-[1.35rem] bg-linear-to-br from-cognition/15 via-brand/12 to-care/15 opacity-90 blur-sm"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/90 p-6 shadow-lg ring-1 ring-black/[0.04] backdrop-blur-md sm:p-7">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/12 text-brand">
                <Newspaper className="h-5 w-5" aria-hidden />
              </div>
              <dl className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-border/50 bg-muted/20 px-3 py-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                    Posts
                  </dt>
                  <dd className="mt-1 text-xl font-bold tabular-nums text-foreground sm:text-2xl">
                    {loading ? "—" : posts.length}
                  </dd>
                </div>
                <div className="rounded-2xl border border-border/50 bg-muted/20 px-3 py-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                    Featured
                  </dt>
                  <dd className="mt-1 text-xl font-bold tabular-nums text-care sm:text-2xl">
                    {loading ? "—" : featuredTotal}
                  </dd>
                </div>
                <div className="rounded-2xl border border-border/50 bg-muted/20 px-3 py-3">
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
                    Topics
                  </dt>
                  <dd className="mt-1 text-xl font-bold tabular-nums text-cognition sm:text-2xl">
                    {loading ? "—" : categoryCount}
                  </dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-background">
      {renderHero()}

      <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {loading ? (
          <div className="flex min-h-[min(60dvh,28rem)] flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
            <Loader2
              className="h-9 w-9 animate-spin text-brand"
              aria-hidden
            />
            <p className="text-sm">Loading posts…</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-border/80 bg-muted/15 p-10 text-center">
            <Newspaper
              className="mx-auto h-12 w-12 text-muted-foreground/60"
              aria-hidden
            />
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              No posts yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Run{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                npm run seed-blog
              </code>{" "}
              after applying{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                supabase/blog_posts.sql
              </code>
              , add posts in the admin dashboard, or sign in and use{" "}
              <Link href="/blog/write/" className="font-medium text-brand hover:underline">
                Write a post
              </Link>{" "}
              (drafts are reviewed by an admin).
            </p>
          </div>
        ) : (
          <>
            {featuredVisible.length > 0 ? (
              <section className="mb-14">
                <div className="mb-8 flex flex-col items-center gap-2 lg:items-start">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-brand" aria-hidden />
                    <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                      Featured
                    </h2>
                  </div>
                  <div className="h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
                </div>
                <div className="grid gap-6 md:grid-cols-3 md:gap-7">
                  {featuredVisible.map((post, i) => (
                    <motion.article
                      key={post.id}
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.4,
                        delay: reduceMotion ? 0 : i * 0.06,
                        ease: spring,
                      }}
                      className="group overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-sm ring-1 ring-black/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-xl"
                    >
                      <Link
                        href={blogPostHref(post.slug)}
                        className="block rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <div className="relative aspect-[16/10] bg-muted">
                          {post.image_url ? (
                            <Image
                              src={post.image_url}
                              alt={post.title}
                              fill
                              className="object-cover transition duration-500 group-hover:scale-[1.03]"
                              sizes="(max-width:768px) 100vw, 33vw"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-linear-to-br from-brand/20 to-consciousness/20">
                              <Newspaper className="h-10 w-10 text-brand/40" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                            {post.category}
                          </p>
                          <h3 className="mt-1 line-clamp-2 font-semibold text-foreground group-hover:text-brand">
                            {post.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                            {post.excerpt}
                          </p>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </section>
            ) : null}

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.4, ease: spring }}
              className="mb-10 overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-5 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-6"
            >
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="relative min-w-0 flex-1 sm:max-w-md">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <input
                    type="search"
                    placeholder="Search title, excerpt, or tags…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-2xl border border-border/80 bg-background/90 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    aria-label="Search blog posts"
                  />
                </div>
                <div className="shrink-0">
                  <label htmlFor="blog-sort" className="sr-only">
                    Sort posts
                  </label>
                  <select
                    id="blog-sort"
                    value={sort}
                    onChange={(e) =>
                      setSort(e.target.value as "newest" | "oldest" | "title")
                    }
                    className="w-full rounded-2xl border border-border/80 bg-background/90 px-4 py-3 text-sm font-medium text-foreground sm:w-auto"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="title">Title A–Z</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition sm:text-sm ${
                      category === c
                        ? "border-brand/30 bg-brand text-primary-foreground shadow-md shadow-brand/15"
                        : "border-border/80 bg-background/80 text-muted-foreground hover:border-brand/25 hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    {c === "all" ? "All" : c}
                  </button>
                ))}
              </div>
              <div className="mt-6 border-t border-border/50 pt-5 text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {gridPosts.length}
                </span>{" "}
                {gridPosts.length === 1 ? "post" : "posts"}
                {featuredVisible.length > 0 ? (
                  <span className="text-muted-foreground/80">
                    {" "}
                    (featured above)
                  </span>
                ) : null}
              </div>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 sm:gap-7">
              {gridPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.38,
                    delay: reduceMotion ? 0 : Math.min(i * 0.04, 0.35),
                    ease: spring,
                  }}
                  className="flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-sm ring-1 ring-black/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-xl"
                >
                  <Link
                    href={blogPostHref(post.slug)}
                    className="flex flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <div className="relative aspect-[16/9] shrink-0 bg-muted">
                      {post.image_url ? (
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width:640px) 100vw, 50vw"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted/80">
                          <Newspaper className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-md bg-brand/10 px-2 py-0.5 font-medium text-brand">
                          {post.category}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {post.read_time}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-foreground">
                        {post.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                      {post.tags.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 4).map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center gap-0.5 rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              <Tag className="h-3 w-3" />
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand">
                        Read more
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {gridPosts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border/80 bg-muted/15 py-14 text-center">
                <p className="text-sm text-muted-foreground">
                  No posts match your filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                  }}
                  className="mt-4 text-sm font-semibold text-brand transition hover:text-brand-deep"
                >
                  Clear search & categories
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
          <Loader2 className="h-9 w-9 animate-spin text-brand" aria-label="Loading" />
        </div>
      }
    >
      <BlogIndexContent />
    </Suspense>
  );
}
