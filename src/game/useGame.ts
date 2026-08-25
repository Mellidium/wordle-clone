import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  countLockedLetters,
  deriveKeyboardStates,
  evaluateGuess,
  getGameStatus,
  isValidGuess,
} from './logic'
import { loadProgress, saveProgress } from './storage'
import { MAX_GUESSES, WORD_LENGTH, type Guess } from './types'

export function useGame(answer: string, puzzleNumber: number) {
  // Read once per mount: later renders take the board from state, and App
  // re-keys the game on the date, so a rollover past midnight remounts.
  const restored = useMemo(() => loadProgress(puzzleNumber, answer), [answer, puzzleNumber])

  const [guesses, setGuesses] = useState<Guess[]>(() => restored?.guesses ?? [])
  const [currentGuess, setCurrentGuess] = useState(() => restored?.draft ?? '')
  const [rejection, setRejection] = useState<string | null>(null)
  const [shaking, setShaking] = useState(false)

  const status = useMemo(() => getGameStatus(guesses), [guesses])
  const keyStates = useMemo(() => deriveKeyboardStates(guesses), [guesses])
  const locked = useMemo(() => countLockedLetters(guesses), [guesses])

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

  // Every keystroke writes, so a mid-word reload comes back to the same board
  // -- typed letters included.
  useEffect(() => {
    saveProgress({
      puzzleNumber,
      answer,
      guesses: guesses.map((guess) => guess.word),
      draft: currentGuess,
    })
  }, [answer, currentGuess, guesses, puzzleNumber])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return
      handleKey(event.key)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey])

  const message =
    status === 'won' ? 'Got it!' : status === 'lost' ? answer.toUpperCase() : rejection

  return {
    guesses,
    currentGuess,
    status,
    message,
    shaking,
    keyStates,
    locked,
    handleKey,
    remainingRows: MAX_GUESSES - guesses.length,
  }
}
