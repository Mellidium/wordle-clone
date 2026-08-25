import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { clearProgress, loadProgress, saveProgress } from './storage'
import { MAX_GUESSES } from './types'

const KEY = 'evans-wordle:progress:v1'
const ANSWER = 'basketball'
const PUZZLE = 1234

// Node has no Web Storage, so tests bring their own -- small enough to also
// stand in for the throwing/absent cases below.
function fakeStorage(): Storage {
  const entries = new Map<string, string>()
  return {
    get length() {
      return entries.size
    },
    key: (i: number) => [...entries.keys()][i] ?? null,
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => void entries.set(key, value),
    removeItem: (key: string) => void entries.delete(key),
    clear: () => entries.clear(),
  }
}

function stub(storage: Storage | undefined) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true,
    writable: true,
  })
}

beforeEach(() => stub(fakeStorage()))
afterEach(() => stub(undefined))

const write = (record: unknown) => localStorage.setItem(KEY, JSON.stringify(record))

const saved = (over: Record<string, unknown> = {}) => ({
  puzzleNumber: PUZZLE,
  answer: ANSWER,
  guesses: ['groundwork'],
  draft: 'acce',
  ...over,
})

const record = { puzzleNumber: PUZZLE, answer: ANSWER, guesses: ['groundwork'], draft: 'acce' }

describe('saveProgress / loadProgress', () => {
  it('returns null with nothing stored', () => {
    expect(loadProgress(PUZZLE, ANSWER)).toBeNull()
  })

  it('restores guesses and the in-progress draft', () => {
    saveProgress(record)

    const progress = loadProgress(PUZZLE, ANSWER)
    expect(progress?.draft).toBe('acce')
    expect(progress?.guesses.map((guess) => guess.word)).toEqual(['groundwork'])
  })

  it('re-derives tile states rather than trusting what was stored', () => {
    write(saved({ guesses: ['basketball'], states: ['nonsense'] }))

    expect(loadProgress(PUZZLE, ANSWER)?.guesses[0].states).toEqual(
      Array.from({ length: ANSWER.length }, () => 'correct'),
    )
  })

  it('drops a board saved for another puzzle', () => {
    write(saved({ puzzleNumber: PUZZLE - 1 }))

    expect(loadProgress(PUZZLE, ANSWER)).toBeNull()
    expect(localStorage.getItem(KEY)).toBeNull()
  })

  it('drops a board whose answer no longer matches', () => {
    write(saved({ answer: 'groundwork' }))

    expect(loadProgress(PUZZLE, ANSWER)).toBeNull()
  })

  it.each([
    ['malformed json', '{nope'],
    ['a non-object', JSON.stringify(42)],
    ['a missing puzzle number', JSON.stringify({ ...saved(), puzzleNumber: undefined })],
    ['a short guess', JSON.stringify(saved({ guesses: ['short'] }))],
    ['a non-array guess list', JSON.stringify(saved({ guesses: 'groundwork' }))],
    ['more guesses than rows', JSON.stringify(saved({ guesses: Array(MAX_GUESSES + 1).fill('groundwork') }))],
    ['an over-long draft', JSON.stringify(saved({ draft: 'groundworks' }))],
    ['a non-letter draft', JSON.stringify(saved({ draft: 'ab3' }))],
  ])('ignores %s', (_label, raw) => {
    localStorage.setItem(KEY, raw)

    expect(loadProgress(PUZZLE, ANSWER)).toBeNull()
  })

  it('clears the stored board', () => {
    saveProgress(record)
    clearProgress()

    expect(localStorage.getItem(KEY)).toBeNull()
  })
})

describe('without usable storage', () => {
  it('no-ops when localStorage is missing', () => {
    stub(undefined)

    expect(() => saveProgress(record)).not.toThrow()
    expect(() => clearProgress()).not.toThrow()
    expect(loadProgress(PUZZLE, ANSWER)).toBeNull()
  })

  it('survives a storage that throws on write', () => {
    const storage = fakeStorage()
    storage.setItem = () => {
      throw new DOMException('QuotaExceededError')
    }
    stub(storage)

    expect(() => saveProgress(record)).not.toThrow()
  })
})
