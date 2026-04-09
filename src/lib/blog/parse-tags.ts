import type { Json } from "@/lib/supabase/database.types";

export function tagsFromJson(raw: Json | null | undefined): string[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw.filter((t): t is string => typeof t === "string");
  }
  return [];
}

export function tagsToJson(tags: string[]): Json {
  return tags;
}
