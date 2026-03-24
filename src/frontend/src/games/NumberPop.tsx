import { useEffect, useState } from "react";

interface Bubble {
  id: number;
  x: number;
  y: number;
}

export function NumberPop() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [next, setNext] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [over, setOver] = useState(false);
  const [started, setStarted] = useState(false);

  const startGame = () => {
    const b = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      x: Math.random() * 70 + 5,
      y: Math.random() * 70 + 5,
    }));
    setBubbles(b);
    setNext(1);
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

  const pop = (id: number) => {
    if (id !== next) return;
    setBubbles((b) => b.filter((x) => x.id !== id));
    setScore((s) => s + 10);
    setNext((n) => n + 1);
    if (next === 20) {
      setOver(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-8 text-xl font-bold">
        <span>Next: {next}</span>
        <span>Score: {score}</span>
        <span>⏱️ {timeLeft}s</span>
      </div>
      {over && (
        <div className="text-2xl font-extrabold text-green-600">
          {next > 20 ? "🎉 All popped!" : `Time's up! Score: ${score}`}
        </div>
      )}
      <div className="relative w-80 h-80 bg-gradient-to-br from-sky-200 to-indigo-300 rounded-3xl border-4 border-indigo-400 overflow-hidden">
        {bubbles.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => pop(b.id)}
            className="absolute w-12 h-12 rounded-full font-extrabold text-lg border-0 cursor-pointer transition-transform hover:scale-125"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              backgroundColor: b.id === next ? "#fbbf24" : "#93c5fd",
              color: "#1e1b4b",
            }}
          >
            {b.id}
          </button>
        ))}
      </div>
      {(!started || over) && (
        <button
          type="button"
          onClick={startGame}
          className="px-6 py-3 bg-sky-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
        >
          {started ? "Play Again" : "Start!"}
        </button>
      )}
    </div>
  );
}
