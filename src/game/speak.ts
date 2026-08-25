// Ten-letter answers are absurd enough on their own; reading one back at a
// randomly wrong speed and pitch is the punchline. Ranges stay inside the
// spec's rate 0.1-10 / pitch 0-2 and short of the extremes where the voice
// stops being intelligible.
const RATE_RANGE = [0.4, 1.4] as const
const PITCH_RANGE = [0.4, 1.9] as const

function between([min, max]: readonly [number, number]): number {
  return min + Math.random() * (max - min)
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speakWord(word: string): void {
  if (!canSpeak()) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(word)
  utterance.rate = between(RATE_RANGE)
  utterance.pitch = between(PITCH_RANGE)
  window.speechSynthesis.speak(utterance)
}
