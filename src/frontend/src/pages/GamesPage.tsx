import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AirHockey } from "../games/AirHockey";
import { AnimalSoundsQuiz } from "../games/AnimalSoundsQuiz";
import { BalloonBattle } from "../games/BalloonBattle";
import { BalloonPop } from "../games/BalloonPop";
import { BalloonRide } from "../games/BalloonRide";
import { Battleship } from "../games/Battleship";
import { BrickBreaker } from "../games/BrickBreaker";
import { BubbleShooter } from "../games/BubbleShooter";
import { CardWar } from "../games/CardWar";
import { CatchStar } from "../games/CatchStar";
import { Checkers } from "../games/Checkers";
import { ColorClash } from "../games/ColorClash";
import { ColorFill } from "../games/ColorFill";
import { ColorMatch } from "../games/ColorMatch";
import { ColorSwap } from "../games/ColorSwap";
import { ColorTag } from "../games/ColorTag";
import { ConnectFour } from "../games/ConnectFour";
import { CountObjects } from "../games/CountObjects";
import { DinoRun } from "../games/DinoRun";
import { DotConnect } from "../games/DotConnect";
import { DotsAndBoxes } from "../games/DotsAndBoxes";
import { EmojiPairs } from "../games/EmojiPairs";
import { FishTank } from "../games/FishTank";
import { FlagQuiz } from "../games/FlagQuiz";
import { FoodQuiz } from "../games/FoodQuiz";
import { FrogJump } from "../games/FrogJump";
import { FruitCatch } from "../games/FruitCatch";
import { GemCollector } from "../games/GemCollector";
import { IceBreaker } from "../games/IceBreaker";
import { JungleJump } from "../games/JungleJump";
import { LetterMatch } from "../games/LetterMatch";
import { MagicQuiz } from "../games/MagicQuiz";
import { MathChallenge } from "../games/MathChallenge";
import { MathDuel } from "../games/MathDuel";
import { MazeSolver } from "../games/MazeSolver";
import { MemoryMatch } from "../games/MemoryMatch";
import { NinjaVsPirate } from "../games/NinjaVsPirate";
import { NumberDuel } from "../games/NumberDuel";
import { NumberGuess } from "../games/NumberGuess";
import { NumberPop } from "../games/NumberPop";
import { PaintBucket } from "../games/PaintBucket";
import { PatternCopy } from "../games/PatternCopy";
import { PingPong } from "../games/PingPong";
import { ReactionTap } from "../games/ReactionTap";
import { RockPaperScissors } from "../games/RockPaperScissors";
import { RocketRacer } from "../games/RocketRacer";
import { ShadowMatch } from "../games/ShadowMatch";
import { ShapeMatch } from "../games/ShapeMatch";
import { SimonSays } from "../games/SimonSays";
import { Snake } from "../games/Snake";
import { SnowballFight } from "../games/SnowballFight";
import { SoccerDuel } from "../games/SoccerDuel";
import { SpaceShooter } from "../games/SpaceShooter";
import { SpeedMath } from "../games/SpeedMath";
import { SpellingBee } from "../games/SpellingBee";
import { SpinWheel } from "../games/SpinWheel";
import { StarPatrol } from "../games/StarPatrol";
import { SumoPush } from "../games/SumoPush";
import { TankBattle } from "../games/TankBattle";
import { TicTacToe } from "../games/TicTacToe";
import { TicTacToe5x5 } from "../games/TicTacToe5x5";
import { TreasureHunt2P } from "../games/TreasureHunt2P";
import { TriviaBattle } from "../games/TriviaBattle";
import { TypingSpeed } from "../games/TypingSpeed";
import { WhackAMole } from "../games/WhackAMole";
import { WordBattle } from "../games/WordBattle";
import { WordBuilder } from "../games/WordBuilder";
import { WordRace } from "../games/WordRace";
import { WordScramble } from "../games/WordScramble";

type Category =
  | "All"
  | "Action"
  | "Memory"
  | "Puzzle"
  | "Adventure"
  | "2 Player";

interface Game {
  id: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  accentColor: string;
  category: Category;
  twoPlayer?: boolean;
}

const GAMES: Game[] = [
  {
    id: "jungle-jump",
    title: "Jungle Jump",
    emoji: "🦁",
    description: "Help the lion jump over cacti! How far can you go?",
    color: "from-[oklch(0.85_0.15_95)] to-[oklch(0.78_0.18_140)]",
    accentColor: "oklch(0.62 0.22 140)",
    category: "Action",
  },
  {
    id: "memory-match",
    title: "Memory Match",
    emoji: "🧠",
    description: "Flip cards to find matching pairs of magical treasures!",
    color: "from-[oklch(0.85_0.12_220)] to-[oklch(0.78_0.16_270)]",
    accentColor: "oklch(0.62 0.22 270)",
    category: "Memory",
  },
  {
    id: "magic-quiz",
    title: "Magic Quiz",
    emoji: "🧙",
    description: "Answer magical questions about dragons and wizards!",
    color: "from-[oklch(0.85_0.12_300)] to-[oklch(0.78_0.16_330)]",
    accentColor: "oklch(0.62 0.22 310)",
    category: "Puzzle",
  },
  {
    id: "color-match",
    title: "Color Match",
    emoji: "🎨",
    description: "Can you name the correct color? Test your color knowledge!",
    color: "from-[oklch(0.88_0.14_15)] to-[oklch(0.82_0.18_38)]",
    accentColor: "oklch(0.62 0.22 38)",
    category: "Puzzle",
  },
  {
    id: "number-guess",
    title: "Number Guess",
    emoji: "🔢",
    description: "Guess my secret number from 1 to 100! Hot or cold hints!",
    color: "from-[oklch(0.88_0.12_200)] to-[oklch(0.82_0.16_230)]",
    accentColor: "oklch(0.60 0.20 230)",
    category: "Puzzle",
  },
  {
    id: "balloon-pop",
    title: "Balloon Pop",
    emoji: "🎈",
    description: "Pop balloons before they float away!",
    color: "from-[oklch(0.87_0.14_340)] to-[oklch(0.82_0.18_10)]",
    accentColor: "oklch(0.62 0.22 10)",
    category: "Action",
  },
  {
    id: "word-scramble",
    title: "Word Scramble",
    emoji: "🔤",
    description: "Unscramble the mixed-up words!",
    color: "from-[oklch(0.88_0.12_140)] to-[oklch(0.82_0.16_170)]",
    accentColor: "oklch(0.55 0.20 155)",
    category: "Puzzle",
  },
  {
    id: "reaction-tap",
    title: "Reaction Tap",
    emoji: "⚡",
    description: "Tap as fast as you can when it turns green!",
    color: "from-[oklch(0.88_0.14_95)] to-[oklch(0.82_0.18_120)]",
    accentColor: "oklch(0.55 0.22 120)",
    category: "Action",
  },
  {
    id: "catch-star",
    title: "Catch the Stars",
    emoji: "⭐",
    description: "Move your basket to catch falling stars!",
    color: "from-[oklch(0.70_0.16_260)] to-[oklch(0.60_0.18_280)]",
    accentColor: "oklch(0.78 0.18 95)",
    category: "Action",
  },
  {
    id: "emoji-pairs",
    title: "Emoji Pairs",
    emoji: "🐼",
    description: "Find matching emoji pairs!",
    color: "from-[oklch(0.85_0.14_270)] to-[oklch(0.78_0.18_300)]",
    accentColor: "oklch(0.62 0.22 290)",
    category: "Memory",
  },
  {
    id: "snake",
    title: "Snake",
    emoji: "🐍",
    description: "Guide the snake to eat food and grow longer!",
    color: "from-[oklch(0.75_0.18_140)] to-[oklch(0.65_0.20_160)]",
    accentColor: "oklch(0.55 0.20 145)",
    category: "Action",
  },
  {
    id: "tic-tac-toe",
    title: "Tic-Tac-Toe",
    emoji: "✖️",
    description: "Play X vs O vs computer or a friend!",
    color: "from-[oklch(0.85_0.10_220)] to-[oklch(0.78_0.14_240)]",
    accentColor: "oklch(0.58 0.20 230)",
    category: "Puzzle",
    twoPlayer: true,
  },
  {
    id: "whack-a-mole",
    title: "Whack-a-Mole",
    emoji: "🐹",
    description: "Whack the moles before they hide!",
    color: "from-[oklch(0.82_0.14_95)] to-[oklch(0.75_0.18_115)]",
    accentColor: "oklch(0.60 0.20 100)",
    category: "Action",
  },
  {
    id: "typing-speed",
    title: "Typing Speed",
    emoji: "⌨️",
    description: "Type words as fast as you can!",
    color: "from-[oklch(0.85_0.10_200)] to-[oklch(0.78_0.14_220)]",
    accentColor: "oklch(0.58 0.18 210)",
    category: "Puzzle",
  },
  {
    id: "math-challenge",
    title: "Math Challenge",
    emoji: "🧮",
    description: "Solve addition and subtraction problems!",
    color: "from-[oklch(0.88_0.16_75)] to-[oklch(0.82_0.18_95)]",
    accentColor: "oklch(0.62 0.22 80)",
    category: "Puzzle",
  },
  {
    id: "rock-paper-scissors",
    title: "Rock Paper Scissors",
    emoji: "✊",
    description: "Choose Rock, Paper, or Scissors vs the computer!",
    color: "from-[oklch(0.82_0.14_15)] to-[oklch(0.75_0.18_35)]",
    accentColor: "oklch(0.60 0.22 25)",
    category: "Action",
  },
  {
    id: "ping-pong",
    title: "Ping Pong",
    emoji: "🎴",
    description: "Play pong vs AI or a friend!",
    color: "from-[oklch(0.70_0.14_230)] to-[oklch(0.62_0.18_250)]",
    accentColor: "oklch(0.60 0.20 240)",
    category: "Action",
    twoPlayer: true,
  },
  {
    id: "fruit-catch",
    title: "Fruit Catch",
    emoji: "🍎",
    description: "Catch falling fruits with your basket!",
    color: "from-[oklch(0.85_0.15_95)] to-[oklch(0.80_0.18_120)]",
    accentColor: "oklch(0.60 0.22 105)",
    category: "Action",
  },
  {
    id: "letter-match",
    title: "Letter Match",
    emoji: "📖",
    description: "Match uppercase letters to their lowercase twins!",
    color: "from-[oklch(0.88_0.14_50)] to-[oklch(0.82_0.18_70)]",
    accentColor: "oklch(0.62 0.22 60)",
    category: "Puzzle",
  },
  {
    id: "count-objects",
    title: "Count Objects",
    emoji: "🧮",
    description: "Count the emojis on screen!",
    color: "from-[oklch(0.85_0.12_290)] to-[oklch(0.78_0.16_315)]",
    accentColor: "oklch(0.60 0.22 305)",
    category: "Puzzle",
  },
  {
    id: "maze-solver",
    title: "Maze Solver",
    emoji: "🗣️",
    description: "Navigate through mazes to find the exit!",
    color: "from-[oklch(0.72_0.16_150)] to-[oklch(0.62_0.20_175)]",
    accentColor: "oklch(0.55 0.22 160)",
    category: "Adventure",
  },
  {
    id: "spelling-bee",
    title: "Spelling Bee",
    emoji: "🐝",
    description: "Build animal words from scrambled letters!",
    color: "from-[oklch(0.88_0.16_75)] to-[oklch(0.82_0.18_55)]",
    accentColor: "oklch(0.65 0.22 70)",
    category: "Puzzle",
  },
  {
    id: "bubble-shooter",
    title: "Bubble Shooter",
    emoji: "🎈",
    description: "Shoot colored bubbles and match 3 or more!",
    color: "from-[oklch(0.72_0.16_270)] to-[oklch(0.62_0.20_290)]",
    accentColor: "oklch(0.58 0.22 280)",
    category: "Action",
  },
  {
    id: "dot-connect",
    title: "Dot Connect",
    emoji: "🔵",
    description: "Click the numbered dots in order!",
    color: "from-[oklch(0.85_0.12_220)] to-[oklch(0.78_0.16_245)]",
    accentColor: "oklch(0.58 0.20 235)",
    category: "Puzzle",
  },
  {
    id: "color-fill",
    title: "Color Fill",
    emoji: "🎨",
    description: "Paint the shapes with the right colors!",
    color: "from-[oklch(0.88_0.14_15)] to-[oklch(0.82_0.18_45)]",
    accentColor: "oklch(0.60 0.22 30)",
    category: "Puzzle",
  },
  // original 2-player games
  {
    id: "connect-four",
    title: "Connect Four",
    emoji: "🔴",
    description: "Drop discs and connect 4 in a row! Player 1 vs Player 2!",
    color: "from-[oklch(0.75_0.18_30)] to-[oklch(0.65_0.22_50)]",
    accentColor: "oklch(0.55 0.22 40)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "word-battle",
    title: "Word Battle",
    emoji: "📝",
    description: "Two players race to unscramble words! 10 rounds!",
    color: "from-[oklch(0.78_0.14_290)] to-[oklch(0.68_0.18_310)]",
    accentColor: "oklch(0.58 0.22 300)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "rocket-racer",
    title: "Rocket Racer",
    emoji: "🚀",
    description: "Race rockets to the finish line! Avoid obstacles!",
    color: "from-[oklch(0.20_0.10_260)] to-[oklch(0.35_0.14_280)]",
    accentColor: "oklch(0.60 0.20 260)",
    category: "2 Player",
    twoPlayer: true,
  },
  // new 2-player games
  {
    id: "checkers",
    title: "Checkers",
    emoji: "🔴",
    description:
      "Classic checkers! Jump over pieces to capture them. King your pieces to rule the board!",
    color: "from-[oklch(0.80_0.14_30)] to-[oklch(0.70_0.18_50)]",
    accentColor: "oklch(0.55 0.20 40)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "air-hockey",
    title: "Air Hockey",
    emoji: "🏒",
    description:
      "Fast-paced air hockey! W/S vs Arrow Keys. First to 5 goals wins!",
    color: "from-[oklch(0.25_0.12_240)] to-[oklch(0.35_0.16_260)]",
    accentColor: "oklch(0.55 0.20 240)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "tank-battle",
    title: "Tank Battle",
    emoji: "🪖",
    description:
      "Drive tanks and shoot at each other! WASD vs Arrows. 3 lives each!",
    color: "from-[oklch(0.45_0.14_140)] to-[oklch(0.35_0.16_160)]",
    accentColor: "oklch(0.50 0.18 145)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "math-duel",
    title: "Math Duel",
    emoji: "➕",
    description:
      "Race to solve math problems! First to type the right answer wins the round!",
    color: "from-[oklch(0.88_0.16_75)] to-[oklch(0.82_0.18_55)]",
    accentColor: "oklch(0.62 0.22 65)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "dots-and-boxes",
    title: "Dots & Boxes",
    emoji: "⬜",
    description: "Draw lines to complete boxes! Player with most boxes wins!",
    color: "from-[oklch(0.85_0.10_220)] to-[oklch(0.78_0.14_240)]",
    accentColor: "oklch(0.58 0.18 230)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "word-race",
    title: "Word Race",
    emoji: "🏎️",
    description:
      "Type the same word faster than your opponent! 10 rounds of typing speed!",
    color: "from-[oklch(0.78_0.16_155)] to-[oklch(0.68_0.18_170)]",
    accentColor: "oklch(0.55 0.20 160)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "balloon-battle",
    title: "Balloon Battle",
    emoji: "🎈",
    description:
      "Pop your balloons before the timer runs out! 30 seconds of popping fun!",
    color: "from-[oklch(0.88_0.14_340)] to-[oklch(0.82_0.18_10)]",
    accentColor: "oklch(0.62 0.22 350)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "card-war",
    title: "Card War",
    emoji: "🃏",
    description:
      "Draw cards and the higher card wins! 10 rounds of card battle!",
    color: "from-[oklch(0.30_0.10_300)] to-[oklch(0.40_0.14_320)]",
    accentColor: "oklch(0.60 0.18 310)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "color-clash",
    title: "Color Clash",
    emoji: "🎨",
    description: "Click tiles to color them! Most tiles in 30 seconds wins!",
    color: "from-[oklch(0.78_0.18_280)] to-[oklch(0.68_0.20_300)]",
    accentColor: "oklch(0.58 0.22 290)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "ninja-vs-pirate",
    title: "Ninja vs Pirate",
    emoji: "🥷",
    description:
      "Attack, Block or Special! Pick your move and battle to zero HP!",
    color: "from-[oklch(0.20_0.08_250)] to-[oklch(0.35_0.12_270)]",
    accentColor: "oklch(0.55 0.18 260)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "snowball-fight",
    title: "Snowball Fight",
    emoji: "❄️",
    description:
      "Throw snowballs at the other player! A/D+W vs Arrows. Hit 3 times to win!",
    color: "from-[oklch(0.85_0.08_210)] to-[oklch(0.78_0.10_230)]",
    accentColor: "oklch(0.55 0.14 220)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "soccer-duel",
    title: "Soccer Duel",
    emoji: "⚽",
    description:
      "Score goals in this 2-player soccer game! W/S vs Up/Down arrows!",
    color: "from-[oklch(0.68_0.16_145)] to-[oklch(0.55_0.18_160)]",
    accentColor: "oklch(0.50 0.18 152)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "trivia-battle",
    title: "Trivia Battle",
    emoji: "🧠",
    description:
      "Answer trivia questions first! P1 uses 1-4 keys, P2 uses Q-R keys!",
    color: "from-[oklch(0.78_0.14_280)] to-[oklch(0.68_0.18_300)]",
    accentColor: "oklch(0.58 0.22 290)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "treasure-hunt-2p",
    title: "Treasure Hunt",
    emoji: "💎",
    description:
      "Take turns revealing tiles! Find treasure, avoid bombs. Most stars wins!",
    color: "from-[oklch(0.82_0.16_55)] to-[oklch(0.72_0.18_75)]",
    accentColor: "oklch(0.60 0.22 65)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "tictactoe-5x5",
    title: "Super Tic-Tac-Toe",
    emoji: "✖️",
    description:
      "5x5 grid, need 4 in a row to win! X is Player 1, O is Player 2!",
    color: "from-[oklch(0.85_0.10_220)] to-[oklch(0.78_0.14_240)]",
    accentColor: "oklch(0.58 0.20 230)",
    category: "2 Player",
    twoPlayer: true,
  },
  // new 2-player games (batch 2)
  {
    id: "battleship",
    title: "Battleship",
    emoji: "🚢",
    description:
      "Place your fleet and sink the enemy ships! Classic naval battle!",
    color: "from-[oklch(0.25_0.10_230)] to-[oklch(0.38_0.14_250)]",
    accentColor: "oklch(0.50 0.18 240)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "color-tag",
    title: "Color Tag",
    emoji: "🎨",
    description:
      "Race to tag colored squares! WASD+Space vs Arrows+Enter. 30 seconds!",
    color: "from-[oklch(0.82_0.18_25)] to-[oklch(0.72_0.20_45)]",
    accentColor: "oklch(0.58 0.22 35)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "number-duel",
    title: "Number Duel",
    emoji: "🔢",
    description:
      "Both players answer the same math question! First correct answer wins!",
    color: "from-[oklch(0.88_0.16_55)] to-[oklch(0.82_0.18_75)]",
    accentColor: "oklch(0.62 0.22 65)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "sumo-push",
    title: "Sumo Push",
    emoji: "🤼",
    description:
      "Push your opponent off the platform! A/D vs Arrow Keys. 3 lives!",
    color: "from-[oklch(0.78_0.14_50)] to-[oklch(0.68_0.18_70)]",
    accentColor: "oklch(0.55 0.20 60)",
    category: "2 Player",
    twoPlayer: true,
  },
  {
    id: "ice-breaker",
    title: "Ice Breaker",
    emoji: "🧊",
    description:
      "Take turns removing ice blocks! Don't be the one to remove the last!",
    color: "from-[oklch(0.82_0.10_210)] to-[oklch(0.72_0.14_230)]",
    accentColor: "oklch(0.55 0.18 220)",
    category: "2 Player",
    twoPlayer: true,
  },
  // solo games
  {
    id: "dino-run",
    title: "Dino Run",
    emoji: "🦕",
    description: "Jump over rocks and run as far as you can!",
    color: "from-[oklch(0.82_0.14_140)] to-[oklch(0.72_0.18_160)]",
    accentColor: "oklch(0.55 0.20 150)",
    category: "Action",
  },
  {
    id: "space-shooter",
    title: "Space Shooter",
    emoji: "🚀",
    description: "Shoot asteroids from space! Move and fire!",
    color: "from-[oklch(0.20_0.10_260)] to-[oklch(0.35_0.14_280)]",
    accentColor: "oklch(0.60 0.20 270)",
    category: "Action",
  },
  {
    id: "brick-breaker",
    title: "Brick Breaker",
    emoji: "🧡",
    description: "Break all the bricks with the ball and paddle!",
    color: "from-[oklch(0.75_0.16_30)] to-[oklch(0.65_0.20_50)]",
    accentColor: "oklch(0.55 0.22 40)",
    category: "Action",
  },
  {
    id: "frog-jump",
    title: "Frog Jump",
    emoji: "🐸",
    description: "Hop across lily pads without falling!",
    color: "from-[oklch(0.82_0.16_140)] to-[oklch(0.72_0.18_160)]",
    accentColor: "oklch(0.55 0.20 150)",
    category: "Adventure",
  },
  {
    id: "fish-tank",
    title: "Fish Tank",
    emoji: "🐠",
    description: "Click fish before they swim away! 30 seconds!",
    color: "from-[oklch(0.72_0.14_220)] to-[oklch(0.60_0.18_240)]",
    accentColor: "oklch(0.55 0.20 230)",
    category: "Action",
  },
  {
    id: "color-swap",
    title: "Color Swap",
    emoji: "🌈",
    description: "Name the right color from 4 choices! 15 rounds!",
    color: "from-[oklch(0.85_0.14_15)] to-[oklch(0.78_0.18_35)]",
    accentColor: "oklch(0.60 0.22 25)",
    category: "Puzzle",
  },
  {
    id: "shape-match",
    title: "Shape Match",
    emoji: "🔷",
    description: "Match the shape to the right answer! 15 rounds!",
    color: "from-[oklch(0.80_0.12_240)] to-[oklch(0.70_0.16_260)]",
    accentColor: "oklch(0.58 0.20 250)",
    category: "Puzzle",
  },
  {
    id: "animal-sounds",
    title: "Animal Sounds Quiz",
    emoji: "🐾",
    description: "Which animal makes this sound? 10 questions!",
    color: "from-[oklch(0.85_0.14_95)] to-[oklch(0.78_0.18_120)]",
    accentColor: "oklch(0.60 0.22 105)",
    category: "Puzzle",
  },
  {
    id: "food-quiz",
    title: "Food Quiz",
    emoji: "🍎",
    description: "Healthy eating and food knowledge quiz!",
    color: "from-[oklch(0.85_0.16_35)] to-[oklch(0.78_0.18_55)]",
    accentColor: "oklch(0.62 0.22 45)",
    category: "Puzzle",
  },
  {
    id: "flag-quiz",
    title: "Flag Quiz",
    emoji: "🌍",
    description: "Guess the country from its flag! 10 flags!",
    color: "from-[oklch(0.78_0.12_220)] to-[oklch(0.68_0.16_240)]",
    accentColor: "oklch(0.56 0.20 230)",
    category: "Puzzle",
  },
  {
    id: "simon-says",
    title: "Simon Says",
    emoji: "🎵",
    description: "Repeat the color sequence! Gets longer each round!",
    color: "from-[oklch(0.80_0.14_300)] to-[oklch(0.70_0.18_320)]",
    accentColor: "oklch(0.58 0.22 310)",
    category: "Memory",
  },
  {
    id: "number-pop",
    title: "Number Pop",
    emoji: "🔢",
    description: "Pop numbers in order 1 to 20 before time runs out!",
    color: "from-[oklch(0.78_0.14_210)] to-[oklch(0.68_0.18_230)]",
    accentColor: "oklch(0.56 0.20 220)",
    category: "Puzzle",
  },
  {
    id: "speed-math",
    title: "Speed Math",
    emoji: "⚡",
    description: "Solve math problems fast! 5 seconds per question!",
    color: "from-[oklch(0.88_0.16_75)] to-[oklch(0.82_0.18_95)]",
    accentColor: "oklch(0.62 0.22 85)",
    category: "Puzzle",
  },
  {
    id: "pattern-copy",
    title: "Pattern Copy",
    emoji: "🎨",
    description: "Remember and recreate the color pattern!",
    color: "from-[oklch(0.75_0.16_280)] to-[oklch(0.65_0.20_300)]",
    accentColor: "oklch(0.58 0.22 290)",
    category: "Memory",
  },
  {
    id: "spin-wheel",
    title: "Spin the Wheel",
    emoji: "🎡",
    description: "Spin for a fun surprise prize! Animated wheel!",
    color: "from-[oklch(0.88_0.16_55)] to-[oklch(0.82_0.18_75)]",
    accentColor: "oklch(0.65 0.22 65)",
    category: "Action",
  },
  {
    id: "shadow-match",
    title: "Shadow Match",
    emoji: "🌑",
    description: "Guess the object from its shadow silhouette!",
    color: "from-[oklch(0.40_0.08_260)] to-[oklch(0.30_0.10_280)]",
    accentColor: "oklch(0.55 0.18 270)",
    category: "Puzzle",
  },
  // new solo games (batch 2)
  {
    id: "paint-bucket",
    title: "Paint Bucket",
    emoji: "🖌️",
    description:
      "Copy the target color pattern! Pick colors and fill the grid!",
    color: "from-[oklch(0.88_0.14_25)] to-[oklch(0.82_0.18_45)]",
    accentColor: "oklch(0.62 0.22 35)",
    category: "Puzzle",
  },
  {
    id: "balloon-ride",
    title: "Balloon Ride",
    emoji: "🎈",
    description:
      "Steer your balloon through walls without crashing! Arrow keys or buttons!",
    color: "from-[oklch(0.72_0.14_200)] to-[oklch(0.62_0.18_220)]",
    accentColor: "oklch(0.55 0.20 210)",
    category: "Action",
  },
  {
    id: "gem-collector",
    title: "Gem Collector",
    emoji: "💎",
    description:
      "Collect falling gems and dodge bombs! 30 seconds of gem hunting!",
    color: "from-[oklch(0.30_0.12_280)] to-[oklch(0.40_0.16_300)]",
    accentColor: "oklch(0.58 0.22 290)",
    category: "Action",
  },
  {
    id: "word-builder",
    title: "Word Builder",
    emoji: "📝",
    description:
      "Click letters in the right order to spell the word! 10 rounds!",
    color: "from-[oklch(0.82_0.14_290)] to-[oklch(0.72_0.18_310)]",
    accentColor: "oklch(0.58 0.22 300)",
    category: "Puzzle",
  },
  {
    id: "star-patrol",
    title: "Star Patrol",
    emoji: "⭐",
    description:
      "Catch falling stars and avoid moons! Speed increases over time!",
    color: "from-[oklch(0.22_0.10_260)] to-[oklch(0.35_0.14_280)]",
    accentColor: "oklch(0.70 0.20 90)",
    category: "Action",
  },
];

const CATEGORIES: Category[] = [
  "All",
  "Action",
  "Memory",
  "Puzzle",
  "Adventure",
  "2 Player",
];
const CATEGORY_EMOJI: Record<Category, string> = {
  All: "🎮",
  Action: "🎉",
  Memory: "🧠",
  Puzzle: "🧮",
  Adventure: "🗺️",
  "2 Player": "👥",
};

function GameCard({
  game,
  index,
  onPlay,
}: { game: Game; index: number; onPlay: (id: string) => void }) {
  return (
    <motion.div
      data-ocid={`games.item.${index + 1}`}
      className="bg-white rounded-3xl overflow-hidden border-4 border-border shadow-lg group cursor-pointer"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: Math.min(index * 0.03, 0.5),
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => onPlay(game.id)}
    >
      <div
        className={`bg-gradient-to-br ${game.color} h-40 flex flex-col items-center justify-center relative overflow-hidden`}
      >
        <motion.div
          className="text-7xl drop-shadow-lg"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: index * 0.3,
          }}
        >
          {game.emoji}
        </motion.div>
        <span className="absolute top-2 right-2 text-xs font-body font-bold bg-white/80 rounded-full px-2 py-0.5">
          {game.category}
        </span>
        {game.twoPlayer && (
          <span className="absolute top-2 left-2 text-xs font-body font-bold bg-purple-500 text-white rounded-full px-2 py-0.5">
            👥 2P
          </span>
        )}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4">
        <h3 className="font-display font-extrabold text-xl text-foreground mb-1">
          {game.title}
        </h3>
        <p className="font-body text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">
          {game.description}
        </p>
        <button
          type="button"
          data-ocid={`games.play_button.${index + 1}`}
          onClick={(e) => {
            e.stopPropagation();
            onPlay(game.id);
          }}
          className="w-full py-3 rounded-2xl font-display font-extrabold text-base text-white border-0 transition-all duration-100 cursor-pointer hover:translate-y-[2px] active:translate-y-[4px]"
          style={{
            backgroundColor: game.accentColor,
            boxShadow: "0 4px 0 0 oklch(0.40 0.20 38)",
          }}
        >
          🎮 Play!
        </button>
      </div>
    </motion.div>
  );
}

function GameArea({ gameId, onBack }: { gameId: string; onBack: () => void }) {
  const game = GAMES.find((g) => g.id === gameId);
  if (!game) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          data-ocid="games.back_button"
          onClick={onBack}
          className="flex items-center gap-2 bg-white border-4 border-border px-5 py-3 rounded-2xl font-body font-bold text-foreground hover:border-foreground transition-all hover:-translate-y-0.5 cursor-pointer shadow-sm text-lg"
        >
          ← Back to Games
        </button>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{game.emoji}</span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground">
            {game.title}
          </h2>
        </div>
      </div>
      <div className="bg-white border-4 border-border rounded-3xl p-2 sm:p-6 shadow-lg overflow-x-hidden">
        {gameId === "jungle-jump" && <JungleJump />}
        {gameId === "memory-match" && <MemoryMatch />}
        {gameId === "magic-quiz" && <MagicQuiz />}
        {gameId === "color-match" && <ColorMatch />}
        {gameId === "number-guess" && <NumberGuess />}
        {gameId === "balloon-pop" && <BalloonPop />}
        {gameId === "word-scramble" && <WordScramble />}
        {gameId === "reaction-tap" && <ReactionTap />}
        {gameId === "catch-star" && <CatchStar />}
        {gameId === "emoji-pairs" && <EmojiPairs />}
        {gameId === "snake" && <Snake />}
        {gameId === "tic-tac-toe" && <TicTacToe />}
        {gameId === "whack-a-mole" && <WhackAMole />}
        {gameId === "typing-speed" && <TypingSpeed />}
        {gameId === "math-challenge" && <MathChallenge />}
        {gameId === "rock-paper-scissors" && <RockPaperScissors />}
        {gameId === "ping-pong" && <PingPong />}
        {gameId === "fruit-catch" && <FruitCatch />}
        {gameId === "letter-match" && <LetterMatch />}
        {gameId === "count-objects" && <CountObjects />}
        {gameId === "maze-solver" && <MazeSolver />}
        {gameId === "spelling-bee" && <SpellingBee />}
        {gameId === "bubble-shooter" && <BubbleShooter />}
        {gameId === "dot-connect" && <DotConnect />}
        {gameId === "color-fill" && <ColorFill />}
        {gameId === "connect-four" && <ConnectFour />}
        {gameId === "word-battle" && <WordBattle />}
        {gameId === "rocket-racer" && <RocketRacer />}
        {gameId === "checkers" && <Checkers />}
        {gameId === "air-hockey" && <AirHockey />}
        {gameId === "tank-battle" && <TankBattle />}
        {gameId === "math-duel" && <MathDuel />}
        {gameId === "dots-and-boxes" && <DotsAndBoxes />}
        {gameId === "word-race" && <WordRace />}
        {gameId === "balloon-battle" && <BalloonBattle />}
        {gameId === "card-war" && <CardWar />}
        {gameId === "color-clash" && <ColorClash />}
        {gameId === "ninja-vs-pirate" && <NinjaVsPirate />}
        {gameId === "snowball-fight" && <SnowballFight />}
        {gameId === "soccer-duel" && <SoccerDuel />}
        {gameId === "trivia-battle" && <TriviaBattle />}
        {gameId === "treasure-hunt-2p" && <TreasureHunt2P />}
        {gameId === "tictactoe-5x5" && <TicTacToe5x5 />}
        {gameId === "battleship" && <Battleship />}
        {gameId === "color-tag" && <ColorTag />}
        {gameId === "number-duel" && <NumberDuel />}
        {gameId === "sumo-push" && <SumoPush />}
        {gameId === "ice-breaker" && <IceBreaker />}
        {gameId === "dino-run" && <DinoRun />}
        {gameId === "space-shooter" && <SpaceShooter />}
        {gameId === "brick-breaker" && <BrickBreaker />}
        {gameId === "frog-jump" && <FrogJump />}
        {gameId === "fish-tank" && <FishTank />}
        {gameId === "color-swap" && <ColorSwap />}
        {gameId === "shape-match" && <ShapeMatch />}
        {gameId === "animal-sounds" && <AnimalSoundsQuiz />}
        {gameId === "food-quiz" && <FoodQuiz />}
        {gameId === "flag-quiz" && <FlagQuiz />}
        {gameId === "simon-says" && <SimonSays />}
        {gameId === "number-pop" && <NumberPop />}
        {gameId === "speed-math" && <SpeedMath />}
        {gameId === "pattern-copy" && <PatternCopy />}
        {gameId === "spin-wheel" && <SpinWheel />}
        {gameId === "shadow-match" && <ShadowMatch />}
        {gameId === "paint-bucket" && <PaintBucket />}
        {gameId === "balloon-ride" && <BalloonRide />}
        {gameId === "gem-collector" && <GemCollector />}
        {gameId === "word-builder" && <WordBuilder />}
        {gameId === "star-patrol" && <StarPatrol />}
      </div>
    </motion.div>
  );
}

export function GamesPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredGames =
    activeCategory === "All"
      ? GAMES
      : GAMES.filter((g) => g.category === activeCategory);

  return (
    <div className="min-h-screen hero-pattern py-4 sm:py-12 px-2 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {activeGame ? (
            <GameArea
              key="game-area"
              gameId={activeGame}
              onBack={() => setActiveGame(null)}
            />
          ) : (
            <motion.div
              key="lobby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="font-display font-extrabold text-5xl sm:text-7xl mb-4">
                  <span className="rainbow-text">🎮 70 Games!</span>
                </h2>
                <p className="font-body text-muted-foreground text-xl">
                  Pick any game and play right now! No downloads needed! 🌟
                </p>
              </motion.div>
              <div
                className="flex flex-wrap gap-3 justify-center mb-8"
                role="tablist"
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    data-ocid="games.tab"
                    aria-selected={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-2xl font-body font-bold text-base border-4 transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-foreground text-background border-foreground"
                        : "bg-white border-border text-foreground hover:border-foreground"
                    }`}
                  >
                    <span>{CATEGORY_EMOJI[cat]}</span>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
              <div
                data-ocid="games.list"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredGames.map((game, i) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    index={i}
                    onPlay={setActiveGame}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
