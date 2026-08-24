import { useEffect, useState } from 'react'
import { fetchDailyWord, type DailyWord } from './api/dailyWord'
import { Board } from './components/Board'
import { Keyboard } from './components/Keyboard'
import { useGame } from './game/useGame'

export default function App() {
  const [daily, setDaily] = useState<DailyWord | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetchDailyWord(controller.signal)
      .then(setDaily)
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Something went wrong')
      })
    return () => controller.abort()
  }, [])

  const game = useGame(daily?.word ?? null)

  return (
    <div className="app">
      <header className="header">
        <h1>Wordle</h1>
        {daily && <span className="puzzle-number">#{daily.puzzleNumber}</span>}
      </header>

      <main className="game">
        <div className="message" role="status" aria-live="polite">
          {error ?? game.message}
        </div>

        <Board
          guesses={game.guesses}
          currentGuess={game.currentGuess}
          shaking={game.shaking}
        />

        <Keyboard
          keyStates={game.keyStates}
          onKey={game.handleKey}
          disabled={!daily || game.status !== 'playing'}
        />
      </main>
    </div>
  )
}
