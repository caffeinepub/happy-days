import { useEffect, useRef, useState } from "react";
import { TouchControls } from "../components/TouchControls";

const W = 600;
const H = 400;
const PAD_W = 12;
const PAD_H = 70;
const PUCK_R = 14;
const GOAL_H = 120;

export function AirHockey() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    p1y: H / 2 - PAD_H / 2,
    p2y: H / 2 - PAD_H / 2,
    px: W / 2,
    py: H / 2,
    pvx: 4,
    pvy: 2,
    s1: 0,
    s2: 0,
    keys: {} as Record<string, boolean>,
    running: false,
    winner: "",
  });
  const [scores, setScores] = useState({ s1: 0, s2: 0 });
  const [winner, setWinner] = useState("");
  const rafRef = useRef(0);

  const startGame = () => {
    const s = stateRef.current;
    s.s1 = 0;
    s.s2 = 0;
    s.winner = "";
    s.p1y = H / 2 - PAD_H / 2;
    s.p2y = H / 2 - PAD_H / 2;
    s.px = W / 2;
    s.py = H / 2;
    s.pvx = (Math.random() > 0.5 ? 1 : -1) * 4;
    s.pvy = (Math.random() - 0.5) * 3;
    s.running = true;
    setScores({ s1: 0, s2: 0 });
    setWinner("");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key] = e.type === "keydown";
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

    function resetPuck() {
      const s = stateRef.current;
      s.px = W / 2;
      s.py = H / 2;
      s.pvx = (Math.random() > 0.5 ? 1 : -1) * 4;
      s.pvy = (Math.random() - 0.5) * 3;
    }

    function draw() {
      const s = stateRef.current;
      ctx.fillStyle = "#1a5276";
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, 50, 0, Math.PI * 2);
      ctx.stroke();
      const gy = (H - GOAL_H) / 2;
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(0, gy, 8, GOAL_H);
      ctx.fillRect(W - 8, gy, 8, GOAL_H);
      ctx.fillStyle = "#e74c3c";
      ctx.fillRect(4, s.p1y, PAD_W, PAD_H);
      ctx.fillStyle = "#3498db";
      ctx.fillRect(W - 4 - PAD_W, s.p2y, PAD_W, PAD_H);
      ctx.beginPath();
      ctx.arc(s.px, s.py, PUCK_R, 0, Math.PI * 2);
      ctx.fillStyle = "#f1c40f";
      ctx.fill();
      ctx.strokeStyle = "#e67e22";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    function update() {
      const s = stateRef.current;
      if (!s.running) {
        draw();
        rafRef.current = requestAnimationFrame(update);
        return;
      }
      const SPEED = 5;
      if (s.keys.w || s.keys.W) s.p1y = Math.max(0, s.p1y - SPEED);
      if (s.keys.s || s.keys.S) s.p1y = Math.min(H - PAD_H, s.p1y + SPEED);
      if (s.keys.ArrowUp) s.p2y = Math.max(0, s.p2y - SPEED);
      if (s.keys.ArrowDown) s.p2y = Math.min(H - PAD_H, s.p2y + SPEED);
      s.px += s.pvx;
      s.py += s.pvy;
      if (s.py - PUCK_R <= 0) {
        s.py = PUCK_R;
        s.pvy = Math.abs(s.pvy);
      }
      if (s.py + PUCK_R >= H) {
        s.py = H - PUCK_R;
        s.pvy = -Math.abs(s.pvy);
      }
      const gy = (H - GOAL_H) / 2;
      if (s.px - PUCK_R <= 4 + PAD_W && s.py > s.p1y && s.py < s.p1y + PAD_H) {
        s.pvx = Math.abs(s.pvx) * 1.05;
        s.px = 4 + PAD_W + PUCK_R;
        s.pvy += (s.py - (s.p1y + PAD_H / 2)) * 0.05;
      }
      if (
        s.px + PUCK_R >= W - 4 - PAD_W &&
        s.py > s.p2y &&
        s.py < s.p2y + PAD_H
      ) {
        s.pvx = -Math.abs(s.pvx) * 1.05;
        s.px = W - 4 - PAD_W - PUCK_R;
        s.pvy += (s.py - (s.p2y + PAD_H / 2)) * 0.05;
      }
      s.pvx = Math.max(-12, Math.min(12, s.pvx));
      s.pvy = Math.max(-10, Math.min(10, s.pvy));
      if (s.px - PUCK_R <= 8 && s.py > gy && s.py < gy + GOAL_H) {
        s.s2++;
        setScores({ s1: s.s1, s2: s.s2 });
        if (s.s2 >= 5) {
          s.running = false;
          s.winner = "Player 2";
          setWinner("Player 2");
        } else resetPuck();
      }
      if (s.px + PUCK_R >= W - 8 && s.py > gy && s.py < gy + GOAL_H) {
        s.s1++;
        setScores({ s1: s.s1, s2: s.s2 });
        if (s.s1 >= 5) {
          s.running = false;
          s.winner = "Player 1";
          setWinner("Player 1");
        } else resetPuck();
      }
      draw();
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
        className="rounded-2xl border-4 border-blue-800 shadow-2xl max-w-full"
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
            className="px-4 py-1 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
          >
            {stateRef.current.running ? "Restart" : "Start Game"}
          </button>
        </div>
      )}
      <TouchControls layout="twoPlayer" />
    </div>
  );
}
