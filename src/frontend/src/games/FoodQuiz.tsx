import { useState } from "react";

const QS = [
  { q: "Which is a fruit? 🍎", a: "🍎", opts: ["🍎", "🥕", "🥦", "🧅"] },
  { q: "Which is healthy to eat?", a: "🥦", opts: ["🍰", "🍟", "🥦", "🍭"] },
  {
    q: "What is this? 🍌",
    a: "Banana",
    opts: ["Apple", "Banana", "Mango", "Lemon"],
  },
  {
    q: "Which food gives you energy?",
    a: "🍌",
    opts: ["🍭", "🍌", "🥤", "🍪"],
  },
  { q: "Which is a vegetable?", a: "🥕", opts: ["🍊", "🍇", "🥕", "🍓"] },
  {
    q: "What color is a ripe banana?",
    a: "Yellow",
    opts: ["Red", "Yellow", "Blue", "Green"],
  },
  { q: "Which animal gives us milk?", a: "🐄", opts: ["🐔", "🐄", "🐠", "🐇"] },
  { q: "Which is a breakfast food?", a: "🥣", opts: ["🍕", "🍔", "🥣", "🌮"] },
  {
    q: "What do bees make?",
    a: "Honey",
    opts: ["Jam", "Honey", "Butter", "Sugar"],
  },
  {
    q: "Which fruit is red and has seeds?",
    a: "🍓",
    opts: ["🍋", "🍊", "🍓", "🍇"],
  },
];

export function FoodQuiz() {
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
    } else setFeedback(`❌ It was ${String(cur.a)}`);
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
        <div className="text-4xl font-extrabold">🍽️ All Done!</div>
        <div className="text-2xl">Score: {score}/100</div>
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
        Question {q + 1}/10 — Score: {score}
      </div>
      <div className="text-2xl font-extrabold text-center">{cur.q}</div>
      {feedback && <div className="text-2xl font-bold">{feedback}</div>}
      <div className="grid grid-cols-2 gap-4">
        {cur.opts.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => pick(o)}
            className="px-6 py-4 rounded-2xl font-bold text-2xl cursor-pointer bg-orange-100 hover:bg-orange-200 border-4 border-orange-300"
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
