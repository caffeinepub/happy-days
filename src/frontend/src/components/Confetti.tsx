import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  shape: "rect" | "circle";
}

const CONFETTI_COLORS = [
  "oklch(0.72 0.25 25)",
  "oklch(0.78 0.22 60)",
  "oklch(0.85 0.18 95)",
  "oklch(0.74 0.22 145)",
  "oklch(0.68 0.22 210)",
  "oklch(0.62 0.24 290)",
  "oklch(0.70 0.26 330)",
  "oklch(0.80 0.20 180)",
];

function generatePieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 6 + Math.random() * 8,
    delay: Math.random() * 2,
    duration: 2.5 + Math.random() * 2,
    rotation: Math.random() * 360,
    shape: Math.random() > 0.5 ? "rect" : "circle",
  }));
}

export function Confetti({ active = true }: { active?: boolean }) {
  const [pieces] = useState(() => generatePieces(55));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [active]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 9999 }}
      >
        {pieces.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: "-20px",
              width: p.shape === "circle" ? p.size : p.size * 0.6,
              height: p.shape === "circle" ? p.size : p.size * 1.4,
              borderRadius: p.shape === "circle" ? "50%" : "2px",
              backgroundColor: p.color,
              animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </div>
    </>
  );
}
