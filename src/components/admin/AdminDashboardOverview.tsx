"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  Loader2,
  ShieldUser,
  Sparkles,
  Users,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import SuperuserUsersTable from "@/components/admin/SuperuserUsersTable";
import {
  AccountDetailsSection,
  roleBadgeClassName,
  roleLabel,
} from "@/components/admin/account-details";
import { canManageUsers } from "@/lib/auth/roles";

const QUICK_LINKS = [
  {
    href: "/admin/team/",
    title: "Team",
    desc: "Roster, alumni, photos, sort order.",
    icon: Users,
  },
  {
    href: "/admin/content/",
    title: "Page content",
    desc: "Hero text and snippets per page.",
    icon: FileText,
  },
] as const;

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
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="relative overflow-hidden rounded-2xl border border-border/70 bg-linear-to-br from-card via-card to-brand/5 px-5 py-6 sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10 text-brand">
              <LayoutDashboard className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Signed in as
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {displayName}
              </h1>
              <span
                className={`mt-2 inline-flex rounded-full border border-border bg-background px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground ${roleBadgeClassName(role)}`}
              >
                {roleLabel(role)}
              </span>
            </div>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-right">
            Manage published content and the public team page from one place.
          </p>
        </div>
      </header>

      <section aria-labelledby="quick-actions-heading">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2
              id="quick-actions-heading"
              className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Quick actions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Jump to common CMS tasks
            </p>
          </div>
          <Sparkles className="hidden h-5 w-5 text-brand/40 sm:block" aria-hidden />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map(({ href, title, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-brand/30 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand/15">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-brand">
                {title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
          {showSuper ? (
            <Link
              href="/admin/users/"
              className="group rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-violet-500/35 hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                <ShieldUser className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400">
                Users &amp; roles
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Superuser: set admin or member on every account.
              </p>
            </Link>
          ) : null}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-6 lg:col-span-7">
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

        <aside className="rounded-2xl border border-border/70 bg-card/40 p-5 lg:col-span-5 lg:p-6">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Tips
          </h2>
          <ul className="space-y-3 text-sm leading-snug text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-brand">·</span>
              <span>
                Changes to team or content go live after you save in each
                editor.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand">·</span>
              <span>
                Team photos can be uploaded to storage or use legacy files in{" "}
                <code className="rounded bg-muted px-1 text-xs text-foreground/90">
                  public/team/
                </code>
                .
              </span>
            </li>
            {showSuper ? (
              <li className="flex gap-2">
                <span className="text-violet-500">·</span>
                <span>
                  Use{" "}
                  <Link
                    href="/admin/users/"
                    className="font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    Users &amp; roles
                  </Link>{" "}
                  for the full account table and role dropdowns.
                </span>
              </li>
            ) : null}
          </ul>
        </aside>
      </div>

      {showSuper ? (
        <section
          className="rounded-2xl border border-border/70 bg-card/30 px-4 py-8 sm:px-6"
          aria-labelledby="admin-all-users-heading"
        >
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="admin-all-users-heading"
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                All users
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                From{" "}
                <code className="rounded bg-muted px-1 text-foreground/90">
                  public.users
                </code>
                . Open the dedicated page for more space:
              </p>
            </div>
            <Link
              href="/admin/users/"
              className="shrink-0 text-xs font-medium text-brand underline-offset-2 hover:underline"
            >
              Users &amp; roles →
            </Link>
          </div>
          <SuperuserUsersTable
            variant="admin"
            onRolesChanged={() => void refresh()}
          />
        </section>
      ) : null}
    </div>
  );
}
