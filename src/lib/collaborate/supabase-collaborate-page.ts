import type { CollaboratePagePayload } from "@/data/collaborate-page";
import { mergeCollaboratePayload } from "@/data/collaborate-defaults";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/database.types";

export const COLLABORATE_ROW_ID = "default";

export async function fetchCollaborateContent(): Promise<CollaboratePagePayload> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("collaborate_page_settings")
      .select("payload")
      .eq("id", COLLABORATE_ROW_ID)
      .maybeSingle();
    if (error) {
      console.warn("[collaborate]", error.message);
      return mergeCollaboratePayload(null);
    }
    return mergeCollaboratePayload(data?.payload ?? null);
  } catch {
    return mergeCollaboratePayload(null);
  }
}

export async function fetchCollaborateRowForAdmin(): Promise<{
  payload: CollaboratePagePayload;
  updatedAt: string | null;
}> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("collaborate_page_settings")
    .select("payload,updated_at")
    .eq("id", COLLABORATE_ROW_ID)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const merged = mergeCollaboratePayload(data?.payload ?? null);
  return {
    payload: merged,
    updatedAt: data?.updated_at ?? null,
  };
}

export async function saveCollaboratePayload(
  payload: CollaboratePagePayload,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const now = new Date().toISOString();
  const jsonPayload = JSON.parse(JSON.stringify(payload)) as Json;
  const { error } = await supabase.from("collaborate_page_settings").upsert(
    {
      id: COLLABORATE_ROW_ID,
      payload: jsonPayload,
      updated_at: now,
    },
    { onConflict: "id" },
  );
  if (error) throw new Error(error.message);
}

export function getCollaborateDefaultsForAdmin(): CollaboratePagePayload {
  return structuredClone(
    mergeCollaboratePayload(null),
  ) as CollaboratePagePayload;
}
