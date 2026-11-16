# Hanglet – build plan

Name: **Hanglet** (hang + letter). Logo: a letter tile hanging from a hook.

## Pages
| Page               | Purpose                                                  |
| ------------------ | -------------------------------------------------------- |
| `index.html`       | Home: logo, short intro, mode cards, player summary      |
| `play.html`        | Game screen for all modes (`?mode=daily/classic/levels/timed`) |
| `levels.html`      | Level path (40 levels, unlock one by one, stars)         |
| `stats.html`       | Statistics, streak calendar, achievements                |
| `settings.html`    | Light/dark, color themes, sound, vibration, motion, reset |
| `how-to-play.html` | Rules and tips                                           |
| `about.html`       | About the game                                           |
| `privacy.html`     | Privacy: all data stays in localStorage                  |
| `404.html`         | Not found page (GitHub Pages)                            |

## Folders
- `css/` – `base.css` (tokens, layout), `components.css` (buttons, cards, dialogs), `pages.css` (game, home, stats…)
- `js/core/` – game logic without DOM: storage, round, progress, achievements, themes, levels, daily, random
- `js/ui/` – shared DOM helpers: layout (header/footer), icons, hangman, keyboard, confetti, toast, feedback (sound + vibration)
- `js/pages/` – one small script per page
- `data/words.js` – 8 categories, 40+ words each
- `assets/` – logo, favicon, app icons, Open Graph image
- `manifest.webmanifest`, `sw.js` – PWA + offline

## Features
1. Modes: Daily (3 words per day, same for everybody), Classic (endless), Levels (40), Time Attack (2 min)
2. Options: word length (short/medium/long), difficulty (8/6/4 lives), 8 categories + Mixed
3. Progress: XP + player level, coins, hints (reveal a letter for coins), achievements, unlockable themes
4. Streaks: daily streak + win streak, calendar on stats page
5. Stats: played, win %, streaks, distribution of misses
6. Settings: color mode, theme, sound (Web Audio), vibration, reduce motion, reset
7. Share: spoiler-free result copied to clipboard
8. PWA: manifest, service worker, offline
9. SEO: title, description, Open Graph on every page
10. Accessibility: keyboard play, aria-labels, live region, focus styles, contrast

## Checks
- `node --check` on every JS file
- Headless browser test: load every page, catch console errors, play a game
- Feature checklist in README / final report
