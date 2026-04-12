"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  FolderKanban,
  GraduationCap,
  Handshake,
  House,
  Images,
  Info,
  LayoutDashboard,
  Lightbulb,
  Loader2,
  Microscope,
  Newspaper,
  Search,
  ShieldUser,
  Sparkles,
  UserCircle,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import {
  AccountDetailsSection,
  roleBadgeClassName,
  roleLabel,
} from "@/components/admin/account-details";
import { canManageUsers } from "@/lib/auth/roles";

const QUICK_LINKS = [
  {
    href: "/admin/homepage/",
    title: "Homepage",
    desc: "Hero, mission, gallery, news, CTAs, and images.",
    icon: House,
  },
  {
    href: "/admin/about/",
    title: "About page",
    desc: "Mission cards, PI block, research focus, and images.",
    icon: Info,
  },
  {
    href: "/admin/about-pi/",
    title: "About PI",
    desc: "Full PI profile, CV sections, grants, publications, and headshot.",
    icon: UserCircle,
  },
  {
    href: "/admin/join-4c-lab/",
    title: "Join 4C Lab",
    desc: "Recruitment hero, apply section, testimonials copy, and CTA.",
    icon: UserPlus,
  },
  {
    href: "/admin/collaborate/",
    title: "Collaborate",
    desc: "Partnerships, partners, funders, and contact block copy.",
    icon: Handshake,
  },
  {
    href: "/admin/team/",
    title: "Team",
    desc: "Roster, alumni, photos, sort order.",
    icon: Users,
  },
  {
    href: "/admin/projects/",
    title: "Projects",
    desc: "Research projects, gallery images, tags.",
    icon: FolderKanban,
  },
  {
    href: "/admin/blog/",
    title: "Blog",
    desc: "News posts, HTML content, featured items.",
    icon: Newspaper,
  },
  {
    href: "/admin/research/",
    title: "Research page",
    desc: "Themes, projects, collaborations, CTA.",
    icon: Microscope,
  },
  {
    href: "/admin/gallery/",
    title: "Gallery",
    desc: "Photos, layout sections, copy, and custom blocks.",
    icon: Images,
  },
  {
    href: "/admin/knowledge-mobilization/",
    title: "Knowledge Mobilization",
    desc: "Hub copy, registration gate, programs/tracks, certificate blurb.",
    icon: GraduationCap,
  },
  {
    href: "/admin/knowledge-mobilization/curriculum/",
    title: "KM curriculum",
    desc: "Modules, lesson topics, video URLs, and quiz questions.",
    icon: BookOpen,
  },
] as const;

type QuickLink = (typeof QUICK_LINKS)[number];

const LINK_GROUPS: readonly {
  title: string;
  subtitle: string;
  hrefs: readonly QuickLink["href"][];
}[] = [
  {
    title: "Site & identity",
    subtitle: "Homepage, institutional pages, and PI profile.",
    hrefs: ["/admin/homepage/", "/admin/about/", "/admin/about-pi/"],
  },
  {
    title: "People & partnerships",
    subtitle: "Team, recruiting, and collaborator-facing content.",
    hrefs: ["/admin/team/", "/admin/join-4c-lab/", "/admin/collaborate/"],
  },
  {
    title: "Research & publishing",
    subtitle: "Projects, research narrative, blog, and gallery.",
    hrefs: [
      "/admin/projects/",
      "/admin/research/",
      "/admin/blog/",
      "/admin/gallery/",
    ],
  },
  {
    title: "Knowledge mobilization",
    subtitle: "Program hub and curriculum with quizzes.",
    hrefs: [
      "/admin/knowledge-mobilization/",
      "/admin/knowledge-mobilization/curriculum/",
    ],
  },
] as const;

function resolveGroupItems(
  hrefs: readonly QuickLink["href"][],
  search: string,
): QuickLink[] {
  const q = search.trim().toLowerCase();
  const matches = (item: QuickLink) => {
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q)
    );
  };
  return hrefs
    .map((h) => QUICK_LINKS.find((link) => link.href === h))
    .filter((x): x is QuickLink => x != null)
    .filter(matches);
}

export default function AdminDashboardOverview() {
  const router = useRouter();
  const {
    ready: profileReady,
    userId,
    email,
    name,
    role,
    hasProfileRow,
    profileCreatedAt,
    profileUpdatedAt,
    authCreatedAt,
    lastSignInAt,
    refresh,
  } = useAuthProfile();

  const [sessionChecked, setSessionChecked] = useState(false);
  const [profileRefreshing, setProfileRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!alive) return;
        if (!user) {
          router.replace("/login/?next=/admin/");
          return;
        }
      } catch {
        if (alive) router.replace("/login/?next=/admin/");
      } finally {
        if (alive) setSessionChecked(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  const showSuper = profileReady && canManageUsers(role);
  const displayName =
    name?.trim() ||
    (email ? email.split("@")[0] : null) ||
    "Member";

  const groupedForDisplay = useMemo(() => {
    return LINK_GROUPS.map((g) => ({
      title: g.title,
      subtitle: g.subtitle,
      items: resolveGroupItems(g.hrefs, search),
    })).filter((g) => g.items.length > 0);
  }, [search]);

  const superCardVisible =
    showSuper &&
    (() => {
      const s = search.trim().toLowerCase();
      if (!s) return true;
      return (
        s.includes("user") ||
        s.includes("role") ||
        s.includes("super") ||
        s.includes("platform") ||
        s.includes("account")
      );
    })();

  async function reloadProfile() {
    setProfileRefreshing(true);
    try {
      await refresh();
    } finally {
      setProfileRefreshing(false);
    }
  }

  if (!sessionChecked || !profileReady) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-16 text-center">
        <Loader2
          className="h-8 w-8 animate-spin text-brand"
          aria-hidden
        />
        <div>
          <p className="text-sm font-medium text-foreground">Loading dashboard</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Checking your session and profile…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-4">
      <header className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm ring-1 ring-black/[0.03]">
        <div
          className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-cognition/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-consciousness/12 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/3 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-care/10 blur-3xl"
          aria-hidden
        />

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand/20 bg-linear-to-br from-brand/15 to-brand/5 text-brand shadow-inner">
              <LayoutDashboard className="h-7 w-7" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Content admin
              </p>
              <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-[2rem] lg:leading-tight">
                <span className="text-muted-foreground">Welcome back, </span>
                <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                  {displayName}
                </span>
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full border border-border bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground shadow-sm ${roleBadgeClassName(role)}`}
                >
                  {roleLabel(role)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Signed in as{" "}
                  <span className="font-medium text-foreground/90">
                    {email ?? "—"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground lg:max-w-xs lg:text-right">
            Edit public pages, team profiles, and programs from here. Each area
            saves independently—remember to save before leaving an editor.
          </p>
        </div>
      </header>

      <section aria-labelledby="cms-areas-heading" className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="cms-areas-heading"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
            >
              CMS areas
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Jump to a section or search by name.
            </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search editors…"
              className="h-10 w-full rounded-xl border border-border/80 bg-background pl-9 pr-9 text-sm text-foreground shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-brand/40 focus:ring-2 focus:ring-brand/20"
              aria-label="Filter CMS areas"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            ) : null}
          </div>
        </div>

        {groupedForDisplay.length === 0 && !superCardVisible ? (
          <p className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
            No editors match &ldquo;{search.trim()}&rdquo;. Try another keyword
            or{" "}
            <button
              type="button"
              onClick={() => setSearch("")}
              className="font-medium text-brand underline-offset-2 hover:underline"
            >
              clear the filter
            </button>
            .
          </p>
        ) : null}

        <div className="space-y-10">
          {groupedForDisplay.map((group) => (
            <div key={group.title}>
              <div className="mb-4 border-b border-border/50 pb-3">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  {group.title}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {group.subtitle}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {group.items.map(({ href, title, desc, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group relative flex flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-sm ring-1 ring-black/[0.02] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md hover:shadow-brand/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-brand/12 to-brand/5 text-brand ring-1 ring-brand/10 transition-colors group-hover:from-brand/18 group-hover:to-brand/8">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <ChevronRight
                        className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand/80"
                        aria-hidden
                      />
                    </div>
                    <h4 className="font-semibold text-foreground group-hover:text-brand">
                      {title}
                    </h4>
                    <p className="mt-1.5 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {desc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {superCardVisible ? (
            <div>
              <div className="mb-4 border-b border-border/50 pb-3">
                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  Platform
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Superuser tools for accounts and roles.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Link
                  href="/admin/users/"
                  className="group relative flex flex-col rounded-2xl border border-violet-500/25 bg-linear-to-br from-violet-500/[0.06] to-transparent p-5 shadow-sm ring-1 ring-violet-500/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-500/40 hover:shadow-md hover:shadow-violet-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/35"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/12 text-violet-700 ring-1 ring-violet-500/15 dark:text-violet-300">
                      <ShieldUser className="h-5 w-5" aria-hidden />
                    </div>
                    <ChevronRight
                      className="mt-1 h-4 w-4 shrink-0 text-violet-600/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-violet-600 dark:text-violet-400/50 dark:group-hover:text-violet-300"
                      aria-hidden
                    />
                  </div>
                  <h4 className="font-semibold text-foreground group-hover:text-violet-700 dark:group-hover:text-violet-300">
                    Users &amp; roles
                  </h4>
                  <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                    Open the full account table, set admin or member, and audit
                    who can access the CMS.
                  </p>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-border/60 bg-card/80 p-1 shadow-sm ring-1 ring-black/[0.02]">
            <div className="rounded-[1.35rem] bg-muted/15 px-4 py-5 sm:px-6 sm:py-6">
              <AccountDetailsSection
                email={email}
                name={name}
                userId={userId}
                role={role}
                hasProfileRow={hasProfileRow}
                profileCreatedAt={profileCreatedAt}
                profileUpdatedAt={profileUpdatedAt}
                authCreatedAt={authCreatedAt}
                lastSignInAt={lastSignInAt}
                profileRefreshing={profileRefreshing}
                onReloadProfile={() => void reloadProfile()}
              />
            </div>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border border-border/60 bg-linear-to-b from-card to-muted/20 p-6 shadow-sm ring-1 ring-black/[0.02]">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Lightbulb className="h-4 w-4" aria-hidden />
              </div>
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Quick tips
              </h2>
            </div>
            <ul className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <li className="flex gap-3">
                <Sparkles
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand/70"
                  aria-hidden
                />
                <span>
                  Each editor saves on its own—use{" "}
                  <strong className="font-medium text-foreground/90">Save</strong>{" "}
                  in that page before you leave.
                </span>
              </li>
              <li className="flex gap-3">
                <Sparkles
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand/70"
                  aria-hidden
                />
                <span>
                  Team photos can come from storage or legacy files in{" "}
                  <code className="rounded-md border border-border/80 bg-background px-1.5 py-0.5 font-mono text-[11px] text-foreground/90">
                    public/images/team/
                  </code>
                  .
                </span>
              </li>
              {showSuper ? (
                <li className="flex gap-3">
                  <ShieldUser
                    className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400"
                    aria-hidden
                  />
                  <span>
                    Use{" "}
                    <Link
                      href="/admin/users/"
                      className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
                    >
                      Users &amp; roles
                    </Link>{" "}
                    for the full table and role dropdowns.
                  </span>
                </li>
              ) : null}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
