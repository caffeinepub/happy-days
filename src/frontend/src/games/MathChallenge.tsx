import { useState } from "react";

function makeQ() {
  const ops = ["+", "-"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * 20) + 1;
  let b = Math.floor(Math.random() * 20) + 1;
  if (op === "-" && b > a) [a, b] = [b, a];
  const answer = op === "+" ? a + b : a - b;
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const w = answer + (Math.floor(Math.random() * 10) - 5);
    if (w !== answer && w >= 0) wrongs.add(w);
  }
  const choices = [answer, ...wrongs].sort(() => Math.random() - 0.5);
  return { question: `${a} ${op} ${b} = ?`, answer, choices };
}

export function MathChallenge() {
  const [q, setQ] = useState(makeQ);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [done, setDone] = useState(false);

  function answer(n: number) {
    if (feedback) return;
    const correct = n === q.answer;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (round + 1 >= 10) {
        setDone(true);
        return;
      }
      setRound((r) => r + 1);
      setQ(makeQ());
      setFeedback(null);
    }, 700);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">🧮</div>
        <h2 className="font-display font-extrabold text-4xl">Done!</h2>
        <p className="font-body text-2xl">Score: {score}/10</p>
        <p className="font-body text-lg">
          {score >= 8
            ? "🌟 Math genius!"
            : score >= 5
              ? "👍 Good job!"
              : "📚 Keep learning!"}
        </p>
        <button
          type="button"
          onClick={() => {
            setRound(0);
            setScore(0);
            setQ(makeQ());
            setFeedback(null);
            setDone(false);
          }}
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
        <span>Question {round + 1}/10</span>
        <span className="text-primary">⭐ {score}</span>
      </div>
      <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-10 text-center border-4 border-border">
        <p className="font-display font-extrabold text-6xl text-foreground">
          {q.question}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {q.choices.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => answer(c)}
            className="py-5 rounded-2xl bg-primary text-white font-display font-extrabold text-3xl cursor-pointer transition-transform hover:scale-105 border-0"
          >
            {c}
          </button>
        ))}
      </div>
      {feedback && (
        <p
          className={`font-display font-extrabold text-2xl ${feedback === "correct" ? "text-green-500" : "text-red-500"}`}
        >
          {feedback === "correct" ? "✅ Correct!" : `❌ Answer: ${q.answer}`}
        </p>
      )}
    </div>
  );
}
