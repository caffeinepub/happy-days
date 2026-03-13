import { useCallback, useEffect, useRef, useState } from "react";

type GameState = "idle" | "running" | "dead";

const CANVAS_W = 600;
const CANVAS_H = 220;
const GROUND_Y = 160;
const CHAR_X = 80;
const CHAR_W = 44;
const CHAR_H = 44;
const GRAVITY = 0.55;
const JUMP_VEL = -13;
const OBS_W = 32;
const OBS_H = 44;
const BASE_SPEED = 4;

interface Obstacle {
  x: number;
}

interface GameData {
  state: GameState;
  charY: number;
  velY: number;
  obstacles: Obstacle[];
  score: number;
  bestScore: number;
  frameCount: number;
  speed: number;
}

export function JungleJump() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameData>({
    state: "idle",
    charY: GROUND_Y,
    velY: 0,
    obstacles: [],
    score: 0,
    bestScore: 0,
    frameCount: 0,
    speed: BASE_SPEED,
  });
  const rafRef = useRef<number>(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayBest, setDisplayBest] = useState(0);
  const [gameState, setGameState] = useState<GameState>("idle");

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (g.state === "idle" || g.state === "dead") {
      g.state = "running";
      g.charY = GROUND_Y;
      g.velY = JUMP_VEL;
      g.obstacles = [];
      g.score = 0;
      g.frameCount = 0;
      g.speed = BASE_SPEED;
      setGameState("running");
    } else if (g.state === "running" && g.charY >= GROUND_Y) {
      g.velY = JUMP_VEL;
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [jump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawScene = () => {
      const g = gameRef.current;

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
      sky.addColorStop(0, "#b8f0ff");
      sky.addColorStop(1, "#e0ffd8");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Sun
      ctx.beginPath();
      ctx.arc(540, 38, 28, 0, Math.PI * 2);
      ctx.fillStyle = "#FFE066";
      ctx.fill();
      ctx.strokeStyle = "#FFB800";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Clouds
      const drawCloud = (x: number, y: number) => {
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.arc(x + 22, y - 8, 22, 0, Math.PI * 2);
        ctx.arc(x + 44, y, 16, 0, Math.PI * 2);
        ctx.fill();
      };
      const cloudOffset = (g.frameCount * 0.5) % CANVAS_W;
      drawCloud(120 - cloudOffset, 40);
      drawCloud(380 - cloudOffset + CANVAS_W, 55);

      // Ground
      ctx.fillStyle = "#6DBE45";
      ctx.fillRect(
        0,
        GROUND_Y + CHAR_H,
        CANVAS_W,
        CANVAS_H - GROUND_Y - CHAR_H,
      );
      ctx.fillStyle = "#8BD45A";
      ctx.fillRect(0, GROUND_Y + CHAR_H, CANVAS_W, 8);

      // Character
      ctx.font = `${CHAR_W}px serif`;
      ctx.textBaseline = "top";
      ctx.fillText("🦁", CHAR_X, g.charY);

      // Obstacles
      for (const obs of g.obstacles) {
        ctx.font = `${OBS_H}px serif`;
        ctx.fillText("🌵", obs.x, GROUND_Y + CHAR_H - OBS_H);
      }

      // Score
      ctx.font = "bold 20px 'Bricolage Grotesque', sans-serif";
      ctx.fillStyle = "#333";
      ctx.textBaseline = "top";
      ctx.fillText(`Score: ${g.score}`, 12, 12);
      ctx.fillText(`Best: ${g.bestScore}`, 12, 38);

      // Overlays
      if (g.state === "idle") {
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.font = "bold 32px 'Bricolage Grotesque', sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🦁 Jungle Jump!", CANVAS_W / 2, CANVAS_H / 2 - 28);
        ctx.font = "22px 'Figtree', sans-serif";
        ctx.fillText(
          "TAP or press SPACE to Start",
          CANVAS_W / 2,
          CANVAS_H / 2 + 14,
        );
        ctx.textAlign = "left";
      } else if (g.state === "dead") {
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.font = "bold 30px 'Bricolage Grotesque', sans-serif";
        ctx.fillStyle = "#FF6B6B";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("💥 Game Over!", CANVAS_W / 2, CANVAS_H / 2 - 30);
        ctx.font = "22px 'Figtree', sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText(
          `Score: ${g.score}  Best: ${g.bestScore}`,
          CANVAS_W / 2,
          CANVAS_H / 2 + 8,
        );
        ctx.font = "18px 'Figtree', sans-serif";
        ctx.fillText(
          "TAP or press SPACE to Restart",
          CANVAS_W / 2,
          CANVAS_H / 2 + 38,
        );
        ctx.textAlign = "left";
      }
    };

    const gameLoop = () => {
      const g = gameRef.current;

      if (g.state === "running") {
        // Physics
        g.velY += GRAVITY;
        g.charY += g.velY;
        if (g.charY >= GROUND_Y) {
          g.charY = GROUND_Y;
          g.velY = 0;
        }

        // Speed up over time
        g.speed = BASE_SPEED + g.score * 0.003;

        // Spawn obstacles
        g.frameCount++;
        const spawnInterval = Math.max(60, 120 - g.score * 0.5);
        if (
          g.frameCount % Math.floor(spawnInterval) === 0 &&
          (g.obstacles.length === 0 ||
            g.obstacles[g.obstacles.length - 1].x < CANVAS_W - 180)
        ) {
          g.obstacles.push({ x: CANVAS_W + 20 });
        }

        // Move obstacles
        for (const obs of g.obstacles) {
          obs.x -= g.speed;
        }
        g.obstacles = g.obstacles.filter((o) => o.x > -OBS_W - 10);

        // Collision
        for (const obs of g.obstacles) {
          const obsLeft = obs.x + 6;
          const obsRight = obs.x + OBS_W - 6;
          const obsTop = GROUND_Y + CHAR_H - OBS_H + 6;
          const charLeft = CHAR_X + 6;
          const charRight = CHAR_X + CHAR_W - 6;
          const charBottom = g.charY + CHAR_H;

          if (
            charRight > obsLeft &&
            charLeft < obsRight &&
            charBottom > obsTop
          ) {
            g.state = "dead";
            if (g.score > g.bestScore) g.bestScore = g.score;
            setGameState("dead");
            setDisplayBest(g.bestScore);
          }
        }

        g.score++;
        setDisplayScore(g.score);
      }

      drawScene();
      rafRef.current = requestAnimationFrame(gameLoop);
    };

    rafRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 font-display font-bold text-lg">
        <span className="text-primary">Score: {displayScore}</span>
        <span className="text-secondary">Best: {displayBest}</span>
      </div>
      <div className="relative w-full max-w-[600px]">
        <canvas
          ref={canvasRef}
          data-ocid="jungle_jump.canvas_target"
          width={CANVAS_W}
          height={CANVAS_H}
          className="w-full rounded-2xl border-4 border-border cursor-pointer shadow-lg"
          onClick={jump}
          onKeyDown={(e) => {
            if (e.code === "Space") jump();
          }}
          tabIndex={0}
          role="button"
          aria-label="Jungle Jump game - click or press Space to jump"
          style={{ touchAction: "none" }}
        />
      </div>
      {gameState === "dead" && (
        <button
          type="button"
          data-ocid="jungle_jump.restart_button"
          onClick={jump}
          className="bg-primary text-white font-display font-bold text-lg px-8 py-3 rounded-2xl shadow-[0_5px_0_0_oklch(0.45_0.22_38)] hover:shadow-[0_3px_0_0_oklch(0.45_0.22_38)] hover:translate-y-[2px] active:shadow-none active:translate-y-[5px] transition-all duration-100 cursor-pointer"
        >
          🔄 Play Again!
        </button>
      )}
      <p className="font-body text-muted-foreground text-sm text-center">
        🦁 Press{" "}
        <kbd className="bg-muted px-2 py-0.5 rounded font-mono text-xs">
          SPACE
        </kbd>{" "}
        or tap the game to jump over the cacti!
      </p>
    </div>
  );
}
