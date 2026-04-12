/**
 * Convert common video page URLs into URLs that are allowed in <iframe src>.
 * YouTube watch / shorts / youtu.be links become youtube.com/embed/ID.
 * Vimeo page links become player.vimeo.com/video/ID.
 */

function withHttpsScheme(raw: string): string {
  const t = raw.trim();
  if (!t || /^(javascript|data):/i.test(t)) return t;
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

function parseYoutubeStartSeconds(u: URL): number | undefined {
  const start = u.searchParams.get("start");
  if (start != null && start !== "") {
    const n = Number.parseInt(start, 10);
    if (Number.isFinite(n) && n > 0) return n;
  }
  const t = u.searchParams.get("t");
  if (t == null || t === "") return undefined;
  if (/^\d+$/.test(t)) {
    const n = Number.parseInt(t, 10);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return undefined;
}

/**
 * Returns a URL suitable for embedding in an iframe, or the trimmed input if unchanged.
 */
export function normalizeVideoIframeSrc(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed || /^(javascript|data):/i.test(trimmed)) return trimmed;

  let u: URL;
  try {
    u = new URL(withHttpsScheme(trimmed));
  } catch {
    return trimmed;
  }

  const host = u.hostname.replace(/^www\./, "").toLowerCase();

  if (host === "vimeo.com") {
    const parts = u.pathname.split("/").filter(Boolean);
    const id = parts[0];
    if (id && /^\d+$/.test(id)) {
      return `https://player.vimeo.com/video/${id}`;
    }
    return trimmed;
  }

  const isYoutube =
    host === "youtu.be" ||
    host === "youtube.com" ||
    host.endsWith(".youtube.com");

  if (!isYoutube) return trimmed;

  let videoId: string | null = null;

  if (host === "youtu.be") {
    videoId = u.pathname.replace(/^\//, "").split("/")[0] ?? null;
    if (videoId) videoId = videoId.split("?")[0] ?? videoId;
  } else {
    const path = u.pathname;
    if (path.startsWith("/embed/")) {
      return trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;
    }
    if (path.startsWith("/shorts/")) {
      videoId = path.slice("/shorts/".length).split("/")[0]?.split("?")[0] ?? null;
    } else if (path.startsWith("/live/")) {
      videoId = path.slice("/live/".length).split("/")[0]?.split("?")[0] ?? null;
    } else if (path === "/watch" || path === "/watch/") {
      videoId = u.searchParams.get("v");
    }
  }

  if (!videoId || !/^[\w-]{6,}$/.test(videoId)) return trimmed;

  const start = parseYoutubeStartSeconds(u);
  const qs = new URLSearchParams();
  if (start != null && start > 0) qs.set("start", String(Math.floor(start)));
  const q = qs.toString();
  return `https://www.youtube.com/embed/${videoId}${q ? `?${q}` : ""}`;
}
