import { useCallback, useEffect, useState } from "react";
import { TouchControls } from "../components/TouchControls";

const MAZES = [
  [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
    [1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  ],
  [
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 0, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 1, 1, 1, 1, 0, 1, 0],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0],
    [0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 0, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 2],
  ],
  [
    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 1, 1, 1, 2],
  ],
];

export function MazeSolver() {
  const [mazeIdx, setMazeIdx] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const maze = MAZES[mazeIdx];

  const move = useCallback(
    (dx: number, dy: number) => {
      setPos((p) => {
        const nx = p.x + dx;
        const ny = p.y + dy;
        if (nx < 0 || nx >= 10 || ny < 0 || ny >= 10) return p;
        if (maze[ny][nx] === 1) return p;
        setMoves((m) => m + 1);
        if (maze[ny][nx] === 2) setWon(true);
        return { x: nx, y: ny };
      });
    },
    [maze],
  );

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        move(0, -1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        move(0, 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        move(-1, 0);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        move(1, 0);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [move]);

  function nextMaze() {
    setMazeIdx((i) => (i + 1) % 3);
    setPos({ x: 0, y: 0 });
    setWon(false);
    setMoves(0);
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex gap-6 font-body font-bold text-lg">
        <span>Maze {mazeIdx + 1}/3</span>
        <span className="text-primary">👣 Moves: {moves}</span>
      </div>
      {won && (
        <p className="font-display font-extrabold text-2xl text-green-500">
          🎉 You found the exit!
        </p>
      )}
      <div className="border-4 border-border rounded-2xl overflow-hidden">
        {maze.map((row, y) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: stable positional maze rows
            key={`row-${y}`}
            className="flex"
          >
            {row.map((cell, x) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: stable positional maze cells
                key={`cell-${y}-${x}`}
                className="w-9 h-9 flex items-center justify-center text-lg"
                style={{
                  backgroundColor:
                    cell === 1 ? "#1e1b4b" : cell === 2 ? "#bbf7d0" : "#f3f4f6",
                }}
              >
                {pos.x === x && pos.y === y ? "🟡" : cell === 2 ? "🚩" : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div />
        <button
          type="button"
          onClick={() => move(0, -1)}
          className="w-12 h-12 rounded-xl bg-muted border-2 border-border font-bold text-xl cursor-pointer"
        >
          ↑
        </button>
        <div />
        <button
          type="button"
          onClick={() => move(-1, 0)}
          className="w-12 h-12 rounded-xl bg-muted border-2 border-border font-bold text-xl cursor-pointer"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => move(0, 1)}
          className="w-12 h-12 rounded-xl bg-muted border-2 border-border font-bold text-xl cursor-pointer"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => move(1, 0)}
          className="w-12 h-12 rounded-xl bg-muted border-2 border-border font-bold text-xl cursor-pointer"
        >
          →
        </button>
      </div>
      {won && (
        <button
          type="button"
          onClick={nextMaze}
          className="px-6 py-3 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
        >
          {mazeIdx < 2 ? "Next Maze!" : "Play Again!"}
        </button>
      )}
      <TouchControls layout="single" />
    </div>
  );
}
