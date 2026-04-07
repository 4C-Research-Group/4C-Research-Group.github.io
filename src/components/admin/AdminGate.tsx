"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import { canAccessAdmin } from "@/lib/auth/roles";
import Link from "next/link";

export default function AdminGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { ready, userId, role } = useAuthProfile();

  useEffect(() => {
    if (!ready) return;
    if (!userId) {
      router.replace("/login/?next=/admin/");
      return;
    }
    if (!canAccessAdmin(role)) {
      router.replace("/dashboard/?message=no-admin");
    }
  }, [ready, userId, role, router]);

  if (!ready || !userId || !canAccessAdmin(role)) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        <p className="text-sm">Checking access…</p>
        {ready && userId && !canAccessAdmin(role) && (
          <Link href="/dashboard/" className="text-sm text-brand hover:underline">
            Back to dashboard
          </Link>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
