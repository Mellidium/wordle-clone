import { useEffect, useState } from 'react'
import { fetchDailyWord, type DailyWord } from './api/dailyWord'
import { Game } from './components/Game'

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

  return (
    <div className="app">
      <header className="header">
        <h1>Wordle</h1>
        {daily && <span className="puzzle-number">#{daily.puzzleNumber}</span>}
      </header>

      <main className="game">
        {error && <div className="message">{error}</div>}
        {daily && <Game key={daily.date} answer={daily.word} />}
      </main>
    </div>
  )
}
