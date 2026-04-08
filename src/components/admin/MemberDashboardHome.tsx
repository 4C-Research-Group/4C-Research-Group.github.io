"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Loader2,
  LogOut,
  Shield,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import {
  AccountDetailsSection,
  roleBadgeClassName,
  roleLabel,
} from "@/components/admin/account-details";

function MemberDashboardInner() {
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
      <div className="flex min-h-[50vh] items-center justify-center gap-2 bg-background text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-muted/15">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border/70 bg-linear-to-br from-card to-muted/20 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-brand">
                <LayoutDashboard className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Your account
                </p>
                <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {displayName}
                </h1>
                <span
                  className={`mt-1.5 inline-flex rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground ${roleBadgeClassName(role)}`}
                >
                  {roleLabel(role)}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => void signOut()}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-brand-deep"
              >
                Site
              </Link>
            </div>
          </div>

          {msg === "no-admin" && (
            <div className="flex gap-3 border-b border-border/70 bg-muted/40 px-5 py-3 text-sm text-foreground sm:px-8">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <p>
                That area is only for administrators. Your account is a
                standard member account. If you need CMS access, ask a
                superuser to grant the admin role.
              </p>
            </div>
          )}

          <div className="p-5 sm:p-8">
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
    </div>
  );
}

export default function MemberDashboardHome() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center gap-2 bg-background text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-brand" />
          <span className="text-sm">Loading…</span>
        </div>
      }
    >
      <MemberDashboardInner />
    </Suspense>
  );
}
