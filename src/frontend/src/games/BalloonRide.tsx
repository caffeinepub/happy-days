import { useCallback, useEffect, useRef, useState } from "react";

const W = 360;
const H = 480;
const BALLOON_X = 80;
const GAP = 140;
const WALL_SPEED = 3;
const BALLOON_SPEED = 4;

interface Wall {
  x: number;
  gapY: number;
  passed: boolean;
}

export function BalloonRide() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const balloonY = useRef(H / 2);
  const wallsRef = useRef<Wall[]>([]);
  const animRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const frameRef = useRef(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "running" | "dead">(
    "idle",
  );
  const scoreRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // sky
    ctx.fillStyle = "#87ceeb";
    ctx.fillRect(0, 0, W, H);

    // clouds (decorative)
    ctx.fillStyle = "#ffffff";
    [60, 200, 300].forEach((cx, i) => {
      ctx.beginPath();
      ctx.arc(cx, 50 + i * 30, 28, 0, Math.PI * 2);
      ctx.arc(cx + 30, 50 + i * 30, 22, 0, Math.PI * 2);
      ctx.fill();
    });

    // walls
    for (const wall of wallsRef.current) {
      ctx.fillStyle = "#4CAF50";
      ctx.fillRect(wall.x, 0, 40, wall.gapY - GAP / 2);
      ctx.fillRect(wall.x, wall.gapY + GAP / 2, 40, H - wall.gapY - GAP / 2);
    }

    // balloon
    ctx.font = "36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🎈", BALLOON_X, balloonY.current);

    // score
    ctx.fillStyle = "#333";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(`Score: ${scoreRef.current}`, W / 2, 30);
  }, []);

  const gameLoop = useCallback(() => {
    const keys = keysRef.current;
    if (keys.has("ArrowLeft") || keys.has("ArrowUp"))
      balloonY.current = Math.max(20, balloonY.current - BALLOON_SPEED);
    if (keys.has("ArrowRight") || keys.has("ArrowDown"))
      balloonY.current = Math.min(H - 20, balloonY.current + BALLOON_SPEED);

    // Spawn walls
    frameRef.current++;
    if (frameRef.current % 90 === 0) {
      wallsRef.current.push({
        x: W,
        gapY: 100 + Math.random() * (H - 200),
        passed: false,
      });
    }

    // Move walls
    for (const wall of wallsRef.current) wall.x -= WALL_SPEED;
    wallsRef.current = wallsRef.current.filter((w) => w.x > -50);

    // Score
    for (const wall of wallsRef.current) {
      if (!wall.passed && wall.x + 40 < BALLOON_X) {
        wall.passed = true;
        scoreRef.current++;
        setScore(scoreRef.current);
      }
    }

    // Collision
    for (const wall of wallsRef.current) {
      if (BALLOON_X + 14 > wall.x && BALLOON_X - 14 < wall.x + 40) {
        const topWall = wall.gapY - GAP / 2;
        const botWall = wall.gapY + GAP / 2;
        if (
          balloonY.current - 14 < topWall ||
          balloonY.current + 14 > botWall
        ) {
          setBest((b) => Math.max(b, scoreRef.current));
          setGameState("dead");
          cancelAnimationFrame(animRef.current);
          draw();
          return;
        }
      }
    }

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
    balloonY.current = H / 2;
    wallsRef.current = [];
    frameRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
    setGameState("running");
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 select-none">
      <h2 className="font-display font-extrabold text-2xl">🎈 Balloon Ride</h2>
      <div className="font-body font-bold">
        Score: {score} | Best: {best}
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="border-4 border-border rounded-2xl max-w-full"
      />
      {/* Touch controls */}
      {gameState === "running" && (
        <div className="flex gap-4">
          <button
            type="button"
            onTouchStart={() => keysRef.current.add("ArrowUp")}
            onTouchEnd={() => keysRef.current.delete("ArrowUp")}
            onMouseDown={() => keysRef.current.add("ArrowUp")}
            onMouseUp={() => keysRef.current.delete("ArrowUp")}
            className="bg-sky-300 rounded-xl px-6 py-4 text-2xl font-bold"
          >
            ↑ Up
          </button>
          <button
            type="button"
            onTouchStart={() => keysRef.current.add("ArrowDown")}
            onTouchEnd={() => keysRef.current.delete("ArrowDown")}
            onMouseDown={() => keysRef.current.add("ArrowDown")}
            onMouseUp={() => keysRef.current.delete("ArrowDown")}
            className="bg-sky-300 rounded-xl px-6 py-4 text-2xl font-bold"
          >
            ↓ Down
          </button>
        </div>
      )}
      {(gameState === "idle" || gameState === "dead") && (
        <div className="text-center">
          {gameState === "dead" && (
            <div className="text-xl font-display font-extrabold mb-2">
              💥 Crashed! Score: {score}
            </div>
          )}
          <button
            type="button"
            onClick={start}
            className="bg-primary text-white px-8 py-3 rounded-2xl font-body font-bold text-lg"
          >
            {gameState === "idle" ? "Start!" : "Try Again"}
          </button>
        </div>
      )}
    </div>
  );
}
