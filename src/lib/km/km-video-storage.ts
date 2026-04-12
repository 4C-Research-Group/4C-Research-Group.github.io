import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const KM_VIDEOS_BUCKET = "km-videos";

/** 100 MB — matches default bucket limit in storage_km_videos.sql */
const MAX_BYTES = 100 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

function extFromMime(mime: string): string {
  if (mime === "video/mp4") return "mp4";
  if (mime === "video/webm") return "webm";
  if (mime === "video/quicktime") return "mov";
  return "mp4";
}

function safeModuleSegment(slug: string): string {
  const s = slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return (s || "module").slice(0, 64);
}

function safeFileStem(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "video";
  const stem = base.replace(/\.[^.]+$/, "");
  const cleaned = stem.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 60);
  return cleaned || "video";
}

function extensionLooksAllowed(name: string): boolean {
  return /\.(mp4|webm|mov)$/i.test(name.trim());
}

export function validateKmCurriculumVideoFile(file: File): string | null {
  if (file.size > MAX_BYTES) {
    return "Video must be 100MB or smaller.";
  }
  if (file.type) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return "Use MP4, WebM, or MOV (QuickTime).";
    }
    return null;
  }
  if (!extensionLooksAllowed(file.name)) {
    return "Use MP4, WebM, or MOV (QuickTime).";
  }
  return null;
}

/**
 * Upload a curriculum video for KM admin. Requires authenticated admin
 * (storage RLS). Returns a public URL suitable for topic `embedUrl`.
 */
export async function uploadKmCurriculumVideo(
  file: File,
  moduleSlug: string,
): Promise<{ publicUrl: string; path: string }> {
  const bad = validateKmCurriculumVideoFile(file);
  if (bad) throw new Error(bad);

  const supabase = getSupabaseBrowserClient();
  const mod = safeModuleSegment(moduleSlug);
  let ext: string;
  if (file.type && ALLOWED_TYPES.has(file.type)) {
    ext = extFromMime(file.type);
  } else {
    const raw = file.name.split(".").pop()?.toLowerCase() ?? "mp4";
    ext = raw === "mov" ? "mov" : raw === "webm" ? "webm" : "mp4";
  }
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now());
  const stem = safeFileStem(file.name);
  const path = `${mod}/${id}-${stem}.${ext}`;

  const contentType =
    file.type && ALLOWED_TYPES.has(file.type)
      ? file.type
      : ext === "webm"
        ? "video/webm"
        : ext === "mov"
          ? "video/quicktime"
          : "video/mp4";

  const { error } = await supabase.storage.from(KM_VIDEOS_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(KM_VIDEOS_BUCKET).getPublicUrl(path);
  return { publicUrl: data.publicUrl, path };
}
