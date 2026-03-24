import { useCallback, useEffect, useRef, useState } from "react";
import { TouchControls } from "../components/TouchControls";

const COLS = 20;
const ROWS = 20;
const CELL = 20;
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

function randCell(snake: { x: number; y: number }[]) {
  let p: { x: number; y: number };
  do {
    p = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

export function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    dir: "RIGHT" as Dir,
    nextDir: "RIGHT" as Dir,
    food: { x: 5, y: 5 },
    score: 0,
    running: false,
    dead: false,
  });
  const [display, setDisplay] = useState({
    score: 0,
    dead: false,
    started: false,
  });
  const loopRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(s.food.x * CELL + 2, s.food.y * CELL + 2, CELL - 4, CELL - 4);
    s.snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#22c55e" : "#4ade80";
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;
    s.dir = s.nextDir;
    const head = { ...s.snake[0] };
    if (s.dir === "UP") head.y -= 1;
    else if (s.dir === "DOWN") head.y += 1;
    else if (s.dir === "LEFT") head.x -= 1;
    else head.x += 1;
    if (
      head.x < 0 ||
      head.x >= COLS ||
      head.y < 0 ||
      head.y >= ROWS ||
      s.snake.some((seg) => seg.x === head.x && seg.y === head.y)
    ) {
      s.running = false;
      s.dead = true;
      setDisplay((d) => ({ ...d, dead: true }));
      return;
    }
    const ate = head.x === s.food.x && head.y === s.food.y;
    s.snake = [head, ...s.snake];
    if (!ate) s.snake.pop();
    else {
      s.score += 10;
      s.food = randCell(s.snake);
      setDisplay((d) => ({ ...d, score: s.score }));
    }
    draw();
  }, [draw]);

  function start() {
    const s = stateRef.current;
    s.snake = [{ x: 10, y: 10 }];
    s.dir = "RIGHT";
    s.nextDir = "RIGHT";
    s.food = { x: 5, y: 5 };
    s.score = 0;
    s.running = true;
    s.dead = false;
    setDisplay({ score: 0, dead: false, started: true });
    if (loopRef.current) clearInterval(loopRef.current);
    loopRef.current = window.setInterval(tick, 120);
  }

  useEffect(() => {
    draw();
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === "ArrowUp" && s.dir !== "DOWN") {
        e.preventDefault();
        s.nextDir = "UP";
      } else if (e.key === "ArrowDown" && s.dir !== "UP") {
        e.preventDefault();
        s.nextDir = "DOWN";
      } else if (e.key === "ArrowLeft" && s.dir !== "RIGHT") {
        e.preventDefault();
        s.nextDir = "LEFT";
      } else if (e.key === "ArrowRight" && s.dir !== "LEFT") {
        e.preventDefault();
        s.nextDir = "RIGHT";
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, [draw]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 font-body font-bold text-lg">
        <span className="text-primary">🟩 Score: {display.score}</span>
        {display.dead && <span className="text-red-500">💀 Game Over!</span>}
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className="rounded-2xl border-4 border-border max-w-full"
        />
        {!display.started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-2xl">
            <p className="font-display font-extrabold text-white text-3xl mb-4">
              🐍 Snake!
            </p>
            <button
              type="button"
              onClick={start}
              className="px-6 py-3 rounded-2xl bg-green-500 text-white font-display font-bold text-xl cursor-pointer"
            >
              Start!
            </button>
          </div>
        )}
        {display.dead && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-2xl">
            <p className="font-display font-extrabold text-white text-2xl mb-2">
              💀 Game Over! Score: {display.score}
            </p>
            <button
              type="button"
              onClick={start}
              className="px-6 py-3 rounded-2xl bg-green-500 text-white font-display font-bold text-xl cursor-pointer"
            >
              Play Again!
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        {(["UP", "DOWN", "LEFT", "RIGHT"] as Dir[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => {
              const s = stateRef.current;
              if (
                (d === "UP" && s.dir !== "DOWN") ||
                (d === "DOWN" && s.dir !== "UP") ||
                (d === "LEFT" && s.dir !== "RIGHT") ||
                (d === "RIGHT" && s.dir !== "LEFT")
              )
                s.nextDir = d;
            }}
            className="w-10 h-10 rounded-xl bg-muted border-2 border-border font-body font-bold cursor-pointer text-sm"
          >
            {d === "UP" ? "↑" : d === "DOWN" ? "↓" : d === "LEFT" ? "←" : "→"}
          </button>
        ))}
      </div>
      <p className="font-body text-muted-foreground text-sm">
        Use arrow keys or the buttons above to move!
      </p>
      <TouchControls layout="single" />
    </div>
  );
}
