import { useState } from "react";

const GRID = 5;

function makeBlocks(): boolean[][] {
  return Array.from({ length: GRID }, () => Array(GRID).fill(true));
}

export function IceBreaker() {
  const [blocks, setBlocks] = useState<boolean[][]>(makeBlocks());
  const [selected, setSelected] = useState<[number, number][]>([]);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<number | null>(null);
  const [msg, setMsg] = useState(
    "Player 1: Click 1-3 adjacent blocks in same row or column to remove.",
  );

  function isAdjacent(cells: [number, number][]): boolean {
    if (cells.length <= 1) return true;
    const rows = cells.map((c) => c[0]);
    const cols = cells.map((c) => c[1]);
    const sameRow = rows.every((r) => r === rows[0]);
    const sameCol = cols.every((c) => c === cols[0]);
    if (!sameRow && !sameCol) return false;
    const sorted = [...cells].sort((a, b) =>
      sameRow ? a[1] - b[1] : a[0] - b[0],
    );
    for (let i = 1; i < sorted.length; i++) {
      const dr = Math.abs(sorted[i][0] - sorted[i - 1][0]);
      const dc = Math.abs(sorted[i][1] - sorted[i - 1][1]);
      if (dr + dc !== 1) return false;
    }
    return true;
  }

  function toggleCell(r: number, c: number) {
    if (winner) return;
    if (!blocks[r][c]) return;
    const idx = selected.findIndex(([sr, sc]) => sr === r && sc === c);
    let newSel: [number, number][];
    if (idx >= 0) {
      newSel = selected.filter((_, i) => i !== idx);
    } else {
      if (selected.length >= 3) {
        setMsg("Max 3 blocks at a time!");
        return;
      }
      newSel = [...selected, [r, c]];
    }
    setSelected(newSel);
  }

  function confirmRemove() {
    if (selected.length === 0 || winner) return;
    if (!isAdjacent(selected)) {
      setMsg("Blocks must be adjacent in same row or column!");
      setSelected([]);
      return;
    }
    const newBlocks = blocks.map((row) => [...row]);
    for (const [r, c] of selected) newBlocks[r][c] = false;
    setBlocks(newBlocks);
    setSelected([]);

    const remaining = newBlocks.flat().filter(Boolean).length;
    if (remaining === 0) {
      const w = turn === 1 ? 2 : 1;
      setWinner(w);
      setMsg(`Player ${turn} removed the last block! Player ${w} wins! 🏆`);
    } else {
      const next: 1 | 2 = turn === 1 ? 2 : 1;
      setTurn(next);
      setMsg(`Player ${next}: Click 1-3 adjacent blocks to remove.`);
    }
  }

  function reset() {
    setBlocks(makeBlocks());
    setSelected([]);
    setTurn(1);
    setWinner(null);
    setMsg(
      "Player 1: Click 1-3 adjacent blocks in same row or column to remove.",
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="font-display font-extrabold text-2xl">🧊 Ice Breaker</h2>
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl px-4 py-2 text-center font-body text-sm max-w-xs">
        {msg}
      </div>
      {!winner && (
        <div className="font-body font-bold text-lg">
          {turn === 1 ? "🔵 Player 1's turn" : "🔴 Player 2's turn"}
        </div>
      )}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
      >
        {blocks.map((row, ri) =>
          row.map((alive, ci) => {
            const isSel = selected.some(([r, c]) => r === ri && c === ci);
            const cellKey = `cell-${ri}-${ci}`;
            return (
              <button
                key={cellKey}
                type="button"
                onClick={() => toggleCell(ri, ci)}
                disabled={!alive || !!winner}
                className={`rounded-xl border-4 transition-all text-2xl ${
                  !alive
                    ? "bg-transparent border-transparent opacity-0"
                    : isSel
                      ? "bg-yellow-300 border-yellow-500"
                      : "bg-cyan-200 border-cyan-400 hover:bg-cyan-300 cursor-pointer"
                }`}
                style={{ width: 56, height: 56 }}
              >
                {alive ? "🧊" : ""}
              </button>
            );
          }),
        )}
      </div>
      {!winner && selected.length > 0 && (
        <button
          type="button"
          onClick={confirmRemove}
          className="bg-red-500 text-white px-6 py-2 rounded-2xl font-body font-bold hover:bg-red-600"
        >
          Remove {selected.length} block{selected.length > 1 ? "s" : ""}
        </button>
      )}
      {winner && (
        <div className="text-center">
          <div className="text-3xl font-display font-extrabold text-primary mb-2">
            🏆 Player {winner} Wins!
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
