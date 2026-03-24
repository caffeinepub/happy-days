import { useCallback, useEffect, useRef, useState } from "react";

const GRID = 6;
const COLORS = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcb77",
  "#4d96ff",
  "#ff922b",
  "#da77f2",
];
const TIME = 30;

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function makeGrid() {
  return Array.from({ length: GRID }, () =>
    Array.from({ length: GRID }, randomColor),
  );
}

export function ColorTag() {
  const [grid] = useState<string[][]>(makeGrid());
  const [tagged, setTagged] = useState<(number | null)[][]>(
    Array.from({ length: GRID }, () => Array(GRID).fill(null)),
  );
  const [p1Pos, setP1Pos] = useState<[number, number]>([0, 0]);
  const [p2Pos, setP2Pos] = useState<[number, number]>([GRID - 1, GRID - 1]);
  const [timeLeft, setTimeLeft] = useState(TIME);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tag = useCallback((player: 1 | 2, row: number, col: number) => {
    setTagged((prev) => {
      const n = prev.map((r) => [...r]);
      if (n[row][col] === null) n[row][col] = player;
      return n;
    });
  }, []);

  useEffect(() => {
    if (!started || done) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setDone(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [started, done]);

  useEffect(() => {
    if (!started || done) return;
    const handleKey = (e: KeyboardEvent) => {
      setP1Pos((prev) => {
        let [r, c] = prev;
        if (e.key === "w" || e.key === "W") r = Math.max(0, r - 1);
        if (e.key === "s" || e.key === "S") r = Math.min(GRID - 1, r + 1);
        if (e.key === "a" || e.key === "A") c = Math.max(0, c - 1);
        if (e.key === "d" || e.key === "D") c = Math.min(GRID - 1, c + 1);
        if (e.key === " ") tag(1, r, c);
        return [r, c];
      });
      setP2Pos((prev) => {
        let [r, c] = prev;
        if (e.key === "ArrowUp") r = Math.max(0, r - 1);
        if (e.key === "ArrowDown") r = Math.min(GRID - 1, r + 1);
        if (e.key === "ArrowLeft") c = Math.max(0, c - 1);
        if (e.key === "ArrowRight") c = Math.min(GRID - 1, c + 1);
        if (e.key === "Enter") tag(2, r, c);
        return [r, c];
      });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started, done, tag]);

  const p1Score = tagged.flat().filter((v) => v === 1).length;
  const p2Score = tagged.flat().filter((v) => v === 2).length;

  function reset() {
    setTagged(Array.from({ length: GRID }, () => Array(GRID).fill(null)));
    setP1Pos([0, 0]);
    setP2Pos([GRID - 1, GRID - 1]);
    setTimeLeft(TIME);
    setStarted(false);
    setDone(false);
  }

  const winner = done
    ? p1Score > p2Score
      ? "Player 1"
      : p2Score > p1Score
        ? "Player 2"
        : "Tie"
    : null;

  return (
    <div className="flex flex-col items-center gap-4 p-4 select-none">
      <h2 className="font-display font-extrabold text-2xl">🎨 Color Tag</h2>
      <div className="flex gap-8 font-body font-bold text-lg">
        <span className="text-blue-600">P1 (WASD+Space): {p1Score}</span>
        <span className="text-red-500">⏱ {timeLeft}s</span>
        <span className="text-orange-500">P2 (Arrows+Enter): {p2Score}</span>
      </div>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
      >
        {grid.map((row, ri) =>
          row.map((color, ci) => {
            const isP1 = p1Pos[0] === ri && p1Pos[1] === ci;
            const isP2 = p2Pos[0] === ri && p2Pos[1] === ci;
            const taggedBy = tagged[ri][ci];
            const cellKey = `cell-${ri}-${ci}`;
            return (
              <div
                key={cellKey}
                style={{
                  backgroundColor: color,
                  width: 52,
                  height: 52,
                  position: "relative",
                }}
                className="rounded-lg border-2 border-white/50 flex items-center justify-center"
              >
                {taggedBy === 1 && (
                  <div className="absolute inset-0 bg-blue-500/50 rounded-lg" />
                )}
                {taggedBy === 2 && (
                  <div className="absolute inset-0 bg-orange-500/50 rounded-lg" />
                )}
                {isP1 && <span className="text-xl z-10">🔵</span>}
                {isP2 && !isP1 && <span className="text-xl z-10">🔴</span>}
              </div>
            );
          }),
        )}
      </div>
      {started && !done && (
        <div className="flex gap-8 mt-2">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-body font-bold text-blue-600">
              P1
            </span>
            <button
              type="button"
              onClick={() => setP1Pos(([r, c]) => [Math.max(0, r - 1), c])}
              className="bg-blue-200 rounded-lg px-3 py-1"
            >
              ▲
            </button>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setP1Pos(([r, c]) => [r, Math.max(0, c - 1)])}
                className="bg-blue-200 rounded-lg px-3 py-1"
              >
                ◄
              </button>
              <button
                type="button"
                onClick={() => {
                  setTagged((prev) => {
                    const n = prev.map((r) => [...r]);
                    if (n[p1Pos[0]][p1Pos[1]] === null)
                      n[p1Pos[0]][p1Pos[1]] = 1;
                    return n;
                  });
                }}
                className="bg-blue-500 text-white rounded-lg px-2 py-1 text-xs"
              >
                Tag
              </button>
              <button
                type="button"
                onClick={() =>
                  setP1Pos(([r, c]) => [r, Math.min(GRID - 1, c + 1)])
                }
                className="bg-blue-200 rounded-lg px-3 py-1"
              >
                ►
              </button>
            </div>
            <button
              type="button"
              onClick={() =>
                setP1Pos(([r, c]) => [Math.min(GRID - 1, r + 1), c])
              }
              className="bg-blue-200 rounded-lg px-3 py-1"
            >
              ▼
            </button>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-body font-bold text-orange-500">
              P2
            </span>
            <button
              type="button"
              onClick={() => setP2Pos(([r, c]) => [Math.max(0, r - 1), c])}
              className="bg-orange-200 rounded-lg px-3 py-1"
            >
              ▲
            </button>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setP2Pos(([r, c]) => [r, Math.max(0, c - 1)])}
                className="bg-orange-200 rounded-lg px-3 py-1"
              >
                ◄
              </button>
              <button
                type="button"
                onClick={() => {
                  setTagged((prev) => {
                    const n = prev.map((r) => [...r]);
                    if (n[p2Pos[0]][p2Pos[1]] === null)
                      n[p2Pos[0]][p2Pos[1]] = 2;
                    return n;
                  });
                }}
                className="bg-orange-500 text-white rounded-lg px-2 py-1 text-xs"
              >
                Tag
              </button>
              <button
                type="button"
                onClick={() =>
                  setP2Pos(([r, c]) => [r, Math.min(GRID - 1, c + 1)])
                }
                className="bg-orange-200 rounded-lg px-3 py-1"
              >
                ►
              </button>
            </div>
            <button
              type="button"
              onClick={() =>
                setP2Pos(([r, c]) => [Math.min(GRID - 1, r + 1), c])
              }
              className="bg-orange-200 rounded-lg px-3 py-1"
            >
              ▼
            </button>
          </div>
        </div>
      )}
      {!started && !done && (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-body font-bold text-lg"
        >
          Start Game!
        </button>
      )}
      {done && (
        <div className="text-center">
          <div className="text-2xl font-display font-extrabold mb-2">
            {winner === "Tie" ? "It's a Tie! 🤝" : `🏆 ${winner} Wins!`}
          </div>
          <button
            type="button"
            onClick={reset}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-body font-bold"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
