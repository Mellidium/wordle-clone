import { evaluateGuess } from './logic'
import { MAX_GUESSES, WORD_LENGTH, type Guess } from './types'

const KEY = 'evans-wordle:progress:v1'

// Only the raw words are stored: tile colours are a pure function of the guess
// and the answer, so re-deriving them on load keeps the record small and stops
// a hand-edited entry from painting a board the scoring rules disagree with.
interface StoredProgress {
  puzzleNumber: number
  answer: string
  guesses: string[]
  draft: string
}

export interface Progress {
  guesses: Guess[]
  draft: string
}

// Storage is a privilege, not a guarantee -- Safari's private mode and blocked
// site data both throw on access rather than returning null.
function store(): Storage | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

function isWord(value: unknown): value is string {
  return typeof value === 'string' && new RegExp(`^[a-z]{${WORD_LENGTH}}$`).test(value)
}

function isDraft(value: unknown): value is string {
  return typeof value === 'string' && /^[a-z]*$/.test(value) && value.length <= WORD_LENGTH
}

// Anything unrecognised is treated as absent rather than repaired: a fresh
// board is a much better failure than a board restored from junk.
function parse(raw: string): StoredProgress | null {
  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch {
    return null
  }

  if (typeof value !== 'object' || value === null) return null
  const record = value as Partial<StoredProgress>

  if (typeof record.puzzleNumber !== 'number') return null
  if (!isWord(record.answer)) return null
  if (!Array.isArray(record.guesses)) return null
  if (record.guesses.length > MAX_GUESSES) return null
  if (!record.guesses.every(isWord)) return null
  if (!isDraft(record.draft)) return null

  return record as StoredProgress
}

// A saved board only belongs to the puzzle it was played on: a new day, or an
// answer list that shifted underneath it, means yesterday's guesses go.
export function loadProgress(puzzleNumber: number, answer: string): Progress | null {
  const raw = store()?.getItem(KEY)
  if (!raw) return null

  const record = parse(raw)
  if (!record || record.puzzleNumber !== puzzleNumber || record.answer !== answer) {
    clearProgress()
    return null
  }

  return {
    guesses: record.guesses.map((word) => ({ word, states: evaluateGuess(word, answer) })),
    draft: record.draft,
  }
}

export function saveProgress(record: StoredProgress): void {
  try {
    store()?.setItem(KEY, JSON.stringify(record))
  } catch {
    // A full or read-only quota costs the player their progress, not their game.
  }
}

export function clearProgress(): void {
  try {
    store()?.removeItem(KEY)
  } catch {
    // Nothing to do -- the entry is unreachable either way.
  }
}
