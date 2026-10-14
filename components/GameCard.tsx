import Link from "next/link";
import { Game } from "@/lib/games";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <article
      id={`game-${game.slug}`}
      className="group relative flex flex-col rounded-2xl bg-[#0f121a] border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_10px_35px_-10px_rgba(0,240,255,0.25)] hover:-translate-y-1.5 overflow-hidden"
    >
      {/* Thumbnail Gradient Banner with Emoji */}
      <Link
        href={`/games/${game.slug}`}
        className={`relative block h-44 sm:h-56 w-full overflow-hidden bg-gradient-to-tr ${game.gradient} p-4 sm:p-6 flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-102`}
      >
        {/* Ambient Dark Gradient Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />

        {/* Badge */}
        {game.badge && (
          <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5">
            <span className="px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wide uppercase bg-black/70 backdrop-blur-md text-white border border-white/15 shadow-md">
              {game.badge}
            </span>
          </div>
        )}

        {/* Playable Indicator */}
        <div className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Playable</span>
        </div>

        {/* Large Emoji / Icon Thumbnail */}
        <div className="relative text-5xl sm:text-7xl transform transition-transform duration-500 group-hover:scale-115 drop-shadow-2xl select-none">
          {game.thumbnail}
        </div>

        {/* Play Now Floating Pill */}
        <div className="absolute bottom-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-cyan-400/30 text-xs font-bold text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
          Launch Game ⚡
        </div>
      </Link>

      {/* Card Content Area */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          {/* Genre */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-cyan-400 uppercase tracking-wider text-[11px]">
              {game.genre}
            </span>
            <span className="text-zinc-500 text-[11px]">Keyboard & Touch</span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
            <Link href={`/games/${game.slug}`}>
              {game.title}
            </Link>
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-2">
            {game.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <span className="text-xs text-emerald-400 font-semibold font-mono">
            Free to Play
          </span>

          {/* Action Link (at least 44px touch target) */}
          <Link
            href={`/games/${game.slug}`}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-1 transition-all"
          >
            <span>Play Now</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
