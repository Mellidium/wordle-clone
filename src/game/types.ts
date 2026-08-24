/** How a single letter of a submitted guess is scored. */
export type LetterState = 'empty' | 'absent' | 'present' | 'correct'

/** A guess the player has already submitted, plus its scoring. */
export interface Guess {
  word: string
  states: LetterState[]
}

export type GameStatus = 'playing' | 'won' | 'lost'

export const WORD_LENGTH = 5
export const MAX_GUESSES = 6
