"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import { canAccessAdmin } from "@/lib/auth/roles";
import MemberDashboardHome from "@/components/admin/MemberDashboardHome";

export default function DashboardPage() {
  const router = useRouter();
  const { ready, role } = useAuthProfile();

  useEffect(() => {
    if (!ready) return;
    if (canAccessAdmin(role)) {
      router.replace("/admin/");
    }
  }, [ready, role, router]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 bg-background text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-brand" aria-hidden />
        <span className="text-sm">Loading…</span>
      </div>
    );
  }

  if (canAccessAdmin(role)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 bg-background text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-brand" aria-hidden />
        <span className="text-sm">Opening admin dashboard…</span>
      </div>
    );
  }

  return <MemberDashboardHome />;
}
