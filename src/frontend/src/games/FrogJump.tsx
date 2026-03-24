import { useState } from "react";
import { TouchControls } from "../components/TouchControls";

const PADS = 6;
const PAD_KEYS = ["pad-0", "pad-1", "pad-2", "pad-3", "pad-4", "pad-5"];

export function FrogJump() {
  const [frog, setFrog] = useState(0);
  const [score, setScore] = useState(0);
  const [fell, setFell] = useState(false);
  const [safe] = useState(() =>
    Array.from({ length: PADS }, (_, i) =>
      i === 0 ? true : Math.random() > 0.3,
    ),
  );

  const jump = (i: number) => {
    if (fell) return;
    if (i !== frog + 1) return;
    if (!safe[i]) {
      setFell(true);
      return;
    }
    setFrog(i);
    setScore((s) => s + 10);
  };

  const reset = () => {
    setFrog(0);
    setScore(0);
    setFell(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="text-2xl font-extrabold">
        🐸 Hop across the lily pads!
      </div>
      <div className="text-xl">Score: {score}</div>
      <div className="flex gap-4">
        {Array.from({ length: PADS }, (_, i) => (
          <button
            key={PAD_KEYS[i]}
            type="button"
            onClick={() => jump(i)}
            className={`w-16 h-16 rounded-full text-3xl flex items-center justify-center border-4 cursor-pointer transition-transform hover:scale-110 ${
              !safe[i] && i !== 0
                ? "bg-blue-200 border-blue-300"
                : "bg-green-400 border-green-600"
            } ${frog === i ? "ring-4 ring-yellow-400" : ""}`}
          >
            {frog === i ? "🐸" : safe[i] ? "🌿" : "💧"}
          </button>
        ))}
      </div>
      {fell && (
        <div className="text-2xl text-red-500 font-bold">
          Splash! The frog fell! 🌊
        </div>
      )}
      {frog === PADS - 1 && !fell && (
        <div className="text-2xl text-green-600 font-bold">
          🎉 Made it across!
        </div>
      )}
      <button
        type="button"
        onClick={reset}
        className="px-6 py-3 bg-green-500 text-white rounded-2xl font-bold text-xl cursor-pointer"
      >
        Play Again
      </button>
      <TouchControls layout="single" />
    </div>
  );
}
