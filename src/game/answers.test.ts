import { describe, expect, it } from 'vitest'
import { ANSWERS } from './words'
import { WORD_LENGTH } from './types'

describe('answer list', () => {
  it(`contains only ${WORD_LENGTH}-letter lowercase words`, () => {
    const bad = ANSWERS.filter((word) => !new RegExp(`^[a-z]{${WORD_LENGTH}}$`).test(word))
    expect(bad).toEqual([])
  })

  it('has no duplicates', () => {
    expect(new Set(ANSWERS).size).toBe(ANSWERS.length)
  })
})
