import { useState } from "react";

const QS = [
  { q: "Which animal says MOO?", a: "🐄", opts: ["🐄", "🐷", "🐑", "🐴"] },
  { q: "Which animal says OINK?", a: "🐷", opts: ["🐄", "🐷", "🐔", "🐑"] },
  { q: "Which animal says MEOW?", a: "🐱", opts: ["🐶", "🐱", "🐭", "🐸"] },
  { q: "Which animal says WOOF?", a: "🐶", opts: ["🐱", "🐶", "🐰", "🐼"] },
  { q: "Which animal says ROAR?", a: "🦁", opts: ["🐯", "🦁", "🐻", "🦊"] },
  { q: "Which animal says RIBBIT?", a: "🐸", opts: ["🐢", "🦎", "🐸", "🐊"] },
  { q: "Which animal says HISS?", a: "🐍", opts: ["🐍", "🦜", "🐊", "🦎"] },
  { q: "Which animal says TWEET?", a: "🐦", opts: ["🦆", "🦅", "🐦", "🦉"] },
  { q: "Which animal says BAA?", a: "🐑", opts: ["🐐", "🐑", "🐄", "🐪"] },
  { q: "Which animal says NEIGH?", a: "🐴", opts: ["🦄", "🐴", "🦓", "🐪"] },
];

export function AnimalSoundsQuiz() {
  const [q, setQ] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const cur = QS[q];

  const pick = (a: string) => {
    if (feedback) return;
    if (a === cur.a) {
      setScore((s) => s + 10);
      setFeedback("✅ Correct!");
    } else setFeedback(`❌ It was ${cur.a}`);
    setTimeout(() => {
      setFeedback(null);
      if (q + 1 >= QS.length) setDone(true);
      else setQ((x) => x + 1);
    }, 900);
  };
  const reset = () => {
    setQ(0);
    setScore(0);
    setDone(false);
    setFeedback(null);
  };

  if (done)
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="text-4xl font-extrabold">🐾 All Done!</div>
        <div className="text-2xl">Score: {score}/100</div>
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 bg-green-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
        >
          Play Again
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="text-xl font-bold">
        Question {q + 1}/10 — Score: {score}
      </div>
      <div className="text-2xl font-extrabold text-center">{cur.q}</div>
      {feedback && <div className="text-2xl font-bold">{feedback}</div>}
      <div className="grid grid-cols-2 gap-6">
        {cur.opts.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => pick(o)}
            className="text-6xl p-4 rounded-3xl bg-yellow-100 hover:bg-yellow-200 border-4 border-yellow-300 cursor-pointer transition-transform hover:scale-110"
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
