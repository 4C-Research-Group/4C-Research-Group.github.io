"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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

export default function BlogPage() {
  const { ready: authReady, role } = useAuthProfile();
  const showAdmin = authReady && canAccessAdmin(role);
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

  const renderHero = () => (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-background to-brand-light/30">
      <div className="absolute inset-0 bg-grid-black/5 mask-[linear-gradient(to_bottom_right,white,transparent,white)]" />
      <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-medium text-brand">
            <Newspaper className="h-4 w-4" />
            Research Updates
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Blog
            <span className="block text-3xl font-semibold text-muted-foreground sm:text-4xl lg:text-5xl">
              Research updates, lab news, and perspectives from the 4C Research
              Group
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Stay informed about our latest research findings, team achievements,
            and insights into pediatric critical care and neuroscience.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 rounded-lg bg-cognition/10 px-4 py-2 text-cognition">
              <Sparkles className="h-4 w-4" />
              Featured Articles
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-consciousness/10 px-4 py-2 text-consciousness">
              <Tag className="h-4 w-4" />
              Categorized Topics
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-care/10 px-4 py-2 text-care">
              <Calendar className="h-4 w-4" />
              Regular Updates
            </div>
          </div>
          {showAdmin ? (
            <div className="mt-8">
              <Link
                href="/admin/blog/"
                className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-sm font-medium text-brand hover:bg-brand/15"
              >
                Manage posts
              </Link>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-background">
      {renderHero()}

      <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {loading ? (
          <div className="flex min-h-[min(60dvh,28rem)] items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-brand" aria-hidden />
          </div>
        ) : posts.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-border/80 bg-card p-8 text-center shadow-sm">
            <Newspaper className="mx-auto h-12 w-12 text-muted-foreground/60" />
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
              , or add posts in the admin dashboard.
            </p>
          </div>
        ) : (
          <>
            {featuredVisible.length > 0 ? (
              <section className="mb-14">
                <div className="mb-6 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand" />
                  <h2 className="text-lg font-bold tracking-tight text-foreground">
                    Featured
                  </h2>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                  {featuredVisible.map((post, i) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition hover:border-brand/25 hover:shadow-md"
                    >
                      <Link href={blogPostHref(post.slug)} className="block">
                        <div className="relative aspect-[16/10] bg-muted">
                          {post.image_url ? (
                            <Image
                              src={post.image_url}
                              alt=""
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

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search title, excerpt, tags…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value as "newest" | "oldest" | "title")
                  }
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="title">Title A–Z</option>
                </select>
              </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    category === c
                      ? "bg-brand text-primary-foreground"
                      : "border border-border bg-muted/50 text-muted-foreground hover:border-brand/30"
                  }`}
                >
                  {c === "all" ? "All categories" : c}
                </button>
              ))}
            </div>

            <p className="mb-6 text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {gridPosts.length}
              </span>{" "}
              {gridPosts.length === 1 ? "post" : "posts"}
              {featuredVisible.length > 0 ? " (featured above)" : ""}
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {gridPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.4) }}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition hover:border-brand/20 hover:shadow-md"
                >
                  <Link
                    href={blogPostHref(post.slug)}
                    className="flex flex-1 flex-col"
                  >
                    <div className="relative aspect-[16/9] shrink-0 bg-muted">
                      {post.image_url ? (
                        <Image
                          src={post.image_url}
                          alt=""
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
              <p className="py-12 text-center text-muted-foreground">
                No posts match your filters.
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
