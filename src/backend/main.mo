import Array "mo:core/Array";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";

actor {
  type Category = {
    #adventure;
    #fantasy;
    #puzzle;
    #racing;
  };

  type Story = {
    id : Nat;
    title : Text;
    category : Category;
    description : Text;
    content : [Text];
    coverPath : Text;
  };

  func initializeStories() : [Story] {
    [
      {
        id = 1;
        title = "Jungle Quest";
        category = #adventure;
        description = "An exciting adventure in a mysterious jungle full of hidden secrets and wild creatures!";
        content = [
          "Zoe was ten years old and absolutely fearless. One summer morning, she woke up to find a mysterious map tucked under her pillow. It showed a jungle trail with a giant golden star at the end — and it had her name written at the top!",
          "She packed her backpack with a torch, a sandwich, and her trusty magnifying glass. Then she ran straight into the jungle at the edge of town. The trees were enormous, with leaves as big as umbrellas and flowers that glowed pink in the shade.",
          "The first challenge came at a rope bridge over a rushing river. The bridge was old and creaky, swaying in the wind. Zoe took a deep breath, held the ropes tight, and tiptoed across one step at a time. When she reached the other side, a little green parrot clapped its wings and cried, \"Brave! Brave!\"",
          "Deeper in the jungle, Zoe found a family of monkeys blocking the path. They were holding her map and chattering with excitement. She offered them her sandwich and they went wild with joy! They led her through the trees to a hidden waterfall that sparkled like diamonds in the sunlight.",
          "Behind the waterfall was a cave. Inside the cave was a treasure chest overflowing with colorful jewels, golden coins, and a shiny medal that read: FOR THE BRAVEST EXPLORER. Zoe put the medal around her neck and it fit perfectly.",
          "She found her way home just as the sun was setting. Her family was waiting at the door with wide eyes. When Zoe showed them the medal and told her story, everyone cheered. That night, she placed the map on her bedroom wall and smiled. There were still so many more adventures waiting for her!",
        ];
        coverPath = "/images/jungle_quest.jpg";
      },
      {
        id = 2;
        title = "Magic Kingdom";
        category = #fantasy;
        description = "A magical journey through an enchanted kingdom where anything is possible!";
        content = [
          "Finn had always believed in magic — even when everyone else had stopped. So when a tiny glowing door appeared in his bedroom wall one Tuesday night, he was the only one brave enough to open it.",
          "On the other side was the Magic Kingdom, a land where the clouds were made of cotton candy, the rivers flowed with sparkling lemonade, and the trees grew giant lollipops instead of fruit. Finn gasped so loudly that a nearby unicorn turned around and winked at him.",
          "A friendly wizard named Goldie appeared in a puff of purple smoke. She had a hat covered in tiny spinning stars and a wand shaped like a candy cane. \"Welcome, Finn!\" she said. \"We have been waiting for you. Our kingdom's magic stone has gone missing, and only a true believer can find it!\"",
          "Finn followed a trail of glowing footprints through the Enchanted Forest, where talking mushrooms gave him directions, fireflies lit up secret paths, and a grumpy but kind-hearted troll let him cross his rainbow bridge in exchange for a joke. Finn told the best joke he knew, and the troll laughed so hard his belly shook like a bowl of jelly.",
          "At the top of Crystal Mountain, Finn found the magic stone inside a giant flower that only bloomed for those who truly believed in wonder. He held it up and the whole kingdom lit up with brilliant golden light. Fireworks burst across the cotton candy sky!",
          "Goldie gave Finn a tiny piece of the magic stone to keep forever. \"Whenever you believe,\" she said, \"magic follows.\" Finn stepped back through the little door, and even though his bedroom looked the same as always, he knew — somewhere behind the wall — the Magic Kingdom was always shining.",
        ];
        coverPath = "/images/magic_kingdom.jpg";
      },
      {
        id = 3;
        title = "Treasure Hunt";
        category = #adventure;
        description = "A thrilling hunt for hidden treasure across the island with your best friends!";
        content = [
          "It all started with an old bottle washing up on the beach. Inside was a rolled-up piece of parchment — a treasure map! Best friends Kai, Rosa, and Sam stared at it with huge eyes. \"We have to find it,\" said Kai, and the others nodded immediately.",
          "The map showed three clues across Coconut Island. The first clue was hidden \"where the tallest tree meets the oldest rock.\" They searched the forest until Rosa spotted a hollow at the base of a massive ancient rock covered in moss. Inside was a small carved wooden box with the next clue!",
          "The second clue said \"follow the singing stream to where it falls into the sea.\" They followed a cheerful little stream through fields of bright wildflowers. Along the way they saw a family of baby turtles waddling toward the water, which was so cute that they almost forgot about the treasure.",
          "At the waterfall, Sam spotted a glint of gold behind the rushing water. They found a golden key hanging on a hook carved right into the rock. The final clue on the map showed a cave at the northern tip of the island, marked with a big red X.",
          "The cave was dark and cool. Using their torches, they followed the rocky path until their lights sparkled off something incredible — a huge wooden chest covered in barnacles and sea jewels. Kai used the golden key, the lock clicked, and the lid swung open!",
          "Inside were gold coins, sparkling gemstones, and three matching friendship bracelets made of gold and shells. They each put one on, grinning ear to ear. They never kept the treasure — they donated the coins to their school and the gems to a museum. But the bracelets? Those they kept forever.",
        ];
        coverPath = "/images/treasure_hunt.jpg";
      },
      {
        id = 4;
        title = "Puzzle Castle";
        category = #puzzle;
        description = "Can you solve all the puzzles in the mysterious castle? Only the cleverest kids can!";
        content = [
          "Nobody had entered Puzzle Castle in one hundred years. The villagers said it was enchanted — that only someone with a truly clever mind could ever reach the treasure room inside. When twelve-year-old Priya heard this, she marched straight to the castle gates.",
          "The front gate itself was the first puzzle. A stone panel had nine squares, each with a different animal carved on it. Priya noticed the animals were in almost alphabetical order — cat, dog, elephant, frog — but one was missing. She pressed the \"gorilla\" panel, and the gates swung open with a great CLUNK!",
          "Room after room held new challenges. In the Library Room, she had to arrange colored books so that no two the same color sat next to each other. In the Mirror Room, she had to figure out which reflection was slightly wrong. In the Number Tower, she climbed stairs by solving math riddles — and each correct answer lit up a golden step beneath her feet.",
          "The trickiest puzzle was the Star Room — a large circular chamber where twelve star-shaped tiles on the floor had to be stepped on in the right order. Priya studied the constellations painted on the ceiling, matched them to the floor tiles, and tiptoed through the correct path without making a single mistake.",
          "Behind the final door was the treasure room, filled not with gold but with something even better — thousands of amazing books, science kits, art supplies, and games. Sitting on top was a letter that said: \"This castle was built for the cleverest child of each generation. It is now yours to explore.\"",
          "Priya ran home and gathered all her friends. Together they spent the whole summer in Puzzle Castle, solving every puzzle, reading every book, and building incredible things. The castle had waited one hundred years for someone like Priya — and she had been absolutely worth the wait.",
        ];
        coverPath = "/images/puzzle_castle.jpg";
      },
      {
        id = 5;
        title = "Dragon's Cave";
        category = #fantasy;
        description = "A dragon who needs help and the brave heroes who answer the call!";
        content = [
          "The whole kingdom was afraid of the dragon that lived in the cave on Mount Ember. They said it breathed fire all day and all night, and that the mountain was too dangerous to climb. But twins Milo and Cleo had heard strange sounds coming from the cave — not roars, but something that sounded an awful lot like crying.",
          "Armed with a lantern and a basket of food, the twins climbed up the mountain path. The ground was warm beneath their feet and the air smelled of smoke. As they reached the cave entrance, a small purple dragon poked its head out. Its eyes were huge and wet with tears.",
          "\"Please don't be frightened,\" said Cleo softly. The dragon hiccuped, and a small flame popped from its nose. That was when they realized — every time it hiccuped or cried, it accidentally breathed fire! That was why the mountain had seemed so dangerous. The dragon couldn't help it!",
          "Its name was Ember, and it had been alone for months after its family flew south for the winter. Milo shared the food from the basket — fruit, cheese, and honey cakes — and Ember ate every crumb with great happiness, sighing warm, gentle puffs of smoke. Then it curled up and fell fast asleep, clearly exhausted from all the accidental fire-breathing.",
          "The twins visited every day that autumn. Cleo taught Ember breathing exercises to stop the hiccups, and Milo built a cozy nest of soft hay and blankets at the cave entrance. The villagers, watching from below, slowly began to realize the dragon was not a monster at all — just a lonely little creature who needed friends.",
          "When spring came, Ember's family returned with a joyful roar that shook the mountain. Ember leaped into the sky with them, circling overhead three times before flying south — but always looking back at the two tiny figures waving from below. From that day on, every year when spring arrived, a shower of harmless golden sparks would rain over the village. Ember's way of saying thank you.",
        ];
        coverPath = "/images/dragons_cave.jpg";
      },
      {
        id = 6;
        title = "Speed Racer";
        category = #racing;
        description = "From the last place to the finish line — the most thrilling race of all time!";
        content = [
          "Jasper had the slowest car on the track. Everyone knew it. His kart was old, a little rusty, and painted the most ordinary shade of yellow. The other racers had shiny new vehicles with spoilers and glowing wheels. But Jasper had something they didn't — he had spent an entire year learning every single corner of every single track.",
          "The day of the Grand Championship finally arrived. Eight racers lined up at the start line. When the flag dropped, Jasper's car sputtered and stalled for three full seconds. By the time his engine caught, he was already dead last. The crowd groaned.",
          "But Jasper didn't panic. He knew that the first corner was a long sweeping bend — and that most drivers braked too early. He braked at exactly the right moment and overtook two racers in one smooth move. The crowd sat up a little straighter.",
          "By lap three, Jasper was in fourth place. The rain began to fall, making the track slippery. The faster cars started sliding and spinning out. But Jasper had practiced in the rain every Tuesday afternoon for months. He floated through the wet corners like he was dancing.",
          "On the final lap, Jasper was right behind the leader — a tall boy named Rex who had won every race that season. Rex looked in his mirror and couldn't believe what he saw. That rusty yellow kart was right on his tail! He pressed his accelerator to the floor. But Jasper had one more trick: he knew a tight inside line on the last corner that Rex always missed.",
          "Jasper dove to the inside, squeezed through the gap, and burst across the finish line half a second ahead of Rex. The whole crowd erupted in cheers. Jasper climbed out of his little yellow kart and raised both fists high. He had proved what he always believed: it's not the fastest car that wins — it's the smartest driver.",
        ];
        coverPath = "/images/speed_racer.jpg";
      },
    ];
  };

  let storyMap = Map.empty<Nat, Story>();

  // Initialize with sample stories
  let initialStories = initializeStories();
  for (story in initialStories.values()) {
    storyMap.add(story.id, story);
  };

  public query ({ caller }) func getAllStories() : async [Story] {
    storyMap.values().toArray();
  };

  public query ({ caller }) func getStoriesByCategory(category : Category) : async [Story] {
    storyMap.values().toArray().filter(
      func(story) {
        story.category == category;
      }
    );
  };

  public query ({ caller }) func getStoryById(id : Nat) : async ?Story {
    storyMap.get(id);
  };
};
