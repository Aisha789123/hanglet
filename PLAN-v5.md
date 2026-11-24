# Hanglet v5 – the riddle gets clearer

The lab test (lab.html) was a hit: players liked "the riddle gets clearer" more
than the old game. In v5 this idea becomes the heart of every mode, and the
game gets simpler: no coins, no shop, no chest, no missions, no Time Attack.
Stars are the only reward.

Tick the boxes when done.

## The core rules (one place: `js/core/round.js` + `js/core/difficulty.js`)
- Every word has 3 clues: 1 = smart (wordplay, "I" form), 2 = clearer, 3 = almost the answer
- You start with clue 1. Every 2 lost lives open the next clue
- "I know it!": type the whole word. Wrong = 2 lives. Wrong length = free
- Solved at clue 1 = 3 stars, clue 2 = 2 stars, clue 3 = 1 star, lost = 0
- Easy = 8 lives + first letter free, Normal = 7 lives, Hard = 6 lives and clue 3 never comes

## 1. The core in every mode
- [x] Round with clues, "I know it!" and stars (no hints, no coins)
- [x] Difficulty rules: lives, free first letter, clue 3 on/off
- [x] Daily: 3 riddles a day, the same for everyone with the same language
- [x] Daily share text with stars: "Hanglet #330 ⭐⭐⭐ ⭐⭐ ⭐ (6/9)"
- [x] Classic: endless riddles, choose category and length
- [x] Levels: 3–6 riddles per level, level stars from the total stars earned
- [x] Kids: easy, funny clues + picture, short words, own keyboard, can't lose
- [x] Challenge a friend: the friend writes 1 to 3 clues, same rules

## 2. Words and riddles
- [x] New word format with 3 clues: `data/words/en.js`, `data/words/nl.js`, `data/kids.js`
- [x] All 80 lab words taken over (clue 1 rewritten where it was a well-known riddle)
- [x] At least 200 words per language over 11 categories (+ a Winter list)
- [x] Kids words with 3 easy, funny clues in both languages
- [x] Tests: exactly 3 clues, word never in its own clues, a–z only, enough words per length

## 3. Simpler
- [x] Removed: coins, buying hints, treasure chest, daily missions, Time Attack, XP and player levels
- [x] Figures and themes unlock with earned stars
- [x] New badges (e.g. "10 words at the first clue", "Daily 9/9"); old badges stay visible
- [x] Home: today's Daily in the middle, then Classic, Levels and Kids. Fewer cards, less text
- [x] Dictionary: the 3 clues of every word and at which clue you solved it
- [x] Statistics: average stars per word, % solved at clue 1, solved per clue

## 4. Technical
- [x] The Daily is the same for everyone, also with ?season=winter (no season words in the Daily)
- [x] Service worker: "New version available – refresh" message
- [x] Export and import progress (file) in Settings
- [x] Manifest in Dutch too, Kids shortcut to kids.html
- [x] Migration: players keep their streaks, badges, dictionary, levels and unlocked looks

## 5. Finishing
- [x] Screenshots 390 px and 1440 px of every page, improve
- [x] All texts in NL and EN, accessibility kept
- [x] node --check and all tests pass, new tests for the core rules, Daily, migration and export
- [x] lab.html and lab.js removed
- [x] CACHE_NAME up, all files in the cache list (with a test)
- [x] README and ../hanglet-overzicht.md updated
- [x] Final report

## Results

**Tests:** 76 tests in `tests/`, all pass. `node --check` passes on every JS file.

**Words:** 238 English and 259 Dutch words with 3 clues each (+ 14 / 12 winter
words), 48 Kids pictures with 3 easy clues per language. All 80 lab words are in;
the lab clue 1 was rewritten where it was a well-known internet riddle (towel,
candle, needle, bottle, comb, glove, echo, secret, silence and others). Two weak
Dutch winter words were left out.

**Simulation** (`node tools/simulate.js 50 <difficulty>`, a model, not real players):

| Difficulty | Common letters only | Reads the clues | Knows the word list |
|---|---|---|---|
| Easy | EN 30% / NL 28% | EN 100% / NL 100%, ~1.8★ | 100%, 3.0★ |
| Normal | EN 12% / NL 16% | EN 98% / NL 98%, 1.5★ | 100%, 3.0★ |
| Hard | EN 8% / NL 16% | EN 78% / NL 82%, 1.6★ | 100%, 3.0★ |

The "reads the clues" player is an assumption (75% / 50% / 25% of the tiles visible
before the word clicks at clue 1 / 2 / 3). Check the real numbers with players.

**Screenshots** (390 px and 1440 px, light and dark): home, Daily (playing, solved,
lost, finished, done page), Classic setup, Kids, levels, dictionary, statistics,
badges, settings, challenge (making and playing), How to play, About, welcome,
share card. Also with saved data from a version 1 player. No console errors.
