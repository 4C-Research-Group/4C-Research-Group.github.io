"use client";

import { useEffect, useState, Suspense, type ComponentType } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  LogOut,
  LayoutDashboard,
  Shield,
  User,
  Mail,
  KeyRound,
  Calendar,
  Clock,
  Users,
  FileText,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import SuperuserUsersTable from "@/components/admin/SuperuserUsersTable";
import {
  canAccessAdmin,
  canManageUsers,
  type AppRole,
} from "@/lib/auth/roles";

function formatDt(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function roleBadgeClass(r: AppRole): string {
  if (r === "superuser") return "border-double border-2 font-bold";
  if (r === "admin") return "border font-semibold";
  return "border";
}

function roleLabel(r: AppRole): string {
  if (r === "superuser") return "Superuser";
  if (r === "admin") return "Administrator";
  return "Member";
}

function DashboardInner() {
  const router = useRouter();
  const params = useSearchParams();
  const msg = params.get("message");
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
          router.replace("/login/");
          return;
        }
      } catch {
        if (alive) router.replace("/login/");
      } finally {
        if (alive) setSessionChecked(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  const showAdmin = profileReady && canAccessAdmin(role);
  const showSuper = profileReady && canManageUsers(role);
  const displayName =
    name?.trim() ||
    (email ? email.split("@")[0] : null) ||
    "Member";

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

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
      <div className="flex min-h-[50vh] items-center justify-center gap-2 bg-white text-neutral-600">
        <Loader2 className="h-5 w-5 animate-spin text-neutral-900" />
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-white text-neutral-950 antialiased">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8 lg:max-w-7xl">
        <div className="border border-neutral-300 bg-white">
          <div className="flex flex-col gap-4 border-b border-neutral-300 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-neutral-400 bg-white text-neutral-900">
                <LayoutDashboard className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
                  Signed in as
                </p>
                <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
                  {displayName}
                </h1>
                <span
                  className={`mt-1.5 inline-flex border border-neutral-900 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-900 ${roleBadgeClass(role)}`}
                >
                  {roleLabel(role)}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              {showAdmin && (
                <Link
                  href="/admin/"
                  className="inline-flex items-center gap-2 border border-neutral-900 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-950 hover:text-white"
                >
                  <Shield className="h-4 w-4" aria-hidden />
                  Admin
                </Link>
              )}
              <button
                type="button"
                onClick={() => void signOut()}
                className="inline-flex items-center gap-2 border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:border-neutral-900"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-neutral-950 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
              >
                Site
              </Link>
            </div>
          </div>

          {msg === "no-admin" && (
            <p className="border-b border-neutral-300 bg-neutral-100 px-5 py-3 text-sm text-neutral-900 sm:px-8">
              That area is only for administrators. Your account is a standard
              member account.
            </p>
          )}

          {!hasProfileRow && userId && (
            <div className="border-b border-neutral-300 bg-amber-50 px-5 py-3 text-sm text-neutral-900 sm:px-8">
              <p className="font-medium text-neutral-950">
                No profile row in{" "}
                <code className="rounded bg-amber-100/80 px-1">public.users</code>
                . Check Supabase RLS, or create the row in the SQL Editor (use
                your user id):
              </p>
              <code className="mt-2 block break-all rounded border border-amber-200/80 bg-white px-2 py-1.5 text-xs text-neutral-800">
                {userId}
              </code>
            </div>
          )}

          <div className="grid gap-0 lg:grid-cols-12">
            <div className="border-b border-neutral-300 px-5 py-6 sm:px-8 lg:col-span-7 lg:border-b-0 lg:border-r">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Account details
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailCell icon={Mail} label="Email" value={email ?? "—"} />
                <DetailCell
                  icon={User}
                  label="Profile name"
                  value={name?.trim() || "—"}
                />
                <DetailCell
                  icon={KeyRound}
                  label="User ID"
                  value={
                    userId
                      ? `${userId.slice(0, 8)}…${userId.slice(-4)}`
                      : "—"
                  }
                  mono
                />
                <DetailCell
                  icon={Shield}
                  label="Permission"
                  value={`${roleLabel(role)} · ${permissionBlurb(role)}`}
                />
                <div className="flex flex-col justify-center gap-2 border border-neutral-200 bg-neutral-50/80 px-3 py-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                  <p className="text-xs leading-snug text-neutral-600">
                    Permission is read from{" "}
                    <code className="rounded bg-white px-1 text-neutral-800">
                      public.users.role
                    </code>
                    . After changing it in Supabase SQL, reload here.
                  </p>
                  <button
                    type="button"
                    disabled={profileRefreshing}
                    onClick={() => void reloadProfile()}
                    className="shrink-0 border border-neutral-900 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 disabled:opacity-50"
                  >
                    {profileRefreshing ? "Loading…" : "Reload profile"}
                  </button>
                </div>
                <DetailCell
                  icon={Calendar}
                  label="Account created"
                  value={formatDt(authCreatedAt)}
                />
                <DetailCell
                  icon={Clock}
                  label="Last sign-in"
                  value={formatDt(lastSignInAt)}
                />
                <DetailCell
                  icon={Calendar}
                  label="Profile created"
                  value={formatDt(profileCreatedAt)}
                />
                <DetailCell
                  icon={Clock}
                  label="Profile updated"
                  value={formatDt(profileUpdatedAt)}
                />
              </div>
            </div>

            <aside className="px-5 py-6 sm:px-8 lg:col-span-5 lg:py-8">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Access &amp; actions
              </h2>
              <ul className="space-y-3 text-sm leading-snug text-neutral-800">
                <li className="flex gap-2">
                  <span className="text-neutral-950">—</span>
                  <span>
                    Browse the public site, publications, and team pages.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-neutral-950">—</span>
                  <span>Review your account on this screen.</span>
                </li>
                {showAdmin && (
                  <>
                    <li className="flex gap-2">
                      <span className="text-neutral-950">—</span>
                      <span>
                        <Link
                          href="/admin/"
                          className="border-b border-neutral-900 font-medium text-neutral-950 hover:border-transparent"
                        >
                          Admin
                        </Link>
                        : page content and team (including alumni).
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-neutral-700">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-neutral-950" />
                      <span>
                        Content → sections; Team → members &amp; photo filenames.
                      </span>
                    </li>
                  </>
                )}
                {showSuper && (
                  <li className="flex items-start gap-2">
                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-neutral-950" />
                    <span>
                      Superuser: manage every account’s role in the{" "}
                      <strong className="font-semibold text-neutral-950">
                        All users
                      </strong>{" "}
                      section below, or in{" "}
                      <Link
                        href="/admin/users/"
                        className="border-b border-neutral-900 font-medium hover:border-transparent"
                      >
                        Admin → Users
                      </Link>
                      .
                    </span>
                  </li>
                )}
              </ul>
            </aside>
          </div>

          {showSuper && (
            <section
              className="border-t border-neutral-300 px-5 py-8 sm:px-8"
              aria-labelledby="dashboard-users-heading"
            >
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2
                    id="dashboard-users-heading"
                    className="text-xs font-semibold uppercase tracking-widest text-neutral-500"
                  >
                    All users
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-neutral-600">
                    Full list from{" "}
                    <code className="rounded bg-neutral-100 px-1 text-neutral-800">
                      public.users
                    </code>
                    . Use the role dropdown for each row to set member,
                    administrator, or superuser.
                  </p>
                </div>
                <Link
                  href="/admin/users/"
                  className="shrink-0 text-xs font-medium text-neutral-600 underline-offset-2 hover:text-neutral-950 hover:underline"
                >
                  Admin → Users
                </Link>
              </div>
              <SuperuserUsersTable
                variant="dashboard"
                onRolesChanged={() => void refresh()}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailCell({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="border border-neutral-200 bg-white px-3 py-3 sm:px-4">
      <div className="flex items-center gap-2 text-neutral-500">
        <Icon className="h-3.5 w-3.5 shrink-0 text-neutral-950" aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p
        className={`mt-1.5 break-words text-sm text-neutral-950 ${mono ? "font-mono text-[12px]" : "font-medium"}`}
      >
        {value}
      </p>
    </div>
  );
}

function permissionBlurb(r: AppRole): string {
  if (r === "superuser") return "CMS, team, user roles";
  if (r === "admin") return "content & team only";
  return "public site";
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center gap-2 bg-white text-neutral-600">
          <Loader2 className="h-5 w-5 animate-spin text-neutral-900" />
          <span className="text-sm">Loading…</span>
        </div>
      }
    >
      <DashboardInner />
    </Suspense>
  );
}
