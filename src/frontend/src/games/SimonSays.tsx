import { useEffect, useRef, useState } from "react";

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#eab308"];
const NAMES = ["Red", "Blue", "Green", "Yellow"];
const BUTTON_KEYS = ["btn-0", "btn-1", "btn-2", "btn-3"];

export function SimonSays() {
  const [seq, setSeq] = useState<number[]>([]);
  const [player, setPlayer] = useState<number[]>([]);
  const [showing, setShowing] = useState(false);
  const [lit, setLit] = useState<number | null>(null);
  const [over, setOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState(0);
  const addNextRef = useRef<((s: number[]) => void) | null>(null);

  const addNext = (s: number[]) => {
    const next = [...s, Math.floor(Math.random() * 4)];
    setSeq(next);
    setPlayer([]);
    setRound(next.length);
    setShowing(true);
    let i = 0;
    const show = () => {
      if (i >= next.length) {
        setTimeout(() => {
          setLit(null);
          setShowing(false);
        }, 400);
        return;
      }
      setLit(next[i]);
      i++;
      setTimeout(() => {
        setLit(null);
        setTimeout(show, 300);
      }, 600);
    };
    setTimeout(show, 500);
  };

  useEffect(() => {
    addNextRef.current = addNext;
  });

  const startGame = () => {
    setSeq([]);
    setPlayer([]);
    setShowing(false);
    setLit(null);
    setOver(false);
    setRound(0);
    setStarted(true);
  };

  useEffect(() => {
    if (started && seq.length === 0) addNextRef.current?.([]);
  }, [started, seq.length]);

  const press = (i: number) => {
    if (showing || over) return;
    const np = [...player, i];
    if (np[np.length - 1] !== seq[np.length - 1]) {
      setOver(true);
      return;
    }
    if (np.length === seq.length) {
      setPlayer([]);
      setTimeout(() => addNextRef.current?.(seq), 600);
    } else setPlayer(np);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="text-2xl font-extrabold">🎵 Simon Says</div>
      {over && (
        <div className="text-2xl text-red-500 font-bold">
          Wrong! You reached round {round - 1}!
        </div>
      )}
      {started && !over && (
        <div className="text-xl font-bold">
          {showing ? "Watch carefully..." : "Your turn!"} Round {round}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {COLORS.map((c, i) => (
          <button
            key={BUTTON_KEYS[i]}
            type="button"
            onClick={() => press(i)}
            className="w-28 h-28 rounded-3xl border-0 cursor-pointer transition-all duration-100 font-bold text-white"
            style={{
              backgroundColor: c,
              opacity: lit === i ? 1 : 0.5,
              transform: lit === i ? "scale(1.1)" : "scale(1)",
              boxShadow: lit === i ? `0 0 30px ${c}` : "none",
            }}
          >
            {NAMES[i]}
          </button>
        ))}
      </div>
      {(!started || over) && (
        <button
          type="button"
          onClick={startGame}
          className="px-6 py-3 bg-purple-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
        >
          {started ? "Play Again" : "Start!"}
        </button>
      )}
    </div>
  );
}
