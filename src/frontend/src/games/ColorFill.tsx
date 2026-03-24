import { useState } from "react";

const PALETTE = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#a855f7",
  "#f97316",
];

const SHAPES = [
  {
    name: "House",
    sections: [
      {
        id: "roof",
        label: "Roof",
        path: "M200,20 L320,130 L80,130 Z",
        correct: "#ef4444",
      },
      {
        id: "wall",
        label: "Walls",
        path: "M100,130 L300,130 L300,280 L100,280 Z",
        correct: "#eab308",
      },
      {
        id: "door",
        label: "Door",
        path: "M170,200 L230,200 L230,280 L170,280 Z",
        correct: "#a855f7",
      },
      {
        id: "window1",
        label: "Window 1",
        path: "M115,155 L165,155 L165,195 L115,195 Z",
        correct: "#3b82f6",
      },
      {
        id: "window2",
        label: "Window 2",
        path: "M235,155 L285,155 L285,195 L235,195 Z",
        correct: "#3b82f6",
      },
      {
        id: "chimney",
        label: "Chimney",
        path: "M240,20 L270,20 L270,80 L240,80 Z",
        correct: "#f97316",
      },
    ],
  },
  {
    name: "Sun",
    sections: [
      {
        id: "center",
        label: "Center",
        path: "M200,120 m-60,0 a60,60 0 1,0 120,0 a60,60 0 1,0 -120,0",
        correct: "#eab308",
      },
      {
        id: "ray1",
        label: "Ray 1",
        path: "M195,30 L205,30 L205,80 L195,80 Z",
        correct: "#f97316",
      },
      {
        id: "ray2",
        label: "Ray 2",
        path: "M195,160 L205,160 L205,210 L195,210 Z",
        correct: "#f97316",
      },
      {
        id: "ray3",
        label: "Ray 3",
        path: "M100,115 L100,125 L150,125 L150,115 Z",
        correct: "#f97316",
      },
      {
        id: "ray4",
        label: "Ray 4",
        path: "M250,115 L250,125 L300,125 L300,115 Z",
        correct: "#f97316",
      },
      {
        id: "background",
        label: "Sky",
        path: "M0,0 L400,0 L400,300 L0,300 Z",
        correct: "#3b82f6",
      },
    ],
  },
];

export function ColorFill() {
  const [shapeIdx, setShapeIdx] = useState(0);
  const [fills, setFills] = useState<Record<string, string>>({});
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
  const shape = SHAPES[shapeIdx];

  function fillSection(id: string) {
    setFills((f) => ({ ...f, [id]: selectedColor }));
  }
  const allFilled = shape.sections.every((s) => fills[s.id]);
  const allCorrect = shape.sections.every((s) => fills[s.id] === s.correct);
  function next() {
    setShapeIdx((i) => (i + 1) % SHAPES.length);
    setFills({});
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <p className="font-display font-bold text-xl">
        Color the {shape.name}! 🎨
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        {PALETTE.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setSelectedColor(c)}
            className="w-10 h-10 rounded-full border-4 cursor-pointer transition-transform hover:scale-110"
            style={{
              backgroundColor: c,
              borderColor: selectedColor === c ? "#000" : "#ccc",
              transform: selectedColor === c ? "scale(1.2)" : "scale(1)",
            }}
          />
        ))}
      </div>
      <div className="border-4 border-border rounded-2xl overflow-hidden bg-white">
        <svg
          width={400}
          height={300}
          viewBox="0 0 400 300"
          className="max-w-full block"
          aria-label={`Color the ${shape.name}`}
        >
          <title>Color the {shape.name}</title>
          {shape.sections.map((s) => (
            // biome-ignore lint/a11y/useKeyWithClickEvents: SVG path is a visual game element, buttons below provide keyboard access
            <path
              key={s.id}
              d={s.path}
              fill={fills[s.id] || "#e5e7eb"}
              stroke="#374151"
              strokeWidth={2}
              onClick={() => fillSection(s.id)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
          ))}
        </svg>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {shape.sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => fillSection(s.id)}
            className="px-3 py-1 rounded-full border-2 border-border font-body text-sm cursor-pointer"
            style={{ backgroundColor: fills[s.id] || "#e5e7eb" }}
          >
            {s.label}
          </button>
        ))}
      </div>
      {allFilled && (
        <div className="text-center">
          <p className="font-display font-extrabold text-2xl mb-3">
            {allCorrect ? "🌟 Perfect coloring!" : "🎨 Nice work!"}
          </p>
          <button
            type="button"
            onClick={next}
            className="px-6 py-3 rounded-2xl bg-primary text-white font-display font-bold text-xl cursor-pointer"
          >
            Next Shape!
          </button>
        </div>
      )}
      <p className="font-body text-muted-foreground text-sm">
        Select a color above, then click a section to fill it!
      </p>
    </div>
  );
}
