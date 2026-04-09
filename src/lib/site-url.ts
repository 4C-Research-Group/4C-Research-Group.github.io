import { SITE_BASE_PATH } from "@/lib/site-path";

/** Production default when `NEXT_PUBLIC_SITE_URL` is unset (GitHub org Pages). */
const DEFAULT_SITE_ORIGIN = "https://4c-research-group.github.io";

/**
 * Canonical origin only, no path (e.g. `https://example.com`).
 * Set `NEXT_PUBLIC_SITE_URL` in env for correct sitemaps and Open Graph.
 */
export function getSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return raw ? raw.replace(/\/+$/, "") : DEFAULT_SITE_ORIGIN;
}

/**
 * Base URL for Next.js `metadataBase` (Open Graph / Twitter image resolution).
 * Includes `NEXT_PUBLIC_BASE_PATH` when set.
 */
export function getMetadataBaseUrl(): URL {
  const origin = getSiteOrigin();
  if (!SITE_BASE_PATH) {
    return new URL(`${origin}/`);
  }
  const segment = SITE_BASE_PATH.replace(/^\/+|\/+$/g, "");
  return new URL(`${origin}/${segment}/`);
}

/**
 * Absolute URL for a pathname segment, with trailing slash (`trailingSlash: true`).
 * @param path e.g. `"about"` or `"/projects/nuanced/"`
 */
export function absoluteUrl(path: string): string {
  const base = getMetadataBaseUrl();
  const trimmed = path.replace(/^\/+|\/+$/g, "");
  if (!trimmed) return base.toString();
  return new URL(`${trimmed}/`, base).toString();
}
