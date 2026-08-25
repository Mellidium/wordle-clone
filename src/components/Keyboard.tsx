import type { LetterState } from '../game/types'

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'] as const

interface KeyboardProps {
  keyStates: Record<string, LetterState>
  onKey: (key: string) => void
  disabled: boolean
}

export function Keyboard({ keyStates, onKey, disabled }: KeyboardProps) {
  const key = (label: string, value = label, wide = false) => (
    <button
      key={value}
      type="button"
      className={`key${wide ? ' wide' : ''}`}
      data-state={keyStates[value] ?? 'empty'}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onKey(value)}
    >
      {label}
    </button>
  )

  return (
    <div className="keyboard">
      <div className="keyboard-row">{ROWS[0].split('').map((letter) => key(letter))}</div>
      <div className="keyboard-row">
        <div className="spacer" />
        {ROWS[1].split('').map((letter) => key(letter))}
        <div className="spacer" />
      </div>
      <div className="keyboard-row">
        {key('Enter', 'Enter', true)}
        {ROWS[2].split('').map((letter) => key(letter))}
        {key('⌫', 'Backspace', true)}
      </div>
    </div>
  )
}
