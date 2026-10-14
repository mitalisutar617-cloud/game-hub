import { getAllGames, getFeaturedGames } from "@/lib/games";
import Hero from "@/components/Hero";
import GamesGrid from "@/components/GamesGrid";

export default function Home() {
  const games = getAllGames();
  const featuredGames = getFeaturedGames();
  const heroSpotlight = featuredGames[0] || games[0];

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <Hero featuredGame={heroSpotlight} />

      {/* Featured Banner / Quick Highlight Bar */}
      <section className="border-y border-white/5 bg-[#0b0e17]/60 py-4 sm:py-6" id="trending">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3">
              <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-mono font-bold uppercase tracking-wider shrink-0">
                ⚡ PLAYABLE ARCADE
              </span>
              <p className="text-xs sm:text-sm text-zinc-300 font-medium">
                Instant in-browser duels: <span className="text-white font-semibold">Neon Snake</span>, <span className="text-white font-semibold">Tic-Tac-Toe</span>, & <span className="text-white font-semibold">Whack-A-Mole</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-6 text-xs text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Touch & Swipe Ready
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Full Keyboard Support
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Local High Scores
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Game Cards */}
      <GamesGrid initialGames={games} />
    </div>
  );
}
