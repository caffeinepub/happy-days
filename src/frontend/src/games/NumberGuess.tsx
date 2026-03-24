import { useState } from "react";

export function NumberGuess() {
  const [secret] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState<
    { n: number; hint: string; id: number }[]
  >([]);
  const [won, setWon] = useState(false);
  const [key, setKey] = useState(0);
  const _guessCountRef = { current: 0 };

  function guess() {
    const n = Number.parseInt(input);
    if (Number.isNaN(n) || n < 1 || n > 100) return;
    let hint = "";
    if (n === secret) {
      setWon(true);
      hint = "🎉 Correct!";
    } else if (n < secret)
      hint = n < secret - 15 ? "🥶 Way too cold!" : "🌡️ Getting warmer!";
    else hint = n > secret + 15 ? "🔥 Way too hot!" : "♨️ So close!";
    setGuesses((g) => [{ n, hint, id: Date.now() + g.length }, ...g]);
    setInput("");
  }

  if (won) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-7xl">🏆</div>
        <h2 className="font-display font-extrabold text-4xl text-foreground">
          You got it!
        </h2>
        <p className="font-body text-xl text-muted-foreground">
          The number was <strong>{secret}</strong> — found in {guesses.length}{" "}
          guess{guesses.length !== 1 ? "es" : ""}!
        </p>
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          className="px-8 py-4 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
        >
          Play Again!
        </button>
      </div>
    );
  }

  return (
    <div
      key={key}
      className="flex flex-col items-center gap-6 py-4 max-w-sm mx-auto"
    >
      <div className="text-5xl">🔢</div>
      <p className="font-display font-extrabold text-2xl text-center">
        Guess a number 1–100!
      </p>
      <div className="flex gap-3 w-full">
        <input
          type="number"
          min={1}
          max={100}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && guess()}
          placeholder="Your guess..."
          className="flex-1 border-4 border-border rounded-2xl px-4 py-3 font-body text-xl text-center outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={guess}
          className="px-6 py-3 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
        >
          Go!
        </button>
      </div>
      <div className="w-full space-y-2 max-h-64 overflow-y-auto">
        {guesses.map((g) => (
          <div
            key={g.id}
            className="flex justify-between items-center bg-muted rounded-2xl px-4 py-2"
          >
            <span className="font-body font-bold text-lg">{g.n}</span>
            <span className="font-body text-base">{g.hint}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
