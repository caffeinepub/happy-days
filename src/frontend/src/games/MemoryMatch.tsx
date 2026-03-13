import { useCallback, useEffect, useRef, useState } from "react";

const EMOJI_PAIRS = ["🏆", "💎", "⚔️", "🧙", "🐉", "🌟"];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): Card[] {
  const pairs = [...EMOJI_PAIRS, ...EMOJI_PAIRS];
  return shuffle(pairs).map((emoji, idx) => ({
    id: idx,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}

export function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>(buildDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [won, setWon] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const restart = useCallback(() => {
    stopTimer();
    setCards(buildDeck());
    setFlipped([]);
    setMoves(0);
    setSeconds(0);
    setWon(false);
    lockRef.current = false;
  }, [stopTimer]);

  const handleCard = useCallback(
    (id: number) => {
      if (lockRef.current) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.isFlipped || card.isMatched) return;

      startTimer();

      const newFlipped = [...flipped, id];
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)),
      );
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        lockRef.current = true;
        setMoves((m) => m + 1);
        const [aId, bId] = newFlipped;
        const a = cards.find((c) => c.id === aId)!;
        const b = cards.find((c) => c.id === bId)!;
        const isMatch = a.emoji === b.emoji;

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => {
              if (c.id === aId || c.id === bId) {
                return isMatch
                  ? { ...c, isFlipped: true, isMatched: true }
                  : { ...c, isFlipped: false };
              }
              return c;
            }),
          );
          setFlipped([]);
          lockRef.current = false;

          if (isMatch) {
            setCards((prev) => {
              const updated = prev.map((c) =>
                c.id === aId || c.id === bId
                  ? { ...c, isFlipped: true, isMatched: true }
                  : c,
              );
              if (updated.every((c) => c.isMatched)) {
                stopTimer();
                setWon(true);
              }
              return updated;
            });
          }
        }, 900);
      }
    },
    [cards, flipped, startTimer, stopTimer],
  );

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const matchedCount = cards.filter((c) => c.isMatched).length / 2;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Stats */}
      <div className="flex gap-6 font-display font-bold text-lg">
        <span className="text-primary">⏱ {formatTime(seconds)}</span>
        <span className="text-secondary">Moves: {moves}</span>
        <span
          className="text-accent-foreground"
          style={{ color: "oklch(0.55 0.22 140)" }}
        >
          Pairs: {matchedCount}/6
        </span>
      </div>

      {/* Win screen */}
      {won && (
        <div
          data-ocid="memory.success_state"
          className="text-center bg-gradient-to-br from-yellow-50 to-green-50 border-4 border-[oklch(0.82_0.2_95)] rounded-3xl p-8 w-full max-w-md"
        >
          <div className="text-6xl mb-3">🎉</div>
          <h3
            className="font-display font-extrabold text-3xl mb-2"
            style={{ color: "oklch(0.55 0.22 140)" }}
          >
            You Won!
          </h3>
          <p className="font-body text-muted-foreground mb-4">
            {moves} moves · {formatTime(seconds)}
          </p>
          <div className="text-4xl mb-4">
            {moves <= 12 ? "🌟🌟🌟" : moves <= 18 ? "🌟🌟" : "🌟"}
          </div>
          <button
            type="button"
            data-ocid="memory.restart_button"
            onClick={restart}
            className="bg-primary text-white font-display font-bold text-lg px-8 py-3 rounded-2xl shadow-[0_5px_0_0_oklch(0.45_0.22_38)] hover:shadow-[0_3px_0_0_oklch(0.45_0.22_38)] hover:translate-y-[2px] active:shadow-none active:translate-y-[5px] transition-all duration-100 cursor-pointer"
          >
            🔄 Play Again!
          </button>
        </div>
      )}

      {/* Card Grid */}
      {!won && (
        <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
          {cards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              data-ocid={`memory.card.${index + 1}`}
              onClick={() => handleCard(card.id)}
              className="relative aspect-square rounded-2xl cursor-pointer transition-all duration-300"
              style={{ perspective: "600px" }}
            >
              <div
                style={{
                  transition: "transform 0.4s",
                  transformStyle: "preserve-3d",
                  transform:
                    card.isFlipped || card.isMatched
                      ? "rotateY(180deg)"
                      : "rotateY(0deg)",
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* Back face */}
                <div
                  style={{ backfaceVisibility: "hidden" }}
                  className="absolute inset-0 bg-gradient-to-br from-[oklch(0.72_0.18_220)] to-[oklch(0.62_0.22_290)] rounded-2xl flex items-center justify-center shadow-md border-4 border-white"
                >
                  <span className="text-white font-display font-extrabold text-2xl">
                    ?
                  </span>
                </div>
                {/* Front face */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                  className={`absolute inset-0 rounded-2xl flex items-center justify-center shadow-md border-4 text-4xl transition-all ${
                    card.isMatched
                      ? "bg-green-100 border-green-400 scale-95"
                      : "bg-yellow-50 border-[oklch(0.82_0.2_95)]"
                  }`}
                >
                  {card.emoji}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!won && (
        <button
          type="button"
          data-ocid="memory.restart_button"
          onClick={restart}
          className="font-body font-bold text-sm text-muted-foreground underline cursor-pointer hover:text-foreground transition-colors"
        >
          🔄 Restart Game
        </button>
      )}

      <p className="font-body text-muted-foreground text-sm text-center">
        Tap cards to flip them! Match all 6 pairs to win! 🏆
      </p>
    </div>
  );
}
