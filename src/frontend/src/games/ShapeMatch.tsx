import { useMemo, useState } from "react";

const SHAPES = [
  { name: "Circle", svg: "⭕" },
  { name: "Star", svg: "⭐" },
  { name: "Triangle", svg: "🔺" },
  { name: "Square", svg: "🟥" },
  { name: "Diamond", svg: "💎" },
  { name: "Heart", svg: "❤️" },
  { name: "Pentagon", svg: "⬠" },
  { name: "Hexagon", svg: "⬡" },
];

function shuffle<T>(a: T[]) {
  return [...a].sort(() => Math.random() - 0.5);
}

export function ShapeMatch() {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const all = useMemo(() => shuffle(SHAPES), []);
  const q = all[round % all.length];

  const choices = useMemo(() => {
    const others = SHAPES.filter((s) => s.name !== q.name);
    return shuffle([...shuffle(others).slice(0, 3), q]);
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
        <div className="text-4xl font-extrabold">Done! 🔷</div>
        <div className="text-2xl">Score: {score}/150</div>
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 bg-blue-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
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
      <div className="text-2xl font-extrabold">What shape is this?</div>
      <div className="text-8xl">{q.svg}</div>
      {feedback && <div className="text-2xl font-bold">{feedback}</div>}
      <div className="grid grid-cols-2 gap-4">
        {choices.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => pick(c.name)}
            className="px-6 py-4 rounded-2xl font-bold text-xl cursor-pointer bg-indigo-100 hover:bg-indigo-200 border-2 border-indigo-300"
          >
            {c.svg} {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
