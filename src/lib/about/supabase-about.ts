import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  ABOUT_DEFAULTS,
  mergeAboutPayload,
  type AboutPayload,
} from "@/data/about-defaults";

export const ABOUT_ROW_ID = "default";

export async function fetchAboutContent(): Promise<AboutPayload> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("about_page_settings")
      .select("payload")
      .eq("id", ABOUT_ROW_ID)
      .maybeSingle();
    if (error) {
      console.warn("[about]", error.message);
      return mergeAboutPayload(null);
    }
    return mergeAboutPayload(data?.payload ?? null);
  } catch {
    return mergeAboutPayload(null);
  }
}

export async function fetchAboutRowForAdmin(): Promise<{
  payload: AboutPayload;
  updatedAt: string | null;
}> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("about_page_settings")
    .select("payload,updated_at")
    .eq("id", ABOUT_ROW_ID)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const merged = mergeAboutPayload(data?.payload ?? null);
  return {
    payload: merged,
    updatedAt: data?.updated_at ?? null,
  };
}

export async function saveAboutPayload(payload: AboutPayload): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const now = new Date().toISOString();
  const { error } = await supabase.from("about_page_settings").upsert(
    {
      id: ABOUT_ROW_ID,
      payload,
      updated_at: now,
    },
    { onConflict: "id" },
  );
  if (error) throw new Error(error.message);
}

export function getAboutDefaultsForAdmin(): AboutPayload {
  return structuredClone(ABOUT_DEFAULTS);
}
