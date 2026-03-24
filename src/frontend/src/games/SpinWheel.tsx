import { useState } from "react";

const PRIZES = [
  "🌟 Star",
  "🍭 Candy",
  "🎁 Gift",
  "🏆 Trophy",
  "🎈 Balloon",
  "🦄 Unicorn",
  "🍕 Pizza",
  "💎 Diamond",
];
const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
];

export function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const spin = () => {
    if (spinning) return;
    setResult(null);
    setSpinning(true);
    const extra = 1440 + Math.floor(Math.random() * 360);
    const newRot = rotation + extra;
    setRotation(newRot);
    setTimeout(() => {
      const idx =
        Math.floor(((360 - (newRot % 360)) / 360) * PRIZES.length) %
        PRIZES.length;
      const prize = PRIZES[idx];
      setResult(prize);
      setHistory((h) => [prize, ...h].slice(0, 5));
      setSpinning(false);
    }, 2000);
  };

  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const r = cx - 10;
  const slice = (2 * Math.PI) / PRIZES.length;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-2xl font-extrabold">🎡 Spin the Prize Wheel!</div>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? "transform 2s cubic-bezier(0.17,0.67,0.12,0.99)"
              : "none",
          }}
          aria-label="Prize wheel"
        >
          <title>Prize Wheel</title>
          {PRIZES.map((prize, i) => {
            const a1 = i * slice - Math.PI / 2;
            const a2 = (i + 1) * slice - Math.PI / 2;
            const x1 = cx + r * Math.cos(a1);
            const y1 = cy + r * Math.sin(a1);
            const x2 = cx + r * Math.cos(a2);
            const y2 = cy + r * Math.sin(a2);
            const mx = cx + r * 0.65 * Math.cos((a1 + a2) / 2);
            const my = cy + r * 0.65 * Math.sin((a1 + a2) / 2);
            return (
              <g key={prize}>
                <path
                  d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
                  fill={COLORS[i]}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={mx}
                  y={my}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="20"
                  style={{ userSelect: "none" }}
                >
                  {prize.split(" ")[0]}
                </text>
              </g>
            );
          })}
        </svg>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 text-3xl"
          style={{ marginTop: -8 }}
        >
          ▼
        </div>
      </div>
      {result && (
        <div className="text-2xl font-extrabold text-yellow-500">
          🎉 You got: {result}!
        </div>
      )}
      <button
        type="button"
        onClick={spin}
        disabled={spinning}
        className="px-8 py-4 bg-yellow-400 text-white rounded-3xl font-extrabold text-2xl cursor-pointer hover:bg-yellow-500 disabled:opacity-50"
      >
        {spinning ? "Spinning..." : "SPIN!"}
      </button>
      {history.length > 0 && (
        <div className="text-sm text-gray-500">
          Recent: {history.join(" • ")}
        </div>
      )}
    </div>
  );
}
