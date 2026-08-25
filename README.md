# Wordle clone

A React + TypeScript shell for a Wordle clone, played with **10-letter words
and 8 guesses**. The UI, keyboard handling, and the daily-word API are done —
the game logic is left for you to write.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173 — serves the UI *and* /api/*
```

## Where the code lives

| Path | What it is |
| --- | --- |
| `src/game/logic.ts` | **Start here.** Four pure functions, currently stubbed. |
| `src/game/logic.test.ts` | Tests for those functions. They fail until you write them. |
| `src/game/answers.test.ts` | Guards the word list against the board's dimensions. |
| `src/game/types.ts` | `LetterState`, `Guess`, and the `WORD_LENGTH` / `MAX_GUESSES` constants. |
| `src/game/useGame.ts` | Keystroke plumbing; calls into `logic.ts`. |
| `src/components/` | `Board` (tiles, flip + shake animations) and `Keyboard`. |
| `src/api/dailyWord.ts` | Client for `/api/word`. |
| `api/word.ts` | Serverless function: picks the answer from the date. |
| `api/words.ts` | The answer list. |

The app runs right now — you can type, letters land on the board, rows submit.
Every guess just comes back all-grey because `evaluateGuess` is a placeholder.

### Changing the word length or guess count

Both live in `src/game/types.ts`. The board reads them at runtime (they're
passed to CSS as custom properties), and the components size themselves from
them — but `api/words.ts` has to be swapped for a list of the matching length,
or the API will hand back words that don't fit the board.

```bash
npm run test         # run the logic tests once
npm run test:watch   # re-run as you edit
```

## How the daily word works

`GET /api/word?date=YYYY-MM-DD` returns:

```json
{ "date": "2026-08-24", "puzzleNumber": 1892, "word": "wilderness", "length": 10 }
```

The client sends its own local date, so the puzzle rolls over at each player's
midnight. The answer is `ANSWERS[daysSinceEpoch % ANSWERS.length]` — everyone
gets the same word on the same day, and it repeats once the list runs out.

Note that the answer is sent to the browser in plain JSON, so anyone with
devtools can peek. That's the same trade-off the original made (it shipped the
whole list in the bundle). If you'd rather not, score guesses server-side
instead: `POST /api/guess` with the guess, return only the letter states.

In dev, a small plugin in [vite.config.ts](vite.config.ts) mounts the same
handler module at the same URL, so there's no separate API server to run.

## Deploying

Set up for [Vercel](https://vercel.com), which hosts the static build and the
`api/` functions together on the free tier:

```bash
npm i -g vercel
vercel            # first run links the project and deploys a preview
vercel --prod
```

Or push to GitHub and import the repo at vercel.com — it detects Vite, builds
with `npm run build`, and serves `dist/`. Every file in `api/` becomes a
function automatically; no config file needed. Friends get a
`your-project.vercel.app` URL.

If you'd rather use Netlify or Cloudflare Pages, the front end is a plain Vite
build — you'd move `api/word.ts` into their functions directory and adjust the
handler signature.

## Ideas once the logic works

- Persist today's board to `localStorage` so a refresh doesn't lose progress.
- A share string (`Wordle 1892 4/10` + emoji squares) built from `Guess.states`.
- Reject non-words: ship a dictionary, or add `/api/validate`.
- Stats: streak, guess distribution, an end-of-game modal.
