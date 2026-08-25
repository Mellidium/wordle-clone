import type { Guess, GameStatus, LetterState } from './types'
import { MAX_GUESSES, WORD_LENGTH } from './types'
import { GUESSES_FLAT } from './guesses'

export function evaluateGuess(guess: string, answer: string): LetterState[] {
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

export function deriveKeyboardStates(guesses: Guess[]): Record<string, LetterState> {
  const stateRanks = ['absent','present','correct']


  const keyboardStates: Record<string, LetterState> = {}
  for(let i = 0; i < guesses.length; i++){
    for(let c = 0; c < guesses[i].word.length; c++){
      if(stateRanks.indexOf(guesses[i].states[c]) > stateRanks.indexOf(keyboardStates[guesses[i].word[c]])){
        keyboardStates[guesses[i].word.charAt(c)] = guesses[i].states[c]
      }
    }
  }

  return keyboardStates
}

export function getGameStatus(guesses: Guess[]): GameStatus {
  if(guesses.length === 0){
    return 'playing'
  }
  
  if(guesses[guesses.length - 1].states.every((val) => val === 'correct')){ return 'won' }
  if(guesses.length >= MAX_GUESSES){ return 'lost' }
  return 'playing'
}


const ALLOWED: ReadonlySet<string> = new Set(
  Array.from({ length: GUESSES_FLAT.length / WORD_LENGTH }, (_, i) =>
    GUESSES_FLAT.slice(i * WORD_LENGTH, (i + 1) * WORD_LENGTH),
  ),
)

export function isValidGuess(word: string): boolean {
  return ALLOWED.has(word.toLowerCase())
}
