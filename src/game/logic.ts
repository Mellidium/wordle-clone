import type { Guess, GameStatus, LetterState } from './types'
import { MAX_GUESSES, WORD_LENGTH } from './types'

/* ============================================================================
 * THIS FILE IS THE PART YOU WRITE.
 *
 * Everything else (UI, keyboard input, API, state plumbing) is wired up and
 * calls into these four pure functions. They currently return placeholder
 * values so the app runs — replace each one.
 *
 * `npm run test` runs src/game/logic.test.ts, which covers the cases that
 * make Wordle scoring non-obvious. Those tests fail right now, by design.
 * ==========================================================================*/

/**
 * Score a guess against the answer, one state per letter.
 *
 * The interesting part is repeated letters: each letter of the answer can only
 * be "used up" once, and exact matches claim their letter before any
 * present/yellow marks are handed out.
 *
 *   evaluateGuess('speed', 'abide') -> absent, absent, present, absent, present
 *   evaluateGuess('geese', 'these') -> absent, absent, correct, absent, correct
 *
 * @param guess  lowercase, WORD_LENGTH letters
 * @param answer lowercase, WORD_LENGTH letters
 */
export function evaluateGuess(guess: string, answer: string): LetterState[] {
  // TODO: implement. Placeholder keeps the board rendering.
  void guess
  void answer
  return Array.from({ length: WORD_LENGTH }, () => 'absent' as LetterState)
}

/**
 * Collapse every guess so far into the state to paint on each keyboard key.
 *
 * A key keeps its best-known state: once a letter is green it never downgrades
 * to yellow or grey. Returns a map of letter -> state; letters not yet guessed
 * should be absent from the map.
 */
export function deriveKeyboardStates(guesses: Guess[]): Record<string, LetterState> {
  // TODO: implement.
  void guesses
  return {}
}

/** Has the player won, lost, or are they still going? */
export function getGameStatus(guesses: Guess[]): GameStatus {
  // TODO: implement — won if the last guess was all `correct`,
  // lost if MAX_GUESSES have been used without that.
  void guesses
  void MAX_GUESSES
  return 'playing'
}

/**
 * Should this guess be accepted when the player hits Enter?
 *
 * Real Wordle rejects anything that isn't in its dictionary. You could ship a
 * word list, or add an /api/validate endpoint that checks server-side.
 * Returning `true` here means "any 5 letters are fine".
 */
export function isValidGuess(word: string): boolean {
  // TODO: implement (optional).
  return word.length === WORD_LENGTH
}
