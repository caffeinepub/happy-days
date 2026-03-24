import { useEffect, useRef, useState } from "react";
import { TouchControls } from "../components/TouchControls";

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function RocketRacer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const gameRef = useRef({
    p1y: 150,
    p2y: 200,
    p1x: 60,
    p2x: 60,
    obs: [] as Obstacle[],
    frame: 0,
    done: false,
  });
  const keysRef = useRef<Record<string, boolean>>({});
  const rafRef = useRef(0);
  const W = 600;
  const H = 400;
  const GOAL = 500;

  const start = () => {
    const g = gameRef.current;
    g.p1y = 100;
    g.p2y = 250;
    g.p1x = 60;
    g.p2x = 60;
    g.obs = [];
    g.frame = 0;
    g.done = false;
    setWinner(null);
    setStarted(true);
  };

  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      keysRef.current[e.key] = e.type === "keydown";
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const g = gameRef.current;
      if (g.done) return;
      const keys = keysRef.current;
      if (keys.w || keys.W) g.p1y = Math.max(20, g.p1y - 4);
      if (keys.s || keys.S) g.p1y = Math.min(H - 20, g.p1y + 4);
      if (keys.ArrowUp) g.p2y = Math.max(20, g.p2y - 4);
      if (keys.ArrowDown) g.p2y = Math.min(H - 20, g.p2y + 4);
      g.p1x += 2;
      g.p2x += 1.5;
      if (g.frame % 80 === 0)
        g.obs.push({ x: W, y: Math.random() * (H - 60) + 30, w: 20, h: 60 });
      g.obs = g.obs.map((o) => ({ ...o, x: o.x - 3 })).filter((o) => o.x > -30);
      g.frame++;
      for (const o of g.obs) {
        if (
          g.p1x + 15 > o.x &&
          g.p1x - 15 < o.x + o.w &&
          g.p1y + 15 > o.y &&
          g.p1y - 15 < o.y + o.h
        )
          g.p1x -= 20;
        if (
          g.p2x + 15 > o.x &&
          g.p2x - 15 < o.x + o.w &&
          g.p2y + 15 > o.y &&
          g.p2y - 15 < o.y + o.h
        )
          g.p2x -= 20;
      }
      if (g.p1x >= GOAL) {
        g.done = true;
        setWinner("Player 1 🔵");
        return;
      }
      if (g.p2x >= GOAL) {
        g.done = true;
        setWinner("Player 2 🟠");
        return;
      }
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "white";
      for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.arc((i * 47 + g.frame) % W, (i * 83) % H, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = "gold";
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(GOAL, 0);
      ctx.lineTo(GOAL, H);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#ef4444";
      for (const o of g.obs) ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.font = "28px serif";
      ctx.fillText("🚀", g.p1x - 14, g.p1y + 10);
      ctx.fillText("🛸", g.p2x - 14, g.p2y + 10);
      ctx.fillStyle = "#60a5fa";
      ctx.fillRect(10, 10, (g.p1x / GOAL) * 200, 12);
      ctx.fillStyle = "#fb923c";
      ctx.fillRect(10, 28, (g.p2x / GOAL) * 200, 12);
      ctx.fillStyle = "white";
      ctx.font = "12px sans-serif";
      ctx.fillText("P1", 215, 22);
      ctx.fillText("P2", 215, 40);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [started]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xl font-bold">
        🚀 P1: W/S keys &nbsp;|&nbsp; 🛸 P2: Up/Down arrows
      </div>
      {winner && (
        <div className="text-3xl font-extrabold text-yellow-500">
          🏆 {winner} Wins!
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-2xl border-4 border-border max-w-full"
      />
      <button
        type="button"
        onClick={start}
        className="px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
      >
        {started ? "Play Again" : "Start Race!"}
      </button>
      <TouchControls layout="twoPlayer" />
    </div>
  );
}
