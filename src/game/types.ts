export type LetterState = 'empty' | 'absent' | 'present' | 'correct'

export interface Guess {
  word: string
  states: LetterState[]
}

export type GameStatus = 'playing' | 'won' | 'lost'

export const WORD_LENGTH = 10
export const MAX_GUESSES = 8
