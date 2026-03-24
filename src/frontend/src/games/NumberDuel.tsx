import { useEffect, useRef, useState } from "react";

type Op = "+" | "-" | "×";

function makeQuestion(): { q: string; answer: number } {
  const ops: Op[] = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  let answer = 0;
  if (op === "+") answer = a + b;
  else if (op === "-") answer = a - b;
  else answer = a * b;
  return { q: `${a} ${op} ${b} = ?`, answer };
}

const ROUNDS = 10;

export function NumberDuel() {
  const [round, setRound] = useState(0);
  const [q, setQ] = useState(makeQuestion);
  const [p1Input, setP1Input] = useState("");
  const [p2Input, setP2Input] = useState("");
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [roundWinner, setRoundWinner] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const p1Ref = useRef<HTMLInputElement>(null);

  function nextRound() {
    setRound((r) => r + 1);
    setQ(makeQuestion());
    setP1Input("");
    setP2Input("");
    setRoundWinner(null);
    setTimeout(() => p1Ref.current?.focus(), 100);
  }

  useEffect(() => {
    if (round >= ROUNDS) {
      setDone(true);
    }
  }, [round]);

  function handleP1Change(val: string) {
    setP1Input(val);
    if (roundWinner) return;
    if (Number(val) === q.answer) {
      setRoundWinner("Player 1");
      setP1Score((s) => s + 1);
      setTimeout(nextRound, 1200);
    }
  }

  function handleP2Change(val: string) {
    setP2Input(val);
    if (roundWinner) return;
    if (Number(val) === q.answer) {
      setRoundWinner("Player 2");
      setP2Score((s) => s + 1);
      setTimeout(nextRound, 1200);
    }
  }

  function reset() {
    setRound(0);
    setQ(makeQuestion());
    setP1Input("");
    setP2Input("");
    setP1Score(0);
    setP2Score(0);
    setRoundWinner(null);
    setDone(false);
  }

  const gameWinner = done
    ? p1Score > p2Score
      ? "Player 1"
      : p2Score > p1Score
        ? "Player 2"
        : "Tie"
    : null;

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h2 className="font-display font-extrabold text-2xl">🔢 Number Duel</h2>
      <div className="flex gap-8 font-body font-bold text-xl">
        <span className="text-blue-600">P1: {p1Score}</span>
        <span className="text-gray-400">
          Round {Math.min(round + 1, ROUNDS)}/{ROUNDS}
        </span>
        <span className="text-orange-500">P2: {p2Score}</span>
      </div>
      {!done ? (
        <>
          <div className="text-5xl font-display font-extrabold text-foreground bg-yellow-100 rounded-3xl px-8 py-4 border-4 border-yellow-300">
            {q.q}
          </div>
          {roundWinner && (
            <div className="text-2xl font-display font-extrabold text-green-600">
              ✅ {roundWinner} got it!
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="p1-answer"
                className="font-body font-bold text-blue-600"
              >
                Player 1
              </label>
              <input
                id="p1-answer"
                ref={p1Ref}
                type="number"
                value={p1Input}
                onChange={(e) => handleP1Change(e.target.value)}
                className="border-4 border-blue-300 rounded-2xl px-4 py-3 text-2xl font-display font-bold w-32 text-center"
                disabled={!!roundWinner}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="p2-answer"
                className="font-body font-bold text-orange-500"
              >
                Player 2
              </label>
              <input
                id="p2-answer"
                type="number"
                value={p2Input}
                onChange={(e) => handleP2Change(e.target.value)}
                className="border-4 border-orange-300 rounded-2xl px-4 py-3 text-2xl font-display font-bold w-32 text-center"
                disabled={!!roundWinner}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="text-center flex flex-col gap-4">
          <div className="text-3xl font-display font-extrabold">
            {gameWinner === "Tie" ? "🤝 It's a Tie!" : `🏆 ${gameWinner} Wins!`}
          </div>
          <div className="font-body text-lg">
            Final: P1 {p1Score} – P2 {p2Score}
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
