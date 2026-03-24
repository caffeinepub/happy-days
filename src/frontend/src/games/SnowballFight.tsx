import { useEffect, useRef, useState } from "react";
import { TouchControls } from "../components/TouchControls";

const W = 600;
const H = 350;
const PLAYER_W = 36;
const PLAYER_H = 48;
const SNOWBALL_R = 8;
const SNOWBALL_SPEED = 7;

export function SnowballFight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    p1: { x: 80, y: H - PLAYER_H - 20, hits: 0 },
    p2: { x: W - 80 - PLAYER_W, y: H - PLAYER_H - 20, hits: 0 },
    snowballs: [] as {
      x: number;
      y: number;
      vx: number;
      vy: number;
      owner: number;
    }[],
    keys: {} as Record<string, boolean>,
    running: false,
  });
  const [hits, setHits] = useState({ p1: 0, p2: 0 });
  const [winner, setWinner] = useState("");
  const rafRef = useRef(0);
  const lastThrow = useRef({ p1: 0, p2: 0 });

  function startGame() {
    const s = stateRef.current;
    s.p1 = { x: 80, y: H - PLAYER_H - 20, hits: 0 };
    s.p2 = { x: W - 80 - PLAYER_W, y: H - PLAYER_H - 20, hits: 0 };
    s.snowballs = [];
    s.running = true;
    setHits({ p1: 0, p2: 0 });
    setWinner("");
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key] = e.type === "keydown";
      if (
        [
          "a",
          "d",
          "w",
          "A",
          "D",
          "W",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
        ].includes(e.key)
      )
        e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function update() {
      const s = stateRef.current;
      const now = Date.now();
      ctx.fillStyle = "#d6eaf8";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "white";
      ctx.fillRect(0, H - 20, W, 20);
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc((i * 37 + 10) % W, (i * 53 + 20) % (H - 40), 3, 0, Math.PI * 2);
        ctx.fill();
      }

      if (s.running) {
        const SPEED = 3;
        if (s.keys.a || s.keys.A) s.p1.x = Math.max(0, s.p1.x - SPEED);
        if (s.keys.d || s.keys.D)
          s.p1.x = Math.min(W / 2 - PLAYER_W, s.p1.x + SPEED);
        if (s.keys.ArrowLeft) s.p2.x = Math.max(W / 2, s.p2.x - SPEED);
        if (s.keys.ArrowRight) s.p2.x = Math.min(W - PLAYER_W, s.p2.x + SPEED);
        if ((s.keys.w || s.keys.W) && now - lastThrow.current.p1 > 800) {
          lastThrow.current.p1 = now;
          s.snowballs.push({
            x: s.p1.x + PLAYER_W,
            y: s.p1.y + PLAYER_H / 2,
            vx: SNOWBALL_SPEED,
            vy: -2,
            owner: 1,
          });
        }
        if (s.keys.ArrowUp && now - lastThrow.current.p2 > 800) {
          lastThrow.current.p2 = now;
          s.snowballs.push({
            x: s.p2.x,
            y: s.p2.y + PLAYER_H / 2,
            vx: -SNOWBALL_SPEED,
            vy: -2,
            owner: 2,
          });
        }
        for (const b of s.snowballs) {
          b.x += b.vx;
          b.y += b.vy;
          b.vy += 0.15;
        }
        s.snowballs = s.snowballs.filter(
          (b) => b.x > -20 && b.x < W + 20 && b.y < H,
        );
        s.snowballs = s.snowballs.filter((b) => {
          if (
            b.owner === 1 &&
            b.x > s.p2.x &&
            b.x < s.p2.x + PLAYER_W &&
            b.y > s.p2.y &&
            b.y < s.p2.y + PLAYER_H
          ) {
            s.p2.hits++;
            setHits({ p1: s.p1.hits, p2: s.p2.hits });
            if (s.p2.hits >= 3) {
              s.running = false;
              setWinner("Player 1");
            }
            return false;
          }
          if (
            b.owner === 2 &&
            b.x > s.p1.x &&
            b.x < s.p1.x + PLAYER_W &&
            b.y > s.p1.y &&
            b.y < s.p1.y + PLAYER_H
          ) {
            s.p1.hits++;
            setHits({ p1: s.p1.hits, p2: s.p2.hits });
            if (s.p1.hits >= 3) {
              s.running = false;
              setWinner("Player 2");
            }
            return false;
          }
          return true;
        });
      }

      ctx.fillStyle = "#3498db";
      ctx.fillRect(s.p1.x, s.p1.y, PLAYER_W, PLAYER_H);
      ctx.fillStyle = "#e74c3c";
      ctx.fillRect(s.p2.x, s.p2.y, PLAYER_W, PLAYER_H);
      ctx.font = "28px serif";
      ctx.fillText("🥶", s.p1.x + 4, s.p1.y + 32);
      ctx.fillText("😤", s.p2.x + 4, s.p2.y + 32);
      ctx.fillStyle = "white";
      for (const b of s.snowballs) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, SNOWBALL_R, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#aed6f1";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      rafRef.current = requestAnimationFrame(update);
    }
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-8 text-xl font-extrabold">
        <span className="text-blue-600">🥶 P1 hits: {hits.p2}/3</span>
        <span className="text-red-500">P2 hits: {hits.p1}/3 😤</span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-2xl border-4 border-blue-200 shadow-2xl max-w-full"
      />
      {winner ? (
        <div className="text-center">
          <div className="text-3xl font-extrabold text-yellow-500">
            🏆 {winner} Wins!
          </div>
          <button
            type="button"
            onClick={startGame}
            className="mt-3 px-6 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1 text-sm text-gray-500 text-center">
          <span>P1: A/D move, W throw | P2: ←/→ move, ↑ throw</span>
          <button
            type="button"
            onClick={startGame}
            className="mt-1 px-4 py-1 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
          >
            {stateRef.current.running ? "Restart" : "Start Game"}
          </button>
        </div>
      )}
      <TouchControls layout="twoPlayer" />
    </div>
  );
}
