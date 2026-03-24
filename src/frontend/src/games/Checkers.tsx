import type React from "react";
import { useState } from "react";

type Player = 1 | 2;
type PieceType = "normal" | "king";
interface Piece {
  player: Player;
  type: PieceType;
}
type Cell = Piece | null;
type Board = Cell[][];

function createBoard(): Board {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 8; c++)
      if ((r + c) % 2 === 1) board[r][c] = { player: 2, type: "normal" };
  for (let r = 5; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if ((r + c) % 2 === 1) board[r][c] = { player: 1, type: "normal" };
  return board;
}

function getJumps(
  board: Board,
  r: number,
  c: number,
  piece: Piece,
): [number, number, number, number][] {
  const dirs =
    piece.type === "king" ? [-1, 1] : piece.player === 1 ? [-1] : [1];
  const jumps: [number, number, number, number][] = [];
  for (const dr of dirs)
    for (const dc of [-1, 1]) {
      const mr = r + dr;
      const mc = c + dc;
      const tr = r + 2 * dr;
      const tc = c + 2 * dc;
      if (
        tr >= 0 &&
        tr < 8 &&
        tc >= 0 &&
        tc < 8 &&
        board[mr]?.[mc]?.player &&
        board[mr][mc]!.player !== piece.player &&
        !board[tr][tc]
      )
        jumps.push([tr, tc, mr, mc]);
    }
  return jumps;
}

function getMoves(
  board: Board,
  r: number,
  c: number,
  piece: Piece,
): [number, number][] {
  const dirs =
    piece.type === "king" ? [-1, 1] : piece.player === 1 ? [-1] : [1];
  const moves: [number, number][] = [];
  for (const dr of dirs)
    for (const dc of [-1, 1]) {
      const tr = r + dr;
      const tc = c + dc;
      if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8 && !board[tr][tc])
        moves.push([tr, tc]);
    }
  return moves;
}

export function Checkers() {
  const [board, setBoard] = useState<Board>(createBoard);
  const [turn, setTurn] = useState<Player>(1);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [mustJump, setMustJump] = useState<[number, number] | null>(null);

  function handleCell(r: number, c: number) {
    if (winner) return;
    const piece = board[r][c];
    if (!selected) {
      if (piece && piece.player === turn) setSelected([r, c]);
      return;
    }
    const [sr, sc] = selected;
    const selPiece = board[sr][sc]!;
    const jumps = getJumps(board, sr, sc, selPiece);
    const moves = getMoves(board, sr, sc, selPiece);
    const isJump = jumps.find(([tr, tc]) => tr === r && tc === c);
    const isMove = moves.find(([tr, tc]) => tr === r && tc === c);
    if (isJump) {
      const [, , mr, mc] = isJump;
      const nb = board.map((row) => [...row]);
      nb[r][c] = selPiece;
      nb[sr][sc] = null;
      nb[mr][mc] = null;
      if (
        (selPiece.player === 1 && r === 0) ||
        (selPiece.player === 2 && r === 7)
      )
        nb[r][c] = { ...selPiece, type: "king" };
      const furtherJumps = getJumps(nb, r, c, nb[r][c]!);
      const p1 = nb.flat().filter((x) => x?.player === 1).length;
      const p2 = nb.flat().filter((x) => x?.player === 2).length;
      if (!p1) {
        setBoard(nb);
        setWinner(2);
        return;
      }
      if (!p2) {
        setBoard(nb);
        setWinner(1);
        return;
      }
      setBoard(nb);
      if (furtherJumps.length > 0) {
        setMustJump([r, c]);
        setSelected([r, c]);
      } else {
        setTurn(turn === 1 ? 2 : 1);
        setSelected(null);
        setMustJump(null);
      }
    } else if (isMove && !mustJump) {
      const nb = board.map((row) => [...row]);
      nb[r][c] = selPiece;
      nb[sr][sc] = null;
      if (
        (selPiece.player === 1 && r === 0) ||
        (selPiece.player === 2 && r === 7)
      )
        nb[r][c] = { ...selPiece, type: "king" };
      setBoard(nb);
      setTurn(turn === 1 ? 2 : 1);
      setSelected(null);
      setMustJump(null);
    } else {
      if (
        piece &&
        piece.player === turn &&
        (!mustJump || (mustJump[0] === r && mustJump[1] === c))
      )
        setSelected([r, c]);
      else setSelected(null);
    }
  }

  function reset() {
    setBoard(createBoard());
    setTurn(1);
    setSelected(null);
    setWinner(null);
    setMustJump(null);
  }

  const selJumps = selected
    ? getJumps(
        board,
        selected[0],
        selected[1],
        board[selected[0]][selected[1]]!,
      )
    : [];
  const selMoves = selected
    ? getMoves(
        board,
        selected[0],
        selected[1],
        board[selected[0]][selected[1]]!,
      )
    : [];
  const highlights = new Set([
    ...selJumps.map(([r, c]) => `${r},${c}`),
    ...selMoves.map(([r, c]) => `${r},${c}`),
  ]);

  // Build board JSX using for-loops to avoid noArrayIndexKey lint rule
  const boardRows: React.ReactElement[] = [];
  for (let r = 0; r < 8; r++) {
    const cells: React.ReactElement[] = [];
    for (let c = 0; c < 8; c++) {
      const cell = board[r][c];
      const dark = (r + c) % 2 === 1;
      const isSel = selected?.[0] === r && selected?.[1] === c;
      const isHl = highlights.has(`${r},${c}`);
      cells.push(
        <button
          key={`cell-${r}-${c}`}
          type="button"
          onClick={() => (dark ? handleCell(r, c) : undefined)}
          className={`w-12 h-12 flex items-center justify-center text-2xl select-none border-0
            ${dark ? "bg-amber-800 cursor-pointer hover:opacity-80" : "bg-amber-100"}
            ${isSel ? "ring-4 ring-inset ring-yellow-400" : ""}
            ${isHl && dark ? "bg-amber-600" : ""}`}
        >
          {cell && (
            <span
              className={`text-3xl drop-shadow transition-transform ${isSel ? "scale-125" : ""}`}
            >
              {cell.player === 1
                ? cell.type === "king"
                  ? "👑"
                  : "🔴"
                : cell.type === "king"
                  ? "♛"
                  : "⚫"}
            </span>
          )}
          {isHl && !cell && (
            <span className="w-4 h-4 rounded-full bg-yellow-300 opacity-80 block" />
          )}
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
      <div className="flex gap-8 mb-2">
        <div
          className={`px-4 py-2 rounded-xl font-bold text-white text-lg ${turn === 1 && !winner ? "bg-red-500 scale-110 ring-4 ring-red-300" : "bg-red-300"}`}
        >
          🔴 Player 1 {winner === 1 ? "🏆 WINS!" : ""}
        </div>
        <div
          className={`px-4 py-2 rounded-xl font-bold text-white text-lg ${turn === 2 && !winner ? "bg-gray-700 scale-110 ring-4 ring-gray-400" : "bg-gray-400"}`}
        >
          ⚫ Player 2 {winner === 2 ? "🏆 WINS!" : ""}
        </div>
      </div>
      <div className="border-4 border-amber-800 rounded-xl overflow-hidden shadow-2xl">
        {boardRows}
      </div>
      {winner && (
        <div className="text-center">
          <div className="text-3xl font-extrabold text-yellow-600">
            🏆 Player {winner} Wins!
          </div>
          <button
            type="button"
            onClick={reset}
            className="mt-3 px-6 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600"
          >
            Play Again
          </button>
        </div>
      )}
      {!winner && (
        <p className="text-sm text-gray-500">
          Click a piece to select, then click a destination. Jump = required!
        </p>
      )}
    </div>
  );
}
