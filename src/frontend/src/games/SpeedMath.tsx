import { useEffect, useRef, useState } from "react";

interface Question {
  q: string;
  ans: number;
}

function genQ(): Question {
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * 12) + 1;
  let b = Math.floor(Math.random() * 12) + 1;
  let ans: number;
  if (op === "+") {
    ans = a + b;
  } else if (op === "-") {
    if (a < b) {
      const tmp = a;
      a = b;
      b = tmp;
    }
    ans = a - b;
  } else {
    ans = a * b;
  }
  return { q: `${a} ${op} ${b} = ?`, ans };
}

export function SpeedMath() {
  const [curQ, setCurQ] = useState<Question>(genQ);
  const [input, setInput] = useState("");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(5);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roundRef = useRef(0);

  const goNext = () => {
    setCurQ(genQ());
    setInput("");
    setTimeLeft(5);
  };

  useEffect(() => {
    roundRef.current = round;
  }, [round]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: goNext is stable, round tracked via ref
  useEffect(() => {
    if (done) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setFeedback((f) => {
            if (f === null) {
              setTimeout(() => {
                setFeedback(null);
                const nextRound = roundRef.current + 1;
                if (nextRound >= 20) {
                  setDone(true);
                } else {
                  setRound(nextRound);
                  goNext();
                }
              }, 700);
              return "⏱️ Too slow!";
            }
            return f;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [round, done]);

  const submit = () => {
    if (feedback) return;
    clearInterval(timerRef.current!);
    if (Number.parseInt(input) === curQ.ans) {
      setScore((s) => s + 10);
      setFeedback("✅");
    } else setFeedback(`❌ ${curQ.ans}`);
    setTimeout(() => {
      setFeedback(null);
      const nextRound = roundRef.current + 1;
      if (nextRound >= 20) {
        setDone(true);
      } else {
        setRound(nextRound);
        goNext();
      }
    }, 700);
  };

  const reset = () => {
    setCurQ(genQ());
    setInput("");
    setRound(0);
    setScore(0);
    setDone(false);
    setFeedback(null);
    setTimeLeft(5);
  };

  if (done)
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="text-4xl font-extrabold">🧮 Done!</div>
        <div className="text-2xl">Score: {score}/200</div>
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 bg-yellow-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
        >
          Play Again
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex gap-6 text-xl font-bold">
        <span>Q {round + 1}/20</span>
        <span>Score: {score}</span>
        <span>⏱️ {timeLeft}s</span>
      </div>
      <div className="text-4xl font-extrabold bg-yellow-100 px-8 py-4 rounded-2xl">
        {curQ.q}
      </div>
      {feedback && <div className="text-3xl font-bold">{feedback}</div>}
      <input
        className="border-4 border-gray-300 rounded-2xl px-4 py-3 text-3xl font-bold w-40 text-center"
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <button
        type="button"
        onClick={submit}
        className="px-6 py-3 bg-yellow-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
      >
        Submit
      </button>
    </div>
  );
}
