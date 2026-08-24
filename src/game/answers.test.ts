import { describe, expect, it } from 'vitest'
import { ANSWERS } from './words'
import { WORD_LENGTH } from './types'

// The board is sized from WORD_LENGTH, so a stray word of another length would
// render off the grid. Guard the two lists against drifting apart.
describe('answer list', () => {
  it(`contains only ${WORD_LENGTH}-letter lowercase words`, () => {
    const bad = ANSWERS.filter((word) => !new RegExp(`^[a-z]{${WORD_LENGTH}}$`).test(word))
    expect(bad).toEqual([])
  })

  it('has no duplicates', () => {
    expect(new Set(ANSWERS).size).toBe(ANSWERS.length)
  })
})
