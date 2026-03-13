import { useState } from "react";

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

type AnswerState = "unanswered" | "correct" | "wrong";

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
    if (qIndex + 1 >= QUESTIONS.length) {
      setDone(true);
    } else {
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

  if (done) {
    return (
      <div
        data-ocid="quiz.success_state"
        className="flex flex-col items-center gap-6 py-8"
      >
        <div className="text-6xl animate-bounce">🎓</div>
        <h3 className="font-display font-extrabold text-3xl text-foreground text-center">
          Quiz Complete!
        </h3>
        <div className="bg-gradient-to-br from-yellow-50 to-purple-50 border-4 border-[oklch(0.62_0.22_290)] rounded-3xl p-8 text-center w-full max-w-sm">
          <p className="font-body text-muted-foreground text-lg mb-2">
            You got
          </p>
          <p
            className="font-display font-extrabold text-6xl"
            style={{ color: "oklch(0.62 0.22 290)" }}
          >
            {score}/{QUESTIONS.length}
          </p>
          <div className="text-5xl mt-4 mb-2">
            {STAR_KEYS.map((key, i) => (
              <span key={key} className={i < stars ? "" : "opacity-25"}>
                ⭐
              </span>
            ))}
          </div>
          <p className="font-body text-muted-foreground">
            {stars === 3
              ? "Amazing! You're a Magic Master! 🧙"
              : stars === 2
                ? "Great job! You know magic! ✨"
                : stars === 1
                  ? "Good try! Keep practicing! 📚"
                  : "Keep learning and try again! 💪"}
          </p>
        </div>
        <button
          type="button"
          data-ocid="quiz.restart_button"
          onClick={handleRestart}
          className="bg-primary text-white font-display font-bold text-lg px-8 py-3 rounded-2xl shadow-[0_5px_0_0_oklch(0.45_0.22_38)] hover:shadow-[0_3px_0_0_oklch(0.45_0.22_38)] hover:translate-y-[2px] active:shadow-none active:translate-y-[5px] transition-all duration-100 cursor-pointer"
        >
          🔄 Play Again!
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 max-w-lg mx-auto">
      {/* Progress */}
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

      {/* Question */}
      <div className="w-full bg-gradient-to-br from-purple-50 to-blue-50 border-4 border-[oklch(0.62_0.22_290)] rounded-3xl p-6 text-center">
        <div className="text-5xl mb-4">🧙</div>
        <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground leading-snug">
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {question.options.map((opt, i) => {
          let btnStyle =
            "bg-white border-4 border-border text-foreground hover:border-[oklch(0.62_0.22_290)] hover:-translate-y-1";

          if (answerState !== "unanswered") {
            if (i === question.answer) {
              btnStyle =
                "bg-green-100 border-4 border-green-500 text-green-800 scale-105";
            } else if (i === selected && answerState === "wrong") {
              btnStyle = "bg-red-100 border-4 border-red-400 text-red-700";
            } else {
              btnStyle =
                "bg-white border-4 border-border text-muted-foreground opacity-60";
            }
          }

          const ocidIndex = i + 1;
          return (
            <button
              key={opt}
              type="button"
              data-ocid={`quiz.option_button.${ocidIndex}`}
              onClick={() => handleSelect(i)}
              disabled={answerState !== "unanswered"}
              className={`px-5 py-4 rounded-2xl font-body font-bold text-lg transition-all duration-200 cursor-pointer text-left flex items-center gap-3 ${btnStyle}`}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center font-display font-extrabold text-sm flex-shrink-0"
                style={{ background: "oklch(0.62 0.22 290)", color: "white" }}
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

      {/* Feedback + Next */}
      {answerState !== "unanswered" && (
        <div className="flex flex-col items-center gap-4 w-full">
          <div
            className={`font-display font-bold text-xl ${
              answerState === "correct" ? "text-green-600" : "text-red-500"
            }`}
          >
            {answerState === "correct"
              ? "🎉 Correct! Amazing!"
              : `❌ The answer was: ${question.options[question.answer]}`}
          </div>
          <button
            type="button"
            data-ocid="quiz.next_button"
            onClick={handleNext}
            className="bg-primary text-white font-display font-bold text-lg px-10 py-3 rounded-2xl shadow-[0_5px_0_0_oklch(0.45_0.22_38)] hover:shadow-[0_3px_0_0_oklch(0.45_0.22_38)] hover:translate-y-[2px] active:shadow-none active:translate-y-[5px] transition-all duration-100 cursor-pointer"
          >
            {qIndex + 1 >= QUESTIONS.length
              ? "🏆 See Results!"
              : "Next Question ➡️"}
          </button>
        </div>
      )}
    </div>
  );
}
