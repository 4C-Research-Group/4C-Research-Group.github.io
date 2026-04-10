import type { Join4cLabPagePayload } from "@/data/join-4c-lab-page";
import { mergeJoin4cLabPayload } from "@/data/join-4c-lab-defaults";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Json } from "@/lib/supabase/database.types";

export const JOIN_4C_LAB_ROW_ID = "default";

export async function fetchJoin4cLabContent(): Promise<Join4cLabPagePayload> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("join_4c_lab_page_settings")
      .select("payload")
      .eq("id", JOIN_4C_LAB_ROW_ID)
      .maybeSingle();
    if (error) {
      console.warn("[join-4c-lab]", error.message);
      return mergeJoin4cLabPayload(null);
    }
    return mergeJoin4cLabPayload(data?.payload ?? null);
  } catch {
    return mergeJoin4cLabPayload(null);
  }
}

export async function fetchJoin4cLabRowForAdmin(): Promise<{
  payload: Join4cLabPagePayload;
  updatedAt: string | null;
}> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("join_4c_lab_page_settings")
    .select("payload,updated_at")
    .eq("id", JOIN_4C_LAB_ROW_ID)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const merged = mergeJoin4cLabPayload(data?.payload ?? null);
  return {
    payload: merged,
    updatedAt: data?.updated_at ?? null,
  };
}

export async function saveJoin4cLabPayload(
  payload: Join4cLabPagePayload,
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const now = new Date().toISOString();
  const jsonPayload = JSON.parse(JSON.stringify(payload)) as Json;
  const { error } = await supabase.from("join_4c_lab_page_settings").upsert(
    {
      id: JOIN_4C_LAB_ROW_ID,
      payload: jsonPayload,
      updated_at: now,
    },
    { onConflict: "id" },
  );
  if (error) throw new Error(error.message);
}

export function getJoin4cLabDefaultsForAdmin(): Join4cLabPagePayload {
  return structuredClone(
    mergeJoin4cLabPayload(null),
  ) as Join4cLabPagePayload;
}
