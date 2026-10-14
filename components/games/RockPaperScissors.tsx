"use client";

import { useState, useEffect, useCallback } from "react";

type Choice = "rock" | "paper" | "scissors";

interface ChoiceInfo {
  id: Choice;
  label: string;
  emoji: string;
  beats: Choice;
  color: string;
}

const CHOICES: ChoiceInfo[] = [
  { id: "rock", label: "Rock", emoji: "🪨", beats: "scissors", color: "from-amber-500 to-red-600" },
  { id: "paper", label: "Paper", emoji: "📄", beats: "rock", color: "from-blue-500 to-indigo-600" },
  { id: "scissors", label: "Scissors", emoji: "✂️", beats: "paper", color: "from-purple-500 to-pink-600" }
];

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<"win" | "lose" | "tie" | null>(null);
  const [scores, setScores] = useState({ player: 0, computer: 0, ties: 0, streak: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState<Array<{ player: Choice; computer: Choice; outcome: "win" | "lose" | "tie" }>>([]);

  const playRound = useCallback(
    (choice: Choice) => {
      if (isAnimating) return;

      setIsAnimating(true);
      setPlayerChoice(choice);
      setComputerChoice(null);
      setResult(null);

      // Brief animation reveal delay
      setTimeout(() => {
        const randomChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)].id;
        setComputerChoice(randomChoice);

        let outcome: "win" | "lose" | "tie";
        if (choice === randomChoice) {
          outcome = "tie";
          setScores((s) => ({ ...s, ties: s.ties + 1 }));
        } else {
          const currentChoiceInfo = CHOICES.find((c) => c.id === choice)!;
          if (currentChoiceInfo.beats === randomChoice) {
            outcome = "win";
            setScores((s) => ({
              ...s,
              player: s.player + 1,
              streak: s.streak + 1
            }));
          } else {
            outcome = "lose";
            setScores((s) => ({
              ...s,
              computer: s.computer + 1,
              streak: 0
            }));
          }
        }

        setResult(outcome);
        setHistory((prev) => [{ player: choice, computer: randomChoice, outcome }, ...prev.slice(0, 4)]);
        setIsAnimating(false);
      }, 400);
    },
    [isAnimating]
  );

  const resetGame = useCallback(() => {
    setScores({ player: 0, computer: 0, ties: 0, streak: 0 });
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setHistory([]);
  }, []);

  // Keyboard navigation: 1=Rock, 2=Paper, 3=Scissors, R=Reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "1") playRound("rock");
      else if (e.key === "2") playRound("paper");
      else if (e.key === "3") playRound("scissors");
      else if (e.key === "r" || e.key === "R") resetGame();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playRound, resetGame]);

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto p-2 sm:p-6 w-full">
      {/* Scoreboard Display - ABOVE BOARD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full mb-3 sm:mb-4">
        <div className="p-2 sm:p-3 rounded-xl bg-[#11141e] border border-cyan-500/30 text-center">
          <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">You</div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">{scores.player}</div>
        </div>

        <div className="p-2 sm:p-3 rounded-xl bg-[#11141e] border border-white/10 text-center">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ties</div>
          <div className="text-xl sm:text-2xl font-black text-zinc-300 font-mono mt-0.5">{scores.ties}</div>
        </div>

        <div className="p-2 sm:p-3 rounded-xl bg-[#11141e] border border-rose-500/30 text-center">
          <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">CPU</div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">{scores.computer}</div>
        </div>

        <div className="p-2 sm:p-3 rounded-xl bg-[#11141e] border border-amber-500/30 text-center">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Streak</div>
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono mt-0.5">{scores.streak} 🔥</div>
        </div>
      </div>

      {/* Reset Scores Action Button - ABOVE BOARD */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6 w-full">
        <button
          onClick={resetGame}
          className="w-full min-h-[44px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Reset Scores (R)</span>
        </button>
      </div>

      {/* Duel Arena Arena Card - Scaled to screen width, aspect-square, touch-action: none */}
      <div
        className="w-full max-w-[400px] aspect-square rounded-2xl bg-[#0c0f17] border border-white/10 p-3 sm:p-6 shadow-2xl relative overflow-hidden mx-auto touch-none select-none flex flex-col justify-between"
        style={{ touchAction: "none" }}
      >
        <div className="grid grid-cols-2 gap-3 sm:gap-4 items-center my-auto">
          {/* Player Arena Slot */}
          <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Your Weapon
            </span>
            <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl transition-all border ${
              playerChoice
                ? "bg-[#161c29] border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-105"
                : "bg-[#11141e] border-white/10 text-zinc-600"
            }`}>
              {playerChoice ? CHOICES.find((c) => c.id === playerChoice)?.emoji : "❓"}
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-zinc-300 capitalize">
              {playerChoice || "Pick move"}
            </span>
          </div>

          {/* Computer Arena Slot */}
          <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
              Cyber CPU
            </span>
            <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl transition-all border ${
              computerChoice
                ? "bg-[#161c29] border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-105"
                : "bg-[#11141e] border-white/10 text-zinc-600"
            }`}>
              {isAnimating ? (
                <span className="text-3xl animate-spin">🌀</span>
              ) : computerChoice ? (
                CHOICES.find((c) => c.id === computerChoice)?.emoji
              ) : (
                "🤖"
              )}
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-zinc-300 capitalize">
              {isAnimating ? "Thinking..." : computerChoice || "Ready"}
            </span>
          </div>
        </div>

        {/* Result Status Banner */}
        <div className="h-10 flex items-center justify-center text-center">
          {result === "win" ? (
            <span className="px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
              🎉 Round Won! Nice Strike!
            </span>
          ) : result === "lose" ? (
            <span className="px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
              💀 CPU Won! Try Again
            </span>
          ) : result === "tie" ? (
            <span className="px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              🤝 Stalemate! Both identical
            </span>
          ) : (
            <span className="text-xs text-zinc-500">Pick your weapon below to duel</span>
          )}
        </div>
      </div>

      {/* Choice Buttons for Touch / Mouse - at least 44px tall */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mt-4 sm:mt-6">
        {CHOICES.map((choice, idx) => (
          <button
            key={choice.id}
            id={`rps-choice-${choice.id}`}
            onClick={() => playRound(choice.id)}
            disabled={isAnimating}
            className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 p-3 sm:p-4 min-h-[64px] rounded-xl bg-[#121622] hover:bg-[#1a2133] active:scale-95 border border-white/10 hover:border-cyan-400 transition-all cursor-pointer shadow-lg group select-none"
          >
            <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
              {choice.emoji}
            </span>
            <span className="text-xs font-bold text-white tracking-wide">
              {choice.label}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Key [{idx + 1}]
            </span>
          </button>
        ))}
      </div>

      {/* Recent History Feed */}
      {history.length > 0 && (
        <div className="w-full mt-4 sm:mt-6 p-3 rounded-xl bg-[#11141e] border border-white/5">
          <div className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider mb-2">
            Recent Rounds
          </div>
          <div className="flex items-center gap-2 overflow-x-auto touch-pan-x pb-1">
            {history.map((h, i) => (
              <div
                key={i}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 shrink-0 ${
                  h.outcome === "win"
                    ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                    : h.outcome === "lose"
                    ? "bg-rose-950/60 text-rose-400 border border-rose-500/30"
                    : "bg-zinc-800 text-zinc-300 border border-white/10"
                }`}
              >
                <span>{CHOICES.find((c) => c.id === h.player)?.emoji}</span>
                <span className="text-[10px]">vs</span>
                <span>{CHOICES.find((c) => c.id === h.computer)?.emoji}</span>
                <span className="text-[10px] uppercase ml-1">
                  {h.outcome === "win" ? "W" : h.outcome === "lose" ? "L" : "D"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control hints */}
      <p className="text-[11px] text-zinc-500 mt-4 text-center">
        Controls: Tap weapon buttons or press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">1</kbd> (Rock), <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">2</kbd> (Paper), <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">3</kbd> (Scissors).
      </p>
    </div>
  );
}
