import { Float, Sphere, Stars, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type * as THREE from "three";

interface Question {
  question: string;
  options: string[];
  answer: number;
}

const QUESTIONS: Question[] = [
  {
    question: "What do dragons breathe?",
    options: ["Ice", "Fire", "Water", "Wind"],
    answer: 1,
  },
  {
    question: "What does a wizard use to cast spells?",
    options: ["A sword", "A wand", "A shield", "A hat"],
    answer: 1,
  },
  {
    question: "Where do mermaids live?",
    options: ["In trees", "In castles", "In the ocean", "In caves"],
    answer: 2,
  },
  {
    question: "What color is usually a unicorn?",
    options: ["Black", "Purple", "White", "Green"],
    answer: 2,
  },
  {
    question: "What do fairies have on their backs?",
    options: ["Shells", "Wings", "Fins", "Capes"],
    answer: 1,
  },
  {
    question: "What do you find at the end of a rainbow?",
    options: ["A dragon", "A castle", "A pot of gold", "A wizard"],
    answer: 2,
  },
  {
    question: "What does a magic carpet do?",
    options: ["Sings", "Flies", "Talks", "Glows"],
    answer: 1,
  },
  {
    question: "What animal is a phoenix?",
    options: ["A horse", "A fish", "A bird", "A cat"],
    answer: 2,
  },
];

const STAR_KEYS = ["star-1", "star-2", "star-3"];
const SCORE_STAR_KEYS = Array.from(
  { length: QUESTIONS.length },
  (_, i) => `score-star-${i}`,
);

type AnswerState = "unanswered" | "correct" | "wrong";

function MagicOrb({
  color,
  position,
}: { color: string; position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.5;
  });
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <Sphere ref={ref} args={[0.35, 32, 32]} position={position}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.8}
          roughness={0.1}
        />
      </Sphere>
    </Float>
  );
}

function QuizScene({
  answerState,
  score,
}: { answerState: AnswerState; score: number }) {
  const wizardRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (wizardRef.current) {
      wizardRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      wizardRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const orbColor =
    answerState === "correct"
      ? "#4ade80"
      : answerState === "wrong"
        ? "#f87171"
        : "#a78bfa";

  return (
    <>
      <Stars
        radius={30}
        depth={10}
        count={400}
        factor={3}
        saturation={0.5}
        fade
      />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 3, 3]} intensity={2} color="#c084fc" />
      <pointLight position={[-4, 1, 2]} intensity={1} color="#60a5fa" />
      <pointLight position={[4, 1, 2]} intensity={1} color="#f472b6" />

      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.2, 0]}
      >
        <circleGeometry args={[10, 32]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.6} />
      </mesh>

      <group ref={wizardRef} position={[0, -0.5, -2]}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.6, 1.6, 8]} />
          <meshStandardMaterial color="#4c1d95" />
        </mesh>
        <Sphere args={[0.38, 16, 16]} position={[0, 1.1, 0]}>
          <meshStandardMaterial color="#fcd34d" />
        </Sphere>
        <mesh position={[0, 1.75, 0]}>
          <coneGeometry args={[0.42, 1.0, 8]} />
          <meshStandardMaterial color="#4c1d95" />
        </mesh>
        <mesh position={[0, 1.35, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 0.08, 16]} />
          <meshStandardMaterial color="#4c1d95" />
        </mesh>
        <Sphere args={[0.06, 8, 8]} position={[0.14, 1.15, 0.33]}>
          <meshStandardMaterial color="#111" />
        </Sphere>
        <Sphere args={[0.06, 8, 8]} position={[-0.14, 1.15, 0.33]}>
          <meshStandardMaterial color="#111" />
        </Sphere>
        <mesh position={[0.65, 0.6, 0.3]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.035, 0.035, 1.0, 6]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <Sphere args={[0.1, 12, 12]} position={[0.98, 0.95, 0.53]}>
          <meshStandardMaterial
            color={orbColor}
            emissive={orbColor}
            emissiveIntensity={1}
          />
        </Sphere>
      </group>

      <MagicOrb color="#a78bfa" position={[-3.5, 0.5, -1]} />
      <MagicOrb color="#f472b6" position={[3.5, 0.5, -1]} />
      <MagicOrb color="#60a5fa" position={[0, 2.2, -3]} />

      {SCORE_STAR_KEYS.slice(0, score).map((key, i) => (
        <Float key={key} speed={1.5} floatIntensity={0.3}>
          <Text
            position={[-2.5 + i * 0.7, 2.5, 0]}
            fontSize={0.4}
            anchorX="center"
            anchorY="middle"
          >
            ⭐
          </Text>
        </Float>
      ))}
    </>
  );
}

export function MagicQuiz() {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const question = QUESTIONS[qIndex];

  const handleSelect = (optIdx: number) => {
    if (answerState !== "unanswered") return;
    setSelected(optIdx);
    const correct = optIdx === question.answer;
    setAnswerState(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (qIndex + 1 >= QUESTIONS.length) setDone(true);
    else {
      setQIndex((i) => i + 1);
      setSelected(null);
      setAnswerState("unanswered");
    }
  };

  const handleRestart = () => {
    setQIndex(0);
    setSelected(null);
    setAnswerState("unanswered");
    setScore(0);
    setDone(false);
  };

  const stars = score >= 7 ? 3 : score >= 5 ? 2 : score >= 3 ? 1 : 0;

  return (
    <div className="flex flex-col items-center gap-5 max-w-2xl mx-auto">
      <div
        className="w-full rounded-3xl overflow-hidden border-4 border-border shadow-2xl"
        style={{ height: 280 }}
      >
        <Canvas
          camera={{ position: [0, 0.5, 7], fov: 55 }}
          style={{ width: "100%", height: "100%" }}
        >
          <color attach="background" args={["#0f0a2e"]} />
          <QuizScene answerState={answerState} score={score} />
        </Canvas>
      </div>

      {done ? (
        <div
          data-ocid="quiz.success_state"
          className="text-center bg-gradient-to-br from-purple-50 to-blue-50 border-4 border-[oklch(0.62_0.22_290)] rounded-3xl p-10 w-full"
        >
          <div className="text-7xl animate-bounce mb-3">🎓</div>
          <h3 className="font-display font-extrabold text-4xl text-foreground mb-4">
            Quiz Complete!
          </h3>
          <p
            className="font-display font-extrabold text-6xl mb-2"
            style={{ color: "oklch(0.62 0.22 290)" }}
          >
            {score}/{QUESTIONS.length}
          </p>
          <div className="text-5xl mb-4">
            {STAR_KEYS.map((key, i) => (
              <span key={key} className={i < stars ? "" : "opacity-25"}>
                ⭐
              </span>
            ))}
          </div>
          <p className="font-body text-muted-foreground text-lg mb-6">
            {stars === 3
              ? "Amazing! You're a Magic Master! 🧙"
              : stars === 2
                ? "Great job! You know magic! ✨"
                : stars === 1
                  ? "Good try! Keep practicing! 📚"
                  : "Keep learning and try again! 💪"}
          </p>
          <button
            type="button"
            data-ocid="quiz.restart_button"
            onClick={handleRestart}
            className="bg-primary text-white font-display font-bold text-xl px-10 py-4 rounded-2xl shadow-[0_5px_0_0_oklch(0.45_0.22_38)] hover:translate-y-[2px] transition-all cursor-pointer"
          >
            🔄 Play Again!
          </button>
        </div>
      ) : (
        <>
          <div className="w-full">
            <div className="flex justify-between font-body text-sm text-muted-foreground mb-2">
              <span>
                Question {qIndex + 1} of {QUESTIONS.length}
              </span>
              <span>⭐ Score: {score}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(qIndex / QUESTIONS.length) * 100}%`,
                  background:
                    "linear-gradient(90deg, oklch(0.65 0.25 15), oklch(0.72 0.2 210))",
                }}
              />
            </div>
          </div>

          <div className="w-full bg-gradient-to-br from-purple-50 to-blue-50 border-4 border-[oklch(0.62_0.22_290)] rounded-3xl p-7 text-center">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-foreground leading-snug">
              {question.question}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {question.options.map((opt, i) => {
              let btnStyle =
                "bg-white border-4 border-border text-foreground hover:border-[oklch(0.62_0.22_290)] hover:-translate-y-1";
              if (answerState !== "unanswered") {
                if (i === question.answer)
                  btnStyle =
                    "bg-green-100 border-4 border-green-500 text-green-800 scale-105";
                else if (i === selected && answerState === "wrong")
                  btnStyle = "bg-red-100 border-4 border-red-400 text-red-700";
                else
                  btnStyle =
                    "bg-white border-4 border-border text-muted-foreground opacity-60";
              }
              return (
                <button
                  key={opt}
                  type="button"
                  data-ocid={`quiz.option_button.${i + 1}`}
                  onClick={() => handleSelect(i)}
                  disabled={answerState !== "unanswered"}
                  className={`px-6 py-5 rounded-2xl font-body font-bold text-xl transition-all duration-200 cursor-pointer text-left flex items-center gap-3 ${btnStyle}`}
                >
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center font-display font-extrabold text-sm flex-shrink-0"
                    style={{
                      background: "oklch(0.62 0.22 290)",
                      color: "white",
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                  {answerState !== "unanswered" && i === question.answer && (
                    <span className="ml-auto">✅</span>
                  )}
                  {answerState === "wrong" && i === selected && (
                    <span className="ml-auto">❌</span>
                  )}
                </button>
              );
            })}
          </div>

          {answerState !== "unanswered" && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div
                className={`font-display font-bold text-2xl ${answerState === "correct" ? "text-green-600" : "text-red-500"}`}
              >
                {answerState === "correct"
                  ? "🎉 Correct! Amazing!"
                  : `❌ The answer was: ${question.options[question.answer]}`}
              </div>
              <button
                type="button"
                data-ocid="quiz.next_button"
                onClick={handleNext}
                className="bg-primary text-white font-display font-bold text-xl px-12 py-4 rounded-2xl shadow-[0_5px_0_0_oklch(0.45_0.22_38)] hover:translate-y-[2px] transition-all cursor-pointer"
              >
                {qIndex + 1 >= QUESTIONS.length
                  ? "🏆 See Results!"
                  : "Next Question ➡️"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
