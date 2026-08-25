import { useEffect, useState, type CSSProperties } from 'react'
import { REVEAL_MS } from './Board'

const EVAN_SRC = `${import.meta.env.BASE_URL}icon-192.png`

// The whole stunt is one timeline, so every beat lives here and reaches the
// stylesheet as a delay variable. Times are milliseconds from the win.
const START_MS = REVEAL_MS + 500
const SPIN_DELAY_MS = START_MS + 400
const SPIN_MS = 1300
// The crosshair overshoots and wobbles home at the tail of the spin; the shot
// lands just after it steadies.
const SHOT_DELAY_MS = SPIN_DELAY_MS + SPIN_MS + 140
const DEATH_MS = 900
const TOTAL_MS = SHOT_DELAY_MS + DEATH_MS + 800

export function NoScope({ active }: { active: boolean }) {
  const [spent, setSpent] = useState(false)

  useEffect(() => {
    if (!active) return
    const timer = window.setTimeout(() => setSpent(true), TOTAL_MS)
    return () => window.clearTimeout(timer)
  }, [active])

  if (!active || spent) return null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null

  const timeline = {
    '--start-delay': `${START_MS}ms`,
    '--spin-delay': `${SPIN_DELAY_MS}ms`,
    '--spin-duration': `${SPIN_MS}ms`,
    '--shot-delay': `${SHOT_DELAY_MS}ms`,
    '--death-duration': `${DEATH_MS}ms`,
  } as CSSProperties

  return (
    <div className="noscope" aria-hidden="true" style={timeline}>
      <img src={EVAN_SRC} alt="" className="noscope-evan" />

      <div className="noscope-crosshair">
        <svg viewBox="0 0 100 100">
          <circle className="reticle-ring" cx="50" cy="50" r="34" />
          <circle className="reticle-ring thin" cx="50" cy="50" r="46" />
          <path
            className="reticle-ticks"
            d="M50 0v22M50 78v22M0 50h22M78 50h22M50 40v20M40 50h20"
          />
          <circle className="reticle-dot" cx="50" cy="50" r="2.5" />
        </svg>
      </div>

      <div className="noscope-flash" />

      <svg className="noscope-hitmarker" viewBox="0 0 100 100">
        <path d="M22 22 38 38M78 22 62 38M22 78 38 62M78 78 62 62" />
      </svg>

      <p className="noscope-stamp">360 no scope</p>
    </div>
  )
}
