import { useEffect, useRef, useState } from "react";
import { TouchControls } from "../components/TouchControls";

interface Obstacle {
  x: number;
  w: number;
  h: number;
}

export function DinoRun() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [dead, setDead] = useState(false);
  const [started, setStarted] = useState(false);
  const stateRef = useRef({
    dinoY: 260,
    vy: 0,
    jumping: false,
    obs: [] as Obstacle[],
    frame: 0,
    score: 0,
    speed: 4,
  });
  const rafRef = useRef(0);
  const W = 600;
  const H = 320;
  const GROUND = 280;
  const bestRef = useRef(0);

  const jump = () => {
    const s = stateRef.current;
    if (!s.jumping) {
      s.vy = -14;
      s.jumping = true;
    }
  };

  const startGame = () => {
    stateRef.current = {
      dinoY: 260,
      vy: 0,
      jumping: false,
      obs: [{ x: 600, w: 20, h: 40 }],
      frame: 0,
      score: 0,
      speed: 4,
    };
    setDead(false);
    setScore(0);
    setStarted(true);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: game loop deps managed via refs
  useEffect(() => {
    if (!started || dead) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    const loop = () => {
      const s = stateRef.current;
      s.vy += 0.8;
      s.dinoY += s.vy;
      if (s.dinoY >= GROUND) {
        s.dinoY = GROUND;
        s.vy = 0;
        s.jumping = false;
      }
      s.frame++;
      s.score++;
      s.speed = 4 + Math.floor(s.score / 200) * 0.5;
      if (s.frame % 100 === 0)
        s.obs.push({
          x: W,
          w: 18 + Math.random() * 20,
          h: 30 + Math.random() * 30,
        });
      s.obs = s.obs
        .map((o) => ({ ...o, x: o.x - s.speed }))
        .filter((o) => o.x > -40);
      let hit = false;
      for (const o of s.obs) {
        if (
          s.dinoY + 30 > GROUND + H - o.h &&
          s.dinoY < GROUND + 30 &&
          60 > o.x &&
          30 < o.x + o.w
        ) {
          hit = true;
          break;
        }
      }
      if (hit) {
        if (s.score > bestRef.current) bestRef.current = s.score;
        setDead(true);
        setBest(bestRef.current);
        setScore(s.score);
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener("keydown", onKey);
        return;
      }
      setScore(s.score);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#f0fdf4";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#166534";
      ctx.fillRect(0, GROUND + 30, W, 10);
      ctx.font = "36px serif";
      ctx.fillText("🦕", 20, s.dinoY + 8);
      ctx.fillStyle = "#854d0e";
      for (const o of s.obs) ctx.fillRect(o.x, GROUND + 30 - o.h, o.w, o.h);
      ctx.fillStyle = "#166534";
      ctx.font = "16px sans-serif";
      ctx.fillText(`Score: ${s.score}`, W - 120, 24);
      ctx.fillText(`Best: ${bestRef.current}`, W - 120, 44);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKey);
    };
  }, [started, dead]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="font-bold text-xl">
        Press Space or ↑ to jump! Score: {score} | Best: {best}
      </div>
      {dead && (
        <div className="text-2xl font-extrabold text-red-500">Game Over!</div>
      )}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="rounded-2xl border-4 border-border max-w-full cursor-pointer"
        onClick={jump}
        onKeyDown={(e) => {
          if (e.code === "Space") jump();
        }}
        role="button"
        tabIndex={0}
        aria-label="Game canvas - click or press space to jump"
      />
      {(!started || dead) && (
        <button
          type="button"
          onClick={startGame}
          className="px-6 py-3 bg-green-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
        >
          {started ? "Play Again" : "Start!"}
        </button>
      )}
      <TouchControls layout="single" />
    </div>
  );
}
