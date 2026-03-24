import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Story } from "../backend.d";
import { Sparkle, Star } from "../components/StarDecoration";
import { Category, useGetStoriesByCategory } from "../hooks/useQueries";
import {
  FEATURED_STORIES,
  getFeaturedCoverImage,
} from "../lib/featuredStories";
import { CATEGORY_CONFIG, getStoryCoverImage } from "../lib/storyImages";

type FilterCategory = "all" | Category;

const FILTERS: { value: FilterCategory; label: string; emoji: string }[] = [
  { value: "all", label: "All Stories", emoji: "📚" },
  { value: Category.adventure, label: "Adventure", emoji: "🐉" },
  { value: Category.fantasy, label: "Fantasy", emoji: "🧙" },
  { value: Category.puzzle, label: "Puzzle", emoji: "🤖" },
  { value: Category.racing, label: "Racing", emoji: "🏎️" },
];

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];

interface HomePageProps {
  onReadStory: (story: Story) => void;
  onPlayGames: () => void;
}

function StoryCardSkeleton() {
  return (
    <div
      className="rounded-3xl overflow-hidden bg-white border-4 border-border"
      data-ocid="stories.loading_state"
    >
      <Skeleton className="h-48 w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-12 w-full rounded-2xl mt-2" />
      </div>
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    },
  }),
};

const featuredVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    },
  }),
};

// Featured card with large layout and rainbow FEATURED badge
function FeaturedCard({
  story,
  index,
  onRead,
}: { story: Story; index: number; onRead: (s: Story) => void }) {
  const catConfig =
    CATEGORY_CONFIG[story.category as keyof typeof CATEGORY_CONFIG];
  const coverImg = getFeaturedCoverImage(story);
  const ocidIndex = index + 1;

  return (
    <motion.article
      data-ocid={`stories.item.${ocidIndex}`}
      className="relative rounded-[1.75rem] overflow-hidden bg-white cursor-pointer group featured-card-border"
      variants={featuredVariants}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      onClick={() => onRead(story)}
    >
      {/* Cover image - taller for featured */}
      <div className="relative overflow-hidden">
        <img
          src={coverImg}
          alt={story.title}
          className="w-full h-56 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Rainbow FEATURED badge */}
        <div className="absolute top-3 right-3 featured-badge text-white font-display font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
          ⭐ Featured
        </div>
        {/* Category badge */}
        {catConfig && (
          <div
            className={`absolute top-3 left-3 ${catConfig.bgClass} ${catConfig.textClass} flex items-center gap-1.5 px-3 py-1 rounded-full font-body font-bold text-sm shadow-md`}
          >
            <span>{catConfig.emoji}</span>
            <span>{catConfig.label}</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-display font-extrabold text-2xl text-foreground mb-2 leading-tight">
          {story.title}
        </h3>
        <p className="font-body text-muted-foreground text-sm leading-relaxed mb-5">
          {story.description}
        </p>
        <Button
          data-ocid={`story.read_button.${ocidIndex}`}
          onClick={(e) => {
            e.stopPropagation();
            onRead(story);
          }}
          className={`
            w-full h-13 py-3 rounded-2xl font-body font-extrabold text-lg text-white border-0
            ${catConfig ? catConfig.bgClass : "bg-primary"}
            shadow-[0_6px_0_0_oklch(0.4_0.2_38)]
            hover:shadow-[0_3px_0_0_oklch(0.4_0.2_38)] hover:translate-y-[3px]
            active:shadow-none active:translate-y-[6px] transition-all duration-100
          `}
        >
          🎮 Play Story!
        </Button>
      </div>
    </motion.article>
  );
}

export function HomePage({ onReadStory, onPlayGames }: HomePageProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const {
    data: stories,
    isLoading,
    isError,
  } = useGetStoriesByCategory(activeFilter);

  const categoryConfig = (cat: string) =>
    CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG];

  // Filter featured stories when a category filter is active
  const visibleFeatured =
    activeFilter === "all"
      ? FEATURED_STORIES
      : FEATURED_STORIES.filter((s) => s.category === activeFilter);

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden stars-bg pt-10 pb-16 px-6">
        <Sparkle
          className="top-8 left-[6%]"
          size={30}
          color="oklch(0.87 0.18 95)"
          delay={0}
        />
        <Sparkle
          className="top-16 right-[10%]"
          size={22}
          color="oklch(0.65 0.22 38)"
          delay={0.5}
        />
        <Sparkle
          className="top-4 left-[42%]"
          size={18}
          color="oklch(0.72 0.18 220)"
          delay={1}
        />
        <Sparkle
          className="top-24 left-[62%]"
          size={26}
          color="oklch(0.62 0.22 290)"
          delay={1.5}
        />
        <Sparkle
          className="bottom-10 left-[22%]"
          size={20}
          color="oklch(0.65 0.25 15)"
          delay={0.8}
        />
        <Sparkle
          className="bottom-14 right-[22%]"
          size={24}
          color="oklch(0.7 0.2 140)"
          delay={0.3}
        />
        <Sparkle
          className="top-32 left-[12%]"
          size={16}
          color="oklch(0.63 0.24 310)"
          delay={1.8}
        />
        <Sparkle
          className="top-20 right-[35%]"
          size={14}
          color="oklch(0.82 0.2 95)"
          delay={0.9}
        />

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-white border-4 border-[oklch(0.87_0.18_95)] rounded-full px-5 py-2 mb-5 shadow-md"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-xl">🌈</span>
                <span className="font-body font-bold text-foreground text-sm">
                  Where Games Come to Life!
                </span>
                <span className="text-xl">🌈</span>
              </motion.div>

              <h1 className="font-display font-extrabold text-6xl sm:text-7xl lg:text-8xl leading-none mb-2">
                <span className="rainbow-text">Happy</span>
              </h1>
              <h1 className="font-display font-extrabold text-6xl sm:text-7xl lg:text-8xl leading-none mb-6">
                <span className="rainbow-text">Days!</span>
              </h1>

              <p className="font-body text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Race up crazy hills, zoom on stunt bikes, and battle dragons! 🐉
                The most fun game stories for kids — all in one colorful place!
                🎉
              </p>

              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {[
                  { label: "🏎️ Hill Climbing", color: "oklch(0.65_0.25_15)" },
                  { label: "🚴 Stunt Bike", color: "oklch(0.65_0.22_38)" },
                  { label: "🐉 Adventure", color: "oklch(0.62_0.22_290)" },
                  { label: "🧙 Fantasy", color: "oklch(0.68_0.2_210)" },
                ].map((tag, i) => (
                  <motion.span
                    key={tag.label}
                    className="bg-white border-4 rounded-full px-4 py-1.5 font-body font-bold text-sm text-foreground shadow-md"
                    style={{ borderColor: `oklch(${tag.color})` }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    {tag.label}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="flex-shrink-0 relative"
              initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.7,
                ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
                delay: 0.1,
              }}
            >
              <div className="animate-float">
                <img
                  src="/assets/generated/hero-controller-transparent.dim_400x400.png"
                  alt="Game Controller"
                  className="w-64 h-64 sm:w-80 sm:h-80 object-contain drop-shadow-2xl"
                />
              </div>
              <Star
                className="absolute -top-4 -right-2"
                size={34}
                color="oklch(0.87 0.18 95)"
                delay={0}
              />
              <Star
                className="absolute -bottom-2 -left-4"
                size={26}
                color="oklch(0.65 0.22 38)"
                delay={0.8}
              />
              <Star
                className="absolute top-1/2 -right-6"
                size={22}
                color="oklch(0.72 0.18 220)"
                delay={0.4}
              />
              <Star
                className="absolute top-4 left-2"
                size={18}
                color="oklch(0.62 0.22 290)"
                delay={1.2}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== PLAY GAMES BANNER ===== */}
      <section className="py-10 px-6 bg-gradient-to-r from-[oklch(0.92_0.1_270)] via-[oklch(0.95_0.1_200)] to-[oklch(0.92_0.1_140)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-6 justify-between bg-white rounded-3xl border-4 border-border p-6 sm:p-8 shadow-lg featured-card-border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="text-5xl sm:text-6xl animate-bounce">🎮</div>
              <div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground">
                  25+ Real Games!
                </h2>
                <p className="font-body text-muted-foreground">
                  25+ fun games to play right now — action, puzzles, memory &
                  more!
                </p>
              </div>
            </div>
            <button
              type="button"
              data-ocid="home.games_button"
              onClick={onPlayGames}
              className="flex-shrink-0 featured-badge text-white font-display font-extrabold text-xl px-8 py-4 rounded-2xl shadow-[0_6px_0_0_oklch(0.4_0.2_210)] hover:shadow-[0_3px_0_0_oklch(0.4_0.2_210)] hover:translate-y-[3px] active:shadow-none active:translate-y-[6px] transition-all duration-100 cursor-pointer whitespace-nowrap"
            >
              🎮 Let’s Play!
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===== STORIES SECTION ===== */}
      <section className="py-12 px-6 hero-pattern">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl mb-2">
              <span className="rainbow-text">🌟 Pick Your Game Story!</span>
            </h2>
            <p className="font-body text-muted-foreground text-lg">
              Tap a category to find your favorite!
            </p>
          </motion.div>

          {/* Category Filters */}
          <div
            className="flex flex-wrap gap-3 justify-center mb-10"
            role="tablist"
          >
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                role="tab"
                data-ocid="nav.tab"
                aria-selected={activeFilter === filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-2xl font-body font-bold text-base
                  border-4 transition-all duration-200 cursor-pointer
                  ${
                    activeFilter === filter.value
                      ? "bg-foreground text-background border-foreground shadow-[0_5px_0_0_oklch(0.08_0.02_280)]"
                      : "bg-white border-border text-foreground hover:border-foreground hover:-translate-y-1"
                  }
                `}
              >
                <span className="text-xl">{filter.emoji}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          {/* Error */}
          {isError && (
            <div data-ocid="stories.error_state" className="text-center py-16">
              <div className="text-6xl mb-4">😢</div>
              <p className="font-display font-bold text-2xl text-foreground">
                Oops! Something went wrong.
              </p>
              <p className="font-body text-muted-foreground">
                Please try again later!
              </p>
            </div>
          )}

          {/* FEATURED STORIES */}
          {visibleFeatured.length > 0 && (
            <div className="mb-12">
              <motion.div
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="featured-badge h-1.5 w-12 rounded-full" />
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl">
                  <span className="rainbow-text">🎮 Big Game Stories</span>
                </h3>
                <div className="featured-badge h-1.5 flex-1 rounded-full" />
              </motion.div>

              <div
                data-ocid="stories.list"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {visibleFeatured.map((story, idx) => (
                  <FeaturedCard
                    key={story.id.toString()}
                    story={story}
                    index={idx}
                    onRead={onReadStory}
                  />
                ))}
              </div>
            </div>
          )}

          {/* REGULAR STORIES GRID */}
          {(activeFilter === "all" ||
            visibleFeatured.length === 0 ||
            !!stories?.length) && (
            <div>
              {visibleFeatured.length > 0 && (
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-border h-1.5 w-12 rounded-full" />
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground">
                    📚 More Stories
                  </h3>
                  <div className="bg-border h-1.5 flex-1 rounded-full" />
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isLoading
                    ? SKELETON_KEYS.map((k) => <StoryCardSkeleton key={k} />)
                    : stories?.map((story, index) => {
                        const catConfig = categoryConfig(story.category);
                        const coverImg = getStoryCoverImage(story);
                        const ocidIndex = index + FEATURED_STORIES.length + 1;

                        return (
                          <motion.article
                            key={story.id.toString()}
                            data-ocid={`stories.item.${ocidIndex}`}
                            className="story-card bg-white rounded-3xl overflow-hidden border-4 border-border cursor-pointer group"
                            variants={cardVariants}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ y: -8, rotate: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                            onClick={() => onReadStory(story)}
                          >
                            <div className="relative overflow-hidden">
                              <img
                                src={coverImg}
                                alt={story.title}
                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              {catConfig && (
                                <div
                                  className={`absolute top-3 left-3 ${catConfig.bgClass} ${catConfig.textClass} flex items-center gap-1.5 px-3 py-1 rounded-full font-body font-bold text-sm shadow-md`}
                                >
                                  <span>{catConfig.emoji}</span>
                                  <span>{catConfig.label}</span>
                                </div>
                              )}
                            </div>

                            <div className="p-5">
                              <h3 className="font-display font-bold text-xl text-foreground mb-2 leading-tight">
                                {story.title}
                              </h3>
                              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                                {story.description}
                              </p>

                              <Button
                                data-ocid={`story.read_button.${ocidIndex}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onReadStory(story);
                                }}
                                className={`
                                  w-full h-12 rounded-2xl font-body font-bold text-base
                                  ${catConfig ? catConfig.bgClass : "bg-primary"}
                                  text-white border-0
                                  shadow-[0_5px_0_0_oklch(0.45_0.22_38)]
                                  hover:shadow-[0_3px_0_0_oklch(0.45_0.22_38)] hover:translate-y-[2px]
                                  active:shadow-none active:translate-y-[5px] transition-all duration-100
                                `}
                              >
                                📖 Read Story!
                              </Button>
                            </div>
                          </motion.article>
                        );
                      })}

                  {!isLoading &&
                    stories?.length === 0 &&
                    visibleFeatured.length === 0 && (
                      <motion.div
                        data-ocid="stories.empty_state"
                        className="col-span-full text-center py-20"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <div className="text-8xl mb-4">📭</div>
                        <h3 className="font-display font-bold text-3xl text-foreground mb-2">
                          No Stories Here Yet!
                        </h3>
                        <p className="font-body text-muted-foreground text-lg">
                          Check back soon for more adventures! 🌟
                        </p>
                      </motion.div>
                    )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
