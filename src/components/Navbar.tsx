"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
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

const NAV_H = "h-14";

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
      "rounded-full px-3 py-1.5 text-[13px] font-medium tracking-tight transition-colors",
      active
        ? "bg-foreground/[0.07] text-foreground"
        : "text-foreground/65 hover:bg-foreground/[0.05] hover:text-foreground",
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
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border/50 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 ${NAV_H}`}
        aria-label="Primary"
      >
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 sm:gap-3"
        >
          <Image
            src="/logo.png"
            alt="4C Research Group logo"
            loading="eager"
            width={40}
            height={40}
            className="h-9 w-9 rounded-lg object-cover ring-1 ring-black/5 sm:h-10 sm:w-10"
          />
          <div className="min-w-0 text-left">
            <span className="block text-[15px] font-semibold uppercase tracking-tight sm:text-base">
              <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                4C Research
              </span>
            </span>
            <span className="mt-0.5 hidden text-[11px] font-medium uppercase leading-snug tracking-wider sm:block">
              <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                Cognition · Consciousness · Critical Care
              </span>
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-0.5 lg:flex lg:gap-1">
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
                "inline-flex items-center gap-0.5 rounded-full px-3 py-1.5 text-[13px] font-medium tracking-tight text-foreground/65 transition-colors hover:bg-foreground/[0.05] hover:text-foreground",
                moreOpen ? "bg-foreground/[0.07] text-foreground" : "",
              ].join(" ")}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
            >
              More
              <ChevronDown
                className={`h-3.5 w-3.5 opacity-60 transition-transform ${moreOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 pt-2"
                  role="menu"
                >
                  <div className="min-w-[14rem] rounded-2xl border border-border/80 bg-card/95 py-1.5 shadow-lg shadow-black/5 ring-1 ring-black/5 backdrop-blur-md">
                    {moreNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        className={[
                          "block px-4 py-2 text-[13px] text-foreground/85 transition-colors hover:bg-muted/80 hover:text-foreground",
                          item.label === "Contact" ? "mt-1 border-t border-border/70 pt-2" : "",
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

        <div className="hidden min-w-0 shrink-0 items-center justify-end gap-2 lg:flex">
          {authReady && signedIn ? (
            <>
              {showAdmin ? (
                <Link
                  href="/admin/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-3 py-1.5 text-[13px] font-medium text-foreground/80 transition-colors hover:border-brand/30 hover:text-brand"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
                  Admin dashboard
                </Link>
              ) : (
                <Link
                  href="/dashboard/"
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-foreground/65 transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
                  Account
                </Link>
              )}
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="rounded-full border-2 border-brand bg-background px-3.5 py-2 text-[13px] font-semibold text-brand transition-colors hover:bg-brand/10"
              >
                Sign out
              </button>
            </>
          ) : authReady ? (
            <Link
              href="/login/"
              className="inline-flex items-center justify-center rounded-full bg-brand px-3.5 py-2 text-[13px] font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-brand-deep"
            >
              Sign in
            </Link>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          {authReady && signedIn ? (
            <>
              <Link
                href={showAdmin ? "/admin/" : "/dashboard/"}
                aria-label={showAdmin ? "Admin dashboard" : "Account"}
                className="inline-flex max-w-[9rem] items-center gap-1 truncate rounded-full border border-border/80 bg-background px-2.5 py-2 text-xs font-medium text-foreground/80 sm:max-w-none sm:gap-1.5 sm:px-3 sm:text-[13px]"
              >
                <LayoutDashboard className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="hidden min-[380px]:inline">
                  {showAdmin ? "Admin" : "Account"}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="shrink-0 whitespace-nowrap rounded-full border-2 border-brand bg-background px-2 py-2 text-[11px] font-semibold text-brand sm:px-3 sm:text-[13px]"
              >
                Sign out
              </button>
            </>
          ) : authReady ? (
            <Link
              href="/login/"
              className="inline-flex items-center justify-center rounded-full bg-brand px-3 py-2 text-xs font-semibold text-primary-foreground shadow-sm sm:px-3.5 sm:text-[13px]"
            >
              Sign in
            </Link>
          ) : null}
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground"
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
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-border/50 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="space-y-0.5 px-4 pb-5 pt-1">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2.5 text-[15px] font-medium text-foreground/80 hover:bg-muted/70"
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
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[15px] font-medium text-foreground/80 hover:bg-muted/70"
                onClick={() => setMobileMoreOpen((o) => !o)}
                aria-expanded={mobileMoreOpen}
              >
                More
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${mobileMoreOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileMoreOpen && (
                <div className="ml-2 space-y-0.5 border-l-2 border-brand/25 pl-3">
                  {moreNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "block py-2 text-[14px] text-foreground/75",
                        item.label === "Contact"
                          ? "mt-1 border-t border-border/60 pt-2"
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
