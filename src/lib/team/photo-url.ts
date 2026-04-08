import {
  findStaticTeamMemberBySlug,
  resolveCanonicalTeamSlug,
} from "@/data/team";
import { siteAsset } from "@/lib/site-path";

/**
 * `photo_file` may be:
 * - empty → no image
 * - full URL (Supabase Storage or other https) → use as-is
 * - legacy filename (e.g. team-2.jpg) → served from `public/team/` (with `basePath` via `siteAsset`)
 */
export function resolveTeamMemberPhotoUrl(
  photoFile: string | null | undefined,
): string {
  const raw = (photoFile ?? "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const path = raw.replace(/^\/+/, "");
  return siteAsset(`/team/${path}`);
}

/**
 * Same headshot rules for list + portfolio: use DB `photo_file` when set (filename or
 * https from admin upload); otherwise fall back to static seed in `team.ts`.
 */
export function resolveTeamMemberDisplayPhotoUrl(
  photoFileFromDb: string | null | undefined,
  memberSlug: string,
): string {
  const db = (photoFileFromDb ?? "").trim();
  const canonical = resolveCanonicalTeamSlug(memberSlug);
  if (/^https?:\/\//i.test(db)) {
    return resolveTeamMemberPhotoUrl(db);
  }
  const stat = findStaticTeamMemberBySlug(canonical);
  const seed = stat?.photoFile?.trim() ?? "";
  const file = db || seed;
  return resolveTeamMemberPhotoUrl(file);
}
