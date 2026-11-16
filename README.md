# Hanglet

**A calm word game, one letter at a time.**

Hanglet is a word guessing game for the browser. Guess the hidden word letter by
letter before the drawing is finished. Play the Daily challenge (the same three
words for everyone), endless Classic games, a path of 40 levels or a 2-minute
Time Attack. Earn XP and coins, unlock badges and color themes, and keep your
streak going.

Inspired by the Codédex Python tutorial, rebuilt as a full web game.

![Hanglet preview](assets/og-image.png)

## Features

**Game modes**
- **Daily** – three words per day (short, medium, long), the same for every player, based on the date. Playable once per day and continues where you left off.
- **Classic** – endless play with your own options.
- **Levels** – 40 levels in four stages (Warm-up, Climb, Expert, Summit). Words get longer, lives get fewer. Earn up to 3 stars and unlock the next level.
- **Time Attack** – solve as many words as you can in 2 minutes.

**Options**
- Word length: short (4–5), medium (6–7), long (8+)
- Difficulty: easy (8 lives), normal (6), hard (4)
- 8 categories + Mixed: animals, food, countries, sports, nature, jobs, science, music
- 480 English words (60 per category), all family friendly

**Progress and rewards**
- XP and player levels, coins for every win
- Hints: reveal a letter for 20 coins
- 17 badges (first win, flawless game, 7-day streak, all levels, …)
- 6 color themes, unlocked by player level or streak
- Daily streak and win streak, with a calendar
- Statistics: played, win %, streaks, misses per game

**Settings**
- System / light / dark mode
- Sound effects (made with the Web Audio API, no audio files)
- Vibration on phones
- Reduce motion (also follows the device setting)
- Reset all progress

**Website and app**
- Home, How to play, About, Privacy and 404 pages
- Spoiler-free share button (copies the result to the clipboard)
- Installable as an app (PWA) and works offline
- Title, description and Open Graph tags on every page
- Mobile-first, works on phone, tablet and laptop
- Accessible: keyboard play, screen reader labels and messages, visible focus, good contrast

## How to run

Hanglet uses JavaScript modules, so it needs to be opened through a web server
(double-clicking `index.html` will not work). There is no build step.

Pick one:

- **VS Code:** install the *Live Server* extension, right-click `index.html` and choose *Open with Live Server*.
- **Python:** run `python -m http.server 8000` in this folder and open <http://localhost:8000>.
- **Node:** run `npx serve` in this folder.

### Publish on GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to *Settings → Pages* and choose *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. Your game will be live at `https://<username>.github.io/<repository>/`.

All paths are relative, so it works in a subfolder too. For better link previews,
replace `assets/og-image.png` in the `og:image` tags with the full URL of your site.

### Updating the offline version

The service worker (`sw.js`) saves all files for offline use. After you change
files, raise the version in `CACHE_NAME` (for example `hanglet-v2`) so players
get the new files.

## Folder structure

```
word-guessing-web/
├── index.html            Home page
├── play.html             Game screen for all modes (?mode=daily|classic|levels|timed)
├── levels.html           Level path
├── stats.html            Statistics, calendar and badges
├── settings.html         Appearance, sound, motion and reset
├── how-to-play.html      Rules
├── about.html            About the game
├── privacy.html          Privacy (all data stays local)
├── 404.html              Page not found
├── manifest.webmanifest  PWA settings
├── sw.js                 Service worker (offline support)
├── robots.txt
├── css/
│   ├── base.css          Design tokens, themes, layout, header and footer
│   ├── components.css    Buttons, cards, switches, dialogs, toasts
│   └── pages.css         Styles per page (game, levels, stats, …)
├── data/
│   └── words.js          The word list per category
├── js/
│   ├── theme-init.js     Sets colors before the page is drawn (no flash)
│   ├── core/             Game logic without any page code
│   │   ├── round.js        One round: word, lives, guesses, hints
│   │   ├── words.js        Picking words by category and length
│   │   ├── daily.js        The same Daily words for everyone
│   │   ├── levels.js       The 40 levels and stars
│   │   ├── progress.js     Stats, streaks, XP, coins, badges
│   │   ├── achievements.js The badges
│   │   ├── themes.js       Color themes and how to unlock them
│   │   ├── xp.js           Player levels
│   │   ├── storage.js      Saving in localStorage
│   │   ├── dates.js        Date helpers
│   │   └── random.js       (Seeded) random helpers
│   ├── ui/               Shared page parts
│   │   ├── layout.js       Header, tab bar, footer
│   │   ├── hangman.js      The SVG drawing
│   │   ├── keyboard.js     The on-screen keyboard
│   │   ├── feedback.js     Sounds and vibration
│   │   ├── confetti.js     Confetti on the win screen
│   │   ├── toast.js        Small messages and copy to clipboard
│   │   ├── appearance.js   Light/dark, theme and motion
│   │   ├── install.js      "Install app" button
│   │   └── icons.js        Line icons and the logo
│   └── pages/            One script per page
└── assets/               Logo, favicon, app icons, preview image
```

## Privacy

There is no server, no account and no tracking. All progress is saved in the
browser's `localStorage` on the player's own device. Only the Nunito font is
loaded from Google Fonts.

## Credits

Inspired by the Codédex Python tutorial, rebuilt as a full web game.
