import { SITE_BASE_PATH } from "@/lib/site-path";

/**
 * `photo_file` may be:
 * - empty → no image
 * - full URL (Supabase Storage or other https) → use as-is
 * - legacy filename (e.g. team-2.jpg) → served from `public/team/` under site base path
 */
export function resolveTeamMemberPhotoUrl(
  photoFile: string | null | undefined
): string {
  const raw = (photoFile ?? "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const path = raw.replace(/^\/+/, "");
  return `${SITE_BASE_PATH}/team/${path}`;
}
