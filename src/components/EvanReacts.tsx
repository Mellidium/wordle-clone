import type { CSSProperties } from 'react'
import type { GameStatus, Guess } from '../game/types'
import { REVEAL_MS } from './Board'

const EVAN_SRC = `${import.meta.env.BASE_URL}icon-192.png`

type Reaction = 'delighted' | 'pleased' | 'unimpressed' | 'sad'

const CAPTIONS: Record<Reaction, string> = {
  delighted: 'evan is proud',
  pleased: 'evan approves',
  unimpressed: 'evan is unimpressed',
  sad: 'evan is disappointed',
}

function reactionFor(guesses: Guess[], status: GameStatus): Reaction | null {
  if (status === 'won') return 'delighted'
  if (status === 'lost') return 'sad'

  const last = guesses[guesses.length - 1]
  if (!last) return null

  const correct = last.states.filter((s) => s === 'correct').length
  const present = last.states.filter((s) => s === 'present').length

  if (correct >= 4) return 'delighted'
  if (correct + present >= 3) return 'pleased'
  if (correct + present === 0) return 'unimpressed'
  return null
}

interface EvanReactsProps {
  guesses: Guess[]
  status: GameStatus
}

export function EvanReacts({ guesses, status }: EvanReactsProps) {
  const reaction = reactionFor(guesses, status)

  return (
    <div className="evan" aria-hidden="true">
      {reaction && (
        <figure
          // Re-keying on the guess count restarts the fade, so the same
          // reaction twice running still reads as a fresh reaction.
          key={`${guesses.length}-${status}`}
          className={`evan-card${status === 'playing' ? '' : ' hold'}`}
          data-reaction={reaction}
          style={{ '--reveal-delay': `${REVEAL_MS}ms` } as CSSProperties}
        >
          <img src={EVAN_SRC} alt="" className="evan-face" />
          <figcaption className="evan-caption">{CAPTIONS[reaction]}</figcaption>
        </figure>
      )}
    </div>
  )
}
