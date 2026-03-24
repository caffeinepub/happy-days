import { useEffect, useRef, useState } from "react";
import { TouchControls } from "../components/TouchControls";

interface Bullet {
  x: number;
  y: number;
}
interface Asteroid {
  x: number;
  y: number;
  r: number;
}

export function SpaceShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [over, setOver] = useState(false);
  const [started, setStarted] = useState(false);
  const stateRef = useRef<{
    px: number;
    bullets: Bullet[];
    asteroids: Asteroid[];
    frame: number;
    score: number;
    lives: number;
  }>({ px: 280, bullets: [], asteroids: [], frame: 0, score: 0, lives: 3 });
  const keysRef = useRef<Record<string, boolean>>({});
  const rafRef = useRef(0);
  const W = 560;
  const H = 400;

  const startGame = () => {
    stateRef.current = {
      px: 280,
      bullets: [],
      asteroids: [],
      frame: 0,
      score: 0,
      lives: 3,
    };
    setScore(0);
    setLives(3);
    setOver(false);
    setStarted(true);
  };

  useEffect(() => {
    if (!started || over) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const onKey = (e: KeyboardEvent) => {
      keysRef.current[e.code] = e.type === "keydown";
      if (e.code === "Space") {
        e.preventDefault();
        const s = stateRef.current;
        s.bullets.push({ x: s.px + 20, y: 360 });
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    const loop = () => {
      const s = stateRef.current;
      const k = keysRef.current;
      if (k.ArrowLeft) s.px = Math.max(0, s.px - 5);
      if (k.ArrowRight) s.px = Math.min(W - 40, s.px + 5);
      s.bullets = s.bullets
        .map((b) => ({ ...b, y: b.y - 8 }))
        .filter((b) => b.y > 0);
      s.frame++;
      if (s.frame % 60 === 0)
        s.asteroids.push({
          x: Math.random() * (W - 40),
          y: -20,
          r: 15 + Math.random() * 15,
        });
      s.asteroids = s.asteroids.map((a) => ({ ...a, y: a.y + 2.5 }));
      s.asteroids = s.asteroids.filter((a) => {
        for (let i = s.bullets.length - 1; i >= 0; i--) {
          const b = s.bullets[i];
          if (Math.hypot(b.x - a.x - a.r, b.y - a.y - a.r) < a.r + 4) {
            s.bullets.splice(i, 1);
            s.score += 10;
            setScore(s.score);
            return false;
          }
        }
        if (a.y > H) {
          s.lives--;
          setLives(s.lives);
          if (s.lives <= 0) {
            setOver(true);
            cancelAnimationFrame(rafRef.current);
            return false;
          }
          return false;
        }
        if (a.y + a.r > 360 && Math.abs(a.x + a.r - s.px - 20) < 30) {
          s.lives--;
          setLives(s.lives);
          if (s.lives <= 0) {
            setOver(true);
            cancelAnimationFrame(rafRef.current);
            return false;
          }
          return false;
        }
        return true;
      });
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "white";
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc((i * 63 + s.frame) % W, (i * 97) % H, 1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.font = "36px serif";
      ctx.fillText("🚀", s.px, 370);
      for (const b of s.bullets) {
        ctx.fillStyle = "#fbbf24";
        ctx.fillRect(b.x - 2, b.y, 4, 12);
      }
      ctx.fillStyle = "#6b7280";
      for (const a of s.asteroids) {
        ctx.beginPath();
        ctx.arc(a.x + a.r, a.y + a.r, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "white";
      ctx.font = "16px sans-serif";
      ctx.fillText(`Score:${s.score}`, 10, 24);
      ctx.fillText(
        `Lives:${"\u2764\uFE0F".repeat(Math.max(0, s.lives))}`,
        10,
        48,
      );
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [started, over]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="font-bold text-lg">
        ← → Move | Space Shoot | Lives: {"❤️".repeat(Math.max(0, lives))}
      </div>
      {over && (
        <div className="text-2xl font-extrabold text-red-500">
          Game Over! Score: {score}
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-2xl border-4 border-border max-w-full"
      />
      {(!started || over) && (
        <button
          type="button"
          onClick={startGame}
          className="px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
        >
          {started ? "Play Again" : "Start!"}
        </button>
      )}
      <TouchControls layout="single" />
    </div>
  );
}
