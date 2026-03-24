import { useMemo, useState } from "react";

const COLORS = [
  { name: "Red", hex: "#ef4444" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Green", hex: "#22c55e" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Orange", hex: "#f97316" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Teal", hex: "#14b8a6" },
];

function shuffle<T>(a: T[]) {
  return [...a].sort(() => Math.random() - 0.5);
}

export function ColorSwap() {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const shuffled = useMemo(() => shuffle(COLORS), []);
  const q = shuffled[round % shuffled.length];

  const choices = useMemo(() => {
    const others = COLORS.filter((c) => c.name !== q.name);
    const picked = shuffle(others).slice(0, 3);
    return shuffle([...picked, q]);
  }, [q]);

  const pick = (name: string) => {
    if (feedback) return;
    if (name === q.name) {
      setScore((s) => s + 10);
      setFeedback("✅ Correct!");
    } else setFeedback(`❌ It was ${q.name}`);
    setTimeout(() => {
      setFeedback(null);
      if (round + 1 >= 15) setDone(true);
      else setRound((r) => r + 1);
    }, 900);
  };

  const reset = () => {
    setRound(0);
    setScore(0);
    setDone(false);
    setFeedback(null);
  };

  if (done)
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="text-4xl font-extrabold">Done! 🎨</div>
        <div className="text-2xl">Score: {score}/150</div>
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
        >
          Play Again
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="text-xl font-bold">
        Round {round + 1}/15 — Score: {score}
      </div>
      <div className="text-2xl font-extrabold">What color is this? 👇</div>
      <div
        className="w-32 h-32 rounded-3xl border-4 border-gray-300"
        style={{ backgroundColor: q.hex }}
      />
      {feedback && <div className="text-2xl font-bold">{feedback}</div>}
      <div className="grid grid-cols-2 gap-4">
        {choices.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => pick(c.name)}
            className="px-6 py-3 rounded-2xl font-bold text-white text-lg cursor-pointer border-0"
            style={{ backgroundColor: c.hex }}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
