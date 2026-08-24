import { ANSWERS } from './words.js';

// Wordle's day 0. Puzzle number = days elapsed since this date.
const EPOCH = Date.UTC(2021, 5, 19);
const DAY_MS = 86_400_000;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function puzzleNumber(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  return Math.floor((Date.UTC(y, m - 1, d) - EPOCH) / DAY_MS);
}

/**
 * GET /api/word?date=YYYY-MM-DD
 *
 * The client sends its *local* date so the puzzle rolls over at the player's
 * midnight rather than UTC midnight. Falls back to the server's UTC date.
 */
export function GET(request: Request): Response {
  const url = new URL(request.url);
  const param = url.searchParams.get('date');
  const date = param && DATE_RE.test(param) ? param : todayUTC();

  const n = puzzleNumber(date);
  if (!Number.isFinite(n) || n < 0) {
    return Response.json({ error: 'Invalid date' }, { status: 400 });
  }

  const word = ANSWERS[n % ANSWERS.length];

  return Response.json(
    { date, puzzleNumber: n, word, length: word.length },
    {
      headers: {
        // Answers are stable per day, so let the CDN hold onto them.
        'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  );
}
