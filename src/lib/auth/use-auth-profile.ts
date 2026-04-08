"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { normalizeRole, type AppRole } from "./roles";

async function ensureProfileRow(
  supabase: ReturnType<typeof getSupabaseBrowserClient>,
  user: { id: string; email?: string | null }
): Promise<void> {
  const now = new Date().toISOString();
  const { error } = await supabase.from("users").insert({
    id: user.id,
    email: user.email ?? null,
    name: (user.email ?? "").split("@")[0] || null,
    role: "user",
    created_at: now,
    updated_at: now,
  });
  if (error && error.code !== "23505") {
    console.warn("[auth] ensureProfileRow insert:", error.code, error.message);
  }
}

export function useAuthProfile() {
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<AppRole>("user");
  const [name, setName] = useState<string | null>(null);
  const [hasProfileRow, setHasProfileRow] = useState(false);
  const [profileCreatedAt, setProfileCreatedAt] = useState<string | null>(
    null
  );
  const [profileUpdatedAt, setProfileUpdatedAt] = useState<string | null>(
    null
  );
  const [authCreatedAt, setAuthCreatedAt] = useState<string | null>(null);
  const [lastSignInAt, setLastSignInAt] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setUserId(null);
        setEmail(null);
        setName(null);
        setRole("user");
        setHasProfileRow(false);
        setProfileCreatedAt(null);
        setProfileUpdatedAt(null);
        setAuthCreatedAt(null);
        setLastSignInAt(null);
        return;
      }
      setUserId(user.id);
      setEmail(user.email ?? null);
      setAuthCreatedAt(user.created_at ?? null);
      setLastSignInAt(user.last_sign_in_at ?? null);
      let { data: row, error: rowErr } = await supabase
        .from("users")
        .select("role, name, created_at, updated_at")
        .eq("id", user.id)
        .maybeSingle();
      if (rowErr) {
        console.warn("[auth] users select:", rowErr.message);
      }
      if (!row) {
        await ensureProfileRow(supabase, user);
        const again = await supabase
          .from("users")
          .select("role, name, created_at, updated_at")
          .eq("id", user.id)
          .maybeSingle();
        row = again.data;
      }
      setHasProfileRow(!!row);
      setRole(normalizeRole(row?.role as string | null | undefined));
      setName((row?.name as string | null | undefined) ?? null);
      setProfileCreatedAt((row?.created_at as string | null | undefined) ?? null);
      setProfileUpdatedAt((row?.updated_at as string | null | undefined) ?? null);
    } catch {
      setUserId(null);
      setEmail(null);
      setName(null);
      setRole("user");
      setHasProfileRow(false);
      setProfileCreatedAt(null);
      setProfileUpdatedAt(null);
      setAuthCreatedAt(null);
      setLastSignInAt(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    let sub: { unsubscribe: () => void } | null = null;
    void (async () => {
      await refresh();
      try {
        const supabase = getSupabaseBrowserClient();
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
          void refresh();
        });
        sub = subscription;
      } catch {
        /* no supabase env */
      }
    })();
    return () => sub?.unsubscribe();
  }, [refresh]);

  return {
    ready,
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
  };
}
