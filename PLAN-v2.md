# Hanglet v2 – plan

Goal: a game for all ages (kids 6+, adults, seniors) that people want to open every day.

## 1. Languages (English + Dutch)
- `data/i18n/en.json` and `data/i18n/nl.json` hold all interface text
- `js/core/i18n.js` loads the right file (saved choice → browser language → English)
- Static HTML uses `data-i18n` attributes; long text pages (How to play, About, Privacy) have an English and a Dutch section
- Own word list per language: `data/words/en.js` and `data/words/nl.js` (real Dutch words, no translations), 40+ words per category
- Language choice in Settings and in a welcome dialog on the first visit

## 2. Hints
- Every word gets a short description in its own language
- Three hint types: show description (10 coins), reveal a letter (20), remove 3 wrong letters (15)
- Hints are free in Kids mode
- Hint menu (bottom sheet) on the game screen

## 3. Figures
- `js/ui/figures/`: classic (redrawn), balloon (deflates), flower (loses petals), snowman (melts), rocket (built with every right letter, flies away on a win)
- Same interface for each figure: `create(container)` → `{ update(state), win(), lose() }`
- Classic and balloon are free, flower and rocket cost coins, snowman is unlocked by the "Getting good" badge
- Choose the figure in Settings (shop with previews)

## 4. All ages
- Kids mode (`play.html?mode=kids`): short easy words with a picture hint (own SVG pictures), 10 lives, big keys, cheerful colors, free hints, friendly texts, no timer
- Settings: large text, high contrast
- Interactive tutorial the first time someone plays (spotlight steps, asks to tap a letter)

## 5. Color and feel
- Richer palette (category colors, mode colors), more themes, still calm
- Level map with a winding path (`levels.html`)
- Live countdown to the next Daily
- "My dictionary" page (`dictionary.html`) with every solved word and its description
- Better sounds (Web Audio with filters and envelopes) and a nicer result screen (word tiles, description, counting rewards)

## 6. Statistics
- `js/analytics.js`: one clear place to fill in a GoatCounter code (off by default)
- Privacy page updated in English and Dutch

## 7. Quality
- Phone, tablet, laptop; keyboard + screen readers; contrast
- `node --check` on all JS, logic tests in Node, browser tests in headless Chrome
- Check that every translation key exists in both languages
- Update README, no git commits
