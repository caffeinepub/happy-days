import { useEffect, useRef, useState } from "react";

const WORD_LIST = [
  "cat",
  "dog",
  "sun",
  "bird",
  "fish",
  "frog",
  "lion",
  "bear",
  "cake",
  "tree",
  "duck",
  "star",
  "wolf",
  "kite",
  "milk",
];

function pickWords() {
  return [...WORD_LIST]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .map((w, i) => ({ w, key: `${w}-${i}` }));
}

export function TypingSpeed() {
  const [wordObjs] = useState(pickWords);
  const words = wordObjs.map((o) => o.w);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [errors, setErrors] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (started && !done) {
      tickRef.current = window.setInterval(
        () => setElapsed(Date.now() - startTime),
        100,
      );
      return () => {
        if (tickRef.current) clearInterval(tickRef.current);
      };
    }
  }, [started, done, startTime]);

  function handleInput(val: string) {
    if (!started) {
      setStarted(true);
      setStartTime(Date.now());
    }
    if (val.endsWith(" ")) {
      const typed = val.trim();
      if (typed !== words[idx]) setErrors((e) => e + 1);
      if (idx + 1 >= words.length) {
        setDone(true);
        setElapsed(Date.now() - startTime);
        if (tickRef.current) clearInterval(tickRef.current);
      } else setIdx((i) => i + 1);
      setInput("");
    } else {
      setInput(val);
    }
  }

  const wpm = elapsed > 0 ? Math.round(idx / (elapsed / 60000)) : 0;

  if (done) {
    const finalWpm = Math.round(words.length / (elapsed / 60000));
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">⌨️</div>
        <h2 className="font-display font-extrabold text-4xl">Done!</h2>
        <p className="font-body text-2xl">
          Speed: <strong>{finalWpm} WPM</strong>
        </p>
        <p className="font-body text-xl text-muted-foreground">
          Errors: {errors}
        </p>
        <p className="font-body text-lg">
          {finalWpm > 40
            ? "⚡ Super fast!"
            : finalWpm > 25
              ? "👍 Great job!"
              : "🐢 Keep practicing!"}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-8 py-4 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
        >
          Play Again!
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4 max-w-md mx-auto">
      <div className="flex gap-6 font-body font-bold text-lg">
        <span>
          Word {idx + 1}/{words.length}
        </span>
        <span className="text-primary">{wpm} WPM</span>
        <span className="text-red-500">❌ {errors}</span>
      </div>
      <div className="flex flex-wrap gap-2 justify-center p-4 bg-muted rounded-2xl w-full">
        {wordObjs.map((obj, i) => (
          <span
            key={obj.key}
            className={`font-body text-lg px-2 py-1 rounded-lg ${
              i < idx
                ? "text-green-600 line-through"
                : i === idx
                  ? "bg-primary text-white font-bold"
                  : "text-muted-foreground"
            }`}
          >
            {obj.w}
          </span>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => handleInput(e.target.value)}
        placeholder={
          started ? "Type & press Space..." : "Click here and start typing!"
        }
        className="w-full border-4 border-border rounded-2xl px-4 py-3 font-body text-xl text-center outline-none focus:border-primary"
      />
      <p className="font-body text-muted-foreground text-sm">
        Type each word and press SPACE to move to the next!
      </p>
    </div>
  );
}
