import { useState } from "react";

const GRID = 6;
const PALETTE = [
  "#ff6b6b",
  "#ffd93d",
  "#6bcb77",
  "#4d96ff",
  "#ff922b",
  "#da77f2",
  "#ffffff",
  "#333333",
];

function randomGrid(): string[][] {
  return Array.from({ length: GRID }, () =>
    Array.from({ length: GRID }, () => PALETTE[Math.floor(Math.random() * 6)]),
  );
}

export function PaintBucket() {
  const [target] = useState<string[][]>(randomGrid());
  const [player, setPlayer] = useState<string[][]>(
    Array.from({ length: GRID }, () => Array(GRID).fill("#ffffff")),
  );
  const [color, setColor] = useState(PALETTE[0]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  function paint(r: number, c: number) {
    if (submitted) return;
    setPlayer((prev) => {
      const n = prev.map((row) => [...row]);
      n[r][c] = color;
      return n;
    });
  }

  function calcScore() {
    let match = 0;
    for (let r = 0; r < GRID; r++)
      for (let c = 0; c < GRID; c++) if (player[r][c] === target[r][c]) match++;
    return Math.round((match / (GRID * GRID)) * 100);
  }

  function submit() {
    setScore(calcScore());
    setSubmitted(true);
  }

  function reset() {
    setPlayer(Array.from({ length: GRID }, () => Array(GRID).fill("#ffffff")));
    setSubmitted(false);
    setScore(0);
  }

  function renderGrid(
    grid: string[][],
    onClick?: (r: number, c: number) => void,
  ) {
    return (
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
      >
        {grid.map((row, ri) =>
          row.map((cell, ci) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-size grid cells with stable positions
              key={`cell-${ri}-${ci}`}
              type="button"
              onClick={() => onClick?.(ri, ci)}
              style={{ backgroundColor: cell, width: 44, height: 44 }}
              className={`rounded-md border-2 border-white/30 ${onClick ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
            />
          )),
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="font-display font-extrabold text-2xl">🖌️ Paint Bucket</h2>
      <p className="font-body text-muted-foreground text-sm text-center">
        Copy the target pattern! Pick a color and click cells.
      </p>
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="font-body font-bold text-sm">🎯 Target</div>
          {renderGrid(target)}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="font-body font-bold text-sm">🎨 Your Painting</div>
          {renderGrid(player, paint)}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            style={{ backgroundColor: c }}
            className={`w-9 h-9 rounded-full border-4 transition-all ${color === c ? "border-foreground scale-125" : "border-transparent"}`}
          />
        ))}
      </div>
      {!submitted ? (
        <button
          type="button"
          onClick={submit}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-body font-bold"
        >
          Submit! 🎨
        </button>
      ) : (
        <div className="text-center">
          <div className="text-3xl font-display font-extrabold mb-1">
            {score}% Match!
          </div>
          <div className="font-body text-muted-foreground mb-3">
            {score >= 80
              ? "🌟 Amazing!"
              : score >= 50
                ? "👍 Good job!"
                : "Keep practicing!"}
          </div>
          <button
            type="button"
            onClick={reset}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-body font-bold"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
