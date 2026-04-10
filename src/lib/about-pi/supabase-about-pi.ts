import type { AboutPiPagePayload } from "@/data/about-pi";
import {
  ABOUT_PI_DEFAULTS,
  mergeAboutPiPayload,
} from "@/data/about-pi-defaults";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/database.types";

export const ABOUT_PI_ROW_ID = "default";

export async function fetchAboutPiContent(): Promise<AboutPiPagePayload> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("about_pi_page_settings")
      .select("payload")
      .eq("id", ABOUT_PI_ROW_ID)
      .maybeSingle();
    if (error) {
      console.warn("[about-pi]", error.message);
      return mergeAboutPiPayload(null);
    }
    return mergeAboutPiPayload(data?.payload ?? null);
  } catch {
    return mergeAboutPiPayload(null);
  }
}

export async function fetchAboutPiRowForAdmin(): Promise<{
  payload: AboutPiPagePayload;
  updatedAt: string | null;
}> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("about_pi_page_settings")
    .select("payload,updated_at")
    .eq("id", ABOUT_PI_ROW_ID)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const merged = mergeAboutPiPayload(data?.payload ?? null);
  return {
    payload: merged,
    updatedAt: data?.updated_at ?? null,
  };
}

export async function saveAboutPiPayload(
  payload: AboutPiPagePayload,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const now = new Date().toISOString();
  const jsonPayload = JSON.parse(JSON.stringify(payload)) as Json;
  const { error } = await supabase.from("about_pi_page_settings").upsert(
    {
      id: ABOUT_PI_ROW_ID,
      payload: jsonPayload,
      updated_at: now,
    },
    { onConflict: "id" },
  );
  if (error) throw new Error(error.message);
}

export function getAboutPiDefaultsForAdmin(): AboutPiPagePayload {
  return structuredClone(ABOUT_PI_DEFAULTS);
}
