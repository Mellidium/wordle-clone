export interface DailyWord {
  /** YYYY-MM-DD the puzzle is for. */
  date: string
  /** Days since the Wordle epoch — the "#1234" in a share string. */
  puzzleNumber: number
  word: string
  length: number
}

/** The player's local date, so the puzzle rolls over at their midnight. */
function localDate(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

export async function fetchDailyWord(signal?: AbortSignal): Promise<DailyWord> {
  const res = await fetch(`/api/word?date=${localDate()}`, { signal })
  if (!res.ok) {
    throw new Error(`Could not load today's word (${res.status})`)
  }
  return (await res.json()) as DailyWord
}
