export interface Game {
  title: string;
  slug: string;
  description: string;
  thumbnail: string; // Emoji thumbnail
  gradient: string; // Tailwind gradient classes
  genre: string;
  badge?: string;
  instructions: string[];
  controls: {
    keyboard: string[];
    touch: string[];
  };
}

export const games: Game[] = [
  {
    title: "Tic-Tac-Toe",
    slug: "tic-tac-toe",
    description: "Classic tactical grid duel. Play against an intelligent computer AI or challenge a friend in local two-player mode.",
    thumbnail: "⭕❌",
    gradient: "from-cyan-500 via-blue-600 to-indigo-700",
    genre: "Strategy",
    badge: "2-Player & AI",
    instructions: [
      "Get three of your marks in a horizontal, vertical, or diagonal row to win.",
      "Switch between Solo vs AI and 2-Player Local pass & play modes.",
      "Track your win streaks and draws on the real-time scoreboard."
    ],
    controls: {
      keyboard: ["Press numbers 1-9 or Numpad 1-9 to place mark", "Press 'R' to restart the match"],
      touch: ["Tap any open grid cell to place mark", "Tap Restart button to begin a new round"]
    }
  },
  {
    title: "Neon Snake",
    slug: "snake",
    description: "Navigate the cyber grid, consume energy power cores, and grow your digital serpent without crashing into borders or yourself.",
    thumbnail: "🐍",
    gradient: "from-emerald-400 via-teal-600 to-cyan-700",
    genre: "Arcade",
    badge: "Retro Classic",
    instructions: [
      "Guide the snake to consume glowing energy orbs (+10 pts).",
      "Avoid colliding with the grid boundaries or your own tail.",
      "Speed dynamically ramps up as your snake grows longer."
    ],
    controls: {
      keyboard: ["Arrow Keys or W/A/S/D to change direction", "Spacebar to Pause / Resume", "Press 'R' to restart"],
      touch: ["Use on-screen D-Pad buttons", "Swipe in any direction across the playfield"]
    }
  },
  {
    title: "Memory Match",
    slug: "memory-match",
    description: "Test your mental recall by flipping holographic cards and uncovering all 8 matching pairs in the fewest moves possible.",
    thumbnail: "🧠🃏",
    gradient: "from-purple-500 via-fuchsia-600 to-pink-600",
    genre: "Puzzle",
    badge: "Brain Trainer",
    instructions: [
      "Flip two cards at a time to reveal their hidden holographic icons.",
      "Match all 8 distinct icon pairs to clear the matrix.",
      "Try to achieve the lowest move count and beat your personal record."
    ],
    controls: {
      keyboard: ["Arrow Keys to navigate card grid", "Enter or Spacebar to flip focused card", "Press 'R' to reshuffle"],
      touch: ["Tap any face-down card to flip", "Tap Restart to reshuffle the deck"]
    }
  },
  {
    title: "Rock Paper Scissors",
    slug: "rock-paper-scissors",
    description: "The timeless showdown reimagined with neon energy. Challenge the algorithmic opponent to a high-speed best-of series.",
    thumbnail: "✊✋✌️",
    gradient: "from-amber-400 via-orange-500 to-rose-600",
    genre: "Casual Duel",
    badge: "Quick Play",
    instructions: [
      "Choose Rock, Paper, or Scissors against the computer.",
      "Rock crushes Scissors, Scissors cuts Paper, Paper covers Rock.",
      "Build your consecutive victory streak and dominate the round tracker."
    ],
    controls: {
      keyboard: ["Press '1' for Rock, '2' for Paper, '3' for Scissors", "Press 'R' to reset scores"],
      touch: ["Tap Rock, Paper, or Scissors buttons", "Tap Reset button to clear scores"]
    }
  },
  {
    title: "Whack-A-Mole",
    slug: "whack-a-mole",
    description: "Fast-paced reflex challenge! Whack the cyber bots as they pop out of the burrow matrix before the 30-second timer expires.",
    thumbnail: "🔨👾",
    gradient: "from-rose-500 via-red-600 to-amber-600",
    genre: "Action Reflex",
    badge: "Fast Reflexes",
    instructions: [
      "Whack cyber-bots quickly as they surface to earn points (+10 pts each).",
      "Bonus Golden Bots award +30 points!",
      "Race against the 30-second clock to achieve your personal high score."
    ],
    controls: {
      keyboard: ["Press Numpad 1-9 or keys 1-9 corresponding to the 3x3 holes", "Press 'R' to restart game"],
      touch: ["Tap directly on bots as they pop up", "Tap Start / Restart button to play"]
    }
  }
];

export function getAllGames(): Game[] {
  return games;
}

export function getGameBySlug(slug: string): Game | undefined {
  const normalized = slug.toLowerCase();
  return games.find(
    (game) =>
      game.slug === normalized ||
      (normalized === "tictactoe" && game.slug === "tic-tac-toe") ||
      (normalized === "rockpaperscissors" && game.slug === "rock-paper-scissors") ||
      (normalized === "memorymatch" && game.slug === "memory-match") ||
      (normalized === "whackamole" && game.slug === "whack-a-mole")
  );
}

export function getSimilarGames(currentSlug: string, count: number = 3): Game[] {
  return games.filter((g) => g.slug !== currentSlug).slice(0, count);
}

export function getFeaturedGames(): Game[] {
  return [games[1], games[0]];
}

