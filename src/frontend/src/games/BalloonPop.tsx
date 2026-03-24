import { useEffect, useRef, useState } from "react";

interface Balloon {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speed: number;
  popped: boolean;
}

const COLORS = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#a855f7",
  "#f97316",
  "#ec4899",
];
let nextId = 0;

function makeBalloon(): Balloon {
  return {
    id: nextId++,
    x: 10 + Math.random() * 80,
    y: 110,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 40 + Math.random() * 30,
    speed: 0.5 + Math.random() * 1.5,
    popped: false,
  };
}

export function BalloonPop() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const tickRef = useRef<number | null>(null);
  const spawnRef = useRef<number | null>(null);

  function start() {
    setBalloons([]);
    setScore(0);
    setMissed(0);
    setDone(false);
    setRunning(true);
  }

  useEffect(() => {
    if (!running) return;
    spawnRef.current = window.setInterval(() => {
      setBalloons((b) => [...b, makeBalloon()]);
    }, 800);
    tickRef.current = window.setInterval(() => {
      setBalloons((prev) => {
        const updated = prev.map((b) => ({ ...b, y: b.y - b.speed }));
        const escaped = updated.filter((b) => !b.popped && b.y < -10);
        if (escaped.length > 0) {
          setMissed((m) => {
            const newM = m + escaped.length;
            if (newM >= 10) {
              setRunning(false);
              setDone(true);
            }
            return newM;
          });
        }
        return updated.filter((b) => b.y > -10 && !b.popped);
      });
    }, 50);
    return () => {
      if (spawnRef.current) clearInterval(spawnRef.current);
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [running]);

  function pop(id: number) {
    setBalloons((b) => b.filter((x) => x.id !== id));
    setScore((s) => s + 1);
  }

  if (!running && !done) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">🎈</div>
        <h2 className="font-display font-extrabold text-4xl">Balloon Pop!</h2>
        <p className="font-body text-muted-foreground text-lg text-center">
          Pop the balloons before they float away! Miss 10 and it's game over!
        </p>
        <button
          type="button"
          onClick={start}
          className="px-8 py-4 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
        >
          Start!
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">💥</div>
        <h2 className="font-display font-extrabold text-4xl">Game Over!</h2>
        <p className="font-body text-2xl">
          You popped <strong>{score}</strong> balloons!
        </p>
        <button
          type="button"
          onClick={start}
          className="px-8 py-4 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
        >
          Play Again!
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-8 font-body font-bold text-lg">
        <span className="text-primary">🎈 Popped: {score}</span>
        <span className="text-red-500">💨 Escaped: {missed}/10</span>
      </div>
      <div
        className="relative w-full bg-gradient-to-b from-sky-200 to-sky-400 rounded-3xl border-4 border-border overflow-hidden"
        style={{ height: 400 }}
      >
        {balloons.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => pop(b.id)}
            className="absolute cursor-pointer border-0 bg-transparent p-0 transition-transform hover:scale-110"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span style={{ fontSize: b.size }}>🎈</span>
          </button>
        ))}
      </div>
    </div>
  );
}
