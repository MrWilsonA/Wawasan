import type { LangId } from './types'

/**
 * The generated character datasets are large (≈340 KB together), so they are
 * loaded on demand — the Character Bank route is the only thing that pulls them
 * in, and only when the learner actually opens that script's tab.
 */

export type KanjiEntry = {
  /** character */
  c: string
  /** kyōiku/jōyō grade 1–8 */
  g: number
  /** JLPT level, 5 = N5 … 1 = N1, or null if not on any list */
  j: number | null
  /** stroke count */
  s: number | null
  /** newspaper frequency rank (1 = most common) */
  f: number | null
  on: string[]
  kun: string[]
  m: string[]
  /** Mandarin reading of the same character (numbered pinyin, e.g. "ri4") */
  py: string
  /** Korean reading of the same character (hangeul) */
  kr: string
}

export type HanziEntry = {
  c: string
  /** HSK 3.0 level: '1'..'6' | '7-9' */
  lv: string
  /** pinyin with tone marks */
  p: string
  /** English gloss */
  m: string
}

let kanjiCache: KanjiEntry[] | null = null
let hanziCache: HanziEntry[] | null = null

export async function loadKanji(): Promise<KanjiEntry[]> {
  if (!kanjiCache) {
    const mod = await import('./generated/kanji.json')
    kanjiCache = mod.default as KanjiEntry[]
  }
  return kanjiCache
}

export async function loadHanzi(): Promise<HanziEntry[]> {
  if (!hanziCache) {
    const mod = await import('./generated/hanzi.json')
    hanziCache = mod.default as HanziEntry[]
  }
  return hanziCache
}

/* ------------------------------ categories ------------------------------ */

export const KANJI_GRADES = [
  { id: '1', label: 'Kelas 1', hint: '80 kanji — SD kelas 1' },
  { id: '2', label: 'Kelas 2', hint: '160 kanji' },
  { id: '3', label: 'Kelas 3', hint: '200 kanji' },
  { id: '4', label: 'Kelas 4', hint: '200 kanji' },
  { id: '5', label: 'Kelas 5', hint: '185 kanji' },
  { id: '6', label: 'Kelas 6', hint: '181 kanji' },
  { id: '8', label: 'SMP–SMA', hint: 'sisa daftar jōyō' },
] as const

/**
 * JLPT stopped publishing official kanji lists after the 2010 reform, so these
 * levels are the widely-used reconstruction carried by KANJIDIC — indicative,
 * not official. Labelled as such in the UI.
 */
export const KANJI_JLPT = [
  { id: '5', label: 'N5', hint: '79 kanji — tingkat pemula' },
  { id: '4', label: 'N4', hint: '166 kanji' },
  { id: '3', label: 'N3', hint: '367 kanji' },
  { id: '2', label: 'N2', hint: '367 kanji' },
  { id: '1', label: 'N1', hint: '985 kanji — tingkat tertinggi' },
] as const

export const HSK_LEVELS = [
  { id: '1', label: 'HSK 1', hint: '300 karakter' },
  { id: '2', label: 'HSK 2', hint: '+300' },
  { id: '3', label: 'HSK 3', hint: '+300' },
  { id: '4', label: 'HSK 4', hint: '+300' },
  { id: '5', label: 'HSK 5', hint: '+300' },
  { id: '6', label: 'HSK 6', hint: '+300' },
  { id: '7-9', label: 'HSK 7–9', hint: '1.200 karakter tingkat lanjut' },
] as const

/* -------------------------------- search -------------------------------- */

const norm = (s: string) => s.toLowerCase().trim()

/** Strips tone marks so "shuijiao" finds "shuǐjiào". */
export function stripTones(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function searchKanji(list: KanjiEntry[], q: string): KanjiEntry[] {
  const t = norm(q)
  if (!t) return list
  return list.filter(
    (k) =>
      k.c === t ||
      k.c.includes(q.trim()) ||
      k.m.some((m) => norm(m).includes(t)) ||
      k.on.some((r) => norm(r).includes(t)) ||
      k.kun.some((r) => norm(r).includes(t)) ||
      norm(k.py).includes(t) ||
      k.kr.includes(q.trim()),
  )
}

export function searchHanzi(list: HanziEntry[], q: string): HanziEntry[] {
  const t = norm(q)
  if (!t) return list
  const bare = stripTones(t)
  return list.filter(
    (h) =>
      h.c.includes(q.trim()) ||
      norm(h.m).includes(t) ||
      norm(h.p).includes(t) ||
      stripTones(norm(h.p)).includes(bare),
  )
}

/**
 * Stroke-order animation data (Hanzi Writer, MIT / Arphic PL) — fetched per
 * character, because 20 000+ glyph files are far too much to bundle.
 *
 * Japanese uses the JP-shaped fork where available; both are keyed by the raw
 * character, and StrokeOrder falls back to the mainland set, then to a plain
 * glyph, so a miss degrades quietly instead of showing a broken box.
 */
const STROKE_PKGS: Record<LangId, string[]> = {
  jp: ['@k1low/hanzi-writer-data-jp@0.8.0', 'hanzi-writer-data@2.0.1'],
  cn: ['hanzi-writer-data@2.0.1'],
  kr: ['hanzi-writer-data@2.0.1'],
  en: [],
}

export function strokeDataUrls(char: string, lang: LangId): string[] {
  return STROKE_PKGS[lang].map(
    (pkg) => `https://cdn.jsdelivr.net/npm/${pkg}/${encodeURIComponent(char)}.json`,
  )
}
