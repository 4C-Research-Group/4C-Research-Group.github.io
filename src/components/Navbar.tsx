"use client";

import { useEffect, useRef, useState } from "react";
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
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setMoreOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md shadow-sm z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
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
          </motion.div>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {primaryNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-brand transition-colors font-medium text-sm lg:text-base"
              >
                {item.label}
              </a>
            ))}

            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreOpen((o) => !o)}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-brand transition-colors font-medium text-sm lg:text-base"
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
              {moreOpen && (
                <div
                  className="absolute right-0 top-full mt-2 min-w-[13rem] rounded-xl border border-border bg-card shadow-lg py-1.5 z-50"
                  role="menu"
                >
                  {moreNav.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-brand transition-colors"
                      onClick={() => setMoreOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a
              href="/contact"
              className="bg-brand text-primary-foreground px-4 py-2 rounded-full font-medium hover:bg-brand-deep transition-colors inline-flex items-center gap-2 text-sm"
            >
              <span>Contact</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <button
            type="button"
            className="md:hidden p-1"
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
              <a
                key={item.href}
                href={item.href}
                className="block py-2.5 text-muted-foreground hover:text-brand transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              className="flex w-full items-center justify-between py-2.5 text-muted-foreground hover:text-brand transition-colors font-medium"
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
                  <a
                    key={item.href}
                    href={item.href}
                    className="block py-2 text-sm text-muted-foreground hover:text-brand"
                    onClick={() => {
                      setIsOpen(false);
                      setMobileMoreOpen(false);
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
            <a
              href="/contact"
              className="mt-3 block text-center w-full bg-brand text-primary-foreground px-4 py-2.5 rounded-full font-medium hover:bg-brand-deep transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </a>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
