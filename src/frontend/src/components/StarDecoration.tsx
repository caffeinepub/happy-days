import { motion } from "motion/react";

interface StarProps {
  className?: string;
  size?: number;
  color?: string;
  delay?: number;
}

export function Star({
  className = "",
  size = 24,
  color = "oklch(0.87 0.18 95)",
  delay = 0,
}: StarProps) {
  return (
    <motion.svg
      role="img"
      aria-label="star"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 0.9, 1] }}
      transition={{
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        delay,
        ease: "easeInOut",
      }}
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </motion.svg>
  );
}

export function Sparkle({
  className = "",
  size = 20,
  color = "oklch(0.65 0.22 38)",
  delay = 0,
}: StarProps) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{ opacity: [1, 0.3, 1], scale: [1, 0.7, 1] }}
      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay }}
    >
      <svg
        role="img"
        aria-label="sparkle"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
      >
        <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" />
      </svg>
    </motion.div>
  );
}
