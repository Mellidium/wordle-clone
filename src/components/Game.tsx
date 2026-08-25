import { useEffect } from 'react'
import { useGame } from '../game/useGame'
import { boo, cheer } from '../game/speak'
import { Board, REVEAL_MS } from './Board'
import { Confetti } from './Confetti'
import { EvanBackdrop } from './EvanBackdrop'
import { EvanReacts } from './EvanReacts'
import { Keyboard } from './Keyboard'
import { NoScope } from './NoScope'
import { PanicMeter } from './PanicMeter'

export function Game({ answer, puzzleNumber }: { answer: string; puzzleNumber: number }) {
  const game = useGame(answer, puzzleNumber)
  const { status } = game

  // Cheer or jeer once the final row has finished flipping.
  useEffect(() => {
    if (status === 'playing') return
    const timer = window.setTimeout(status === 'won' ? cheer : boo, REVEAL_MS)
    return () => {
      window.clearTimeout(timer)
      window.speechSynthesis?.cancel()
    }
  }, [status])

  return (
    <>
      <EvanBackdrop locked={game.locked} />

      <div className="message" role="status" aria-live="polite">
        {game.message}
      </div>

      <div className="board-area">
        <EvanReacts guesses={game.guesses} status={game.status} />
        <Board guesses={game.guesses} currentGuess={game.currentGuess} shaking={game.shaking} />
        <PanicMeter remaining={game.remainingRows} />
      </div>

      <Keyboard
        keyStates={game.keyStates}
        onKey={game.handleKey}
        disabled={game.status !== 'playing'}
      />

      <Confetti active={game.status === 'won'} />
      <NoScope active={game.status === 'won'} />
    </>
  )
}
