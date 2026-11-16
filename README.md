# Hanglet

**A calm word game for every day, for all ages, in English and Dutch.**

Hanglet is a word guessing game for the browser. Guess the hidden word letter by
letter before your figure is finished. Play the Daily (three words, the same for
everyone), endless Classic games, a level map with 40 levels, a 2-minute Time
Attack, or the Kids mode with pictures. Earn XP and coins, unlock figures, themes
and badges, and collect every word in your own dictionary.

Inspired by the Codédex Python tutorial, rebuilt as a full web game.

![Hanglet preview](assets/og-image.png)

## Features

**Two languages**
- English and Dutch, chosen on the first visit (the browser language is picked automatically) and changeable in Settings or in the footer
- All interface text in `data/i18n/en.json` and `data/i18n/nl.json`
- A separate word list per language: real Dutch words, not translations. 42–43 words per category per language, each with a short description

**Game modes**
- **Daily** – three words per day (short, medium, long), the same for everyone with the same language. Once per day, with a live countdown to the next one
- **Classic** – endless play with your own category, length and difficulty
- **Levels** – 40 levels on a winding map in four stages, up to 3 stars per level
- **Time Attack** – as many words as you can in 2 minutes
- **Kids** – short easy words with a picture hint, 10 lives, big buttons, warm colors, free hints, friendly texts and no time pressure

**Hints** (free in Kids mode)
- Show the description – 10 coins
- Reveal a letter – 20 coins (never the last one)
- Remove 3 wrong letters – 15 coins

**Figures** (own SVG drawings with animations)
- Classic figure (free), balloon that loses air and floats away on a win (free)
- Flower that loses its petals (150 coins), snowman that melts (badge "Getting good")
- Rocket that you build with every right letter and that launches when you win (300 coins)

**For all ages**
- Welcome dialog: language, who is playing (everyone / kids) and large text
- Interactive tour the first time you play (it asks you to tap a letter)
- Settings for large text, high contrast and reduced motion
- Keyboard play, screen reader labels and live messages, visible focus

**Progress**
- XP, player levels and coins, 21 badges, 8 color themes
- Day streak and win streak, with a calendar
- "My dictionary": every solved word with its description, search and category filter
- Statistics: played, win %, streaks, misses per game

**Website and app**
- Home, How to play, About, Privacy and 404 pages (text pages in English and Dutch)
- Spoiler-free share button
- Installable as an app (PWA) and works offline
- Title, description and Open Graph tags
- Sounds made with the Web Audio API (no audio files)
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

### After changing files

The service worker (`sw.js`) saves all files for offline use. Raise the version
in `CACHE_NAME` (for example `hanglet-v3`) and add new files to `FILES`, so
players get the new version.

### Adding words

Add a line like `["giraffe", "The animal with the longest neck"]` to the right
category in `data/words/en.js` or `data/words/nl.js`. Use lowercase letters a–z
only (no accents) and at least 4 letters.

## Folder structure

```
word-guessing-web/
├── index.html            Home page
├── play.html             Game screen (?mode=daily|classic|levels|timed|kids)
├── levels.html           Level map
├── dictionary.html       My dictionary
├── stats.html            Statistics, calendar and badges
├── settings.html         Language, look, accessibility, figures, sound, reset
├── how-to-play.html      Rules (English + Dutch)
├── about.html            About (English + Dutch)
├── privacy.html          Privacy (English + Dutch)
├── 404.html              Page not found
├── manifest.webmanifest  PWA settings
├── sw.js                 Service worker (offline)
├── css/
│   ├── base.css          Design tokens, palette, themes, accessibility, header, footer
│   ├── components.css    Buttons, cards, switches, dialogs, hint menu, tour
│   ├── pages.css         Home, game, Kids, result screen, level map, dictionary…
│   └── figures.css       Colors and animations of the five figures
├── data/
│   ├── i18n/en.json      English interface text
│   ├── i18n/nl.json      Dutch interface text
│   ├── words/en.js       English words + descriptions
│   ├── words/nl.js       Dutch words + descriptions
│   └── kids.js           Kids words (both languages) + picture names
├── js/
│   ├── theme-init.js     Sets colors, text size and language before the page shows
│   ├── analytics.js      GoatCounter setup (fill in your code here)
│   ├── core/             Game logic without page code
│   │   ├── i18n.js         Loading texts, t() and translatePage()
│   │   ├── round.js        One round: word, lives, guesses, hints
│   │   ├── words.js        Word lists per language
│   │   ├── daily.js        Daily words per date and language
│   │   ├── levels.js       The 40 levels and stars
│   │   ├── progress.js     Stats, streaks, XP, coins, dictionary, hints, shop
│   │   ├── achievements.js Badges
│   │   ├── figures.js      Figures and how to unlock them
│   │   ├── themes.js       Color themes and how to unlock them
│   │   ├── xp.js           Player levels
│   │   ├── storage.js      Saving in localStorage
│   │   ├── dates.js        Date helpers
│   │   └── random.js       (Seeded) random helpers
│   ├── ui/
│   │   ├── figures/        classic, balloon, flower, snowman, rocket (+ index, steps)
│   │   ├── pictures.js     SVG pictures for the Kids mode
│   │   ├── layout.js       Header, tab bar, footer, language switch
│   │   ├── welcome.js      First-visit dialog
│   │   ├── tutorial.js     Interactive tour
│   │   ├── keyboard.js     On-screen keyboard
│   │   ├── feedback.js     Sounds (Web Audio) and vibration
│   │   ├── countdown.js    Countdown to the next Daily
│   │   ├── confetti.js     Confetti on a win
│   │   ├── toast.js        Small messages, copy to clipboard
│   │   ├── appearance.js   Color mode, theme, text size, contrast, motion
│   │   ├── install.js      "Install app" button
│   │   └── icons.js        Line icons and the logo
│   └── pages/            One script per page
└── assets/               Logo, favicon, app icons, preview image
```

## Privacy

No account and no cookies. All progress is saved in the browser's
`localStorage` on the player's own device. The Nunito font is loaded from Google
Fonts. Visitor statistics with GoatCounter are off until you add your code.

## Credits

Inspired by the Codédex Python tutorial, rebuilt as a full web game.
