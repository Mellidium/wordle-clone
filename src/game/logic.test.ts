import { describe, expect, it } from 'vitest'
import { deriveKeyboardStates, evaluateGuess, getGameStatus } from './logic'
import type { Guess } from './types'

// Shorthand: c = correct (green), p = present (yellow), a = absent (grey)
const parse = (pattern: string) =>
  pattern.split('').map((ch) => ({ c: 'correct', p: 'present', a: 'absent' })[ch])

const guess = (word: string, pattern: string): Guess => ({
  word,
  states: parse(pattern) as Guess['states'],
})

describe('evaluateGuess', () => {
  it('marks exact matches', () => {
    expect(evaluateGuess('crane', 'crane')).toEqual(parse('ccccc'))
  })

  it('marks misplaced letters', () => {
    expect(evaluateGuess('crane', 'nacre')).toEqual(parse('pppcc'))
  })

  it('marks letters not in the answer', () => {
    expect(evaluateGuess('plumb', 'crane')).toEqual(parse('aaaaa'))
  })

  it('does not over-count a repeated letter in the guess', () => {
    // Only one E in ABIDE, and it is not in position 3 or 4 of SPEED.
    expect(evaluateGuess('speed', 'abide')).toEqual(parse('aapap'))
  })

  it('lets exact matches claim their letter first', () => {
    // Both E's in GEESE line up with THESE's E's; the leading E gets nothing.
    expect(evaluateGuess('geese', 'these')).toEqual(parse('aacac'))
  })

  it('handles a doubled letter in the answer', () => {
    expect(evaluateGuess('eerie', 'geese')).toEqual(parse('pacac'))
  })
})

describe('deriveKeyboardStates', () => {
  it('is empty before any guesses', () => {
    expect(deriveKeyboardStates([])).toEqual({})
  })

  it('records the state of each guessed letter', () => {
    expect(deriveKeyboardStates([guess('crane', 'aapca')])).toEqual({
      c: 'absent',
      r: 'absent',
      a: 'present',
      n: 'correct',
      e: 'absent',
    })
  })

  it('never downgrades a letter that was already green', () => {
    const states = deriveKeyboardStates([guess('crane', 'accaa'), guess('rowdy', 'paaaa')])
    expect(states.r).toBe('correct')
  })

  it('upgrades yellow to green', () => {
    const states = deriveKeyboardStates([guess('crane', 'paaaa'), guess('cider', 'caaaa')])
    expect(states.c).toBe('correct')
  })
})

describe('getGameStatus', () => {
  it('is playing with no guesses', () => {
    expect(getGameStatus([])).toBe('playing')
  })

  it('is playing after a wrong guess', () => {
    expect(getGameStatus([guess('crane', 'aapca')])).toBe('playing')
  })

  it('is won when a guess is all correct', () => {
    expect(getGameStatus([guess('crane', 'aaaaa'), guess('plumb', 'ccccc')])).toBe('won')
  })

  it('is lost after six wrong guesses', () => {
    const wrong = Array.from({ length: 6 }, () => guess('crane', 'aaaaa'))
    expect(getGameStatus(wrong)).toBe('lost')
  })
})
