import type { CSSProperties } from 'react'
import { MAX_GUESSES, WORD_LENGTH, type Guess, type LetterState } from '../game/types'

/** Per-tile delay of the reveal flip. Ten tiles at 250ms would drag. */
const FLIP_STAGGER_MS = 100
/** Kept in step with the `flip` animation in styles.css. */
const FLIP_DURATION_MS = 500

/** How long a whole row takes to finish revealing, last tile included. */
export const REVEAL_MS = (WORD_LENGTH - 1) * FLIP_STAGGER_MS + FLIP_DURATION_MS

interface TileProps {
  letter: string
  state: LetterState
  /** Position in the row — drives the staggered flip. */
  index: number
  revealed: boolean
}

function Tile({ letter, state, index, revealed }: TileProps) {
  return (
    <div
      className={`tile${revealed ? ' revealed' : ''}${letter && !revealed ? ' filled' : ''}`}
      data-state={state}
      style={{ '--delay': `${index * FLIP_STAGGER_MS}ms` } as CSSProperties}
    >
      <span>{letter}</span>
    </div>
  )
}

interface RowProps {
  guess?: Guess
  draft?: string
  shaking?: boolean
}

function Row({ guess, draft = '', shaking = false }: RowProps) {
  const letters = guess ? guess.word : draft.padEnd(WORD_LENGTH, ' ')

  return (
    <div className={`row${shaking ? ' shake' : ''}`}>
      {Array.from({ length: WORD_LENGTH }, (_, i) => (
        <Tile
          key={i}
          index={i}
          letter={letters[i]?.trim().toUpperCase() ?? ''}
          state={guess ? guess.states[i] : 'empty'}
          revealed={Boolean(guess)}
        />
      ))}
    </div>
  )
}

interface BoardProps {
  guesses: Guess[]
  currentGuess: string
  shaking: boolean
}

export function Board({ guesses, currentGuess, shaking }: BoardProps) {
  const emptyRows = Math.max(0, MAX_GUESSES - guesses.length - 1)

  return (
    <div
      className="board"
      style={
        { '--word-length': WORD_LENGTH, '--max-guesses': MAX_GUESSES } as CSSProperties
      }
    >
      {guesses.map((guess, i) => (
        <Row key={i} guess={guess} />
      ))}
      {guesses.length < MAX_GUESSES && <Row draft={currentGuess} shaking={shaking} />}
      {Array.from({ length: emptyRows }, (_, i) => (
        <Row key={`empty-${i}`} />
      ))}
    </div>
  )
}
