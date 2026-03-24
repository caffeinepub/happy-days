import { useEffect, useRef, useState } from "react";
import { TouchControls } from "../components/TouchControls";

const W = 600;
const H = 350;
const PAD_W = 14;
const PAD_H = 60;
const BALL_R = 12;
const GOAL_H = 110;

export function SoccerDuel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    p1y: H / 2 - PAD_H / 2,
    p2y: H / 2 - PAD_H / 2,
    bx: W / 2,
    by: H / 2,
    bvx: 3.5,
    bvy: 2,
    s1: 0,
    s2: 0,
    keys: {} as Record<string, boolean>,
    running: false,
  });
  const [scores, setScores] = useState({ s1: 0, s2: 0 });
  const [winner, setWinner] = useState("");
  const rafRef = useRef(0);

  function startGame() {
    const s = stateRef.current;
    s.s1 = 0;
    s.s2 = 0;
    s.running = true;
    s.p1y = H / 2 - PAD_H / 2;
    s.p2y = H / 2 - PAD_H / 2;
    s.bx = W / 2;
    s.by = H / 2;
    s.bvx = (Math.random() > 0.5 ? 1 : -1) * 3.5;
    s.bvy = (Math.random() - 0.5) * 3;
    setScores({ s1: 0, s2: 0 });
    setWinner("");
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key] = e.type === "keydown";
      if (["w", "s", "W", "S", "ArrowUp", "ArrowDown"].includes(e.key))
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

    function resetBall() {
      const s = stateRef.current;
      s.bx = W / 2;
      s.by = H / 2;
      s.bvx = (Math.random() > 0.5 ? 1 : -1) * 3.5;
      s.bvy = (Math.random() - 0.5) * 3;
    }

    function update() {
      const s = stateRef.current;
      ctx.fillStyle = "#27ae60";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, 50, 0, Math.PI * 2);
      ctx.stroke();
      const gy = (H - GOAL_H) / 2;
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillRect(0, gy, 6, GOAL_H);
      ctx.fillRect(W - 6, gy, 6, GOAL_H);

      if (s.running) {
        const SPEED = 4;
        if (s.keys.w || s.keys.W) s.p1y = Math.max(0, s.p1y - SPEED);
        if (s.keys.s || s.keys.S) s.p1y = Math.min(H - PAD_H, s.p1y + SPEED);
        if (s.keys.ArrowUp) s.p2y = Math.max(0, s.p2y - SPEED);
        if (s.keys.ArrowDown) s.p2y = Math.min(H - PAD_H, s.p2y + SPEED);
        s.bx += s.bvx;
        s.by += s.bvy;
        if (s.by - BALL_R <= 0) {
          s.by = BALL_R;
          s.bvy = Math.abs(s.bvy);
        }
        if (s.by + BALL_R >= H) {
          s.by = H - BALL_R;
          s.bvy = -Math.abs(s.bvy);
        }
        if (
          s.bx - BALL_R <= PAD_W + 4 &&
          s.by > s.p1y &&
          s.by < s.p1y + PAD_H
        ) {
          s.bvx = Math.abs(s.bvx);
          s.bvx = Math.min(10, s.bvx * 1.05);
          s.bvy += (s.by - (s.p1y + PAD_H / 2)) * 0.07;
        }
        if (
          s.bx + BALL_R >= W - PAD_W - 4 &&
          s.by > s.p2y &&
          s.by < s.p2y + PAD_H
        ) {
          s.bvx = -Math.abs(s.bvx);
          s.bvx = Math.max(-10, s.bvx * 1.05);
          s.bvy += (s.by - (s.p2y + PAD_H / 2)) * 0.07;
        }
        if (s.bx - BALL_R <= 6 && s.by > gy && s.by < gy + GOAL_H) {
          s.s2++;
          setScores({ s1: s.s1, s2: s.s2 });
          if (s.s2 >= 5) {
            s.running = false;
            setWinner("Player 2");
          } else resetBall();
        }
        if (s.bx + BALL_R >= W - 6 && s.by > gy && s.by < gy + GOAL_H) {
          s.s1++;
          setScores({ s1: s.s1, s2: s.s2 });
          if (s.s1 >= 5) {
            s.running = false;
            setWinner("Player 1");
          } else resetBall();
        }
      }

      ctx.fillStyle = "#e74c3c";
      ctx.fillRect(4, s.p1y, PAD_W, PAD_H);
      ctx.fillStyle = "#3498db";
      ctx.fillRect(W - 4 - PAD_W, s.p2y, PAD_W, PAD_H);
      ctx.font = "22px serif";
      ctx.fillText("⚽", s.bx - 12, s.by + 8);
      rafRef.current = requestAnimationFrame(update);
    }
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-8 text-xl font-extrabold">
        <span className="text-red-500">🔴 P1: {scores.s1}</span>
        <span className="text-gray-400">First to 5</span>
        <span className="text-blue-500">P2: {scores.s2} 🔵</span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-2xl border-4 border-green-700 shadow-2xl max-w-full"
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
        <div className="flex gap-8 text-sm text-gray-500">
          <span>P1: W/S keys</span>
          <span>P2: ↑/↓ arrows</span>
          <button
            type="button"
            onClick={startGame}
            className="px-4 py-1 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600"
          >
            {stateRef.current.running ? "Restart" : "Start Game"}
          </button>
        </div>
      )}
      <TouchControls layout="twoPlayer" />
    </div>
  );
}
