import { Category } from "../backend.d";
import type { Story } from "../backend.d";

export const FEATURED_STORIES: Story[] = [
  {
    id: -1n,
    title: "Hill Climbing Racing 1",
    description:
      "Jump in your car and climb the craziest hills! Collect coins and don't flip over!",
    category: Category.racing,
    coverPath: "/assets/generated/story-hill-climbing-1.dim_400x300.jpg",
    content: [
      "Tim was just an ordinary kid who loved playing games on his tablet. One rainy afternoon, he discovered a game called Hill Climbing Racing. Little did he know, it would change everything!",
      "The game started simple enough — Tim had a tiny car with big bouncy wheels. The first hill was small and muddy. He pressed the gas and zoomed forward, coins sparkling all around him. 'Yahoo!' he shouted, nearly flipping his car at the top.",
      "Every coin Tim collected made his car stronger. First he got better tires that gripped the mud. Then a powerful engine that roared like a lion. The hills got steeper and crazier — some had giant rocks, deep valleys, and even jumps that sent his car flying through the air!",
      "Tim practiced every day after school. He learned exactly when to speed up on the downhill and when to brake carefully on the uphill. His favorite vehicle became the monster truck — it could crush right over the biggest rocks without even wobbling.",
      "One day Tim reached the legendary Frozen Highway level, covered in ice and snow. It was the hardest track ever! His car slipped and slid, but Tim never gave up. With a huge final jump, he soared over the finish line and earned the Golden Crown trophy.",
      "Tim smiled at his screen, coins raining down in celebration. He had started with a little car on a muddy hill, and now he was the champion of Hill Climbing Racing. And tomorrow? Tomorrow he would try Hill Climbing Racing 2!",
    ],
  },
  {
    id: -2n,
    title: "Hill Climbing Racing 2",
    description:
      "Even bigger hills, even cooler cars! Race with friends to the top!",
    category: Category.racing,
    coverPath: "/assets/generated/story-hill-climbing-2.dim_400x300.jpg",
    content: [
      "After winning Hill Climbing Racing 1, Tim couldn't wait to try the sequel. When Hill Climbing Racing 2 loaded up, his eyes went wide — the mountains were ENORMOUS and the cars were incredible!",
      "The biggest new feature was multiplayer racing. Tim could now race against his friends Zara and Leo in real time! They each chose their vehicle — Tim picked the monster truck, Zara chose a speedy sports car, and Leo jumped into a giant bus (which made everyone laugh).",
      "The first online race was on Mount Everest Peak. Snow flew everywhere, the wind howled, and all three cars slid and tumbled down the icy slopes. Leo's bus somehow managed to keep rolling forward even when completely upside down, which sent everyone into fits of giggles.",
      "Between races, Tim unlocked amazing new vehicles: a rocket-powered hovercraft, a medieval catapult cart, and even a giant pizza delivery scooter. Each one had completely different controls and physics, making every race totally unpredictable and hilarious.",
      "The coolest level was the Rainbow Canyon — a track that twisted through glowing gemstone caves with waterfalls made of liquid gold. Tim flew off a ramp, did three full flips in the air, and landed perfectly right in front of the finish line.",
      "After a whole afternoon of racing, Tim, Zara, and Leo were all tied on points. It was the most exciting championship ever. They promised to race again next weekend — and this time, they'd explore every single track in Hill Climbing Racing 2 together!",
    ],
  },
  {
    id: -3n,
    title: "Stunt Bike Adventure",
    description:
      "Zoom down ramps and do crazy flips on your awesome stunt bike!",
    category: Category.adventure,
    coverPath: "/assets/generated/story-stunt-bike.dim_400x300.jpg",
    content: [
      "Maya had always dreamed of flying. So when she discovered Stunt Bike Adventure, it felt like her dream had finally come true — at least on screen! She hopped on her virtual bike and headed for the very first ramp.",
      "The ramp launched her high into the air. Maya held her breath, tilted the controls, and her bike spun in a perfect backflip! She landed with a satisfying thud, coins exploding out of the ground. 'I DID IT!' she screamed.",
      "Every new stunt unlocked bigger ramps and crazier tricks. Maya learned the front flip, the 360 spin, and the legendary Double Superman — where the rider lets go of the handlebars and flies with arms outstretched like a superhero.",
      "The hardest level was the Mega Ramp Stadium, a giant arena filled with thousands of cheering fans. The ramp was as tall as a skyscraper! Maya's heart pounded as she revved her engine and rocketed up the slope at full speed.",
      "She launched off the top and soared higher than she'd ever gone before. Time seemed to slow down. She executed a Triple Backflip — the hardest trick in the entire game. The crowd went absolutely wild with cheers and confetti rained from the sky.",
      "Maya stuck the landing perfectly and raised her fists in triumph. She had gone from a nervous beginner to the greatest stunt bike performer in the world — all in one incredible afternoon. She bowed to the crowd, grinning from ear to ear, dreaming about tomorrow's even bigger adventure!",
    ],
  },
];

export function getFeaturedCoverImage(story: Story): string {
  if (story.id === -1n)
    return "/assets/generated/story-hill-climbing-1.dim_400x300.jpg";
  if (story.id === -2n)
    return "/assets/generated/story-hill-climbing-2.dim_400x300.jpg";
  if (story.id === -3n)
    return "/assets/generated/story-stunt-bike.dim_400x300.jpg";
  return story.coverPath;
}
