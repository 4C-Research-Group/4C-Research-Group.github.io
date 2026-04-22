import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password | 4C Research Group",
  description: "Choose a new password for your 4C Research Group account",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-muted/35 via-background to-muted/25" />
          <Loader2
            className="relative h-10 w-10 animate-spin text-brand"
            aria-label="Loading"
          />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
