import { useState } from "react";

const EMOJIS = ["⭐", "🍎", "🐱", "🌼", "🔵", "🏆", "🌟", "🐢", "🦊", "🐝"];

function makeRound() {
  const count = 5 + Math.floor(Math.random() * 16);
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  const items = Array.from({ length: count }, (_, i) => ({
    key: i,
    left: 5 + Math.random() * 85,
    top: 5 + Math.random() * 85,
  }));
  return { count, emoji, items };
}

export function CountObjects() {
  const [round, setRound] = useState(makeRound);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);

  function submit() {
    const n = Number.parseInt(input);
    const correct = n === round.count;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= 10) {
        setDone(true);
        return;
      }
      setIdx((i) => i + 1);
      setRound(makeRound());
      setInput("");
      setFeedback(null);
    }, 800);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">🧮</div>
        <h2 className="font-display font-extrabold text-4xl">Done!</h2>
        <p className="font-body text-2xl">Score: {score}/10</p>
        <button
          type="button"
          onClick={() => {
            setIdx(0);
            setScore(0);
            setRound(makeRound());
            setInput("");
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
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex gap-6 font-body font-bold text-lg">
        <span>Round {idx + 1}/10</span>
        <span className="text-primary">⭐ {score}</span>
      </div>
      <p className="font-display font-bold text-xl">
        How many {round.emoji} do you see?
      </p>
      <div
        className="relative w-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl border-4 border-border"
        style={{ height: 280 }}
      >
        {round.items.map((item) => (
          <span
            key={item.key}
            className="absolute text-3xl"
            style={{
              left: `${item.left}%`,
              top: `${item.top}%`,
              transform: "translate(-50%,-50%)",
            }}
          >
            {round.emoji}
          </span>
        ))}
      </div>
      <div className="flex gap-3 w-full max-w-xs">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Count..."
          className="flex-1 border-4 border-border rounded-2xl px-4 py-3 font-body text-xl text-center outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={submit}
          className="px-6 py-3 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
        >
          ✓
        </button>
      </div>
      {feedback && (
        <p
          className={`font-display font-extrabold text-2xl ${feedback === "correct" ? "text-green-500" : "text-red-500"}`}
        >
          {feedback === "correct" ? "✅ Correct!" : `❌ It was ${round.count}!`}
        </p>
      )}
    </div>
  );
}
