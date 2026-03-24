import { useEffect, useRef, useState } from "react";

const DOTS = [
  { x: 200, y: 50 },
  { x: 150, y: 80 },
  { x: 250, y: 80 },
  { x: 100, y: 130 },
  { x: 300, y: 130 },
  { x: 80, y: 180 },
  { x: 320, y: 180 },
  { x: 100, y: 230 },
  { x: 300, y: 230 },
  { x: 130, y: 270 },
  { x: 270, y: 270 },
  { x: 160, y: 300 },
  { x: 240, y: 300 },
  { x: 200, y: 310 },
  { x: 150, y: 280 },
  { x: 250, y: 280 },
  { x: 130, y: 250 },
  { x: 270, y: 250 },
  { x: 100, y: 210 },
  { x: 300, y: 210 },
  { x: 80, y: 160 },
  { x: 320, y: 160 },
  { x: 110, y: 110 },
  { x: 290, y: 110 },
  { x: 160, y: 60 },
  { x: 240, y: 60 },
  { x: 180, y: 40 },
  { x: 220, y: 40 },
  { x: 200, y: 30 },
  { x: 200, y: 320 },
];

const W = 400;
const H = 360;

export function DotConnect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [next, setNext] = useState(0);
  const [done, setDone] = useState(false);
  const linesRef = useRef<{ x1: number; y1: number; x2: number; y2: number }[]>(
    [],
  );

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fef9c3";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2;
    for (const l of linesRef.current) {
      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1);
      ctx.lineTo(l.x2, l.y2);
      ctx.stroke();
    }
    DOTS.forEach((d, i) => {
      ctx.fillStyle = i < next ? "#22c55e" : "#6366f1";
      ctx.beginPath();
      ctx.arc(d.x, d.y, i === next ? 10 : 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(i + 1), d.x, d.y);
    });
  }

  useEffect(() => {
    draw();
  });

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (done) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top) * (H / rect.height);
    const dot = DOTS[next];
    if (Math.hypot(mx - dot.x, my - dot.y) < 20) {
      if (next > 0)
        linesRef.current.push({
          x1: DOTS[next - 1].x,
          y1: DOTS[next - 1].y,
          x2: dot.x,
          y2: dot.y,
        });
      const newNext = next + 1;
      if (newNext >= DOTS.length) setDone(true);
      else setNext(newNext);
    }
  }

  function restart() {
    linesRef.current = [];
    setNext(0);
    setDone(false);
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex gap-6 font-body font-bold text-lg">
        <span>
          Connect dot <strong>{next + 1}</strong> of {DOTS.length}
        </span>
        {done && <span className="text-green-500">✅ Done!</span>}
      </div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: canvas game uses mouse clicks */}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-2xl border-4 border-border max-w-full cursor-pointer"
        onClick={handleCanvasClick}
      />
      {done && (
        <div className="text-center">
          <p className="font-display font-extrabold text-2xl mb-4">
            🎉 You drew it!
          </p>
          <button
            type="button"
            onClick={restart}
            className="px-8 py-4 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
          >
            Play Again!
          </button>
        </div>
      )}
      {!done && (
        <p className="font-body text-muted-foreground text-sm">
          Click the dots in order from 1 to {DOTS.length}!
        </p>
      )}
    </div>
  );
}
