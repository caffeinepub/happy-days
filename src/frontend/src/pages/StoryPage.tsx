import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import type { Story } from "../backend.d";
import { Sparkle, Star } from "../components/StarDecoration";
import { CATEGORY_CONFIG, getStoryCoverImage } from "../lib/storyImages";

interface StoryPageProps {
  story: Story;
  onClose: () => void;
}

export function StoryPage({ story, onClose }: StoryPageProps) {
  const coverImg = getStoryCoverImage(story);
  const catConfig =
    CATEGORY_CONFIG[story.category as keyof typeof CATEGORY_CONFIG];

  const dropCapColor =
    story.category === "adventure"
      ? "oklch(0.65 0.22 38)"
      : story.category === "fantasy"
        ? "oklch(0.62 0.22 290)"
        : story.category === "puzzle"
          ? "oklch(0.68 0.2 210)"
          : "oklch(0.65 0.25 15)";

  return (
    <motion.div
      data-ocid="story.panel"
      className="min-h-screen"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="relative overflow-hidden">
        <Sparkle
          className="top-12 left-[5%]"
          size={24}
          color="oklch(0.87 0.18 95)"
          delay={0}
        />
        <Sparkle
          className="top-8 right-[8%]"
          size={20}
          color="oklch(0.65 0.22 38)"
          delay={0.6}
        />
        <Sparkle
          className="top-24 right-[20%]"
          size={16}
          color="oklch(0.72 0.18 220)"
          delay={1.2}
        />

        <div className="max-w-3xl mx-auto px-4 pt-8 pb-0 relative">
          <Button
            data-ocid="story.close_button"
            variant="outline"
            onClick={onClose}
            className="mb-8 rounded-2xl border-4 border-border font-body font-bold text-base hover:-translate-y-1 transition-transform"
          >
            ← Back to Stories
          </Button>

          {catConfig && (
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span
                className={`inline-flex items-center gap-2 ${catConfig.bgClass} ${catConfig.textClass} px-4 py-1.5 rounded-full font-body font-bold text-sm`}
              >
                <span>{catConfig.emoji}</span>
                <span>{catConfig.label}</span>
              </span>
            </motion.div>
          )}

          <motion.h1
            className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {story.title}
          </motion.h1>

          <motion.div
            className="rounded-3xl overflow-hidden border-4 border-border shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.5,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <img
              src={coverImg}
              alt={story.title}
              className="w-full h-64 sm:h-80 object-cover"
            />
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-1 rounded-full bg-gradient-to-r from-transparent via-border to-border" />
          <div className="flex gap-2">
            <Star size={20} color="oklch(0.87 0.18 95)" delay={0} />
            <Star size={28} color="oklch(0.65 0.22 38)" delay={0.3} />
            <Star size={20} color="oklch(0.72 0.18 220)" delay={0.6} />
          </div>
          <div className="flex-1 h-1 rounded-full bg-gradient-to-l from-transparent via-border to-border" />
        </div>

        <div className="space-y-6">
          {story.content.map((paragraph, pIdx) => (
            <motion.p
              key={paragraph.substring(0, 30)}
              className="font-body text-lg sm:text-xl text-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: pIdx * 0.05, duration: 0.4 }}
            >
              {pIdx === 0 && (
                <span
                  className="float-left font-display font-extrabold text-6xl leading-none mr-3 mt-1"
                  style={{ color: dropCapColor }}
                >
                  {paragraph.charAt(0)}
                </span>
              )}
              {pIdx === 0 ? paragraph.slice(1) : paragraph}
            </motion.p>
          ))}
        </div>

        <motion.div
          className="text-center mt-16 mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="inline-flex flex-col items-center gap-4 bg-white rounded-3xl border-4 border-border px-12 py-8 shadow-lg">
            <div className="flex gap-2">
              <Star size={28} color="oklch(0.87 0.18 95)" delay={0} />
              <Star size={36} color="oklch(0.65 0.22 38)" delay={0.2} />
              <Star size={28} color="oklch(0.72 0.18 220)" delay={0.4} />
            </div>
            <p className="font-display font-extrabold text-3xl text-foreground">
              The End! 🎉
            </p>
            <p className="font-body text-muted-foreground text-base">
              What an amazing story!
            </p>
            <Button
              data-ocid="story.close_button"
              onClick={onClose}
              className="mt-2 h-12 px-8 rounded-2xl bg-[oklch(0.65_0.22_38)] text-white font-body font-bold text-base border-0 shadow-[0_5px_0_0_oklch(0.45_0.22_38)] hover:shadow-[0_3px_0_0_oklch(0.45_0.22_38)] hover:translate-y-[2px] active:shadow-none active:translate-y-[5px] transition-all duration-100"
            >
              🏠 More Stories!
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
