import { useEffect, useMemo, useRef, useState } from 'react'
import { Wawa } from '@/brand/Wawa'
import {
  Button, Card, Chip, DataTable, Icon, SectionTitle, Tabs, cx, Callout, Stat, SearchInput,
} from '@/components/ui'
import { HIRAGANA, KATAKANA, JAMO_CONSONANTS, JAMO_VOWELS, KANJI_ORIGINS } from '@/data/scripts'
import { loadKanji, loadHanzi, type KanjiEntry, type HanziEntry } from '@/data/charBank'
import { StrokeOrder } from '@/components/StrokeOrder'
import { useProgress, useProblemChars } from '@/store/useProgress'
import { LANGUAGES } from '@/data/languages'
import type { LangId } from '@/data/types'

/* ======================================================================
   Writing practice is split PER LANGUAGE — each script family gets its own
   workspace, guide box, character pool and weekly programme, because the
   curriculum prescribes different ones (8 weeks JP, 10 CN, 3 KR).
   ====================================================================== */

type GridKind = 'juji' | 'tian' | 'mi' | 'hangeul' | 'latin'
type Phase = 'idle' | 'slow' | 'normal' | 'dictation' | 'correct'
type WLang = 'jp' | 'cn' | 'kr'

const PHASES: Record<Phase, { label: string; target: number; help: string; color: string }> = {
  idle: { label: 'Siap', target: 0, help: 'Pilih karakter lalu mulai protokol 3-7-D-K.', color: 'ink' },
  slow: { label: '3 — Pelan', target: 3, help: 'Tulis 3× SANGAT PELAN sambil MELIHAT contoh. Ucapkan nomor guratan bersuara: "satu, dua, tiga…"', color: 'sky' },
  normal: { label: '7 — Normal', target: 7, help: 'Tulis 7× dengan kecepatan normal, MASIH melihat contoh. Ucapkan bunyi/artinya, bukan nomor guratan.', color: 'teal' },
  dictation: { label: 'D — Dikte', target: 3, help: 'Contoh disembunyikan. Tulis dari INGATAN 3×. Ini tahap yang paling menentukan.', color: 'grape' },
  correct: { label: 'K — Koreksi', target: 0, help: 'Bandingkan dengan contoh. Lingkari yang salah, catat di Jurnal Kesalahan.', color: 'amber' },
}

type ScriptDef = {
  id: string
  label: string
  grid: GridKind
  /** literal pool, or a key into the generated datasets */
  source: { char: string; hint?: string }[] | 'kanji' | 'hanzi'
  note?: string
}

/** Syllable blocks covering all four assembly patterns. */
const HANGEUL_BLOCKS = (() => {
  const leadIdx = [0, 2, 3, 5, 6, 7, 9, 11, 12, 18]
  const leadName = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅎ']
  const rows: { char: string; hint: string }[] = []
  leadIdx.forEach((L, i) => rows.push({
    char: String.fromCodePoint(0xac00 + L * 588),
    hint: `Pola 1 — konsonan ${leadName[i]} + vokal ㅏ (tegak, konsonan di kiri)`,
  }))
  leadIdx.forEach((L, i) => rows.push({
    char: String.fromCodePoint(0xac00 + L * 588 + 8 * 28),
    hint: `Pola 2 — konsonan ${leadName[i]} + vokal ㅗ (mendatar, konsonan di atas)`,
  }))
  const finals = [1, 4, 8, 16, 17, 21]
  const finalName = ['ㄱ', 'ㄴ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅇ']
  finals.forEach((f, i) => rows.push({
    char: String.fromCodePoint(0xac00 + f),
    hint: `Pola 3 — 가 + batchim ${finalName[i]}`,
  }))
  finals.forEach((f, i) => rows.push({
    char: String.fromCodePoint(0xac00 + 8 * 28 + f),
    hint: `Pola 4 — 고 + batchim ${finalName[i]}`,
  }))
  return rows
})()

const CN_STROKES = [
  { char: '永', hint: '永字八法 — memuat kedelapan guratan dasar sekaligus' },
  { char: '一', hint: '横 héng — mendatar, ujung kanan sedikit naik' },
  { char: '丨', hint: '竖 shù — tegak lurus' },
  { char: '丿', hint: '撇 piě — sapuan kiri, menipis di ujung' },
  { char: '亅', hint: '钩 gōu — diakhiri kait' },
  { char: '十', hint: 'Mendatar sebelum menegak' },
  { char: '女', hint: 'Penembus horizontal ditulis TERAKHIR' },
  { char: '中', hint: 'Penembus vertikal ditulis TERAKHIR' },
  { char: '国', hint: 'Bingkai → isi → lantai (ditutup terakhir)' },
  { char: '小', hint: 'Tengah sebelum sayap' },
]

const SCRIPTS: Record<WLang, ScriptDef[]> = {
  jp: [
    {
      id: 'hiragana', label: 'ひらがな Hiragana', grid: 'juji',
      source: HIRAGANA.map((k) => ({ char: k.char, hint: `${k.roman} — dari ${k.from} (${k.fromMeaning})` })),
      note: 'Kotak 十字格. Hiragana lahir dari kanji yang ditulis kursif sampai luruh.',
    },
    {
      id: 'katakana', label: 'カタカナ Katakana', grid: 'juji',
      source: KATAKANA.map((k) => ({ char: k.char, hint: `${k.roman} — potongan dari ${k.from} (${k.fromMeaning})` })),
      note: 'Latih シ/ツ dan ソ/ン berpasangan — arah guratan yang membedakan, bukan bentuk akhirnya.',
    },
    {
      id: 'kanji-cerita', label: '漢字 bercerita', grid: 'mi',
      source: KANJI_ORIGINS.map((k) => ({ char: k.char, hint: `${k.meaning} — ${k.onyomi} / ${k.kunyomi}` })),
      note: '39 kanji yang punya cerita asal-usul lengkap di modul Aksara.',
    },
    {
      id: 'kanji-all', label: '漢字 jōyō penuh', grid: 'mi', source: 'kanji',
      note: '2.136 kanji jōyō, diurutkan dari yang paling sering muncul di media cetak.',
    },
  ],
  cn: [
    {
      id: 'guratan', label: '笔画 Guratan dasar', grid: 'mi', source: CN_STROKES,
      note: 'Minggu 1: tulis 永 sebanyak 30× per hari selama 7 hari, sebutkan nama guratannya sambil menulis.',
    },
    {
      id: 'hanzi', label: '汉字 HSK', grid: 'tian', source: 'hanzi',
      note: '3.000 hanzi HSK 3.0. Kotak 田字格 melatih proporsi — kesalahan proporsi adalah penanda utama tulisan orang asing.',
    },
  ],
  kr: [
    {
      id: 'jamo-k', label: '자음 Konsonan', grid: 'hangeul',
      source: JAMO_CONSONANTS.map((j) => ({ char: j.char, hint: `${j.roman} — ${j.story}` })),
      note: 'Aturan universal hangeul: kiri ke kanan, atas ke bawah. Tidak ada pengecualian rumit seperti kanji.',
    },
    {
      id: 'jamo-v', label: '모음 Vokal', grid: 'hangeul',
      source: JAMO_VOWELS.map((j) => ({ char: j.char, hint: `${j.roman} — ${j.story}` })),
    },
    {
      id: 'blok', label: '음절 Blok suku kata', grid: 'hangeul', source: HANGEUL_BLOCKS,
      note: 'Semua blok WAJIB sama tingginya, ada batchim atau tidak. Tanpa batchim: konsonan+vokal mengisi penuh; dengan batchim: keduanya dipendekkan jadi ±65%.',
    },
  ],
}

const PROGRAMMES: Record<WLang, { weeks: string; rows: string[][] }> = {
  jp: {
    weeks: '8 minggu',
    rows: [
      ['1', 'Hiragana あ–の (25 huruf)', '5 huruf × 10 tulisan', 'Baca 25 huruf acak dalam 60 detik'],
      ['2', 'Hiragana は–ん (21 huruf)', '5 huruf × 10 tulisan', 'Baca 46 huruf acak dalam 90 detik'],
      ['3', 'Dakuten, handakuten, yōon', '8 kombinasi/hari', 'Tulis 20 kata dari dikte'],
      ['4', 'Katakana ア–ノ', '5 huruf × 10 tulisan', 'Bedakan シ/ツ dan ソ/ン 10/10'],
      ['5', 'Katakana ハ–ン + kata serapan', '5 huruf × 10 tulisan', 'Tulis 15 kata serapan dari dikte'],
      ['6', '7 guratan dasar + kanji angka 一–十', '20 menit guratan + 10 kanji', 'Urutan guratan benar 10/10'],
      ['7', '20 kanji alam & tubuh', '5 kanji × 8 tulisan', 'Tulis dari arti Indonesia, 18/20'],
      ['8', '20 kanji gabungan 会意', '5 kanji × 8 tulisan', 'Jelaskan logika 会意 tiap kanji'],
    ],
  },
  cn: {
    weeks: '10 minggu',
    rows: [
      ['1', '8 guratan dasar + 永字八法', '永 × 30 + tiap guratan × 20', 'Guratan terbentuk rapi & konsisten'],
      ['2', 'Angka 一–十, 百, 千, 万', '5 hanzi × 10', 'Tulis dari dikte 13/13'],
      ['3', '20 piktogram alam', '4 hanzi × 10', 'Ceritakan asal-usul tiap hanzi'],
      ['4', '20 piktogram tubuh & hewan', '4 hanzi × 10', 'Tulis dari arti Indonesia 18/20'],
      ['5', '20 会意', '4 hanzi × 10', 'Jelaskan logika penjumlahannya'],
      ['6', '25 radikal pertama', '5 radikal × 10', 'Sebutkan 3 hanzi untuk tiap radikal'],
      ['7', '25 radikal kedua', '5 radikal × 10', 'Idem'],
      ['8', '30 形声字 keluarga 马/青/包', '5 hanzi × 8', 'Tebak makna 10 hanzi baru dari radikalnya'],
      ['9', '50 hanzi HSK 1', '8 hanzi × 8', 'Dikte kalimat HSK 1'],
      ['10', '50 hanzi HSK 2 + review', '8 hanzi × 8', 'Tulis 10 kalimat HSK 2 dari dikte'],
    ],
  },
  kr: {
    weeks: '3 minggu',
    rows: [
      ['1', 'Jamo dasar — konsonan & vokal', 'Tiap jamo × 10', 'Tulis semua jamo dari dikte'],
      ['2', 'Blok suku kata — 4 pola', 'Tiap baris × 10', 'Semua blok sama tingginya'],
      ['3', 'Dikte kata + batchim', '10 kata/hari', '한국 · 사람 · 사랑 · 감사합니다 tanpa salah'],
    ],
  },
}

const GRID_LABEL: Record<GridKind, string> = {
  juji: '十字格', tian: '田字格', mi: '米字格', hangeul: '한글', latin: 'Latin',
}

const GRIDS_FOR: Record<WLang, GridKind[]> = {
  jp: ['juji', 'mi'],
  cn: ['tian', 'mi'],
  kr: ['hangeul', 'juji'],
}

/* ================================= page ================================= */

export default function Writing() {
  const activeLang = useProgress((s) => s.activeLang)
  const [wlang, setWlang] = useState<WLang>(() => activeLang === 'en' ? 'jp' : activeLang)
  const { errorJournal, clearError, writingSessions } = useProgress()
  const problems = useProblemChars()
  useEffect(() => {
    if (activeLang !== 'en') setWlang(activeLang)
  }, [activeLang])

  const today = new Date().toISOString().slice(0, 10)
  const todayChars = writingSessions.filter((w) => w.date === today).reduce((a, b) => a + b.chars, 0)

  if (activeLang === 'en') return <EnglishWriting />

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="Prinsip 3 — Motor Encoding"
        title="Latihan Menulis"
        sub="Protokol 3-7-D-K. Maksimal 10 repetisi, lalu WAJIB bandingkan dengan contoh — menulis 100× tanpa umpan balik hanya melatih kesalahan."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat icon="writing" value={todayChars} label="karakter hari ini" color="coral" />
        <Stat icon="doc" value={errorJournal.length} label="entri jurnal" color="amber" />
        <Stat icon="warning" value={problems.length} label="karakter bermasalah" color="grape" />
      </div>

      <Chip color="coral" icon="writing">Ruang kerja khusus {LANGUAGES[wlang].name}</Chip>

      <Workspace key={wlang} wlang={wlang} />

      <Card>
        <SectionTitle
          eyebrow={`Program ${PROGRAMMES[wlang].weeks}`}
          title={`Jadwal menulis — ${LANGUAGES[wlang].name}`}
          sub="Jadwal ini khusus untuk aksara bahasa yang sedang dipilih di atas."
        />
        <DataTable head={['Minggu', 'Target', 'Volume harian', 'Kriteria lulus']} rows={PROGRAMMES[wlang].rows} dense />
      </Card>

      <Card>
        <SectionTitle
          eyebrow="Bagian K menghasilkan data"
          title="Jurnal Kesalahan"
          sub="Berlaku lintas bahasa — kesalahan tetap kesalahan, aksara apa pun itu."
        />
        {errorJournal.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-sand p-6 text-center text-[14px] text-ink-faint">
            Belum ada catatan. Tambahkan lewat tombol “Catat kesalahan” di tahap K.
          </p>
        ) : (
          <DataTable
            head={['Tanggal', 'Karakter', 'Kesalahan', 'Jenis', 'Tindakan', '']}
            cjkCols={[1]}
            rows={errorJournal.slice(0, 25).map((e) => [
              e.date.slice(5),
              e.char,
              e.mistake,
              <Chip key="k" size="sm" color="coral">{e.kind.replace('-', ' ')}</Chip>,
              e.action,
              <button
                key="x"
                onClick={() => clearError(e.id)}
                aria-label="Hapus entri"
                className="rounded-lg p-1 text-ink-faint hover:bg-shell"
              >
                <Icon name="trash" size={14} />
              </button>,
            ])}
            dense
          />
        )}
        <Callout kind="warning" title="Aturan jurnal">
          Karakter yang muncul <strong className="text-ink">3× di jurnal</strong> masuk daftar “karakter
          bermasalah” dan dilatih setiap hari selama seminggu penuh, tanpa peduli jadwal SRS-nya.
        </Callout>
      </Card>
    </div>
  )
}

function EnglishWriting() {
  const [text, setText] = useState('')
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="Mode Inggris · produksi tertulis"
        title="Latihan Menulis Inggris"
        sub="Mode Inggris tidak menampilkan kotak aksara Jepang, Mandarin, atau Korea. Fokusnya adalah paragraf, koherensi, dan koreksi."
      />
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <Chip color="leaf" icon="writing">Prompt B1–B2</Chip>
          <span className="text-[12px] font-extrabold text-ink-faint">{words} kata</span>
        </div>
        <h3 className="text-lg text-ink">Should university students be required to do volunteer work?</h3>
        <p className="mt-1 text-[13.5px] text-ink-soft">Tulis 120–180 kata: pendapat, dua alasan, satu contoh, dan simpulan.</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={11}
          placeholder="Write your response here…"
          className="mt-4 w-full resize-y rounded-2xl border-2 border-sand bg-paper p-4 text-[14.5px] leading-relaxed text-ink outline-none placeholder:text-ink-faint focus:border-leaf-400"
        />
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            ['Struktur', 'Ada opening, alasan, contoh, simpulan.'],
            ['Bahasa', 'Cek artikel, tense, dan subject–verb agreement.'],
            ['Koherensi', 'Gunakan however, for example, therefore secara wajar.'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border-2 border-sand bg-cream p-3">
              <div className="font-display text-[13.5px] font-extrabold text-ink">{title}</div>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* =============================== workspace =============================== */

function Workspace({ wlang }: { wlang: WLang }) {
  const defs = SCRIPTS[wlang]
  const [scriptId, setScriptId] = useState(defs[0].id)
  const def = defs.find((d) => d.id === scriptId) ?? defs[0]

  const [pool, setPool] = useState<{ char: string; hint?: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')

  const [target, setTarget] = useState('')
  const [grid, setGrid] = useState<GridKind>(def.grid)
  const [phase, setPhase] = useState<Phase>('idle')
  const [reps, setReps] = useState(0)
  const [sessionChars, setSessionChars] = useState<string[]>([])

  const { logWriting, logError } = useProgress()
  const problems = useProblemChars()

  useEffect(() => {
    let alive = true
    setQ('')
    setGrid(def.grid)
    setPhase('idle')
    setReps(0)

    if (Array.isArray(def.source)) {
      setPool(def.source)
      setTarget(def.source[0]?.char ?? '')
      setLoading(false)
      return
    }

    setLoading(true)
    const load =
      def.source === 'kanji'
        ? loadKanji().then((ks: KanjiEntry[]) => ks.map((k) => ({ char: k.c, hint: `${k.m[0] ?? ''} · ${k.s ?? '?'} guratan` })))
        : loadHanzi().then((hs: HanziEntry[]) => hs.map((h) => ({ char: h.c, hint: `${h.p} · ${h.m.split(/[,;]/)[0]}` })))

    load.then((items) => {
      if (!alive) return
      setPool(items)
      setTarget(items[0]?.char ?? '')
      setLoading(false)
    })
    return () => { alive = false }
  }, [def])

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return pool.slice(0, 400)
    return pool.filter((p) => p.char.includes(q.trim()) || (p.hint ?? '').toLowerCase().includes(t)).slice(0, 400)
  }, [pool, q])

  const cfg = PHASES[phase]
  const currentHint = pool.find((p) => p.char === target)?.hint

  const nextPhase = () => {
    setReps(0)
    if (phase === 'idle') setPhase('slow')
    else if (phase === 'slow') setPhase('normal')
    else if (phase === 'normal') setPhase('dictation')
    else if (phase === 'dictation') setPhase('correct')
    else {
      if (!sessionChars.includes(target)) setSessionChars((s) => [...s, target])
      logWriting(1, wlang)
      setPhase('idle')
    }
  }

  return (
    <>
      <Tabs tabs={defs.map((d) => ({ id: d.id, label: d.label }))} value={scriptId} onChange={setScriptId} size="sm" />

      {def.note ? (
        <p className="rounded-2xl border-2 border-sand bg-cream px-4 py-2.5 text-[13px] leading-relaxed text-ink-soft">
          {def.note}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Chip color={cfg.color as 'teal'}>{cfg.label}</Chip>
              {cfg.target > 0 ? (
                <span className="font-display text-[14px] font-extrabold text-ink">{reps} / {cfg.target}</span>
              ) : null}
            </div>
            <div className="flex gap-1.5">
              {GRIDS_FOR[wlang].map((g) => (
                <button
                  key={g}
                  onClick={() => setGrid(g)}
                  className={cx(
                    'rounded-lg border-2 px-2.5 py-1 font-cjk text-[11.5px] font-extrabold',
                    grid === g ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-sand bg-paper text-ink-faint',
                  )}
                >
                  {GRID_LABEL[g]}
                </button>
              ))}
            </div>
          </div>

          <p className="mb-3 rounded-2xl border-2 border-sand bg-cream px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-soft">
            {cfg.help}
          </p>

          <TracePad
            char={target}
            grid={grid}
            showModel={phase !== 'dictation' && phase !== 'idle'}
            faint={phase === 'slow' || phase === 'normal'}
            onCount={() => setReps((r) => r + 1)}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={nextPhase}
              disabled={(cfg.target > 0 && reps < cfg.target) || !target}
              variant={phase === 'correct' ? 'success' : 'primary'}
              icon={phase === 'idle' ? 'play' : phase === 'correct' ? 'check' : 'next'}
            >
              {phase === 'idle' ? 'Mulai 3-7-D-K'
                : phase === 'correct' ? 'Selesaikan karakter'
                  : cfg.target > 0 && reps < cfg.target ? `Tulis ${cfg.target - reps}× lagi`
                    : 'Tahap berikutnya'}
            </Button>
            <Button variant="secondary" icon="reset" onClick={() => { setPhase('idle'); setReps(0) }}>
              Ulang dari awal
            </Button>
            {phase === 'correct' ? <ErrorLogger char={target} lang={wlang} onLog={logError} /> : null}
          </div>

          {sessionChars.length > 0 ? (
            <div className="mt-4 rounded-2xl border-2 border-leaf-200 bg-leaf-50 p-3">
              <div className="text-[12px] font-extrabold uppercase tracking-wide text-leaf-600">
                Selesai sesi ini ({sessionChars.length})
              </div>
              <div className="mt-1 font-cjk text-[24px] text-ink">{sessionChars.join(' ')}</div>
            </div>
          ) : null}
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-display text-[14px] font-extrabold text-ink">Pilih karakter</span>
              <span className="text-[11px] font-bold text-ink-faint">{pool.length.toLocaleString('id-ID')}</span>
            </div>

            {pool.length > 60 ? (
              <div className="mb-2">
                <SearchInput value={q} onChange={setQ} placeholder="Cari karakter atau arti…" />
              </div>
            ) : null}

            {loading ? (
              <div className="py-10 text-center text-[13px] font-bold text-ink-faint">Memuat daftar…</div>
            ) : (
              <div className="grid max-h-[300px] grid-cols-5 gap-1.5 overflow-y-auto pr-1">
                {filtered.map((c) => (
                  <button
                    key={c.char}
                    title={c.hint}
                    onClick={() => { setTarget(c.char); setPhase('idle'); setReps(0) }}
                    className={cx(
                      'rounded-xl border-2 py-2 font-cjk text-[22px] transition-colors',
                      target === c.char
                        ? 'border-teal-400 bg-teal-50 text-teal-700'
                        : 'border-sand bg-paper text-ink hover:bg-cream',
                    )}
                  >
                    {c.char}
                  </button>
                ))}
              </div>
            )}

            {currentHint ? (
              <p className="mt-2 rounded-xl border-2 border-sand bg-cream p-2.5 text-[12px] leading-snug text-ink-soft">
                <strong className="font-cjk text-[15px] text-ink">{target}</strong> — {currentHint}
              </p>
            ) : null}
          </Card>

          {target && wlang !== 'kr' ? (
            <Card>
              <div className="mb-2 font-display text-[14px] font-extrabold text-ink">Urutan guratan</div>
              <div className="flex justify-center">
                <StrokeOrder char={target} lang={wlang} size={150} />
              </div>
            </Card>
          ) : null}

          {problems.length > 0 ? (
            <Card tone="cream" className="!border-coral-200">
              <div className="mb-2 flex items-center gap-2">
                <Wawa expression="thinking" size={40} cropped />
                <div className="font-display text-[14px] font-extrabold text-coral-600">Karakter bermasalah</div>
              </div>
              <p className="mb-2 text-[12.5px] leading-relaxed text-ink-soft">
                Muncul 3× di jurnal — dilatih setiap hari selama seminggu penuh.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {problems.map((p) => (
                  <button
                    key={p.char}
                    onClick={() => { setTarget(p.char); setPhase('idle') }}
                    className="rounded-xl border-2 border-coral-300 bg-paper px-3 py-1.5 font-cjk text-[20px] text-ink"
                  >
                    {p.char} <span className="font-sans text-[11px] text-coral-500">×{p.n}</span>
                  </button>
                ))}
              </div>
            </Card>
          ) : null}

          <Card>
            <div className="mb-2 font-display text-[14px] font-extrabold text-ink">Protokol 3-7-D-K</div>
            <ol className="space-y-2 text-[12.5px] leading-relaxed text-ink-soft">
              <li><strong className="text-ink">3</strong> — pelan, melihat contoh, hitung guratan bersuara</li>
              <li><strong className="text-ink">7</strong> — kecepatan normal, masih melihat</li>
              <li><strong className="text-ink">D</strong> — dikte dari ingatan (paling menentukan)</li>
              <li><strong className="text-ink">K</strong> — koreksi & catat kesalahan</li>
            </ol>
            <p className="mt-3 rounded-xl border-2 border-amber-200 bg-amber-50 p-2.5 text-[12px] leading-relaxed text-ink-soft">
              Total 13 tulisan per karakter, ±90 detik. Kalau waktumu terbatas, kurangi tahap 7 —
              <strong className="text-ink"> jangan pernah kurangi tahap D</strong>.
            </p>
          </Card>
        </div>
      </div>
    </>
  )
}

/* ================================ trace pad ================================ */

function TracePad({
  char, grid, showModel, faint, onCount,
}: { char: string; grid: GridKind; showModel: boolean; faint: boolean; onCount: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [hasInk, setHasInk] = useState(false)

  const clear = () => {
    const c = canvasRef.current
    if (!c) return
    c.getContext('2d')!.clearRect(0, 0, c.width, c.height)
    setHasInk(false)
  }

  useEffect(() => { clear() }, [char, grid])

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!
    const r = c.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height }
  }

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const ctx = canvasRef.current!.getContext('2d')!
    const p = pos(e)
    // read the ink token so strokes stay visible in dark mode
    ctx.strokeStyle =
      getComputedStyle(document.documentElement).getPropertyValue('--color-ink').trim() || '#17313c'
    ctx.lineWidth = 9
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    drawing.current = true
    setHasInk(true)
  }

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const ctx = canvasRef.current!.getContext('2d')!
    const p = pos(e)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
  }

  return (
    <div>
      <div className="relative mx-auto aspect-square w-full max-w-[380px] overflow-hidden rounded-3xl border-[3px] border-ink bg-paper">
        <GridLines kind={grid} />
        {showModel ? (
          <div
            className={cx(
              'pointer-events-none absolute inset-0 flex select-none items-center justify-center font-cjk leading-none text-ink',
              faint ? 'opacity-[0.14]' : 'opacity-100',
            )}
            style={{ fontSize: '15rem' }}
            aria-hidden
          >
            {char}
          </div>
        ) : null}
        <canvas
          ref={canvasRef}
          width={760}
          height={760}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={() => { drawing.current = false }}
          onPointerLeave={() => { drawing.current = false }}
          className="absolute inset-0 h-full w-full touch-none"
        />
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <Button size="sm" variant="success" icon="check" disabled={!hasInk} onClick={() => { onCount(); clear() }}>
          Hitung 1 tulisan
        </Button>
        <Button size="sm" variant="secondary" icon="eraser" onClick={clear}>Hapus</Button>
      </div>
    </div>
  )
}

function GridLines({ kind }: { kind: GridKind }) {
  const dash = '6 8'
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden preserveAspectRatio="none">
      {kind === 'latin' ? (
        <g stroke="var(--color-sand)" strokeWidth="0.5">
          <line x1="0" y1="22" x2="100" y2="22" />
          <line x1="0" y1="42" x2="100" y2="42" strokeDasharray={dash} />
          <line x1="0" y1="70" x2="100" y2="70" strokeWidth="0.9" />
          <line x1="0" y1="88" x2="100" y2="88" strokeDasharray={dash} />
        </g>
      ) : kind === 'hangeul' ? (
        <g stroke="var(--color-sand)" strokeWidth="0.6" strokeDasharray={dash}>
          <line x1="50" y1="0" x2="50" y2="65" />
          <line x1="0" y1="65" x2="100" y2="65" />
        </g>
      ) : (
        <g stroke="var(--color-sand)" strokeWidth="0.6" strokeDasharray={dash}>
          <line x1="50" y1="0" x2="50" y2="100" />
          <line x1="0" y1="50" x2="100" y2="50" />
          {kind === 'mi' ? (
            <>
              <line x1="0" y1="0" x2="100" y2="100" />
              <line x1="100" y1="0" x2="0" y2="100" />
            </>
          ) : null}
        </g>
      )}
    </svg>
  )
}

/* ============================== error logger ============================== */

const KINDS = [
  { id: 'bentuk-mirip', label: 'Bentuk mirip', action: 'Latih berpasangan 3 hari' },
  { id: 'urutan-guratan', label: 'Urutan guratan', action: 'Kembali ke tahap 3 pelan, hitung bersuara' },
  { id: 'proporsi', label: 'Proporsi', action: 'Latih di kotak panduan, ukur perbandingannya' },
  { id: 'guratan-hilang', label: 'Guratan hilang/berlebih', action: 'Hitung guratan bersuara tiap menulis' },
  { id: 'lupa-total', label: 'Lupa total', action: 'Turunkan ke interval SRS sebelumnya' },
] as const

function ErrorLogger({
  char, lang, onLog,
}: {
  char: string; lang: LangId
  onLog: (e: { char: string; mistake: string; kind: (typeof KINDS)[number]['id']; lang: LangId; action: string }) => void
}) {
  const [open, setOpen] = useState(false)
  const [mistake, setMistake] = useState('')
  const [kind, setKind] = useState<(typeof KINDS)[number]['id']>('bentuk-mirip')

  if (!open) return <Button variant="amber" icon="doc" onClick={() => setOpen(true)}>Catat kesalahan</Button>

  const chosen = KINDS.find((k) => k.id === kind)!
  return (
    <div className="w-full rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
      <div className="mb-2 font-display text-[14px] font-extrabold text-ink">
        Catat kesalahan pada <span className="font-cjk text-[20px]">{char}</span>
      </div>
      <input
        value={mistake}
        onChange={(e) => setMistake(e.target.value)}
        placeholder="Apa yang salah? mis. “Ditulis seperti シ”"
        className="w-full rounded-xl border-2 border-sand bg-paper px-3 py-2.5 text-[14px] text-ink outline-none focus:border-amber-400"
      />
      <div className="mt-2 flex flex-wrap gap-1.5">
        {KINDS.map((k) => (
          <button
            key={k.id}
            onClick={() => setKind(k.id)}
            className={cx(
              'rounded-lg border-2 px-2.5 py-1 text-[11.5px] font-extrabold',
              kind === k.id ? 'border-amber-500 bg-paper text-amber-600' : 'border-sand bg-paper/70 text-ink-faint',
            )}
          >
            {k.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[12px] text-ink-soft">Tindakan: {chosen.action}</p>
      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          icon="check"
          disabled={!mistake.trim()}
          onClick={() => {
            onLog({ char, mistake: mistake.trim(), kind, lang, action: chosen.action })
            setMistake('')
            setOpen(false)
          }}
        >
          Simpan
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Batal</Button>
      </div>
    </div>
  )
}
