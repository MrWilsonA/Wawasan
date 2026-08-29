import type { IconName } from '@/components/ui/icons'

/** Shared domain types for the WAWAさん curriculum. */

export type LangId = 'jp' | 'cn' | 'kr' | 'en'

export type Language = {
  id: LangId
  name: string
  nativeName: string
  exam: string
  examFull: string
  levels: string[]
  /** hex accent, used for scarves, path nodes, chips */
  color: string
  colorSoft: string
  tagline: string
  /** what makes this language hard/easy specifically for Indonesian speakers */
  hookForIndonesians: string
  script: string
  wordOrder: string
}

/* ------------------------------ Gates ------------------------------ */

/** The six mandatory gates. Gate N+1 stays locked until N is passed. */
export type Gate = {
  index: 0 | 1 | 2 | 3 | 4 | 5
  title: string
  subtitle: string
  /** e.g. "2 minggu" */
  duration: string
  icon: IconName
  units: Unit[]
}

export type Unit = {
  id: string
  title: string
  subtitle: string
  /** JLPT/HSK/TOPIK level this unit belongs to */
  level: string
  /** short label drawn inside the path node */
  badge: string
  lessons: Lesson[]
  /** teaching material shown before the drills */
  notes?: Note[]
  /** SRS cards seeded when the unit is completed */
  cards?: Card[]
}

export type Note = {
  kind: 'concept' | 'warning' | 'tip' | 'contrast' | 'story' | 'table' | 'formula'
  title: string
  body?: string
  /** for kind: 'table' */
  head?: string[]
  rows?: string[][]
  /** for kind: 'formula' — monospace block, e.g. a stroke diagram */
  pre?: string
}

export type Lesson = {
  desc?: string
  id: string
  title: string
  /** 'drill' = normal lesson, 'gate' = the 85%-to-pass gate quiz */
  kind: 'drill' | 'gate'
  xp: number
  exercises: Exercise[]
}

/* ---------------------------- Exercises ---------------------------- */

export type Exercise =
  | ChoiceExercise
  | FillExercise
  | TypeExercise
  | MatchExercise
  | OrderExercise
  | SortExercise
  | JudgeExercise

type ExBase = {
  id: string
  prompt: string
  /** shown after answering, right or wrong */
  explain: string
  /** larger CJK display line above the prompt */
  display?: string
  /** romanisation / pinyin helper under the display */
  reading?: string
  /** which of the 4 skills this drills — feeds the MIN() gate score */
  skill?: Skill
}

export type Skill = 'menyimak' | 'membaca' | 'menulis' | 'berbicara'

export type ChoiceExercise = ExBase & {
  type: 'choice'
  options: string[]
  answer: number
  /** render options in the CJK font at a large size */
  big?: boolean
}

/** Cloze: prompt contains ___ placeholders; user picks per blank. */
export type FillExercise = ExBase & {
  type: 'fill'
  /** text with ___ marking each blank */
  sentence: string
  bank: string[]
  answers: string[]
}

export type TypeExercise = ExBase & {
  type: 'type'
  /** all accepted answers, compared case/space-insensitively */
  accept: string[]
  placeholder?: string
}

export type MatchExercise = ExBase & {
  type: 'match'
  pairs: Array<[string, string]>
}

/** Rebuild a sentence from shuffled chunks. */
export type OrderExercise = ExBase & {
  type: 'order'
  chunks: string[]
  /** correct order as indices into `chunks` */
  answer: number[]
}

/** Drag each item into one of 2–3 buckets. */
export type SortExercise = ExBase & {
  type: 'sort'
  buckets: string[]
  items: Array<{ text: string; bucket: number }>
}

export type JudgeExercise = Omit<ExBase, 'prompt'> & {
  type: 'judge'
  /** defaults to "Benar atau salah?" */
  prompt?: string
  statement: string
  answer: boolean
  labels?: [string, string]
}

/* ------------------------------ SRS -------------------------------- */

export type Card = {
  id: string
  front: string
  back: string
  /** reading / pinyin / romanisation */
  reading?: string
  hint?: string
  lang: LangId
  tag: string
}

/* --------------------------- Script data --------------------------- */

export type ScriptChar = {
  char: string
  /** romanisation; absent for kanji/hanzi entries, which use on/kun/pinyin */
  roman?: string
  /** kanji/hanzi the kana was derived from, or component breakdown */
  from?: string
  fromMeaning?: string
  /** the etymology paragraph — Prinsip 2, "Dari Mana Asalnya?" */
  story?: string
  strokes?: number
  meaning?: string
  onyomi?: string
  kunyomi?: string
  pinyin?: string
  /** SVG path list for the stroke-order player, in a 0..100 box */
  strokePaths?: string[]
  group?: string
}

export type ConfusablePair = {
  a: string
  b: string
  key: string
}
