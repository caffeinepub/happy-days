import { useEffect, useRef, useState } from "react";

const WORDS = [
  "rainbow",
  "butterfly",
  "elephant",
  "treasure",
  "adventure",
  "kingdom",
  "dragon",
  "wizard",
  "pirate",
  "jungle",
  "volcano",
  "penguin",
  "dolphin",
  "mountain",
  "starfish",
];

export function WordRace() {
  const [wordIdx, setWordIdx] = useState(0);
  const [round, setRound] = useState(1);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [p1Input, setP1Input] = useState("");
  const [p2Input, setP2Input] = useState("");
  const [feedback, setFeedback] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const locked = useRef(false);
  const p1Ref = useRef<HTMLInputElement>(null);

  const word = WORDS[wordIdx % WORDS.length];

  function checkWord(val: string, player: number) {
    if (locked.current || val.toLowerCase() !== word) return;
    locked.current = true;
    const newScores = { ...scores };
    if (player === 1) {
      newScores.p1++;
      setFeedback("⚡ Player 1 wins the round!");
    } else {
      newScores.p2++;
      setFeedback("⚡ Player 2 wins the round!");
    }
    setScores(newScores);
    if (round >= 10) {
      setGameOver(true);
      return;
    }
    setTimeout(() => {
      setWordIdx((i) => i + 1);
      setRound((r) => r + 1);
      setP1Input("");
      setP2Input("");
      setFeedback("");
      locked.current = false;
      p1Ref.current?.focus();
    }, 1200);
  }

  useEffect(() => {
    p1Ref.current?.focus();
  }, []);

  function restart() {
    setWordIdx(0);
    setRound(1);
    setScores({ p1: 0, p2: 0 });
    setP1Input("");
    setP2Input("");
    setFeedback("");
    setGameOver(false);
    locked.current = false;
  }

  const winnerText =
    scores.p1 > scores.p2
      ? "🏆 Player 1 Wins!"
      : scores.p2 > scores.p1
        ? "🏆 Player 2 Wins!"
        : "🤝 It's a Tie!";

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex gap-8 text-xl font-extrabold">
        <span className="text-blue-600">🔵 P1: {scores.p1}</span>
        <span className="text-gray-500">Round {round}/10</span>
        <span className="text-red-600">P2: {scores.p2} 🔴</span>
      </div>
      {!gameOver ? (
        <>
          <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-3xl px-12 py-8 border-4 border-teal-300 shadow-xl text-center">
            <p className="text-sm text-gray-500 mb-2">Type this word first:</p>
            <div className="text-5xl font-extrabold text-teal-700 tracking-widest">
              {word}
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
                htmlFor="wr-p1"
                className="font-bold text-blue-600 text-lg"
              >
                Player 1
              </label>
              <input
                id="wr-p1"
                ref={p1Ref}
                type="text"
                value={p1Input}
                onChange={(e) => {
                  setP1Input(e.target.value);
                  checkWord(e.target.value, 1);
                }}
                className="w-36 text-center text-xl font-bold border-4 border-blue-400 rounded-xl p-2 focus:outline-none focus:border-blue-600"
                placeholder="type here"
                disabled={gameOver}
                data-ocid="wordrace.p1.input"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <label htmlFor="wr-p2" className="font-bold text-red-600 text-lg">
                Player 2
              </label>
              <input
                id="wr-p2"
                type="text"
                value={p2Input}
                onChange={(e) => {
                  setP2Input(e.target.value);
                  checkWord(e.target.value, 2);
                }}
                className="w-36 text-center text-xl font-bold border-4 border-red-400 rounded-xl p-2 focus:outline-none focus:border-red-600"
                placeholder="type here"
                disabled={gameOver}
                data-ocid="wordrace.p2.input"
              />
            </div>
          </div>
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
            className="px-6 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
