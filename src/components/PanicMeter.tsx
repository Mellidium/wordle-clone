import type { CSSProperties } from 'react'
import { MAX_GUESSES } from '../game/types'

interface Tier {
  label: string
  color: string
}

// Indexed by guesses remaining, so a fresh board reads calm and the last row
// reads panic. Anything above the table is still calm.
const TIERS: Tier[] = [
  { label: 'gone', color: '#7a2f2f' },
  { label: 'panic', color: '#e0393e' },
  { label: 'sweating', color: '#e86b2f' },
  { label: 'nervous', color: '#d9a441' },
  { label: 'uneasy', color: '#c9b458' },
]
const CALM: Tier = { label: 'calm', color: '#6aaa64' }

function tierFor(remaining: number): Tier {
  return TIERS[remaining] ?? CALM
}

interface PanicMeterProps {
  remaining: number
}

export function PanicMeter({ remaining }: PanicMeterProps) {
  const used = MAX_GUESSES - remaining
  const level = used / MAX_GUESSES
  const tier = tierFor(remaining)
  const frantic = remaining <= 2

  return (
    <div
      className={`panic${frantic ? ' frantic' : ''}`}
      style={{ '--level': level, '--panic-color': tier.color } as CSSProperties}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={MAX_GUESSES}
      aria-valuenow={used}
      aria-label={`Panic level: ${tier.label}`}
    >
      <div className="panic-track">
        <div className="panic-fill" />
        {Array.from({ length: MAX_GUESSES - 1 }, (_, i) => (
          <div className="panic-notch" key={i} style={{ bottom: `${((i + 1) / MAX_GUESSES) * 100}%` }} />
        ))}
      </div>
      <span className="panic-label">{tier.label}</span>
    </div>
  )
}
