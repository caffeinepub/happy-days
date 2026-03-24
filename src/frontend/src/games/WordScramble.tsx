import { useState } from "react";

const WORDS = [
  "APPLE",
  "TIGER",
  "OCEAN",
  "BRAVE",
  "CROWN",
  "DANCE",
  "EAGLE",
  "FLAME",
  "GRAPE",
  "HEART",
];
const HINTS = [
  "A yummy red fruit",
  "A big striped cat",
  "A huge body of water",
  "Not scared at all",
  "A king wears this",
  "Moving to music",
  "A big soaring bird",
  "Fire's bright light",
  "A purple fruit",
  "Keeps you alive",
];

function scramble(w: string) {
  let s = w;
  while (s === w)
    s = w
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  return s;
}

export function WordScramble() {
  const [idx, setIdx] = useState(0);
  const [scrambled] = useState(() => WORDS.map(scramble));
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  function submit() {
    const correct = input.toUpperCase() === WORDS[idx];
    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= WORDS.length) {
        setDone(true);
        return;
      }
      setIdx((i) => i + 1);
      setInput("");
      setFeedback(null);
    }, 800);
  }

  function restart() {
    setIdx(0);
    setInput("");
    setFeedback(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">🏆</div>
        <h2 className="font-display font-extrabold text-4xl">Done!</h2>
        <p className="font-body text-2xl">
          Score: {score}/{WORDS.length}
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
    <div className="flex flex-col items-center gap-6 py-4 max-w-sm mx-auto">
      <div className="flex gap-6 font-body font-bold text-lg">
        <span>
          Word {idx + 1}/{WORDS.length}
        </span>
        <span className="text-primary">⭐ {score}</span>
      </div>
      <p className="font-body text-muted-foreground text-base">
        Hint: {HINTS[idx]}
      </p>
      <div className="bg-muted rounded-3xl px-8 py-6 text-center">
        <p className="font-display font-extrabold text-5xl tracking-widest text-primary">
          {scrambled[idx]}
        </p>
        <p className="font-body text-sm text-muted-foreground mt-2">
          Unscramble this word!
        </p>
      </div>
      <div className="flex gap-3 w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Type the word..."
          maxLength={10}
          className="flex-1 border-4 border-border rounded-2xl px-4 py-3 font-body text-xl text-center outline-none focus:border-primary uppercase"
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
          {feedback === "correct" ? "✅ Correct!" : `❌ It was ${WORDS[idx]}`}
        </p>
      )}
    </div>
  );
}
