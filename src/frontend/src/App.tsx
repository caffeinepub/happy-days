import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Story } from "./backend.d";
import { Star } from "./components/StarDecoration";
import { GamesPage } from "./pages/GamesPage";
import { HomePage } from "./pages/HomePage";
import { StoryPage } from "./pages/StoryPage";

const queryClient = new QueryClient();

type CurrentView = "home" | "story" | "games";

function RainbowFrame() {
  return (
    <>
      <div className="rainbow-border-top" />
      <div className="rainbow-border-bottom" />
      <div className="rainbow-border-left" />
      <div className="rainbow-border-right" />
    </>
  );
}

function NavBar({
  onHome,
  onGames,
  currentView,
}: {
  onHome: () => void;
  onGames: () => void;
  currentView: CurrentView;
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          type="button"
          data-ocid="nav.home_link"
          onClick={onHome}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <span className="text-2xl group-hover:animate-bounce">🎮</span>
          <span className="font-display font-extrabold text-xl sm:text-2xl">
            <span className="rainbow-text">Happy Days</span>
          </span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="nav.games_link"
            onClick={onGames}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-2xl font-body font-bold text-sm border-4 transition-all duration-200 cursor-pointer
              ${
                currentView === "games"
                  ? "bg-foreground text-background border-foreground shadow-[0_4px_0_0_oklch(0.08_0.02_280)]"
                  : "bg-white border-border text-foreground hover:border-foreground hover:-translate-y-0.5"
              }
            `}
          >
            <span>🎮</span>
            <span className="hidden sm:inline">Play Games!</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 ml-1">
            <Star size={18} color="oklch(0.87 0.18 95)" delay={0} />
            <Star size={16} color="oklch(0.65 0.22 38)" delay={0.4} />
            <Star size={18} color="oklch(0.72 0.18 220)" delay={0.8} />
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const utm = encodeURIComponent(window.location.hostname);
  return (
    <footer className="border-t-4 border-border bg-white py-8 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {[
            "🏎️ Hill Climbing Racing",
            "🚴 Stunt Bike",
            "🐉 Adventure",
            "🧙 Fantasy",
            "🤖 Puzzle",
          ].map((tag) => (
            <span
              key={tag}
              className="bg-muted rounded-full px-3 py-1 font-body text-sm text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="rainbow-text font-display font-extrabold text-2xl mb-2">
          Happy Days 🌈
        </div>
        <p className="font-body text-muted-foreground text-sm">
          © {year}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${utm}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}

function AppContent() {
  const [currentView, setCurrentView] = useState<CurrentView>("home");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const handleHome = () => {
    setCurrentView("home");
    setSelectedStory(null);
  };

  const handleGames = () => {
    setCurrentView("games");
    setSelectedStory(null);
  };

  const handleReadStory = (story: Story) => {
    setSelectedStory(story);
    setCurrentView("story");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <RainbowFrame />
      <NavBar
        onHome={handleHome}
        onGames={handleGames}
        currentView={currentView}
      />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === "story" && selectedStory ? (
            <motion.div
              key="story"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StoryPage story={selectedStory} onClose={handleHome} />
            </motion.div>
          ) : currentView === "games" ? (
            <motion.div
              key="games"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GamesPage />
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HomePage
                onReadStory={handleReadStory}
                onPlayGames={handleGames}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
