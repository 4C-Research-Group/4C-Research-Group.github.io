"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AppRole } from "@/lib/auth/roles";

type UserRow = {
  id: string;
  email: string | null;
  name: string | null;
  role: string | null;
};

const ROLES: AppRole[] = ["user", "admin", "superuser"];

export type SuperuserUsersTableProps = {
  variant?: "admin" | "dashboard";
  /** Called after a role update succeeds (e.g. refresh session profile on dashboard). */
  onRolesChanged?: () => void | Promise<void>;
};

export default function SuperuserUsersTable({
  variant = "admin",
  onRolesChanged,
}: SuperuserUsersTableProps) {
  const [rows, setRows] = useState<UserRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: rpcRows, error: rpcErr } =
        await supabase.rpc("admin_list_app_users");
      if (!rpcErr && rpcRows != null) {
        setRows(rpcRows as UserRow[]);
        return;
      }
      if (rpcErr) {
        console.warn(
          "[users] admin_list_app_users unavailable, using table query:",
          rpcErr.message
        );
      }
      const { data, error } = await supabase
        .from("users")
        .select("id,email,name,role")
        .order("email", { ascending: true });
      if (error) throw new Error(error.message);
      setRows((data as UserRow[]) ?? []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load users");
      setRows([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function setRole(id: string, role: AppRole) {
    setBusyId(id);
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("users")
        .update({ role, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw new Error(error.message);
      await load();
      await onRolesChanged?.();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  const wrap =
    variant === "dashboard"
      ? "overflow-x-auto border border-neutral-300 bg-white"
      : "overflow-x-auto rounded-2xl border border-border bg-card shadow-sm";
  const thead =
    variant === "dashboard"
      ? "border-b border-neutral-300 bg-neutral-100 text-xs font-medium uppercase tracking-wide text-neutral-600"
      : "border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground";
  const rowBorder =
    variant === "dashboard"
      ? "border-b border-neutral-200 last:border-0"
      : "border-b border-border/80 last:border-0";
  const tdEmail =
    variant === "dashboard" ? "text-neutral-950" : "text-foreground";
  const tdName =
    variant === "dashboard" ? "text-neutral-600" : "text-muted-foreground";
  const selectClass =
    variant === "dashboard"
      ? "w-full max-w-[11rem] border border-neutral-400 bg-white px-2 py-1.5 text-sm text-neutral-900"
      : "w-full max-w-[11rem] rounded-lg border border-input bg-background px-2 py-1.5 text-sm";
  const errBox =
    variant === "dashboard"
      ? "rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900"
      : "rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive";
  const loadingText =
    variant === "dashboard" ? "text-neutral-600" : "text-muted-foreground";

  if (rows === null) {
    return (
      <div className={`flex items-center gap-2 ${loadingText}`}>
        <Loader2
          className={`h-5 w-5 animate-spin ${variant === "dashboard" ? "text-neutral-900" : "text-brand"}`}
        />
        Loading users…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {err && <div className={errBox}>{err}</div>}
      <div className={wrap}>
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className={thead}>
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className={rowBorder}>
                <td className={`px-4 py-3 ${tdEmail}`}>{u.email ?? "—"}</td>
                <td className={`px-4 py-3 ${tdName}`}>{u.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <select
                    className={selectClass}
                    value={(u.role as AppRole) || "user"}
                    disabled={busyId === u.id}
                    onChange={(e) =>
                      void setRole(u.id, e.target.value as AppRole)
                    }
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
