"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20; // 20x20 grid
const INITIAL_SPEED = 120; // ms per tick

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
  ]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>("UP");
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Refs to prevent state closures in interval
  const directionRef = useRef<Direction>("UP");
  const snakeRef = useRef<Position[]>(snake);
  const foodRef = useRef<Position>(food);
  const isGameOverRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const hasStartedRef = useRef<boolean>(false);

  // Sync refs
  useEffect(() => {
    directionRef.current = direction;
    snakeRef.current = snake;
    foodRef.current = food;
    isGameOverRef.current = isGameOver;
    isPausedRef.current = isPaused;
    hasStartedRef.current = hasStarted;
  }, [direction, snake, food, isGameOver, isPaused, hasStarted]);

  // Load high score from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nexus_snake_highscore");
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  // Spawn food at random unoccupied position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    let collision: boolean;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      collision = currentSnake.some((seg) => seg.x === newFood.x && seg.y === newFood.y);
    } while (collision);
    return newFood;
  }, []);

  // Restart Game
  const restartGame = useCallback(() => {
    const initialSnake: Position[] = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ];
    setSnake(initialSnake);
    setDirection("UP");
    directionRef.current = "UP";
    const initialFood = generateFood(initialSnake);
    setFood(initialFood);
    foodRef.current = initialFood;
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
  }, [generateFood]);

  // Handle Direction Change
  const changeDirection = useCallback((newDir: Direction) => {
    if (!hasStartedRef.current) {
      setHasStarted(true);
    }
    const current = directionRef.current;
    if (
      (newDir === "UP" && current !== "DOWN") ||
      (newDir === "DOWN" && current !== "UP") ||
      (newDir === "LEFT" && current !== "RIGHT") ||
      (newDir === "RIGHT" && current !== "LEFT")
    ) {
      setDirection(newDir);
      directionRef.current = newDir;
    }
  }, []);

  // Main game tick
  useEffect(() => {
    if (!hasStarted || isGameOver || isPaused) return;

    const interval = setInterval(() => {
      const currentSnake = [...snakeRef.current];
      const head = { ...currentSnake[0] };
      const currentDir = directionRef.current;

      if (currentDir === "UP") head.y -= 1;
      else if (currentDir === "DOWN") head.y += 1;
      else if (currentDir === "LEFT") head.x -= 1;
      else if (currentDir === "RIGHT") head.x += 1;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        return;
      }

      // Check self collision
      if (currentSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
        setIsGameOver(true);
        return;
      }

      // Move snake forward
      currentSnake.unshift(head);

      // Check food consumption
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore((prev) => {
          const newScore = prev + 10;
          setHighScore((hs) => {
            const nextHs = Math.max(hs, newScore);
            try {
              localStorage.setItem("nexus_snake_highscore", nextHs.toString());
            } catch {
              // Ignore
            }
            return nextHs;
          });
          return newScore;
        });
        const newFood = generateFood(currentSnake);
        setFood(newFood);
        foodRef.current = newFood;
      } else {
        currentSnake.pop(); // Remove tail
      }

      setSnake(currentSnake);
    }, Math.max(65, INITIAL_SPEED - Math.floor(score / 50) * 8));

    return () => clearInterval(interval);
  }, [hasStarted, isGameOver, isPaused, score, generateFood]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        changeDirection("UP");
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        changeDirection("DOWN");
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        changeDirection("LEFT");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        changeDirection("RIGHT");
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (isGameOverRef.current) {
          restartGame();
        } else {
          setIsPaused((p) => !p);
        }
      } else if (e.key === "r" || e.key === "R") {
        restartGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeDirection, restartGame]);

  // Touch Swipe Gesture Detection on Canvas
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartRef.current.x;
    const diffY = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    if (Math.max(absX, absY) > 20) {
      if (absX > absY) {
        changeDirection(diffX > 0 ? "RIGHT" : "LEFT");
      } else {
        changeDirection(diffY > 0 ? "DOWN" : "UP");
      }
    }
    touchStartRef.current = null;
  };

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = "#0c0f17";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Food (Pulsing neon orb)
    ctx.save();
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#00f0ff";
    const foodCenterX = food.x * cellSize + cellSize / 2;
    const foodCenterY = food.y * cellSize + cellSize / 2;
    ctx.beginPath();
    ctx.arc(foodCenterX, foodCenterY, cellSize / 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw Snake
    snake.forEach((segment, idx) => {
      ctx.save();
      const isHead = idx === 0;

      if (isHead) {
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = 15;
        ctx.fillStyle = "#34d399";
      } else {
        ctx.fillStyle = idx % 2 === 0 ? "#10b981" : "#059669";
      }

      const padding = 1.5;
      const x = segment.x * cellSize + padding;
      const y = segment.y * cellSize + padding;
      const size = cellSize - padding * 2;
      const radius = isHead ? 6 : 4;

      ctx.beginPath();
      ctx.roundRect(x, y, size, size, radius);
      ctx.fill();

      // Eyes on head
      if (isHead) {
        ctx.fillStyle = "#042f2e";
        const eyeOffset = cellSize / 3.5;
        const eyeRadius = cellSize / 9;

        let eye1X = foodCenterX;
        let eye1Y = foodCenterY;
        let eye2X = foodCenterX;
        let eye2Y = foodCenterY;

        if (direction === "UP") {
          eye1X = segment.x * cellSize + eyeOffset;
          eye1Y = segment.y * cellSize + eyeOffset;
          eye2X = segment.x * cellSize + cellSize - eyeOffset;
          eye2Y = segment.y * cellSize + eyeOffset;
        } else if (direction === "DOWN") {
          eye1X = segment.x * cellSize + eyeOffset;
          eye1Y = segment.y * cellSize + cellSize - eyeOffset;
          eye2X = segment.x * cellSize + cellSize - eyeOffset;
          eye2Y = segment.y * cellSize + cellSize - eyeOffset;
        } else if (direction === "LEFT") {
          eye1X = segment.x * cellSize + eyeOffset;
          eye1Y = segment.y * cellSize + eyeOffset;
          eye2X = segment.x * cellSize + eyeOffset;
          eye2Y = segment.y * cellSize + cellSize - eyeOffset;
        } else {
          eye1X = segment.x * cellSize + cellSize - eyeOffset;
          eye1Y = segment.y * cellSize + eyeOffset;
          eye2X = segment.x * cellSize + cellSize - eyeOffset;
          eye2Y = segment.y * cellSize + cellSize - eyeOffset;
        }

        ctx.beginPath();
        ctx.arc(eye1X, eye1Y, eyeRadius, 0, Math.PI * 2);
        ctx.arc(eye2X, eye2Y, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }, [snake, food, direction]);

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto p-2 sm:p-6 w-full">
      {/* Scoreboard Display - ABOVE BOARD */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full mb-3 sm:mb-4">
        <div className="p-3 sm:p-4 rounded-xl bg-[#11141e] border border-cyan-500/30 text-center shadow-[0_0_15px_rgba(0,240,255,0.15)]">
          <div className="text-[11px] sm:text-xs font-bold text-cyan-400 uppercase tracking-wider">Score</div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5">{score}</div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-[#11141e] border border-white/10 text-center">
          <div className="text-[11px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider">High Score</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-0.5">{highScore}</div>
        </div>
      </div>

      {/* Restart & Pause Action Buttons - ABOVE BOARD */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 w-full">
        <button
          onClick={restartGame}
          className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Restart Game (R)</span>
        </button>

        {hasStarted && !isGameOver && (
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="min-h-[44px] py-2.5 px-4 rounded-xl font-semibold text-xs text-zinc-300 hover:text-white bg-[#141824] border border-white/10 active:scale-95 cursor-pointer"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        )}
      </div>

      {/* Game Canvas Container - scales to screen width, aspect-square, max-w-full, touch-action: none */}
      <div
        className="relative w-full max-w-[400px] aspect-square rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0c0f17] mx-auto select-none"
        style={{ touchAction: "none" }}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="block w-full h-full max-w-full aspect-square touch-none cursor-pointer"
          style={{ touchAction: "none" }}
        />

        {/* Start / Game Over / Paused Overlay */}
        {(!hasStarted || isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-6 text-center z-10">
            {isGameOver ? (
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  SYSTEM OVERRIDE // COLLISION
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">Game Over</h3>
                <p className="text-xs sm:text-sm text-zinc-300">
                  Final Energy: <strong className="text-cyan-400 font-mono">{score} pts</strong>
                </p>
                <button
                  onClick={restartGame}
                  className="mt-2 px-6 py-3 min-h-[44px] rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-sm shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all active:scale-95 cursor-pointer"
                >
                  Play Again (Space)
                </button>
              </div>
            ) : isPaused ? (
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-yellow-400">Paused</h3>
                <p className="text-xs text-zinc-400">Press Space or button below to resume</p>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-2.5 min-h-[44px] rounded-xl bg-cyan-400 text-black font-bold text-sm cursor-pointer"
                >
                  Resume
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-4xl">🐍</span>
                <h3 className="text-xl sm:text-2xl font-black text-white">Neon Snake</h3>
                <p className="text-xs text-zinc-400 max-w-xs">
                  Consume glowing orbs and expand your cyber snake. Do not hit the perimeter!
                </p>
                <button
                  onClick={restartGame}
                  className="px-6 py-3 min-h-[44px] rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all active:scale-95 cursor-pointer"
                >
                  Start Game (Space)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Touch On-Screen D-Pad Controls for Mobile & Touch devices */}
      <div className="mt-6 flex flex-col items-center gap-2 w-full select-none">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Touch D-Pad</span>
        <button
          onClick={() => changeDirection("UP")}
          aria-label="Move Up"
          className="min-h-[48px] min-w-[56px] px-5 py-2.5 rounded-xl bg-[#141824] active:bg-cyan-500 active:text-black border border-white/15 hover:border-cyan-400/40 flex items-center justify-center text-xl text-white shadow-md active:scale-95 transition-all cursor-pointer"
        >
          ▲
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => changeDirection("LEFT")}
            aria-label="Move Left"
            className="min-h-[48px] min-w-[56px] px-5 py-2.5 rounded-xl bg-[#141824] active:bg-cyan-500 active:text-black border border-white/15 hover:border-cyan-400/40 flex items-center justify-center text-xl text-white shadow-md active:scale-95 transition-all cursor-pointer"
          >
            ◀
          </button>
          <button
            onClick={() => changeDirection("DOWN")}
            aria-label="Move Down"
            className="min-h-[48px] min-w-[56px] px-5 py-2.5 rounded-xl bg-[#141824] active:bg-cyan-500 active:text-black border border-white/15 hover:border-cyan-400/40 flex items-center justify-center text-xl text-white shadow-md active:scale-95 transition-all cursor-pointer"
          >
            ▼
          </button>
          <button
            onClick={() => changeDirection("RIGHT")}
            aria-label="Move Right"
            className="min-h-[48px] min-w-[56px] px-5 py-2.5 rounded-xl bg-[#141824] active:bg-cyan-500 active:text-black border border-white/15 hover:border-cyan-400/40 flex items-center justify-center text-xl text-white shadow-md active:scale-95 transition-all cursor-pointer"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Keyboard Controls Note */}
      <p className="text-[11px] text-zinc-500 mt-4 text-center">
        Controls: <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">W</kbd><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">A</kbd><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">S</kbd><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">D</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">Arrow Keys</kbd> | Swipe on screen for touch.
      </p>
    </div>
  );
}
