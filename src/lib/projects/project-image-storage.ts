import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const PROJECT_IMAGES_BUCKET = "project-images";

const MAX_BYTES = 10 * 1024 * 1024;
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

function safeSlug(s: string): string {
  const t = s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return t || "project";
}

export function validateProjectImageFile(file: File): string | null {
  if (file.size > MAX_BYTES) {
    return "Image must be 10MB or smaller.";
  }
  if (file.type && !ALLOWED_TYPES.has(file.type)) {
    return "Use JPEG, PNG, WebP, or GIF.";
  }
  return null;
}

export function projectImagePathFromPublicUrl(url: string): string | null {
  const t = url.trim();
  if (!t) return null;
  const marker = `/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/`;
  const i = t.indexOf(marker);
  if (i === -1) return null;
  try {
    return decodeURIComponent(t.slice(i + marker.length).split("?")[0] ?? "");
  } catch {
    return null;
  }
}

export async function deleteProjectImageAtPublicUrl(
  publicUrl: string,
): Promise<void> {
  const path = projectImagePathFromPublicUrl(publicUrl);
  if (!path) return;
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .remove([path]);
  if (error) {
    console.warn("[project-image] delete:", error.message);
  }
}

export async function uploadProjectGalleryImage(
  file: File,
  projectSlug: string,
): Promise<{ publicUrl: string; path: string }> {
  const bad = validateProjectImageFile(file);
  if (bad) throw new Error(bad);

  const supabase = getSupabaseBrowserClient();
  const safe = safeSlug(projectSlug);
  const ext =
    extFromMime(file.type) ||
    (file.name.split(".").pop()?.toLowerCase() || "jpg").slice(0, 4);
  const rand =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : String(Date.now());
  const path = `${safe}/${Date.now()}-${rand}.${ext}`;

  const { error } = await supabase.storage.from(PROJECT_IMAGES_BUCKET).upload(
    path,
    file,
    {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || `image/${ext}`,
    },
  );
  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .getPublicUrl(path);

  return { publicUrl: data.publicUrl, path };
}
