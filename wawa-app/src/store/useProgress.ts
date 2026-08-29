import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LangId, Skill, Card } from '@/data/types'
import { type CardState, newCard, review as srsReview, todayISO, addDays, dueQueue } from '@/lib/srs'

export type SkillScores = Record<Skill, number[]>

export type ErrorEntry = {
  id: string
  date: string
  char: string
  mistake: string
  kind: 'bentuk-mirip' | 'urutan-guratan' | 'proporsi' | 'guratan-hilang' | 'lupa-total'
  lang: LangId
  action: string
}

export type LessonResult = {
  lessonId: string
  correct: number
  total: number
  pct: number
  date: string
}

type State = {
  /* ---- profile ---- */
  name: string
  onboarded: boolean
  activeLang: LangId
  languages: LangId[]
  dailyGoalMin: number

  /* ---- gamification ---- */
  xp: number
  xpByDay: Record<string, number>
  streak: number
  bestStreak: number
  lastActiveDate: string | null

  /* ---- learning ---- */
  completed: Record<string, LessonResult>
  skillScores: Record<LangId, SkillScores>
  /** srs deck: cardId → state */
  deck: Record<string, CardState>
  /** cardId → content, so the deck survives without re-walking the curriculum */
  cardBank: Record<string, Card>
  errorJournal: ErrorEntry[]
  writingSessions: { date: string; chars: number; lang: LangId }[]

  /* ---- actions ---- */
  init: (name: string, lang: LangId, goal: number) => void
  setActiveLang: (l: LangId) => void
  addLanguage: (l: LangId) => void
  setDailyGoal: (m: number) => void
  touchStreak: () => void
  completeLesson: (r: LessonResult, skills: Partial<Record<Skill, { correct: number; total: number }>>, lang: LangId) => void
  seedCards: (cards: Card[]) => void
  reviewCard: (id: string, rating: 'lupa' | 'susah' | 'gampang') => void
  logError: (e: Omit<ErrorEntry, 'id' | 'date'>) => void
  clearError: (id: string) => void
  logWriting: (chars: number, lang: LangId) => void
  reset: () => void
}

const emptySkills = (): SkillScores => ({ menyimak: [], membaca: [], menulis: [], berbicara: [] })

const initialSkills = (): Record<LangId, SkillScores> => ({
  jp: emptySkills(), cn: emptySkills(), kr: emptySkills(), en: emptySkills(),
})

export const useProgress = create<State>()(
  persist(
    (set, get) => ({
      name: '',
      onboarded: false,
      activeLang: 'jp',
      languages: [],
      dailyGoalMin: 60,

      xp: 0,
      xpByDay: {},
      streak: 0,
      bestStreak: 0,
      lastActiveDate: null,

      completed: {},
      skillScores: initialSkills(),
      deck: {},
      cardBank: {},
      errorJournal: [],
      writingSessions: [],

      init: (name, lang, goal) =>
        set({ name, activeLang: lang, languages: [lang], dailyGoalMin: goal, onboarded: true }),

      setActiveLang: (l) =>
        set((s) => ({
          activeLang: l,
          languages: s.languages.includes(l) ? s.languages : [...s.languages, l],
        })),

      addLanguage: (l) =>
        set((s) => (s.languages.includes(l) ? s : { languages: [...s.languages, l] })),

      setDailyGoal: (m) => set({ dailyGoalMin: m }),

      /** Streak survives a same-day repeat and one calendar day of gap. */
      touchStreak: () => {
        const today = todayISO()
        const { lastActiveDate, streak, bestStreak } = get()

        if (lastActiveDate === today) {
          return
        }
        const next = lastActiveDate && addDays(lastActiveDate, 1) === today ? streak + 1 : 1
        set({ streak: next, bestStreak: Math.max(bestStreak, next), lastActiveDate: today })
      },

      completeLesson: (r, skills, lang) => {
        get().touchStreak()
        const today = todayISO()
        set((s) => {
          const prev = s.completed[r.lessonId]
          // keep the best attempt, but always record that it was attempted today
          const best = prev && prev.pct > r.pct ? { ...prev, date: today } : r
          const langSkills = { ...s.skillScores[lang] }
          for (const [k, v] of Object.entries(skills)) {
            if (!v || v.total === 0) continue
            const key = k as Skill
            langSkills[key] = [...langSkills[key], Math.round((v.correct / v.total) * 100)].slice(-30)
          }
          const gained = prev ? Math.round(r.pct / 10) : Math.round(r.pct / 5) + 5
          return {
            completed: { ...s.completed, [r.lessonId]: best },
            skillScores: { ...s.skillScores, [lang]: langSkills },
            xp: s.xp + gained,
            xpByDay: { ...s.xpByDay, [today]: (s.xpByDay[today] ?? 0) + gained },
          }
        })
      },

      seedCards: (cards) =>
        set((s) => {
          const deck = { ...s.deck }
          const bank = { ...s.cardBank }
          for (const c of cards) {
            if (!deck[c.id]) deck[c.id] = newCard(c.id)
            bank[c.id] = c
          }
          return { deck, cardBank: bank }
        }),

      reviewCard: (id, rating) => {
        get().touchStreak()
        const today = todayISO()
        set((s) => {
          const card = s.deck[id]
          if (!card) return s
          const gained = rating === 'lupa' ? 1 : 2
          return {
            deck: { ...s.deck, [id]: srsReview(card, rating) },
            xp: s.xp + gained,
            xpByDay: { ...s.xpByDay, [today]: (s.xpByDay[today] ?? 0) + gained },
          }
        })
      },

      logError: (e) =>
        set((s) => ({
          errorJournal: [
            { ...e, id: crypto.randomUUID(), date: todayISO() },
            ...s.errorJournal,
          ].slice(0, 300),
        })),

      clearError: (id) => set((s) => ({ errorJournal: s.errorJournal.filter((e) => e.id !== id) })),

      logWriting: (chars, lang) => {
        get().touchStreak()
        const today = todayISO()
        set((s) => ({
          writingSessions: [...s.writingSessions, { date: today, chars, lang }].slice(-200),
          xp: s.xp + chars * 2,
          xpByDay: { ...s.xpByDay, [today]: (s.xpByDay[today] ?? 0) + chars * 2 },
        }))
      },

      reset: () =>
        set({
          name: '', onboarded: false, activeLang: 'jp', languages: [], dailyGoalMin: 60,
          xp: 0, xpByDay: {}, streak: 0, bestStreak: 0, lastActiveDate: null,
          completed: {}, skillScores: initialSkills(), deck: {}, cardBank: {},
          errorJournal: [], writingSessions: [],
        }),
    }),
    { name: 'wawa-progress-v1' },
  ),
)

/* --------------------------- selectors --------------------------- */

export const useDueCards = () => {
  const deck = useProgress((s) => s.deck)
  const bank = useProgress((s) => s.cardBank)
  return dueQueue(Object.values(deck))
    .map((c) => ({ state: c, card: bank[c.id] }))
    .filter((x) => !!x.card)
}

export const useXpToday = () => {
  const xpByDay = useProgress((s) => s.xpByDay)
  return xpByDay[todayISO()] ?? 0
}

/** A character that appears 3× in the error journal becomes "bermasalah". */
export const useProblemChars = () => {
  const journal = useProgress((s) => s.errorJournal)
  const counts = new Map<string, number>()
  for (const e of journal) counts.set(e.char, (counts.get(e.char) ?? 0) + 1)
  return [...counts.entries()].filter(([, n]) => n >= 3).map(([char, n]) => ({ char, n }))
}
