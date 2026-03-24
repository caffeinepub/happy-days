import { useEffect, useRef, useState } from "react";

const FISH_EMOJIS = ["🐠", "🐡", "🐟", "🦈", "🐬", "🦑"];

interface Fish {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

export function FishTank() {
  const [fish, setFish] = useState<Fish[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [over, setOver] = useState(false);
  const [started, setStarted] = useState(false);
  const idRef = useRef(0);

  const startGame = () => {
    setFish([]);
    setScore(0);
    setTimeLeft(30);
    setOver(false);
    setStarted(true);
  };

  useEffect(() => {
    if (!started || over) return;
    const t = setInterval(
      () =>
        setTimeLeft((tl) => {
          if (tl <= 1) {
            setOver(true);
            return 0;
          }
          return tl - 1;
        }),
      1000,
    );
    return () => clearInterval(t);
  }, [started, over]);

  useEffect(() => {
    if (!started || over) return;
    const t = setInterval(() => {
      const id = idRef.current++;
      setFish((f) => [
        ...f,
        {
          id,
          x: Math.random() * 80,
          y: Math.random() * 80,
          emoji: FISH_EMOJIS[Math.floor(Math.random() * FISH_EMOJIS.length)],
        },
      ]);
      setTimeout(() => setFish((f) => f.filter((fi) => fi.id !== id)), 2000);
    }, 600);
    return () => clearInterval(t);
  }, [started, over]);

  const catchFish = (id: number) => {
    setFish((f) => f.filter((fi) => fi.id !== id));
    setScore((s) => s + 10);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-8 text-xl font-bold">
        <span>Score: {score}</span>
        <span>⏱️ {timeLeft}s</span>
      </div>
      {over && (
        <div className="text-2xl font-extrabold text-blue-600">
          🎉 Final Score: {score}!
        </div>
      )}
      <div
        className="relative w-80 h-80 bg-gradient-to-b from-blue-300 to-blue-600 rounded-3xl border-4 border-blue-700 overflow-hidden cursor-pointer"
        style={{ minHeight: 320 }}
      >
        {fish.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => catchFish(f.id)}
            className="absolute text-4xl cursor-pointer border-0 bg-transparent hover:scale-125 transition-transform"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
          >
            {f.emoji}
          </button>
        ))}
        {!started && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
            Click Start!
          </div>
        )}
      </div>
      {!started || over ? (
        <button
          type="button"
          onClick={startGame}
          className="px-6 py-3 bg-blue-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
        >
          {started ? "Play Again" : "Start!"}
        </button>
      ) : null}
    </div>
  );
}
