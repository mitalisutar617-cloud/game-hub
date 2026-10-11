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
    <section id="games-grid" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Playable Arcade Vault
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Select A Game To Play
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            5 instant client-side games with scoreboards, restart buttons, keyboard and touch support.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            id="game-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games..."
            className="w-full sm:w-64 pl-9 pr-4 py-2.5 rounded-xl bg-[#11141e] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
          >
          </input>
          <svg
            className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
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
          <strong className="text-white font-mono">{initialGames.length}</strong> playable games
        </span>
        {(selectedCategory !== "All" || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid of Game Cards */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-white/10 bg-[#10131d] p-12 text-center space-y-4">
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
            className="px-5 py-2.5 rounded-xl bg-cyan-400 text-black text-sm font-bold shadow-lg hover:brightness-110 transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
