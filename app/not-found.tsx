import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] px-4 text-center py-20">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_30px_rgba(0,240,255,0.2)]">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>

      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest bg-red-500/20 text-red-400 border border-red-500/30 mb-3">
        SIGNAL LOST // ERROR 404
      </span>

      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
        Game Sector Not Found
      </h1>

      <p className="text-sm sm:text-base text-zinc-400 max-w-md mb-8 leading-relaxed">
        The game cartridge or sector you are attempting to access does not exist in the NEXUS database or has been decommissioned.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-sm font-bold shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all active:scale-95"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Return to Gaming Hub</span>
      </Link>
    </div>
  );
}
