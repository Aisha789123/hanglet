// English words, each with 3 clues: the riddle gets clearer.
//   clue 1 = smart and hard (wordplay, double meaning, "I" form)
//   clue 2 = clearer
//   clue 3 = almost the answer
// Rules (see tests/words.test.js): lowercase a-z only, at least 4 letters,
// exactly 3 clues, and the word itself never appears in its own clues.
// Every category needs short (4-5), medium (6-7) and long (8+) words.
// "winter" is only played in the winter season and never in the Daily.

export default {
  animals: [
    { word: "mole", clues: [
      "I'm a spy who never leaves the garden, and I work completely in the dark.",
      "I dig tunnels and leave little hills on the lawn.",
      "A small, almost blind digging animal with velvet fur.",
    ] },
    { word: "seal", clues: [
      "Kings pressed me into hot wax, but I'd rather balance a ball on my nose.",
      "I clap my flippers and lie on rocks by the sea.",
      "A sea mammal with whiskers that barks.",
    ] },
    { word: "crane", clues: [
      "I lift steel on building sites, and I also stand on one leg in the marsh.",
      "A tall grey bird with a long neck and long legs.",
      "A big wading bird that shares its name with a building machine.",
    ] },
    { word: "horse", clues: [
      "Lose your voice and people say you sound like me.",
      "I gallop and neigh, and my shoes are made of iron.",
      "A big animal you can ride with a saddle.",
    ] },
    { word: "tiger", clues: [
      "I'm the biggest cat of all, so please don't try to put me on your lap.",
      "I'm orange with black stripes and live in Asian jungles.",
      "The largest wild cat, with stripes.",
    ] },
    { word: "sloth", clues: [
      "I share my name with a deadly sin, and honestly, I'm too tired to argue.",
      "I hang upside down in the rainforest and move very slowly.",
      "The slowest animal in the trees, with long claws.",
    ] },
    { word: "goat", clues: [
      "Fans call their hero by my name: the Greatest Of All Time.",
      "I have a little beard, climb rocks and eat almost anything.",
      "A farm animal with horns that gives milk for cheese.",
    ] },
    { word: "parrot", clues: [
      "Tell me a secret and I'll tell everyone, word for word.",
      "I'm a bright green or red bird that can copy your voice.",
      "A colorful bird that can talk.",
    ] },
    { word: "turtle", clues: [
      "I'm a hundred years old and I still haven't moved out of my shell.",
      "I swim in the sea and lay my eggs on the beach.",
      "A slow reptile with a hard shell.",
    ] },
    { word: "penguin", clues: [
      "I'm always dressed for a fancy dinner, but I've never flown to one.",
      "I slide on my belly over the ice near the South Pole.",
      "A black and white bird that swims but cannot fly.",
    ] },
    { word: "octopus", clues: [
      "Ask me for a hug and you'll get eight of them.",
      "I squirt ink and squeeze through tiny gaps.",
      "A sea animal with eight arms.",
    ] },
    { word: "giraffe", clues: [
      "I'm always the first to know when it starts to rain.",
      "I eat leaves from the tops of trees on the savanna.",
      "The animal with the longest neck.",
    ] },
    { word: "beaver", clues: [
      "I'm a builder who never went to school and works only with my teeth.",
      "I build dams in rivers with sticks and mud.",
      "A furry animal with a flat tail and big front teeth.",
    ] },
    { word: "spider", clues: [
      "I was on the web long before the internet.",
      "I have eight legs and catch flies.",
      "A small animal that spins a web.",
    ] },
    { word: "elephant", clues: [
      "I always pack my trunk, but I never go on holiday.",
      "I'm big and grey, with huge ears and tusks.",
      "The largest land animal, with a trunk.",
    ] },
    { word: "kangaroo", clues: [
      "I'm a mother with a built-in pocket, and I never walk anywhere.",
      "I hop around Australia on strong back legs.",
      "An Australian animal that carries its baby in a pouch.",
    ] },
    { word: "flamingo", clues: [
      "Plastic copies of me stand in gardens, but the real me lives in salty lakes.",
      "I'm a pink bird that stands on one leg.",
      "A tall pink wading bird.",
    ] },
    { word: "squirrel", clues: [
      "I hide my savings in the ground and then forget where I put them.",
      "I have a bushy tail and climb the trees in the park.",
      "A small red or grey animal that collects nuts.",
    ] },
    { word: "chameleon", clues: [
      "I'm a master of disguise, and my eyes can look two ways at once.",
      "I catch insects with a super long, sticky tongue.",
      "A lizard that changes color.",
    ] },
    { word: "hedgehog", clues: [
      "I'm a ball of needles, but I've never sewn anything.",
      "I roll up when I'm scared and eat snails in your garden.",
      "A small prickly animal.",
    ] },
  ],

  food: [
    { word: "pear", clues: [
      "Say my name out loud and people think there are two of me.",
      "I'm a green or yellow fruit, wide at the bottom.",
      "A fruit shaped like a light bulb.",
    ] },
    { word: "toast", clues: [
      "At a wedding people raise their glasses to me, at breakfast they butter me.",
      "I'm bread that went into a hot machine and popped back up.",
      "Crunchy grilled bread for breakfast.",
    ] },
    { word: "pizza", clues: [
      "I was born in Naples, and now I'm delivered to doors all over the world.",
      "I'm flat dough with tomato sauce and melted cheese.",
      "An Italian dish you cut into slices.",
    ] },
    { word: "honey", clues: [
      "People call the ones they love by my name, but bees made me.",
      "I'm sweet, golden and sticky, and you spread me on bread.",
      "Sweet food made by bees.",
    ] },
    { word: "lemon", clues: [
      "When a car keeps breaking down, people call it by my name.",
      "I'm a yellow fruit that makes your face pucker.",
      "A sour yellow fruit.",
    ] },
    { word: "bread", clues: [
      "I'm slang for money, and I'm the reason the baker gets up so early.",
      "You slice me and put cheese or jam on me.",
      "A loaf you bake from flour.",
    ] },
    { word: "rice", clues: [
      "At weddings they throw me, at dinner they boil me.",
      "Small white grains that grow in wet fields in Asia.",
      "White grains you eat with curry.",
    ] },
    { word: "onion", clues: [
      "I'm like an ogre: I have layers.",
      "Chopping me makes your eyes water.",
      "A round vegetable with a papery brown skin.",
    ] },
    { word: "pickle", clues: [
      "When you're in trouble, people say you're in me.",
      "I'm a cucumber that went for a long swim in vinegar.",
      "A sour cucumber from a jar.",
    ] },
    { word: "pepper", clues: [
      "I make you sneeze from a little shaker, and I'm also a crunchy vegetable.",
      "I stand next to the salt on the table.",
      "A black spice, or a red, green or yellow vegetable.",
    ] },
    { word: "cookie", clues: [
      "Websites keep asking if they may give me to you.",
      "I'm sweet, round and crunchy, sometimes with chocolate chips.",
      "A small sweet baked treat.",
    ] },
    { word: "pancake", clues: [
      "Throw me in the air and hope I land back in the pan.",
      "I'm round and thin, and you eat me with syrup.",
      "A flat cake you bake in a frying pan.",
    ] },
    { word: "popcorn", clues: [
      "I explode in the kitchen, and nobody is ever scared of me.",
      "I'm the snack everyone eats in the cinema.",
      "Corn kernels that pop when you heat them.",
    ] },
    { word: "noodle", clues: [
      "Some people call your head by my name when they say 'use your...'.",
      "I'm long and wavy, and you slurp me from a bowl of soup.",
      "A long thin strip of pasta, popular in Asian food.",
    ] },
    { word: "cheese", clues: [
      "Say my name to the camera and you'll smile.",
      "Mice love me, and some of me has holes.",
      "Food made from milk, like Gouda or cheddar.",
    ] },
    { word: "sandwich", clues: [
      "I'm named after an English earl who didn't want to stop playing cards to eat.",
      "Two slices of bread with something tasty in between.",
      "What you pack for lunch: bread, filling, bread.",
    ] },
    { word: "broccoli", clues: [
      "I'm a little forest on your plate.",
      "I'm green, and many children push me to the side of the plate.",
      "A green vegetable with little tree-shaped florets.",
    ] },
    { word: "pineapple", clues: [
      "I wear a crown, but I'm no king, and I'm neither a pine nor an apple.",
      "I'm a tropical fruit with spiky skin.",
      "A yellow tropical fruit some people put on pizza.",
    ] },
    { word: "doughnut", clues: [
      "There's a hole in the middle of my story, and that's what makes me sweet.",
      "I'm a fried ring of dough, often with sugar or icing.",
      "A round sweet treat with a hole in the middle.",
    ] },
    { word: "spaghetti", clues: [
      "I'm long and thin, and I wrap myself around your fork.",
      "Italians eat me with meatballs or tomato sauce.",
      "Long thin strings of pasta.",
    ] },
    { word: "chocolate", clues: [
      "I started life as a bitter bean and became everyone's favorite treat.",
      "I come in bars, milk or dark, and I melt in your mouth.",
      "A sweet brown treat made from cocoa.",
    ] },
  ],

  home: [
    { word: "lamp", clues: [
      "I stand on your desk all day and only shine when it gets dark.",
      "Flick my switch and the room gets bright.",
      "Something with a bulb that gives light.",
    ] },
    { word: "towel", clues: [
      "I give you a big hug every time you step out of the shower.",
      "I hang on a hook in the bathroom.",
      "A soft cloth to dry yourself with.",
    ] },
    { word: "clock", clues: [
      "I'm always working, I never leave the wall, and people keep watching me.",
      "I tick and tock and tell you when to go.",
      "Something on the wall that shows the time.",
    ] },
    { word: "sofa", clues: [
      "Couch potatoes grow on me.",
      "I'm big and soft, and the whole family sits on me in front of the TV.",
      "A long soft seat in the living room.",
    ] },
    { word: "spoon", clues: [
      "I can hold your soup, and if you look closely you see yourself upside down in me.",
      "You stir your tea with me.",
      "Something you eat soup or cereal with.",
    ] },
    { word: "broom", clues: [
      "I make a clean sweep every day, and some people think I can fly.",
      "I have a long stick and lots of bristles at the bottom.",
      "A brush on a long handle for sweeping the floor.",
    ] },
    { word: "sink", clues: [
      "Ships do it by accident, but you wash the dishes in me on purpose.",
      "I'm in the kitchen and there's a tap above me.",
      "A basin with a tap and a drain.",
    ] },
    { word: "stamp", clues: [
      "Collectors keep me in albums, and I once cost only a few cents.",
      "I'm sticky on the back and I ride on an envelope.",
      "A small paper picture you need to post a letter.",
    ] },
    { word: "comb", clues: [
      "A bald man has no use for me at all.",
      "I tidy your hair with my teeth.",
      "A flat tool with teeth for your hair.",
    ] },
    { word: "alarm", clues: [
      "I'm the one sound everybody wants to switch off in the morning.",
      "I ring loudly when it's time to get out of bed.",
      "The clock sound that wakes you up.",
    ] },
    { word: "candle", clues: [
      "I'm at every birthday party, and in the end I always get blown out.",
      "I'm made of wax and give a little flame.",
      "A wax stick with a burning wick.",
    ] },
    { word: "mirror", clues: [
      "I'm totally honest about how you look in the morning, but I swap left and right.",
      "You look at me when you brush your hair.",
      "Shiny glass that shows your reflection.",
    ] },
    { word: "pillow", clues: [
      "Every night you whisper your dreams to me, and you drool on me a little.",
      "I'm soft and fluffy and I lie on your bed.",
      "A soft cushion for your head.",
    ] },
    { word: "sponge", clues: [
      "I soak up everything you tell me, just like a really good student.",
      "Squeeze me out over the sink.",
      "A soft yellow thing for washing dishes.",
    ] },
    { word: "bottle", clues: [
      "Sailors put messages in me and throw me into the sea.",
      "You fill me with water or juice and screw on a cap.",
      "A glass or plastic container for drinks.",
    ] },
    { word: "ladder", clues: [
      "In a stocking I'm bad news, but against a wall I help you reach the top.",
      "Lean me against a wall and climb up.",
      "Rungs between two long sides, for reaching high places.",
    ] },
    { word: "blanket", clues: [
      "In winter I'm the best hug you'll get from something that isn't alive.",
      "I'm soft and warm and lie on top of you in bed.",
      "A big warm cover for your bed.",
    ] },
    { word: "pencil", clues: [
      "Every time you sharpen my mind, I get a bit shorter.",
      "I write, but you can rub out my mistakes.",
      "A wooden stick with grey lead inside.",
    ] },
    { word: "teapot", clues: [
      "I have a belly, a spout and a lid, and I love to pour my heart out.",
      "You make a hot drink from leaves in me.",
      "A pot with a spout for brewing tea.",
    ] },
    { word: "umbrella", clues: [
      "I'm useless on sunny days, but when the clouds cry I'm the hero.",
      "Open me and hold me above your head.",
      "Something that keeps you dry in the rain.",
    ] },
    { word: "calendar", clues: [
      "My days are numbered, and after December I'm out of date.",
      "I hang on the wall and you write plans in my squares.",
      "A chart of all the days and months of the year.",
    ] },
    { word: "envelope", clues: [
      "I keep a letter's secrets until someone tears me open.",
      "You lick me or peel me to close me, and I get a stamp.",
      "A paper pocket for a letter.",
    ] },
    { word: "doorbell", clues: [
      "Press my button and I'll tell everyone inside that you're here.",
      "I ring when visitors arrive.",
      "The button next to the front door that rings.",
    ] },
    { word: "toothbrush", clues: [
      "I go into your mouth twice a day, and I'm a bit hairy.",
      "With toothpaste on me I clean your teeth.",
      "A small brush for your teeth.",
    ] },
    { word: "bookshelf", clues: [
      "I carry heavy stories on my back without ever opening one.",
      "I'm a piece of furniture full of books.",
      "A plank on the wall where your books stand.",
    ] },
  ],

  nature: [
    { word: "moon", clues: [
      "I go through phases, just like a teenager.",
      "Wolves howl at me and I light up the night.",
      "The big round light in the night sky.",
    ] },
    { word: "river", clues: [
      "I keep running all my life, and I only rest when I reach the sea.",
      "I flow from the mountains, and boats sail on me.",
      "A long stream of water, like the Nile.",
    ] },
    { word: "cloud", clues: [
      "Your photos are stored inside me, and I can also make it rain.",
      "I'm white and fluffy and float in the sky.",
      "A grey or white puff in the sky.",
    ] },
    { word: "storm", clues: [
      "I can fit in a teacup, but usually I rage out at sea.",
      "I bring thunder, lightning and lots of wind.",
      "Very bad weather.",
    ] },
    { word: "leaf", clues: [
      "You can turn me over in a book, or watch me fall from a tree.",
      "I'm green in summer and orange in autumn.",
      "A flat green part of a tree.",
    ] },
    { word: "rose", clues: [
      "The sun did me this morning, and I also bloom in the garden.",
      "I'm a red flower with thorns.",
      "A flower people give on Valentine's Day.",
    ] },
    { word: "beach", clues: [
      "In summer everybody lies on me, and nobody says sorry.",
      "I'm sandy and right next to the sea.",
      "A sandy place by the sea.",
    ] },
    { word: "shadow", clues: [
      "At noon I'm tiny, at sunset I'm a giant, and I'm always right behind you.",
      "I'm dark, and you can never catch me.",
      "The dark shape you make in the sun.",
    ] },
    { word: "rainbow", clues: [
      "I'm a bridge of colors that nobody can walk on.",
      "I appear when the sun shines during a shower.",
      "A colorful arch in the sky.",
    ] },
    { word: "volcano", clues: [
      "I'm a mountain with a very hot temper.",
      "Lava and smoke come out of my top.",
      "A mountain that can erupt.",
    ] },
    { word: "thunder", clues: [
      "I'm the drum roll after a flash in the sky.",
      "I rumble loudly during a storm.",
      "The loud bang after lightning.",
    ] },
    { word: "island", clues: [
      "I'm surrounded by water, but nobody calls me a ship.",
      "I'm a piece of land in the middle of the sea.",
      "Land with water all around it.",
    ] },
    { word: "desert", clues: [
      "Add one more S and I become the best part of dinner.",
      "I'm dry, sandy and hot, and camels love me.",
      "A dry place full of sand, like the Sahara.",
    ] },
    { word: "forest", clues: [
      "I'm full of trunks, but I've never been on a trip.",
      "Owls, deer and lots of trees live in me.",
      "A big area full of trees.",
    ] },
    { word: "bridge", clues: [
      "I let you walk over water without getting your feet wet.",
      "I join two sides, and boats sail under me.",
      "Something built across a river so you can cross it.",
    ] },
    { word: "mountain", clues: [
      "Climbers say they visit me just because I'm there.",
      "I'm very high and sometimes snowy at the top.",
      "A very high hill.",
    ] },
    { word: "waterfall", clues: [
      "I'm always taking a dive, and I never come up for air.",
      "Water tumbles down a cliff in me.",
      "A river that drops over a cliff.",
    ] },
    { word: "sunflower", clues: [
      "I keep turning my face towards my favorite star.",
      "I'm a tall yellow flower with seeds you can eat.",
      "A big yellow flower that follows the sun.",
    ] },
    { word: "lightning", clues: [
      "They say I never strike the same place twice.",
      "I'm a bright flash in the sky during a storm.",
      "An electric flash from the clouds.",
    ] },
    { word: "earthquake", clues: [
      "When I'm in a bad mood, the whole ground starts to dance.",
      "I make buildings shake and the ground crack.",
      "A strong shaking of the ground.",
    ] },
    { word: "seashell", clues: [
      "Hold me to your ear and I'll play you the sound of the sea.",
      "You find me empty and pretty on the beach.",
      "The hard home of a small sea creature.",
    ] },
  ],

  jobs: [
    { word: "chef", clues: [
      "I run the kitchen and I'm always stirring something up.",
      "I wear a tall white hat and cook in a restaurant.",
      "A professional cook.",
    ] },
    { word: "nurse", clues: [
      "I take your temperature, but I'm not the weather forecast.",
      "I work in a hospital and help the doctors.",
      "Someone who cares for patients in a hospital.",
    ] },
    { word: "pilot", clues: [
      "My office is above the clouds.",
      "I say 'this is your captain speaking' through the speakers.",
      "The person who flies a plane.",
    ] },
    { word: "judge", clues: [
      "I decide who's right, and I also sit on talent shows.",
      "I wear a black robe and bang a little hammer in court.",
      "The person who decides a court case.",
    ] },
    { word: "baker", clues: [
      "I'm up before the sun, and I always knead some dough.",
      "I make bread and cakes in a big oven.",
      "Someone who bakes bread for a living.",
    ] },
    { word: "actor", clues: [
      "I pretend all day, and people pay to watch me.",
      "I play roles in films and on stage.",
      "Someone who plays a part in a film.",
    ] },
    { word: "coach", clues: [
      "I'm a bus for long trips, but I also shout from the side of the field.",
      "I train a sports team.",
      "The trainer of a team.",
    ] },
    { word: "dentist", clues: [
      "I'm the only one who's happy when you open your mouth wide.",
      "I check your teeth and fill holes.",
      "A doctor for your teeth.",
    ] },
    { word: "farmer", clues: [
      "My office has no roof and smells a bit like cows.",
      "I grow crops and look after animals.",
      "Someone who works on a farm.",
    ] },
    { word: "barber", clues: [
      "I take a little off the top, and you pay me for it.",
      "I cut men's hair and trim beards.",
      "A hairdresser for men.",
    ] },
    { word: "plumber", clues: [
      "I'm the hero when your house starts crying in the bathroom.",
      "I fix leaking pipes and taps.",
      "Someone who repairs water pipes.",
    ] },
    { word: "teacher", clues: [
      "I have a class full of fans who all want the bell to ring.",
      "I give lessons and homework.",
      "Someone who gives lessons at school.",
    ] },
    { word: "painter", clues: [
      "I give houses a new coat without a needle or thread.",
      "I use brushes and rollers on walls.",
      "Someone who paints houses or pictures.",
    ] },
    { word: "lawyer", clues: [
      "I argue for a living and I never lose my temper.",
      "I help people in court and I know the law.",
      "Someone who gives legal advice.",
    ] },
    { word: "firefighter", clues: [
      "I run towards the heat when everyone else runs away.",
      "I ride a red truck with a long ladder and a hose.",
      "Someone who puts out fires.",
    ] },
    { word: "astronaut", clues: [
      "My business trips are out of this world.",
      "I wear a big suit and float in a space station.",
      "Someone who travels into space.",
    ] },
    { word: "detective", clues: [
      "I follow clues for a living, just like you're doing right now.",
      "I solve crimes with a magnifying glass.",
      "Someone who investigates mysteries and crimes.",
    ] },
    { word: "gardener", clues: [
      "My plans always start small: as a seed.",
      "I mow lawns, trim hedges and plant flowers.",
      "Someone who looks after a garden.",
    ] },
    { word: "magician", clues: [
      "I make things disappear, and people clap for it.",
      "I pull rabbits out of hats.",
      "Someone who does magic tricks.",
    ] },
    { word: "librarian", clues: [
      "Shhh! I look after thousands of stories and lend them all out.",
      "I help you find books and stamp the date to bring them back.",
      "Someone who works in a library.",
    ] },
  ],

  sports: [
    { word: "goal", clues: [
      "Every footballer dreams of me, and you also set me for the new year.",
      "The ball has to go into my net.",
      "The net between two posts where you score.",
    ] },
    { word: "chess", clues: [
      "In my game the king is very weak, and the queen does all the work.",
      "I'm played on a board with 64 black and white squares.",
      "A board game with kings, queens and pawns.",
    ] },
    { word: "dice", clues: [
      "I'm full of dots, and every roll of mine is a gamble.",
      "I have six sides and you throw me in board games.",
      "Small cubes with one to six dots.",
    ] },
    { word: "kite", clues: [
      "I fly without an engine, but someone always keeps me on a short leash.",
      "On windy days I dance high in the sky.",
      "A toy that flies on a long string.",
    ] },
    { word: "judo", clues: [
      "My name means 'the gentle way', but I throw people onto a mat.",
      "I'm a sport with belts in many colors.",
      "A Japanese fighting sport with throws.",
    ] },
    { word: "rugby", clues: [
      "My ball isn't even round, and I'm named after an English school.",
      "Players tackle and pass an oval ball backwards.",
      "A rough team sport with an egg-shaped ball.",
    ] },
    { word: "medal", clues: [
      "I hang around the necks of champions.",
      "I'm gold, silver or bronze.",
      "The prize you win at the Olympics.",
    ] },
    { word: "tennis", clues: [
      "In my game, love means zero.",
      "Players hit a yellow ball over a net with rackets.",
      "The sport played at Wimbledon.",
    ] },
    { word: "puzzle", clues: [
      "I come in a thousand pieces, and you're happy to put me together.",
      "You fit my pieces into one picture.",
      "A game of pieces that fit together.",
    ] },
    { word: "boxing", clues: [
      "I'm a sport, and I also give my name to the day after Christmas.",
      "Two people wear big gloves in a ring.",
      "A fighting sport with gloves.",
    ] },
    { word: "bowling", clues: [
      "Strike, spare or gutter: those are my favorite words.",
      "You roll a heavy ball at ten pins.",
      "A game where you knock down pins.",
    ] },
    { word: "cycling", clues: [
      "My biggest race lasts three weeks, and the leader wears yellow.",
      "A sport on two wheels.",
      "Riding a bike as a sport.",
    ] },
    { word: "trophy", clues: [
      "Winners lift me above their heads and kiss me.",
      "I'm a shiny cup for the champion.",
      "A prize cup.",
    ] },
    { word: "skating", clues: [
      "I'm a sport where you walk on knives.",
      "I glide over the ice on sharp blades.",
      "Moving over ice with skates on.",
    ] },
    { word: "balloon", clues: [
      "Fill me with your breath and I'll try to fly away from you.",
      "I pop when I meet a pin.",
      "A rubber toy you blow up for a party.",
    ] },
    { word: "football", clues: [
      "Most of the world names me after a foot, but in America I'm mostly played with hands.",
      "Two teams kick a ball and try to score.",
      "The sport with eleven players and a round ball.",
    ] },
    { word: "marathon", clues: [
      "I'm named after a Greek town and a very tired messenger.",
      "A running race of more than 42 kilometres.",
      "A very long running race.",
    ] },
    { word: "swimming", clues: [
      "I'm a sport where your feet never touch the ground.",
      "You do me in a pool, with breaststroke or crawl.",
      "Moving through water as a sport.",
    ] },
    { word: "basketball", clues: [
      "In my sport you score by throwing into something without a bottom.",
      "Players bounce a big orange ball and shoot at a hoop.",
      "A sport where you throw a ball through a hoop.",
    ] },
    { word: "skateboard", clues: [
      "I'm a board that never goes to meetings: I go to the park instead.",
      "I have four wheels and you ride me in a skate park.",
      "A board with wheels.",
    ] },
    { word: "olympics", clues: [
      "I visit a different city every four years, and a torch tells everyone I'm coming.",
      "The biggest sports event in the world, with gold medals.",
      "The world's greatest sports games, with five rings.",
    ] },
  ],

  music: [
    { word: "drum", clues: [
      "I only work when you beat me, and I never complain.",
      "I'm round and you hit me with sticks.",
      "A loud instrument you hit.",
    ] },
    { word: "piano", clues: [
      "My name means 'softly' in Italian, but I can be very loud.",
      "You press my black and white keys.",
      "A large keyboard instrument.",
    ] },
    { word: "flute", clues: [
      "I'm a pipe with holes, and I only sing when you blow across me.",
      "I'm a silver instrument you hold sideways.",
      "A thin wind instrument.",
    ] },
    { word: "choir", clues: [
      "I'm many voices that sound like one.",
      "We sing together in a church or a school.",
      "A group of singers.",
    ] },
    { word: "banjo", clues: [
      "I'm a drum with a neck and strings, and I love country music.",
      "I'm a round string instrument with a twangy sound.",
      "A string instrument from America with a round body.",
    ] },
    { word: "harp", clues: [
      "Angels are often painted with me in their arms.",
      "I have many strings and you pluck me.",
      "A big string instrument shaped like a triangle.",
    ] },
    { word: "song", clues: [
      "Birds have me without ever going to music school.",
      "I have a melody and words, and you sing me.",
      "Music with words that you sing.",
    ] },
    { word: "bell", clues: [
      "'Saved by me!' says a boxer, or a pupil at the end of a lesson.",
      "You hear me in a church tower or on a bike.",
      "Something that rings: ding dong.",
    ] },
    { word: "guitar", clues: [
      "Every rock star hugs me to their belly.",
      "You strum chords on me.",
      "A string instrument with a long neck.",
    ] },
    { word: "violin", clues: [
      "I sit under someone's chin and cry beautifully when they bow.",
      "You play me with a bow.",
      "A small string instrument.",
    ] },
    { word: "trumpet", clues: [
      "Elephants are said to do me with their trunks.",
      "I'm a shiny brass instrument with three buttons.",
      "A loud brass instrument you blow.",
    ] },
    { word: "concert", clues: [
      "I'm a party where everybody faces the same way.",
      "A band plays live music on stage for an audience.",
      "A live music show.",
    ] },
    { word: "melody", clues: [
      "I'm the part of a song you can't stop humming.",
      "A row of notes that sounds nice together.",
      "The tune of a song.",
    ] },
    { word: "rhythm", clues: [
      "I have no vowels except a sneaky Y, and I keep your feet tapping.",
      "I'm the beat of the music.",
      "The pattern of beats in music.",
    ] },
    { word: "singer", clues: [
      "My instrument is always with me, because it's in my throat.",
      "I use my voice at the front of a band.",
      "Someone who sings.",
    ] },
    { word: "orchestra", clues: [
      "We're a hundred people who all follow one person waving a stick.",
      "A big group playing violins, flutes and drums together.",
      "A large group of classical musicians.",
    ] },
    { word: "saxophone", clues: [
      "I'm made of brass, but I belong to the woodwind family.",
      "I'm a curved instrument used in jazz.",
      "A jazz instrument named after Mr Sax.",
    ] },
    { word: "headphones", clues: [
      "I let you listen to music without sharing it with anyone.",
      "You wear me over your ears.",
      "Little speakers for your ears.",
    ] },
    { word: "microphone", clues: [
      "I make you louder, and cool people drop me when they're done.",
      "Singers hold me in front of their mouth.",
      "Something that makes your voice louder.",
    ] },
    { word: "conductor", clues: [
      "I lead without saying a word, and I also check tickets on a train.",
      "I stand in front of the orchestra with a stick.",
      "The leader of an orchestra.",
    ] },
    { word: "xylophone", clues: [
      "In every alphabet book I'm the only one for my letter.",
      "I'm made of wooden bars you hit with little hammers.",
      "An instrument with bars in a row.",
    ] },
  ],

  clothing: [
    { word: "sock", clues: [
      "Put me on your hand and I become a puppet.",
      "You wear me on your foot, under your shoe.",
      "A soft thing for your foot.",
    ] },
    { word: "glove", clues: [
      "When something fits perfectly, people say it fits like me.",
      "I keep your hand warm in winter.",
      "Something you wear on your hand.",
    ] },
    { word: "scarf", clues: [
      "Eat fast and people say you do me, but I'd rather wrap around your neck.",
      "I'm long and woolly and keep your neck warm.",
      "A long piece of cloth for your neck.",
    ] },
    { word: "boots", clues: [
      "When your computer starts, it does what I'm called.",
      "We're high shoes for rain or snow.",
      "Tall shoes for winter.",
    ] },
    { word: "belt", clues: [
      "I hold everything together around your middle.",
      "You buckle me through the loops of your jeans.",
      "A strap that holds up your trousers.",
    ] },
    { word: "dress", clues: [
      "You do me every morning when you put clothes on, but I'm clothing too.",
      "I'm a piece of clothing with a skirt, often for parties.",
      "A one-piece outfit with a skirt.",
    ] },
    { word: "apron", clues: [
      "I take all the stains so your clothes don't have to.",
      "You tie me around your waist when you cook.",
      "A cloth you wear over your clothes in the kitchen.",
    ] },
    { word: "needle", clues: [
      "Finding me in a haystack is a famous impossible job.",
      "I pull a thread through cloth.",
      "A thin, sharp tool for sewing.",
    ] },
    { word: "zipper", clues: [
      "I have two rows of teeth that only meet when you pull me.",
      "I close your jacket or your bag.",
      "Metal teeth that open and close.",
    ] },
    { word: "jacket", clues: [
      "Potatoes can wear me in the oven.",
      "You put me on over your shirt when it's chilly.",
      "A short coat.",
    ] },
    { word: "slipper", clues: [
      "Cinderella lost one of me at midnight.",
      "I'm a soft shoe you wear at home.",
      "A warm indoor shoe.",
    ] },
    { word: "pajamas", clues: [
      "I'm the outfit nobody sees except your family and your dreams.",
      "You put me on before you go to bed.",
      "Clothes for sleeping.",
    ] },
    { word: "sweater", clues: [
      "Funny name: I keep you warm, but I'm not the one who's sweating.",
      "I'm a warm knitted top with long sleeves.",
      "A woolly jumper.",
    ] },
    { word: "uniform", clues: [
      "I make everyone look the same, on purpose.",
      "Police officers, nurses and some pupils have to wear me.",
      "Matching clothes for work or school.",
    ] },
    { word: "helmet", clues: [
      "I'm a hat with a very serious job.",
      "You wear me when you ride a bike.",
      "A hard hat that protects your head.",
    ] },
    { word: "haircut", clues: [
      "Someone takes something from you, and you pay them and say thank you.",
      "Scissors snip around your ears.",
      "What a hairdresser gives you.",
    ] },
    { word: "raincoat", clues: [
      "I'm the only coat that loves bad weather.",
      "I'm waterproof and often yellow.",
      "A coat for when it rains.",
    ] },
    { word: "sneakers", clues: [
      "My name sounds like I'm sneaking around, and I'm on your feet.",
      "Soft sports shoes with rubber soles.",
      "Trainers for running.",
    ] },
    { word: "sunglasses", clues: [
      "I make the world darker, and you look cooler.",
      "You wear me on your nose on bright days.",
      "Dark glasses against the sun.",
    ] },
    { word: "swimsuit", clues: [
      "I'm the only outfit that's happy to get soaked.",
      "You wear me to the pool or the beach.",
      "Clothes for swimming.",
    ] },
    { word: "necklace", clues: [
      "I'm a circle of beads that hugs your throat.",
      "I'm jewelry you wear around your neck.",
      "A chain of pearls or beads for the neck.",
    ] },
    { word: "overalls", clues: [
      "My name says I'm on top of everything.",
      "Painters and farmers wear me, with straps over the shoulders.",
      "Work trousers with a bib and straps.",
    ] },
  ],

  science: [
    { word: "atom", clues: [
      "I'm tiny, but everything is made of me, including you.",
      "I have protons, neutrons and electrons.",
      "The smallest part of an element.",
    ] },
    { word: "brain", clues: [
      "I'm the boss in your head, and I'm thinking about this riddle right now.",
      "I'm wrinkly and grey and I control your body.",
      "The organ you think with.",
    ] },
    { word: "heart", clues: [
      "I'm on every Valentine's card, but the real me looks nothing like it.",
      "I pump blood around your body.",
      "The organ that beats in your chest.",
    ] },
    { word: "laser", clues: [
      "Cats chase my little red dot.",
      "I'm a very straight, strong beam of light.",
      "A narrow beam of light used in machines.",
    ] },
    { word: "robot", clues: [
      "I do what I'm told, and I never get tired or bored.",
      "I'm a machine that can move and work by itself.",
      "A machine that acts like a person.",
    ] },
    { word: "comet", clues: [
      "I visit the sun with my long hair flying behind me.",
      "I'm a ball of ice with a glowing tail in space.",
      "An icy space rock with a tail.",
    ] },
    { word: "skull", clues: [
      "Pirates put me on their flag.",
      "I'm made of bone and protect your brain.",
      "The bones of your head.",
    ] },
    { word: "magnet", clues: [
      "I'm very attractive, but only to metal.",
      "I stick to the fridge.",
      "A piece of iron that pulls other metal.",
    ] },
    { word: "planet", clues: [
      "I'm always going round in circles, and nobody says I'm lost.",
      "Mars and Jupiter are examples of me.",
      "A big round world that goes around a star.",
    ] },
    { word: "rocket", clues: [
      "I leave the ground with fire under my tail and never look back.",
      "I take astronauts into space.",
      "A space vehicle with engines.",
    ] },
    { word: "gravity", clues: [
      "A falling apple taught a famous scientist all about me.",
      "I pull everything towards the Earth.",
      "The force that makes things fall.",
    ] },
    { word: "battery", clues: [
      "I'm always charged, but I've never been to court.",
      "I give power to your remote and your phone.",
      "Something that stores electricity.",
    ] },
    { word: "fossil", clues: [
      "I'm older than old, and I've been waiting in the rock for millions of years.",
      "I'm what's left of a dinosaur in stone.",
      "Remains of an ancient animal in stone.",
    ] },
    { word: "oxygen", clues: [
      "You can't see me or smell me, but you can't live without me.",
      "Trees make me and you breathe me in.",
      "The gas we need to breathe.",
    ] },
    { word: "compass", clues: [
      "I always know where north is, but I've never been anywhere.",
      "My needle helps hikers who are lost.",
      "A tool with a magnetic needle for finding directions.",
    ] },
    { word: "telescope", clues: [
      "I bring the stars closer without moving them.",
      "You look through me to see the planets.",
      "A tube for looking at things far away.",
    ] },
    { word: "microscope", clues: [
      "I make the tiniest things look like giants.",
      "Scientists use me to look at cells.",
      "A tool for seeing very small things.",
    ] },
    { word: "skeleton", clues: [
      "I'm always inside you, holding you up.",
      "I'm made of 206 bones.",
      "All the bones of your body together.",
    ] },
    { word: "dinosaur", clues: [
      "I lived long before your grandparents' grandparents, and my name means 'terrible lizard'.",
      "I was a giant reptile that died out long ago.",
      "A T. rex is one of me.",
    ] },
    { word: "thermometer", clues: [
      "I go up when you have a fever and down when it freezes.",
      "I show how hot or cold it is.",
      "A tool that measures temperature.",
    ] },
    { word: "computer", clues: [
      "I used to be as big as a room, now I fit on your lap.",
      "I have a screen, a keyboard and a mouse.",
      "A machine for programs and the internet.",
    ] },
    { word: "elevator", clues: [
      "I'm a room that changes floors while you stand still.",
      "Press my button and my doors slide open.",
      "A small room that takes you to another floor.",
    ] },
  ],

  countries: [
    { word: "peru", clues: [
      "A famous bear with a red hat and marmalade sandwiches came from me.",
      "Machu Picchu is in my mountains.",
      "A South American country, capital Lima.",
    ] },
    { word: "cuba", clues: [
      "I'm an island shaped like a crocodile, close to Florida.",
      "I'm known for salsa music and old American cars.",
      "A Caribbean island country, capital Havana.",
    ] },
    { word: "chile", clues: [
      "I sound like something hot to eat, but I'm very long and thin.",
      "I'm squeezed between the Andes and the Pacific Ocean.",
      "A long South American country, capital Santiago.",
    ] },
    { word: "china", clues: [
      "Your grandma's best plates share my name.",
      "I have a Great Wall and lots of pandas.",
      "A huge Asian country, capital Beijing.",
    ] },
    { word: "japan", clues: [
      "I'm made of thousands of islands, and the sun rises on my flag.",
      "Sushi and bullet trains come from me.",
      "An Asian island country, capital Tokyo.",
    ] },
    { word: "wales", clues: [
      "Add an H and I'd be swimming in the ocean.",
      "A red dragon is on my flag.",
      "Part of the UK, capital Cardiff.",
    ] },
    { word: "india", clues: [
      "Columbus was looking for me and found America by mistake.",
      "The Taj Mahal stands in me.",
      "A big Asian country, capital New Delhi.",
    ] },
    { word: "italy", clues: [
      "On the map I wear a boot, and I'm kicking a little island.",
      "Pizza and pasta come from me.",
      "A European country, capital Rome.",
    ] },
    { word: "egypt", clues: [
      "My old kings were buried under huge triangles.",
      "The Nile flows through me.",
      "The African country with the pyramids.",
    ] },
    { word: "turkey", clues: [
      "In America they eat a bird with my name at Thanksgiving.",
      "Istanbul lies in me, on two continents.",
      "A country between Europe and Asia, capital Ankara.",
    ] },
    { word: "greece", clues: [
      "I sound like something oily in a frying pan.",
      "The first Olympic Games were held in me.",
      "The country with Athens as its capital.",
    ] },
    { word: "hungary", clues: [
      "I sound like the feeling you get just before lunch.",
      "Goulash soup comes from me.",
      "A European country, capital Budapest.",
    ] },
    { word: "france", clues: [
      "My capital has an iron lady who is over 300 metres tall.",
      "Croissants and baguettes come from me.",
      "The country with Paris as its capital.",
    ] },
    { word: "brazil", clues: [
      "There's a nut named after me, and I always want to play football.",
      "Most of the Amazon rainforest is in me.",
      "The biggest country in South America.",
    ] },
    { word: "norway", clues: [
      "My name sounds like the way to the north.",
      "I have fjords and the midnight sun.",
      "A Scandinavian country, capital Oslo.",
    ] },
    { word: "iceland", clues: [
      "My name sounds cold, but I'm full of hot springs and volcanoes.",
      "I'm an island near the Arctic Circle with geysers.",
      "An island country, capital Reykjavik.",
    ] },
    { word: "canada", clues: [
      "I have more lakes than the rest of the world put together.",
      "I'm the big country north of the USA, with a maple leaf on my flag.",
      "The country with Ottawa as its capital.",
    ] },
    { word: "portugal", clues: [
      "Great explorers sailed away from my coast at the edge of Europe.",
      "I'm next to Spain and famous for custard tarts.",
      "The country with Lisbon as its capital.",
    ] },
    { word: "australia", clues: [
      "I'm a whole continent and a country at the same time.",
      "Kangaroos and koalas live in me.",
      "The big country down under, capital Canberra.",
    ] },
    { word: "scotland", clues: [
      "Legend says a monster swims in one of my lakes.",
      "Kilts and bagpipes come from me.",
      "Part of the UK, capital Edinburgh.",
    ] },
    { word: "thailand", clues: [
      "My name sounds like a country full of neckties.",
      "I'm famous for beaches, elephants and spicy noodles.",
      "An Asian country with Bangkok as its capital.",
    ] },
    { word: "argentina", clues: [
      "My name comes from silver, and I'm the home of the tango.",
      "I'm a big South American country, famous for football and steak.",
      "The country with Buenos Aires as its capital.",
    ] },
    { word: "switzerland", clues: [
      "I'm famous for cheese with holes, and I never pick a side.",
      "I have the Alps, chocolate and watches.",
      "The country with Bern as its capital.",
    ] },
    { word: "netherlands", clues: [
      "A third of me lies below sea level, and my name says I'm low.",
      "Tulips, windmills and bikes everywhere.",
      "The country with Amsterdam as its capital.",
    ] },
  ],

  mystery: [
    { word: "echo", clues: [
      "I'm the only one in the mountains who always agrees with you.",
      "Shout in a cave and I shout back.",
      "A sound that bounces back.",
    ] },
    { word: "dream", clues: [
      "I'm a film that plays every night, and you're always the star.",
      "I happen while you sleep.",
      "Pictures in your head while you sleep.",
    ] },
    { word: "idea", clues: [
      "When I arrive, a light bulb appears above your head.",
      "I'm a thought that suddenly pops up.",
      "A new plan or thought.",
    ] },
    { word: "time", clues: [
      "I fly when you're having fun and crawl when you're waiting.",
      "Clocks measure me.",
      "Hours, minutes and seconds.",
    ] },
    { word: "luck", clues: [
      "A four-leaf clover is said to bring me.",
      "You need me when you throw the dice.",
      "Good fortune.",
    ] },
    { word: "magic", clues: [
      "A rabbit in a hat is my most famous trick.",
      "Wizards and witches do me.",
      "Tricks that seem impossible.",
    ] },
    { word: "smile", clues: [
      "I'm free to give, and whoever gets me usually gives me right back.",
      "Your mouth does me when you're happy.",
      "A happy look on your face.",
    ] },
    { word: "secret", clues: [
      "Keep me, and you're a true friend.",
      "You whisper me and promise not to tell.",
      "Something only you know.",
    ] },
    { word: "silence", clues: [
      "They say I'm golden, but nobody can hear me.",
      "The library asks you for me.",
      "When there is no sound at all.",
    ] },
    { word: "promise", clues: [
      "I'm the most important job a little finger ever has.",
      "You make me when you say you'll really do something.",
      "Your word that you will do it.",
    ] },
    { word: "gossip", clues: [
      "I travel fastest when you say I mustn't be told to anyone.",
      "I'm talk about other people behind their backs.",
      "Chatting about other people's business.",
    ] },
    { word: "riddle", clues: [
      "You're solving one of me right now.",
      "I'm a tricky question with a clever answer.",
      "A puzzle question.",
    ] },
    { word: "giggle", clues: [
      "I'm a little laugh that escapes at the worst moment in class.",
      "A soft, silly laugh.",
      "To laugh in a silly way.",
    ] },
    { word: "holiday", clues: [
      "I'm the reason suitcases get excited.",
      "Days off from school or work, often at the beach.",
      "A trip or time off.",
    ] },
    { word: "password", clues: [
      "I'm the secret that lets you in, but I'm useless if I'm 1234.",
      "You type me to log in.",
      "A secret word for logging in.",
    ] },
    { word: "birthday", clues: [
      "I come once a year, and the older you get, the more candles I need.",
      "You get presents and cake on me.",
      "The day you were born, every year again.",
    ] },
    { word: "footsteps", clues: [
      "In the snow we tell everyone where you've been.",
      "We're the sound of someone walking.",
      "The marks or sounds of walking feet.",
    ] },
    { word: "nightmare", clues: [
      "Is it a horse that comes at night? No, it's a dream you'd rather forget.",
      "I make you wake up scared in the middle of the night.",
      "A very bad dream.",
    ] },
    { word: "surprise", clues: [
      "If you know I'm coming, I'm already ruined.",
      "A party nobody told you about.",
      "Something you didn't expect.",
    ] },
    { word: "treasure", clues: [
      "X marks the spot where I'm hiding.",
      "Pirates bury me in a chest.",
      "Gold and jewels that are hidden.",
    ] },
    { word: "library", clues: [
      "I have a story on every shelf, but I never tell one out loud.",
      "You may take things from me, as long as you bring them back.",
      "A building full of books to borrow.",
    ] },
  ],

  winter: [
    { word: "igloo", clues: [
      "I'm a house that melts if you turn the heating up.",
      "I'm a dome made of blocks of snow.",
      "A house built of snow.",
    ] },
    { word: "frost", clues: [
      "I paint the windows white at night without a brush.",
      "I make the grass crunchy and white in the morning.",
      "Ice crystals on a cold morning.",
    ] },
    { word: "carol", clues: [
      "I'm a girl's name, but in December I'm sung at your door.",
      "A song for Christmas.",
      "A song people sing at Christmas time.",
    ] },
    { word: "icicle", clues: [
      "I grow downwards from the roof, and I cry when the sun comes out.",
      "I'm a pointy piece of ice hanging from the gutter.",
      "A hanging spike of ice.",
    ] },
    { word: "sleigh", clues: [
      "I need snow instead of roads, and some of me are pulled through the sky.",
      "Santa rides me on Christmas Eve.",
      "A sled pulled by animals.",
    ] },
    { word: "mittens", clues: [
      "I keep your fingers together like best friends, and only your thumb gets its own room.",
      "I'm warm and woolly and go on your hands.",
      "Gloves without separate fingers.",
    ] },
    { word: "chimney", clues: [
      "I'm the only door Santa uses.",
      "Smoke goes up through me on the roof.",
      "A pipe on the roof for smoke.",
    ] },
    { word: "snowman", clues: [
      "I stand outside all winter without a coat, and the sun is my enemy.",
      "Children build me from big balls.",
      "A figure made of snow with a carrot nose.",
    ] },
    { word: "skiing", clues: [
      "I'm a sport that's all downhill, and that's a good thing.",
      "You slide down a snowy mountain on two long boards.",
      "Sliding down snow on skis.",
    ] },
    { word: "snowball", clues: [
      "I'm round and cold, and I start every winter war.",
      "You make me with your hands and throw me.",
      "A ball of snow.",
    ] },
    { word: "reindeer", clues: [
      "I'm a deer with a rainy-sounding name, and one of us has a shiny red nose.",
      "I pull Santa's sleigh.",
      "A deer with big antlers from the far north.",
    ] },
    { word: "fireplace", clues: [
      "I eat logs all evening and keep everyone warm.",
      "You sit in front of me watching the flames.",
      "A place in the wall for a fire.",
    ] },
    { word: "snowflake", clues: [
      "No two of me are the same, and I melt on your tongue.",
      "I'm a tiny six-pointed star made of ice.",
      "One small piece of falling snow.",
    ] },
    { word: "blizzard", clues: [
      "I'm a storm that makes the whole world white and invisible.",
      "Heavy snow and strong wind together.",
      "A big snowstorm.",
    ] },
  ],
};
