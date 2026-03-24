# Happy Days

## Current State
- StoryPage renders a full scrollable page with a cover image, animated paragraphs, and a "The End" card
- Stories are shown as a static single-page layout; all paragraphs scroll vertically
- Sparkles and Stars decorations exist but are subtle
- HomePage shows story cards that open StoryPage

## Requested Changes (Diff)

### Add
- Slideshow mode for StoryPage: break each story's content array into individual slides (1-2 paragraphs per slide), navigated with large Left/Right arrow buttons and a page indicator (dots)
- Smooth sliding animation between story pages (slide left/right transition using AnimatePresence)
- Confetti burst animation on story start and on "The End" screen
- Bouncing/floating animated characters (emoji characters: stars, hearts, rainbows) on each slide
- Rainbow sparkle effects and color bursts between slides
- More vibrant, happy color scheme on story slides (colorful backgrounds per slide)
- "The End" screen with big confetti, bouncy stars, and cheerful text animation
- Touch swipe support for sliding between pages on mobile

### Modify
- StoryPage: replace vertical scroll layout with horizontal slideshow layout
- Each slide gets a colorful gradient background (rotating through rainbow colors)
- Navigation arrows are large, colorful, and bouncy
- Page dots indicator at the bottom of each slide
- Back button remains at top left

### Remove
- Nothing removed

## Implementation Plan
1. Create a `Confetti` component that spawns animated confetti particles (CSS keyframe animations)
2. Create a `Slideshow` component that wraps story content and handles slide navigation, swipe gestures, and slide transitions
3. Update `StoryPage` to split `story.content` into slides (groups of 2 paragraphs) and render via Slideshow
4. Add colorful per-slide backgrounds cycling through rainbow gradient palette
5. Add bouncing emoji decorations (stars, hearts, rainbows) that float on each slide
6. Add confetti burst on slide 1 load and on "The End" final slide
7. Animate slide transitions using AnimatePresence with x-axis slide direction
8. Add swipe gesture detection (touch start/end) for mobile navigation
9. Style navigation arrows as large, rounded, colorful buttons with spring bounce animation
