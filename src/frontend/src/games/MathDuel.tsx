import { useEffect, useRef, useState } from "react";

function genQuestion() {
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * 12) + 1;
  let b = Math.floor(Math.random() * 12) + 1;
  let answer: number;
  if (op === "+") {
    answer = a + b;
  } else if (op === "-") {
    if (a < b) [a, b] = [b, a];
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 9) + 1;
    b = Math.floor(Math.random() * 9) + 1;
    answer = a * b;
  }
  return { question: `${a} ${op} ${b} = ?`, answer };
}

export function MathDuel() {
  const [q, setQ] = useState(genQuestion);
  const [round, setRound] = useState(1);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [p1Input, setP1Input] = useState("");
  const [p2Input, setP2Input] = useState("");
  const [feedback, setFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const p1Ref = useRef<HTMLInputElement>(null);
  const p2Ref = useRef<HTMLInputElement>(null);
  const locked = useRef(false);

  function checkAnswer(val: string, player: number) {
    if (locked.current) return;
    const num = Number.parseInt(val);
    if (Number.isNaN(num) || num !== q.answer) return;
    locked.current = true;
    const newScores = { ...scores };
    if (player === 1) {
      newScores.p1++;
      setFeedback("🎉 Player 1 got it!");
    } else {
      newScores.p2++;
      setFeedback("🎉 Player 2 got it!");
    }
    setScores(newScores);
    if (round >= 10) {
      setGameOver(true);
    } else {
      setTimeout(() => {
        setQ(genQuestion());
        setRound((r) => r + 1);
        setP1Input("");
        setP2Input("");
        setFeedback("");
        locked.current = false;
        p1Ref.current?.focus();
      }, 1200);
    }
  }

  useEffect(() => {
    p1Ref.current?.focus();
  }, []);

  function restart() {
    setQ(genQuestion());
    setRound(1);
    setScores({ p1: 0, p2: 0 });
    setP1Input("");
    setP2Input("");
    setFeedback("");
    setGameOver(false);
    locked.current = false;
  }

  const winnerText = gameOver
    ? scores.p1 > scores.p2
      ? "🏆 Player 1 Wins!"
      : scores.p2 > scores.p1
        ? "🏆 Player 2 Wins!"
        : "🤝 It's a Tie!"
    : "";

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex gap-8 text-xl font-extrabold">
        <span className="text-blue-600">🔵 P1: {scores.p1}</span>
        <span className="text-gray-500">Round {round}/10</span>
        <span className="text-red-600">P2: {scores.p2} 🔴</span>
      </div>
      {!gameOver ? (
        <>
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl px-12 py-8 border-4 border-orange-300 shadow-xl text-center">
            <div className="text-5xl font-extrabold text-orange-700">
              {q.question}
            </div>
          </div>
          {feedback && (
            <div className="text-2xl font-bold text-green-600 animate-bounce">
              {feedback}
            </div>
          )}
          <div className="flex gap-8">
            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="p1-answer"
                className="font-bold text-blue-600 text-lg"
              >
                Player 1
              </label>
              <input
                id="p1-answer"
                ref={p1Ref}
                type="number"
                value={p1Input}
                onChange={(e) => {
                  setP1Input(e.target.value);
                  checkAnswer(e.target.value, 1);
                }}
                className="w-28 text-center text-2xl font-bold border-4 border-blue-400 rounded-xl p-2 focus:outline-none focus:border-blue-600"
                placeholder="?"
                disabled={gameOver}
                data-ocid="mathduel.p1.input"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="p2-answer"
                className="font-bold text-red-600 text-lg"
              >
                Player 2
              </label>
              <input
                id="p2-answer"
                ref={p2Ref}
                type="number"
                value={p2Input}
                onChange={(e) => {
                  setP2Input(e.target.value);
                  checkAnswer(e.target.value, 2);
                }}
                className="w-28 text-center text-2xl font-bold border-4 border-red-400 rounded-xl p-2 focus:outline-none focus:border-red-600"
                placeholder="?"
                disabled={gameOver}
                data-ocid="mathduel.p2.input"
              />
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Type the correct answer first to win the round!
          </p>
        </>
      ) : (
        <div className="text-center">
          <div className="text-4xl font-extrabold mb-4">{winnerText}</div>
          <div className="text-xl mb-4">
            Final: P1={scores.p1} vs P2={scores.p2}
          </div>
          <button
            type="button"
            onClick={restart}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
