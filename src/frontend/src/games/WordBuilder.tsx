import { useEffect, useState } from "react";

const WORDS = [
  "CAT",
  "DOG",
  "SUN",
  "FUN",
  "BIG",
  "RUN",
  "HOP",
  "FLY",
  "SKY",
  "BALL",
  "FISH",
  "BIRD",
  "CAKE",
  "STAR",
  "MOON",
  "TREE",
  "FROG",
  "DUCK",
  "HAPPY",
  "SMILE",
  "CLOUD",
  "GRAPE",
  "BREAD",
];

const ROUNDS = 10;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function makeRound(word: string) {
  const letters = shuffle(
    word.split("").map((l, i) => ({ l, id: `${l}${i}` })),
  );
  return { word, letters };
}

export function WordBuilder() {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [{ word, letters }, setRound0] = useState(() =>
    makeRound(WORDS[Math.floor(Math.random() * WORDS.length)]),
  );
  const [built, setBuilt] = useState<string[]>([]);
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [done, setDone] = useState(false);

  function clickLetter(id: string, letter: string) {
    if (usedIds.includes(id) || flash) return;
    setBuilt((b) => [...b, letter]);
    setUsedIds((u) => [...u, id]);
  }

  useEffect(() => {
    if (built.length === word.length) {
      const attempt = built.join("");
      if (attempt === word) {
        setFlash("correct");
        setScore((s) => s + 1);
      } else {
        setFlash("wrong");
      }
      setTimeout(() => {
        setFlash(null);
        setBuilt([]);
        setUsedIds([]);
        const nextRound = round + 1;
        if (nextRound >= ROUNDS) {
          setDone(true);
        } else {
          setRound(nextRound);
          const word2 = WORDS[Math.floor(Math.random() * WORDS.length)];
          setRound0(makeRound(word2));
        }
      }, 900);
    }
  }, [built, word, round]);

  function reset() {
    setRound(0);
    setScore(0);
    setBuilt([]);
    setUsedIds([]);
    setFlash(null);
    setDone(false);
    setRound0(makeRound(WORDS[Math.floor(Math.random() * WORDS.length)]));
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h2 className="font-display font-extrabold text-2xl">📝 Word Builder</h2>
      {!done ? (
        <>
          <div className="flex gap-6 font-body font-bold text-lg">
            <span>
              Round {round + 1}/{ROUNDS}
            </span>
            <span>⭐ Score: {score}</span>
          </div>
          <p className="font-body text-muted-foreground text-sm">
            Click letters in the right order to spell the word!
          </p>
          <div className="flex gap-2 min-h-[52px] items-center">
            {word.split("").map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-size word display slots
                key={`slot-${i}`}
                className={`w-11 h-11 rounded-xl border-4 flex items-center justify-center font-display font-extrabold text-xl ${
                  flash === "correct"
                    ? "bg-green-400 border-green-600"
                    : flash === "wrong"
                      ? "bg-red-400 border-red-600"
                      : built[i]
                        ? "bg-yellow-200 border-yellow-400"
                        : "bg-gray-100 border-gray-200"
                }`}
              >
                {built[i] ?? ""}
              </div>
            ))}
          </div>
          {flash === "correct" && (
            <div className="text-2xl font-display font-extrabold text-green-600">
              ✅ Correct!
            </div>
          )}
          {flash === "wrong" && (
            <div className="text-2xl font-display font-extrabold text-red-500">
              ❌ Try again!
            </div>
          )}
          <div className="flex flex-wrap gap-3 justify-center max-w-xs">
            {letters.map(({ l, id }) => (
              <button
                key={id}
                type="button"
                onClick={() => clickLetter(id, l)}
                disabled={usedIds.includes(id) || !!flash}
                className={`w-12 h-12 rounded-xl border-4 font-display font-extrabold text-xl transition-all ${
                  usedIds.includes(id)
                    ? "bg-gray-200 border-gray-300 opacity-40"
                    : "bg-purple-200 border-purple-400 hover:bg-purple-300 cursor-pointer"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setBuilt([]);
              setUsedIds([]);
            }}
            className="text-sm text-muted-foreground underline"
          >
            Clear
          </button>
        </>
      ) : (
        <div className="text-center flex flex-col gap-4">
          <div className="text-4xl">🎉</div>
          <div className="text-2xl font-display font-extrabold">
            Final Score: {score}/{ROUNDS}
          </div>
          <div className="font-body text-muted-foreground">
            {score >= 8
              ? "Word Master! 🌟"
              : score >= 5
                ? "Great job! 👍"
                : "Keep practicing!"}
          </div>
          <button
            type="button"
            onClick={reset}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-body font-bold"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
