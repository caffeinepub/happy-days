import { useCallback, useEffect, useRef, useState } from "react";

const QUESTIONS = [
  {
    q: "What is the largest planet?",
    opts: ["Earth", "Mars", "Jupiter", "Saturn"],
    ans: 2,
  },
  {
    q: "How many sides does a hexagon have?",
    opts: ["5", "6", "7", "8"],
    ans: 1,
  },
  {
    q: "What color do you get mixing blue and yellow?",
    opts: ["Purple", "Orange", "Green", "Brown"],
    ans: 2,
  },
  {
    q: "Which animal is the fastest on land?",
    opts: ["Lion", "Horse", "Cheetah", "Leopard"],
    ans: 2,
  },
  { q: "How many continents are there?", opts: ["5", "6", "7", "8"], ans: 2 },
  { q: "What is 8 × 7?", opts: ["54", "56", "58", "64"], ans: 1 },
  {
    q: "Which planet is closest to the Sun?",
    opts: ["Venus", "Earth", "Mercury", "Mars"],
    ans: 2,
  },
  {
    q: "How many legs does a spider have?",
    opts: ["6", "8", "10", "12"],
    ans: 1,
  },
  {
    q: "What is the capital of France?",
    opts: ["London", "Berlin", "Madrid", "Paris"],
    ans: 3,
  },
  {
    q: "Which gas do plants absorb?",
    opts: ["Oxygen", "Nitrogen", "CO2", "Helium"],
    ans: 2,
  },
];

export function TriviaBattle() {
  const [qIdx, setQIdx] = useState(0);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [feedback, setFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const locked = useRef(false);
  const qIdxRef = useRef(qIdx);
  const scoresRef = useRef(scores);
  const gameOverRef = useRef(gameOver);

  qIdxRef.current = qIdx;
  scoresRef.current = scores;
  gameOverRef.current = gameOver;

  const answer = useCallback((player: number, optIdx: number) => {
    if (locked.current || gameOverRef.current) return;
    const currentQ = QUESTIONS[qIdxRef.current];
    if (optIdx !== currentQ.ans) return;
    locked.current = true;
    const newScores = { ...scoresRef.current };
    if (player === 1) {
      newScores.p1++;
      setFeedback("🏆 Player 1 answered first!");
    } else {
      newScores.p2++;
      setFeedback("🏆 Player 2 answered first!");
    }
    setScores(newScores);
    if (qIdxRef.current >= QUESTIONS.length - 1) {
      setGameOver(true);
      return;
    }
    setTimeout(() => {
      setQIdx((i) => i + 1);
      setFeedback("");
      locked.current = false;
    }, 1200);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const p1Keys: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3 };
      const p2Keys: Record<string, number> = {
        q: 0,
        w: 1,
        e: 2,
        r: 3,
        Q: 0,
        W: 1,
        E: 2,
        R: 3,
      };
      if (e.key in p1Keys) answer(1, p1Keys[e.key]);
      if (e.key in p2Keys) answer(2, p2Keys[e.key]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [answer]);

  function restart() {
    setQIdx(0);
    setScores({ p1: 0, p2: 0 });
    setFeedback("");
    setGameOver(false);
    locked.current = false;
  }

  const q = QUESTIONS[qIdx];
  const winnerText =
    scores.p1 > scores.p2
      ? "🏆 Player 1 Wins!"
      : scores.p2 > scores.p1
        ? "🏆 Player 2 Wins!"
        : "🤝 It's a Tie!";

  return (
    <div className="flex flex-col items-center gap-5 p-4">
      <div className="flex gap-8 text-xl font-extrabold">
        <span className="text-blue-600">🔵 P1: {scores.p1}</span>
        <span className="text-gray-500">Q {qIdx + 1}/10</span>
        <span className="text-red-600">P2: {scores.p2} 🔴</span>
      </div>
      {!gameOver ? (
        <>
          <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl px-8 py-6 border-4 border-indigo-300 shadow-xl text-center max-w-lg">
            <div className="text-2xl font-extrabold text-indigo-700 mb-4">
              {q.q}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {q.opts.map((opt, i) => (
                <div
                  key={opt}
                  className="bg-white rounded-xl p-3 border-2 border-indigo-200 shadow text-center"
                >
                  <div className="text-xs text-gray-400 mb-1">
                    P1: {i + 1} | P2: {["Q", "W", "E", "R"][i]}
                  </div>
                  <div className="font-bold">{opt}</div>
                </div>
              ))}
            </div>
          </div>
          {feedback && (
            <div className="text-2xl font-bold text-green-600 animate-bounce">
              {feedback}
            </div>
          )}
          <p className="text-sm text-gray-400">
            P1: press 1/2/3/4 | P2: press Q/W/E/R
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
            className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
