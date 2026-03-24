import { useState } from "react";

const CHOICES = ["rock", "paper", "scissors"] as const;
type Choice = (typeof CHOICES)[number];
const EMOJI: Record<Choice, string> = {
  rock: "🪨",
  paper: "📝",
  scissors: "✂️",
};

function getResult(p: Choice, c: Choice): "win" | "lose" | "draw" {
  if (p === c) return "draw";
  if (
    (p === "rock" && c === "scissors") ||
    (p === "paper" && c === "rock") ||
    (p === "scissors" && c === "paper")
  )
    return "win";
  return "lose";
}

export function RockPaperScissors() {
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [round, setRound] = useState(0);
  const [last, setLast] = useState<{
    player: Choice;
    ai: Choice;
    result: "win" | "lose" | "draw";
  } | null>(null);
  const [done, setDone] = useState(false);

  function play(choice: Choice) {
    if (done) return;
    const ai = CHOICES[Math.floor(Math.random() * 3)];
    const result = getResult(choice, ai);
    if (result === "win") setPlayerScore((s) => s + 1);
    else if (result === "lose") setAiScore((s) => s + 1);
    const newRound = round + 1;
    setRound(newRound);
    setLast({ player: choice, ai, result });
    if (newRound >= 5) setDone(true);
  }

  function restart() {
    setPlayerScore(0);
    setAiScore(0);
    setRound(0);
    setLast(null);
    setDone(false);
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex gap-8 font-body font-bold text-xl">
        <span className="text-blue-500">🙋 You: {playerScore}</span>
        <span className="text-muted-foreground">Round {round}/5</span>
        <span className="text-red-500">🤖 AI: {aiScore}</span>
      </div>
      {last && (
        <div className="flex flex-col items-center gap-2 bg-muted rounded-3xl p-6 w-full max-w-xs text-center">
          <div className="flex gap-8 text-7xl">
            <span>{EMOJI[last.player]}</span>
            <span className="text-3xl self-center">vs</span>
            <span>{EMOJI[last.ai]}</span>
          </div>
          <p
            className={`font-display font-extrabold text-2xl mt-2 ${
              last.result === "win"
                ? "text-green-500"
                : last.result === "lose"
                  ? "text-red-500"
                  : "text-yellow-500"
            }`}
          >
            {last.result === "win"
              ? "🎉 You Win!"
              : last.result === "lose"
                ? "😢 AI Wins!"
                : "🤝 Draw!"}
          </p>
        </div>
      )}
      {done ? (
        <div className="text-center">
          <p className="font-display font-extrabold text-3xl mb-4">
            {playerScore > aiScore
              ? "🏆 You won the match!"
              : playerScore < aiScore
                ? "🤖 AI won this time!"
                : "🤝 It's a tie!"}
          </p>
          <button
            type="button"
            onClick={restart}
            className="px-8 py-4 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
          >
            Play Again!
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          {CHOICES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => play(c)}
              className="flex flex-col items-center gap-2 p-5 rounded-3xl border-4 border-border bg-white cursor-pointer transition-all hover:scale-110 hover:border-primary"
            >
              <span className="text-6xl">{EMOJI[c]}</span>
              <span className="font-body font-bold capitalize">{c}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
