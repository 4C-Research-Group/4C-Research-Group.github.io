import { resolveDeployBasePathForBrowser } from "./deploy-base-path";

/**
 * Must match `basePath` in `next.config.ts` (and your deployed path under GitHub Pages).
 */
export const SITE_BASE_PATH = resolveDeployBasePathForBrowser();

/** Static file under `public/` (favicon, logo, manifest) on GitHub Pages. */
export function publicAssetPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_BASE_PATH}${p}`;
}

/** Full redirect URL for Supabase email links (PKCE), e.g. confirm signup. */
export function getAuthCallbackAbsoluteUrl(): string {
  if (typeof window === "undefined") {
    const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "";
    return `${site}${SITE_BASE_PATH}/auth/callback/`;
  }
  const { origin } = window.location;
  return `${origin}${SITE_BASE_PATH}/auth/callback/`;
}
