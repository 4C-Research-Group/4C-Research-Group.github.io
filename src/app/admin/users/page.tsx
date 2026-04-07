"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import SuperuserGate from "@/components/admin/SuperuserGate";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AppRole } from "@/lib/auth/roles";

type UserRow = {
  id: string;
  email: string | null;
  name: string | null;
  role: string | null;
};

const ROLES: AppRole[] = ["user", "admin", "superuser"];

export default function AdminUsersPage() {
  return (
    <SuperuserGate>
      <UsersTable />
    </SuperuserGate>
  );
}

function UsersTable() {
  const [rows, setRows] = useState<UserRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const supabase = getSupabaseBrowserClient();
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users & roles</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Superuser only. Admins can edit the site; only one superuser tier
          should assign admins.
        </p>
      </div>
      {err && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {err}
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-b border-border/80 last:border-0">
                <td className="px-4 py-3 text-foreground">{u.email ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {u.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <select
                    className="w-full max-w-[11rem] rounded-lg border border-input bg-background px-2 py-1.5 text-sm"
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
