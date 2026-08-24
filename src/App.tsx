import { useState } from 'react'
import { getDailyWord } from './game/dailyWord'
import { Game } from './components/Game'

export default function App() {
  // Picked once per mount — the date only changes at midnight, and `<Game>` is
  // keyed by it, so a rollover remounts the board with the new word.
  const [daily] = useState(getDailyWord)

  return (
    <div className="app">
      <header className="header">
        <h1>Wordle</h1>
        <span className="puzzle-number">#{daily.puzzleNumber}</span>
      </header>

      <main className="game">
        <Game key={daily.date} answer={daily.word} />
      </main>
    </div>
  )
}
