"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import { canManageUsers } from "@/lib/auth/roles";

export default function SuperuserGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { ready, userId, role } = useAuthProfile();

  useEffect(() => {
    if (!ready || !userId) return;
    if (!canManageUsers(role)) {
      router.replace("/admin/");
    }
  }, [ready, userId, role, router]);

  if (!ready || !userId || !canManageUsers(role)) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-7 w-7 animate-spin text-brand" />
        <p className="text-sm">Checking superuser access…</p>
        {ready && userId && !canManageUsers(role) && (
          <Link href="/admin/" className="text-sm text-brand hover:underline">
            Back to admin home
          </Link>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
