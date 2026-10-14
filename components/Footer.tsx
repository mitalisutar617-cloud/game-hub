import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#06070a] text-zinc-400 mt-12 sm:mt-20 w-full overflow-hidden" id="community">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 text-center sm:text-left">

          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4 flex flex-col items-center sm:items-start">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 p-[2px]">
                <div className="w-full h-full bg-[#08090e] rounded-[6px] flex items-center justify-center">
                  <span className="text-cyan-400 font-black text-sm">NX</span>
                </div>
              </div>
              <span className="text-lg font-black tracking-wider text-white font-mono">
                NEXUS<span className="text-cyan-400">.</span>HUB
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed mx-auto sm:mx-0">
              The premier digital destination for next-generation interactive experiences, esports tournaments, and gaming intelligence.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Global Network Online
              </span>
            </div>
          </div>

          {/* Nav Column 1: Explore */}
          <div className="space-y-3 flex flex-col items-center sm:items-start">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Directory
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-sm flex flex-col items-center sm:items-start">
              <li>
                <Link href="/#games-grid" className="min-h-[40px] flex items-center text-zinc-400 hover:text-cyan-400 transition-colors">
                  All Games
                </Link>
              </li>
              <li>
                <a href="#featured" className="min-h-[40px] flex items-center text-zinc-400 hover:text-cyan-400 transition-colors">
                  Featured Spotlight
                </a>
              </li>
              <li>
                <Link href="/games/tic-tac-toe" className="min-h-[40px] flex items-center text-zinc-400 hover:text-cyan-400 transition-colors">
                  Tic-Tac-Toe
                </Link>
              </li>
              <li>
                <Link href="/games/snake" className="min-h-[40px] flex items-center text-zinc-400 hover:text-cyan-400 transition-colors">
                  Neon Snake
                </Link>
              </li>
              <li>
                <Link href="/games/whack-a-mole" className="min-h-[40px] flex items-center text-zinc-400 hover:text-cyan-400 transition-colors">
                  Whack-A-Mole
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 2: Ecosystem */}
          <div className="space-y-3 flex flex-col items-center sm:items-start">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Ecosystem
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-sm flex flex-col items-center sm:items-start">
              <li>
                <span className="min-h-[40px] flex items-center text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer">
                  Cloud Stream 4K
                </span>
              </li>
              <li>
                <span className="min-h-[40px] flex items-center text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer">
                  Tournaments & Leaderboard
                </span>
              </li>
              <li>
                <span className="min-h-[40px] flex items-center text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer">
                  System Benchmarks
                </span>
              </li>
              <li>
                <span className="min-h-[40px] flex items-center text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer">
                  Developer API
                </span>
              </li>
            </ul>
          </div>

          {/* Nav Column 3: Dispatch Newsletter */}
          <div className="space-y-3 flex flex-col items-center sm:items-start w-full">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Intel Dispatch
            </h4>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto sm:mx-0">
              Receive weekly releases, insider beta invites, and patch notes.
            </p>
            <div className="flex flex-col gap-2 pt-1 w-full max-w-xs mx-auto sm:mx-0">
              <input
                type="email"
                placeholder="operative@nexus.gg"
                className="w-full px-3.5 py-2.5 min-h-[44px] rounded-lg bg-[#11141e] border border-white/10 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-cyan-400 text-center sm:text-left"
              />
              <button
                type="button"
                className="w-full py-2.5 px-3 min-h-[44px] rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center justify-center active:scale-98"
              >
                Subscribe to Feed
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 sm:pt-12 mt-8 sm:mt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 text-xs text-zinc-500">
          <p>© 2026 NEXUS GAMING HUB. Engineered for next-gen performance.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span className="hover:text-zinc-400 transition-colors cursor-pointer min-h-[36px] flex items-center">Privacy Protocol</span>
            <span className="hover:text-zinc-400 transition-colors cursor-pointer min-h-[36px] flex items-center">Terms of Combat</span>
            <span className="hover:text-zinc-400 transition-colors cursor-pointer min-h-[36px] flex items-center">Security Ops</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
