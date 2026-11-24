// Pup Café: game data (all names and content are original)
'use strict';

const COLS = 7, ROWS = 9;
const PAW_REGEN_MS = 30000;      // 1 paw point every 30 seconds
const PAW_BASE_MAX = 100;
const SERVE_PAW_BONUS = 5;
const PET_PAW_BONUS = 3;

const CHAINS = {
  bakery: {
    name: 'Bakery', color: '#FFD9B8', deep: '#F2A66B',
    gen: { name: 'Cookie Jar', icon: '🫙' },
    items: [
      ['🌾', 'Wheat'], ['🦴', 'Bone Biscuit'], ['🍪', 'Paw Cookie'], ['🥐', 'Croissant'],
      ['🍩', 'Donut'], ['🧁', 'Cupcake'], ['🍰', 'Cake Slice'], ['🎂', 'Birthday Pup Cake'],
    ],
  },
  drinks: {
    name: 'Drinks', color: '#CDEBFF', deep: '#7DBDEB',
    gen: { name: 'Teapot', icon: '🫖' },
    items: [
      ['💧', 'Water Drop'], ['🥛', 'Milk Bowl'], ['☕', 'Puppuccino'], ['🍵', 'Matcha'],
      ['🧋', 'Bubble Tea'], ['🥤', 'Milkshake'], ['🍨', 'Sundae'], ['🍯', 'Golden Honey Pot'],
    ],
  },
  toys: {
    name: 'Toys', color: '#FFD6E7', deep: '#F08DB4',
    gen: { name: 'Toy Basket', icon: '🧺' },
    items: [
      ['🪢', 'Rope Knot'], ['🎾', 'Tennis Ball'], ['🦆', 'Squeaky Duck'], ['🥏', 'Frisbee'],
      ['🧸', 'Teddy'], ['🪁', 'Kite'], ['🚂', 'Toy Train'], ['🚀', 'Rocket Toy'],
    ],
  },
  comfort: {
    name: 'Comfort', color: '#E3D9FF', deep: '#A996EE',
    gen: { name: 'Sewing Box', icon: '🪡' },
    items: [
      ['🧵', 'Thread'], ['🧶', 'Yarn Ball'], ['🧦', 'Cozy Socks'], ['🧣', 'Scarf'],
      ['👕', 'Sweater'], ['🧥', 'Raincoat'], ['🛋️', 'Comfy Couch'], ['👑', 'Royal Crown'],
    ],
  },
  garden: {
    name: 'Garden', color: '#D3F3D6', deep: '#7FCB8A',
    gen: { name: 'Flower Pot', icon: '🪣' },
    items: [
      ['🌰', 'Seed'], ['🌱', 'Sprout'], ['🌼', 'Daisy'], ['🌷', 'Tulip'],
      ['💐', 'Bouquet'], ['🪴', 'Potted Plant'], ['🌳', 'Little Tree'], ['⛲', 'Fountain'],
    ],
  },
  // Treat boxes from Ally's new rooms (the art is drawn in plush.js; icons here are unused)
  books: {
    name: 'Story', color: '#EADCC8', deep: '#C39C6E',
    gen: { name: 'Story Shelf', icon: '' },
    items: [
      ['', 'Bookmark'], ['', 'Pocket Book'], ['', 'Picture Book'], ['', 'Book Stack'],
      ['', 'Pop-up Book'], ['', 'Story Globe'], ['', 'Treasure Map'], ['', 'Golden Storybook'],
    ],
  },
  play: {
    name: 'Playtime', color: '#FFF1B5', deep: '#EFC64A',
    gen: { name: 'Craft Box', icon: '' },
    items: [
      ['', 'Crayon'], ['', 'Paper Star'], ['', 'Building Block'], ['', 'Block Tower'],
      ['', 'Paper Plane'], ['', 'Spinning Top'], ['', 'Rocking Horse'], ['', 'Bouncy Castle'],
    ],
  },
  picnic: {
    name: 'Picnic', color: '#FFD4CC', deep: '#EE8E80',
    gen: { name: 'Picnic Basket', icon: '' },
    items: [
      ['', 'Strawberry'], ['', 'Apple'], ['', 'Sandwich'], ['', 'Lemonade'],
      ['', 'Ice Pop'], ['', 'Watermelon'], ['', 'Berry Pie'], ['', 'Fruit Tower'],
    ],
  },
  care: {
    name: 'Care', color: '#CDEFEA', deep: '#62C2B5',
    gen: { name: 'Care Kit', icon: '' },
    items: [
      ['', 'Cotton Ball'], ['', 'Bandage'], ['', 'Heart Sticker'], ['', 'Toothbrush'],
      ['', 'Fluffy Brush'], ['', 'Stethoscope'], ['', 'Get-Well Bear'], ['', 'Golden Heart'],
    ],
  },
};
const CHAIN_ORDER = ['bakery', 'drinks', 'toys', 'comfort', 'garden', 'books', 'play', 'picnic', 'care'];
const MAX_LEVEL = 8;
const GEN_MAX_LEVEL = 3;

// Helper items: tap to collect, merge to grow
const HELPERS = {
  paw:  { name: 'Paw Treat', color: '#FFF0B3', icons: ['🐾', '🐾', '🐾', '🐾'], values: [5, 15, 40, 100], unit: 'paw points' },
  coin: { name: 'Coin Pouch', color: '#FFF3C4', icons: ['🪙', '🪙', '💰', '💰'], values: [5, 15, 40, 100], unit: 'coins' },
};

// Dogs. Staff run the café; visitors come in as customers.
const STAFF = {
  miso:    { name: 'Miso', breed: 'shiba', role: 'Café owner' },
  bean:    { name: 'Bean', breed: 'pug', role: 'Barista' },
  waffles: { name: 'Waffles', breed: 'corgi', role: 'Greeter' },
};

const VISITORS = [
  { id: 'sunny',   name: 'Sunny',   breed: 'golden',     bio: 'Has never met a stranger. Or a puddle.', room: 0 },
  { id: 'noodle',  name: 'Noodle',  breed: 'dachshund',  bio: 'Arrives in three parts, slowly.', room: 0 },
  { id: 'puff',    name: 'Puff',    breed: 'pomeranian', bio: 'Mostly fluff, all heart.', room: 0 },
  { id: 'biscuit', name: 'Biscuit', breed: 'beagle',     bio: 'Can smell a croissant from two streets away.', room: 0 },
  { id: 'pierre',  name: 'Pierre',  breed: 'frenchie',   bio: 'Orders in a very fancy accent.', room: 1 },
  { id: 'juniper', name: 'Juniper', breed: 'husky',      bio: 'Talks a lot. Mostly in howls.', room: 1 },
  { id: 'bubbles', name: 'Bubbles', breed: 'poodle',     bio: 'Just had her curls done.', room: 1 },
  { id: 'domino',  name: 'Domino',  breed: 'dalmatian',  bio: 'Has 101 favourite treats.', room: 2 },
  { id: 'lulu',    name: 'Lulu',    breed: 'shihtzu',    bio: 'Never seen without her bow.', room: 2 },
  { id: 'scout',   name: 'Scout',   breed: 'collie',     bio: 'Herds the other customers into a line.', room: 2 },
  { id: 'cloud',   name: 'Cloud',   breed: 'samoyed',    bio: 'Always smiling. Always shedding.', room: 3 },
  { id: 'bear',    name: 'Bear',    breed: 'bernese',    bio: 'A gentle giant who loves naps.', room: 3 },
  { id: 'pip',     name: 'Pip',     breed: 'chihuahua',  bio: 'Small dog, big opinions.', room: 4 },
  { id: 'zoom',    name: 'Zoom',    breed: 'greyhound',  bio: 'Fastest dog in town, laziest dog at home.', room: 4 },
  { id: 'pudding', name: 'Pudding', breed: 'bulldog',    bio: 'Snores during his own order.', room: 5 },
  { id: 'cocoa',   name: 'Cocoa',   breed: 'labrador',   bio: 'Reads one page, naps for two.', room: 6 },
  { id: 'rosie',   name: 'Rosie',   breed: 'cavalier',   bio: 'Loves a happy ending and a warm lap.', room: 6 },
  { id: 'snowy',   name: 'Snowy',   breed: 'westie',     bio: 'First to the ball pit, last to leave.', room: 7 },
  { id: 'toffee',  name: 'Toffee',  breed: 'cockapoo',   bio: 'Has a best friend in every room.', room: 7 },
  { id: 'marble',  name: 'Marble',  breed: 'aussie',     bio: 'Counts the ducks in the pond every morning.', room: 8 },
  { id: 'waddles', name: 'Waddles', breed: 'basset',     bio: 'Takes the long way round the park. On purpose.', room: 8 },
  { id: 'pearl',   name: 'Pearl',   breed: 'maltese',    bio: 'Here for her check-up and a treat. Mostly the treat.', room: 9 },
  { id: 'clover',  name: 'Clover',  breed: 'boxer',      bio: 'Brave at the vet, as long as someone holds her paw.', room: 9 },
  { id: 'mochi',   name: 'Mochi',   breed: 'mystery',    bio: 'A rare mystery pup. Nobody knows where Mochi comes from.', room: 0, rare: true },
];

const STYLES = [
  { id: 'cottage', name: 'Cozy Cottage',  pad: '#E9C9A6', wall: '#F6E7D3', floor: '#C99A6E' },
  { id: 'pastel',  name: 'Pastel Bakery', pad: '#F7C6D9', wall: '#FCE8EF', floor: '#E8B9C9' },
  { id: 'garden',  name: 'Garden Picnic', pad: '#BFE6C1', wall: '#E7F5E4', floor: '#A9D49C' },
];

// Café rooms. Each task costs stars. Slots are positions in the room picture (percent).
const ROOMS = [
  { name: 'Front Counter', unlock: { gen: 'toys' }, unlockText: 'Toy Basket and new visitors',
    tasks: [
      ['Sweep the dusty floor', 'd-broom', 50, 85], ['Fix the counter', 'd-counter', 50, 62], ['Hang a café sign', 'd-sign', 50, 18],
      ['Set up the coffee station', 'drinks-3', 22, 55], ['Fill the treat display', 'bakery-6', 78, 55], ['Hang a pendant lamp', 'd-lamp', 28, 28],
      ['Lay a welcome mat', 'd-mat', 80, 88], ['Add a potted plant', 'garden-6', 10, 75],
    ] },
  { name: 'Seating Nook', unlock: { gen: 'comfort' }, unlockText: 'Sewing Box and new visitors',
    tasks: [
      ['Bring in tables', 'd-table', 30, 70], ['Add comfy chairs', 'd-chair', 70, 72], ['Build a bookshelf', 'd-books', 12, 45],
      ['Fix the window seat', 'd-window', 50, 30], ['Hang wall art', 'd-art', 85, 30], ['String fairy lights', 'd-lights', 50, 14],
      ['Roll out a rug', 'd-rug', 64, 86], ['Hang a clock', 'd-clock', 20, 18],
    ] },
  { name: 'Nap Corner', unlock: { gen: 'garden' }, unlockText: 'Flower Pot and new visitors',
    tasks: [
      ['Add dog beds', 'd-bed', 30, 75], ['Fold soft blankets', 'd-blanket', 70, 78], ['Fluff the pillows', 'd-cushion', 50, 60],
      ['Add a night lamp', 'd-moon', 85, 25], ['Fill a toy bin', 'toys-5', 12, 70], ['Add a music box', 'd-musicbox', 50, 22],
      ['Hang curtains', 'd-curtain', 18, 25], ['Light the fireplace', 'd-fire', 75, 48],
    ] },
  { name: 'Back Garden', unlock: {}, unlockText: 'New visitors',
    tasks: [
      ['Mend the fence', 'd-fence', 50, 50], ['Plant a flower bed', 'garden-4', 20, 80], ['Set out water bowls', 'drinks-2', 80, 82],
      ['Build a doghouse', 'd-doghouse', 75, 58], ['Hang a tree swing', 'd-swing', 18, 40], ['Fill a paddling pool', 'd-pool', 50, 78],
      ['Add a picnic table', 'gen-toys', 45, 65], ['Hang lanterns', 'd-lantern', 50, 15],
    ] },
  { name: 'Upstairs Lounge', unlock: {}, unlockText: 'New visitors',
    tasks: [
      ['Fix the staircase', 'd-stairs', 10, 60], ['Fill a dress-up closet', 'd-closet', 85, 55], ['Hang a mirror', 'd-mirror', 60, 30],
      ['Make a photo wall', 'd-photo', 35, 25], ['Tune the piano', 'd-piano', 40, 70], ['Toss in bean bags', 'd-beanbag', 70, 82],
      ['Set out a tea set', 'gen-drinks', 55, 60], ['Hang a chandelier', 'd-chandelier', 50, 15],
    ] },
  { name: 'Rooftop Terrace', unlock: { gen: 'books' }, unlockText: 'Story Shelf and new visitors',
    tasks: [
      ['Lay deck boards', 'd-deck', 50, 88], ['Fill the planters', 'd-sunflower', 12, 70], ['Open a sun umbrella', 'd-umbrella', 70, 50],
      ['String twinkle lights', 'd-twinkle', 50, 15], ['Set up a telescope', 'd-telescope', 88, 40], ['Hang a hammock', 'd-hammock', 25, 45],
      ['Hang a party banner', 'd-banner', 50, 28], ['Bake the party cake', 'bakery-8', 50, 65],
    ] },
  // Rooms 7 to 10 came from Ally's suggestion box.
  { name: 'Book Nook', unlock: { gen: 'play' }, unlockText: 'Craft Box and new visitors',
    tasks: [
      ['Polish the wood floor', 'd-broom', 50, 85], ['Build tall bookshelves', 'books-4', 15, 45], ['Add a reading armchair', 'd-armchair', 70, 70],
      ['Hang a reading lamp', 'd-lamp', 80, 30], ['Spin a story globe', 'books-6', 40, 60], ['Stack the picture books', 'books-3', 55, 80],
      ['Roll out a story rug', 'd-rug', 50, 88], ['Pin up a treasure map', 'books-7', 50, 25],
    ] },
  { name: 'Doggy Daycare', unlock: { gen: 'picnic' }, unlockText: 'Picnic Basket and new visitors',
    tasks: [
      ['Lay soft play mats', 'd-mat', 50, 85], ['Paint a rainbow wall', 'd-rainbow', 50, 25], ['Build a ball pit', 'd-ballpit', 25, 75],
      ['Set up a little slide', 'd-slide', 80, 65], ['Add nap cubbies', 'd-bed', 12, 45], ['Fill the block corner', 'play-4', 60, 80],
      ['Add a rocking horse', 'play-7', 40, 70], ['Hang paper stars', 'play-2', 50, 12],
    ] },
  { name: 'Pup Park', unlock: { gen: 'care' }, unlockText: 'Care Kit and new visitors',
    tasks: [
      ['Mow a fresh lawn', 'garden-2', 50, 85], ['Plant shady trees', 'garden-7', 15, 40], ['Add a park bench', 'd-bench', 30, 70],
      ['Build a splash fountain', 'garden-8', 60, 60], ['Set up agility hoops', 'd-hoop', 85, 70], ['Spread a picnic', 'gen-picnic', 45, 85],
      ['Fly a kite', 'toys-6', 75, 20], ['Open a lemonade stand', 'picnic-4', 85, 45],
    ] },
  { name: 'Vet Clinic', unlock: { finale: true }, unlockText: 'The grand pup party!',
    tasks: [
      ['Mop the clinic floor', 'd-broom', 50, 85], ['Set up the front desk', 'd-counter', 30, 65], ['Add a cozy check-up table', 'care-6', 70, 65],
      ['Add a pup weighing scale', 'd-scale', 85, 80], ['Fill the get-well treat jar', 'gen-bakery', 20, 50], ['Add a calm fish tank', 'd-fishtank', 80, 35],
      ['Fill a cuddle basket', 'care-7', 15, 80], ['Hang a heart sign', 'care-8', 50, 18],
    ] },
];

function taskCost(roomIdx, taskIdx) { return 2 + roomIdx + Math.floor(taskIdx / 2); }

const TIPS = [
  'Welcome to Ally’s Pup Café! I\'m {miso}. Tap the Cookie Jar to bake a treat, or hold it to make a bunch.',
  'Drag one treat onto a matching treat to squish them into something better.',
  'The pups at the counter show what they\'d like. When you have it, tap Serve!',
  'You earned stars! Open the Café tab to start fixing the place up.',
];
