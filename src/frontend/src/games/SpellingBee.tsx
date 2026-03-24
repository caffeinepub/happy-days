import { useState } from "react";

const WORDS = [
  { word: "CAT", hint: "A furry pet that says meow" },
  { word: "DOG", hint: "Man's best friend, loves to fetch" },
  { word: "BEAR", hint: "A big fluffy animal that hibernates" },
  { word: "FISH", hint: "Swims in the ocean or pond" },
  { word: "DUCK", hint: "A bird that quacks" },
  { word: "FROG", hint: "Jumps and lives near water" },
  { word: "WOLF", hint: "Howls at the moon" },
  { word: "CRAB", hint: "Has claws and walks sideways" },
  { word: "DEER", hint: "Has antlers and runs fast" },
  { word: "BIRD", hint: "Has wings and flies high" },
];

export function SpellingBee() {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [done, setDone] = useState(false);

  const current = WORDS[idx];
  const [letters] = useState(() =>
    WORDS.map((w) => [...w.word].sort(() => Math.random() - 0.5)),
  );

  function addLetter(l: string, li: number) {
    if (typed.includes(`${l}-${li}`)) return;
    setTyped((t) => [...t, `${l}-${li}`]);
  }

  function removeLast() {
    setTyped((t) => t.slice(0, -1));
  }

  function submit() {
    const word = typed.map((t) => t.split("-")[0]).join("");
    const correct = word === current.word;
    setFeedback(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= WORDS.length) {
        setDone(true);
        return;
      }
      setIdx((i) => i + 1);
      setTyped([]);
      setFeedback(null);
    }, 800);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">🐝</div>
        <h2 className="font-display font-extrabold text-4xl">Great job!</h2>
        <p className="font-body text-2xl">
          Score: {score}/{WORDS.length}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-8 py-4 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
        >
          Play Again!
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 py-4 max-w-sm mx-auto">
      <div className="flex gap-6 font-body font-bold text-lg">
        <span>
          Word {idx + 1}/{WORDS.length}
        </span>
        <span className="text-primary">⭐ {score}</span>
      </div>
      <div className="bg-yellow-50 rounded-2xl p-4 text-center border-4 border-border w-full">
        <p className="text-4xl mb-2">🐝</p>
        <p className="font-body text-muted-foreground">{current.hint}</p>
      </div>
      <div className="flex gap-2 min-h-[3rem] items-center bg-muted rounded-2xl px-4 py-2 w-full justify-center">
        {typed.length ? (
          typed.map((t) => (
            <span
              key={t}
              className="font-display font-extrabold text-2xl text-primary"
            >
              {t.split("-")[0]}
            </span>
          ))
        ) : (
          <span className="text-muted-foreground font-body">
            Build the word!
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {letters[idx].map((l, li) => (
          <button
            // biome-ignore lint/suspicious/noArrayIndexKey: letter slots are positional
            key={`${l}-${li}`}
            type="button"
            onClick={() => addLetter(l, li)}
            disabled={typed.includes(`${l}-${li}`)}
            className="w-12 h-12 rounded-xl border-4 border-border font-display font-extrabold text-xl cursor-pointer disabled:opacity-30 bg-white hover:bg-primary hover:text-white transition-colors"
          >
            {l}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={removeLast}
          className="px-4 py-2 rounded-xl bg-muted border-2 border-border font-body font-bold cursor-pointer"
        >
          ⌫
        </button>
        <button
          type="button"
          onClick={submit}
          className="px-6 py-2 rounded-xl bg-primary text-white font-body font-bold cursor-pointer"
        >
          Check!
        </button>
        <button
          type="button"
          onClick={() => setTyped([])}
          className="px-4 py-2 rounded-xl bg-muted border-2 border-border font-body font-bold cursor-pointer"
        >
          Clear
        </button>
      </div>
      {feedback && (
        <p
          className={`font-display font-extrabold text-2xl ${feedback === "correct" ? "text-green-500" : "text-red-500"}`}
        >
          {feedback === "correct" ? "✅ Correct!" : `❌ It was ${current.word}`}
        </p>
      )}
    </div>
  );
}
