"use client";

import { useState, useEffect, useCallback } from "react";

type SquareValue = "X" | "O" | null;
type GameMode = "ai" | "pvp";

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

export default function TicTacToe() {
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [mode, setMode] = useState<GameMode>("ai");
  const [scores, setScores] = useState({ x: 0, o: 0, ties: 0 });
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Check for winner
  const checkWinner = (
    currentBoard: SquareValue[]
  ): { winner: SquareValue | "tie"; combo: number[] } | null => {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return { winner: currentBoard[a], combo };
      }
    }
    if (currentBoard.every((cell) => cell !== null)) {
      return { winner: "tie", combo: [] };
    }
    return null;
  };

  const winResult = checkWinner(board);

  // Restart Round
  const restartRound = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setIsAiThinking(false);
  }, []);

  // Reset entire scoreboard
  const resetScores = () => {
    setScores({ x: 0, o: 0, ties: 0 });
    restartRound();
  };

  // Best move for AI
  const getBestMove = (currentBoard: SquareValue[]): number => {
    const available = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((idx): idx is number => idx !== null);

    // 1. Can AI win in one move?
    for (const idx of available) {
      const temp = [...currentBoard];
      temp[idx] = "O";
      if (checkWinner(temp)?.winner === "O") return idx;
    }

    // 2. Can Player X win in one move? Block them!
    for (const idx of available) {
      const temp = [...currentBoard];
      temp[idx] = "X";
      if (checkWinner(temp)?.winner === "X") return idx;
    }

    // 3. Take Center if open
    if (currentBoard[4] === null) return 4;

    // 4. Take Corners
    const corners = [0, 2, 6, 8].filter((c) => currentBoard[c] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // 5. Take any remaining
    return available[Math.floor(Math.random() * available.length)];
  };

  // Handle cell click
  const handleClick = useCallback(
    (index: number) => {
      if (board[index] || winResult || isAiThinking) return;

      const newBoard = [...board];
      newBoard[index] = isXNext ? "X" : "O";
      setBoard(newBoard);

      const result = checkWinner(newBoard);
      if (result) {
        if (result.winner === "X") {
          setScores((s) => ({ ...s, x: s.x + 1 }));
        } else if (result.winner === "O") {
          setScores((s) => ({ ...s, o: s.o + 1 }));
        } else {
          setScores((s) => ({ ...s, ties: s.ties + 1 }));
        }
        return;
      }

      if (mode === "ai" && isXNext) {
        setIsXNext(false);
        setIsAiThinking(true);
      } else {
        setIsXNext(!isXNext);
      }
    },
    [board, winResult, isAiThinking, isXNext, mode]
  );

  // AI Turn effect
  useEffect(() => {
    if (mode === "ai" && !isXNext && !winResult) {
      const timer = setTimeout(() => {
        const move = getBestMove(board);
        if (move !== undefined) {
          const newBoard = [...board];
          newBoard[move] = "O";
          setBoard(newBoard);

          const result = checkWinner(newBoard);
          if (result) {
            if (result.winner === "O") {
              setScores((s) => ({ ...s, o: s.o + 1 }));
            } else if (result.winner === "tie") {
              setScores((s) => ({ ...s, ties: s.ties + 1 }));
            }
          }
          setIsXNext(true);
          setIsAiThinking(false);
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [mode, isXNext, board, winResult]);

  // Keyboard controls: 1-9 to play, 'R' to restart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        restartRound();
        return;
      }

      // Map keypad / standard numbers 1-9 to grid indices
      const keyMap: Record<string, number> = {
        "7": 0, "8": 1, "9": 2, // Standard Numpad layout top row
        "4": 3, "5": 4, "6": 5, // Middle row
        "1": 6, "2": 7, "3": 8, // Bottom row
      };

      // Also support sequential 1-9 (1=top-left, 9=bottom-right)
      const standardKeys: Record<string, number> = {
        "1": 0, "2": 1, "3": 2,
        "4": 3, "5": 4, "6": 5,
        "7": 6, "8": 7, "9": 8
      };

      // If user presses standard top-row number
      const mappedIndex = standardKeys[e.key] ?? keyMap[e.key];
      if (mappedIndex !== undefined) {
        handleClick(mappedIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClick, restartRound]);

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto p-4 sm:p-6 w-full">
      {/* Mode Selector */}
      <div className="flex items-center gap-2 mb-6 p-1 rounded-xl bg-[#121622] border border-white/10">
        <button
          onClick={() => {
            setMode("ai");
            restartRound();
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            mode === "ai"
              ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Solo vs AI
        </button>
        <button
          onClick={() => {
            setMode("pvp");
            restartRound();
          }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            mode === "pvp"
              ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          2 Players (Local)
        </button>
      </div>

      {/* Scoreboard Display */}
      <div className="grid grid-cols-3 gap-3 w-full mb-6">
        <div className={`p-3.5 rounded-xl border text-center transition-all ${
          isXNext && !winResult
            ? "bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            : "bg-[#11141e] border-white/10"
        }`}>
          <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
            {mode === "ai" ? "Player (X)" : "Player X"}
          </div>
          <div className="text-2xl font-black text-white font-mono mt-0.5">{scores.x}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#11141e] border border-white/10 text-center">
          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Ties</div>
          <div className="text-2xl font-black text-zinc-300 font-mono mt-0.5">{scores.ties}</div>
        </div>

        <div className={`p-3.5 rounded-xl border text-center transition-all ${
          !isXNext && !winResult
            ? "bg-rose-950/40 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
            : "bg-[#11141e] border-white/10"
        }`}>
          <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
            {mode === "ai" ? "Cyber AI (O)" : "Player O"}
          </div>
          <div className="text-2xl font-black text-white font-mono mt-0.5">{scores.o}</div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="mb-6 h-8 flex items-center justify-center text-center">
        {winResult ? (
          winResult.winner === "tie" ? (
            <span className="text-sm font-bold text-yellow-400 uppercase tracking-wider">
              🤝 Stalemate! It&apos;s a Draw
            </span>
          ) : (
            <span className="text-sm font-black text-emerald-400 uppercase tracking-wider animate-pulse">
              🎉 {winResult.winner === "X" ? (mode === "ai" ? "You Won!" : "Player X Won!") : (mode === "ai" ? "Cyber AI Won!" : "Player O Won!")}
            </span>
          )
        ) : isAiThinking ? (
          <span className="text-sm font-semibold text-rose-400 animate-pulse flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
            AI is calculating move...
          </span>
        ) : (
          <span className="text-xs font-semibold text-zinc-400">
            Current Move:{" "}
            <strong className={isXNext ? "text-cyan-400" : "text-rose-400"}>
              {isXNext ? "Player X" : mode === "ai" ? "Cyber AI (O)" : "Player O"}
            </strong>
          </span>
        )}
      </div>

      {/* 3x3 Game Board */}
      <div className="relative p-3 rounded-2xl bg-[#0c0f17] border border-white/10 shadow-2xl">
        <div className="grid grid-cols-3 gap-3 w-64 sm:w-72 h-64 sm:h-72">
          {board.map((cell, idx) => {
            const isWinningCell = winResult?.combo.includes(idx);
            return (
              <button
                key={idx}
                id={`tictactoe-cell-${idx}`}
                onClick={() => handleClick(idx)}
                disabled={Boolean(cell || winResult || isAiThinking)}
                className={`relative flex items-center justify-center rounded-xl font-mono text-4xl sm:text-5xl font-black transition-all select-none ${
                  cell === null
                    ? "bg-[#141824] hover:bg-[#1c2233] active:scale-95 cursor-pointer border border-white/5"
                    : isWinningCell
                    ? cell === "X"
                      ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(0,240,255,0.8)] scale-105"
                      : "bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.8)] scale-105"
                    : cell === "X"
                    ? "bg-[#141824] text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                    : "bg-[#141824] text-rose-400 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                }`}
                aria-label={`Square ${idx + 1}, ${cell || "empty"}`}
              >
                {cell}
                {cell === null && (
                  <span className="absolute bottom-1 right-1.5 text-[9px] font-mono text-zinc-600">
                    {idx + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-8 w-full">
        <button
          onClick={restartRound}
          className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Restart Round (R)</span>
        </button>

        <button
          onClick={resetScores}
          className="py-3 px-4 rounded-xl font-semibold text-xs text-zinc-400 hover:text-white bg-[#141824] hover:bg-white/10 border border-white/10 transition-all"
        >
          Reset Scores
        </button>
      </div>

      {/* Control hints */}
      <p className="text-[11px] text-zinc-500 mt-4 text-center">
        Tip: Press keys <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">1</kbd> to <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">9</kbd> on keyboard or tap squares to place your mark.
      </p>
    </div>
  );
}
