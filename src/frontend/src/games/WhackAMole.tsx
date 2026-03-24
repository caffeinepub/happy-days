import { useEffect, useRef, useState } from "react";

const HOLES = Array.from({ length: 9 }, (_, i) => i);

export function WhackAMole() {
  const [active, setActive] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const moleRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const missedRef = useRef(0);

  function start() {
    setScore(0);
    setMissed(0);
    setDone(false);
    setTimeLeft(30);
    missedRef.current = 0;
    setRunning(true);
  }

  useEffect(() => {
    if (!running) return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setRunning(false);
          setDone(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (!running) return;
    function showMole() {
      const hole = Math.floor(Math.random() * 9);
      setActive(hole);
      moleRef.current = window.setTimeout(() => {
        setActive((cur) => {
          if (cur === hole) {
            missedRef.current++;
            setMissed(missedRef.current);
            if (missedRef.current >= 5) {
              setRunning(false);
              setDone(true);
            }
            return null;
          }
          return cur;
        });
        if (missedRef.current < 5) showMole();
      }, 1000);
    }
    showMole();
    return () => {
      if (moleRef.current) clearTimeout(moleRef.current);
    };
  }, [running]);

  function whack(i: number) {
    if (active !== i) return;
    if (moleRef.current) clearTimeout(moleRef.current);
    setActive(null);
    setScore((s) => s + 1);
  }

  if (!running && !done) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">🐹</div>
        <h2 className="font-display font-extrabold text-4xl">Whack-a-Mole!</h2>
        <p className="font-body text-muted-foreground text-lg text-center">
          Whack the moles before they hide! You have 30 seconds. Miss 5 and game
          over!
        </p>
        <button
          type="button"
          onClick={start}
          className="px-8 py-4 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
        >
          Start!
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">🏆</div>
        <h2 className="font-display font-extrabold text-4xl">Time's Up!</h2>
        <p className="font-body text-2xl">
          You whacked <strong>{score}</strong> moles!
        </p>
        <button
          type="button"
          onClick={start}
          className="px-8 py-4 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
        >
          Play Again!
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 font-body font-bold text-lg">
        <span className="text-primary">🔨 Score: {score}</span>
        <span className="text-orange-500">⏱️ {timeLeft}s</span>
        <span className="text-red-500">❌ Missed: {missed}/5</span>
      </div>
      <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-b from-green-300 to-green-500 rounded-3xl border-4 border-border">
        {HOLES.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => whack(i)}
            className="w-24 h-24 rounded-full border-4 border-border font-body text-5xl flex items-center justify-center cursor-pointer transition-all hover:scale-110"
            style={{ backgroundColor: active === i ? "#fef9c3" : "#92400e" }}
          >
            {active === i ? "🐹" : "🕳️"}
          </button>
        ))}
      </div>
    </div>
  );
}
