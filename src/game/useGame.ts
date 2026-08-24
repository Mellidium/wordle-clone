import { useCallback, useEffect, useMemo, useState } from 'react'
import { deriveKeyboardStates, evaluateGuess, getGameStatus, isValidGuess } from './logic'
import { MAX_GUESSES, WORD_LENGTH, type Guess } from './types'

/**
 * Keystroke plumbing: owns the board state and hands the interesting questions
 * to the pure functions in `logic.ts`. Also listens for physical key presses so
 * the on-screen keyboard and a real keyboard drive the same code path.
 */
export function useGame(answer: string | null) {
  const [guesses, setGuesses] = useState<Guess[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [shaking, setShaking] = useState(false)

  const status = useMemo(() => getGameStatus(guesses), [guesses])
  const keyStates = useMemo(() => deriveKeyboardStates(guesses), [guesses])

  // Reset when a new day's word arrives.
  useEffect(() => {
    setGuesses([])
    setCurrentGuess('')
    setMessage(null)
  }, [answer])

  const reject = useCallback((reason: string) => {
    setMessage(reason)
    setShaking(true)
    setTimeout(() => setShaking(false), 600)
  }, [])

  const submit = useCallback(() => {
    if (!answer) return

    if (currentGuess.length < WORD_LENGTH) {
      return reject('Not enough letters')
    }
    if (!isValidGuess(currentGuess)) {
      return reject('Not in word list')
    }

    const states = evaluateGuess(currentGuess, answer)
    setGuesses((prev) => [...prev, { word: currentGuess, states }])
    setCurrentGuess('')
    setMessage(null)
  }, [answer, currentGuess, reject])

  const handleKey = useCallback(
    (key: string) => {
      if (!answer || status !== 'playing') return

      if (key === 'Enter') return submit()
      if (key === 'Backspace') {
        setMessage(null)
        return setCurrentGuess((prev) => prev.slice(0, -1))
      }
      if (/^[a-zA-Z]$/.test(key)) {
        setMessage(null)
        return setCurrentGuess((prev) =>
          prev.length < WORD_LENGTH ? prev + key.toLowerCase() : prev,
        )
      }
    },
    [answer, status, submit],
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
  useEffect(() => {
    if (status === 'won') setMessage('Got it!')
    if (status === 'lost') setMessage(answer ? answer.toUpperCase() : 'Out of guesses')
  }, [status, answer])

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
