"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isKmLearnerRegistrationComplete } from "@/lib/km/km-learner-registration";

const START_PATH = "/knowledge-mobilization/start";

function pathAllowsWithoutRegistration(pathname: string | null): boolean {
  if (!pathname) return true;
  const p = pathname.replace(/\/+$/, "") || "/";
  return p === START_PATH || p.startsWith(`${START_PATH}/`);
}

export default function KmRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathAllowsWithoutRegistration(pathname)) return;
    if (isKmLearnerRegistrationComplete()) return;
    router.replace(`${START_PATH}/`);
  }, [pathname, router]);

  if (!pathAllowsWithoutRegistration(pathname) && !isKmLearnerRegistrationComplete()) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-background text-muted-foreground">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <p className="text-sm">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
