"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface MoleHole {
  id: number;
  isActive: boolean;
  isGolden: boolean;
  isHit: boolean;
}

const TOTAL_TIME = 30; // 30 seconds game

export default function WhackAMole() {
  const [holes, setHoles] = useState<MoleHole[]>(
    Array.from({ length: 9 }, (_, i) => ({
      id: i,
      isActive: false,
      isGolden: false,
      isHit: false
    }))
  );
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hits, setHits] = useState<number>(0);
  const [misses, setMisses] = useState<number>(0);

  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Load High Score
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nexus_whack_high");
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {
      // Ignore
    }
  }, []);

  // Whack mole by hole index
  const whack = useCallback((index: number) => {
    if (!isPlayingRef.current) return;

    setHoles((prevHoles) => {
      const target = prevHoles[index];
      if (target.isActive && !target.isHit) {
        // Hit!
        const points = target.isGolden ? 30 : 10;
        setScore((s) => {
          const nextScore = s + points;
          setHighScore((hs) => {
            const nextHs = Math.max(hs, nextScore);
            try {
              localStorage.setItem("nexus_whack_high", nextHs.toString());
            } catch {
              // Ignore
            }
            return nextHs;
          });
          return nextScore;
        });
        setHits((h) => h + 1);

        return prevHoles.map((h, i) =>
          i === index ? { ...h, isHit: true } : h
        );
      } else if (!target.isActive) {
        // Missed click on empty hole
        setMisses((m) => m + 1);
        return prevHoles;
      }
      return prevHoles;
    });
  }, []);

  // Start or Restart Game
  const startGame = useCallback(() => {
    setScore(0);
    setHits(0);
    setMisses(0);
    setTimeLeft(TOTAL_TIME);
    setIsPlaying(true);
    setHoles(
      Array.from({ length: 9 }, (_, i) => ({
        id: i,
        isActive: false,
        isGolden: false,
        isHit: false
      }))
    );
  }, []);

  // Countdown Timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          setHoles((h) => h.map((hole) => ({ ...hole, isActive: false })));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Mole pop-up logic
  useEffect(() => {
    if (!isPlaying) return;

    const popupInterval = setInterval(() => {
      const randomHole = Math.floor(Math.random() * 9);
      const isGolden = Math.random() < 0.2; // 20% golden bonus mole

      setHoles((prev) =>
        prev.map((h, i) =>
          i === randomHole
            ? { ...h, isActive: true, isGolden, isHit: false }
            : h
        )
      );

      // Hide after timeout
      const hideTimeout = setTimeout(() => {
        setHoles((prev) =>
          prev.map((h, i) => (i === randomHole ? { ...h, isActive: false, isHit: false } : h))
        );
      }, Math.max(600, 1100 - (TOTAL_TIME - timeLeft) * 15));

      return () => clearTimeout(hideTimeout);
    }, 700);

    return () => clearInterval(popupInterval);
  }, [isPlaying, timeLeft]);

  // Keyboard navigation: 1-9 to whack corresponding hole, 'R' to restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        startGame();
        return;
      }

      // Standard top-row & numpad 1-9
      const keyMap: Record<string, number> = {
        "1": 0, "2": 1, "3": 2,
        "4": 3, "5": 4, "6": 5,
        "7": 6, "8": 7, "9": 8
      };

      if (keyMap[e.key] !== undefined) {
        whack(keyMap[e.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [whack, startGame]);

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto p-4 sm:p-6 w-full">
      {/* Scoreboard Display */}
      <div className="grid grid-cols-4 gap-2.5 w-full mb-6">
        <div className="p-3 rounded-xl bg-[#11141e] border border-cyan-500/30 text-center">
          <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Score</div>
          <div className="text-2xl font-black text-white font-mono mt-0.5">{score}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#11141e] border border-white/10 text-center">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Time</div>
          <div className={`text-2xl font-black font-mono mt-0.5 ${
            timeLeft <= 5 ? "text-rose-400 animate-pulse" : "text-amber-300"
          }`}>
            {timeLeft}s
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#11141e] border border-emerald-500/30 text-center">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">High Score</div>
          <div className="text-2xl font-black text-emerald-300 font-mono mt-0.5">{highScore}</div>
        </div>

        <div className="p-3 rounded-xl bg-[#11141e] border border-purple-500/30 text-center">
          <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Hits</div>
          <div className="text-2xl font-black text-purple-300 font-mono mt-0.5">{hits}</div>
        </div>
      </div>

      {/* 3x3 Burrow Matrix */}
      <div className="relative p-3 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-2xl">
        <div className="grid grid-cols-3 gap-3 w-64 sm:w-72 md:w-80 h-64 sm:h-72 md:h-80">
          {holes.map((hole, idx) => (
            <button
              key={hole.id}
              id={`mole-hole-${idx}`}
              onClick={() => whack(idx)}
              aria-label={`Hole ${idx + 1}, ${hole.isActive ? (hole.isGolden ? "golden mole" : "mole") : "empty"}`}
              className="relative rounded-2xl bg-[#121624] border border-white/5 hover:border-cyan-500/20 active:scale-95 flex items-center justify-center overflow-hidden transition-all cursor-pointer select-none"
            >
              {/* Hole depth ring */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#08090f] border border-white/5 flex items-center justify-center shadow-inner relative">
                {hole.isActive && (
                  <div className={`transform transition-all duration-150 flex items-center justify-center text-4xl sm:text-5xl ${
                    hole.isHit
                      ? "scale-75 opacity-40 rotate-12"
                      : "scale-100 animate-bounce"
                  }`}>
                    {hole.isHit ? "💥" : hole.isGolden ? "🤖" : "👾"}
                  </div>
                )}

                {/* Score pop text */}
                {hole.isHit && (
                  <span className={`absolute -top-1 font-mono font-black text-xs animate-ping ${
                    hole.isGolden ? "text-amber-400" : "text-cyan-400"
                  }`}>
                    {hole.isGolden ? "+30" : "+10"}
                  </span>
                )}
              </div>

              {/* Number hint */}
              <span className="absolute bottom-1 right-2 text-[9px] font-mono text-zinc-600">
                {idx + 1}
              </span>
            </button>
          ))}
        </div>

        {/* Start / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20">
            {timeLeft === 0 ? (
              <div className="space-y-3">
                <span className="text-4xl">⏱️</span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  TIME EXPIRED // FINAL SCORE
                </span>
                <h3 className="text-3xl font-black text-white">{score} Points</h3>
                <p className="text-xs text-zinc-300">
                  Total Hits: <strong className="text-cyan-400 font-mono">{hits}</strong> | Accuracy:{" "}
                  <strong className="text-emerald-400 font-mono">
                    {hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0}%
                  </strong>
                </p>
                <button
                  onClick={startGame}
                  className="mt-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all active:scale-95"
                >
                  Play Again (R)
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-4xl">🔨</span>
                <h3 className="text-2xl font-black text-white">Whack-A-Mole</h3>
                <p className="text-xs text-zinc-400 max-w-xs">
                  Whack as many cyber bots as you can in 30 seconds! Bonus golden bots award +30 points.
                </p>
                <button
                  onClick={startGame}
                  className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all active:scale-95"
                >
                  Start Game (R)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Restart / Start Action Buttons */}
      <div className="flex items-center gap-3 mt-6 w-full">
        <button
          onClick={startGame}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{isPlaying ? "Restart Game (R)" : "Start Game (R)"}</span>
        </button>
      </div>

      {/* Control hints */}
      <p className="text-[11px] text-zinc-500 mt-4 text-center">
        Controls: Tap holes or press keys <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">1</kbd> to <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">9</kbd> corresponding to the grid.
      </p>
    </div>
  );
}
