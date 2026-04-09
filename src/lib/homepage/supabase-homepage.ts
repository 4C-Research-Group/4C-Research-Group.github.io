import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  HOMEPAGE_DEFAULTS,
  mergeHomepagePayload,
  type HomepagePayload,
} from "@/data/homepage-defaults";

export const HOMEPAGE_ROW_ID = "default";

/** Merged homepage content for public pages (always succeeds with defaults if DB empty). */
export async function fetchHomepageContent(): Promise<HomepagePayload> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("homepage_settings")
      .select("payload")
      .eq("id", HOMEPAGE_ROW_ID)
      .maybeSingle();
    if (error) {
      console.warn("[homepage]", error.message);
      return mergeHomepagePayload(null);
    }
    return mergeHomepagePayload(data?.payload ?? null);
  } catch {
    return mergeHomepagePayload(null);
  }
}

/** Raw row for admin (null if never saved). */
export async function fetchHomepageRowForAdmin(): Promise<{
  payload: HomepagePayload;
  updatedAt: string | null;
}> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("homepage_settings")
    .select("payload,updated_at")
    .eq("id", HOMEPAGE_ROW_ID)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const merged = mergeHomepagePayload(data?.payload ?? null);
  return {
    payload: merged,
    updatedAt: data?.updated_at ?? null,
  };
}

export async function saveHomepagePayload(payload: HomepagePayload): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const now = new Date().toISOString();
  const { error } = await supabase.from("homepage_settings").upsert(
    {
      id: HOMEPAGE_ROW_ID,
      payload,
      updated_at: now,
    },
    { onConflict: "id" },
  );
  if (error) throw new Error(error.message);
}

/** Reset editor to built-in defaults (does not write DB until Save). */
export function getHomepageDefaultsForAdmin(): HomepagePayload {
  return structuredClone(HOMEPAGE_DEFAULTS);
}
