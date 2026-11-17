# Hanglet

**A cheerful riddle word game for everyone from 8 years old, in English and Dutch.**
Playful like Duolingo, but grown-ups enjoy it too. Younger kids (6–9) get their own Kids world.

**Tilo**, the little letter tile with a hook on his head, gives you a riddle
("You wrap it around your neck when it is cold"). You find the word letter by
letter before your hearts run out. Play the Daily (three words, the same for
everyone), endless Classic games, a level map with 40 levels through four
landscapes, a 2-minute Time Attack, or challenge a friend with your own secret
word. Open your daily treasure chest, finish daily missions, collect badges and
fill your own dictionary.

Inspired by the Codédex Python tutorial, rebuilt as a full web game.

![Hanglet preview](assets/og-image.png)

## Features

**Look and feel**
- Own mascot **Tilo** (SVG) with five moods: happy, thinking, surprised, sad and cheering. He greets you on the home page, reacts to every letter and cheers or comforts you on the result screen
- Logo made of colored letter tiles, rounded **Fredoka** font for headings and **Nunito** for text
- Bright, friendly palette with a soft illustrated background, in light and dark mode
- Chunky 3D buttons, keys and tiles that press down
- Smooth page transitions (View Transitions API, with a fade-in fallback)
- Juicy feedback: tiles that flip in, particles on right letters, shaking on misses, combo texts ("Nice! Combo x3")
- Optional cheerful background music made with the Web Audio API (off by default), plus sound effects
- Winter season look from 1 December to 6 January: snow, Tilo with a hat and an extra Winter word list

**The riddle game**
- The description of the word is the riddle. It is always free and big on screen, next to a small figure; the word tiles sit in the middle
- Three difficulties for every mode (Daily, Classic, Levels, Time Attack), set in Settings or before a Classic game:
  - **Easy** – riddle + the first letter for free + 8 lives (the default for new players)
  - **Normal** – riddle + 7 lives
  - **Hard** – only the category + 6 lives (the riddle can be bought as a hint; wins give bonus XP and coins)
- Lose 2 words in a row and Tilo kindly offers an easier difficulty
- Lives are hearts with a text: "5 lives left"
- The figure starts empty and only builds up on mistakes. New players get the friendly balloon; the classic figure can be picked in Settings

**Game modes**
- **Daily** – three words per day, the same for everyone with the same language, with progress rings and a countdown. Afterwards "Play more" goes straight to Classic
- **Classic** – endless play with your own category, length and difficulty
- **Levels** – 40 levels on an illustrated map: a meadow, a forest with a river, a desert and snowy mountains. Every level has 3 to 6 words, stars count the misses of the whole level
- **Time Attack** – as many words as you can in 2 minutes
- **Challenge a friend** – type a secret word (and a hint), get a link and send it, also via WhatsApp. The word is scrambled inside the link, so no server is needed

**Kids world (ages 6–9)**
- Its own start page (`kids.html`) with its own button on the home page; "Kids" in the welcome dialog goes straight there
- Words of 3–5 letters, always with a picture and a riddle
- A small keyboard: only the letters of the word plus 4–6 extra letters, big and colorful
- No losing: after a wrong letter a key lights up, after that Tilo fills in a letter with you. The last letter is always yours, and every word ends with a compliment
- No coins or XP, but a sticker for every word, in a sticker book

**Rewards**
- XP, player levels with a level-up screen, coins that fly to the counter
- Daily treasure chest: 20–60 coins and sometimes a free hint
- Three daily missions (for example "Solve 2 words without a miss") with coin rewards
- 21 badges that pop up when you earn them, and a badge page with progress
- 5 figures (classic, balloon, flower, snowman, rocket) and 8 color themes to unlock
- "My dictionary" with every word you solved and its meaning
- Share card: a picture of your result (made on a canvas), without spoilers

**Words**
- English and Dutch, each with its own word list of real words (no translations)
- 10 categories with 27–43 well-known words each (over 350 per language), every word with a clear riddle: animals, food, countries, sports, nature, jobs, science, music, colors and clothing. Rare, ambiguous and very hard words were taken out in v4
- An extra Winter list (31–39 words) in the winter season, and 45+ Kids words per language with own pictures

**For everyone**
- Welcome dialog (language, who is playing, large text) and an interactive tour
- Large text, high contrast and reduce motion (also follows the device setting)
- Keyboard play, screen reader labels and live messages, visible focus

**Website and app**
- Home, How to play, About, Privacy and 404 pages in English and Dutch
- Installable as an app (PWA) and works offline
- Title, description and Open Graph tags, translated per language
- Optional, cookie-free visitor statistics with GoatCounter

## How to run

Hanglet uses JavaScript modules, so it needs a web server (double-clicking
`index.html` will not work). There is no build step.

- **VS Code:** install *Live Server*, right-click `index.html` → *Open with Live Server*
- **Python:** `python -m http.server 8000` in this folder, then open <http://localhost:8000>
- **Node:** `npx serve` in this folder

### Publish on GitHub Pages

1. Push this folder to a GitHub repository.
2. *Settings → Pages* → *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. The game is live at `https://<username>.github.io/<repository>/`.

All paths are relative, so a subfolder works too. For link previews, change
`assets/og-image.png` in the `og:image` tags to the full URL of your site.

### Turn on visitor statistics (GoatCounter)

Open `js/analytics.js` and fill in your GoatCounter code:

```js
export const GOATCOUNTER_CODE = "your-code";
```

Leave it empty to keep statistics off. GoatCounter uses no cookies.

### Try the winter look

The winter season starts automatically on 1 December. To see it earlier, open
any page with `?season=winter` (and `?season=off` to go back). The choice is
remembered until you close the tab.

### After changing files

The service worker (`sw.js`) saves all files for offline use. Raise the version
in `CACHE_NAME` (now `hanglet-v4`) and add new files to `FILES`, so players get
the new version.

### Adding words

Add a line like `["giraffe", "The animal with the longest neck"]` to the right
category in `data/words/en.js` or `data/words/nl.js`. Use lowercase letters a–z
only (no accents), at least 4 letters, and don't use the word itself in the
description. The description is the riddle players see, so it must point clearly
to one well-known word. Kids words go in `data/kids.js` (3–5 letters, with a
picture from `js/ui/pictures.js`). Run the tests afterwards.

### Tests and the difficulty check

The game itself has no build step. The tests use Node.js (version 22 or newer):

```
npm test                          # all tests in tests/
node tools/simulate.js 50 normal  # plays 50 words per language automatically
```

`tools/simulate.js` plays with three simple players: one that only guesses the
most common letters first (a worst case), one that also recognises the word
from the riddle once half of the tiles are visible, and one that knows the
whole word list (a best case).

## Folder structure

```
word-guessing-web/
├── index.html            Home: mascot, Play button, Daily, chest, missions, Kids world, modes
├── play.html             Game screen (?mode=daily|classic|levels|timed|kids|challenge)
├── levels.html           Level map
├── kids.html             Kids world: start page and sticker book
├── challenge.html        Make a challenge for a friend
├── badges.html           All badges
├── dictionary.html       My dictionary
├── stats.html            Statistics and calendar
├── settings.html         Language, look, accessibility, figures, sound, music, reset
├── how-to-play.html, about.html, privacy.html, 404.html   (English + Dutch)
├── manifest.webmanifest  PWA settings
├── sw.js                 Service worker (offline)
├── css/
│   ├── base.css          Tokens, palette, themes, accessibility, header, footer
│   ├── components.css    Buttons, cards, switches, dialogs, hint menu, tour
│   ├── pages.css         Game board, levels, dictionary, stats, settings
│   ├── figures.css       The five figures and their animations
│   └── game.css          The v3 game look: fonts, colors, depth, mascot, home,
│                         effects, rewards, badges, challenge, share, winter
├── data/
│   ├── i18n/en.json, nl.json   Interface text
│   ├── words/en.js, nl.js      Word lists with descriptions (incl. the Winter list)
│   └── kids.js                 Kids words + picture names
├── js/
│   ├── theme-init.js     Colors, text size, language and season before the page shows
│   ├── analytics.js      GoatCounter setup (fill in your code here)
│   ├── core/             Game logic without page code
│   │   ├── round.js, words.js, daily.js, levels.js, progress.js, achievements.js
│   │   ├── missions.js     Daily missions
│   │   ├── chest.js        Daily treasure chest
│   │   ├── challenge.js    Challenge links (scramble and unscramble)
│   │   ├── season.js       Winter season
│   │   ├── difficulty.js   Easy / Normal / Hard and the "make it easier?" offer
│   │   ├── kids.js         Kids world: small keyboard and Tilo's help
│   │   └── i18n.js, storage.js, figures.js, themes.js, xp.js, dates.js, random.js
│   ├── ui/
│   │   ├── mascot.js       Tilo and his moods
│   │   ├── effects.js      Particles, combo text, flying coins
│   │   ├── celebrations.js Level up, badge and mission pops
│   │   ├── home-rewards.js Chest and missions on the home page
│   │   ├── share.js        Share card (canvas) and share window
│   │   ├── music.js        Background music (Web Audio)
│   │   ├── illustrations.js Pictures for the mode tiles and the chest
│   │   ├── map-scenery.js  Landscapes of the level map
│   │   ├── figures/        classic, balloon, flower, snowman, rocket
│   │   └── layout.js, keyboard.js, feedback.js, tutorial.js, welcome.js, …
│   └── pages/            One script per page
├── assets/               Logo, favicon, app icons, preview image
├── tests/                Tests (node --test), see "Tests and the difficulty check"
├── tools/simulate.js     Plays automatically to check the difficulty
└── package.json          Only for `npm test`, the game needs no packages
```

## Privacy

No account and no cookies. All progress is saved in the browser's
`localStorage` on the player's own device. The fonts are loaded from Google
Fonts. Visitor statistics with GoatCounter are off until you add your code.

## Credits

Inspired by the Codédex Python tutorial, rebuilt as a full web game.
