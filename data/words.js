// All words of the game, grouped by category.
// Rules: English, lowercase, letters a-z only, at least 4 letters.

export const CATEGORIES = [
  { id: "animals", name: "Animals" },
  { id: "food", name: "Food" },
  { id: "countries", name: "Countries" },
  { id: "sports", name: "Sports" },
  { id: "nature", name: "Nature" },
  { id: "jobs", name: "Jobs" },
  { id: "science", name: "Science" },
  { id: "music", name: "Music" },
];

export const WORDS = {
  animals: [
    "lion", "wolf", "bear", "deer", "frog", "duck", "swan", "crab", "seal", "mole",
    "tiger", "zebra", "horse", "sheep", "mouse", "otter", "panda", "koala", "camel", "llama",
    "eagle", "shark", "whale", "snake", "moose", "bison", "raven", "rabbit", "donkey", "turtle",
    "monkey", "beaver", "badger", "falcon", "parrot", "jaguar", "iguana", "walrus", "salmon", "ferret",
    "giraffe", "penguin", "dolphin", "hamster", "leopard", "buffalo", "lobster", "octopus", "peacock", "ostrich",
    "elephant", "kangaroo", "flamingo", "squirrel", "hedgehog", "antelope", "crocodile", "chameleon", "butterfly", "alligator",
  ],
  food: [
    "bean", "rice", "corn", "cake", "soup", "pear", "plum", "kiwi", "taco", "tofu",
    "apple", "bread", "pasta", "pizza", "salad", "honey", "mango", "lemon", "grape", "peach",
    "olive", "onion", "cookie", "butter", "cheese", "carrot", "potato", "tomato", "banana", "cherry",
    "orange", "waffle", "muffin", "noodle", "pepper", "garlic", "yogurt", "pancake", "avocado", "popcorn",
    "pretzel", "biscuit", "cabbage", "spinach", "lettuce", "sausage", "coconut", "broccoli", "sandwich", "pineapple",
    "blueberry", "strawberry", "chocolate", "cucumber", "omelette", "croissant", "mushroom", "dumpling", "meatball", "raspberry",
  ],
  countries: [
    "peru", "chad", "cuba", "fiji", "mali", "oman", "togo", "laos", "chile", "china",
    "egypt", "ghana", "haiti", "india", "italy", "japan", "kenya", "nepal", "spain", "qatar",
    "brazil", "canada", "france", "greece", "mexico", "norway", "poland", "sweden", "angola", "austria",
    "belgium", "denmark", "finland", "germany", "ireland", "jamaica", "morocco", "nigeria", "iceland", "vietnam",
    "hungary", "romania", "croatia", "ecuador", "uruguay", "portugal", "thailand", "malaysia", "colombia", "argentina",
    "australia", "indonesia", "netherlands", "switzerland", "singapore", "mongolia", "cambodia", "tanzania", "zimbabwe", "madagascar",
  ],
  sports: [
    "golf", "judo", "polo", "sumo", "chess", "darts", "rugby", "relay", "sprint", "squash",
    "karate", "hockey", "tennis", "soccer", "boxing", "rowing", "skiing", "diving", "discus", "hurdles",
    "cycling", "archery", "fencing", "surfing", "sailing", "bowling", "cricket", "netball", "curling", "javelin",
    "skating", "running", "baseball", "football", "handball", "climbing", "swimming", "softball", "lacrosse", "marathon",
    "biathlon", "kayaking", "canoeing", "badminton", "wrestling", "triathlon", "taekwondo", "snowboard", "gymnastics", "basketball",
    "volleyball", "parkour", "pentathlon", "decathlon", "weightlifting", "orienteering", "equestrian", "skateboarding", "bobsleigh", "snorkeling",
  ],
  nature: [
    "tree", "leaf", "rain", "snow", "wind", "lake", "moss", "fern", "rock", "sand",
    "cloud", "river", "ocean", "beach", "storm", "grass", "stone", "swamp", "cliff", "dune",
    "acorn", "petal", "coral", "flower", "forest", "meadow", "valley", "canyon", "desert", "island",
    "lagoon", "tundra", "jungle", "pebble", "breeze", "branch", "crater", "geyser", "glacier", "volcano",
    "rainbow", "thunder", "sunrise", "blossom", "prairie", "iceberg", "horizon", "seashell", "mountain", "waterfall",
    "lightning", "sunflower", "rainforest", "wetland", "hillside", "riverbank", "snowflake", "moonlight", "starlight", "grassland",
  ],
  jobs: [
    "chef", "cook", "poet", "ranger", "pilot", "nurse", "judge", "baker", "coach", "actor",
    "guide", "clerk", "tutor", "farmer", "doctor", "lawyer", "painter", "plumber", "dancer", "singer",
    "author", "editor", "barber", "banker", "tailor", "waiter", "sailor", "cashier", "butcher", "florist",
    "surgeon", "curator", "captain", "dentist", "teacher", "gardener", "mechanic", "engineer", "designer", "musician",
    "architect", "scientist", "librarian", "carpenter", "astronaut", "pharmacist", "journalist", "translator", "electrician", "programmer",
    "accountant", "veterinarian", "photographer", "firefighter", "lifeguard", "zookeeper", "detective", "economist", "historian", "paramedic",
  ],
  science: [
    "atom", "cell", "gene", "mass", "heat", "wave", "acid", "iron", "lens", "laser",
    "orbit", "comet", "prism", "virus", "energy", "carbon", "oxygen", "magnet", "plasma", "proton",
    "photon", "galaxy", "planet", "nebula", "fossil", "enzyme", "theory", "formula", "crystal", "climate",
    "quantum", "circuit", "voltage", "battery", "protein", "gravity", "element", "neutron", "nucleus", "isotope",
    "electron", "molecule", "particle", "velocity", "friction", "catalyst", "bacteria", "chemistry", "physics", "biology",
    "geology", "ecology", "microscope", "telescope", "experiment", "hypothesis", "magnetism", "evolution", "spectrum", "laboratory",
  ],
  music: [
    "drum", "harp", "horn", "tuba", "song", "band", "beat", "tune", "note", "jazz",
    "flute", "piano", "cello", "banjo", "organ", "viola", "chord", "tempo", "choir", "opera",
    "blues", "rhythm", "guitar", "violin", "melody", "lyrics", "chorus", "ballad", "trumpet", "concert",
    "harmony", "ukulele", "playlist", "festival", "clarinet", "trombone", "keyboard", "mandolin", "bagpipes", "composer",
    "saxophone", "orchestra", "symphony", "xylophone", "accordion", "harmonica", "metronome", "conductor", "microphone", "tambourine",
    "soprano", "baritone", "drummer", "pianist", "acoustic", "overture", "serenade", "lullaby", "anthem", "duet",
  ],
};
