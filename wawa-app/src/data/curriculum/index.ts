import type { Gate, LangId, Lesson, Unit, Card } from '../types'
import { JP_GATES } from './jp'
import { CN_GATES } from './cn'
import { KR_GATES } from './kr'
import { EN_GATES } from './en'
import { CN_EXTRA } from './cn-extra'
import { KR_EXTRA } from './kr-extra'
import { EN_EXTRA } from './en-extra'

/**
 * Extra units live in separate `*-extra.ts` files so the base curriculum files
 * stay readable. They are spliced in BEFORE the unit that closes the gate,
 * because a gate quiz must remain the last thing a learner meets in its gate.
 */
function withExtras(gates: Gate[], extras: Record<number, Unit[]>): Gate[] {
  return gates.map((gate) => {
    const add = extras[gate.index] ?? []
    const merged = [...gate.units, ...add]

    // Whatever the authoring order, the unit that closes the gate has to be the
    // last one a learner meets — the 85% quiz is what unlocks the next gate.
    const closer = merged.filter((u) => u.lessons.some((l) => l.kind === 'gate'))
    if (!closer.length) return add.length ? { ...gate, units: merged } : gate

    const rest = merged.filter((u) => !closer.includes(u))
    return { ...gate, units: [...rest, ...closer] }
  })
}

export const CURRICULUM: Record<LangId, Gate[]> = {
  jp: JP_GATES,
  cn: withExtras(CN_GATES, CN_EXTRA),
  kr: withExtras(KR_GATES, KR_EXTRA),
  en: withExtras(EN_GATES, EN_EXTRA),
}

export function gatesFor(lang: LangId): Gate[] {
  return CURRICULUM[lang]
}

export function allUnits(lang: LangId): Array<{ gate: Gate; unit: Unit }> {
  return CURRICULUM[lang].flatMap((gate) => gate.units.map((unit) => ({ gate, unit })))
}

export function allLessons(lang: LangId): Array<{ gate: Gate; unit: Unit; lesson: Lesson }> {
  return allUnits(lang).flatMap(({ gate, unit }) => unit.lessons.map((lesson) => ({ gate, unit, lesson })))
}

export function findLesson(lang: LangId, lessonId: string) {
  return allLessons(lang).find((x) => x.lesson.id === lessonId) ?? null
}

export function findUnit(lang: LangId, unitId: string) {
  return allUnits(lang).find((x) => x.unit.id === unitId) ?? null
}

export function cardsForUnit(lang: LangId, unitId: string): Card[] {
  return findUnit(lang, unitId)?.unit.cards ?? []
}

export function allCards(lang: LangId): Card[] {
  return allUnits(lang).flatMap(({ unit }) => unit.cards ?? [])
}

/**
 * Gate N is unlocked when every gate-quiz before it has been passed at ≥85%.
 * "Nilai 84% = ulang gerbang, tanpa pengecualian." — README §4
 */
export const GATE_PASS_PCT = 85

export function gateStatus(
  lang: LangId,
  completed: Record<string, { pct: number }>,
): Array<{ gate: Gate; unlocked: boolean; done: number; total: number; gateQuizPct: number | null }> {
  const gates = CURRICULUM[lang]
  let unlockedSoFar = true
  return gates.map((gate) => {
    const lessons = gate.units.flatMap((u) => u.lessons)
    const done = lessons.filter((l) => completed[l.id]).length
    const quiz = lessons.find((l) => l.kind === 'gate')
    const quizPct = quiz && completed[quiz.id] ? completed[quiz.id].pct : null

    const result = { gate, unlocked: unlockedSoFar, done, total: lessons.length, gateQuizPct: quizPct }

    // A gate with no closing quiz passes once all its lessons are done.
    const passed = quiz ? (quizPct ?? 0) >= GATE_PASS_PCT : done === lessons.length && lessons.length > 0
    unlockedSoFar = unlockedSoFar && passed
    return result
  })
}

/** Next lesson the learner should open, honouring gate locks. */
export function nextLesson(lang: LangId, completed: Record<string, { pct: number }>) {
  const statuses = gateStatus(lang, completed)
  for (const s of statuses) {
    if (!s.unlocked) return null
    for (const unit of s.gate.units) {
      for (const lesson of unit.lessons) {
        if (!completed[lesson.id]) return { gate: s.gate, unit, lesson }
      }
    }
  }
  return null
}

export function progressPct(lang: LangId, completed: Record<string, unknown>): number {
  const lessons = allLessons(lang)
  if (!lessons.length) return 0
  const done = lessons.filter((x) => completed[x.lesson.id]).length
  return Math.round((done / lessons.length) * 100)
}
