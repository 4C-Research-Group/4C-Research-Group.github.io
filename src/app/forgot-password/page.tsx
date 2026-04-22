import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password | 4C Research Group",
  description: "Reset your 4C Research Group account password by email",
};

export default function ForgotPasswordPage() {
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
      <ForgotPasswordForm />
    </Suspense>
  );
}
