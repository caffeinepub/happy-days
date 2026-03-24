import { useEffect, useRef, useState } from "react";
import { TouchControls } from "../components/TouchControls";

const W = 600;
const H = 400;
const TANK_SIZE = 30;
const BULLET_R = 6;
const BULLET_SPEED = 8;

interface Tank {
  x: number;
  y: number;
  angle: number;
  lives: number;
  color: string;
}
interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  owner: number;
}

export function TankBattle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    t1: { x: 80, y: H / 2, angle: 0, lives: 3, color: "#e74c3c" } as Tank,
    t2: {
      x: W - 80,
      y: H / 2,
      angle: Math.PI,
      lives: 3,
      color: "#3498db",
    } as Tank,
    bullets: [] as Bullet[],
    keys: {} as Record<string, boolean>,
    running: false,
  });
  const [lives, setLives] = useState({ t1: 3, t2: 3 });
  const [winner, setWinner] = useState("");
  const rafRef = useRef(0);
  const lastShot = useRef({ p1: 0, p2: 0 });

  function startGame() {
    const s = stateRef.current;
    s.t1 = { x: 80, y: H / 2, angle: 0, lives: 3, color: "#e74c3c" };
    s.t2 = { x: W - 80, y: H / 2, angle: Math.PI, lives: 3, color: "#3498db" };
    s.bullets = [];
    s.running = true;
    setLives({ t1: 3, t2: 3 });
    setWinner("");
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key] = e.type === "keydown";
      if (
        [
          "w",
          "a",
          "s",
          "d",
          " ",
          "ArrowUp",
          "ArrowLeft",
          "ArrowDown",
          "ArrowRight",
          "Enter",
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

    function drawTank(t: Tank) {
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.rotate(t.angle);
      ctx.fillStyle = t.color;
      ctx.fillRect(-TANK_SIZE / 2, -TANK_SIZE / 2, TANK_SIZE, TANK_SIZE);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, -4, TANK_SIZE / 2 + 4, 8);
      ctx.restore();
    }

    function update() {
      const s = stateRef.current;
      const now = Date.now();
      ctx.fillStyle = "#27ae60";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      if (s.running) {
        const SPEED = 2.5;
        const ROT = 0.05;
        if (s.keys.a || s.keys.A) s.t1.angle -= ROT;
        if (s.keys.d || s.keys.D) s.t1.angle += ROT;
        if (s.keys.w || s.keys.W) {
          s.t1.x += Math.cos(s.t1.angle) * SPEED;
          s.t1.y += Math.sin(s.t1.angle) * SPEED;
        }
        if (s.keys.s || s.keys.S) {
          s.t1.x -= Math.cos(s.t1.angle) * SPEED;
          s.t1.y -= Math.sin(s.t1.angle) * SPEED;
        }
        s.t1.x = Math.max(TANK_SIZE, Math.min(W - TANK_SIZE, s.t1.x));
        s.t1.y = Math.max(TANK_SIZE, Math.min(H - TANK_SIZE, s.t1.y));
        if (s.keys.ArrowLeft) s.t2.angle -= ROT;
        if (s.keys.ArrowRight) s.t2.angle += ROT;
        if (s.keys.ArrowUp) {
          s.t2.x += Math.cos(s.t2.angle) * SPEED;
          s.t2.y += Math.sin(s.t2.angle) * SPEED;
        }
        if (s.keys.ArrowDown) {
          s.t2.x -= Math.cos(s.t2.angle) * SPEED;
          s.t2.y -= Math.sin(s.t2.angle) * SPEED;
        }
        s.t2.x = Math.max(TANK_SIZE, Math.min(W - TANK_SIZE, s.t2.x));
        s.t2.y = Math.max(TANK_SIZE, Math.min(H - TANK_SIZE, s.t2.y));
        if (s.keys[" "] && now - lastShot.current.p1 > 500) {
          lastShot.current.p1 = now;
          s.bullets.push({
            x: s.t1.x,
            y: s.t1.y,
            vx: Math.cos(s.t1.angle) * BULLET_SPEED,
            vy: Math.sin(s.t1.angle) * BULLET_SPEED,
            owner: 1,
          });
        }
        if (s.keys.Enter && now - lastShot.current.p2 > 500) {
          lastShot.current.p2 = now;
          s.bullets.push({
            x: s.t2.x,
            y: s.t2.y,
            vx: Math.cos(s.t2.angle) * BULLET_SPEED,
            vy: Math.sin(s.t2.angle) * BULLET_SPEED,
            owner: 2,
          });
        }
        s.bullets = s.bullets.filter(
          (b) => b.x > 0 && b.x < W && b.y > 0 && b.y < H,
        );
        for (const b of s.bullets) {
          b.x += b.vx;
          b.y += b.vy;
        }
        s.bullets = s.bullets.filter((b) => {
          if (
            b.owner === 1 &&
            Math.hypot(b.x - s.t2.x, b.y - s.t2.y) < TANK_SIZE / 2 + BULLET_R
          ) {
            s.t2.lives--;
            setLives({ t1: s.t1.lives, t2: s.t2.lives });
            if (s.t2.lives <= 0) {
              s.running = false;
              setWinner("Player 1");
            }
            return false;
          }
          if (
            b.owner === 2 &&
            Math.hypot(b.x - s.t1.x, b.y - s.t1.y) < TANK_SIZE / 2 + BULLET_R
          ) {
            s.t1.lives--;
            setLives({ t1: s.t1.lives, t2: s.t2.lives });
            if (s.t1.lives <= 0) {
              s.running = false;
              setWinner("Player 2");
            }
            return false;
          }
          return true;
        });
      }

      drawTank(s.t1);
      drawTank(s.t2);
      for (const b of s.bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, BULLET_R, 0, Math.PI * 2);
        ctx.fillStyle = b.owner === 1 ? "#f39c12" : "#9b59b6";
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(update);
    }
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-8 text-xl font-extrabold">
        <span className="text-red-500">🔴 P1: {"❤️".repeat(lives.t1)}</span>
        <span className="text-blue-500">P2: {"❤️".repeat(lives.t2)} 🔵</span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-2xl border-4 border-green-800 shadow-2xl max-w-full"
      />
      {winner ? (
        <div className="text-center">
          <div className="text-3xl font-extrabold text-yellow-500">
            🏆 {winner} Wins!
          </div>
          <button
            type="button"
            onClick={startGame}
            className="mt-3 px-6 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1 text-sm text-gray-500 text-center">
          <span>P1: WASD move, Space shoot</span>
          <span>P2: Arrow keys move, Enter shoot</span>
          <button
            type="button"
            onClick={startGame}
            className="mt-1 px-4 py-1 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600"
          >
            {stateRef.current.running ? "Restart" : "Start Game"}
          </button>
        </div>
      )}
      <TouchControls layout="twoPlayer" />
    </div>
  );
}
