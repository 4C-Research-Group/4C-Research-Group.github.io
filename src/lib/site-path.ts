/**
 * Must match optional `basePath` in `next.config.ts`. Empty for local dev and for
 * GitHub org/user Pages when the static export is deployed at the site root.
 */
export const SITE_BASE_PATH = (
  process.env.NEXT_PUBLIC_BASE_PATH ?? ""
).replace(/\/$/, "");

/** Public folder URL for plain `<link>` / raw paths when basePath is set. */
export function siteAsset(absPath: string): string {
  if (!absPath) return absPath;
  if (/^https?:\/\//i.test(absPath)) return absPath;
  const path = absPath.startsWith("/") ? absPath : `/${absPath}`;
  return `${SITE_BASE_PATH}${path}`;
}

/** Full redirect URL for Supabase email links (PKCE), e.g. confirm signup. */
export function getAuthCallbackAbsoluteUrl(): string {
  const prefix = SITE_BASE_PATH ? `${SITE_BASE_PATH}` : "";
  if (typeof window === "undefined") {
    const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "";
    return `${site}${prefix}/auth/callback/`;
  }
  const { origin } = window.location;
  return `${origin}${prefix}/auth/callback/`;
}

/** Redirect target for Supabase password recovery emails (PKCE). Allowlist in Supabase Auth. */
export function getPasswordResetRedirectAbsoluteUrl(): string {
  const prefix = SITE_BASE_PATH ? `${SITE_BASE_PATH}` : "";
  if (typeof window === "undefined") {
    const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "";
    return `${site}${prefix}/auth/reset-password/`;
  }
  const { origin } = window.location;
  return `${origin}${prefix}/auth/reset-password/`;
}
