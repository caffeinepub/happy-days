import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "waiting" | "ready" | "result";

export function ReactionTap() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [times, setTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const timerRef = useRef<number | null>(null);
  const ROUNDS = 5;

  function begin() {
    setPhase("waiting");
    const delay = 1500 + Math.random() * 3000;
    timerRef.current = window.setTimeout(() => {
      setStartTime(Date.now());
      setPhase("ready");
    }, delay);
  }

  function tap() {
    if (phase === "idle") {
      setTimes([]);
      begin();
      return;
    }
    if (phase === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase("idle");
      return;
    }
    if (phase === "ready") {
      const t = Date.now() - startTime;
      setLastTime(t);
      setTimes((prev) => {
        const next = [...prev, t];
        if (next.length >= ROUNDS) setPhase("result");
        else setPhase("idle");
        return next;
      });
    }
  }

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const avg = times.length
    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    : 0;

  if (phase === "result") {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">⚡</div>
        <h2 className="font-display font-extrabold text-4xl">Results!</h2>
        <p className="font-body text-2xl">
          Average: <strong>{avg}ms</strong>
        </p>
        <div className="space-y-2">
          {times.map((t, i) => (
            <p
              // biome-ignore lint/suspicious/noArrayIndexKey: round results are ordered by insertion
              key={`round-${i}`}
              className="font-body text-muted-foreground"
            >
              Round {i + 1}: {t}ms
            </p>
          ))}
        </div>
        <p className="font-body text-lg">
          {avg < 250
            ? "⚡ Lightning fast!"
            : avg < 400
              ? "👍 Pretty good!"
              : "🐢 Keep practicing!"}
        </p>
        <button
          type="button"
          onClick={() => {
            setTimes([]);
            setPhase("idle");
          }}
          className="px-8 py-4 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
        >
          Play Again!
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex gap-6 font-body font-bold text-lg">
        <span>
          Round {times.length + 1}/{ROUNDS}
        </span>
        {lastTime > 0 && <span className="text-primary">{lastTime}ms</span>}
      </div>
      <button
        type="button"
        onClick={tap}
        className="w-64 h-64 rounded-full font-display font-extrabold text-2xl text-white border-0 cursor-pointer transition-transform active:scale-95"
        style={{
          backgroundColor:
            phase === "ready"
              ? "#22c55e"
              : phase === "waiting"
                ? "#ef4444"
                : "#6366f1",
        }}
      >
        {phase === "idle"
          ? times.length === 0
            ? "Tap to Start!"
            : "Tap for Next!"
          : phase === "waiting"
            ? "Wait..."
            : "TAP NOW! ⚡"}
      </button>
      <p className="font-body text-muted-foreground text-center">
        {phase === "waiting"
          ? "🔴 Wait for green — don't tap early!"
          : phase === "ready"
            ? "💚 TAP IT!"
            : "Tap the button when it turns green!"}
      </p>
    </div>
  );
}
