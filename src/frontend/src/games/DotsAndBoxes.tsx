import type React from "react";
import { useState } from "react";

const ROWS = 5;
const COLS = 5;

type LineKey = string;

function boxKey(r: number, c: number) {
  return `box-${r}-${c}`;
}
function hLineKey(r: number, c: number) {
  return `h-${r}-${c}`;
}
function vLineKey(r: number, c: number) {
  return `v-${r}-${c}`;
}

export function DotsAndBoxes() {
  const [lines, setLines] = useState<Record<LineKey, 1 | 2>>({});
  const [boxes, setBoxes] = useState<Record<string, 1 | 2>>({});
  const [turn, setTurn] = useState<1 | 2>(1);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [gameOver, setGameOver] = useState(false);

  function clickLine(key: LineKey) {
    if (lines[key] || gameOver) return;
    const newLines = { ...lines, [key]: turn };
    const newBoxes = { ...boxes };
    let captured = 0;
    for (let br = 0; br < ROWS; br++) {
      for (let bc = 0; bc < COLS; bc++) {
        if (newBoxes[boxKey(br, bc)]) continue;
        const top = newLines[hLineKey(br, bc)];
        const bottom = newLines[hLineKey(br + 1, bc)];
        const left = newLines[vLineKey(br, bc)];
        const right = newLines[vLineKey(br, bc + 1)];
        if (top && bottom && left && right) {
          newBoxes[boxKey(br, bc)] = turn;
          captured++;
        }
      }
    }
    const newScores = { ...scores };
    if (turn === 1) newScores.p1 += captured;
    else newScores.p2 += captured;
    const filledBoxes = Object.keys(newBoxes).length;
    setLines(newLines);
    setBoxes(newBoxes);
    setScores(newScores);
    if (filledBoxes >= ROWS * COLS) {
      setGameOver(true);
      return;
    }
    if (captured === 0) setTurn(turn === 1 ? 2 : 1);
  }

  function reset() {
    setLines({});
    setBoxes({});
    setTurn(1);
    setScores({ p1: 0, p2: 0 });
    setGameOver(false);
  }

  const DOT = 10;
  const SEG = 52;
  const PAD = 16;
  const totalW = PAD * 2 + COLS * SEG + DOT;
  const totalH = PAD * 2 + ROWS * SEG + DOT;
  const winner = gameOver
    ? scores.p1 > scores.p2
      ? "Player 1"
      : scores.p2 > scores.p1
        ? "Player 2"
        : "Tie"
    : null;

  // Build SVG elements using for-loops to avoid noArrayIndexKey rule
  const hLines: React.ReactElement[] = [];
  for (let r = 0; r <= ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const key = hLineKey(r, c);
      const claimed = lines[key];
      const x = PAD + DOT / 2 + c * SEG;
      const y = PAD + DOT / 2 + r * SEG;
      hLines.push(
        <rect
          key={key}
          x={x}
          y={y - 5}
          width={SEG - DOT}
          height={10}
          fill={
            claimed ? (claimed === 1 ? "#3b82f6" : "#ef4444") : "transparent"
          }
          stroke={claimed ? "none" : "#d1d5db"}
          strokeWidth={2}
          className={!claimed ? "cursor-pointer hover:fill-yellow-200" : ""}
          onClick={() => clickLine(key)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") clickLine(key);
          }}
          role="button"
          tabIndex={0}
          rx={3}
        />,
      );
    }
  }
  const vLines: React.ReactElement[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS; c++) {
      const key = vLineKey(r, c);
      const claimed = lines[key];
      const x = PAD + DOT / 2 + c * SEG;
      const y = PAD + DOT / 2 + r * SEG;
      vLines.push(
        <rect
          key={key}
          x={x - 5}
          y={y}
          width={10}
          height={SEG - DOT}
          fill={
            claimed ? (claimed === 1 ? "#3b82f6" : "#ef4444") : "transparent"
          }
          stroke={claimed ? "none" : "#d1d5db"}
          strokeWidth={2}
          className={!claimed ? "cursor-pointer hover:fill-yellow-200" : ""}
          onClick={() => clickLine(key)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") clickLine(key);
          }}
          role="button"
          tabIndex={0}
          rx={3}
        />,
      );
    }
  }
  const boxRects: React.ReactElement[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const owner = boxes[boxKey(r, c)];
      if (owner) {
        boxRects.push(
          <rect
            key={boxKey(r, c)}
            x={PAD + DOT + c * SEG}
            y={PAD + DOT + r * SEG}
            width={SEG - DOT}
            height={SEG - DOT}
            fill={owner === 1 ? "#bfdbfe" : "#fecaca"}
            rx={4}
          />,
        );
      }
    }
  }
  const dots: React.ReactElement[] = [];
  for (let r = 0; r <= ROWS; r++) {
    for (let c = 0; c <= COLS; c++) {
      dots.push(
        <circle
          key={`dot-${r}-${c}`}
          cx={PAD + DOT / 2 + c * SEG}
          cy={PAD + DOT / 2 + r * SEG}
          r={DOT / 2}
          fill="#374151"
        />,
      );
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-8 text-xl font-extrabold">
        <span
          className={`text-blue-600 ${turn === 1 && !gameOver ? "underline" : ""}`}
        >
          🔵 P1: {scores.p1}
        </span>
        <span
          className={`text-red-500 ${turn === 2 && !gameOver ? "underline" : ""}`}
        >
          🔴 P2: {scores.p2}
        </span>
      </div>
      {!gameOver && (
        <div className="text-sm font-bold text-gray-600">
          Player {turn}'s turn
        </div>
      )}
      <svg
        width={totalW}
        height={totalH}
        className="border-2 border-gray-200 rounded-2xl bg-gray-50"
        role="img"
        aria-label="Dots and Boxes game board"
      >
        <title>Dots and Boxes game board</title>
        {boxRects}
        {hLines}
        {vLines}
        {dots}
      </svg>
      {gameOver && (
        <div className="text-center">
          <div className="text-3xl font-extrabold text-yellow-600">
            {winner === "Tie" ? "🤝 It's a Tie!" : `🏆 ${winner} Wins!`}
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
      <p className="text-xs text-gray-400">
        Click a line between dots to claim it. Complete a box to score!
      </p>
    </div>
  );
}
