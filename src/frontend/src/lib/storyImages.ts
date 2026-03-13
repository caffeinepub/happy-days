import type { Story } from "../backend.d";
import { Category } from "../backend.d";

export function getStoryCoverImage(story: Story): string {
  const title = story.title.toLowerCase();

  if (title.includes("dragon"))
    return "/assets/generated/story-dragon-adventure.dim_400x300.jpg";
  if (
    title.includes("space") ||
    title.includes("rocket") ||
    title.includes("star")
  )
    return "/assets/generated/story-space-rocket.dim_400x300.jpg";
  if (
    title.includes("robot") ||
    title.includes("puzzle") ||
    title.includes("gear")
  )
    return "/assets/generated/story-robot-puzzle.dim_400x300.jpg";
  if (
    title.includes("race") ||
    title.includes("car") ||
    title.includes("speed")
  )
    return "/assets/generated/story-race-car.dim_400x300.jpg";
  if (
    title.includes("pirate") ||
    title.includes("treasure") ||
    title.includes("island")
  )
    return "/assets/generated/story-pirate-treasure.dim_400x300.jpg";
  if (
    title.includes("wizard") ||
    title.includes("spell") ||
    title.includes("magic") ||
    title.includes("witch")
  )
    return "/assets/generated/story-wizard-spells.dim_400x300.jpg";

  // Fallback by category
  switch (story.category) {
    case Category.adventure:
      return "/assets/generated/story-dragon-adventure.dim_400x300.jpg";
    case Category.fantasy:
      return "/assets/generated/story-wizard-spells.dim_400x300.jpg";
    case Category.puzzle:
      return "/assets/generated/story-robot-puzzle.dim_400x300.jpg";
    case Category.racing:
      return "/assets/generated/story-race-car.dim_400x300.jpg";
    default:
      return "/assets/generated/story-pirate-treasure.dim_400x300.jpg";
  }
}

export const CATEGORY_CONFIG = {
  adventure: {
    label: "Adventure",
    emoji: "🐉",
    bgClass: "bg-[oklch(0.65_0.22_38)]",
    textClass: "text-white",
    lightBg: "bg-[oklch(0.95_0.06_38)]",
    borderClass: "border-[oklch(0.65_0.22_38)]",
  },
  fantasy: {
    label: "Fantasy",
    emoji: "🧙",
    bgClass: "bg-[oklch(0.62_0.22_290)]",
    textClass: "text-white",
    lightBg: "bg-[oklch(0.95_0.06_290)]",
    borderClass: "border-[oklch(0.62_0.22_290)]",
  },
  puzzle: {
    label: "Puzzle",
    emoji: "🤖",
    bgClass: "bg-[oklch(0.68_0.2_210)]",
    textClass: "text-white",
    lightBg: "bg-[oklch(0.95_0.06_210)]",
    borderClass: "border-[oklch(0.68_0.2_210)]",
  },
  racing: {
    label: "Racing",
    emoji: "🏎️",
    bgClass: "bg-[oklch(0.65_0.25_15)]",
    textClass: "text-white",
    lightBg: "bg-[oklch(0.95_0.06_15)]",
    borderClass: "border-[oklch(0.65_0.25_15)]",
  },
} as const;
