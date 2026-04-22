"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Signing you in…");

  useEffect(() => {
    let cancelled = false;

    async function finish() {
      try {
        const supabase = getSupabaseBrowserClient();
        const url = new URL(window.location.href);
        const authError = url.searchParams.get("error");
        const authErrorDesc = url.searchParams.get("error_description");
        if (authError) {
          const text = authErrorDesc
            ? decodeURIComponent(authErrorDesc.replace(/\+/g, " "))
            : authError;
          if (!cancelled) setMessage(text);
          return;
        }

        // Implicit flow: tokens in hash are applied when the client reads the session.
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (cancelled) return;
        if (session) {
          router.replace("/dashboard/");
          router.refresh();
          return;
        }

        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (cancelled) return;
          if (error) {
            setMessage(error.message);
            return;
          }
          router.replace("/dashboard/");
          router.refresh();
          return;
        }

        setMessage("Could not complete sign-in. Try signing in again.");
      } catch {
        if (!cancelled) {
          setMessage("Something went wrong. Try signing in again.");
        }
      }
    }

    void finish();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <p className="text-center text-muted-foreground">{message}</p>
    </div>
  );
}
