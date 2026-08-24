import { useGame } from '../game/useGame'
import { Board } from './Board'
import { Confetti } from './Confetti'
import { Keyboard } from './Keyboard'

/** One day's puzzle. Keyed by date in <App>, so a new word means fresh state. */
export function Game({ answer }: { answer: string }) {
  const game = useGame(answer)

  return (
    <>
      <div className="message" role="status" aria-live="polite">
        {game.message}
      </div>

      <Board guesses={game.guesses} currentGuess={game.currentGuess} shaking={game.shaking} />

      <Keyboard
        keyStates={game.keyStates}
        onKey={game.handleKey}
        disabled={game.status !== 'playing'}
      />

      <Confetti active={game.status === 'won'} />
    </>
  )
}
