import { useEffect, useRef, useState } from "react";
import { TouchControls } from "../components/TouchControls";

const FRUITS = ["🍎", "🍊", "🍋", "🍇", "🍓"];
let fid = 0;

interface Fruit {
  id: number;
  x: number;
  y: number;
  emoji: string;
  speed: number;
}

export function FruitCatch() {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [basketX, setBasketX] = useState(50);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const basketXRef = useRef(50);
  const livesRef = useRef(5);

  function start() {
    setFruits([]);
    setBasketX(50);
    basketXRef.current = 50;
    setScore(0);
    setLives(5);
    livesRef.current = 5;
    setDone(false);
    setRunning(true);
  }

  useEffect(() => {
    basketXRef.current = basketX;
  }, [basketX]);
  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => {
    if (!running) return;
    const spawn = setInterval(
      () =>
        setFruits((f) => [
          ...f,
          {
            id: fid++,
            x: 5 + Math.random() * 90,
            y: 0,
            emoji: FRUITS[Math.floor(Math.random() * 5)],
            speed: 0.4 + Math.random() * 0.6,
          },
        ]),
      900,
    );
    const tick = setInterval(() => {
      setFruits((prev) => {
        const updated = prev.map((f) => ({ ...f, y: f.y + f.speed }));
        const caught = updated.filter(
          (f) => f.y > 80 && Math.abs(f.x - basketXRef.current) < 10,
        );
        const missed = updated.filter((f) => f.y >= 95);
        if (caught.length) setScore((s) => s + caught.length);
        if (missed.length) {
          const newLives = livesRef.current - missed.length;
          livesRef.current = newLives;
          setLives(newLives);
          if (newLives <= 0) {
            setRunning(false);
            setDone(true);
          }
        }
        return updated.filter(
          (f) =>
            f.y < 95 && !(f.y > 80 && Math.abs(f.x - basketXRef.current) < 10),
        );
      });
    }, 50);
    const moveBasket = setInterval(() => {
      if (keysRef.current.has("ArrowLeft"))
        setBasketX((x) => {
          const v = Math.max(5, x - 3);
          basketXRef.current = v;
          return v;
        });
      if (keysRef.current.has("ArrowRight"))
        setBasketX((x) => {
          const v = Math.min(95, x + 3);
          basketXRef.current = v;
          return v;
        });
    }, 30);
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      clearInterval(spawn);
      clearInterval(tick);
      clearInterval(moveBasket);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [running]);

  function handleMove(e: React.MouseEvent) {
    if (!running || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(x);
    basketXRef.current = x;
  }
  function handleTouch(e: React.TouchEvent) {
    if (!running || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    setBasketX(x);
    basketXRef.current = x;
  }

  if (!running && !done) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">🍎</div>
        <h2 className="font-display font-extrabold text-4xl">Fruit Catch!</h2>
        <p className="font-body text-muted-foreground text-lg text-center">
          Catch the falling fruits with your basket! You have 5 lives.
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
        <div className="text-7xl">😢</div>
        <h2 className="font-display font-extrabold text-4xl">Game Over!</h2>
        <p className="font-body text-2xl">
          Caught <strong>{score}</strong> fruits!
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
        <span className="text-primary">🍎 Score: {score}</span>
        <span className="text-red-500">♥️ Lives: {lives}</span>
      </div>
      <div
        ref={containerRef}
        className="relative w-full bg-gradient-to-b from-blue-200 to-blue-400 rounded-3xl border-4 border-border overflow-hidden cursor-none select-none"
        style={{ height: 380 }}
        onMouseMove={handleMove}
        onTouchMove={handleTouch}
      >
        {fruits.map((f) => (
          <span
            key={f.id}
            className="absolute text-4xl pointer-events-none"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              transform: "translate(-50%,-50%)",
            }}
          >
            {f.emoji}
          </span>
        ))}
        <span
          className="absolute text-4xl transition-all duration-75"
          style={{
            left: `${basketX}%`,
            top: "87%",
            transform: "translate(-50%,-50%)",
          }}
        >
          🧺
        </span>
      </div>
      <p className="font-body text-muted-foreground text-sm">
        Move mouse or arrow keys to catch fruits!
      </p>
      <TouchControls layout="single" />
    </div>
  );
}
