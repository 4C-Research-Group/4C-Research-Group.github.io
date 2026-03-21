"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Research", href: "/research" },
    { label: "Team", href: "/team" },
    { label: "Publications", href: "/publications" },
    { label: "Join 4C Lab", href: "/join-4c-lab" },
    { label: "Contact", href: "/contact" },
    { label: "Collaborate", href: "/collaborate" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md shadow-sm z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-muted-foreground hover:text-brand transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/contact"
              className="bg-brand text-primary-foreground px-4 py-2 rounded-full font-medium hover:bg-brand-deep transition-colors inline-flex items-center space-x-2"
            >
              <span>Contact</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-border"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-2 text-muted-foreground hover:text-brand transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/contact"
              className="mt-4 block text-center w-full bg-brand text-primary-foreground px-4 py-2 rounded-full font-medium hover:bg-brand-deep transition-colors"
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
