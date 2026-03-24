import { useCallback, useEffect, useRef, useState } from "react";

const W = 360;
const H = 420;
const PLAYER_W = 40;
const PLAYER_H = 36;
const SPEED = 5;
const GAME_TIME = 30;

interface Falling {
  x: number;
  y: number;
  speed: number;
  type: "gem" | "bomb";
  emoji: string;
}

const GEMS = ["💎", "💍", "⭐", "🌟"];

export function GemCollector() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerX = useRef(W / 2 - PLAYER_W / 2);
  const items = useRef<Falling[]>([]);
  const scoreRef = useRef(0);
  const timeRef = useRef(GAME_TIME);
  const frameRef = useRef(0);
  const animRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "running" | "done">(
    "idle",
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = "#1a1a3e";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 30; i++) {
      const sx = (i * 47 + 13) % W;
      const sy = (i * 31 + 7) % H;
      ctx.fillRect(sx, sy, 2, 2);
    }

    ctx.font = "36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🧺", playerX.current + PLAYER_W / 2, H - 10);

    for (const item of items.current) {
      ctx.fillText(item.emoji, item.x, item.y);
    }

    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${scoreRef.current}`, 10, 28);
    ctx.textAlign = "right";
    ctx.fillText(`⏱ ${timeRef.current}s`, W - 10, 28);
  }, []);

  const gameLoop = useCallback(() => {
    const keys = keysRef.current;
    if (keys.has("ArrowLeft"))
      playerX.current = Math.max(0, playerX.current - SPEED);
    if (keys.has("ArrowRight"))
      playerX.current = Math.min(W - PLAYER_W, playerX.current + SPEED);

    frameRef.current++;
    if (frameRef.current % 60 === 0) {
      timeRef.current--;
      if (timeRef.current <= 0) {
        setGameState("done");
        cancelAnimationFrame(animRef.current);
        draw();
        return;
      }
    }

    if (frameRef.current % 30 === 0) {
      const isBomb = Math.random() < 0.3;
      items.current.push({
        x: 20 + Math.random() * (W - 40),
        y: -20,
        speed: 2 + Math.random() * 3,
        type: isBomb ? "bomb" : "gem",
        emoji: isBomb ? "💣" : GEMS[Math.floor(Math.random() * GEMS.length)],
      });
    }

    for (const item of items.current) item.y += item.speed;
    const px = playerX.current;
    const py = H - PLAYER_H - 10;
    items.current = items.current.filter((item) => {
      if (item.y > H) return false;
      if (
        item.x > px - 10 &&
        item.x < px + PLAYER_W + 10 &&
        item.y > py &&
        item.y < py + PLAYER_H + 20
      ) {
        if (item.type === "gem") {
          scoreRef.current++;
          setScore(scoreRef.current);
        } else {
          scoreRef.current = Math.max(0, scoreRef.current - 1);
          setScore(scoreRef.current);
        }
        return false;
      }
      return true;
    });

    draw();
    animRef.current = requestAnimationFrame(gameLoop);
  }, [draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (gameState !== "running") return;
    const onKey = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      e.preventDefault();
    };
    const offKey = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", offKey);
    animRef.current = requestAnimationFrame(gameLoop);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", offKey);
      cancelAnimationFrame(animRef.current);
    };
  }, [gameState, gameLoop]);

  function start() {
    playerX.current = W / 2 - PLAYER_W / 2;
    items.current = [];
    scoreRef.current = 0;
    timeRef.current = GAME_TIME;
    frameRef.current = 0;
    setScore(0);
    setGameState("running");
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 select-none">
      <h2 className="font-display font-extrabold text-2xl">💎 Gem Collector</h2>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="border-4 border-border rounded-2xl max-w-full"
      />
      {gameState === "running" && (
        <div className="flex gap-4">
          <button
            type="button"
            onTouchStart={() => keysRef.current.add("ArrowLeft")}
            onTouchEnd={() => keysRef.current.delete("ArrowLeft")}
            onMouseDown={() => keysRef.current.add("ArrowLeft")}
            onMouseUp={() => keysRef.current.delete("ArrowLeft")}
            className="bg-indigo-300 rounded-xl px-8 py-4 text-2xl font-bold"
          >
            ◄
          </button>
          <button
            type="button"
            onTouchStart={() => keysRef.current.add("ArrowRight")}
            onTouchEnd={() => keysRef.current.delete("ArrowRight")}
            onMouseDown={() => keysRef.current.add("ArrowRight")}
            onMouseUp={() => keysRef.current.delete("ArrowRight")}
            className="bg-indigo-300 rounded-xl px-8 py-4 text-2xl font-bold"
          >
            ►
          </button>
        </div>
      )}
      {(gameState === "idle" || gameState === "done") && (
        <div className="text-center">
          {gameState === "done" && (
            <div className="text-2xl font-display font-extrabold mb-2">
              Time's up! Score: {score} 💎
            </div>
          )}
          <button
            type="button"
            onClick={start}
            className="bg-primary text-white px-8 py-3 rounded-2xl font-body font-bold text-lg"
          >
            {gameState === "idle" ? "Start!" : "Play Again"}
          </button>
        </div>
      )}
    </div>
  );
}
