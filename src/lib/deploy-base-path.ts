/** GitHub Pages project path when not overridden by env. */
export const DEPLOY_BASE_DEFAULT = "/4c-research-website";

/**
 * Value aligned with `next.config` `basePath` for browser bundles.
 * `NODE_ENV` is reliable here (unlike when `next.config` is first loaded).
 */
export function resolveDeployBasePathForBrowser(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_PATH;
  if (fromEnv !== undefined) return fromEnv;
  return process.env.NODE_ENV === "production" ? DEPLOY_BASE_DEFAULT : "";
}
