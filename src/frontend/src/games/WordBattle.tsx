import { useEffect, useRef, useState } from "react";

const WORDS = [
  "TIGER",
  "APPLE",
  "GREEN",
  "HORSE",
  "OCEAN",
  "BRAVE",
  "CLOUD",
  "DAISY",
  "EAGLE",
  "FLUTE",
  "GRAPE",
  "HEART",
  "IVORY",
  "JOLLY",
  "KITE",
];

function scramble(w: string) {
  const a = w.split("");
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.join("");
}

export function WordBattle() {
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [phase, setPhase] = useState<"p1" | "p2" | "result" | "done">("p1");
  const [input, setInput] = useState("");
  const [timer, setTimer] = useState(10);
  const [p1correct, setP1correct] = useState(false);
  const [scrambled, setScrambled] = useState("");
  const word = WORDS[round % WORDS.length];
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef = useRef<((correct: boolean) => void) | null>(null);

  useEffect(() => {
    setScrambled(scramble(word));
  }, [word]);

  const advance = (correct: boolean) => {
    clearInterval(timerRef.current!);
    if (phase === "p1") {
      setP1correct(correct);
      if (correct)
        setScores((s) => {
          const n = [...s];
          n[0]++;
          return n;
        });
      setInput("");
      setPhase("p2");
    } else {
      if (correct)
        setScores((s) => {
          const n = [...s];
          n[1]++;
          return n;
        });
      setInput("");
      setPhase("result");
    }
  };

  useEffect(() => {
    advanceRef.current = advance;
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: phase controls timer lifecycle
  useEffect(() => {
    if (phase === "result" || phase === "done") return;
    setTimer(10);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          advanceRef.current?.(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase]);

  const submit = () => advance(input.trim().toUpperCase() === word);
  const next = () => {
    if (round + 1 >= 10) setPhase("done");
    else {
      setRound((r) => r + 1);
      setPhase("p1");
    }
  };
  const reset = () => {
    setRound(0);
    setScores([0, 0]);
    setPhase("p1");
    setInput("");
  };

  if (phase === "done") {
    const winner =
      scores[0] > scores[1]
        ? "Player 1"
        : scores[1] > scores[0]
          ? "Player 2"
          : "Tie";
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="text-4xl font-display font-extrabold">Game Over!</div>
        <div className="text-2xl">
          {winner === "Tie" ? "It's a Tie! 🤝" : `🏆 ${winner} Wins!`}
        </div>
        <div className="text-xl">
          🔵 P1: {scores[0]} | 🟠 P2: {scores[1]}
        </div>
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 bg-purple-500 text-white rounded-2xl font-bold text-lg cursor-pointer"
        >
          Play Again
        </button>
      </div>
    );
  }
  if (phase === "result") {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="text-3xl font-bold">Round {round + 1} Done!</div>
        <div className="text-xl">
          The word was: <strong>{word}</strong>
        </div>
        <div className="text-lg">🔵 P1: {p1correct ? "✅" : "❌"}</div>
        <div className="text-lg">
          Score: P1 {scores[0]} — P2 {scores[1]}
        </div>
        <button
          type="button"
          onClick={next}
          className="px-6 py-3 bg-green-500 text-white rounded-2xl font-bold text-lg cursor-pointer"
        >
          {round + 1 >= 10 ? "See Results" : "Next Round"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="text-2xl font-extrabold">
        Round {round + 1}/10 — {phase === "p1" ? "🔵 Player 1" : "🟠 Player 2"}
        's Turn
      </div>
      <div className="text-6xl font-mono font-bold tracking-widest bg-yellow-100 px-8 py-4 rounded-2xl">
        {scrambled}
      </div>
      <div className="text-xl">Unscramble this word! ⏱️ {timer}s</div>
      <input
        className="border-4 border-gray-300 rounded-2xl px-4 py-3 text-2xl font-bold w-64 text-center uppercase"
        value={input}
        onChange={(e) => setInput(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        maxLength={10}
      />
      <button
        type="button"
        onClick={submit}
        className="px-6 py-3 bg-purple-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
      >
        Submit
      </button>
      <div className="text-lg">
        Score: 🔵 P1 {scores[0]} — P2 {scores[1]} 🟠
      </div>
    </div>
  );
}
