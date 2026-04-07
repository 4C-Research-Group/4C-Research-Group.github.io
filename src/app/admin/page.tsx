"use client";

import Link from "next/link";
import { Users, FileText, ShieldUser, LayoutDashboard } from "lucide-react";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import { canManageUsers } from "@/lib/auth/roles";

const cards = [
  {
    href: "/admin/team/",
    title: "Team",
    desc: "Add, remove, edit members; mark alumni; reorder.",
    icon: Users,
  },
  {
    href: "/admin/content/",
    title: "Page content",
    desc: "Edit text sections per page (hero blurbs, snippets).",
    icon: FileText,
  },
] as const;

export default function AdminHomePage() {
  const { role } = useAuthProfile();
  const superOk = canManageUsers(role);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage published content and team listings on the public site.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map(({ href, title, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-shadow hover:border-brand/25 hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="font-semibold text-foreground group-hover:text-brand">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
          </Link>
        ))}

        {superOk && (
          <Link
            href="/admin/users/"
            className="group rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-shadow hover:border-violet-500/25 hover:shadow-md"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <ShieldUser className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="font-semibold text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400">
              Users & roles
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Superuser only: set admins or return accounts to user.
            </p>
          </Link>
        )}

        <Link
          href="/dashboard/"
          className="group rounded-2xl border border-dashed border-border bg-background/50 p-6 transition-colors hover:border-foreground/20"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <h2 className="font-semibold text-foreground">Account</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Back to your personal dashboard.
          </p>
        </Link>
      </div>
    </div>
  );
}
