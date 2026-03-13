import { Environment, RoundedBox, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

const EMOJI_PAIRS = ["🏆", "💎", "⚔️", "🧙", "🐉", "🌟"];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): Card[] {
  const pairs = [...EMOJI_PAIRS, ...EMOJI_PAIRS];
  return shuffle(pairs).map((emoji, idx) => ({
    id: idx,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}

const CARD_COLORS = [
  "#f472b6",
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#a78bfa",
  "#fb923c",
  "#38bdf8",
  "#4ade80",
  "#f472b6",
  "#60a5fa",
  "#34d399",
  "#fbbf24",
];

function Card3D({
  card,
  position,
  index,
  onClick,
}: {
  card: Card;
  position: [number, number, number];
  index: number;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRot = useRef(card.isFlipped || card.isMatched ? Math.PI : 0);
  const currentRot = useRef(card.isFlipped || card.isMatched ? Math.PI : 0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    targetRot.current = card.isFlipped || card.isMatched ? Math.PI : 0;
  }, [card.isFlipped, card.isMatched]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    currentRot.current = THREE.MathUtils.lerp(
      currentRot.current,
      targetRot.current,
      delta * 8,
    );
    groupRef.current.rotation.y = currentRot.current;
    const targetY = hovered ? position[1] + 0.15 : position[1];
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      delta * 10,
    );
  });

  const color = card.isMatched
    ? "#4ade80"
    : CARD_COLORS[index % CARD_COLORS.length];

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Three.js R3F group doesn't support keyboard events
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <RoundedBox
        args={[1.1, 1.5, 0.12]}
        radius={0.08}
        position={[0, 0, -0.01]}
      >
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.4} />
      </RoundedBox>
      <Text
        position={[0, 0, 0.07]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        ?
      </Text>
      <RoundedBox
        args={[1.1, 1.5, 0.12]}
        radius={0.08}
        rotation={[0, Math.PI, 0]}
        position={[0, 0, 0.01]}
      >
        <meshStandardMaterial color="#fffbf0" metalness={0.1} roughness={0.5} />
      </RoundedBox>
      <Text
        position={[0, 0, -0.07]}
        fontSize={0.55}
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI, 0]}
      >
        {card.emoji}
      </Text>
    </group>
  );
}

function CardScene({
  cards,
  onCardClick,
}: { cards: Card[]; onCardClick: (id: number) => void }) {
  const cols = 4;
  const rows = 3;
  const spacingX = 1.5;
  const spacingY = 2.0;
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <pointLight position={[-5, 5, 3]} intensity={0.5} color="#a78bfa" />
      <Environment preset="sunset" />
      <mesh
        receiveShadow
        position={[0, -1.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#7c3aed" roughness={0.8} />
      </mesh>
      {cards.map((card, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = (col - (cols - 1) / 2) * spacingX;
        const y = ((rows - 1) / 2 - row) * spacingY * 0.75;
        return (
          <Card3D
            key={card.id}
            card={card}
            position={[x, y, 0]}
            index={i}
            onClick={() => onCardClick(card.id)}
          />
        );
      })}
    </>
  );
}

export function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>(buildDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [won, setWon] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockRef = useRef(false);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const restart = useCallback(() => {
    stopTimer();
    setCards(buildDeck());
    setFlipped([]);
    setMoves(0);
    setSeconds(0);
    setWon(false);
    lockRef.current = false;
  }, [stopTimer]);

  const handleCard = useCallback(
    (id: number) => {
      if (lockRef.current) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.isFlipped || card.isMatched) return;
      startTimer();
      const newFlipped = [...flipped, id];
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)),
      );
      setFlipped(newFlipped);
      if (newFlipped.length === 2) {
        lockRef.current = true;
        setMoves((m) => m + 1);
        const [aId, bId] = newFlipped;
        const a = cards.find((c) => c.id === aId)!;
        const b = cards.find((c) => c.id === bId)!;
        const isMatch = a.emoji === b.emoji;
        setTimeout(() => {
          setCards((prev) => {
            const updated = prev.map((c) => {
              if (c.id === aId || c.id === bId)
                return isMatch
                  ? { ...c, isFlipped: true, isMatched: true }
                  : { ...c, isFlipped: false };
              return c;
            });
            if (isMatch && updated.every((c) => c.isMatched)) {
              stopTimer();
              setWon(true);
            }
            return updated;
          });
          setFlipped([]);
          lockRef.current = false;
        }, 900);
      }
    },
    [cards, flipped, startTimer, stopTimer],
  );

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const matchedCount = cards.filter((c) => c.isMatched).length / 2;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex gap-6 font-display font-bold text-xl">
        <span className="text-primary">⏱ {formatTime(seconds)}</span>
        <span className="text-secondary">Moves: {moves}</span>
        <span style={{ color: "oklch(0.55 0.22 140)" }}>
          Pairs: {matchedCount}/6
        </span>
      </div>

      {won ? (
        <div
          data-ocid="memory.success_state"
          className="text-center bg-gradient-to-br from-yellow-50 to-green-50 border-4 border-[oklch(0.82_0.2_95)] rounded-3xl p-10 w-full max-w-xl"
        >
          <div className="text-7xl mb-3">🎉</div>
          <h3
            className="font-display font-extrabold text-4xl mb-2"
            style={{ color: "oklch(0.55 0.22 140)" }}
          >
            You Won!
          </h3>
          <p className="font-body text-muted-foreground text-lg mb-4">
            {moves} moves · {formatTime(seconds)}
          </p>
          <div className="text-5xl mb-6">
            {moves <= 12 ? "🌟🌟🌟" : moves <= 18 ? "🌟🌟" : "🌟"}
          </div>
          <button
            type="button"
            data-ocid="memory.restart_button"
            onClick={restart}
            className="bg-primary text-white font-display font-bold text-xl px-10 py-4 rounded-2xl shadow-[0_5px_0_0_oklch(0.45_0.22_38)] hover:translate-y-[2px] transition-all cursor-pointer"
          >
            🔄 Play Again!
          </button>
        </div>
      ) : (
        <>
          <div
            className="w-full rounded-3xl overflow-hidden border-4 border-border shadow-2xl"
            style={{ height: 420 }}
          >
            <Canvas
              camera={{ position: [0, 0, 7], fov: 55 }}
              style={{ width: "100%", height: "100%" }}
            >
              <CardScene cards={cards} onCardClick={handleCard} />
            </Canvas>
          </div>
          <button
            type="button"
            data-ocid="memory.restart_button"
            onClick={restart}
            className="font-body font-bold text-sm text-muted-foreground underline cursor-pointer hover:text-foreground transition-colors"
          >
            🔄 Restart Game
          </button>
        </>
      )}

      <p className="font-body text-muted-foreground text-sm text-center">
        Click the 3D cards to flip them! Match all 6 pairs to win! 🏆
      </p>
    </div>
  );
}
