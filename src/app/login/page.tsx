import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import AuthForm from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign in | 4C Research Group",
  description: "Sign in to your 4C Research Group account",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-brand" aria-label="Loading" />
        </div>
      }
    >
      <AuthForm mode="login" />
    </Suspense>
  );
}
