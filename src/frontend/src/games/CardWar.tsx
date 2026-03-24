import { useState } from "react";

const CARD_VALUES = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
const SUITS = ["♠", "♥", "♦", "♣"];
const SUIT_COLORS: Record<string, string> = {
  "♠": "#1a1a2e",
  "♥": "#e74c3c",
  "♦": "#e74c3c",
  "♣": "#1a1a2e",
};

function drawCard() {
  return {
    value: CARD_VALUES[Math.floor(Math.random() * CARD_VALUES.length)],
    suit: SUITS[Math.floor(Math.random() * SUITS.length)],
  };
}

export function CardWar() {
  const [round, setRound] = useState(1);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [p1Card, setP1Card] = useState<{ value: string; suit: string } | null>(
    null,
  );
  const [p2Card, setP2Card] = useState<{ value: string; suit: string } | null>(
    null,
  );
  const [result, setResult] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [bothDrawn, setBothDrawn] = useState(false);
  const [p1Drew, setP1Drew] = useState(false);
  const [p2Drew, setP2Drew] = useState(false);

  function drawP1() {
    if (p1Drew || bothDrawn) return;
    const card = drawCard();
    setP1Card(card);
    setP1Drew(true);
    if (p2Drew) reveal(card, p2Card!);
  }

  function drawP2() {
    if (p2Drew || bothDrawn) return;
    const card = drawCard();
    setP2Card(card);
    setP2Drew(true);
    if (p1Drew) reveal(p1Card!, card);
  }

  function reveal(
    c1: { value: string; suit: string },
    c2: { value: string; suit: string },
  ) {
    setBothDrawn(true);
    const v1 = CARD_VALUES.indexOf(c1.value);
    const v2 = CARD_VALUES.indexOf(c2.value);
    const newScores = { ...scores };
    if (v1 > v2) {
      newScores.p1++;
      setResult("🏆 Player 1 wins this round!");
    } else if (v2 > v1) {
      newScores.p2++;
      setResult("🏆 Player 2 wins this round!");
    } else setResult("🤝 It's a tie!");
    setScores(newScores);
    if (round >= 10) setGameOver(true);
  }

  function nextRound() {
    setP1Card(null);
    setP2Card(null);
    setResult("");
    setBothDrawn(false);
    setP1Drew(false);
    setP2Drew(false);
    setRound((r) => r + 1);
  }

  function restart() {
    setRound(1);
    setScores({ p1: 0, p2: 0 });
    setP1Card(null);
    setP2Card(null);
    setResult("");
    setGameOver(false);
    setBothDrawn(false);
    setP1Drew(false);
    setP2Drew(false);
  }

  function CardFace({
    card,
  }: { card: { value: string; suit: string } | null }) {
    if (!card)
      return (
        <div className="w-24 h-36 bg-blue-800 rounded-xl border-2 border-blue-400 flex items-center justify-center text-4xl">
          🂠
        </div>
      );
    const color = SUIT_COLORS[card.suit];
    return (
      <div
        className="w-24 h-36 bg-white rounded-xl border-4 border-gray-300 shadow-lg flex flex-col items-center justify-center"
        style={{ color }}
      >
        <div className="text-3xl font-extrabold">{card.value}</div>
        <div className="text-2xl">{card.suit}</div>
      </div>
    );
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
          <div className="flex gap-12 items-center">
            <div className="flex flex-col items-center gap-3">
              <CardFace card={p1Drew ? p1Card : null} />
              <button
                type="button"
                onClick={drawP1}
                disabled={p1Drew || bothDrawn}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold disabled:opacity-50"
                data-ocid="cardwar.p1.button"
              >
                Player 1 Draw
              </button>
            </div>
            <div className="text-4xl">⚔️</div>
            <div className="flex flex-col items-center gap-3">
              <CardFace card={p2Drew ? p2Card : null} />
              <button
                type="button"
                onClick={drawP2}
                disabled={p2Drew || bothDrawn}
                className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold disabled:opacity-50"
                data-ocid="cardwar.p2.button"
              >
                Player 2 Draw
              </button>
            </div>
          </div>
          {result && (
            <div className="text-2xl font-bold text-green-600">{result}</div>
          )}
          {bothDrawn && !gameOver && (
            <button
              type="button"
              onClick={nextRound}
              className="px-6 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600"
            >
              Next Round →
            </button>
          )}
        </>
      ) : (
        <div className="text-center">
          <div className="text-4xl font-extrabold mb-2">{winnerText}</div>
          <div className="text-xl mb-4">
            Final: P1={scores.p1} vs P2={scores.p2}
          </div>
          <button
            type="button"
            onClick={restart}
            className="px-6 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
