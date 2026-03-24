import { useEffect, useState } from "react";

const EMOJIS = ["🦊", "🐼", "🦄", "🐸", "🦋", "🐢", "🦁", "🐬"];

function makeCards() {
  return [...EMOJIS, ...EMOJIS]
    .sort(() => Math.random() - 0.5)
    .map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }));
}

export function EmojiPairs() {
  const [cards, setCards] = useState(makeCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (selected.length === 2) {
      const [a, b] = selected;
      setMoves((m) => m + 1);
      if (cards[a].emoji === cards[b].emoji) {
        setCards((c) =>
          c.map((card, i) =>
            i === a || i === b ? { ...card, matched: true } : card,
          ),
        );
        setSelected([]);
        if (cards.filter((c) => !c.matched).length === 2) setDone(true);
      } else {
        const t = setTimeout(() => {
          setCards((c) =>
            c.map((card, i) =>
              i === a || i === b ? { ...card, flipped: false } : card,
            ),
          );
          setSelected([]);
        }, 800);
        return () => clearTimeout(t);
      }
    }
  }, [selected, cards]);

  function flip(i: number) {
    if (selected.length === 2 || cards[i].flipped || cards[i].matched) return;
    setCards((c) =>
      c.map((card, idx) => (idx === i ? { ...card, flipped: true } : card)),
    );
    setSelected((s) => [...s, i]);
  }

  function restart() {
    setCards(makeCards());
    setSelected([]);
    setMoves(0);
    setDone(false);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">🎉</div>
        <h2 className="font-display font-extrabold text-4xl">You win!</h2>
        <p className="font-body text-2xl">
          Completed in <strong>{moves}</strong> moves!
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
    <div className="flex flex-col items-center gap-6 py-4">
      <p className="font-body font-bold text-lg">🎯 Moves: {moves}</p>
      <div className="grid grid-cols-4 gap-3">
        {cards.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => flip(i)}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 border-border font-body text-4xl flex items-center justify-center cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: c.matched
                ? "#bbf7d0"
                : c.flipped
                  ? "#fff"
                  : "#6366f1",
            }}
          >
            {c.flipped || c.matched ? c.emoji : "❓"}
          </button>
        ))}
      </div>
    </div>
  );
}
