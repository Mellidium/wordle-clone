# Wordle clone

Wordle with 10-letter words and 8 guesses. React + TypeScript + Vite, deployed
to GitHub Pages.

## Running it

```bash
npm install
npm run dev
npm run test
```

## Layout

| Path | What it is |
| --- | --- |
| `src/game/logic.ts` | Scoring, keyboard states, win/loss, guess validation. |
| `src/game/types.ts` | `WORD_LENGTH` and `MAX_GUESSES` live here. |
| `src/game/useGame.ts` | Board state and key handling. |
| `src/game/dailyWord.ts` | Picks the day's answer. |
| `src/game/words.ts` | Answer list. |
| `src/game/guesses.ts` | Generated dictionary — `npm run build:guesses`. |
| `src/components/` | `Board`, `Keyboard`, `Confetti`. |

## The daily word

`ANSWERS[daysSinceEpoch % ANSWERS.length]`, computed in the browser from the
player's local date, so the puzzle rolls over at their midnight and everyone
gets the same word on the same day.

The answer ships in the bundle, so anyone with devtools can read it. Scoring
would have to move to a server to change that.

## Word length and guess count

Both are in `src/game/types.ts`. The board is sized from them at runtime, but
`words.ts` has to be replaced with a list of the matching length, and the
dictionary regenerated.

## Deploying

Pushing to `main` builds and publishes to GitHub Pages via
[.github/workflows/deploy.yml](.github/workflows/deploy.yml).
