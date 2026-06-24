"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/", label: "HOME" },
  { href: "/registration", label: "REGISTER" },
  { href: "/teams", label: "TEAMS" },
  { href: "/groups", label: "GROUPS" },
  { href: "/bracket", label: "BRACKET" },
  { href: "/rules", label: "RULES" },
  { href: "/contact", label: "CONTACT" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A1628] shadow-lg"
          : "bg-[#0A1628]"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/80 group-hover:border-[#FFD700] transition-colors">
            <span className="text-lg text-white font-bold">★</span>
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-bold tracking-[0.2em] text-white sm:text-base">
              ALL STAR CHAMPIONS
            </span>
            <span className="font-condensed text-[9px] font-semibold tracking-[0.15em] text-[#FFD700]/70 uppercase hidden sm:block">
              BROOKLYN&apos;S PREMIER SOCCER TOURNAMENT
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-condensed px-3 py-2 text-sm font-semibold tracking-wider text-white/80 transition-colors hover:text-[#FFD700]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="https://instagram.com/all_star_champions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-[#FFD700] transition-colors"
            aria-label="Instagram"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          <div className="h-5 w-px bg-white/20" />
          <Link href="/registration" className="bg-[#FFD700] px-4 py-2 font-heading text-xs font-bold tracking-wider text-[#0A1628] hover:bg-[#E6C200] transition-colors">
            REGISTER NOW
          </Link>
        </div>

        <button
          type="button"
          className="p-2 text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-[#0A1628] lg:hidden"
          >
            <div className="flex flex-col px-4 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-heading border-b border-white/5 py-3 text-sm font-bold tracking-wider text-white/90 hover:text-[#FFD700]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/registration"
                onClick={() => setOpen(false)}
                className="mt-4 bg-[#FFD700] py-3 text-center font-heading text-sm font-bold tracking-wider text-[#0A1628]"
              >
                REGISTER YOUR TEAM
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
