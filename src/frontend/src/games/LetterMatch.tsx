import { useState } from "react";

const LETTERS = "ABCDEFGHIJKLMNO".split("");

function makeQ(used: string[]) {
  const remaining = LETTERS.filter((l) => !used.includes(l));
  const correct = remaining[Math.floor(Math.random() * remaining.length)];
  const others = LETTERS.filter((l) => l !== correct)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  return {
    correct,
    options: [correct, ...others].sort(() => Math.random() - 0.5),
  };
}

export function LetterMatch() {
  const [used, setUsed] = useState<string[]>([]);
  const [q, setQ] = useState(() => makeQ([]));
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [done, setDone] = useState(false);

  function answer(l: string) {
    if (feedback) return;
    const correct = l === q.correct;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      const newUsed = [...used, q.correct];
      if (newUsed.length >= 15) {
        setDone(true);
        return;
      }
      setUsed(newUsed);
      setQ(makeQ(newUsed));
      setFeedback(null);
    }, 700);
  }

  function restart() {
    setUsed([]);
    setQ(makeQ([]));
    setScore(0);
    setFeedback(null);
    setDone(false);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">📖</div>
        <h2 className="font-display font-extrabold text-4xl">Done!</h2>
        <p className="font-body text-2xl">Score: {score}/15</p>
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
        <span>Letter {used.length + 1}/15</span>
        <span className="text-primary">⭐ {score}</span>
      </div>
      <p className="font-display font-bold text-xl text-muted-foreground">
        Find the lowercase letter!
      </p>
      <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-10 border-4 border-border">
        <p className="font-display font-extrabold text-9xl text-foreground">
          {q.correct}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {q.options.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => answer(l)}
            className="py-5 rounded-2xl bg-primary text-white font-display font-extrabold text-4xl cursor-pointer border-0 transition-transform hover:scale-105"
          >
            {l.toLowerCase()}
          </button>
        ))}
      </div>
      {feedback && (
        <p
          className={`font-display font-extrabold text-2xl ${feedback === "correct" ? "text-green-500" : "text-red-500"}`}
        >
          {feedback === "correct" ? "✅ Correct!" : "❌ Try again!"}
        </p>
      )}
    </div>
  );
}
