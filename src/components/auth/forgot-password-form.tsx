"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { friendlyAuthMessage } from "@/lib/auth/friendly-auth-message";
import { getPasswordResetRedirectAbsoluteUrl } from "@/lib/site-path";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthCardFrame } from "./auth-card-frame";

export default function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const authQuery = searchParams.toString();
  const loginHref = authQuery ? `/login/?${authQuery}` : "/login/";

  const inputBase =
    "w-full rounded-xl border border-border/80 bg-background/90 py-3 pl-11 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-brand/45 focus:ring-2 focus:ring-brand/20 disabled:opacity-60";
  const inputClassEmail = `${inputBase} pr-4`;
  const labelClass =
    "mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground";

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email.trim()) {
      setError("Enter your email.");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo = getPasswordResetRedirectAbsoluteUrl();
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo }
      );
      if (resetErr) {
        setError(friendlyAuthMessage(resetErr.message));
        return;
      }
      setInfo(
        "If an account exists for that address, we sent a message with a link to choose a new password. Check your inbox and spam folder."
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Request failed.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthCardFrame>
      <div className="mb-8 flex flex-col items-center text-center">
        <Link
          href="/"
          className="group mb-5 flex items-center gap-2.5 rounded-2xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
        >
          <span className="relative">
            <span className="absolute -inset-1 rounded-xl bg-linear-to-br from-cognition/30 via-brand/15 to-care/25 opacity-0 blur-md transition group-hover:opacity-100" />
            <Image
              src="/logo.png"
              alt="4C Research Group"
              width={40}
              height={40}
              className="relative h-10 w-10 rounded-xl object-cover shadow-sm ring-1 ring-border/80"
            />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              4C Research Group
            </span>
          </span>
        </Link>
        <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Forgot password
        </h1>
        <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
          Enter your email and we will send you a secure link to set a new
          password.
        </p>
      </div>

      {error && (
        <div
          className="mb-5 rounded-xl border border-destructive/35 bg-destructive/[0.08] px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      )}
      {info && (
        <div className="mb-5 rounded-xl border border-brand/30 bg-brand/[0.08] px-4 py-3 text-sm text-foreground">
          {info}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="fp-email" className={labelClass}>
            Email
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
              <Mail className="h-4 w-4" aria-hidden />
            </span>
            <input
              id="fp-email"
              type="email"
              autoComplete="email"
              disabled={isLoading || !!info}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClassEmail}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !!info}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-brand/25 transition hover:bg-brand-deep hover:shadow-lg hover:shadow-brand/20 disabled:opacity-60"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Send reset link
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href={loginHref}
          className="font-semibold text-brand underline decoration-brand/25 underline-offset-4 transition hover:decoration-brand/50"
        >
          Sign in
        </Link>
      </p>

      <p className="mt-5 text-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-border hover:bg-muted/50 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to site
        </Link>
      </p>
    </AuthCardFrame>
  );
}
