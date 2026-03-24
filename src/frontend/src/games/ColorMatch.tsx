import { useEffect, useState } from "react";

const COLORS = [
  { name: "Red", bg: "#ef4444" },
  { name: "Blue", bg: "#3b82f6" },
  { name: "Green", bg: "#22c55e" },
  { name: "Yellow", bg: "#eab308" },
  { name: "Purple", bg: "#a855f7" },
  { name: "Orange", bg: "#f97316" },
  { name: "Pink", bg: "#ec4899" },
  { name: "Teal", bg: "#14b8a6" },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getQuestion() {
  const correct = COLORS[Math.floor(Math.random() * COLORS.length)];
  const others = shuffle(COLORS.filter((c) => c.name !== correct.name)).slice(
    0,
    3,
  );
  const options = shuffle([correct, ...others]);
  return { correct, options };
}

export function ColorMatch() {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [q, setQ] = useState(getQuestion);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [done, setDone] = useState(false);

  function answer(name: string) {
    if (feedback) return;
    const correct = name === q.correct.name;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (round + 1 >= 10) {
        setDone(true);
        return;
      }
      setRound((r) => r + 1);
      setQ(getQuestion());
      setFeedback(null);
    }, 700);
  }

  function restart() {
    setScore(0);
    setRound(0);
    setQ(getQuestion());
    setFeedback(null);
    setDone(false);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">🎨</div>
        <h2 className="font-display font-extrabold text-4xl text-foreground">
          Done!
        </h2>
        <p className="font-body text-2xl text-muted-foreground">
          Score: {score} / 10
        </p>
        <button
          type="button"
          onClick={restart}
          className="px-8 py-4 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
        >
          Play Again!
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex gap-6 font-body font-bold text-lg">
        <span>Round {round + 1}/10</span>
        <span className="text-primary">⭐ Score: {score}</span>
      </div>
      <p className="font-display font-extrabold text-2xl text-foreground text-center">
        Which color is this?
      </p>
      <div
        className="w-40 h-40 rounded-3xl border-4 border-border shadow-lg"
        style={{ backgroundColor: q.correct.bg }}
      />
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {q.options.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => answer(c.name)}
            className="py-4 rounded-2xl font-display font-bold text-xl text-white border-0 cursor-pointer transition-transform hover:scale-105"
            style={{ backgroundColor: c.bg }}
          >
            {c.name}
          </button>
        ))}
      </div>
      {feedback && (
        <p
          className={`font-display font-extrabold text-2xl ${feedback === "correct" ? "text-green-500" : "text-red-500"}`}
        >
          {feedback === "correct"
            ? "✅ Correct!"
            : `❌ It was ${q.correct.name}!`}
        </p>
      )}
    </div>
  );
}
