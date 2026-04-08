"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { normalizeRole, type AppRole } from "@/lib/auth/roles";

type UserRow = {
  id: string;
  email: string | null;
  name: string | null;
  role: string | null;
};

const ROLES: AppRole[] = ["user", "admin", "superuser"];

export type SuperuserUsersTableProps = {
  /** Called after a role update succeeds (e.g. refresh session profile). */
  onRolesChanged?: () => void | Promise<void>;
};

export default function SuperuserUsersTable({
  onRolesChanged,
}: SuperuserUsersTableProps) {
  const [rows, setRows] = useState<UserRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  /** Pending role edits; omitted key means “matches server after last load”. */
  const [pendingById, setPendingById] = useState<Record<string, AppRole>>({});

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

  function serverRole(u: UserRow): AppRole {
    return normalizeRole(u.role);
  }

  function roleForRow(u: UserRow): AppRole {
    const p = pendingById[u.id];
    if (p !== undefined) return p;
    return serverRole(u);
  }

  function isDirty(u: UserRow): boolean {
    return roleForRow(u) !== serverRole(u);
  }

  function setDraftRole(id: string, next: AppRole, server: AppRole) {
    if (next === server) {
      setPendingById((prev) => {
        if (prev[id] === undefined) return prev;
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    } else {
      setPendingById((prev) => ({ ...prev, [id]: next }));
    }
  }

  function revertRow(id: string) {
    setPendingById((prev) => {
      if (prev[id] === undefined) return prev;
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }

  async function saveRow(u: UserRow) {
    const role = pendingById[u.id];
    if (role === undefined || role === serverRole(u)) return;
    setBusyId(u.id);
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from("users")
        .update({ role, updated_at: new Date().toISOString() })
        .eq("id", u.id);
      if (error) throw new Error(error.message);
      setPendingById((prev) => {
        const { [u.id]: _, ...rest } = prev;
        return rest;
      });
      await load();
      await onRolesChanged?.();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  if (rows === null) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
        Loading users…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {err && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {err}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Choose a role, then <strong className="text-foreground/90">Save</strong>{" "}
        to write it to the database. <strong className="text-foreground/90">Revert</strong>{" "}
        discards unsaved changes for that row.
      </p>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => {
              const dirty = isDirty(u);
              const saving = busyId === u.id;
              return (
                <tr
                  key={u.id}
                  className={`border-b border-border/80 last:border-0 ${dirty ? "bg-amber-500/5" : ""}`}
                >
                  <td className="px-4 py-3 text-foreground">{u.email ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="w-full max-w-[11rem] rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
                      value={roleForRow(u)}
                      disabled={saving}
                      onChange={(e) =>
                        setDraftRole(
                          u.id,
                          e.target.value as AppRole,
                          serverRole(u)
                        )
                      }
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    {dirty ? (
                      <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                        Unsaved
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={!dirty || saving}
                        onClick={() => void saveRow(u)}
                        className="inline-flex items-center gap-1 rounded-lg bg-brand px-2.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-brand-deep disabled:opacity-40"
                      >
                        <Save className="h-3.5 w-3.5" aria-hidden />
                        Save
                      </button>
                      <button
                        type="button"
                        disabled={!dirty || saving}
                        onClick={() => revertRow(u.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted/60 disabled:opacity-40"
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                        Revert
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
