import { useEffect, useRef, useState } from "react";
import { TouchControls } from "../components/TouchControls";

interface Brick {
  x: number;
  y: number;
  alive: boolean;
  color: string;
}

export function BrickBreaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);
  const stateRef = useRef({
    px: 220,
    bx: 280,
    by: 340,
    vx: 3,
    vy: -4,
    bricks: [] as Brick[],
    score: 0,
  });
  const keysRef = useRef<Record<string, boolean>>({});
  const rafRef = useRef(0);
  const W = 560;
  const H = 400;

  const makeBricks = () => {
    const colors = [
      "#ef4444",
      "#f97316",
      "#eab308",
      "#22c55e",
      "#3b82f6",
      "#a855f7",
    ];
    const b: Brick[] = [];
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 9; c++)
        b.push({
          x: 10 + c * 60,
          y: 40 + r * 30,
          alive: true,
          color: colors[r % colors.length],
        });
    return b;
  };

  const startGame = () => {
    const s = stateRef.current;
    s.px = 220;
    s.bx = 280;
    s.by = 340;
    s.vx = 3;
    s.vy = -4;
    s.bricks = makeBricks();
    s.score = 0;
    setScore(0);
    setOver(false);
    setWon(false);
    setStarted(true);
  };

  useEffect(() => {
    if (!started || over || won) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const onKey = (e: KeyboardEvent) => {
      keysRef.current[e.code] = e.type === "keydown";
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    const loop = () => {
      const s = stateRef.current;
      const k = keysRef.current;
      if (k.ArrowLeft || k.KeyA) s.px = Math.max(0, s.px - 7);
      if (k.ArrowRight || k.KeyD) s.px = Math.min(W - 100, s.px + 7);
      s.bx += s.vx;
      s.by += s.vy;
      if (s.bx <= 8 || s.bx >= W - 8) s.vx *= -1;
      if (s.by <= 8) s.vy *= -1;
      if (s.by >= H - 20) {
        setOver(true);
        cancelAnimationFrame(rafRef.current);
        return;
      }
      if (s.by >= H - 50 && s.bx >= s.px && s.bx <= s.px + 100)
        s.vy = -Math.abs(s.vy);
      for (const br of s.bricks) {
        if (!br.alive) continue;
        if (
          s.bx >= br.x &&
          s.bx <= br.x + 55 &&
          s.by >= br.y &&
          s.by <= br.y + 24
        ) {
          br.alive = false;
          s.vy *= -1;
          s.score += 10;
          setScore(s.score);
        }
      }
      if (s.bricks.every((b) => !b.alive)) {
        setWon(true);
        cancelAnimationFrame(rafRef.current);
        return;
      }
      ctx.fillStyle = "#1e1b4b";
      ctx.fillRect(0, 0, W, H);
      for (const br of s.bricks) {
        if (!br.alive) continue;
        ctx.fillStyle = br.color;
        ctx.fillRect(br.x, br.y, 55, 22);
        ctx.strokeStyle = "#fff2";
        ctx.strokeRect(br.x, br.y, 55, 22);
      }
      ctx.fillStyle = "#60a5fa";
      ctx.fillRect(s.px, H - 40, 100, 14);
      ctx.beginPath();
      ctx.arc(s.bx, s.by, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#fbbf24";
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "16px sans-serif";
      ctx.fillText(`Score: ${s.score}`, 10, 24);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [started, over, won]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="font-bold text-lg">← → or A/D to move paddle</div>
      {over && (
        <div className="text-2xl font-extrabold text-red-500">
          Game Over! Score: {score}
        </div>
      )}
      {won && (
        <div className="text-2xl font-extrabold text-green-500">
          🎉 You Win! Score: {score}
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-2xl border-4 border-border max-w-full"
      />
      {(!started || over || won) && (
        <button
          type="button"
          onClick={startGame}
          className="px-6 py-3 bg-purple-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
        >
          {started ? "Play Again" : "Start!"}
        </button>
      )}
      <TouchControls layout="single" />
    </div>
  );
}
