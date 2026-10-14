import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { games, getGameBySlug, getSimilarGames } from "@/lib/games";
import GameCard from "@/components/GameCard";

// Import all 5 playable client components
import TicTacToe from "@/components/games/TicTacToe";
import Snake from "@/components/games/Snake";
import MemoryMatch from "@/components/games/MemoryMatch";
import RockPaperScissors from "@/components/games/RockPaperScissors";
import WhackAMole from "@/components/games/WhackAMole";

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return games.map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    return {
      title: "Game Not Found // NEXUS",
      description: "The requested game title does not exist in the NEXUS vault.",
    };
  }

  return {
    title: `Play ${game.title} Online - Free Arcade Game // NEXUS`,
    description: game.description,
    openGraph: {
      title: `Play ${game.title} // NEXUS ARCADE`,
      description: game.description,
    },
  };
}

export default async function GameDetailPage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const similarGames = getSimilarGames(game.slug, 3);

  // Render the matching client component based on slug
  const renderGameComponent = () => {
    switch (game.slug) {
      case "tic-tac-toe":
        return <TicTacToe />;
      case "snake":
        return <Snake />;
      case "memory-match":
        return <MemoryMatch />;
      case "rock-paper-scissors":
        return <RockPaperScissors />;
      case "whack-a-mole":
        return <WhackAMole />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col flex-1 pb-24">
      {/* Top Breadcrumb & Return Bar */}
      <div className="border-b border-white/10 bg-[#0a0d14]/70 backdrop-blur-md sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <Link
            href="/#games-grid"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-cyan-400 font-semibold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Game Vault</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-2 text-zinc-500 font-medium">
            <Link href="/" className="hover:text-zinc-300">Nexus</Link>
            <span>/</span>
            <Link href="/#games-grid" className="hover:text-zinc-300">Games</Link>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">{game.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="relative overflow-hidden py-10 sm:py-12 border-b border-white/10 bg-[#0a0c13]">
        {/* Background glow tailored to game gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-gradient-to-r from-cyan-600/15 via-purple-600/15 to-pink-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-4">
          {/* Badge & Genre */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-400 text-black shadow-md">
              {game.genre}
            </span>
            {game.badge && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-zinc-300 border border-white/10">
                {game.badge}
              </span>
            )}
          </div>

          {/* Title & Emoji */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl sm:text-5xl drop-shadow-md select-none">{game.thumbnail}</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              {game.title}
            </h1>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
            {game.description}
          </p>
        </div>
      </section>

      {/* Interactive Game Arena Container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 w-full">
        <div className="relative rounded-3xl bg-[#0b0e16] border border-white/15 p-4 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Playable Client Game */}
          {renderGameComponent()}
        </div>
      </section>

      {/* Instructions & Controls Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* How to Play */}
          <div className="rounded-2xl bg-[#0f121a] border border-white/10 p-6 space-y-3">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <span>📖</span>
              <span>How To Play</span>
            </h3>
            <ul className="space-y-2 text-xs text-zinc-300">
              {game.instructions.map((inst, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Controls Reference */}
          <div className="rounded-2xl bg-[#0f121a] border border-white/10 p-6 space-y-4">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <span>🎮</span>
              <span>Controls Reference</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-white block mb-1">Keyboard:</span>
                <ul className="space-y-1 text-zinc-300 pl-2">
                  {game.controls.keyboard.map((ctrl, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-zinc-500 font-mono">›</span>
                      <span>{ctrl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-white block mb-1">Touch & Mobile:</span>
                <ul className="space-y-1 text-zinc-300 pl-2">
                  {game.controls.touch.map((ctrl, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-zinc-500 font-mono">›</span>
                      <span>{ctrl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* Other Playable Games in the Vault */}
        {similarGames.length > 0 && (
          <section className="mt-16 pt-12 border-t border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  More Arcade Challenges
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                  Other Games In The Vault
                </h2>
              </div>
              <Link
                href="/#games-grid"
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                <span>View All 5 Games</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarGames.map((simGame) => (
                <GameCard key={simGame.slug} game={simGame} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
