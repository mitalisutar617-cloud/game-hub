"use client";

import { useState, useMemo } from "react";
import { Game } from "@/lib/games";
import GameCard from "./GameCard";

interface GamesGridProps {
  initialGames: Game[];
}

const CATEGORIES = [
  "All",
  "Strategy",
  "Arcade",
  "Puzzle",
  "Casual Duel",
  "Action Reflex"
];

export default function GamesGrid({ initialGames }: GamesGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = useMemo(() => {
    return initialGames.filter((game) => {
      // Category filtering
      const matchesCategory =
        selectedCategory === "All" ||
        game.genre.toLowerCase().includes(selectedCategory.toLowerCase());

      // Search query filtering
      const matchesSearch =
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [initialGames, selectedCategory, searchQuery]);

  return (
    <section id="games-grid" className="py-10 sm:py-16 md:py-24 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-10 w-full">
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Playable Arcade Vault
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Select A Game To Play
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            5 instant client-side games with scoreboards, restart buttons, keyboard and touch support.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            id="game-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games..."
            className="w-full pl-9 pr-8 py-2.5 min-h-[44px] rounded-xl bg-[#11141e] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          />
          <svg
            className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center text-zinc-400 hover:text-white text-xs"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills with smooth touch-pan */}
      <div className="flex items-center gap-2 overflow-x-auto touch-pan-x pb-3 mb-6 scrollbar-none no-scrollbar w-full max-w-full">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 sm:px-4 py-2 min-h-[40px] rounded-xl text-xs font-bold tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? "bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.35)]"
                  : "bg-[#11141e] text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-zinc-400 mb-6">
        <span>
          Showing <strong className="text-white font-mono">{filteredGames.length}</strong> of{" "}
          <strong className="text-white font-mono">{initialGames.length}</strong> games
        </span>
        {(selectedCategory !== "All" || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="text-cyan-400 hover:underline cursor-pointer min-h-[32px] flex items-center"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid of Game Cards: 1 column on mobile, 2 on tablet, 3-4 on desktop */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
          {filteredGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-white/10 bg-[#10131d] p-8 sm:p-12 text-center space-y-4 w-full">
          <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">No Game Match Found</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            We couldn&apos;t find any titles matching &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="px-5 py-2.5 min-h-[44px] rounded-xl bg-cyan-400 text-black text-sm font-bold shadow-lg hover:brightness-110 transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
