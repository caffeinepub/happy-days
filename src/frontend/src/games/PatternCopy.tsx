import { useState } from "react";

const COLORS = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#a855f7",
  "#f97316",
];
const SLOT_KEYS = ["s0", "s1", "s2", "s3", "s4", "s5"];

function randPattern(len: number) {
  return Array.from({ length: len }, () =>
    Math.floor(Math.random() * COLORS.length),
  );
}

export function PatternCopy() {
  const [phase, setPhase] = useState<"show" | "copy" | "result">("show");
  const [curPattern, setCurPattern] = useState(() => randPattern(6));
  const [selected, setSelected] = useState<number[]>(Array(6).fill(0));
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const check = () => {
    const correct = selected.every((v, i) => v === curPattern[i]);
    if (correct) setScore((s) => s + 20);
    setPhase("result");
  };

  const next = () => {
    const np = randPattern(6);
    setCurPattern(np);
    setSelected(Array(6).fill(0));
    setRound((r) => r + 1);
    setPhase("show");
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="text-2xl font-extrabold">
        🎨 Pattern Copy — Round {round} — Score: {score}
      </div>
      {phase === "show" && (
        <>
          <div className="text-xl">Remember this pattern!</div>
          <div className="flex gap-3">
            {curPattern.map((c, i) => (
              <div
                key={SLOT_KEYS[i]}
                className="w-12 h-12 rounded-xl border-4 border-gray-300"
                style={{ backgroundColor: COLORS[c] }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setSelected(Array(6).fill(0));
              setPhase("copy");
            }}
            className="px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
          >
            I've got it!
          </button>
        </>
      )}
      {phase === "copy" && (
        <>
          <div className="text-xl">Now recreate the pattern!</div>
          <div className="flex gap-3">
            {selected.map((c, i) => (
              <button
                key={SLOT_KEYS[i]}
                type="button"
                onClick={() => {
                  const s = [...selected];
                  s[i] = (s[i] + 1) % COLORS.length;
                  setSelected(s);
                }}
                className="w-12 h-12 rounded-xl border-4 border-gray-300 cursor-pointer"
                style={{ backgroundColor: COLORS[c] }}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">
            Click each square to change its color
          </div>
          <button
            type="button"
            onClick={check}
            className="px-6 py-3 bg-green-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
          >
            Check!
          </button>
        </>
      )}
      {phase === "result" && (
        <>
          <div className="text-xl font-bold">
            {selected.every((v, i) => v === curPattern[i])
              ? "✅ Perfect match!"
              : "❌ Not quite"}
          </div>
          <div className="flex gap-6">
            <div>
              <div className="text-sm font-bold mb-1">Target</div>
              <div className="flex gap-2">
                {curPattern.map((c, i) => (
                  <div
                    key={SLOT_KEYS[i]}
                    className="w-10 h-10 rounded-lg"
                    style={{ backgroundColor: COLORS[c] }}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold mb-1">Yours</div>
              <div className="flex gap-2">
                {selected.map((c, i) => (
                  <div
                    key={SLOT_KEYS[i]}
                    className="w-10 h-10 rounded-lg"
                    style={{ backgroundColor: COLORS[c] }}
                  />
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={next}
            className="px-6 py-3 bg-purple-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
          >
            Next Round
          </button>
        </>
      )}
    </div>
  );
}
