import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Story } from "../backend.d";
import { Confetti } from "../components/Confetti";
import { Sparkle, Star } from "../components/StarDecoration";
import { CATEGORY_CONFIG, getStoryCoverImage } from "../lib/storyImages";

interface StoryPageProps {
  story: Story;
  onClose: () => void;
}

const SLIDE_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.95 0.12 85), oklch(0.90 0.14 55))",
  "linear-gradient(135deg, oklch(0.92 0.12 330), oklch(0.88 0.16 290))",
  "linear-gradient(135deg, oklch(0.88 0.14 210), oklch(0.92 0.12 180))",
  "linear-gradient(135deg, oklch(0.90 0.14 145), oklch(0.94 0.12 120))",
  "linear-gradient(135deg, oklch(0.93 0.13 25), oklch(0.90 0.15 330))",
  "linear-gradient(135deg, oklch(0.88 0.16 290), oklch(0.90 0.14 210))",
];

const FLOATING_EMOJIS = [
  "⭐",
  "🌈",
  "💛",
  "🎉",
  "🌟",
  "✨",
  "🎊",
  "🦋",
  "🌸",
  "🍀",
];

function FloatingEmoji({
  emoji,
  x,
  y,
  delay,
}: { emoji: string; x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute text-2xl select-none pointer-events-none"
      style={{ left: x, top: y }}
      animate={{ y: [0, -14, 0], rotate: [-5, 5, -5] }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration: 1.8 + delay * 0.3,
        delay,
        ease: "easeInOut",
      }}
    >
      {emoji}
    </motion.div>
  );
}

function SlideEmojis({ slideIndex }: { slideIndex: number }) {
  const positions = [
    { x: "4%", y: "8%", d: 0 },
    { x: "88%", y: "6%", d: 0.4 },
    { x: "6%", y: "78%", d: 0.8 },
    { x: "86%", y: "75%", d: 1.1 },
    { x: "45%", y: "5%", d: 0.6 },
  ];
  return (
    <>
      {positions.map((pos, i) => {
        const emoji =
          FLOATING_EMOJIS[(slideIndex * 3 + i) % FLOATING_EMOJIS.length];
        return (
          <FloatingEmoji
            key={`${slideIndex}-emoji-${pos.x}`}
            emoji={emoji}
            x={pos.x}
            y={pos.y}
            delay={pos.d}
          />
        );
      })}
    </>
  );
}

export function StoryPage({ story, onClose }: StoryPageProps) {
  const coverImg = getStoryCoverImage(story);
  const catConfig =
    CATEGORY_CONFIG[story.category as keyof typeof CATEGORY_CONFIG];

  const contentSlides: string[][] = [];
  for (let i = 0; i < story.content.length; i += 2) {
    contentSlides.push(story.content.slice(i, i + 2));
  }
  const totalSlides = 1 + contentSlides.length + 1;
  const endSlideIndex = totalSlides - 1;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showConfetti, setShowConfetti] = useState(true);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (idx: number, dir: number) => {
      setDirection(dir);
      setCurrentSlide(idx);
      if (idx === endSlideIndex) {
        setShowConfetti(false);
        setTimeout(() => setShowConfetti(true), 50);
      }
    },
    [endSlideIndex],
  );

  const goNext = useCallback(() => {
    if (currentSlide < endSlideIndex) goTo(currentSlide + 1, 1);
  }, [currentSlide, endSlideIndex, goTo]);

  const goPrev = useCallback(() => {
    if (currentSlide > 0) goTo(currentSlide - 1, -1);
  }, [currentSlide, goTo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const gradientBg = SLIDE_GRADIENTS[currentSlide % SLIDE_GRADIENTS.length];

  return (
    <motion.div
      data-ocid="story.panel"
      className="min-h-screen flex flex-col"
      style={{ background: gradientBg, transition: "background 0.6s ease" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {currentSlide === endSlideIndex && <Confetti active={showConfetti} />}
      {currentSlide === 0 && <Confetti active={true} />}

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2">
        <Button
          data-ocid="story.close_button"
          variant="outline"
          onClick={onClose}
          className="rounded-2xl border-4 border-white/60 bg-white/80 backdrop-blur font-bold text-base hover:-translate-y-1 transition-transform shadow-lg"
        >
          ← Back
        </Button>

        {catConfig && (
          <span
            className={`inline-flex items-center gap-1.5 ${catConfig.bgClass} ${catConfig.textClass} px-3 py-1 rounded-full font-bold text-sm shadow-md`}
          >
            <span>{catConfig.emoji}</span>
            <span className="hidden sm:inline">{catConfig.label}</span>
          </span>
        )}

        <div className="text-sm font-bold text-white/80 bg-black/20 rounded-full px-3 py-1">
          {currentSlide + 1} / {totalSlides}
        </div>
      </div>

      {/* Slideshow area */}
      <div
        className="flex-1 relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 py-4"
          >
            <SlideEmojis slideIndex={currentSlide} />

            {currentSlide === 0 && (
              <CoverSlide
                story={story}
                coverImg={coverImg}
                catConfig={catConfig}
              />
            )}

            {currentSlide > 0 && currentSlide < endSlideIndex && (
              <ContentSlide
                paragraphs={contentSlides[currentSlide - 1]}
                slideIndex={currentSlide}
              />
            )}

            {currentSlide === endSlideIndex && <EndSlide onClose={onClose} />}
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        <div className="absolute inset-y-0 left-2 flex items-center z-20">
          {currentSlide > 0 && (
            <motion.button
              type="button"
              onClick={goPrev}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className="w-14 h-14 rounded-full bg-white/90 border-4 border-white shadow-xl flex items-center justify-center text-foreground"
              aria-label="Previous slide"
            >
              <ChevronLeft size={28} strokeWidth={3} />
            </motion.button>
          )}
        </div>
        <div className="absolute inset-y-0 right-2 flex items-center z-20">
          {currentSlide < endSlideIndex && (
            <motion.button
              type="button"
              onClick={goNext}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              className="w-14 h-14 rounded-full bg-white/90 border-4 border-white shadow-xl flex items-center justify-center text-foreground"
              aria-label="Next slide"
            >
              <ChevronRight size={28} strokeWidth={3} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 py-4 z-10">
        {Array.from({ length: totalSlides }, (_, i) => (
          <button
            type="button"
            key={`dot-slide-${i}-of-${totalSlides}`}
            onClick={() => goTo(i, i > currentSlide ? 1 : -1)}
            className={`rounded-full transition-all duration-300 ${
              i === currentSlide
                ? "w-6 h-3 bg-white shadow-lg"
                : "w-3 h-3 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

function CoverSlide({
  story,
  coverImg,
  catConfig,
}: {
  story: Story;
  coverImg: string;
  catConfig: (typeof CATEGORY_CONFIG)[keyof typeof CATEGORY_CONFIG] | undefined;
}) {
  return (
    <div className="flex flex-col items-center gap-5 max-w-lg w-full">
      <Sparkle
        className="top-4 left-[10%]"
        size={22}
        color="oklch(0.87 0.18 95)"
        delay={0}
      />
      <Sparkle
        className="top-2 right-[10%]"
        size={18}
        color="oklch(0.65 0.22 38)"
        delay={0.7}
      />

      <motion.div
        className="rounded-3xl overflow-hidden border-4 border-white shadow-2xl w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <img
          src={coverImg}
          alt={story.title}
          className="w-full h-52 sm:h-64 object-cover"
        />
      </motion.div>

      <motion.h1
        className="font-display font-extrabold text-3xl sm:text-4xl text-center text-white drop-shadow-lg leading-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {story.title}
      </motion.h1>

      {catConfig && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
        >
          <span
            className={`inline-flex items-center gap-2 ${catConfig.bgClass} ${catConfig.textClass} px-5 py-2 rounded-full font-bold text-base shadow-lg`}
          >
            <span className="text-xl">{catConfig.emoji}</span>
            <span>{catConfig.label}</span>
          </span>
        </motion.div>
      )}

      <motion.p
        className="text-white/90 text-center text-base font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Tap the arrow to start reading ➡️
      </motion.p>
    </div>
  );
}

function ContentSlide({
  paragraphs,
  slideIndex,
}: { paragraphs: string[]; slideIndex: number }) {
  return (
    <div className="bg-white/85 backdrop-blur rounded-3xl border-4 border-white shadow-2xl p-6 sm:p-8 max-w-xl w-full">
      <div className="flex justify-center gap-2 mb-5">
        <Star size={22} color="oklch(0.87 0.18 95)" delay={0} />
        <Star size={28} color="oklch(0.65 0.22 38)" delay={0.2} />
        <Star size={22} color="oklch(0.72 0.18 220)" delay={0.4} />
      </div>
      <div className="space-y-5">
        {paragraphs.map((para, idx) => (
          <motion.p
            key={para.substring(0, 20)}
            className="font-body text-lg sm:text-xl text-foreground leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.12 }}
          >
            {idx === 0 && slideIndex === 1 ? (
              <>
                <span
                  className="float-left font-display font-extrabold text-6xl leading-none mr-3 mt-1"
                  style={{ color: "oklch(0.65 0.22 38)" }}
                >
                  {para.charAt(0)}
                </span>
                {para.slice(1)}
              </>
            ) : (
              para
            )}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

const BOUNCE_EMOJIS = ["🌟", "⭐", "🎊", "🏆", "🎉"];

function EndSlide({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 max-w-md w-full text-center">
      <div className="flex gap-3 justify-center">
        {BOUNCE_EMOJIS.map((em, i) => (
          <motion.span
            key={em}
            className="text-3xl sm:text-4xl"
            animate={{ y: [0, -16, 0], scale: [1, 1.2, 1] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.5,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          >
            {em}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="bg-white/90 backdrop-blur rounded-3xl border-4 border-white shadow-2xl px-8 py-8 w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <motion.p
          className="font-display font-extrabold text-4xl sm:text-5xl mb-2"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.65 0.25 25), oklch(0.62 0.24 290), oklch(0.68 0.22 210), oklch(0.74 0.22 145))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2.5,
            ease: "easeInOut",
          }}
        >
          The End! 🎉
        </motion.p>
        <p className="font-body text-muted-foreground text-base mb-6">
          What an amazing story!
        </p>
        <Button
          data-ocid="story.close_button"
          onClick={onClose}
          className="h-12 px-8 rounded-2xl bg-[oklch(0.65_0.22_38)] text-white font-body font-bold text-base border-0 shadow-[0_5px_0_0_oklch(0.45_0.22_38)] hover:shadow-[0_3px_0_0_oklch(0.45_0.22_38)] hover:translate-y-[2px] active:shadow-none active:translate-y-[5px] transition-all duration-100"
        >
          🏠 More Stories!
        </Button>
      </motion.div>
    </div>
  );
}
