# Happy Days

## Current State
The site has a HomePage with stories grid and featured stories, a StoryPage for reading stories, a NavBar, and a Footer. Navigation is controlled via React state in App.tsx (selectedStory determines which page shows). Stories come from backend. The site uses a colorful kid-friendly design with rainbow borders.

## Requested Changes (Diff)

### Add
- A Games section on the HomePage below the stories section with 3 playable browser mini-games
- GamesPage component with a game launcher that lets kids pick and play a game
- 3 mini-games built with HTML Canvas / React state:
  1. **Jungle Jump** -- side-scrolling endless runner. A character jumps over obstacles by pressing Space or tapping. Score increases over time. Game over on collision.
  2. **Treasure Memory Match** -- flip-card memory matching game. 12 cards (6 pairs) with treasure-themed emoji icons. Find all pairs to win. Shows move count and time.
  3. **Magic Kingdom Quiz** -- multiple-choice trivia quiz with 8 kid-friendly questions about fantasy/fairy tale themes. Shows score at end.
- Nav bar gets a "Games" button alongside the logo area
- App.tsx routing: add `currentView` state: 'home' | 'story' | 'games' | 'game-detail'

### Modify
- App.tsx: extend routing to support a games view and individual game view
- NavBar: add a Games nav button
- HomePage: add a "Play Games!" section banner linking to the games page

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/pages/GamesPage.tsx` -- games lobby showing 3 game cards with Play buttons
2. Create `src/frontend/src/games/JungleJump.tsx` -- canvas-based endless runner
3. Create `src/frontend/src/games/MemoryMatch.tsx` -- flip card memory game in React
4. Create `src/frontend/src/games/MagicQuiz.tsx` -- quiz game in React
5. Create `src/frontend/src/pages/GamePage.tsx` -- wrapper page that renders the selected game
6. Update `App.tsx` to add games routing and NavBar Games button
7. Update `HomePage.tsx` to add a Games section/banner
