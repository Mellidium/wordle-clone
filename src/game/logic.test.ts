import { describe, expect, it } from 'vitest'
import { deriveKeyboardStates, evaluateGuess, getGameStatus, isValidGuess } from './logic'
import { MAX_GUESSES, type Guess } from './types'
import { ANSWERS } from './words'

// Shorthand: c = correct (green), p = present (yellow), a = absent (grey)
const parse = (pattern: string) =>
  pattern.split('').map((ch) => ({ c: 'correct', p: 'present', a: 'absent' })[ch])

const guess = (word: string, pattern: string): Guess => ({
  word,
  states: parse(pattern) as Guess['states'],
})

describe('evaluateGuess', () => {
  it('marks exact matches', () => {
    expect(evaluateGuess('basketball', 'basketball')).toEqual(parse('cccccccccc'))
  })

  it('marks letters not in the answer', () => {
    expect(evaluateGuess('acceptable', 'groundwork')).toEqual(parse('aaaaaaaaaa'))
  })

  it('mixes correct and misplaced letters', () => {
    expect(evaluateGuess('technology', 'psychology')).toEqual(parse('aappaccccc'))
  })

  it('does not over-count a repeated letter in the guess', () => {
    expect(evaluateGuess('absolutely', 'kilometers')).toEqual(parse('aapcpaccaa'))
  })

  it('lets exact matches claim their letter first', () => {
    expect(evaluateGuess('absolutely', 'accurately')).toEqual(parse('caaaapcccc'))
  })
})

describe('deriveKeyboardStates', () => {
  it('is empty before any guesses', () => {
    expect(deriveKeyboardStates([])).toEqual({})
  })

  it('records the state of each guessed letter', () => {
    expect(deriveKeyboardStates([guess('technology', 'aappaccccc')])).toEqual({
      t: 'absent',
      e: 'absent',
      c: 'present',
      h: 'present',
      n: 'absent',
      o: 'correct',
      l: 'correct',
      g: 'correct',
      y: 'correct',
    })
  })

  it('never downgrades a letter that was already green', () => {
    const states = deriveKeyboardStates([
      guess('technology', 'aappaccccc'),
      guess('greenhouse', 'aaaaaaaaaa'),
    ])
    expect(states.g).toBe('correct')
    expect(states.o).toBe('correct')
  })

  it('upgrades yellow to green', () => {
    const states = deriveKeyboardStates([
      guess('technology', 'aappaccccc'),
      guess('chessboard', 'caaaaaaaaa'),
    ])
    expect(states.c).toBe('correct')
  })
})

describe('getGameStatus', () => {
  it('is playing with no guesses', () => {
    expect(getGameStatus([])).toBe('playing')
  })

  it('is playing after a wrong guess', () => {
    expect(getGameStatus([guess('technology', 'aappaccccc')])).toBe('playing')
  })

  it('is won when a guess is all correct', () => {
    expect(
      getGameStatus([
        guess('technology', 'aappaccccc'),
        guess('psychology', 'cccccccccc'),
      ]),
    ).toBe('won')
  })

  it(`is lost after ${MAX_GUESSES} wrong guesses`, () => {
    const wrong = Array.from({ length: MAX_GUESSES }, () =>
      guess('acceptable', 'aaaaaaaaaa'),
    )
    expect(getGameStatus(wrong)).toBe('lost')
  })
})

describe('isValidGuess', () => {
  it('accepts a word from the answer list', () => {
    expect(isValidGuess('basketball')).toBe(true)
  })

  it('accepts a real word that is not an answer', () => {
    expect(isValidGuess('strawberry')).toBe(true)
    expect(isValidGuess('rhinoceros')).toBe(true)
  })

  it('rejects ten letters that are not a word', () => {
    expect(isValidGuess('qqqqqqqqqq')).toBe(false)
  })

  it('rejects the wrong number of letters', () => {
    expect(isValidGuess('cat')).toBe(false)
    expect(isValidGuess('')).toBe(false)
  })

  it('ignores case', () => {
    expect(isValidGuess('BASKETBALL')).toBe(true)
  })

  it('accepts every answer, so no puzzle is unguessable', () => {
    expect(ANSWERS.filter((word) => !isValidGuess(word))).toEqual([])
  })
})
