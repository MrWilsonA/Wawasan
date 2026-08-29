/**
 * Curriculum integrity check — run with: npm run check:data
 *
 * The curriculum is hand-authored data, so the type system only catches shape
 * errors. This catches the content errors that actually bite: duplicate ids,
 * answer indices out of range, cloze blanks that don't match their answers,
 * bank tokens that can never be correct, and gates with no closing quiz.
 */
import { writeFileSync, rmSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { rolldown } from 'rolldown'

// The curriculum uses TS + extensionless imports, so Node can't load it
// directly. Bundle it with rolldown (already a Vite dependency) into one plain
// ESM file, then import that.
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dir = mkdtempSync(join(tmpdir(), 'wawa-check-'))
const entry = join(dir, 'entry.ts')
const outFile = join(dir, 'bundle.mjs')

writeFileSync(
  entry,
  `export { CURRICULUM } from ${JSON.stringify(resolve(ROOT, 'src/data/curriculum/index.ts').replaceAll('\\', '/'))}`,
)

let CURRICULUM
try {
  const build = await rolldown({
    input: entry,
    resolve: { alias: { '@': resolve(ROOT, 'src') } },
    logLevel: 'silent',
  })
  await build.write({ file: outFile, format: 'esm' })
  ;({ CURRICULUM } = await import(pathToFileURL(outFile).href))
} catch (e) {
  console.error('Could not load curriculum:', e.message)
  process.exit(1)
} finally {
  process.on('exit', () => rmSync(dir, { recursive: true, force: true }))
}

const errors = []
const warnings = []
const seenUnit = new Map()
const seenLesson = new Map()
const seenCard = new Map()

let totals = { gates: 0, units: 0, lessons: 0, exercises: 0, cards: 0, notes: 0 }

for (const [lang, gates] of Object.entries(CURRICULUM)) {
  const gateIdx = new Set()

  for (const gate of gates) {
    totals.gates++
    if (gateIdx.has(gate.index)) errors.push(`${lang}: duplicate gate index ${gate.index}`)
    gateIdx.add(gate.index)

    const hasQuiz = gate.units.some((u) => u.lessons.some((l) => l.kind === 'gate'))
    if (!hasQuiz && gate.index < 5) {
      warnings.push(`${lang} G${gate.index} (${gate.title}): tidak punya kuis gerbang`)
    }

    // the gate quiz must be reachable last
    const quizUnitIdx = gate.units.findIndex((u) => u.lessons.some((l) => l.kind === 'gate'))
    if (quizUnitIdx !== -1 && quizUnitIdx !== gate.units.length - 1) {
      warnings.push(
        `${lang} G${gate.index}: unit dengan kuis gerbang bukan yang terakhir ` +
          `(posisi ${quizUnitIdx + 1}/${gate.units.length})`,
      )
    }

    for (const unit of gate.units) {
      totals.units++
      totals.notes += unit.notes?.length ?? 0

      if (seenUnit.has(unit.id)) errors.push(`duplicate unit id: ${unit.id}`)
      seenUnit.set(unit.id, true)

      if (!unit.lessons.length) errors.push(`${unit.id}: tidak punya pelajaran`)

      for (const card of unit.cards ?? []) {
        totals.cards++
        if (seenCard.has(card.id)) errors.push(`duplicate card id: ${card.id}`)
        seenCard.set(card.id, true)
        if (card.lang !== lang) {
          warnings.push(`${card.id}: lang "${card.lang}" tidak cocok dengan modul "${lang}"`)
        }
      }

      for (const lesson of unit.lessons) {
        totals.lessons++
        if (seenLesson.has(lesson.id)) errors.push(`duplicate lesson id: ${lesson.id}`)
        seenLesson.set(lesson.id, true)

        if (!lesson.exercises.length) errors.push(`${lesson.id}: tidak punya soal`)

        const exIds = new Set()
        for (const ex of lesson.exercises) {
          totals.exercises++
          const where = `${lesson.id}/${ex.id}`
          if (exIds.has(ex.id)) errors.push(`${where}: id soal duplikat di dalam pelajaran`)
          exIds.add(ex.id)

          if (!ex.explain?.trim()) errors.push(`${where}: tidak punya penjelasan`)

          switch (ex.type) {
            case 'choice':
              if (!Array.isArray(ex.options) || ex.options.length < 2) {
                errors.push(`${where}: pilihan kurang dari 2`)
              } else if (ex.answer < 0 || ex.answer >= ex.options.length) {
                errors.push(`${where}: answer ${ex.answer} di luar rentang 0..${ex.options.length - 1}`)
              }
              if (new Set(ex.options).size !== ex.options.length) {
                warnings.push(`${where}: ada pilihan yang identik`)
              }
              break

            case 'fill': {
              const blanks = (ex.sentence.match(/___/g) ?? []).length
              if (blanks !== ex.answers.length) {
                errors.push(`${where}: ${blanks} rumpang tapi ${ex.answers.length} jawaban`)
              }
              for (const a of ex.answers) {
                if (!ex.bank.includes(a)) errors.push(`${where}: jawaban "${a}" tidak ada di bank`)
              }
              if (ex.bank.length < 2) warnings.push(`${where}: bank hanya ${ex.bank.length} token`)
              break
            }

            case 'order':
              if (ex.answer.length !== ex.chunks.length) {
                errors.push(`${where}: answer punya ${ex.answer.length} indeks, chunks ${ex.chunks.length}`)
              }
              if (new Set(ex.answer).size !== ex.answer.length) {
                errors.push(`${where}: indeks answer duplikat`)
              }
              for (const i of ex.answer) {
                if (i < 0 || i >= ex.chunks.length) errors.push(`${where}: indeks ${i} di luar rentang`)
              }
              break

            case 'sort':
              for (const it of ex.items) {
                if (it.bucket < 0 || it.bucket >= ex.buckets.length) {
                  errors.push(`${where}: item "${it.text}" menunjuk bucket ${it.bucket} yang tidak ada`)
                }
              }
              for (let b = 0; b < ex.buckets.length; b++) {
                if (!ex.items.some((i) => i.bucket === b)) {
                  warnings.push(`${where}: bucket "${ex.buckets[b]}" kosong`)
                }
              }
              break

            case 'match':
              if (ex.pairs.length < 2) errors.push(`${where}: pasangan kurang dari 2`)
              break

            case 'type':
              if (!ex.accept?.length) errors.push(`${where}: tidak punya jawaban yang diterima`)
              break

            case 'judge':
              if (typeof ex.answer !== 'boolean') errors.push(`${where}: answer bukan boolean`)
              break

            default:
              errors.push(`${where}: tipe soal tidak dikenal "${ex.type}"`)
          }
        }
      }
    }
  }
}

/* ------------------------------- report ------------------------------- */

console.log('\nRingkasan kurikulum')
console.log('─'.repeat(52))
for (const [lang, gates] of Object.entries(CURRICULUM)) {
  const units = gates.flatMap((g) => g.units)
  const lessons = units.flatMap((u) => u.lessons)
  const ex = lessons.flatMap((l) => l.exercises)
  const cards = units.flatMap((u) => u.cards ?? [])
  const notes = units.flatMap((u) => u.notes ?? [])
  console.log(
    `  ${lang}  ${String(gates.length).padStart(2)} gerbang · ` +
      `${String(units.length).padStart(2)} unit · ` +
      `${String(lessons.length).padStart(2)} pelajaran · ` +
      `${String(ex.length).padStart(3)} soal · ` +
      `${String(notes.length).padStart(3)} materi · ` +
      `${String(cards.length).padStart(3)} kartu`,
  )
}
console.log('─'.repeat(52))
console.log(
  `  TOTAL ${totals.gates} gerbang · ${totals.units} unit · ${totals.lessons} pelajaran · ` +
    `${totals.exercises} soal · ${totals.notes} materi · ${totals.cards} kartu\n`,
)

if (warnings.length) {
  console.log(`Peringatan (${warnings.length}):`)
  for (const w of warnings) console.log('  ~', w)
  console.log('')
}

if (errors.length) {
  console.log(`GALAT (${errors.length}):`)
  for (const e of errors) console.log('  !', e)
  process.exit(1)
}

console.log('Semua pemeriksaan lolos.\n')
