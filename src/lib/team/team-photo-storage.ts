import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { slugifyTeamMember } from "@/lib/team/slug";

export const TEAM_PHOTOS_BUCKET = "team-photos";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "jpg";
}

export function validateTeamPhotoFile(file: File): string | null {
  if (file.size > MAX_BYTES) {
    return "Image must be 5MB or smaller.";
  }
  if (file.type && !ALLOWED_TYPES.has(file.type)) {
    return "Use JPEG, PNG, WebP, or GIF.";
  }
  return null;
}

/** Path inside bucket from a public object URL, or null if not this bucket. */
export function teamPhotoPathFromPublicUrl(url: string): string | null {
  const t = url.trim();
  if (!t) return null;
  const marker = `/storage/v1/object/public/${TEAM_PHOTOS_BUCKET}/`;
  const i = t.indexOf(marker);
  if (i === -1) return null;
  try {
    return decodeURIComponent(t.slice(i + marker.length).split("?")[0] ?? "");
  } catch {
    return null;
  }
}

export async function deleteTeamPhotoAtPublicUrl(
  publicUrl: string
): Promise<void> {
  const path = teamPhotoPathFromPublicUrl(publicUrl);
  if (!path) return;
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.storage
    .from(TEAM_PHOTOS_BUCKET)
    .remove([path]);
  if (error) {
    console.warn("[team-photo] delete:", error.message);
  }
}

export async function uploadTeamMemberPhoto(
  file: File,
  slugKey: string
): Promise<{ publicUrl: string; path: string }> {
  const bad = validateTeamPhotoFile(file);
  if (bad) throw new Error(bad);

  const supabase = getSupabaseBrowserClient();
  const safe = slugifyTeamMember(slugKey) || "member";
  const ext =
    extFromMime(file.type) ||
    (file.name.split(".").pop()?.toLowerCase() || "jpg").slice(0, 4);
  const rand =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : String(Date.now());
  const path = `${safe}/${Date.now()}-${rand}.${ext}`;

  const { error } = await supabase.storage.from(TEAM_PHOTOS_BUCKET).upload(
    path,
    file,
    {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || `image/${ext}`,
    }
  );
  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from(TEAM_PHOTOS_BUCKET)
    .getPublicUrl(path);

  return { publicUrl: data.publicUrl, path };
}
