import { useState } from "react";

const QS = [
  { q: "🇺🇸", a: "USA", opts: ["USA", "UK", "Canada", "Australia"] },
  { q: "🇬🇧", a: "UK", opts: ["France", "UK", "Germany", "Spain"] },
  { q: "🇯🇵", a: "Japan", opts: ["China", "Korea", "Japan", "Vietnam"] },
  { q: "🇧🇷", a: "Brazil", opts: ["Argentina", "Brazil", "Mexico", "Colombia"] },
  {
    q: "🇦🇺",
    a: "Australia",
    opts: ["New Zealand", "Australia", "Canada", "UK"],
  },
  {
    q: "🇮🇳",
    a: "India",
    opts: ["Pakistan", "India", "Bangladesh", "Sri Lanka"],
  },
  { q: "🇫🇷", a: "France", opts: ["Italy", "Spain", "France", "Belgium"] },
  {
    q: "🇩🇪",
    a: "Germany",
    opts: ["Austria", "Germany", "Switzerland", "Belgium"],
  },
  { q: "🇨🇳", a: "China", opts: ["Japan", "Korea", "China", "Vietnam"] },
  { q: "🇲🇽", a: "Mexico", opts: ["Mexico", "Brazil", "Argentina", "Colombia"] },
];

export function FlagQuiz() {
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
        <div className="text-4xl font-extrabold">🌍 All Done!</div>
        <div className="text-2xl">Score: {score}/100</div>
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
        Question {q + 1}/10 — Score: {score}
      </div>
      <div className="text-2xl font-extrabold">Which country is this flag?</div>
      <div className="text-8xl">{cur.q}</div>
      {feedback && <div className="text-2xl font-bold">{feedback}</div>}
      <div className="grid grid-cols-2 gap-4">
        {cur.opts.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => pick(o)}
            className="px-6 py-4 rounded-2xl font-bold text-xl cursor-pointer bg-blue-100 hover:bg-blue-200 border-4 border-blue-300"
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
