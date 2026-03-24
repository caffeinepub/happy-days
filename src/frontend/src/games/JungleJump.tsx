import { Box, Cylinder, Sphere } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { TouchControls } from "../components/TouchControls";

type GameState = "idle" | "running" | "dead";

const CHAR_X = -3;
const BASE_SPEED = 8;
const GRAVITY = -20;
const JUMP_VEL = 9;

const GROUND_TILE_KEYS = Array.from(
  { length: 12 },
  (_, i) => `ground-tile-${i}`,
);
const MOUNTAIN_POSITIONS = [-8, -4, 0, 4, 8, 12] as const;

interface Obstacle {
  id: number;
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
  nextId: number;
  spawnTimer: number;
}

function Lion({ y }: { y: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.position.y = y;
      ref.current.rotation.z = y > 0.05 ? -0.3 : 0;
    }
  });
  return (
    <group ref={ref} position={[CHAR_X, 0, 0]}>
      <Box args={[0.7, 0.7, 0.7]} castShadow>
        <meshStandardMaterial color="#e8a030" />
      </Box>
      <Sphere args={[0.42, 16, 16]} position={[0.3, 0.55, 0]} castShadow>
        <meshStandardMaterial color="#e8a030" />
      </Sphere>
      <Sphere args={[0.5, 16, 16]} position={[0.25, 0.55, 0]}>
        <meshStandardMaterial color="#c06010" />
      </Sphere>
      <Sphere args={[0.07, 8, 8]} position={[0.65, 0.65, 0.22]}>
        <meshStandardMaterial color="#111" />
      </Sphere>
      <Sphere args={[0.07, 8, 8]} position={[0.65, 0.65, -0.22]}>
        <meshStandardMaterial color="#111" />
      </Sphere>
      <Cylinder
        args={[0.05, 0.05, 0.8, 8]}
        position={[-0.6, 0.2, 0]}
        rotation={[0, 0, 0.8]}
      >
        <meshStandardMaterial color="#c06010" />
      </Cylinder>
    </group>
  );
}

function Cactus({ x }: { x: number }) {
  return (
    <group position={[x, 0.7, 0]}>
      <Cylinder args={[0.18, 0.18, 1.4, 8]} castShadow>
        <meshStandardMaterial color="#3a8a3a" />
      </Cylinder>
      <Cylinder
        args={[0.12, 0.12, 0.6, 8]}
        position={[-0.32, 0.1, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <meshStandardMaterial color="#3a8a3a" />
      </Cylinder>
      <Cylinder
        args={[0.12, 0.12, 0.4, 8]}
        position={[-0.62, 0.3, 0]}
        castShadow
      >
        <meshStandardMaterial color="#3a8a3a" />
      </Cylinder>
      <Cylinder
        args={[0.12, 0.12, 0.6, 8]}
        position={[0.32, 0.0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
        castShadow
      >
        <meshStandardMaterial color="#3a8a3a" />
      </Cylinder>
      <Cylinder
        args={[0.12, 0.12, 0.35, 8]}
        position={[0.62, 0.2, 0]}
        castShadow
      >
        <meshStandardMaterial color="#3a8a3a" />
      </Cylinder>
    </group>
  );
}

function Ground() {
  const tilesRef = useRef<THREE.Group>(null);
  const offsetRef = useRef(0);
  useFrame((_, delta) => {
    offsetRef.current = (offsetRef.current + delta * 5) % 4;
    if (tilesRef.current) tilesRef.current.position.x = -offsetRef.current;
  });
  return (
    <group ref={tilesRef}>
      {GROUND_TILE_KEYS.map((key, i) => (
        <Box
          key={key}
          args={[4, 0.3, 6]}
          position={[i * 4 - 8, -0.15, 0]}
          receiveShadow
        >
          <meshStandardMaterial color={i % 2 === 0 ? "#5aaa30" : "#4e9828"} />
        </Box>
      ))}
    </group>
  );
}

function Mountains() {
  return (
    <group position={[0, 0, -5]}>
      {MOUNTAIN_POSITIONS.map((x, i) => (
        <Cylinder
          key={`mountain-${x}`}
          args={[0, 2 + (i % 3), 4 + (i % 2) * 2, 5]}
          position={[x, 1, 0]}
        >
          <meshStandardMaterial
            color={`hsl(${120 + i * 10}, 40%, ${30 + i * 3}%)`}
          />
        </Cylinder>
      ))}
    </group>
  );
}

function GameScene({
  gameRef,
  onScore,
  onStateChange,
}: {
  gameRef: React.MutableRefObject<GameData>;
  onScore: (s: number) => void;
  onStateChange: (s: GameState) => void;
}) {
  useFrame((_, delta) => {
    const g = gameRef.current;
    if (g.state !== "running") return;
    g.velY += GRAVITY * delta;
    g.charY += g.velY * delta;
    if (g.charY <= 0) {
      g.charY = 0;
      g.velY = 0;
    }
    g.speed = BASE_SPEED + g.score * 0.004;
    g.spawnTimer -= delta;
    const minInterval = Math.max(0.9, 2.0 - g.score * 0.001);
    if (g.spawnTimer <= 0) {
      g.obstacles.push({ id: g.nextId++, x: 14 });
      g.spawnTimer = minInterval + Math.random() * 0.8;
    }
    for (const obs of g.obstacles) obs.x -= g.speed * delta;
    g.obstacles = g.obstacles.filter((o) => o.x > -6);
    for (const obs of g.obstacles) {
      const dx = Math.abs(obs.x - CHAR_X);
      const dy = g.charY;
      if (dx < 0.7 && dy < 1.0) {
        g.state = "dead";
        if (g.score > g.bestScore) g.bestScore = g.score;
        onStateChange("dead");
        return;
      }
    }
    g.score++;
    if (g.score % 10 === 0) onScore(g.score);
  });
  const g = gameRef.current;
  return (
    <>
      <Ground />
      <Mountains />
      <Lion y={g.charY} />
      {g.obstacles.map((obs) => (
        <Cactus key={obs.id} x={obs.x} />
      ))}
    </>
  );
}

export function JungleJump() {
  const gameRef = useRef<GameData>({
    state: "idle",
    charY: 0,
    velY: 0,
    obstacles: [],
    score: 0,
    bestScore: 0,
    frameCount: 0,
    speed: BASE_SPEED,
    nextId: 0,
    spawnTimer: 2,
  });
  const [displayScore, setDisplayScore] = useState(0);
  const [displayBest, setDisplayBest] = useState(0);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [, forceUpdate] = useState(0);

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (g.state === "idle" || g.state === "dead") {
      g.state = "running";
      g.charY = 0;
      g.velY = JUMP_VEL;
      g.obstacles = [];
      g.score = 0;
      g.frameCount = 0;
      g.speed = BASE_SPEED;
      g.spawnTimer = 2;
      setDisplayScore(0);
      setGameState("running");
      forceUpdate((n) => n + 1);
    } else if (g.state === "running" && g.charY <= 0.05) {
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

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 font-display font-bold text-xl">
        <span className="text-primary">Score: {displayScore}</span>
        <span className="text-secondary">Best: {displayBest}</span>
      </div>

      <div
        className="relative w-full rounded-3xl overflow-hidden border-4 border-border shadow-2xl cursor-pointer"
        style={{ height: 360 }}
        onClick={jump}
        onKeyDown={(e) => {
          if (e.key === " ") jump();
        }}
      >
        <Canvas
          shadows
          camera={{ position: [0, 3, 10], fov: 60 }}
          style={{ width: "100%", height: "100%" }}
        >
          <color attach="background" args={["#87CEEB"]} />
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[10, 12, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <GameScene
            gameRef={gameRef}
            onScore={(s) => {
              setDisplayScore(s);
              gameRef.current.score = s;
            }}
            onStateChange={(s) => {
              setGameState(s);
              setDisplayBest(gameRef.current.bestScore);
            }}
          />
        </Canvas>
        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white">
            <div className="text-6xl mb-3">🦁</div>
            <p className="font-display font-extrabold text-3xl mb-2">
              Jungle Jump!
            </p>
            <p className="font-body text-lg">Tap or press SPACE to start</p>
          </div>
        )}
        {gameState === "dead" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
            <p className="font-display font-extrabold text-4xl text-red-400 mb-2">
              💥 Game Over!
            </p>
            <p className="font-body text-xl mb-1">
              Score: {displayScore} · Best: {displayBest}
            </p>
            <p className="font-body text-lg mt-2">
              Tap or press SPACE to restart
            </p>
          </div>
        )}
      </div>

      <p className="font-body text-muted-foreground text-sm text-center">
        🦁 Press{" "}
        <kbd className="bg-muted px-2 py-0.5 rounded font-mono text-xs">
          SPACE
        </kbd>{" "}
        or tap the game to jump over the cacti!
      </p>
      <TouchControls layout="single" />
    </div>
  );
}
