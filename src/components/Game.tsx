import { useEffect } from 'react'
import { useGame } from '../game/useGame'
import { canSpeak, speakWord } from '../game/speak'
import { Board, REVEAL_MS } from './Board'
import { Confetti } from './Confetti'
import { EvanReacts } from './EvanReacts'
import { Keyboard } from './Keyboard'
import { PanicMeter } from './PanicMeter'

export function Game({ answer }: { answer: string }) {
  const game = useGame(answer)
  const over = game.status !== 'playing'

  // Read the answer aloud once the final row has finished flipping.
  useEffect(() => {
    if (!over) return
    const timer = window.setTimeout(() => speakWord(answer), REVEAL_MS)
    return () => {
      window.clearTimeout(timer)
      window.speechSynthesis?.cancel()
    }
  }, [over, answer])

  return (
    <>
      <div className="message" role="status" aria-live="polite">
        {game.message}
        {over && canSpeak() && (
          <button className="speak" onClick={() => speakWord(answer)} aria-label="Say the word">
            🔊
          </button>
        )}
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
    </>
  )
}
