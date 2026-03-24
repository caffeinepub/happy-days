import { useCallback, useEffect, useRef, useState } from "react";

const W = 360;
const H = 420;
const BASKET_W = 60;
const BASKET_H = 30;
const SPEED_START = 3;
const GAME_TIME = 45;

interface Item {
  x: number;
  y: number;
  speed: number;
  type: "star" | "moon";
}

export function StarPatrol() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const basketX = useRef(W / 2 - BASKET_W / 2);
  const itemsRef = useRef<Item[]>([]);
  const scoreRef = useRef(0);
  const timeRef = useRef(GAME_TIME);
  const frameRef = useRef(0);
  const animRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "running" | "done">(
    "idle",
  );
  const speedRef = useRef(SPEED_START);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0d0d2b");
    grad.addColorStop(1, "#1a1a4e");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    for (let i = 0; i < 40; i++) {
      ctx.fillRect((i * 37 + 5) % W, (i * 53 + 11) % H, 2, 2);
    }

    ctx.font = "28px sans-serif";
    ctx.textAlign = "center";
    for (const item of itemsRef.current) {
      ctx.fillText(item.type === "star" ? "⭐" : "🌙", item.x, item.y);
    }

    ctx.fillStyle = "#ffd93d";
    ctx.beginPath();
    ctx.roundRect(basketX.current, H - BASKET_H - 10, BASKET_W, BASKET_H, 8);
    ctx.fill();
    ctx.fillStyle = "#333";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🧺", basketX.current + BASKET_W / 2, H - 18);

    ctx.fillStyle = "white";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`⭐ ${scoreRef.current}`, 10, 28);
    ctx.textAlign = "right";
    ctx.fillText(`⏱ ${timeRef.current}s`, W - 10, 28);
  }, []);

  const gameLoop = useCallback(() => {
    const keys = keysRef.current;
    const speed = 5;
    if (keys.has("ArrowLeft"))
      basketX.current = Math.max(0, basketX.current - speed);
    if (keys.has("ArrowRight"))
      basketX.current = Math.min(W - BASKET_W, basketX.current + speed);

    frameRef.current++;
    if (frameRef.current % 60 === 0) {
      timeRef.current--;
      speedRef.current =
        SPEED_START + Math.floor((GAME_TIME - timeRef.current) / 10);
      if (timeRef.current <= 0) {
        setGameState("done");
        cancelAnimationFrame(animRef.current);
        draw();
        return;
      }
    }

    if (frameRef.current % 40 === 0) {
      itemsRef.current.push({
        x: 20 + Math.random() * (W - 40),
        y: -20,
        speed: speedRef.current + Math.random() * 2,
        type: Math.random() < 0.35 ? "moon" : "star",
      });
    }

    for (const item of itemsRef.current) item.y += item.speed;
    const bx = basketX.current;
    const by = H - BASKET_H - 10;
    itemsRef.current = itemsRef.current.filter((item) => {
      if (item.y > H) return false;
      if (
        item.x > bx - 10 &&
        item.x < bx + BASKET_W + 10 &&
        item.y > by &&
        item.y < by + BASKET_H + 24
      ) {
        if (item.type === "star") {
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
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
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
    basketX.current = W / 2 - BASKET_W / 2;
    itemsRef.current = [];
    scoreRef.current = 0;
    timeRef.current = GAME_TIME;
    frameRef.current = 0;
    speedRef.current = SPEED_START;
    setScore(0);
    setGameState("running");
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 select-none">
      <h2 className="font-display font-extrabold text-2xl">⭐ Star Patrol</h2>
      <p className="font-body text-sm text-muted-foreground">
        Catch ⭐ stars, avoid 🌙 moons!
      </p>
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
            className="bg-yellow-300 rounded-xl px-8 py-4 text-2xl font-bold"
          >
            ◄
          </button>
          <button
            type="button"
            onTouchStart={() => keysRef.current.add("ArrowRight")}
            onTouchEnd={() => keysRef.current.delete("ArrowRight")}
            onMouseDown={() => keysRef.current.add("ArrowRight")}
            onMouseUp={() => keysRef.current.delete("ArrowRight")}
            className="bg-yellow-300 rounded-xl px-8 py-4 text-2xl font-bold"
          >
            ►
          </button>
        </div>
      )}
      {(gameState === "idle" || gameState === "done") && (
        <div className="text-center">
          {gameState === "done" && (
            <div className="text-2xl font-display font-extrabold mb-2">
              🎉 Score: {score} stars!
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
