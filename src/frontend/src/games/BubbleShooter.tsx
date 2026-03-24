import { useCallback, useEffect, useRef, useState } from "react";

const COLS = 8;
const ROWS = 6;
const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7"];
const CR = 28;
const CW = CR * 2;
const CH = CR * 2;
const CX = (col: number) => col * CW + CR;
const CY = (row: number) => row * CH + CR;
const W = COLS * CW;
const H_GRID = ROWS * CH;
const TOTAL_H = H_GRID + 120;

function makeGrid(): (string | null)[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from(
      { length: COLS },
      () => COLORS[Math.floor(Math.random() * COLORS.length)],
    ),
  );
}

export function BubbleShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef(makeGrid());
  const [current, setCurrent] = useState(
    COLORS[Math.floor(Math.random() * COLORS.length)],
  );
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [angle, setAngle] = useState(90);
  const [started, setStarted] = useState(false);

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, 0, W, TOTAL_H);
    const grid = gridRef.current;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const color = grid[r][c];
        if (!color) continue;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(CX(c), CY(r), CR - 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
    const sx = W / 2;
    const sy = TOTAL_H - 30;
    const rad = (angle * Math.PI) / 180;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(
      sx + Math.cos(rad - Math.PI / 2) * 50,
      sy + Math.sin(rad - Math.PI / 2) * 50,
    );
    ctx.stroke();
    ctx.fillStyle = current;
    ctx.beginPath();
    ctx.arc(sx, sy, CR - 3, 0, Math.PI * 2);
    ctx.fill();
  }, [angle, current]);

  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  function shoot() {
    const rad = ((90 - angle) * Math.PI) / 180;
    let bx = W / 2;
    let by = TOTAL_H - 30;
    const vx = Math.cos(rad) * CW;
    const vy = -Math.sin(rad) * CH;
    let steps = 0;
    const interval = setInterval(() => {
      bx += vx * 0.3;
      by += vy * 0.3;
      if (bx < CR) bx = CR;
      if (bx > W - CR) bx = W - CR;
      if (by < CR) {
        const col = Math.round((bx - CR) / CW);
        place(Math.max(0, Math.min(COLS - 1, col)), 0);
        clearInterval(interval);
        return;
      }
      const row = Math.round((by - CR) / CH);
      const col = Math.round((bx - CR) / CW);
      if (
        row >= 0 &&
        row < ROWS &&
        col >= 0 &&
        col < COLS &&
        gridRef.current[row][col]
      ) {
        place(col, Math.max(0, row - 1));
        clearInterval(interval);
        return;
      }
      steps++;
      if (steps > 200) clearInterval(interval);
    }, 16);
  }

  function place(col: number, row: number) {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
      nextBubble();
      return;
    }
    const grid = gridRef.current;
    grid[row][col] = current;
    const color = current;
    const toRemove: [number, number][] = [];
    const visited = new Set<string>();
    function dfs(r: number, c: number) {
      const k = `${r},${c}`;
      if (visited.has(k)) return;
      visited.add(k);
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS || grid[r][c] !== color)
        return;
      toRemove.push([r, c]);
      dfs(r - 1, c);
      dfs(r + 1, c);
      dfs(r, c - 1);
      dfs(r, c + 1);
    }
    dfs(row, col);
    if (toRemove.length >= 3) {
      for (const [r, c] of toRemove) grid[r][c] = null;
      setScore((s) => s + toRemove.length * 10);
    }
    if (grid.every((r) => r.every((c) => !c))) setDone(true);
    nextBubble();
    drawGrid();
  }

  function nextBubble() {
    setCurrent(COLORS[Math.floor(Math.random() * COLORS.length)]);
  }

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!started) setStarted(true);
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top) * (TOTAL_H / rect.height);
    const sx = W / 2;
    const sy = TOTAL_H - 30;
    const a = (Math.atan2(sy - my, mx - sx) * 180) / Math.PI + 90;
    setAngle(Math.max(10, Math.min(170, a)));
    shoot();
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">🎉</div>
        <h2 className="font-display font-extrabold text-4xl">
          You cleared it!
        </h2>
        <p className="font-body text-2xl">Score: {score}</p>
        <button
          type="button"
          onClick={() => {
            gridRef.current = makeGrid();
            setScore(0);
            setDone(false);
            setStarted(false);
            setCurrent(COLORS[0]);
            drawGrid();
          }}
          className="px-8 py-4 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
        >
          Play Again!
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 font-body font-bold text-lg">
        <span className="text-primary">🎈 Score: {score}</span>
        <span>
          Next:{" "}
          <span
            className="inline-block w-5 h-5 rounded-full align-middle"
            style={{ backgroundColor: current }}
          />
        </span>
      </div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: canvas game uses mouse clicks */}
      <canvas
        ref={canvasRef}
        width={W}
        height={TOTAL_H}
        className="rounded-2xl border-4 border-border max-w-full cursor-crosshair"
        onClick={handleCanvasClick}
      />
      <p className="font-body text-muted-foreground text-sm">
        Click to aim and shoot! Match 3+ same color bubbles to pop them!
      </p>
    </div>
  );
}
