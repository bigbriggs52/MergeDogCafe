# Ally’s Pup Café

A calm, cozy dog merge café game for iPhone. No ads, no purchases, no tracking. Everything stays on the phone.

Merge treats on the board, serve them to visiting pups, and use the stars you earn to fix up and decorate the café.

## Play it on iPhone

1. Open the game's GitHub Pages link in **Safari**.
2. Tap the **Share** button, then **Add to Home Screen**.
3. Open Ally’s Pup Café from the home screen. It runs full screen, saves automatically and works offline.

## How it plays

- **Treat boxes** (Cookie Jar, Teapot, and later the Toy Basket, Sewing Box and Flower Pot) make a level-1 item each time you tap them. Each tap uses 1 paw point.
- **Merge** two matching items to make the next level, up to level 8. Merging next to a sleepy pillow wakes it and reveals what's inside.
- **Serve** the pups at the counter to earn coins, stars and paw points.
- **Paw points** refill 1 every 30 seconds. Serving gives +5, and petting a waiting pup gives +3. When you run out, Bean the Pug naps and refills everything for free.
- **Café**: spend stars on tasks, picking one of three styles each time. Six rooms unlock new treat boxes and visitors.
- **Pup Book**: every pup you serve is collected here.

## Files

- `index.html`: the page
- `css/style.css`: all styling and animations
- `js/data.js`: items, dogs, rooms and tuning numbers
- `js/dogs.js`: the original squishy dog art, drawn as SVG
- `js/plush.js`: the original plushy item art (treats, drinks, toys, comfort items, garden items, treat boxes, coins, gifts, icons), drawn as SVG
- `js/version.js`, `version.json`: the game version shown in Settings
- `js/audio.js`: generated sound effects and background music (no audio files)
- `js/game.js`: game logic, saving and input
- `sw.js`, `manifest.webmanifest`, `icons/`: home-screen app and offline support

## Releasing an update

Run `tools/stamp-version.sh` before committing a change. It sets the version (`1.0.0.YYYYMMDD.HHMM`, Eastern time) and refreshes the offline cache, so **Settings → Check for update** on the phone finds the new version.

All names, characters, art and sounds are original.
