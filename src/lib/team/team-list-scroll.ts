const TEAM_LIST_SCROLL_KEY = "4c:team-list-scroll";
const TEAM_LIST_RESTORE_PENDING_KEY = "4c:team-list-restore-pending";
const TEAM_PAGE_RELOAD_SCROLL_KEY = "4c:team-page-reload-scroll";

/** Full document reload (refresh), not client-side navigation. */
export function isBrowserReloadNavigation(): boolean {
  if (typeof window === "undefined") return false;
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  return nav?.type === "reload";
}

/** Call from `pagehide` / `freeze` on the team list so refresh can restore scroll. */
export function saveTeamPageScrollBeforeHide(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(TEAM_PAGE_RELOAD_SCROLL_KEY, String(window.scrollY));
  } catch {
    /* */
  }
}

export function consumeTeamPageReloadScrollY(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(TEAM_PAGE_RELOAD_SCROLL_KEY);
    if (raw == null) return null;
    sessionStorage.removeItem(TEAM_PAGE_RELOAD_SCROLL_KEY);
    const y = Number(raw);
    if (!Number.isFinite(y) || y < 0) return null;
    return y;
  } catch {
    return null;
  }
}

export function clearTeamPageReloadScroll(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(TEAM_PAGE_RELOAD_SCROLL_KEY);
  } catch {
    /* */
  }
}

/** True when URL is a member profile under .../team/<slug> (works with Next.js `basePath`). */
export function isTeamPortfolioPathname(pathname: string): boolean {
  const segments = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  const i = segments.indexOf("team");
  return i >= 0 && i < segments.length - 1;
}

/** Call before navigating from /team to a member portfolio. */
export function rememberTeamListScroll(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(TEAM_LIST_SCROLL_KEY, String(window.scrollY));
  } catch {
    /* private mode / quota */
  }
}

/**
 * Call when the user explicitly returns from a portfolio to the team list (nav or in-page
 * "Team" link). Restores scroll only when this was set; avoids stale restores after e.g.
 * Team → About → Team.
 */
export function markTeamListScrollRestorePending(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(TEAM_LIST_RESTORE_PENDING_KEY, "1");
  } catch {
    /* */
  }
}

export function takeTeamListScrollRestorePending(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const pending = sessionStorage.getItem(TEAM_LIST_RESTORE_PENDING_KEY) === "1";
    if (pending) sessionStorage.removeItem(TEAM_LIST_RESTORE_PENDING_KEY);
    return pending;
  } catch {
    return false;
  }
}

export function discardSavedTeamListScroll(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(TEAM_LIST_SCROLL_KEY);
  } catch {
    /* */
  }
}

/**
 * Read and clear saved vertical scroll for /team. Used only after
 * `takeTeamListScrollRestorePending()` is true.
 */
export function consumeTeamListScrollY(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(TEAM_LIST_SCROLL_KEY);
    if (raw == null) return null;
    sessionStorage.removeItem(TEAM_LIST_SCROLL_KEY);
    const y = Number(raw);
    if (!Number.isFinite(y) || y < 0) return null;
    return y;
  } catch {
    return null;
  }
}
