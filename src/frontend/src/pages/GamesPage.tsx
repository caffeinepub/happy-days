import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { JungleJump } from "../games/JungleJump";
import { MagicQuiz } from "../games/MagicQuiz";
import { MemoryMatch } from "../games/MemoryMatch";

interface Game {
  id: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  accentColor: string;
  instructions: string;
}

const GAMES: Game[] = [
  {
    id: "jungle-jump",
    title: "Jungle Jump",
    emoji: "🦁",
    description:
      "Help the lion jump over cacti in this endless running adventure! How far can you go?",
    color: "from-[oklch(0.85_0.15_95)] to-[oklch(0.78_0.18_140)]",
    accentColor: "oklch(0.65 0.22 38)",
    instructions: "Press SPACE or tap the game to jump!",
  },
  {
    id: "memory-match",
    title: "Memory Match",
    emoji: "🧠",
    description:
      "Flip cards to find matching pairs of magical treasures! Train your memory and win!",
    color: "from-[oklch(0.85_0.12_220)] to-[oklch(0.78_0.16_270)]",
    accentColor: "oklch(0.62 0.22 290)",
    instructions: "Tap cards to flip them. Match all 6 pairs!",
  },
  {
    id: "magic-quiz",
    title: "Magic Quiz",
    emoji: "🧙",
    description:
      "Answer magical questions about dragons, wizards, and fairies! How many can you get right?",
    color: "from-[oklch(0.85_0.12_300)] to-[oklch(0.78_0.16_330)]",
    accentColor: "oklch(0.62 0.22 290)",
    instructions: "Choose the correct answer from 4 options!",
  },
];

function GameCard({
  game,
  index,
  onPlay,
}: {
  game: Game;
  index: number;
  onPlay: (id: string) => void;
}) {
  return (
    <motion.div
      data-ocid={`games.item.${index + 1}`}
      className="bg-white rounded-3xl overflow-hidden border-4 border-border shadow-lg group cursor-pointer"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => onPlay(game.id)}
    >
      {/* Cover */}
      <div
        className={`bg-gradient-to-br ${game.color} h-40 flex flex-col items-center justify-center relative overflow-hidden`}
      >
        <motion.div
          className="text-8xl drop-shadow-lg"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: index * 0.5,
          }}
        >
          {game.emoji}
        </motion.div>
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-extrabold text-2xl text-foreground mb-2">
          {game.title}
        </h3>
        <p className="font-body text-muted-foreground text-sm leading-relaxed mb-2">
          {game.description}
        </p>
        <p
          className="font-body text-xs mb-4"
          style={{ color: game.accentColor }}
        >
          💡 {game.instructions}
        </p>
        <button
          type="button"
          data-ocid={`games.play_button.${index + 1}`}
          onClick={(e) => {
            e.stopPropagation();
            onPlay(game.id);
          }}
          className="w-full py-3 rounded-2xl font-display font-extrabold text-lg text-white border-0 transition-all duration-100 cursor-pointer hover:translate-y-[2px] active:translate-y-[5px]"
          style={{
            backgroundColor: game.accentColor,
            boxShadow: "0 5px 0 0 oklch(0.45 0.22 38)",
          }}
        >
          🎮 Play Now!
        </button>
      </div>
    </motion.div>
  );
}

function GameArea({ gameId, onBack }: { gameId: string; onBack: () => void }) {
  const game = GAMES.find((g) => g.id === gameId);
  if (!game) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Game Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          data-ocid="games.back_button"
          onClick={onBack}
          className="flex items-center gap-2 bg-white border-4 border-border px-4 py-2 rounded-2xl font-body font-bold text-foreground hover:border-foreground transition-all hover:-translate-y-0.5 cursor-pointer shadow-sm"
        >
          ← Back to Games
        </button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{game.emoji}</span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground">
            {game.title}
          </h2>
        </div>
      </div>

      {/* Game Area */}
      <div className="bg-white border-4 border-border rounded-3xl p-6 shadow-lg">
        {gameId === "jungle-jump" && <JungleJump />}
        {gameId === "memory-match" && <MemoryMatch />}
        {gameId === "magic-quiz" && <MagicQuiz />}
      </div>
    </motion.div>
  );
}

export function GamesPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  return (
    <div className="min-h-screen hero-pattern py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {activeGame ? (
            <GameArea
              key="game-area"
              gameId={activeGame}
              onBack={() => setActiveGame(null)}
            />
          ) : (
            <motion.div
              key="lobby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-display font-extrabold text-4xl sm:text-6xl mb-3">
                  <span className="rainbow-text">🎮 Play Games!</span>
                </h2>
                <p className="font-body text-muted-foreground text-lg">
                  Pick a game and start playing right now! No downloads needed!
                  🌟
                </p>
              </motion.div>

              {/* Game Cards Grid */}
              <div
                data-ocid="games.list"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {GAMES.map((game, i) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    index={i}
                    onPlay={setActiveGame}
                  />
                ))}
              </div>

              {/* Fun note */}
              <motion.div
                className="text-center mt-12 font-body text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-lg">More games coming soon! 🚀✨</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
