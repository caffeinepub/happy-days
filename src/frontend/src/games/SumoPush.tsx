import { useCallback, useEffect, useRef, useState } from "react";

const CANVAS_W = 380;
const CANVAS_H = 200;
const PLATFORM_Y = 150;
const PLATFORM_LEFT = 30;
const PLATFORM_RIGHT = CANVAS_W - 30;
const PLAYER_SIZE = 36;
const SPEED = 3;
const PUSH_SPEED = 2;

interface PlayerState {
  x: number;
  lives: number;
}

export function SumoPush() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const p1 = useRef<PlayerState>({ x: 100, lives: 3 });
  const p2 = useRef<PlayerState>({ x: CANVAS_W - 100, lives: 3 });
  const keysRef = useRef<Set<string>>(new Set());
  const animRef = useRef<number>(0);
  const [scores, setScores] = useState({ p1: 3, p2: 3 });
  const [msg, setMsg] = useState("");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const pausedRef = useRef(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Platform
    ctx.fillStyle = "#8B6914";
    ctx.fillRect(
      PLATFORM_LEFT,
      PLATFORM_Y + PLAYER_SIZE,
      PLATFORM_RIGHT - PLATFORM_LEFT,
      14,
    );

    // Players
    const drawPlayer = (x: number, color: string, label: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, PLATFORM_Y + PLAYER_SIZE / 2, PLAYER_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, x, PLATFORM_Y + PLAYER_SIZE / 2 + 6);
    };

    drawPlayer(p1.current.x, "#4d96ff", "P1");
    drawPlayer(p2.current.x, "#ff6b6b", "P2");
  }, []);

  const gameLoop = useCallback(() => {
    if (pausedRef.current) return;
    const keys = keysRef.current;
    const p1s = p1.current;
    const p2s = p2.current;

    let dx1 = 0;
    let dx2 = 0;
    if (keys.has("a") || keys.has("A")) dx1 = -SPEED;
    if (keys.has("d") || keys.has("D")) dx1 = SPEED;
    if (keys.has("ArrowLeft")) dx2 = -SPEED;
    if (keys.has("ArrowRight")) dx2 = SPEED;

    p1s.x = Math.max(
      PLATFORM_LEFT + PLAYER_SIZE / 2,
      Math.min(PLATFORM_RIGHT - PLAYER_SIZE / 2, p1s.x + dx1),
    );
    p2s.x = Math.max(
      PLATFORM_LEFT + PLAYER_SIZE / 2,
      Math.min(PLATFORM_RIGHT - PLAYER_SIZE / 2, p2s.x + dx2),
    );

    // Collision push
    const dist = p2s.x - p1s.x;
    if (Math.abs(dist) < PLAYER_SIZE) {
      const push = (PLAYER_SIZE - Math.abs(dist)) / 2 + PUSH_SPEED;
      if (dist > 0) {
        p1s.x -= push;
        p2s.x += push;
      } else {
        p1s.x += push;
        p2s.x -= push;
      }
    }

    // Check fall
    let fell = false;
    if (
      p1s.x < PLATFORM_LEFT + PLAYER_SIZE / 2 ||
      p1s.x > PLATFORM_RIGHT - PLAYER_SIZE / 2
    ) {
      p1s.lives--;
      p1s.x = 100;
      p2s.x = CANVAS_W - 100;
      fell = true;
    }
    if (
      p2s.x < PLATFORM_LEFT + PLAYER_SIZE / 2 ||
      p2s.x > PLATFORM_RIGHT - PLAYER_SIZE / 2
    ) {
      p2s.lives--;
      p1s.x = 100;
      p2s.x = CANVAS_W - 100;
      fell = true;
    }

    if (fell) {
      setScores({ p1: p1s.lives, p2: p2s.lives });
      if (p1s.lives <= 0 || p2s.lives <= 0) {
        pausedRef.current = true;
        setMsg(p1s.lives <= 0 ? "Player 2 Wins! 🏆" : "Player 1 Wins! 🏆");
        setDone(true);
        draw();
        return;
      }
    }

    draw();
    animRef.current = requestAnimationFrame(gameLoop);
  }, [draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (!running) return;
    const onKey = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
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
  }, [running, gameLoop]);

  function reset() {
    p1.current = { x: 100, lives: 3 };
    p2.current = { x: CANVAS_W - 100, lives: 3 };
    setScores({ p1: 3, p2: 3 });
    setMsg("");
    setDone(false);
    pausedRef.current = false;
    setRunning(false);
    setTimeout(() => draw(), 50);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 select-none">
      <h2 className="font-display font-extrabold text-2xl">🤼 Sumo Push</h2>
      <div className="flex gap-8 font-body font-bold text-lg">
        <span className="text-blue-600">P1 (A/D): {"❤️".repeat(scores.p1)}</span>
        <span className="text-red-500">
          P2 (Arrows): {"❤️".repeat(scores.p2)}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="border-4 border-border rounded-2xl bg-sky-100"
      />
      {msg && (
        <div className="text-2xl font-display font-extrabold text-primary">
          {msg}
        </div>
      )}
      {/* Touch controls */}
      {running && !done && (
        <div className="flex gap-12">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-body font-bold text-blue-600">
              P1
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onTouchStart={() => keysRef.current.add("a")}
                onTouchEnd={() => keysRef.current.delete("a")}
                onMouseDown={() => keysRef.current.add("a")}
                onMouseUp={() => keysRef.current.delete("a")}
                className="bg-blue-200 rounded-xl px-4 py-3 text-xl"
              >
                ◄
              </button>
              <button
                type="button"
                onTouchStart={() => keysRef.current.add("d")}
                onTouchEnd={() => keysRef.current.delete("d")}
                onMouseDown={() => keysRef.current.add("d")}
                onMouseUp={() => keysRef.current.delete("d")}
                className="bg-blue-200 rounded-xl px-4 py-3 text-xl"
              >
                ►
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-body font-bold text-red-500">P2</span>
            <div className="flex gap-2">
              <button
                type="button"
                onTouchStart={() => keysRef.current.add("ArrowLeft")}
                onTouchEnd={() => keysRef.current.delete("ArrowLeft")}
                onMouseDown={() => keysRef.current.add("ArrowLeft")}
                onMouseUp={() => keysRef.current.delete("ArrowLeft")}
                className="bg-red-200 rounded-xl px-4 py-3 text-xl"
              >
                ◄
              </button>
              <button
                type="button"
                onTouchStart={() => keysRef.current.add("ArrowRight")}
                onTouchEnd={() => keysRef.current.delete("ArrowRight")}
                onMouseDown={() => keysRef.current.add("ArrowRight")}
                onMouseUp={() => keysRef.current.delete("ArrowRight")}
                className="bg-red-200 rounded-xl px-4 py-3 text-xl"
              >
                ►
              </button>
            </div>
          </div>
        </div>
      )}
      {!running && !done && (
        <button
          type="button"
          onClick={() => setRunning(true)}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-body font-bold text-lg"
        >
          Start!
        </button>
      )}
      {done && (
        <button
          type="button"
          onClick={reset}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-body font-bold"
        >
          Play Again
        </button>
      )}
    </div>
  );
}
