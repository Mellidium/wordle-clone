import type { CSSProperties } from 'react'
import { WORD_LENGTH } from '../game/types'
import { REVEAL_MS } from './Board'

const EVAN_SRC = `${import.meta.env.BASE_URL}evan.png`

interface EvanBackdropProps {
  locked: number
}

// A veil of page background sits over the photo and thins by one tenth per
// locked-in letter, so a blank board looks untouched and the tenth green
// uncovers Evan exactly as you win.
export function EvanBackdrop({ locked }: EvanBackdropProps) {
  const veil = Math.max(0, 1 - locked / WORD_LENGTH)

  return (
    <div
      className="evan-backdrop"
      aria-hidden="true"
      style={
        {
          '--veil': veil,
          '--reveal-delay': `${REVEAL_MS}ms`,
          backgroundImage: `url(${EVAN_SRC})`,
        } as CSSProperties
      }
    />
  )
}
