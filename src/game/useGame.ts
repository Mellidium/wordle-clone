import { useCallback, useEffect, useMemo, useState } from 'react'
import { deriveKeyboardStates, evaluateGuess, getGameStatus, isValidGuess } from './logic'
import { MAX_GUESSES, WORD_LENGTH, type Guess } from './types'

/**
 * Keystroke plumbing: owns the board state and hands the interesting questions
 * to the pure functions in `logic.ts`. Also listens for physical key presses so
 * the on-screen keyboard and a real keyboard drive the same code path.
 *
 * There's no reset — `<Game>` is keyed by the puzzle date, so a new day
 * remounts the whole thing with fresh state.
 */
export function useGame(answer: string) {
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [rejection, setRejection] = useState<string | null>(null)
  const [shaking, setShaking] = useState(false)

  const status = useMemo(() => getGameStatus(guesses), [guesses])
  const keyStates = useMemo(() => deriveKeyboardStates(guesses), [guesses])

  const reject = useCallback((reason: string) => {
    setRejection(reason)
    setShaking(true)
    setTimeout(() => setShaking(false), 600)
  }, [])

  const submit = useCallback(() => {
    if (currentGuess.length < WORD_LENGTH) {
      return reject('Not enough letters')
    }
    if (!isValidGuess(currentGuess)) {
      return reject('Not in word list')
    }

    const states = evaluateGuess(currentGuess, answer)
    setGuesses((prev) => [...prev, { word: currentGuess, states }])
    setCurrentGuess('')
    setRejection(null)
  }, [answer, currentGuess, reject])

  const handleKey = useCallback(
    (key: string) => {
      if (status !== 'playing') return

      if (key === 'Enter') return submit()
      if (key === 'Backspace') {
        setRejection(null)
        return setCurrentGuess((prev) => prev.slice(0, -1))
      }
      if (/^[a-zA-Z]$/.test(key)) {
        setRejection(null)
        return setCurrentGuess((prev) =>
          prev.length < WORD_LENGTH ? prev + key.toLowerCase() : prev,
        )
      }
    },
    [status, submit],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return
      handleKey(event.key)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey])

  // End-of-game banner. Swap in a real modal / share sheet whenever you like.
  const message =
    status === 'won' ? 'Got it!' : status === 'lost' ? answer.toUpperCase() : rejection

  return {
    guesses,
    currentGuess,
    status,
    message,
    shaking,
    keyStates,
    handleKey,
    remainingRows: MAX_GUESSES - guesses.length,
  }
}
