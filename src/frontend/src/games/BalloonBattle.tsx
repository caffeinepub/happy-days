import { useEffect, useRef, useState } from "react";

const BALLOON_COUNT = 10;
const COLORS = [
  "#e74c3c",
  "#e67e22",
  "#f1c40f",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#1abc9c",
  "#e91e63",
];

interface Balloon {
  id: number;
  x: number;
  color: string;
  popped: boolean;
  y: number;
}

function makeBalloons(side: "left" | "right"): Balloon[] {
  return Array.from({ length: BALLOON_COUNT }, (_, i) => ({
    id: i,
    x: side === "left" ? 5 + Math.random() * 40 : 55 + Math.random() * 40,
    y: 20 + Math.random() * 60,
    color: COLORS[i % COLORS.length],
    popped: false,
  }));
}

export function BalloonBattle() {
  const [p1Balloons, setP1Balloons] = useState<Balloon[]>(() =>
    makeBalloons("left"),
  );
  const [p2Balloons, setP2Balloons] = useState<Balloon[]>(() =>
    makeBalloons("right"),
  );
  const [timeLeft, setTimeLeft] = useState(30);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const intervalRef = useRef<number | null>(null);

  function start() {
    setP1Balloons(makeBalloons("left"));
    setP2Balloons(makeBalloons("right"));
    setTimeLeft(30);
    setRunning(true);
    setGameOver(false);
  }

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const p1Popped = p1Balloons.filter((b) => b.popped).length;
  const p2Popped = p2Balloons.filter((b) => b.popped).length;
  const winner = gameOver
    ? p1Popped > p2Popped
      ? "Player 1"
      : p2Popped > p1Popped
        ? "Player 2"
        : "Tie"
    : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-8 text-xl font-extrabold">
        <span className="text-blue-600">🔵 P1: {p1Popped} popped</span>
        {running && <span className="text-orange-500">⏱ {timeLeft}s</span>}
        <span className="text-red-600">P2: {p2Popped} popped 🔴</span>
      </div>
      <div className="relative w-full h-72 bg-gradient-to-b from-sky-200 to-sky-400 rounded-2xl border-4 border-sky-600 overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="w-1/2 border-r-2 border-dashed border-sky-500 flex items-center justify-center text-sky-700 font-bold opacity-30">
            Player 1
          </div>
          <div className="w-1/2 flex items-center justify-center text-sky-700 font-bold opacity-30">
            Player 2
          </div>
        </div>
        {[...p1Balloons, ...p2Balloons].map((b) => (
          <button
            key={`${b.x}-${b.id}-${b.color}`}
            type="button"
            onClick={() => {
              if (!running || b.popped) return;
              const setter = b.x < 50 ? setP1Balloons : setP2Balloons;
              setter((prev) =>
                prev.map((p) => (p.id === b.id ? { ...p, popped: true } : p)),
              );
            }}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              background: b.popped ? "transparent" : b.color,
              transform: "translateX(-50%)",
            }}
            className={`absolute w-12 h-14 rounded-full border-2 border-white/40 transition-all text-2xl flex items-center justify-center
              ${b.popped ? "opacity-0 scale-0" : "hover:scale-110 cursor-pointer shadow-lg"}`}
          >
            🎈
          </button>
        ))}
      </div>
      {!running && !gameOver && (
        <button
          type="button"
          onClick={start}
          className="px-6 py-3 bg-pink-500 text-white rounded-xl font-bold text-lg hover:bg-pink-600"
        >
          Start Battle! 🎈
        </button>
      )}
      {gameOver && (
        <div className="text-center">
          <div className="text-3xl font-extrabold">
            {winner === "Tie" ? "🤝 Tie!" : `🏆 ${winner} Wins!`}
          </div>
          <div className="text-lg mt-1">
            P1: {p1Popped} | P2: {p2Popped}
          </div>
          <button
            type="button"
            onClick={start}
            className="mt-3 px-6 py-2 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
