import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const KM_AUDIO_BUCKET = "km-audio";

const MAX_BYTES = 100 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/webm",
  "audio/ogg",
]);

function extFromMime(mime: string): string {
  if (mime === "audio/mpeg") return "mp3";
  if (mime === "audio/mp4") return "m4a";
  if (mime === "audio/wav") return "wav";
  if (mime === "audio/webm") return "webm";
  if (mime === "audio/ogg") return "ogg";
  return "mp3";
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
  const base = name.split(/[/\\]/).pop() ?? "audio";
  const stem = base.replace(/\.[^.]+$/, "");
  const cleaned = stem.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 60);
  return cleaned || "audio";
}

function extensionLooksAllowed(name: string): boolean {
  return /\.(mp3|m4a|wav|webm|ogg)$/i.test(name.trim());
}

export function validateKmCurriculumAudioFile(file: File): string | null {
  if (file.size > MAX_BYTES) {
    return "Audio must be 100MB or smaller.";
  }
  if (file.type) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return "Use MP3, M4A, WAV, WebM, or OGG.";
    }
    return null;
  }
  if (!extensionLooksAllowed(file.name)) {
    return "Use MP3, M4A, WAV, WebM, or OGG.";
  }
  return null;
}

export async function uploadKmCurriculumAudio(
  file: File,
  moduleSlug: string,
): Promise<{ publicUrl: string; path: string }> {
  const bad = validateKmCurriculumAudioFile(file);
  if (bad) throw new Error(bad);

  const supabase = getSupabaseBrowserClient();
  const mod = safeModuleSegment(moduleSlug);
  let ext: string;
  if (file.type && ALLOWED_TYPES.has(file.type)) {
    ext = extFromMime(file.type);
  } else {
    const raw = file.name.split(".").pop()?.toLowerCase() ?? "mp3";
    ext = ["m4a", "wav", "webm", "ogg"].includes(raw) ? raw : "mp3";
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
      : ext === "m4a"
        ? "audio/mp4"
        : ext === "wav"
          ? "audio/wav"
          : ext === "webm"
            ? "audio/webm"
            : ext === "ogg"
              ? "audio/ogg"
              : "audio/mpeg";

  const { error } = await supabase.storage.from(KM_AUDIO_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(KM_AUDIO_BUCKET).getPublicUrl(path);
  return { publicUrl: data.publicUrl, path };
}
