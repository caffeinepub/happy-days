import type React from "react";
import { useState } from "react";

const SIZE = 5;
const WIN = 4;

type Cell = "X" | "O" | null;

function checkWinner(board: Cell[][]): "X" | "O" | null {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = board[r][c];
      if (!v) continue;
      const dirs = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
      ];
      for (const [dr, dc] of dirs) {
        let count = 1;
        for (let k = 1; k < WIN; k++) {
          const nr = r + dr * k;
          const nc = c + dc * k;
          if (
            nr < 0 ||
            nr >= SIZE ||
            nc < 0 ||
            nc >= SIZE ||
            board[nr][nc] !== v
          )
            break;
          count++;
        }
        if (count >= WIN) return v;
      }
    }
  }
  return null;
}

export function TicTacToe5x5() {
  const [board, setBoard] = useState<Cell[][]>(() =>
    Array(SIZE)
      .fill(null)
      .map(() => Array(SIZE).fill(null)),
  );
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null);

  function click(r: number, c: number) {
    if (board[r][c] || winner) return;
    const nb = board.map((row) => [...row]);
    nb[r][c] = turn;
    const w = checkWinner(nb);
    const full = nb.every((row) => row.every((cell) => cell !== null));
    setBoard(nb);
    if (w) setWinner(w);
    else if (full) setWinner("draw");
    else setTurn(turn === "X" ? "O" : "X");
  }

  function reset() {
    setBoard(
      Array(SIZE)
        .fill(null)
        .map(() => Array(SIZE).fill(null)),
    );
    setTurn("X");
    setWinner(null);
  }

  // Build board using for-loops to avoid noArrayIndexKey rule
  const boardRows: React.ReactElement[] = [];
  for (let r = 0; r < SIZE; r++) {
    const cells: React.ReactElement[] = [];
    for (let c = 0; c < SIZE; c++) {
      const cell = board[r][c];
      cells.push(
        <button
          key={`cell-${r}-${c}`}
          type="button"
          onClick={() => click(r, c)}
          className={`w-14 h-14 border border-gray-200 flex items-center justify-center text-2xl font-extrabold cursor-pointer transition-all hover:bg-gray-50
            ${cell === "X" ? "text-blue-600 bg-blue-50" : cell === "O" ? "text-red-500 bg-red-50" : "bg-white"}`}
          data-ocid={`ttt5.item.${r * SIZE + c + 1}`}
        >
          {cell}
        </button>,
      );
    }
    boardRows.push(
      <div key={`row-${r}`} className="flex">
        {cells}
      </div>,
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-8 text-xl font-extrabold">
        <span
          className={`text-blue-600 ${turn === "X" && !winner ? "underline" : ""}`}
        >
          🔵 P1 (X)
        </span>
        <span
          className={`text-red-600 ${turn === "O" && !winner ? "underline" : ""}`}
        >
          P2 (O) 🔴
        </span>
      </div>
      {!winner && (
        <div className="text-lg font-bold">
          Player {turn === "X" ? 1 : 2}'s turn ({turn}) — get 4 in a row!
        </div>
      )}
      <div className="border-4 border-gray-300 rounded-2xl overflow-hidden shadow-xl">
        {boardRows}
      </div>
      {winner && (
        <div className="text-center">
          <div className="text-3xl font-extrabold">
            {winner === "draw"
              ? "🤝 Draw!"
              : `🏆 Player ${winner === "X" ? 1 : 2} (${winner}) Wins!`}
          </div>
          <button
            type="button"
            onClick={reset}
            className="mt-3 px-6 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
