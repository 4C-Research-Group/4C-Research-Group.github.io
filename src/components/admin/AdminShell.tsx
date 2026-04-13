"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Handshake,
  House,
  Images,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  Microscope,
  Newspaper,
  ShieldUser,
  UserCircle,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import { canManageUsers } from "@/lib/auth/roles";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  /** Match this path only (no child routes). Use for KM hub vs curriculum. */
  exact?: boolean;
};

const NAV_BASE: NavItem[] = [
  { href: "/admin/", label: "Overview", icon: LayoutDashboard, end: true },
  { href: "/admin/homepage/", label: "Homepage", icon: House },
  { href: "/admin/about/", label: "About page", icon: Info },
  { href: "/admin/about-pi/", label: "About PI", icon: UserCircle },
  { href: "/admin/join-4c-lab/", label: "Join 4C Lab", icon: UserPlus },
  { href: "/admin/collaborate/", label: "Collaborate", icon: Handshake },
  { href: "/admin/team/", label: "Team", icon: Users },
  { href: "/admin/projects/", label: "Projects", icon: FolderKanban },
  { href: "/admin/blog/", label: "Blog", icon: Newspaper },
  { href: "/admin/research/", label: "Research page", icon: Microscope },
  { href: "/admin/gallery/", label: "Gallery", icon: Images },
  {
    href: "/admin/knowledge-mobilization/",
    label: "Knowledge Mobilization",
    icon: GraduationCap,
    exact: true,
  },
  {
    href: "/admin/knowledge-mobilization/curriculum/",
    label: "Curriculum & quizzes",
    icon: BookOpen,
  },
];

function navActive(
  pathname: string,
  href: string,
  end?: boolean,
  exact?: boolean,
) {
  const p = (pathname.replace(/\/+$/, "") || "/") as string;
  if (end) return p === "/admin";
  const h = href.replace(/\/+$/, "") || "/";
  if (exact) return p === h;
  return p === h || p.startsWith(`${h}/`);
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { role } = useAuthProfile();
  const superOk = canManageUsers(role);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  function linkClass(href: string, end?: boolean, exact?: boolean) {
    const active = navActive(pathname, href, end, exact);
    return [
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
      active
        ? "bg-brand/12 text-brand"
        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
    ].join(" ");
  }

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] bg-muted/20 pt-0">
      {/* Mobile + tablet: collapsible nav under global navbar */}
      <div className="sticky top-14 z-30 flex items-center justify-between gap-3 border-b border-border/60 bg-background/90 px-4 py-2.5 backdrop-blur-md lg:hidden">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? (
            <X className="h-4 w-4" aria-hidden />
          ) : (
            <Menu className="h-4 w-4" aria-hidden />
          )}
          Menu
        </button>
        <Link
          href="/"
          className="text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          View site →
        </Link>
      </div>
      {mobileOpen ? (
        <nav className="max-h-[min(70dvh,calc(100dvh-9rem))] space-y-0.5 overflow-y-auto overscroll-contain border-b border-border/60 bg-background px-3 py-3 lg:hidden">
          {NAV_BASE.map(({ href, label, icon: Icon, end, exact }) => (
            <Link
              key={href}
              href={href}
              className={linkClass(href, end, exact)}
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              {label}
            </Link>
          ))}
          {superOk ? (
            <Link
              href="/admin/users/"
              className={linkClass("/admin/users/")}
              onClick={() => setMobileOpen(false)}
            >
              <ShieldUser className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              Users &amp; roles
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden />
            Sign out
          </button>
        </nav>
      ) : null}

      <div className="flex">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 flex-col border-r border-border/60 bg-card/50 lg:flex">
          <div className="shrink-0 border-b border-border/50 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Admin
            </p>
            <p className="mt-0.5 text-sm font-semibold tracking-tight text-foreground">
              Dashboard
            </p>
          </div>
          <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain p-2">
            {NAV_BASE.map(({ href, label, icon: Icon, end, exact }) => (
              <Link
                key={href}
                href={href}
                className={linkClass(href, end, exact)}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                {label}
              </Link>
            ))}
            {superOk ? (
              <Link href="/admin/users/" className={linkClass("/admin/users/")}>
                <ShieldUser className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                Users &amp; roles
              </Link>
            ) : null}
          </nav>
          <div className="shrink-0 space-y-1 border-t border-border/60 bg-card/50 p-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
              View public site
            </Link>
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
