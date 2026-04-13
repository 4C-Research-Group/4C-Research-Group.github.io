import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import AuthForm from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign up | 4C Research Group",
  description: "Create a 4C Research Group account",
};

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-brand" aria-label="Loading" />
        </div>
      }
    >
      <AuthForm mode="signup" />
    </Suspense>
  );
}
