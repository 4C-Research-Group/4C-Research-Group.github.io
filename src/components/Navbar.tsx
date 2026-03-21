"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";

const primaryNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Team", href: "/team" },
] as const;

const moreNav = [
  { label: "Publications", href: "/publications" },
  { label: "Join 4C Lab", href: "/join-4c-lab" },
  { label: "Collaborate", href: "/collaborate" },
] as const;

export default function Navbar() {
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

  return (
    <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md shadow-sm z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/" className="flex cursor-pointer items-center space-x-3">
              <img
                src="/logo.png"
                alt="4C Research Lab Logo"
                className="w-10 h-10 rounded-lg"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg bg-linear-to-r from-brand to-consciousness bg-clip-text text-transparent leading-tight">
                  4C RESEARCH
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  Cognition • Consciousness • Critical Care
                </span>
              </div>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="cursor-pointer text-muted-foreground hover:text-brand transition-colors font-medium text-sm lg:text-base"
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
                className="inline-flex cursor-pointer items-center gap-1 text-muted-foreground hover:text-brand transition-colors font-medium text-sm lg:text-base"
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                aria-label="More navigation links"
              >
                More
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
              <div
                className={`absolute right-0 top-full z-50 min-w-[13rem] pt-1 ${moreOpen ? "pointer-events-auto" : "pointer-events-none invisible"}`}
                role="menu"
                aria-hidden={!moreOpen}
              >
                <div className="rounded-xl border border-border bg-card py-1.5 shadow-lg">
                  {moreNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className="block cursor-pointer px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-muted hover:text-brand"
                      onClick={() => setMoreOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-deep"
            >
              <span>Contact</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            type="button"
            className="cursor-pointer p-1 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-border"
          >
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block cursor-pointer py-2.5 font-medium text-muted-foreground transition-colors hover:text-brand"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between py-2.5 font-medium text-muted-foreground transition-colors hover:text-brand"
              onClick={() => setMobileMoreOpen((o) => !o)}
              aria-expanded={mobileMoreOpen}
            >
              More
              <ChevronDown
                className={`w-4 h-4 shrink-0 transition-transform ${mobileMoreOpen ? "rotate-180" : ""}`}
              />
            </button>
            {mobileMoreOpen && (
              <div className="border-l-2 border-brand/30 pl-3 ml-1 mb-2 space-y-1">
                {moreNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block cursor-pointer py-2 text-sm text-muted-foreground hover:text-brand"
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
            <Link
              href="/contact"
              className="mt-3 block w-full cursor-pointer rounded-full bg-brand px-4 py-2.5 text-center font-medium text-primary-foreground transition-colors hover:bg-brand-deep"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
