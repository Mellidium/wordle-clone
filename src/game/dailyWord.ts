import { ANSWERS } from './words'

/** Wordle's day 0. Puzzle number = days elapsed since this date. */
const EPOCH = Date.UTC(2021, 5, 19)
const DAY_MS = 86_400_000

export interface DailyWord {
  /** YYYY-MM-DD the puzzle is for. */
  date: string
  /** Days since the Wordle epoch — the "#1234" in a share string. */
  puzzleNumber: number
  word: string
  length: number
}

/** The player's local date, so the puzzle rolls over at their midnight. */
function localDate(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function puzzleNumber(date: string): number {
  const [y, m, d] = date.split('-').map(Number)
  return Math.floor((Date.UTC(y, m - 1, d) - EPOCH) / DAY_MS)
}

/**
 * Today's puzzle, picked straight from the answer list.
 *
 * The site is static, so there's no server to ask — the same modulo the old
 * `/api/word` endpoint ran now runs in the browser. Everyone asking on the same
 * local date gets the same word, which is all the daily puzzle needs.
 */
export function getDailyWord(): DailyWord {
  const date = localDate()
  const n = puzzleNumber(date)

  // A clock set before the epoch gives a negative n; wrap it back into range
  // rather than reading off the end of the list.
  const word = ANSWERS[((n % ANSWERS.length) + ANSWERS.length) % ANSWERS.length]

  return { date, puzzleNumber: n, word, length: word.length }
}
