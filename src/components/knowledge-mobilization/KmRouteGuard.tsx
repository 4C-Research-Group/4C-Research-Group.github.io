"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isKmLearnerRegistrationComplete } from "@/lib/km/km-learner-registration";

const START_PATH = "/knowledge-mobilization/start";

function pathAllowsWithoutRegistration(pathname: string | null): boolean {
  if (!pathname) return true;
  const p = pathname.replace(/\/+$/, "") || "/";
  return p === START_PATH || p.startsWith(`${START_PATH}/`);
}

function GateSpinner() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-background text-muted-foreground">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      <p className="text-sm">Loading…</p>
    </div>
  );
}

export default function KmRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Pathname we last allowed through after checking `localStorage` (client only).
   * Never read storage during render — avoids SSR (no storage) vs client mismatch.
   * `null` until effect runs for a guarded route.
   */
  const [unlockedForPath, setUnlockedForPath] = useState<string | null>(() =>
    pathAllowsWithoutRegistration(pathname) ? (pathname ?? "") : null,
  );

  useEffect(() => {
    if (pathAllowsWithoutRegistration(pathname)) {
      setUnlockedForPath(pathname ?? "");
      return;
    }
    if (isKmLearnerRegistrationComplete()) {
      setUnlockedForPath(pathname ?? "");
      return;
    }
    setUnlockedForPath(null);
    router.replace(`${START_PATH}/`);
  }, [pathname, router]);

  const current = pathname ?? "";
  const showChildren =
    pathAllowsWithoutRegistration(pathname) || unlockedForPath === current;

  if (!showChildren) {
    return <GateSpinner />;
  }

  return <>{children}</>;
}
