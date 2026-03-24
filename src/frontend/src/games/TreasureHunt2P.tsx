import type React from "react";
import { useState } from "react";

const ROWS = 6;
const COLS = 8;
const TREASURES = 8;
const BOMBS = 4;

function makeGrid() {
  const cells: ("treasure" | "bomb" | "empty")[] = Array(ROWS * COLS).fill(
    "empty",
  );
  let placed = 0;
  while (placed < TREASURES) {
    const i = Math.floor(Math.random() * cells.length);
    if (cells[i] === "empty") {
      cells[i] = "treasure";
      placed++;
    }
  }
  placed = 0;
  while (placed < BOMBS) {
    const i = Math.floor(Math.random() * cells.length);
    if (cells[i] === "empty") {
      cells[i] = "bomb";
      placed++;
    }
  }
  return cells;
}

export function TreasureHunt2P() {
  const [grid] = useState(makeGrid);
  const [revealed, setRevealed] = useState<boolean[]>(() =>
    Array(ROWS * COLS).fill(false),
  );
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [turn, setTurn] = useState<1 | 2>(1);
  const [skipped, setSkipped] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lastResult, setLastResult] = useState("");

  function clickCell(idx: number) {
    if (revealed[idx] || gameOver) return;
    const newRevealed = [...revealed];
    newRevealed[idx] = true;
    setRevealed(newRevealed);
    const type = grid[idx];
    if (type === "treasure") {
      const newScores = { ...scores };
      if (turn === 1) newScores.p1++;
      else newScores.p2++;
      setScores(newScores);
      setLastResult("⭐ Treasure! Go again!");
      const remaining = grid.filter(
        (t, i) => t === "treasure" && !newRevealed[i],
      ).length;
      if (remaining === 0) setGameOver(true);
    } else if (type === "bomb") {
      setLastResult("💣 Bomb! Skip a turn!");
      setSkipped(true);
      setTurn((t) => (t === 1 ? 2 : 1));
    } else {
      setLastResult("Empty...");
      setTurn((t) => (t === 1 ? 2 : 1));
    }
    if (newRevealed.every((r, i) => r || grid[i] !== "treasure"))
      setGameOver(true);
  }

  function restart() {
    window.location.reload();
  }

  const winner = gameOver
    ? scores.p1 > scores.p2
      ? "Player 1"
      : scores.p2 > scores.p1
        ? "Player 2"
        : "Tie"
    : null;

  // Build grid using for-loops to avoid noArrayIndexKey rule
  const gridRows: React.ReactElement[] = [];
  for (let r = 0; r < ROWS; r++) {
    const cells: React.ReactElement[] = [];
    for (let c = 0; c < COLS; c++) {
      const idx = r * COLS + c;
      const rev = revealed[idx];
      const type = grid[idx];
      cells.push(
        <button
          key={`cell-${r}-${c}`}
          type="button"
          onClick={() => clickCell(idx)}
          className={`w-14 h-14 border border-amber-200 flex items-center justify-center text-2xl cursor-pointer transition-all
            ${rev ? (type === "treasure" ? "bg-yellow-200" : type === "bomb" ? "bg-red-200" : "bg-gray-100") : "bg-amber-700 hover:bg-amber-600"}`}
          data-ocid={`treasure.item.${idx + 1}`}
        >
          {rev
            ? type === "treasure"
              ? "⭐"
              : type === "bomb"
                ? "💣"
                : "·"
            : "❓"}
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
        <span
          className={`text-blue-600 ${turn === 1 && !gameOver ? "underline" : ""}`}
        >
          🔵 P1: {scores.p1} ⭐
        </span>
        <span
          className={`text-red-600 ${turn === 2 && !gameOver ? "underline" : ""}`}
        >
          P2: {scores.p2} ⭐ 🔴
        </span>
      </div>
      {!gameOver && (
        <div className="text-lg font-bold text-gray-600">
          Player {turn}'s turn {skipped ? "(was skipped)" : ""}
        </div>
      )}
      {lastResult && (
        <div className="text-xl font-bold text-orange-500">{lastResult}</div>
      )}
      <div className="border-4 border-amber-400 rounded-2xl overflow-hidden shadow-2xl bg-amber-50">
        {gridRows}
      </div>
      {gameOver && (
        <div className="text-center">
          <div className="text-3xl font-extrabold">
            {winner === "Tie" ? "🤝 Tie!" : `🏆 ${winner} Wins!`}
          </div>
          <button
            type="button"
            onClick={restart}
            className="mt-3 px-6 py-2 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
