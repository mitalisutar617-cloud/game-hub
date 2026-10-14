"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#08090e]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
        >
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[2px] transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]">
            <div className="w-full h-full bg-[#0d1017] rounded-[10px] flex items-center justify-center">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="6" y1="12" x2="10" y2="12"></line>
                <line x1="8" y1="10" x2="8" y2="14"></line>
                <line x1="15" y1="13" x2="15.01" y2="13"></line>
                <line x1="18" y1="11" x2="18.01" y2="11"></line>
                <rect x="2" y="6" width="20" height="12" rx="6"></rect>
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-wider text-white font-mono flex items-center gap-1">
              NEXUS
              <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 tracking-normal">
                HUB
              </span>
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-zinc-400 font-semibold">
              Next-Gen Gaming
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-white hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            Games Catalog
          </Link>
          <a
            href="#featured"
            className="text-sm font-medium text-zinc-300 hover:text-cyan-400 transition-colors"
          >
            Featured
          </a>
          <a
            href="#trending"
            className="text-sm font-medium text-zinc-300 hover:text-cyan-400 transition-colors"
          >
            Trending
          </a>
          <a
            href="#community"
            className="text-sm font-medium text-zinc-300 hover:text-cyan-400 transition-colors"
          >
            Community
          </a>
        </nav>

        {/* Desktop CTA & Actions */}
        <div className="hidden sm:flex items-center gap-3 lg:gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Servers Online
          </div>
          <Link
            href="/#games-grid"
            className="relative inline-flex items-center justify-center px-4 sm:px-5 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold text-black bg-gradient-to-r from-cyan-400 to-teal-300 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:brightness-110 transition-all duration-200 active:scale-95"
          >
            Browse All Games
          </Link>
        </div>

        {/* Mobile menu button (at least 44x44 touch target) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 active:bg-white/10 flex items-center justify-center focus:outline-none transition-colors"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full px-4 pt-3 pb-6 border-b border-white/10 bg-[#0b0e16]/98 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-3 py-2 text-xs text-emerald-400 font-mono border-b border-white/5 mb-1">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Global Servers Online
              </span>
              <span className="text-[10px] text-zinc-500 font-semibold uppercase">5 Games Active</span>
            </div>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-3 min-h-[44px] rounded-lg text-sm font-semibold text-white hover:bg-white/5 active:bg-cyan-500/10 transition-colors"
            >
              🎮 Games Catalog
            </Link>
            <a
              href="#featured"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-3 min-h-[44px] rounded-lg text-sm font-medium text-zinc-300 hover:bg-white/5 active:bg-cyan-500/10 transition-colors"
            >
              🔥 Featured Spotlight
            </a>
            <a
              href="#trending"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-3 min-h-[44px] rounded-lg text-sm font-medium text-zinc-300 hover:bg-white/5 active:bg-cyan-500/10 transition-colors"
            >
              ⚡ Trending Highlights
            </a>
            <a
              href="#community"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-3 min-h-[44px] rounded-lg text-sm font-medium text-zinc-300 hover:bg-white/5 active:bg-cyan-500/10 transition-colors"
            >
              🌐 Community & Intel
            </a>
            <Link
              href="/#games-grid"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-center min-h-[44px] py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-300 text-black font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-98 transition-all"
            >
              Browse All Games
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
