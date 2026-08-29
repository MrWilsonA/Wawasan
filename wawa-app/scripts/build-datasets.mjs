/**
 * Generates the bundled character datasets in src/data/generated/.
 *
 * Run once (or when you want to refresh):  npm run build:data
 *
 * Why generated instead of fetched at runtime:
 *   - the upstream sources are 7–16 MB; the slices we actually need are ~400 KB
 *   - a learner offline on a phone still gets the full character bank
 *   - readings/meanings come from authoritative datasets, not from anyone's memory
 *
 * Sources (all open data, credited in src/data/generated/SOURCES.md):
 *   KANJIDIC2  — EDRDG, CC BY-SA 4.0        (via npm kanjidic2-json)
 *   Unihan     — Unicode Consortium         (kMandarin / kDefinition)
 *   HSK 3.0    — 2021 official char lists   (via npm @leonsilicon/hsk3.0)
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'src/data/generated')
const CACHE = resolve(ROOT, '.datacache')

mkdirSync(OUT, { recursive: true })
mkdirSync(CACHE, { recursive: true })

const log = (...a) => console.log('[datasets]', ...a)

/** Fetch with an on-disk cache so re-runs don't hammer the upstreams. */
async function cachedFetch(url, cacheName, { text = false } = {}) {
  const file = resolve(CACHE, cacheName)
  if (existsSync(file)) {
    log('cache hit', cacheName)
    const raw = readFileSync(file, 'utf8')
    return text ? raw : JSON.parse(raw)
  }
  log('fetching', url)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
  const raw = await res.text()
  writeFileSync(file, raw)
  return text ? raw : JSON.parse(raw)
}

/* ============================== KANJI ============================== */

async function buildKanji() {
  const kanjidic = await cachedFetch(
    'https://cdn.jsdelivr.net/npm/kanjidic2-json@0.1.0/KANJIS.json',
    'kanjidic2.json',
  )

  const entries = Array.isArray(kanjidic) ? kanjidic : Object.values(kanjidic)
  log('kanjidic entries', entries.length)

  const out = []
  for (const k of entries) {
    const literal = k.literal
    if (!literal) continue

    // jōyō = grades 1–8 (1–6 kyōiku + 8 secondary school). 9/10 are jinmeiyō.
    const grade = k.grade
    if (!(grade >= 1 && grade <= 8)) continue

    const r = k.readings ?? {}

    out.push({
      c: literal,
      g: grade,
      j: k.jlpt ?? null,
      s: k.strokeCounts?.[0] ?? null,
      f: k.freq ?? null,
      on: (r.ja_on ?? []).slice(0, 4),
      kun: (r.ja_kun ?? []).slice(0, 4),
      m: (k.meanings?.en ?? []).slice(0, 5),
      // cross-language bonus: the same character's Mandarin and Korean readings.
      // The curriculum leans on this (學校 / 학교 / がっこう / xuéxiào).
      py: (r.pinyin ?? [])[0] ?? '',
      kr: (r.korean_h ?? [])[0] ?? '',
    })
  }

  out.sort((a, b) => (a.f ?? 99999) - (b.f ?? 99999))
  writeFileSync(resolve(OUT, 'kanji.json'), JSON.stringify(out))
  log('kanji.json', out.length, 'entries')
  return out.length
}

/* ============================== HANZI ============================== */

const HSK_LEVELS = ['1', '2', '3', '4', '5', '6', '7-9']

async function buildHanzi() {
  // 1. HSK 3.0 character lists, per level
  const levelOf = new Map()
  for (const lv of HSK_LEVELS) {
    const chars = await cachedFetch(
      `https://cdn.jsdelivr.net/npm/@leonsilicon/hsk3.0@0.0.0/HSK3.0_chars_level${lv}.json`,
      `hsk-${lv}.json`,
    )
    for (const c of chars) if (!levelOf.has(c)) levelOf.set(c, lv)
  }
  log('hsk chars', levelOf.size)

  // 2. Pinyin — Unihan kMandarin, repackaged as { "U+XXXX": "pīn" }
  const mandarin = await cachedFetch(
    'https://cdn.jsdelivr.net/npm/unicode-mandarin-readings@1.0.0/data.json',
    'unihan-mandarin.json',
  )
  const pinyin = new Map()
  for (const [code, reading] of Object.entries(mandarin)) {
    const cp = Number.parseInt(code.replace('U+', ''), 16)
    if (!Number.isFinite(cp)) continue
    const ch = String.fromCodePoint(cp)
    if (levelOf.has(ch)) pinyin.set(ch, String(reading).split(' ')[0])
  }

  // 3. Definitions — Unihan kDefinition, tab-separated:
  //    "U+3400 㐀\tkDefinition\t(same as 丘) hillock or mound"
  const kdef = await cachedFetch(
    'https://raw.githubusercontent.com/unicode-org/unihan-database/main/kDefinition.txt',
    'unihan-kdefinition.txt',
    { text: true },
  )
  const defs = new Map()
  for (const line of kdef.split('\n')) {
    if (!line || line[0] === '#') continue
    const [codeCol, field, ...rest] = line.split('\t')
    if (field !== 'kDefinition') continue
    const cp = Number.parseInt(codeCol.split(' ')[0].replace('U+', ''), 16)
    if (!Number.isFinite(cp)) continue
    const ch = String.fromCodePoint(cp)
    if (!levelOf.has(ch)) continue
    const value = rest.join('\t').trim()
    if (value) defs.set(ch, value)
  }

  const out = []
  for (const [c, lv] of levelOf) {
    out.push({
      c,
      lv,
      p: pinyin.get(c) ?? '',
      m: (defs.get(c) ?? '').slice(0, 160),
    })
  }
  out.sort((a, b) => HSK_LEVELS.indexOf(a.lv) - HSK_LEVELS.indexOf(b.lv) || a.c.localeCompare(b.c))

  writeFileSync(resolve(OUT, 'hanzi.json'), JSON.stringify(out))
  const missing = out.filter((x) => !x.p).length
  log('hanzi.json', out.length, 'entries,', missing, 'without pinyin')
  return out.length
}

/* ============================== RUN ============================== */

const nKanji = await buildKanji()
const nHanzi = await buildHanzi()

writeFileSync(
  resolve(OUT, 'SOURCES.md'),
  `# Sumber data karakter

Berkas di folder ini **dihasilkan otomatis** oleh \`scripts/build-datasets.mjs\`.
Jangan diedit manual — jalankan \`npm run build:data\` untuk memperbaruinya.

Terakhir dibuat: ${new Date().toISOString().slice(0, 10)}

| Berkas | Isi | Sumber | Lisensi |
|---|---|---|---|
| \`kanji.json\` | ${nKanji} kanji jōyō (grade 1–8) dengan on'yomi, kun'yomi, arti, jumlah guratan, tingkat JLPT, peringkat frekuensi | [KANJIDIC2](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project) — EDRDG | CC BY-SA 4.0 |
| \`hanzi.json\` | ${nHanzi} hanzi HSK 3.0 (level 1–9) dengan pinyin dan definisi | Daftar karakter: silabus HSK 3.0 (2021) · Pinyin & definisi: [Unihan](https://www.unicode.org/charts/unihan.html) — Unicode Consortium | Unicode License / open data |

Kamus Inggris diambil langsung saat dibutuhkan dari
[dictionaryapi.dev](https://dictionaryapi.dev/) (gratis, tanpa kunci API) — tidak dibundel.
`,
)

log('done.')
