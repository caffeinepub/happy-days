import { useState } from "react";

type CellState = "empty" | "ship" | "hit" | "miss";
type Phase = "place-p1" | "place-p2" | "battle-p1" | "battle-p2" | "done";

const GRID = 6;
const SHIPS = [3, 2, 2, 1];

function emptyGrid(): CellState[][] {
  return Array.from(
    { length: GRID },
    () => Array(GRID).fill("empty") as CellState[],
  );
}

function countShipCells(grid: CellState[][]): number {
  return grid.flat().filter((c) => c === "ship").length;
}

function countHits(grid: CellState[][]): number {
  return grid.flat().filter((c) => c === "hit").length;
}

export function Battleship() {
  const [phase, setPhase] = useState<Phase>("place-p1");
  const [p1Grid, setP1Grid] = useState<CellState[][]>(emptyGrid());
  const [p2Grid, setP2Grid] = useState<CellState[][]>(emptyGrid());
  const [p1Attack, setP1Attack] = useState<CellState[][]>(emptyGrid());
  const [p2Attack, setP2Attack] = useState<CellState[][]>(emptyGrid());
  const [shipIdx, setShipIdx] = useState(0);
  const [placing, setPlacing] = useState<[number, number][]>([]);
  const [msg, setMsg] = useState(
    "Player 1: Place your ships! Click cells to place each ship.",
  );
  const [winner, setWinner] = useState("");

  const currentShipLen = SHIPS[shipIdx] ?? 0;

  function handlePlaceClick(row: number, col: number) {
    if (phase !== "place-p1" && phase !== "place-p2") return;
    const grid = phase === "place-p1" ? p1Grid : p2Grid;
    if (grid[row][col] !== "empty") return;

    const newPlacing = [...placing, [row, col] as [number, number]];

    if (newPlacing.length === currentShipLen) {
      const rows = newPlacing.map((c) => c[0]);
      const cols = newPlacing.map((c) => c[1]);
      const sameRow = rows.every((r) => r === rows[0]);
      const sameCol = cols.every((c) => c === cols[0]);
      if (!sameRow && !sameCol) {
        setMsg("Cells must be in a straight line! Start again for this ship.");
        setPlacing([]);
        return;
      }
      const sorted = [...newPlacing].sort((a, b) =>
        sameRow ? a[1] - b[1] : a[0] - b[0],
      );
      for (let i = 1; i < sorted.length; i++) {
        const dr = Math.abs(sorted[i][0] - sorted[i - 1][0]);
        const dc = Math.abs(sorted[i][1] - sorted[i - 1][1]);
        if (dr + dc !== 1) {
          setMsg("Cells must be adjacent! Start again for this ship.");
          setPlacing([]);
          return;
        }
      }

      const newGrid = grid.map((r) => [...r] as CellState[]);
      for (const [r, c] of newPlacing) newGrid[r][c] = "ship";

      const nextShipIdx = shipIdx + 1;
      if (phase === "place-p1") {
        setP1Grid(newGrid);
        if (nextShipIdx >= SHIPS.length) {
          setPhase("place-p2");
          setShipIdx(0);
          setPlacing([]);
          setMsg("Player 2: Place your ships! Click cells to place each ship.");
        } else {
          setShipIdx(nextShipIdx);
          setPlacing([]);
          setMsg(`Player 1: Place your ${SHIPS[nextShipIdx]}-cell ship!`);
        }
      } else {
        setP2Grid(newGrid);
        if (nextShipIdx >= SHIPS.length) {
          setPhase("battle-p1");
          setShipIdx(0);
          setPlacing([]);
          setMsg("Battle! Player 1: Click Player 2's grid to fire!");
        } else {
          setShipIdx(nextShipIdx);
          setPlacing([]);
          setMsg(`Player 2: Place your ${SHIPS[nextShipIdx]}-cell ship!`);
        }
      }
    } else {
      setPlacing(newPlacing);
      setMsg(
        `${phase === "place-p1" ? "P1" : "P2"}: Click ${currentShipLen - newPlacing.length} more cell(s) for this ship.`,
      );
    }
  }

  function handleAttack(row: number, col: number) {
    if (phase !== "battle-p1" && phase !== "battle-p2") return;
    if (phase === "battle-p1") {
      if (p1Attack[row][col] !== "empty") return;
      const hit = p2Grid[row][col] === "ship";
      const newAtk = p1Attack.map((r) => [...r] as CellState[]);
      newAtk[row][col] = hit ? "hit" : "miss";
      setP1Attack(newAtk);
      const totalShips = countShipCells(p2Grid);
      if (countHits(newAtk) >= totalShips) {
        setWinner("Player 1");
        setPhase("done");
        setMsg("🏆 Player 1 wins! All ships sunk!");
      } else {
        setPhase("battle-p2");
        setMsg(
          hit
            ? "Hit! Player 2: Fire at Player 1's grid!"
            : "Miss! Player 2: Fire at Player 1's grid!",
        );
      }
    } else {
      if (p2Attack[row][col] !== "empty") return;
      const hit = p1Grid[row][col] === "ship";
      const newAtk = p2Attack.map((r) => [...r] as CellState[]);
      newAtk[row][col] = hit ? "hit" : "miss";
      setP2Attack(newAtk);
      const totalShips = countShipCells(p1Grid);
      if (countHits(newAtk) >= totalShips) {
        setWinner("Player 2");
        setPhase("done");
        setMsg("🏆 Player 2 wins! All ships sunk!");
      } else {
        setPhase("battle-p1");
        setMsg(
          hit
            ? "Hit! Player 1: Fire at Player 2's grid!"
            : "Miss! Player 1: Fire at Player 2's grid!",
        );
      }
    }
  }

  function reset() {
    setPhase("place-p1");
    setP1Grid(emptyGrid());
    setP2Grid(emptyGrid());
    setP1Attack(emptyGrid());
    setP2Attack(emptyGrid());
    setShipIdx(0);
    setPlacing([]);
    setMsg("Player 1: Place your ships! Click cells to place each ship.");
    setWinner("");
  }

  const isPlacing = phase === "place-p1" || phase === "place-p2";

  function renderGrid(
    grid: CellState[][],
    attackGrid: CellState[][] | null,
    clickFn: ((r: number, c: number) => void) | null,
    showShips: boolean,
    placingCells: [number, number][],
  ) {
    return (
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
      >
        {grid.map((row, ri) =>
          row.map((cell, ci) => {
            const atkCell = attackGrid ? attackGrid[ri][ci] : "empty";
            const isPlacer = placingCells.some(
              ([r, c]) => r === ri && c === ci,
            );
            let bg = "bg-blue-200";
            if (showShips && cell === "ship") bg = "bg-gray-600";
            if (atkCell === "hit") bg = "bg-red-500";
            if (atkCell === "miss") bg = "bg-blue-400";
            if (isPlacer) bg = "bg-yellow-400";
            return (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-size grid cells with stable positions
                key={`cell-${ri}-${ci}`}
                type="button"
                onClick={() => clickFn?.(ri, ci)}
                className={`${bg} border-2 border-blue-300 rounded-md transition-all hover:opacity-80 cursor-pointer`}
                style={{ width: 40, height: 40 }}
              >
                {atkCell === "hit"
                  ? "💥"
                  : atkCell === "miss"
                    ? "🌊"
                    : showShips && cell === "ship"
                      ? "🚢"
                      : ""}
              </button>
            );
          }),
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="font-display font-extrabold text-2xl">🚢 Battleship</h2>
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl px-4 py-2 text-center font-body font-bold text-sm max-w-xs">
        {msg}
      </div>
      {isPlacing && (
        <div className="text-sm font-body text-muted-foreground">
          Ship {shipIdx + 1}/{SHIPS.length} — Length: {currentShipLen} (
          {placing.length}/{currentShipLen} selected)
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="font-display font-bold text-lg">Player 1</div>
          {isPlacing && phase === "place-p1"
            ? renderGrid(p1Grid, null, handlePlaceClick, true, placing)
            : renderGrid(
                p1Grid,
                phase === "battle-p2" || phase === "done" ? p2Attack : null,
                phase === "battle-p2" ? handleAttack : null,
                phase !== "battle-p2" && phase !== "battle-p1",
                [],
              )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="font-display font-bold text-lg">Player 2</div>
          {isPlacing && phase === "place-p2"
            ? renderGrid(p2Grid, null, handlePlaceClick, true, placing)
            : renderGrid(
                p2Grid,
                phase === "battle-p1" || phase === "done" ? p1Attack : null,
                phase === "battle-p1" ? handleAttack : null,
                phase !== "battle-p1" && phase !== "battle-p2",
                [],
              )}
        </div>
      </div>
      {phase === "done" && (
        <div className="text-center">
          <div className="text-3xl font-display font-extrabold text-primary mb-2">
            🏆 {winner} Wins!
          </div>
          <button
            type="button"
            onClick={reset}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-body font-bold hover:opacity-90"
          >
            Play Again
          </button>
        </div>
      )}
      {!isPlacing && phase !== "done" && (
        <button
          type="button"
          onClick={reset}
          className="text-sm text-muted-foreground underline"
        >
          Restart
        </button>
      )}
    </div>
  );
}
