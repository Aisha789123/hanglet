# Hanglet v4 – from guessing game to riddle game

Problem: Hanglet looks good, but the game itself is too hard (owner's own stats:
15 played, 27% won) and it is not clear who it is for: the home page looks like
it is for children, the game is a hard puzzle for adults.

**Audience:** a cheerful, playful word game for everyone from 8 years old
(like Duolingo: playful, but adults enjoy it too). **Kids (6–9)** is a separate,
even easier world. No more "calm" / "rustig" anywhere.

Tick the boxes when done.

## 1. From guessing game to riddle (most important)
- [x] The description is ALWAYS free and big on screen, as a riddle (Tilo asks it)
- [x] The word tiles are central and big, the figure is smaller
- [x] Difficulty rules in one place (`js/core/difficulty.js`):
      Easy = riddle + first letter free + 8 lives, Normal = riddle + 7 lives,
      Hard = only the category + 6 lives
- [x] Easy is the default for new players
- [x] Daily, Levels, Classic and Time Attack all follow the chosen difficulty;
      difficulty can also be changed in Settings
- [x] Adaptive: after 2 losses in a row Tilo kindly offers an easier difficulty
- [x] Lives as clear hearts with the text "5 lives left" / "5 levens over"
- [x] Word lists checked: hard, rare or ambiguous words removed, vague
      descriptions rewritten (EN + NL)
- [x] Description hint only exists on Hard (no paying for something that is free)

## 2. The figure
- [x] Default figure for new players: the balloon. Classic stays in Settings
- [x] No dotted preview of the whole figure (classic gallows, rocket outline)

## 3. Kids world
- [x] Own world page (`kids.html`) with its own start button on the home page
- [x] Always a picture + description, only words of 3–5 letters (EN + NL)
- [x] Keyboard with ONLY the letters of the word + 4–6 extra letters, big and colorful
- [x] No losing: wrong letters → Tilo helps with an extra hint; the word is always
      finished together, with a compliment
- [x] No coins / XP in the Kids world, but stickers to collect (sticker book)

## 4. Finishing
- [x] Level map as a real illustrated map: paths, trees, hills, clouds,
      a different landscape per world
- [x] Home: less empty space; chest and "Play offline" compacter and nicer
- [x] All pages checked for empty space and unfinished parts

## 5. Checks
- [x] All texts in NL and EN, phone (390) and laptop (1440), accessibility kept
- [x] `node --check` on all files, all tests pass
- [x] New tests: difficulty, Kids keyboard, adaptive suggestion (+ word list rules)
- [x] Simulation: 50 rounds on Normal with "common letters first", win % in the report
- [x] CACHE_NAME up in sw.js, new files in the cache list
- [x] README updated
- [x] Final report: what changed and what to test

## Results

**Tests:** 45 tests in `tests/` (difficulty, Kids keyboard and help, adaptive
offer, word lists, core logic), all pass. `node --check` passes on every JS file.

**Simulation** (`node tools/simulate.js 50 normal`, 50 words per language,
mixed short / medium / long like the Daily, Normal = 7 lives):

| Player | EN | NL |
|---|---|---|
| Common letters first (the requested simple strategy, ignores the riddle) | 16% | 8% |
| Same, but recognises the word from the riddle once half the tiles show | 90% | 90% |
| Same, but needs two thirds of the tiles before recognising | 66% | 48% |
| Knows the whole word list (best case) | 100% | 100% |

Over five other seeds the simple strategy stays at 8–18%, the riddle reader
at 82–96%. The simple strategy is a worst case: it plays like the old game
without a riddle (compare the owner's 27% on the old version). The real win
rate depends on how fast a person recognises the word from the riddle; the
65–80% target lies between the "half" and "two thirds" players. Dutch words
are longer, so Dutch is harder. Check this with real players.
