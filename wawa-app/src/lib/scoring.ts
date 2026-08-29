import {
  JLPT_LEVELS, JLPT_SECTIONS,
  IELTS_RAW_LISTENING, IELTS_RAW_READING_ACADEMIC, IELTS_RAW_READING_GENERAL,
  TOEFL_CONCORDANCE, TOPIK_THRESHOLDS, HSK_20,
} from '@/data/reference'

/* ============================== JLPT ============================== */

export type JlptResult = {
  total: number
  pass: boolean
  /** which requirement failed, if any */
  reason: 'lulus' | 'total' | 'bagian' | 'keduanya'
  failedSections: string[]
  threshold: number
}

/**
 * LULUS = (Total ≥ ambang level) DAN (SEMUA bagian ≥ minimumnya).
 * Both conditions are hard — a candidate with a higher total than a peer can
 * still fail on a single section, which is the whole point of the table.
 */
export function scoreJlpt(level: string, scores: Record<string, number>): JlptResult {
  const meta = JLPT_LEVELS.find((l) => l.level === level)!
  const sections = JLPT_SECTIONS[level]
  const total = sections.reduce((sum, s) => sum + (scores[s.key] ?? 0), 0)
  const failedSections = sections.filter((s) => (scores[s.key] ?? 0) < s.min).map((s) => s.label)
  const totalOk = total >= meta.pass
  const sectionsOk = failedSections.length === 0

  let reason: JlptResult['reason'] = 'lulus'
  if (!totalOk && !sectionsOk) reason = 'keduanya'
  else if (!totalOk) reason = 'total'
  else if (!sectionsOk) reason = 'bagian'

  return { total, pass: totalOk && sectionsOk, reason, failedSections, threshold: meta.pass }
}

/* ============================== IELTS ============================== */

/** Raw correct out of 40 → band, using the indicative conversion tables. */
export function ieltsRawToBand(
  raw: number,
  kind: 'listening' | 'reading-academic' | 'reading-general',
): number {
  const table =
    kind === 'listening' ? IELTS_RAW_LISTENING
      : kind === 'reading-academic' ? IELTS_RAW_READING_ACADEMIC
        : IELTS_RAW_READING_GENERAL
  for (const row of table) if (raw >= row.min) return row.band
  return 2.5
}

/**
 * Overall = mean of the four sections, rounded to the nearest half band;
 * exact halves (.25 / .75) round UP.
 */
export function ieltsOverall(l: number, r: number, w: number, s: number): number {
  const mean = (l + r + w + s) / 4
  const floor = Math.floor(mean)
  const frac = mean - floor
  let band: number
  if (frac < 0.25) band = floor
  else if (frac < 0.75) band = floor + 0.5
  else band = floor + 1
  return Math.round(band * 2) / 2
}

export function ieltsRoundingExplain(l: number, r: number, w: number, s: number) {
  const sum = l + r + w + s
  const mean = sum / 4
  const frac = +(mean - Math.floor(mean)).toFixed(3)
  const rule =
    frac === 0 ? 'tepat di bilangan bulat — tetap'
      : frac < 0.25 ? `.${String(frac).slice(2)} → dibulatkan TURUN`
        : frac === 0.25 ? '.250 → dibulatkan NAIK ke .5'
          : frac < 0.75 ? `.${String(frac).slice(2)} → dibulatkan ke .5 terdekat`
            : frac === 0.75 ? '.750 → dibulatkan NAIK ke bilangan bulat'
              : `.${String(frac).slice(2)} → dibulatkan NAIK`
  return { sum, mean: +mean.toFixed(3), rule, overall: ieltsOverall(l, r, w, s) }
}

export function ieltsBandName(band: number): string {
  const map: Record<number, string> = {
    9: 'Expert User', 8: 'Very Good User', 7: 'Good User', 6: 'Competent User',
    5: 'Modest User', 4: 'Limited User', 3: 'Extremely Limited User',
    2: 'Intermittent User', 1: 'Non-User', 0: 'Did not attempt',
  }
  return map[Math.floor(band)] ?? '—'
}

/* ============================== TOEFL ============================== */

/** Same averaging rule as IELTS, but clamped to the 1–6 scale. */
export function toeflOverall(r: number, l: number, s: number, w: number): number {
  const mean = (r + l + s + w) / 4
  const rounded = Math.round(mean * 2) / 2
  return Math.min(6, Math.max(1, rounded))
}

export function toeflToOld(band: number): string {
  const row = TOEFL_CONCORDANCE.find((c) => c.band === band)
  return row ? row.total : '—'
}

export function toeflCefr(band: number): string {
  const row = TOEFL_CONCORDANCE.find((c) => c.band <= band) ?? TOEFL_CONCORDANCE[TOEFL_CONCORDANCE.length - 1]
  return row.cefr
}

/* ============================== TOPIK ============================== */

export function scoreTopik(exam: 'I' | 'II', score: number): { level: number | null; label: string } {
  const cfg = TOPIK_THRESHOLDS[exam]
  for (const b of cfg.bands) {
    if (score >= b.min) return { level: b.level, label: `Level ${b.level}` }
  }
  return { level: null, label: '불합격 — tidak bersertifikat' }
}

/* ============================== HSK ============================== */

export function scoreHsk(level: string, score: number): { pass: boolean; threshold: number; total: number } {
  const row = HSK_20.find((h) => h.level === level)!
  return { pass: score >= row.pass, threshold: row.pass, total: row.total }
}

/* ==================== SISTEM PENILAIAN INTERNAL ==================== */

export type Grade = { min: number; label: string; color: string; action: string }

export function gradeFor(pct: number): Grade {
  if (pct >= 95) return { min: 95, label: '完璧 Sempurna', color: 'leaf', action: 'Lanjut. Jadwalkan ulang materi ini di H+7.' }
  if (pct >= 85) return { min: 85, label: '合格 Lulus', color: 'teal', action: 'Lanjut. Tandai butir yang salah untuk ulangan H+3.' }
  if (pct >= 70) return { min: 70, label: '要復習 Perlu Ulang', color: 'amber', action: 'JANGAN LANJUT. Ulangi unit, kerjakan ulang kuis H+2.' }
  return { min: 0, label: '不合格 Belum', color: 'coral', action: 'Ulangi unit DARI AWAL, termasuk latihan menulisnya.' }
}

/** Nilai Gerbang = MIN(Menyimak, Membaca, Menulis, Berbicara) */
export function gateScore(skills: { menyimak: number; membaca: number; menulis: number; berbicara: number }) {
  const values = Object.values(skills)
  const min = Math.min(...values)
  const weakest = (Object.keys(skills) as (keyof typeof skills)[]).find((k) => skills[k] === min)!
  return { score: min, weakest, average: Math.round(values.reduce((a, b) => a + b, 0) / values.length) }
}

/* ==================== ESTIMASI JAM BELAJAR ==================== */

export function monthsFor(hours: number, hoursPerDay: number): number {
  return +(hours / hoursPerDay / 30).toFixed(1)
}
