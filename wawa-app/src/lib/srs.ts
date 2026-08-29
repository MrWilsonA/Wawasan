/**
 * Spaced repetition on the fixed WAWAさん ladder: 1 – 3 – 7 – 16 – 35 – 90 hari.
 *
 * Deliberately not SM-2. The curriculum specifies these exact intervals so the
 * paper worksheets and the app stay in sync — a learner reviewing on paper and
 * a learner reviewing in-app hit the same card on the same day.
 */

export const INTERVALS = [1, 3, 7, 16, 35, 90] as const

export type CardState = {
  id: string
  /** 0 = never reviewed; 1..6 = position on the ladder */
  stage: number
  /** ISO date (YYYY-MM-DD) this card is next due */
  due: string
  lapses: number
  reviews: number
  /** for the "karakter bermasalah" rule: 3 entries in the error journal */
  flagged?: boolean
}

export type Rating = 'lupa' | 'susah' | 'gampang'

export const todayISO = (d = new Date()) => {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return todayISO(d)
}

export function daysBetween(a: string, b: string): number {
  const ms = new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()
  return Math.round(ms / 86_400_000)
}

export function newCard(id: string): CardState {
  return { id, stage: 0, due: todayISO(), lapses: 0, reviews: 0 }
}

/**
 * `lupa`   → drop back one rung (never below 1) and re-show today.
 * `susah`  → stay on the current rung, repeat the same interval.
 * `gampang`→ advance one rung.
 */
export function review(card: CardState, rating: Rating): CardState {
  const reviews = card.reviews + 1
  if (rating === 'lupa') {
    const stage = Math.max(0, card.stage - 2)
    return {
      ...card,
      stage,
      lapses: card.lapses + 1,
      reviews,
      due: todayISO(),
      flagged: card.lapses + 1 >= 3,
    }
  }
  const stage = rating === 'gampang' ? Math.min(INTERVALS.length, card.stage + 1) : Math.max(1, card.stage)
  const interval = INTERVALS[Math.max(0, stage - 1)]
  return { ...card, stage, reviews, due: addDays(todayISO(), interval) }
}

export function isDue(card: CardState, on = todayISO()): boolean {
  return card.due <= on
}

/** Cards due today, most-overdue first, flagged cards always at the front. */
export function dueQueue(cards: CardState[], on = todayISO()): CardState[] {
  return cards
    .filter((c) => isDue(c, on))
    .sort((a, b) => {
      if (!!a.flagged !== !!b.flagged) return a.flagged ? -1 : 1
      return a.due.localeCompare(b.due)
    })
}

/** How many cards come due on each of the next `days` days. */
export function forecast(cards: CardState[], days = 14): { date: string; count: number }[] {
  const today = todayISO()
  const out: { date: string; count: number }[] = []
  for (let i = 0; i < days; i++) {
    const date = addDays(today, i)
    const count = cards.filter((c) => (i === 0 ? c.due <= date : c.due === date)).length
    out.push({ date, count })
  }
  return out
}

export function stageLabel(stage: number): string {
  if (stage === 0) return 'Baru'
  const d = INTERVALS[Math.min(stage, INTERVALS.length) - 1]
  return `H+${d}`
}
