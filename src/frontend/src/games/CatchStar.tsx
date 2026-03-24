import { useEffect, useRef, useState } from "react";
import { TouchControls } from "../components/TouchControls";

interface Star {
  id: number;
  x: number;
  y: number;
  speed: number;
}

let sid = 0;

export function CatchStar() {
  const [stars, setStars] = useState<Star[]>([]);
  const [basketX, setBasketX] = useState(50);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function start() {
    setStars([]);
    setScore(0);
    setMissed(0);
    setDone(false);
    setBasketX(50);
    setRunning(true);
  }

  useEffect(() => {
    if (!running) return;
    const spawnI = setInterval(
      () =>
        setStars((s) => [
          ...s,
          {
            id: sid++,
            x: 5 + Math.random() * 90,
            y: 0,
            speed: 0.3 + Math.random() * 0.5,
          },
        ]),
      700,
    );
    const tickI = setInterval(() => {
      setStars((prev) => {
        const updated = prev.map((s) => ({ ...s, y: s.y + s.speed }));
        const fell = updated.filter((s) => s.y >= 88);
        if (fell.length)
          setMissed((m) => {
            const nm = m + fell.length;
            if (nm >= 5) {
              setRunning(false);
              setDone(true);
            }
            return nm;
          });
        return updated.filter((s) => s.y < 88);
      });
    }, 50);
    return () => {
      clearInterval(spawnI);
      clearInterval(tickI);
    };
  }, [running]);

  useEffect(() => {
    if (!running) return;
    setStars((prev) => {
      const caught = prev.filter(
        (s) => s.y > 75 && Math.abs(s.x - basketX) < 12,
      );
      if (caught.length) setScore((sc) => sc + caught.length);
      return prev.filter((s) => !(s.y > 75 && Math.abs(s.x - basketX) < 12));
    });
  });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!running || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setBasketX(((e.clientX - rect.left) / rect.width) * 100);
  }

  function handleTouch(e: React.TouchEvent<HTMLDivElement>) {
    if (!running || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setBasketX(((e.touches[0].clientX - rect.left) / rect.width) * 100);
  }

  if (!running && !done) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">⭐</div>
        <h2 className="font-display font-extrabold text-4xl">
          Catch the Stars!
        </h2>
        <p className="font-body text-muted-foreground text-lg text-center">
          Move your basket to catch falling stars! Miss 5 and game over!
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
        <div className="text-7xl">🌟</div>
        <h2 className="font-display font-extrabold text-4xl">Game Over!</h2>
        <p className="font-body text-2xl">
          Caught <strong>{score}</strong> stars!
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
        <span className="text-primary">⭐ Caught: {score}</span>
        <span className="text-red-500">💨 Missed: {missed}/5</span>
      </div>
      <div
        ref={containerRef}
        className="relative w-full bg-gradient-to-b from-indigo-900 to-indigo-700 rounded-3xl border-4 border-border overflow-hidden cursor-none select-none"
        style={{ height: 400 }}
        onMouseMove={handleMove}
        onTouchMove={handleTouch}
      >
        {stars.map((s) => (
          <span
            key={s.id}
            className="absolute text-3xl pointer-events-none"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: "translate(-50%,-50%)",
            }}
          >
            ⭐
          </span>
        ))}
        <span
          className="absolute text-4xl transition-all duration-75"
          style={{
            left: `${basketX}%`,
            top: "85%",
            transform: "translate(-50%,-50%)",
          }}
        >
          🧺
        </span>
      </div>
      <p className="font-body text-muted-foreground text-sm">
        Move your mouse or finger to catch the stars!
      </p>
      <TouchControls layout="single" />
    </div>
  );
}
