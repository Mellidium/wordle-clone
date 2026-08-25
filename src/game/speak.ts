// Speech engines normalise repeated vowels, so spelling a cheer with a wall of
// As still comes out as a clipped "yay". Rate is the only lever that reliably
// stretches an utterance, so both calls run deliberately slow -- the repeated
// letters only help on the engines that do honour them.
const CHEER = 'yaaaaaaaaaaay'
const BOO = 'boooooooooooo'

// Rolled fresh each time, so no two wins or losses sound alike. Ranges stay
// inside the spec's rate 0.1-10 / pitch 0-2. The cheer rides high and the boo
// sits low, which keeps them distinct even before the words land.
const CHEER_RATE = [0.25, 0.45] as const
const CHEER_PITCH = [1.2, 1.9] as const
const BOO_RATE = [0.2, 0.35] as const
const BOO_PITCH = [0.2, 0.7] as const

function between([min, max]: readonly [number, number]): number {
  return min + Math.random() * (max - min)
}

function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function say(
  text: string,
  rate: readonly [number, number],
  pitch: readonly [number, number],
): void {
  if (!canSpeak()) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = between(rate)
  utterance.pitch = between(pitch)
  window.speechSynthesis.speak(utterance)
}

export function cheer(): void {
  say(CHEER, CHEER_RATE, CHEER_PITCH)
}

export function boo(): void {
  say(BOO, BOO_RATE, BOO_PITCH)
}
