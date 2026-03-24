import { useState } from "react";

type Move = "attack" | "block" | "special";

function calcDamage(m1: Move, m2: Move): [number, number] {
  const dmg = () => Math.floor(Math.random() * 11) + 15;
  if (m1 === m2) return [0, 0];
  if (
    (m1 === "attack" && m2 === "block") ||
    (m1 === "special" && m2 === "attack") ||
    (m1 === "block" && m2 === "special")
  ) {
    return [dmg(), 0];
  }
  return [0, dmg()];
}

export function NinjaVsPirate() {
  const [hp, setHp] = useState({ p1: 100, p2: 100 });
  const [p1Move, setP1Move] = useState<Move | null>(null);
  const [p2Move, setP2Move] = useState<Move | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);

  function fight() {
    if (!p1Move || !p2Move) return;
    const [d1, d2] = calcDamage(p1Move, p2Move);
    const newHp = { p1: Math.max(0, hp.p1 - d2), p2: Math.max(0, hp.p2 - d1) };
    const entry = `${p1Move.toUpperCase()} vs ${p2Move.toUpperCase()} → Ninja -${d2}HP, Pirate -${d1}HP`;
    setLog((prev) => [entry, ...prev.slice(0, 4)]);
    setHp(newHp);
    if (newHp.p1 <= 0 || newHp.p2 <= 0) setGameOver(true);
    setP1Move(null);
    setP2Move(null);
  }

  function restart() {
    setHp({ p1: 100, p2: 100 });
    setP1Move(null);
    setP2Move(null);
    setLog([]);
    setGameOver(false);
  }

  const moves: Move[] = ["attack", "block", "special"];
  const moveEmoji: Record<Move, string> = {
    attack: "⚔️",
    block: "🛡️",
    special: "✨",
  };
  const winner = hp.p1 <= 0 ? "Pirate 🏴‍☠️" : "Ninja 🥷";

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex gap-8 w-full max-w-lg">
        <div className="flex-1 text-center">
          <div className="text-3xl mb-1">🥷 Ninja</div>
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="h-6 rounded-full bg-blue-500 transition-all"
              style={{ width: `${hp.p1}%` }}
            />
          </div>
          <div className="font-bold text-blue-600">{hp.p1} HP</div>
        </div>
        <div className="flex items-center text-2xl">⚔️</div>
        <div className="flex-1 text-center">
          <div className="text-3xl mb-1">Pirate 🏴‍☠️</div>
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="h-6 rounded-full bg-red-500 transition-all"
              style={{ width: `${hp.p2}%` }}
            />
          </div>
          <div className="font-bold text-red-600">{hp.p2} HP</div>
        </div>
      </div>
      {!gameOver ? (
        <>
          <div className="flex gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="font-bold text-blue-600">Ninja (P1)</div>
              {moves.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setP1Move(m)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${p1Move === m ? "bg-blue-500 text-white scale-105" : "bg-gray-100 hover:bg-blue-100"}`}
                  data-ocid="ninja.p1.button"
                >
                  {moveEmoji[m]} {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="font-bold text-red-600">Pirate (P2)</div>
              {moves.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setP2Move(m)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${p2Move === m ? "bg-red-500 text-white scale-105" : "bg-gray-100 hover:bg-red-100"}`}
                  data-ocid="ninja.p2.button"
                >
                  {moveEmoji[m]} {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={fight}
            disabled={!p1Move || !p2Move}
            className="px-8 py-3 bg-orange-500 text-white rounded-xl font-extrabold text-lg disabled:opacity-50 hover:bg-orange-600 transition"
            data-ocid="ninja.fight.button"
          >
            ⚔️ Fight!
          </button>
          {log.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-3 w-full max-w-md">
              <div className="font-bold text-xs text-gray-400 mb-1">
                Battle Log
              </div>
              {log.map((entry) => (
                <div key={entry} className="text-sm text-gray-600">
                  {entry}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400">
            Attack beats Block • Special beats Block • Block beats Special •
            Attack beats Special
          </p>
        </>
      ) : (
        <div className="text-center">
          <div className="text-4xl font-extrabold mb-4">🏆 {winner} Wins!</div>
          <button
            type="button"
            onClick={restart}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
