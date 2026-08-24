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
 * present/yellow marks are handed out. With ten letters in play, guesses
 * repeat letters constantly, so this matters more than it does at five.
 *
 *   evaluateGuess('absolutely', 'kilometers')
 *     -> a a p c p a c c a a
 *        ABSOLUTELY has two L's but KILOMETERS has one, so only the first
 *        earns a yellow; the second is grey.
 *
 *   evaluateGuess('absolutely', 'accurately')
 *     -> c a a a a p c c c c
 *        Here the *second* L lines up exactly, so it takes green and the
 *        earlier L gets nothing — greens are assigned before yellows.
 *
 * @param guess  lowercase, WORD_LENGTH letters
 * @param answer lowercase, WORD_LENGTH letters
 *
 */


export function evaluateGuess(guess: string, answer: string): LetterState[] {
  // TODO: implement. Placeholder keeps the board rendering.
  const states: LetterState[] = Array.from({ length: WORD_LENGTH}, () => 'absent' as LetterState )
  const remaining = new Map<string, number>()
  guess = guess.toLowerCase()
  answer = answer.toLowerCase()

  for (const ch of answer) {
    remaining.set(ch, (remaining.get(ch) ?? 0) + 1)
  }

  for(let i = 0; i < states.length; i++){
    const ch = guess.charAt(i)
    if(guess.charAt(i) == answer.charAt(i)){
      remaining.set(ch, (remaining.get(ch) ?? 0) - 1)
      states[i] = 'correct'
    }
  }

  for(let i = 0; i < states.length; i++){
    if (states[i] === 'correct') continue
    const ch = guess.charAt(i)
    const remainder = remaining.get(ch) ?? 0
    if(remainder > 0){
      states[i] = 'present'
      remaining.set(ch, (remaining.get(ch) ?? 0) - 1)
    }
  }
  
  return states
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
  if(guesses.length === 0){
    return 'playing'
  }
  
  if(guesses[guesses.length - 1].states.every((val) => val === 'correct')){ return 'won' }
  if(guesses.length >= MAX_GUESSES){ return 'lost' }
  return 'playing'
}

/**
 * Should this guess be accepted when the player hits Enter?
 *
 * Real Wordle rejects anything that isn't in its dictionary. You could ship a
 * word list, or add an /api/validate endpoint that checks server-side.
 * Returning `true` here means "any 10 letters are fine".
 */
export function isValidGuess(word: string): boolean {
  // TODO: implement (optional).
  void word
  return true
}
