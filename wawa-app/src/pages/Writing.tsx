import { useEffect, useRef, useState } from 'react'
import { Wawa } from '@/brand/Wawa'
import { Button, Card, Chip, DataTable, SectionTitle, Tabs, cx, Callout, Stat } from '@/components/ui'
import { HIRAGANA, KATAKANA, KANJI_ORIGINS, JAMO_CONSONANTS, JAMO_VOWELS } from '@/data/scripts'
import { useProgress, useProblemChars } from '@/store/useProgress'
import type { LangId } from '@/data/types'

type GridKind = 'tian' | 'mi' | 'hangeul' | 'latin'
type Phase = 'idle' | 'slow' | 'normal' | 'dictation' | 'correct'

const PHASES: Record<Phase, { label: string; target: number; help: string; color: string }> = {
  idle: { label: 'Siap', target: 0, help: 'Pilih karakter lalu mulai protokol 3-7-D-K.', color: 'ink' },
  slow: { label: '3 — Pelan', target: 3, help: 'Tulis 3× SANGAT PELAN sambil MELIHAT contoh. Ucapkan nomor guratan bersuara: "satu, dua, tiga…"', color: 'sky' },
  normal: { label: '7 — Normal', target: 7, help: 'Tulis 7× dengan kecepatan normal, MASIH melihat contoh. Ucapkan bunyi/artinya, bukan nomor guratan.', color: 'teal' },
  dictation: { label: 'D — Dikte', target: 3, help: 'Contoh disembunyikan. Tulis dari INGATAN 3×. Ini tahap yang paling menentukan.', color: 'grape' },
  correct: { label: 'K — Koreksi', target: 0, help: 'Bandingkan dengan contoh. Lingkari yang salah, catat di Jurnal Kesalahan.', color: 'amber' },
}

export default function Writing() {
  const [script, setScript] = useState<'hiragana' | 'katakana' | 'kanji' | 'hangeul'>('hiragana')
  const [target, setTarget] = useState('あ')
  const [grid, setGrid] = useState<GridKind>('tian')
  const [phase, setPhase] = useState<Phase>('idle')
  const [reps, setReps] = useState(0)
  const [sessionChars, setSessionChars] = useState<string[]>([])

  const { logWriting, logError, errorJournal, clearError, writingSessions, activeLang } = useProgress()
  const problems = useProblemChars()

  const pool =
    script === 'hiragana' ? HIRAGANA
      : script === 'katakana' ? KATAKANA
        : script === 'kanji' ? KANJI_ORIGINS
          : [...JAMO_CONSONANTS, ...JAMO_VOWELS]

  useEffect(() => {
    setGrid(script === 'hangeul' ? 'hangeul' : script === 'kanji' ? 'mi' : 'tian')
    setTarget(pool[0].char)
    setPhase('idle')
    setReps(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [script])

  const hideModel = phase === 'dictation'
  const cfg = PHASES[phase]

  const nextPhase = () => {
    setReps(0)
    if (phase === 'idle') setPhase('slow')
    else if (phase === 'slow') setPhase('normal')
    else if (phase === 'normal') setPhase('dictation')
    else if (phase === 'dictation') setPhase('correct')
    else {
      // finished one character
      if (!sessionChars.includes(target)) setSessionChars((s) => [...s, target])
      logWriting(1, activeLang)
      setPhase('idle')
    }
  }

  const langOfScript: LangId = script === 'hangeul' ? 'kr' : script === 'kanji' ? 'jp' : 'jp'
  const todayWriting = writingSessions.filter((w) => w.date === new Date().toISOString().slice(0, 10))

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="Prinsip 3 — Motor Encoding"
        title="Latihan Menulis"
        sub="Protokol 3-7-D-K. Maksimal 10 repetisi, lalu WAJIB bandingkan dengan contoh — menulis 100× tanpa umpan balik hanya melatih kesalahan."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat icon="✍️" value={todayWriting.reduce((a, b) => a + b.chars, 0)} label="karakter hari ini" color="coral" />
        <Stat icon="📓" value={errorJournal.length} label="entri jurnal" color="amber" />
        <Stat icon="⚠️" value={problems.length} label="karakter bermasalah" color="grape" />
      </div>

      <Tabs
        tabs={[
          { id: 'hiragana' as const, label: 'ひらがな' },
          { id: 'katakana' as const, label: 'カタカナ' },
          { id: 'kanji' as const, label: '漢字 / 汉字' },
          { id: 'hangeul' as const, label: '한글' },
        ]}
        value={script}
        onChange={setScript}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* ---------------- canvas ---------------- */}
        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Chip color={cfg.color as 'teal'}>{cfg.label}</Chip>
              {cfg.target > 0 ? (
                <span className="font-display text-[14px] font-extrabold text-ink">
                  {reps} / {cfg.target}
                </span>
              ) : null}
            </div>
            <div className="flex gap-1.5">
              {(['tian', 'mi', 'hangeul', 'latin'] as GridKind[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGrid(g)}
                  className={cx(
                    'rounded-lg border-2 px-2.5 py-1 text-[11px] font-extrabold uppercase',
                    grid === g ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-sand bg-white text-ink-faint',
                  )}
                >
                  {g === 'tian' ? '田字格' : g === 'mi' ? '米字格' : g === 'hangeul' ? '한글' : 'Latin'}
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
            showModel={!hideModel && phase !== 'idle'}
            showModelFaint={phase === 'slow' || phase === 'normal'}
            onStrokeEnd={() => setReps((r) => r + 1)}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={nextPhase}
              disabled={cfg.target > 0 && reps < cfg.target}
              variant={phase === 'correct' ? 'success' : 'primary'}
            >
              {phase === 'idle' ? '▶ Mulai 3-7-D-K'
                : phase === 'correct' ? '✓ Selesaikan karakter'
                  : cfg.target > 0 && reps < cfg.target ? `Tulis ${cfg.target - reps}× lagi`
                    : 'Tahap berikutnya →'}
            </Button>
            <Button variant="secondary" onClick={() => { setPhase('idle'); setReps(0) }}>
              Ulang dari awal
            </Button>
            {phase === 'correct' ? (
              <ErrorLogger char={target} lang={langOfScript} onLog={logError} />
            ) : null}
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

        {/* ---------------- picker ---------------- */}
        <div className="space-y-4">
          <Card>
            <div className="mb-2 font-display text-[14px] font-extrabold text-ink">Pilih karakter</div>
            <div className="grid max-h-[320px] grid-cols-5 gap-1.5 overflow-y-auto pr-1">
              {pool.map((c) => (
                <button
                  key={c.char}
                  onClick={() => { setTarget(c.char); setPhase('idle'); setReps(0) }}
                  className={cx(
                    'rounded-xl border-2 py-2 font-cjk text-[22px] transition-colors',
                    target === c.char
                      ? 'border-teal-400 bg-teal-50 text-teal-700'
                      : 'border-sand bg-white text-ink hover:bg-cream',
                  )}
                >
                  {c.char}
                </button>
              ))}
            </div>
          </Card>

          {problems.length > 0 ? (
            <Card tone="cream" className="!border-coral-200">
              <div className="mb-2 flex items-center gap-2">
                <Wawa expression="thinking" size={44} cropped />
                <div className="font-display text-[14px] font-extrabold text-coral-600">
                  Karakter bermasalah
                </div>
              </div>
              <p className="mb-2 text-[12.5px] leading-relaxed text-ink-soft">
                Muncul 3× di jurnal → dilatih setiap hari selama seminggu penuh, tanpa peduli jadwal SRS-nya.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {problems.map((p) => (
                  <button
                    key={p.char}
                    onClick={() => { setTarget(p.char); setPhase('idle') }}
                    className="rounded-xl border-2 border-coral-300 bg-white px-3 py-1.5 font-cjk text-[20px] text-ink"
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

      {/* ---------------- error journal ---------------- */}
      <Card>
        <SectionTitle
          eyebrow="Bagian K menghasilkan data"
          title="Jurnal Kesalahan"
          sub="Data yang dihasilkan tahap koreksi harus dicatat, bukan dilupakan."
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
                className="text-[12px] font-bold text-ink-faint underline underline-offset-2"
              >
                hapus
              </button>,
            ])}
            dense
          />
        )}
      </Card>

      <Card>
        <SectionTitle eyebrow="Referensi" title="Jenis kesalahan & penanganannya" />
        <DataTable
          head={['Jenis', 'Ciri', 'Penanganan']}
          rows={[
            ['Bentuk mirip', 'Tertukar dengan karakter lain', 'Latih BERPASANGAN, jangan terpisah'],
            ['Urutan guratan', 'Hasil terlihat "aneh"', 'Kembali ke tahap 3 pelan dengan hitungan bersuara'],
            ['Proporsi', 'Guratan benar tapi bentuk timpang', 'Wajib pakai kotak panduan; ukur perbandingannya'],
            ['Guratan hilang/berlebih', 'Jumlah guratan salah', 'Hitung bersuara setiap kali menulis'],
            ['Lupa total', 'Tidak bisa recall sama sekali', 'Turunkan ke interval SRS sebelumnya'],
          ]}
          dense
        />
        <Callout kind="warning" title="Aturan jurnal">
          Karakter yang muncul <strong className="text-ink">3× di jurnal</strong> masuk daftar “karakter
          bermasalah” dan dilatih setiap hari selama seminggu penuh, tanpa peduli jadwal SRS-nya.
        </Callout>
      </Card>
    </div>
  )
}

/* ==================== Trace pad ==================== */
function TracePad({
  char, grid, showModel, showModelFaint, onStrokeEnd,
}: {
  char: string; grid: GridKind; showModel: boolean; showModelFaint: boolean; onStrokeEnd: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [hasInk, setHasInk] = useState(false)

  const clear = () => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')!
    ctx.clearRect(0, 0, c.width, c.height)
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
    ctx.strokeStyle = '#17313c'
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

  const end = () => { drawing.current = false }

  return (
    <div>
      <div className="relative mx-auto aspect-square w-full max-w-[380px] overflow-hidden rounded-3xl border-[3px] border-ink bg-white">
        <GridLines kind={grid} />
        {showModel ? (
          <div
            className={cx(
              'pointer-events-none absolute inset-0 flex items-center justify-center font-cjk leading-none text-ink select-none',
              showModelFaint ? 'opacity-15' : 'opacity-100',
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
          onPointerUp={end}
          onPointerLeave={end}
          className="absolute inset-0 h-full w-full touch-none"
        />
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <Button
          size="sm"
          variant="success"
          disabled={!hasInk}
          onClick={() => { onStrokeEnd(); clear() }}
        >
          ✓ Hitung 1 tulisan
        </Button>
        <Button size="sm" variant="secondary" onClick={clear}>Hapus</Button>
      </div>
    </div>
  )
}

function GridLines({ kind }: { kind: GridKind }) {
  const dash = '6 8'
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden preserveAspectRatio="none">
      {kind === 'latin' ? (
        <g stroke="#c9bfa8" strokeWidth="0.5">
          <line x1="0" y1="22" x2="100" y2="22" />
          <line x1="0" y1="42" x2="100" y2="42" strokeDasharray={dash} />
          <line x1="0" y1="70" x2="100" y2="70" strokeWidth="0.9" />
          <line x1="0" y1="88" x2="100" y2="88" strokeDasharray={dash} />
        </g>
      ) : kind === 'hangeul' ? (
        <g stroke="#c9bfa8" strokeWidth="0.5" strokeDasharray={dash}>
          <line x1="50" y1="0" x2="50" y2="65" />
          <line x1="0" y1="65" x2="100" y2="65" />
        </g>
      ) : (
        <g stroke="#c9bfa8" strokeWidth="0.5" strokeDasharray={dash}>
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

/* ==================== Error logger ==================== */
const KINDS = [
  { id: 'bentuk-mirip', label: 'Bentuk mirip', action: 'Latih berpasangan 3 hari' },
  { id: 'urutan-guratan', label: 'Urutan guratan', action: 'Kembali ke tahap 3 pelan, hitung bersuara' },
  { id: 'proporsi', label: 'Proporsi', action: 'Latih di 田字格, ukur perbandingannya' },
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

  if (!open) return <Button variant="amber" onClick={() => setOpen(true)}>📓 Catat kesalahan</Button>

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
        className="w-full rounded-xl border-2 border-sand bg-white px-3 py-2.5 text-[14px] outline-none focus:border-amber-400"
      />
      <div className="mt-2 flex flex-wrap gap-1.5">
        {KINDS.map((k) => (
          <button
            key={k.id}
            onClick={() => setKind(k.id)}
            className={cx(
              'rounded-lg border-2 px-2.5 py-1 text-[11.5px] font-extrabold',
              kind === k.id ? 'border-amber-500 bg-white text-amber-600' : 'border-sand bg-white/70 text-ink-faint',
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
