import {
  findStaticTeamMemberBySlug,
  resolveCanonicalTeamSlug,
} from "@/data/team";
import { siteAsset } from "@/lib/site-path";

/**
 * `photo_file` may be:
 * - empty → no image
 * - full URL (Supabase Storage or other https) → use as-is
 * - legacy filename (e.g. team-2.jpg) → `public/images/team/` (URL `/images/team/…`, not `/team/…`, so
 *   it does not collide with the `/team/[slug]` app route)
 */
export function resolveTeamMemberPhotoUrl(
  photoFile: string | null | undefined,
): string {
  const raw = (photoFile ?? "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  let path = raw.replace(/^\/+/, "");
  // Old site stored files under `public/team/` (URL `/team/foo.jpg`), which collided with `/team/[slug]`.
  if (path.startsWith("team/")) path = path.slice("team/".length);
  return siteAsset(`/images/team/${path}`);
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
