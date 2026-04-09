import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const HOMEPAGE_IMAGES_BUCKET = "homepage-images";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  if (mime === "image/svg+xml") return "svg";
  return "jpg";
}

export function validateHomepageImageFile(file: File): string | null {
  if (file.size > MAX_BYTES) {
    return "Image must be 10MB or smaller.";
  }
  if (file.type && !ALLOWED_TYPES.has(file.type)) {
    return "Use JPEG, PNG, WebP, GIF, or SVG.";
  }
  return null;
}

export async function uploadHomepageImage(file: File): Promise<string> {
  const bad = validateHomepageImageFile(file);
  if (bad) throw new Error(bad);

  const supabase = getSupabaseBrowserClient();
  const ext =
    extFromMime(file.type) ||
    (file.name.split(".").pop()?.toLowerCase() || "jpg").slice(0, 4);
  const rand =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : String(Date.now());
  const path = `assets/${Date.now()}-${rand}.${ext}`;

  const { error } = await supabase.storage
    .from(HOMEPAGE_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || `image/${ext}`,
    });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from(HOMEPAGE_IMAGES_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}
