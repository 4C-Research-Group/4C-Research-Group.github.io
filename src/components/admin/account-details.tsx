import type { ComponentType } from "react";
import {
  Calendar,
  Clock,
  KeyRound,
  Mail,
  Shield,
  User,
} from "lucide-react";
import { type AppRole } from "@/lib/auth/roles";

export function formatDetailDt(iso: string | null | undefined): string {
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

export function roleBadgeClassName(r: AppRole): string {
  if (r === "superuser") return "border-double border-2 font-bold";
  if (r === "admin") return "border font-semibold";
  return "border";
}

export function roleLabel(r: AppRole): string {
  if (r === "superuser") return "Superuser";
  if (r === "admin") return "Administrator";
  return "Member";
}

export function permissionBlurb(r: AppRole): string {
  if (r === "superuser") return "CMS, team, user roles";
  if (r === "admin") return "content & team only";
  return "public site";
}

export function DetailCell({
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
    <div className="rounded-xl border border-border/80 bg-card/60 px-3 py-3 sm:px-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-3.5 w-3.5 shrink-0 text-foreground" aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p
        className={`mt-1.5 break-words text-sm text-foreground ${mono ? "font-mono text-[12px]" : "font-medium"}`}
      >
        {value}
      </p>
    </div>
  );
}

export function AccountDetailsSection({
  email,
  name,
  userId,
  role,
  hasProfileRow,
  profileCreatedAt,
  profileUpdatedAt,
  authCreatedAt,
  lastSignInAt,
  profileRefreshing,
  onReloadProfile,
}: {
  email: string | null;
  name: string | null | undefined;
  userId: string | null;
  role: AppRole;
  hasProfileRow: boolean;
  profileCreatedAt: string | null | undefined;
  profileUpdatedAt: string | null | undefined;
  authCreatedAt: string | null | undefined;
  lastSignInAt: string | null | undefined;
  profileRefreshing: boolean;
  onReloadProfile: () => void;
}) {
  return (
    <>
      {!hasProfileRow && userId ? (
        <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-foreground">
          <p className="font-medium">
            No profile row in{" "}
            <code className="rounded bg-background/80 px-1">public.users</code>.
            Check Supabase RLS, or create the row in the SQL Editor (use your
            user id):
          </p>
          <code className="mt-2 block break-all rounded border border-border bg-background px-2 py-1.5 text-xs text-muted-foreground">
            {userId}
          </code>
        </div>
      ) : null}

      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
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
              userId ? `${userId.slice(0, 8)}…${userId.slice(-4)}` : "—"
            }
            mono
          />
          <DetailCell
            icon={Shield}
            label="Permission"
            value={`${roleLabel(role)} · ${permissionBlurb(role)}`}
          />
          <div className="flex flex-col justify-center gap-2 rounded-xl border border-border/80 bg-muted/25 px-3 py-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <p className="text-xs leading-snug text-muted-foreground">
              Permission is read from{" "}
              <code className="rounded bg-background px-1 text-foreground/90">
                public.users.role
              </code>
              . After changing it in Supabase SQL, reload here.
            </p>
            <button
              type="button"
              disabled={profileRefreshing}
              onClick={onReloadProfile}
              className="shrink-0 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              {profileRefreshing ? "Loading…" : "Reload profile"}
            </button>
          </div>
          <DetailCell
            icon={Calendar}
            label="Account created"
            value={formatDetailDt(authCreatedAt)}
          />
          <DetailCell
            icon={Clock}
            label="Last sign-in"
            value={formatDetailDt(lastSignInAt)}
          />
          <DetailCell
            icon={Calendar}
            label="Profile created"
            value={formatDetailDt(profileCreatedAt)}
          />
          <DetailCell
            icon={Clock}
            label="Profile updated"
            value={formatDetailDt(profileUpdatedAt)}
          />
        </div>
      </div>
    </>
  );
}
