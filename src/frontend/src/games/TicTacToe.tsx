import { useState } from "react";

type Cell = "X" | "O" | null;
type Mode = "vs-ai" | "2player";

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const CELL_KEYS = ["c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"];

function checkWinner(b: Cell[]): Cell | "draw" | null {
  for (const [a, c, d] of LINES)
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  if (b.every(Boolean)) return "draw";
  return null;
}

function aiMove(b: Cell[]): number {
  const empty = b.map((c, i) => (c === null ? i : -1)).filter((i) => i >= 0);
  for (const i of empty) {
    const t = [...b];
    t[i] = "O";
    if (checkWinner(t) === "O") return i;
  }
  for (const i of empty) {
    const t = [...b];
    t[i] = "X";
    if (checkWinner(t) === "X") return i;
  }
  if (b[4] === null) return 4;
  return empty[Math.floor(Math.random() * empty.length)];
}

export function TicTacToe() {
  const [mode, setMode] = useState<Mode>("vs-ai");
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const winner = checkWinner(board);

  function click(i: number) {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = turn;
    let nextTurn: "X" | "O" = turn === "X" ? "O" : "X";
    if (mode === "vs-ai" && turn === "X" && !checkWinner(newBoard)) {
      const ai = aiMove(newBoard);
      if (ai !== undefined) {
        newBoard[ai] = "O";
        nextTurn = "X";
      }
    }
    setBoard(newBoard);
    const result = checkWinner(newBoard);
    if (result === "X") setXScore((s) => s + 1);
    else if (result === "O") setOScore((s) => s + 1);
    if (!result) setTurn(nextTurn);
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setTurn("X");
  }
  function changeMode(m: Mode) {
    setMode(m);
    reset();
    setXScore(0);
    setOScore(0);
  }

  const winLine = LINES.find(
    ([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c],
  );

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => changeMode("vs-ai")}
          className={`px-4 py-2 rounded-2xl font-bold border-4 cursor-pointer ${mode === "vs-ai" ? "bg-blue-500 text-white border-blue-600" : "bg-white border-gray-300"}`}
        >
          🤖 vs Computer
        </button>
        <button
          type="button"
          onClick={() => changeMode("2player")}
          className={`px-4 py-2 rounded-2xl font-bold border-4 cursor-pointer ${mode === "2player" ? "bg-purple-500 text-white border-purple-600" : "bg-white border-gray-300"}`}
        >
          👥 2 Players
        </button>
      </div>
      <div className="flex gap-8 font-bold text-xl">
        <span className="text-blue-500">
          {mode === "vs-ai" ? "🙋 You" : "🔵 P1"} (X): {xScore}
        </span>
        <span className="text-red-500">
          {mode === "vs-ai" ? "🤖 AI" : "🔴 P2"} (O): {oScore}
        </span>
      </div>
      {mode === "2player" && !winner && (
        <div className="text-lg font-bold">
          {turn === "X" ? "🔵 Player 1's turn" : "🔴 Player 2's turn"}
        </div>
      )}
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            key={CELL_KEYS[i]}
            type="button"
            onClick={() => click(i)}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-border font-display font-extrabold text-5xl cursor-pointer transition-all hover:bg-muted"
            style={{
              backgroundColor: winLine?.includes(i) ? "#bbf7d0" : "#fff",
              color: cell === "X" ? "#3b82f6" : "#ef4444",
            }}
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && (
        <div className="text-center">
          <p className="font-display font-extrabold text-3xl mb-4">
            {winner === "draw"
              ? "🤝 It's a draw!"
              : winner === "X"
                ? mode === "vs-ai"
                  ? "🎉 You win!"
                  : "🔵 Player 1 wins!"
                : mode === "vs-ai"
                  ? "🤖 AI wins!"
                  : "🔴 Player 2 wins!"}
          </p>
          <button
            type="button"
            onClick={reset}
            className="px-8 py-4 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
          >
            Play Again!
          </button>
        </div>
      )}
      {!winner && (
        <p className="font-body text-muted-foreground">
          {mode === "vs-ai"
            ? "You are X — tap a square!"
            : "Tap a square to play!"}
        </p>
      )}
    </div>
  );
}
