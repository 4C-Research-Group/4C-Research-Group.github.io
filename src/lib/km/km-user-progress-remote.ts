import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/database.types";
import {
  emptyKmProgressPayload,
  parseKmProgressPayload,
  type KmProgressPayload,
} from "@/lib/km/km-progress-merge";

export async function fetchKmUserProgress(
  userId: string,
): Promise<KmProgressPayload | null> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("km_user_progress")
      .select("payload")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      console.warn("[km progress]", error.message);
      return null;
    }
    if (!data?.payload) return null;
    return parseKmProgressPayload(data.payload);
  } catch {
    return null;
  }
}

export async function upsertKmUserProgress(
  userId: string,
  payload: KmProgressPayload,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const supabase = getSupabaseBrowserClient();
    const row = {
      user_id: userId,
      payload: {
        version: 1,
        modules: payload.modules,
        ...(payload.certificateDisplayName?.trim()
          ? { certificateDisplayName: payload.certificateDisplayName.trim() }
          : {}),
        ...(payload.learnerProfile?.email
          ? { learnerProfile: payload.learnerProfile }
          : {}),
      } as unknown as Json,
    };
    const { error } = await supabase.from("km_user_progress").upsert(row, {
      onConflict: "user_id",
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Sync failed",
    };
  }
}

export async function clearKmUserProgressRemote(
  userId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  return upsertKmUserProgress(userId, emptyKmProgressPayload());
}
