import { useEffect, useRef, useState } from "react";

const ROWS = 6;
const COLS = 8;

export function ColorClash() {
  const [grid, setGrid] = useState<(0 | 1 | 2)[][]>(() =>
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(0)),
  );
  const [timeLeft, setTimeLeft] = useState(30);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const intervalRef = useRef<number | null>(null);

  function start() {
    setGrid(
      Array(ROWS)
        .fill(null)
        .map(() => Array(COLS).fill(0)),
    );
    setTimeLeft(30);
    setRunning(true);
    setGameOver(false);
  }

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  function clickTile(r: number, c: number, player: 1 | 2) {
    if (!running) return;
    setGrid((prev) =>
      prev.map((row, ri) =>
        row.map((cell, ci) => (ri === r && ci === c ? player : cell)),
      ),
    );
  }

  const p1Count = grid.flat().filter((x) => x === 1).length;
  const p2Count = grid.flat().filter((x) => x === 2).length;
  const winner = gameOver
    ? p1Count > p2Count
      ? "Player 1"
      : p2Count > p1Count
        ? "Player 2"
        : "Tie"
    : null;

  // Build grid using for-loops to avoid noArrayIndexKey rule
  const gridRows: React.ReactElement[] = [];
  for (let r = 0; r < ROWS; r++) {
    const cells: React.ReactElement[] = [];
    for (let c = 0; c < COLS; c++) {
      const cell = grid[r][c];
      const isLeft = c < COLS / 2;
      cells.push(
        <button
          key={`cell-${r}-${c}`}
          type="button"
          onClick={() => clickTile(r, c, isLeft ? 1 : 2)}
          className={`w-14 h-14 border border-gray-200 cursor-pointer transition-all hover:opacity-80 flex items-center justify-center text-2xl
            ${cell === 0 ? "bg-gray-100" : cell === 1 ? "bg-blue-400" : "bg-red-400"}`}
        >
          {cell === 1 ? "🔵" : cell === 2 ? "🔴" : ""}
        </button>,
      );
    }
    gridRows.push(
      <div key={`row-${r}`} className="flex">
        {cells}
      </div>,
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-8 text-xl font-extrabold">
        <span className="text-blue-600">🔵 P1: {p1Count}</span>
        {running && <span className="text-orange-500">⏱ {timeLeft}s</span>}
        <span className="text-red-600">P2: {p2Count} 🔴</span>
      </div>
      <div className="border-4 border-gray-300 rounded-2xl overflow-hidden shadow-xl">
        {gridRows}
      </div>
      <p className="text-xs text-gray-400">
        P1: click left half (blue) | P2: click right half (red) — claimed tiles
        can be reclaimed!
      </p>
      {!running && !gameOver && (
        <button
          type="button"
          onClick={start}
          className="px-6 py-3 bg-purple-500 text-white rounded-xl font-bold text-lg hover:bg-purple-600"
        >
          Start Clash! 💥
        </button>
      )}
      {gameOver && (
        <div className="text-center">
          <div className="text-3xl font-extrabold">
            {winner === "Tie" ? "🤝 Tie!" : `🏆 ${winner} Wins!`}
          </div>
          <button
            type="button"
            onClick={start}
            className="mt-3 px-6 py-2 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
