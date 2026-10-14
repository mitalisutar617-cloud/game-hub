import Link from "next/link";
import { Game } from "@/lib/games";

interface HeroProps {
  featuredGame?: Game;
}

export default function Hero({ featuredGame }: HeroProps) {
  const spotlight: Game = featuredGame || {
    title: "Neon Snake",
    slug: "snake",
    description: "Navigate the cyber grid, consume energy power cores, and grow your digital serpent without crashing into borders or yourself.",
    thumbnail: "🐍",
    gradient: "from-emerald-400 via-teal-600 to-cyan-700",
    genre: "Arcade",
    badge: "Retro Classic",
    instructions: ["Guide snake with arrows or touch D-Pad", "Eat food pellets to grow"],
    controls: { keyboard: ["Arrow keys", "Space to pause"], touch: ["Touch D-Pad", "Swipe"] }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 md:pt-16 md:pb-28">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] md:w-[900px] h-[200px] sm:h-[350px] md:h-[450px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/15 to-purple-600/20 blur-[100px] sm:blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500/10 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Cyber grid overlay */}
      <div className="absolute inset-0 cyber-grid opacity-30 sm:opacity-40 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-4 sm:space-y-6 text-left w-full">
            
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>5 Instant Playable Web Games</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] sm:leading-[1.1]">
              PLAY DIRECTLY. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                KEYBOARD & TOUCH.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-zinc-300 max-w-xl leading-relaxed">
              Enjoy classic arcade duels and reflex challenges right in your browser. Complete with score tracking, responsive touch controls, and dark theme neon aesthetics.
            </p>

            {/* CTA Buttons - Stacked on mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-2 w-full sm:w-auto">
              <a
                href="#games-grid"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 min-h-[44px] rounded-xl font-bold text-sm text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] transition-all duration-300 active:scale-95"
              >
                <span>Browse All 5 Games</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </a>

              <Link
                href={`/games/${spotlight.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 min-h-[44px] rounded-xl font-semibold text-sm text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-cyan-500/50 transition-all duration-200"
              >
                <span>Play {spotlight.title}</span>
                <span className="text-lg">{spotlight.thumbnail}</span>
              </Link>
            </div>

            {/* Quick Metrics Ticker */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-5 sm:pt-6 border-t border-white/10 w-full max-w-lg text-center sm:text-left">
              <div>
                <p className="text-xl sm:text-2xl font-black text-white font-mono">5</p>
                <p className="text-[10px] sm:text-xs text-zinc-400 font-medium uppercase tracking-wider">Playable Games</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">100%</p>
                <p className="text-[10px] sm:text-xs text-zinc-400 font-medium uppercase tracking-wider">Client-Side</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">0s</p>
                <p className="text-[10px] sm:text-xs text-zinc-400 font-medium uppercase tracking-wider">Load Time</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Spotlight Card */}
          <div className="lg:col-span-5 relative" id="featured">
            <div className="relative group rounded-2xl overflow-hidden p-[1px] bg-gradient-to-b from-cyan-500/40 via-purple-500/20 to-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <div className="relative rounded-2xl overflow-hidden bg-[#0d1017]">
                
                {/* Gradient Banner with Large Emoji */}
                <div className={`relative h-64 sm:h-72 w-full bg-gradient-to-tr ${spotlight.gradient} flex flex-col items-center justify-center overflow-hidden`}>
                  <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-black/70 backdrop-blur-md text-white border border-white/20 shadow-lg">
                      🔥 Featured Spotlight
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Ready to Play</span>
                  </div>

                  {/* Icon */}
                  <div className="text-7xl sm:text-8xl transform transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl select-none">
                    {spotlight.thumbnail}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                      {spotlight.genre}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">
                      Controls: Keys + Touch
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
                    {spotlight.title}
                  </h3>

                  <p className="text-sm text-zinc-300 line-clamp-2 leading-relaxed">
                    {spotlight.description}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={`/games/${spotlight.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold text-sm transition-all group-hover:border-cyan-400"
                    >
                      <span>Launch {spotlight.title}</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
