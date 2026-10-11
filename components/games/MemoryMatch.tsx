"use client";

import { useState, useEffect, useCallback } from "react";

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ICONS = ["🎮", "🕹️", "👾", "🎲", "⚔️", "🛡️", "💎", "🚀"];

function generateShuffledCards(): Card[] {
  const cardPairs = [...ICONS, ...ICONS];
  // Fisher-Yates Shuffle
  for (let i = cardPairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
  }
  return cardPairs.map((icon, idx) => ({
    id: idx,
    icon,
    isFlipped: false,
    isMatched: false
  }));
}

export default function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matches, setMatches] = useState<number>(0);
  const [bestMoves, setBestMoves] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Load Best Score
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nexus_memory_best");
      if (saved) setBestMoves(parseInt(saved, 10));
    } catch {
      // Ignore
    }
  }, []);

  // Initialize Cards
  const initializeGame = useCallback(() => {
    setCards(generateShuffledCards());
    setFlippedIndices([]);
    setMoves(0);
    setMatches(0);
    setIsLocked(false);
    setFocusedIndex(0);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Flip Card Action
  const flipCard = useCallback(
    (index: number) => {
      if (isLocked) return;
      const card = cards[index];
      if (!card || card.isFlipped || card.isMatched) return;

      const newCards = [...cards];
      newCards[index] = { ...card, isFlipped: true };
      setCards(newCards);

      const newFlipped = [...flippedIndices, index];
      setFlippedIndices(newFlipped);

      // If second card flipped
      if (newFlipped.length === 2) {
        setIsLocked(true);
        setMoves((m) => m + 1);

        const [firstIdx, secondIdx] = newFlipped;
        const firstCard = newCards[firstIdx];
        const secondCard = newCards[secondIdx];

        if (firstCard.icon === secondCard.icon) {
          // MATCH!
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c, i) =>
                i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
              )
            );
            setMatches((m) => {
              const newMatches = m + 1;
              if (newMatches === 8) {
                // Game Completed!
                setBestMoves((prev) => {
                  const currentTotalMoves = moves + 1;
                  const newBest = prev ? Math.min(prev, currentTotalMoves) : currentTotalMoves;
                  try {
                    localStorage.setItem("nexus_memory_best", newBest.toString());
                  } catch {
                    // Ignore
                  }
                  return newBest;
                });
              }
              return newMatches;
            });
            setFlippedIndices([]);
            setIsLocked(false);
          }, 400);
        } else {
          // NO MATCH: Flip back after delay
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c, i) =>
                i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
              )
            );
            setFlippedIndices([]);
            setIsLocked(false);
          }, 900);
        }
      }
    },
    [cards, flippedIndices, isLocked, moves]
  );

  // Keyboard navigation: Arrows to move focus, Enter/Space to flip, 'R' to restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        initializeGame();
        return;
      }

      const rowLength = 4; // 4x4 grid
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % 16);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + 16) % 16);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev + rowLength) % 16);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev - rowLength + 16) % 16);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flipCard(focusedIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, flipCard, initializeGame]);

  const isGameWon = matches === 8;

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto p-4 sm:p-6 w-full">
      {/* Scoreboard Display */}
      <div className="grid grid-cols-3 gap-3 w-full mb-6">
        <div className="p-3.5 rounded-xl bg-[#11141e] border border-cyan-500/30 text-center">
          <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Moves</div>
          <div className="text-2xl font-black text-white font-mono mt-0.5">{moves}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#11141e] border border-white/10 text-center">
          <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Matched</div>
          <div className="text-2xl font-black text-purple-300 font-mono mt-0.5">
            {matches} / 8
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#11141e] border border-white/10 text-center">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Best</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
            {bestMoves !== null ? `${bestMoves}` : "—"}
          </div>
        </div>
      </div>

      {/* 4x4 Card Matrix */}
      <div className="relative p-3 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-2xl">
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-72 sm:w-80 md:w-96">
          {cards.map((card, idx) => {
            const isFocused = focusedIndex === idx;
            return (
              <button
                key={card.id}
                id={`memory-card-${idx}`}
                onClick={() => {
                  setFocusedIndex(idx);
                  flipCard(idx);
                }}
                disabled={card.isFlipped || card.isMatched || isLocked}
                aria-label={`Card ${idx + 1}, ${card.isMatched ? "matched" : card.isFlipped ? card.icon : "hidden"}`}
                className={`aspect-square rounded-xl text-3xl sm:text-4xl flex items-center justify-center transition-all select-none duration-300 cursor-pointer ${
                  card.isMatched
                    ? "bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-95"
                    : card.isFlipped
                    ? "bg-[#1c2233] border border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.4)] rotate-0"
                    : "bg-[#141824] hover:bg-[#1a2030] active:scale-95 border border-white/5 text-transparent hover:border-cyan-500/30"
                } ${isFocused ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0c0f17]" : ""}`}
              >
                {card.isFlipped || card.isMatched ? (
                  <span className="transform transition-transform scale-100">{card.icon}</span>
                ) : (
                  <span className="text-sm font-mono text-zinc-600 font-bold">?</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Victory Celebration Modal Overlay */}
        {isGameWon && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20">
            <span className="text-5xl mb-2 animate-bounce">🏆</span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
              NEURAL MATRIX SOLVED
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">All Pairs Matched!</h3>
            <p className="text-sm text-zinc-300 mt-1">
              Completed in <strong className="text-cyan-400 font-mono">{moves} moves</strong>.
            </p>
            <div className="flex items-center gap-1 my-3 text-yellow-400 text-xl">
              {moves <= 16 ? "★★★" : moves <= 24 ? "★★☆" : "★☆☆"}
            </div>
            <button
              onClick={initializeGame}
              className="mt-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all active:scale-95"
            >
              Play Again (R)
            </button>
          </div>
        )}
      </div>

      {/* Restart Button */}
      <div className="flex items-center gap-3 mt-6 w-full">
        <button
          onClick={initializeGame}
          className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Restart & Reshuffle (R)</span>
        </button>
      </div>

      {/* Control hints */}
      <p className="text-[11px] text-zinc-500 mt-4 text-center">
        Controls: Tap cards or navigate with <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">Arrow Keys</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">Enter/Space</kbd> to flip.
      </p>
    </div>
  );
}
