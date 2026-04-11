import type { KmPagePayload } from "@/data/km-page";
import { mergeKmPagePayload } from "@/data/km-page-defaults";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/database.types";

export const KM_PAGE_ROW_ID = "default";

export async function fetchKmPageContent(): Promise<KmPagePayload> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("km_page_settings")
      .select("payload")
      .eq("id", KM_PAGE_ROW_ID)
      .maybeSingle();
    if (error) {
      console.warn("[km page]", error.message);
      return mergeKmPagePayload(null);
    }
    return mergeKmPagePayload(data?.payload ?? null);
  } catch {
    return mergeKmPagePayload(null);
  }
}

export async function fetchKmPageRowForAdmin(): Promise<{
  payload: KmPagePayload;
  updatedAt: string | null;
}> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("km_page_settings")
    .select("payload,updated_at")
    .eq("id", KM_PAGE_ROW_ID)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const merged = mergeKmPagePayload(data?.payload ?? null);
  return { payload: merged, updatedAt: data?.updated_at ?? null };
}

export async function saveKmPagePayload(payload: KmPagePayload): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const now = new Date().toISOString();
  const jsonPayload = JSON.parse(JSON.stringify(payload)) as Json;
  const { error } = await supabase.from("km_page_settings").upsert(
    {
      id: KM_PAGE_ROW_ID,
      payload: jsonPayload,
      updated_at: now,
    },
    { onConflict: "id" },
  );
  if (error) throw new Error(error.message);
}

export function getKmPageDefaultsForAdmin(): KmPagePayload {
  return structuredClone(mergeKmPagePayload(null)) as KmPagePayload;
}
