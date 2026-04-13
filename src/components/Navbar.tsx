"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, LayoutDashboard } from "lucide-react";
import { useAuthProfile } from "@/lib/auth/use-auth-profile";
import { canAccessAdmin } from "@/lib/auth/roles";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  isTeamPortfolioPathname,
  markTeamListScrollRestorePending,
} from "@/lib/team/team-list-scroll";

const primaryNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Projects", href: "/projects" },
  { label: "Team", href: "/team" },
] as const;

const moreNav = [
  { label: "About PI", href: "/about-pi" },
  { label: "Knowledge Mobilization", href: "/knowledge-mobilization" },
  { label: "Gallery", href: "/gallery" },
  { label: "Publications", href: "/publications" },
  { label: "Blog", href: "/blog" },
  { label: "Join 4C Lab", href: "/join-4c-lab" },
  { label: "Collaborate", href: "/collaborate" },
  { label: "Contact", href: "/contact" },
] as const;

const NAV_ROW = "flex min-h-[3.25rem] items-center py-1 sm:min-h-14 sm:py-0";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const { ready: authReady, userId, role } = useAuthProfile();
  const signedIn = !!userId;
  const showAdmin = canAccessAdmin(role);

  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setMoreOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  function navLinkClass(href: string) {
    const active =
      href === "/"
        ? pathname === "/" || pathname === ""
        : pathname === href || pathname.startsWith(`${href}/`);
    return [
      "rounded-xl px-3 py-2 text-[13px] font-medium tracking-tight transition-all duration-200",
      active
        ? "bg-brand/[0.11] font-semibold text-foreground shadow-sm ring-1 ring-brand/20"
        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
    ].join(" ");
  }

  async function handleSignOut() {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      setIsOpen(false);
      router.refresh();
    } catch {
      /* ignore */
    }
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border/60 bg-background/70 shadow-sm shadow-black/[0.03] backdrop-blur-xl supports-[backdrop-filter]:bg-background/55">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-brand/45 to-transparent"
        aria-hidden
      />
      <nav
        className={`relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8 ${NAV_ROW}`}
        aria-label="Primary"
      >
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 sm:gap-3"
        >
          <span className="relative">
            <span className="absolute -inset-1 rounded-xl bg-linear-to-br from-cognition/25 via-brand/15 to-care/20 opacity-0 blur-md transition group-hover:opacity-100" />
            <Image
              src="/logo.png"
              alt="4C Research Group logo"
              loading="eager"
              width={40}
              height={40}
              className="relative h-9 w-9 rounded-xl object-cover shadow-sm ring-1 ring-border/80 sm:h-10 sm:w-10"
            />
          </span>
          <div className="min-w-0 text-left">
            <span className="block text-[15px] font-semibold uppercase tracking-tight sm:text-base">
              <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                4C Research
              </span>
            </span>
            <span className="mt-0.5 hidden text-[10px] font-semibold uppercase leading-snug tracking-widest text-muted-foreground/90 sm:block">
              Cognition · Consciousness · Critical Care
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navLinkClass(item.href)}
              onClick={
                item.href === "/team" && isTeamPortfolioPathname(pathname)
                  ? () => markTeamListScrollRestorePending()
                  : undefined
              }
            >
              {item.label}
            </Link>
          ))}

          <div
            ref={moreRef}
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              className={[
                "inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-[13px] font-medium tracking-tight transition-all duration-200",
                moreOpen
                  ? "border-border/80 bg-card/90 text-foreground shadow-sm ring-1 ring-black/[0.04]"
                  : "border-transparent text-muted-foreground hover:border-border/60 hover:bg-muted/50 hover:text-foreground",
              ].join(" ")}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
            >
              More
              <ChevronDown
                className={`h-3.5 w-3.5 opacity-70 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 top-full z-50 pt-2"
                  role="menu"
                >
                  <div className="min-w-[15rem] overflow-hidden rounded-2xl border border-border/70 bg-card/95 py-2 shadow-xl shadow-black/[0.08] ring-1 ring-black/[0.04] backdrop-blur-xl">
                    {moreNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        className={[
                          "mx-1.5 block rounded-xl px-3 py-2.5 text-[13px] font-medium text-foreground/85 transition-colors hover:bg-linear-to-r hover:from-brand/[0.08] hover:to-care/[0.06] hover:text-foreground",
                          item.label === "Contact"
                            ? "mt-1 border-t border-border/60 pt-2"
                            : "",
                        ].join(" ")}
                        onClick={() => setMoreOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div
          className="hidden min-h-9 min-w-[17rem] shrink-0 items-center justify-end gap-2 lg:flex"
          aria-busy={!authReady}
        >
          {authReady && signedIn ? (
            <>
              {showAdmin ? (
                <Link
                  href="/admin/"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card/50 px-3 py-2 text-[13px] font-semibold text-foreground/90 shadow-sm backdrop-blur-sm transition hover:border-brand/35 hover:bg-brand/[0.06] hover:text-brand"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
                  Admin dashboard
                </Link>
              ) : (
                <Link
                  href="/dashboard/"
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-medium text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
                  Account
                </Link>
              )}
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="rounded-xl border border-border/80 bg-background px-3.5 py-2 text-[13px] font-semibold text-foreground/90 transition hover:border-destructive/35 hover:bg-destructive/[0.06] hover:text-destructive"
              >
                Sign out
              </button>
            </>
          ) : authReady ? (
            <Link
              href="/login/"
              className="inline-flex items-center justify-center rounded-xl bg-brand px-4 py-2 text-[13px] font-semibold text-primary-foreground shadow-md shadow-brand/25 transition hover:bg-brand-deep hover:shadow-lg hover:shadow-brand/20"
            >
              Sign in
            </Link>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 lg:hidden sm:gap-2">
          <div className="flex min-h-9 min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-2">
            {authReady && signedIn ? (
              <>
                <Link
                  href={showAdmin ? "/admin/" : "/dashboard/"}
                  aria-label={showAdmin ? "Admin dashboard" : "Account"}
                  className="inline-flex max-w-[9rem] items-center gap-1 truncate rounded-xl border border-border/80 bg-card/50 px-2.5 py-2 text-xs font-semibold text-foreground/90 shadow-sm backdrop-blur-sm sm:max-w-none sm:gap-1.5 sm:px-3 sm:text-[13px]"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="hidden min-[380px]:inline">
                    {showAdmin ? "Admin" : "Account"}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="shrink-0 whitespace-nowrap rounded-xl border border-border/80 bg-background px-2.5 py-2 text-[11px] font-semibold text-foreground/90 sm:px-3 sm:text-[13px]"
                >
                  Sign out
                </button>
              </>
            ) : authReady ? (
              <Link
                href="/login/"
                className="inline-flex items-center justify-center rounded-xl bg-brand px-3 py-2 text-xs font-semibold text-primary-foreground shadow-md shadow-brand/20 sm:px-3.5 sm:text-[13px]"
              >
                Sign in
              </Link>
            ) : null}
          </div>
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-card/40 text-foreground shadow-sm backdrop-blur-sm transition hover:border-brand/30 hover:bg-brand/[0.06] hover:text-brand"
            onClick={() => setIsOpen((o) => !o)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border/50 bg-card/85 backdrop-blur-2xl lg:hidden"
          >
            <div className="space-y-1 px-4 pb-6 pt-2">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-3 text-[15px] font-semibold text-foreground/90 transition hover:bg-linear-to-r hover:from-brand/[0.08] hover:to-care/[0.05]"
                  onClick={() => {
                    if (item.href === "/team" && isTeamPortfolioPathname(pathname)) {
                      markTeamListScrollRestorePending();
                    }
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              ))}
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-[15px] font-semibold text-foreground/90 transition hover:bg-muted/70"
                onClick={() => setMobileMoreOpen((o) => !o)}
                aria-expanded={mobileMoreOpen}
              >
                More
                <ChevronDown
                  className={`h-4 w-4 opacity-70 transition-transform duration-200 ${mobileMoreOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileMoreOpen && (
                <div className="ml-1 space-y-0.5 rounded-xl border border-border/50 bg-muted/20 py-2 pl-3">
                  {moreNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "block rounded-lg py-2.5 pr-3 text-[14px] font-medium text-foreground/80 transition hover:text-brand",
                        item.label === "Contact"
                          ? "mt-1 border-t border-border/50 pt-2"
                          : "",
                      ].join(" ")}
                      onClick={() => {
                        setIsOpen(false);
                        setMobileMoreOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
