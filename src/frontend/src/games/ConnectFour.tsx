import { useState } from "react";

const ROWS = 6;
const COLS = 7;
type Cell = null | 1 | 2;

function checkWinner(board: Cell[][]): Cell {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c <= COLS - 4; c++) {
      const v = board[r][c];
      if (
        v &&
        board[r][c + 1] === v &&
        board[r][c + 2] === v &&
        board[r][c + 3] === v
      )
        return v;
    }
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 0; c < COLS; c++) {
      const v = board[r][c];
      if (
        v &&
        board[r + 1][c] === v &&
        board[r + 2][c] === v &&
        board[r + 3][c] === v
      )
        return v;
    }
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 0; c <= COLS - 4; c++) {
      const v = board[r][c];
      if (
        v &&
        board[r + 1][c + 1] === v &&
        board[r + 2][c + 2] === v &&
        board[r + 3][c + 3] === v
      )
        return v;
    }
  for (let r = 0; r <= ROWS - 4; r++)
    for (let c = 3; c < COLS; c++) {
      const v = board[r][c];
      if (
        v &&
        board[r + 1][c - 1] === v &&
        board[r + 2][c - 2] === v &&
        board[r + 3][c - 3] === v
      )
        return v;
    }
  return null;
}

// Generate stable row/col keys
const ROW_KEYS = Array.from({ length: ROWS }, (_, r) => `row-${r}`);
const COL_KEYS = Array.from({ length: ROWS }, (_, r) =>
  Array.from({ length: COLS }, (__, c) => `cell-${r}-${c}`),
);

export function ConnectFour() {
  const empty = (): Cell[][] =>
    Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const [board, setBoard] = useState<Cell[][]>(empty());
  const [turn, setTurn] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<Cell>(null);

  const drop = (col: number) => {
    if (winner) return;
    const b = board.map((r) => [...r]);
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!b[row][col]) {
        b[row][col] = turn;
        setBoard(b);
        const w = checkWinner(b);
        if (w) setWinner(w);
        else setTurn(turn === 1 ? 2 : 1);
        return;
      }
    }
  };

  const reset = () => {
    setBoard(empty());
    setTurn(1);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-2xl font-display font-extrabold">
        {winner
          ? `🏆 Player ${winner} Wins!`
          : `Player ${turn}'s Turn ${turn === 1 ? "🔴" : "🟡"}`}
      </div>
      <div className="bg-blue-600 p-3 rounded-2xl inline-block">
        {board.map((row, rowIdx) => (
          <div key={ROW_KEYS[rowIdx]} className="flex gap-2 mb-2">
            {row.map((cell, colIdx) => (
              <button
                key={COL_KEYS[rowIdx][colIdx]}
                type="button"
                onClick={() => drop(colIdx)}
                className="w-10 h-10 rounded-full border-0 cursor-pointer transition-transform hover:scale-110"
                style={{
                  backgroundColor:
                    cell === 1 ? "#ef4444" : cell === 2 ? "#eab308" : "#dbeafe",
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex gap-4 text-lg">
        <span>🔴 Player 1</span>
        <span>🟡 Player 2</span>
      </div>
      <button
        type="button"
        onClick={reset}
        className="px-6 py-3 bg-blue-500 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 cursor-pointer"
      >
        Play Again
      </button>
    </div>
  );
}
