import { ANSWERS } from './words'

const EPOCH = Date.UTC(2021, 5, 19)
const DAY_MS = 86_400_000

export interface DailyWord {
  date: string
  puzzleNumber: number
  word: string
  length: number
}

function localDate(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function puzzleNumber(date: string): number {
  const [y, m, d] = date.split('-').map(Number)
  return Math.floor((Date.UTC(y, m - 1, d) - EPOCH) / DAY_MS)
}

export function getDailyWord(): DailyWord {
  const date = localDate()
  const n = puzzleNumber(date)

  const word = ANSWERS[((n % ANSWERS.length) + ANSWERS.length) % ANSWERS.length]

  return { date, puzzleNumber: n, word, length: word.length }
}
