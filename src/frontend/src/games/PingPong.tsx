import { useCallback, useEffect, useRef, useState } from "react";
import { TouchControls } from "../components/TouchControls";

const W = 500;
const H = 300;
const PAD_W = 12;
const PAD_H = 60;
const BALL = 10;
type Mode = "vs-ai" | "2player";

export function PingPong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("vs-ai");
  const stateRef = useRef({
    ball: { x: W / 2, y: H / 2, vx: 4, vy: 3 },
    leftY: H / 2 - PAD_H / 2,
    rightY: H / 2 - PAD_H / 2,
    scoreL: 0,
    scoreR: 0,
    running: false,
  });
  const [score, setScore] = useState({ l: 0, r: 0 });
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const keysRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<Mode>("vs-ai");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, 0, W, H);
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#60a5fa";
    ctx.fillRect(8, s.leftY, PAD_W, PAD_H);
    ctx.fillStyle = "#f87171";
    ctx.fillRect(W - 8 - PAD_W, s.rightY, PAD_W, PAD_H);
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(s.ball.x, s.ball.y, BALL, 0, Math.PI * 2);
    ctx.fill();
    // labels
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "12px sans-serif";
    ctx.fillText(
      modeRef.current === "2player" ? "P1: W/S" : "You: ↑/↓",
      8,
      H - 8,
    );
    if (modeRef.current === "2player") ctx.fillText("P2: ↑/↓", W - 55, H - 8);
  }, []);

  const loop = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;
    const k = keysRef.current;
    // left paddle
    if (k.has("w") || k.has("W")) s.leftY = Math.max(0, s.leftY - 5);
    if (k.has("s") || k.has("S")) s.leftY = Math.min(H - PAD_H, s.leftY + 5);
    // right paddle: AI or Player 2
    if (modeRef.current === "2player") {
      if (k.has("ArrowUp")) s.rightY = Math.max(0, s.rightY - 5);
      if (k.has("ArrowDown")) s.rightY = Math.min(H - PAD_H, s.rightY + 5);
    } else {
      if (k.has("ArrowUp") || k.has("w") || k.has("W"))
        s.leftY = Math.max(0, s.leftY - 5);
      if (k.has("ArrowDown") || k.has("s") || k.has("S"))
        s.leftY = Math.min(H - PAD_H, s.leftY + 5);
      const aiCenter = s.rightY + PAD_H / 2;
      if (aiCenter < s.ball.y - 5) s.rightY = Math.min(H - PAD_H, s.rightY + 4);
      else if (aiCenter > s.ball.y + 5) s.rightY = Math.max(0, s.rightY - 4);
    }
    s.ball.x += s.ball.vx;
    s.ball.y += s.ball.vy;
    if (s.ball.y <= BALL || s.ball.y >= H - BALL) s.ball.vy *= -1;
    if (
      s.ball.x <= 8 + PAD_W + BALL &&
      s.ball.y >= s.leftY &&
      s.ball.y <= s.leftY + PAD_H
    ) {
      s.ball.vx = Math.abs(s.ball.vx) * 1.05;
      s.ball.vy += (Math.random() - 0.5) * 2;
    }
    if (
      s.ball.x >= W - 8 - PAD_W - BALL &&
      s.ball.y >= s.rightY &&
      s.ball.y <= s.rightY + PAD_H
    ) {
      s.ball.vx = -Math.abs(s.ball.vx) * 1.05;
    }
    if (s.ball.x < 0) {
      s.scoreR++;
      setScore({ l: s.scoreL, r: s.scoreR });
      if (s.scoreR >= 5) {
        s.running = false;
        setDone(true);
        return;
      }
      s.ball = { x: W / 2, y: H / 2, vx: 4, vy: 3 };
    }
    if (s.ball.x > W) {
      s.scoreL++;
      setScore({ l: s.scoreL, r: s.scoreR });
      if (s.scoreL >= 5) {
        s.running = false;
        setDone(true);
        return;
      }
      s.ball = { x: W / 2, y: H / 2, vx: -4, vy: 3 };
    }
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  function start() {
    modeRef.current = mode;
    const s = stateRef.current;
    s.ball = { x: W / 2, y: H / 2, vx: 4, vy: 3 };
    s.leftY = H / 2 - PAD_H / 2;
    s.rightY = H / 2 - PAD_H / 2;
    s.scoreL = 0;
    s.scoreR = 0;
    s.running = true;
    setScore({ l: 0, r: 0 });
    setDone(false);
    setStarted(true);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }

  useEffect(() => {
    draw();
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (["ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current || modeRef.current === "2player") return;
    const rect = containerRef.current.getBoundingClientRect();
    stateRef.current.leftY = Math.max(
      0,
      Math.min(
        H - PAD_H,
        (e.clientY - rect.top) * (H / rect.height) - PAD_H / 2,
      ),
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            setMode("vs-ai");
            setStarted(false);
            setDone(false);
          }}
          className={`px-4 py-2 rounded-2xl font-bold border-4 cursor-pointer ${mode === "vs-ai" ? "bg-blue-500 text-white border-blue-600" : "bg-white border-gray-300"}`}
        >
          🤖 vs AI
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("2player");
            setStarted(false);
            setDone(false);
          }}
          className={`px-4 py-2 rounded-2xl font-bold border-4 cursor-pointer ${mode === "2player" ? "bg-purple-500 text-white border-purple-600" : "bg-white border-gray-300"}`}
        >
          👥 2 Players
        </button>
      </div>
      <div className="flex gap-8 font-bold text-xl">
        <span className="text-blue-400">
          {mode === "vs-ai" ? "🙋 You" : "🔵 P1"}: {score.l}
        </span>
        <span className="text-red-400">
          {mode === "vs-ai" ? "🤖 AI" : "🔴 P2"}: {score.r}
        </span>
      </div>
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden border-4 border-border"
        onMouseMove={handleMouseMove}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block max-w-full"
        />
        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
            <p className="font-display font-extrabold text-white text-3xl mb-4">
              🎴 Ping Pong!
            </p>
            <button
              type="button"
              onClick={start}
              className="px-6 py-3 rounded-2xl bg-blue-500 text-white font-display font-bold text-xl cursor-pointer"
            >
              Start!
            </button>
          </div>
        )}
        {done && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
            <p className="font-display font-extrabold text-white text-2xl mb-2">
              {score.l >= 5
                ? mode === "vs-ai"
                  ? "🎉 You Win!"
                  : "🔵 P1 Wins!"
                : mode === "vs-ai"
                  ? "🤖 AI Wins!"
                  : "🔴 P2 Wins!"}
            </p>
            <button
              type="button"
              onClick={start}
              className="px-6 py-3 rounded-2xl bg-blue-500 text-white font-display font-bold text-xl cursor-pointer"
            >
              Play Again!
            </button>
          </div>
        )}
      </div>
      <p className="font-body text-muted-foreground text-sm">
        {mode === "vs-ai"
          ? "Move mouse or W/S / Arrow keys to control your paddle!"
          : "P1: W/S keys | P2: Up/Down arrows"}
      </p>
      <TouchControls layout="twoPlayer" />
    </div>
  );
}
