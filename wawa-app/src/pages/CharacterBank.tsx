import { useEffect, useMemo, useState, useDeferredValue } from 'react'
import {
  Button, Card, Chip, FlagIcon, Icon, SearchInput, Spinner, cx, Callout,
} from '@/components/ui'
import {
  loadKanji, loadHanzi, searchKanji, searchHanzi,
  KANJI_GRADES, KANJI_JLPT, HSK_LEVELS,
  type KanjiEntry, type HanziEntry,
} from '@/data/charBank'
import { StrokeOrder } from '@/components/StrokeOrder'
import { useProgress } from '@/store/useProgress'
import { LANGUAGES } from '@/data/languages'
import { tint } from '@/lib/tint'
import { Navigate } from 'react-router-dom'

type Sort = 'freq' | 'strokes' | 'level'

export default function CharacterBank() {
  const activeLang = useProgress((s) => s.activeLang)
  if (activeLang !== 'jp' && activeLang !== 'cn') return <Navigate to="/aksara" replace />
  const lang = LANGUAGES[activeLang]
  const isJapanese = activeLang === 'jp'

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden !p-0">
        <div className="absolute inset-y-0 right-0 w-44 opacity-20" style={{ backgroundColor: lang.color }} />
        <div className="relative flex flex-wrap items-center gap-5 p-6">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl font-cjk text-[42px] font-bold"
            style={{ backgroundColor: tint(lang.color, 22), color: lang.color }}
          >
            {isJapanese ? '漢' : '汉'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink-faint">
              <FlagIcon lang={activeLang} size={22} /> Mode {lang.name} · Bank karakter khusus
            </div>
            <h1 className="text-3xl text-ink">{isJapanese ? 'Bank Kanji Jepang' : 'Bank Hanzi Mandarin'}</h1>
            <p className="mt-1 max-w-2xl text-[14px] leading-relaxed text-ink-soft">
              {isJapanese
                ? '2.136 kanji jōyō dengan bacaan on’yomi, kun’yomi, tingkat sekolah, JLPT indikatif, dan urutan guratan.'
                : '3.000 hanzi HSK 3.0 dengan pinyin, arti, tingkat HSK, pencarian nada, dan urutan guratan.'}
            </p>
          </div>
          <div className="rounded-2xl border-2 border-sand bg-paper/80 px-5 py-3 text-center">
            <div className="font-display text-2xl font-extrabold" style={{ color: lang.color }}>{isJapanese ? '2.136' : '3.000'}</div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-ink-faint">karakter</div>
          </div>
        </div>
      </Card>

      {isJapanese ? <KanjiBank /> : <HanziBank />}
    </div>
  )
}

/* ================================ KANJI ================================ */

function KanjiBank() {
  const [all, setAll] = useState<KanjiEntry[] | null>(null)
  const [q, setQ] = useState('')
  const [grade, setGrade] = useState<string>('all')
  const [jlpt, setJlpt] = useState<string>('all')
  const [sort, setSort] = useState<Sort>('freq')
  const [picked, setPicked] = useState<KanjiEntry | null>(null)
  const [limit, setLimit] = useState(180)
  const dq = useDeferredValue(q)

  useEffect(() => { loadKanji().then(setAll) }, [])

  const filtered = useMemo(() => {
    if (!all) return []
    let out = all
    if (grade !== 'all') out = out.filter((k) => String(k.g) === grade)
    if (jlpt !== 'all') out = out.filter((k) => String(k.j) === jlpt)
    out = searchKanji(out, dq)
    const sorted = [...out]
    if (sort === 'strokes') sorted.sort((a, b) => (a.s ?? 99) - (b.s ?? 99))
    else if (sort === 'level') sorted.sort((a, b) => a.g - b.g || (a.f ?? 9e4) - (b.f ?? 9e4))
    else sorted.sort((a, b) => (a.f ?? 9e4) - (b.f ?? 9e4))
    return sorted
  }, [all, grade, jlpt, dq, sort])

  useEffect(() => { setLimit(180) }, [dq, grade, jlpt, sort])

  if (!all) return <LoadingCard label="Memuat 2.136 kanji…" />

  return (
    <>
      <Card className="space-y-3">
        <SearchInput value={q} onChange={setQ} placeholder="Cari kanji, on'yomi, kun'yomi, atau arti (mis. “water”, “ミズ”, 水)…" />

        <FilterRow label="Tingkat sekolah">
          <FilterChip active={grade === 'all'} onClick={() => setGrade('all')}>Semua</FilterChip>
          {KANJI_GRADES.map((g) => (
            <FilterChip key={g.id} active={grade === g.id} onClick={() => setGrade(g.id)} title={g.hint}>
              {g.label}
            </FilterChip>
          ))}
        </FilterRow>

        <FilterRow label="Tingkat JLPT (indikatif — JLPT tidak lagi menerbitkan daftar resmi)">
          <FilterChip active={jlpt === 'all'} onClick={() => setJlpt('all')}>Semua</FilterChip>
          {KANJI_JLPT.map((j) => (
            <FilterChip key={j.id} active={jlpt === j.id} onClick={() => setJlpt(j.id)} title={j.hint}>
              {j.label}
            </FilterChip>
          ))}
        </FilterRow>

        <FilterRow label="Urutkan">
          <FilterChip active={sort === 'freq'} onClick={() => setSort('freq')}>Frekuensi</FilterChip>
          <FilterChip active={sort === 'strokes'} onClick={() => setSort('strokes')}>Jumlah guratan</FilterChip>
          <FilterChip active={sort === 'level'} onClick={() => setSort('level')}>Tingkat</FilterChip>
        </FilterRow>

        <ResultCount n={filtered.length} total={all.length} />
      </Card>

      <CharGrid
        items={filtered.slice(0, limit)}
        keyOf={(k) => k.c}
        onPick={setPicked}
        render={(k) => (
          <>
            <div className="font-cjk text-[34px] leading-none text-ink">{k.c}</div>
            <div className="mt-1 truncate text-[10.5px] font-bold text-ink-faint">{k.m[0]}</div>
            <div className="text-[9.5px] font-extrabold uppercase text-teal-600">
              {k.s ? `${k.s} guratan` : ''}
            </div>
          </>
        )}
      />

      <MoreButton shown={Math.min(limit, filtered.length)} total={filtered.length} onMore={() => setLimit((l) => l + 300)} />

      {picked ? <KanjiDetail k={picked} onClose={() => setPicked(null)} /> : null}
    </>
  )
}

function KanjiDetail({ k, onClose }: { k: KanjiEntry; onClose: () => void }) {
  const seedCards = useProgress((s) => s.seedCards)
  const [added, setAdded] = useState(false)

  const add = () => {
    seedCards([{
      id: `kanji-${k.c}`,
      front: k.c,
      back: `${k.m.join(', ')}\n音 ${k.on.join('・') || '—'} · 訓 ${k.kun.join('・') || '—'}`,
      reading: k.on[0] ?? k.kun[0],
      lang: 'jp',
      tag: 'Kanji',
    }])
    setAdded(true)
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex items-start gap-4">
        <StrokeOrder char={k.c} lang="jp" size={128} />
        <div className="min-w-0 flex-1">
          <div className="font-display text-xl font-extrabold text-ink">{k.m.slice(0, 3).join(', ')}</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Chip size="sm" color="ink">Kelas {k.g === 8 ? 'SMP–SMA' : k.g}</Chip>
            {k.j ? <Chip size="sm" color="coral">JLPT N{k.j}</Chip> : null}
            {k.s ? <Chip size="sm" color="teal">{k.s} guratan</Chip> : null}
            {k.f ? <Chip size="sm" color="amber">peringkat #{k.f}</Chip> : null}
          </div>
        </div>
        <CloseButton onClose={onClose} />
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        <ReadingBox label="音読み On'yomi" values={k.on} hint="Muncul saat kanji menempel kanji lain" tone="coral" />
        <ReadingBox label="訓読み Kun'yomi" values={k.kun} hint="Muncul saat berdiri sendiri / + hiragana" tone="teal" />
      </div>

      {k.m.length > 3 ? (
        <div className="mt-3 rounded-2xl border-2 border-sand bg-cream p-3 text-[13.5px] text-ink-soft">
          <strong className="text-ink">Arti lain:</strong> {k.m.slice(3).join(', ')}
        </div>
      ) : null}

      <Button full className="mt-4" variant={added ? 'success' : 'primary'} icon={added ? 'check' : 'plus'} onClick={add} disabled={added}>
        {added ? 'Sudah masuk dek SRS' : 'Tambahkan ke dek SRS'}
      </Button>
    </Modal>
  )
}

/* ================================ HANZI ================================ */

function HanziBank() {
  const [all, setAll] = useState<HanziEntry[] | null>(null)
  const [q, setQ] = useState('')
  const [level, setLevel] = useState('all')
  const [picked, setPicked] = useState<HanziEntry | null>(null)
  const [limit, setLimit] = useState(180)
  const dq = useDeferredValue(q)

  useEffect(() => { loadHanzi().then(setAll) }, [])

  const filtered = useMemo(() => {
    if (!all) return []
    let out = all
    if (level !== 'all') out = out.filter((h) => h.lv === level)
    return searchHanzi(out, dq)
  }, [all, level, dq])

  useEffect(() => { setLimit(180) }, [dq, level])

  if (!all) return <LoadingCard label="Memuat 3.000 hanzi…" />

  return (
    <>
      <Card className="space-y-3">
        <SearchInput value={q} onChange={setQ} placeholder="Cari hanzi, pinyin (dengan atau tanpa nada), atau arti (mis. “shui”, “water”, 水)…" />

        <FilterRow label="Tingkat HSK 3.0">
          <FilterChip active={level === 'all'} onClick={() => setLevel('all')}>Semua</FilterChip>
          {HSK_LEVELS.map((l) => (
            <FilterChip key={l.id} active={level === l.id} onClick={() => setLevel(l.id)} title={l.hint}>
              {l.label}
            </FilterChip>
          ))}
        </FilterRow>

        <ResultCount n={filtered.length} total={all.length} />
      </Card>

      <CharGrid
        items={filtered.slice(0, limit)}
        keyOf={(h) => h.c}
        onPick={setPicked}
        render={(h) => (
          <>
            <div className="font-cjk text-[34px] leading-none text-ink">{h.c}</div>
            <div className="mt-1 truncate text-[11px] font-extrabold text-cn">{h.p}</div>
            <div className="truncate text-[9.5px] font-bold text-ink-faint">{h.m.split(/[,;]/)[0]}</div>
          </>
        )}
      />

      <MoreButton shown={Math.min(limit, filtered.length)} total={filtered.length} onMore={() => setLimit((l) => l + 300)} />

      {picked ? <HanziDetail h={picked} onClose={() => setPicked(null)} /> : null}
    </>
  )
}

function HanziDetail({ h, onClose }: { h: HanziEntry; onClose: () => void }) {
  const seedCards = useProgress((s) => s.seedCards)
  const [added, setAdded] = useState(false)

  const add = () => {
    seedCards([{ id: `hanzi-${h.c}`, front: h.c, back: h.m, reading: h.p, lang: 'cn', tag: `HSK ${h.lv}` }])
    setAdded(true)
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex items-start gap-4">
        <StrokeOrder char={h.c} lang="cn" size={128} />
        <div className="min-w-0 flex-1">
          <div className="font-display text-2xl font-extrabold text-cn">{h.p}</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Chip size="sm" color="amber">HSK {h.lv}</Chip>
          </div>
        </div>
        <CloseButton onClose={onClose} />
      </div>

      <div className="mt-4 rounded-2xl border-2 border-sand bg-cream p-3.5 text-[14.5px] leading-relaxed text-ink-soft">
        {h.m || 'Definisi tidak tersedia di Unihan untuk karakter ini.'}
      </div>

      <Button full className="mt-4" variant={added ? 'success' : 'primary'} icon={added ? 'check' : 'plus'} onClick={add} disabled={added}>
        {added ? 'Sudah masuk dek SRS' : 'Tambahkan ke dek SRS'}
      </Button>
    </Modal>
  )
}

/* ============================== shared bits ============================== */

function LoadingCard({ label }: { label: string }) {
  return (
    <Card className="flex flex-col items-center gap-3 py-14">
      <Spinner size={28} className="text-teal-500" />
      <span className="text-[14px] font-bold text-ink-soft">{label}</span>
    </Card>
  )
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-ink-faint">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function FilterChip({
  active, onClick, title, children,
}: { active: boolean; onClick: () => void; title?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={cx(
        'rounded-xl border-2 px-3 py-1.5 text-[12.5px] font-extrabold transition-colors',
        active ? 'border-teal-500 bg-teal-500 text-white' : 'border-sand bg-paper text-ink-soft hover:bg-cream',
      )}
    >
      {children}
    </button>
  )
}

function ResultCount({ n, total }: { n: number; total: number }) {
  return (
    <div className="flex items-center gap-2 text-[12.5px] font-bold text-ink-faint">
      <Icon name="filter" size={14} />
      {n.toLocaleString('id-ID')} dari {total.toLocaleString('id-ID')} karakter
    </div>
  )
}

function CharGrid<T>({
  items, keyOf, onPick, render,
}: { items: T[]; keyOf: (t: T) => string; onPick: (t: T) => void; render: (t: T) => React.ReactNode }) {
  if (!items.length) {
    return (
      <Card className="py-12 text-center text-[14px] text-ink-faint">
        Tidak ada karakter yang cocok. Coba kata kunci lain.
      </Card>
    )
  }
  return (
    <Card>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9">
        {items.map((it) => (
          <button
            key={keyOf(it)}
            onClick={() => onPick(it)}
            className="group relative overflow-hidden rounded-2xl border-2 border-sand bg-paper px-1 py-3 text-center shadow-[0_3px_0_0_var(--color-drop)] transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-cream hover:shadow-[0_5px_0_0_var(--color-drop)] active:translate-y-0.5 active:shadow-none"
          >
            {render(it)}
          </button>
        ))}
      </div>
    </Card>
  )
}

function MoreButton({ shown, total, onMore }: { shown: number; total: number; onMore: () => void }) {
  if (shown >= total) return null
  return (
    <div className="flex justify-center">
      <Button variant="secondary" icon="down" onClick={onMore}>
        Tampilkan lebih banyak ({shown.toLocaleString('id-ID')} / {total.toLocaleString('id-ID')})
      </Button>
    </div>
  )
}

function ReadingBox({
  label, values, hint, tone,
}: { label: string; values: string[]; hint: string; tone: 'coral' | 'teal' }) {
  return (
    <div className={cx('rounded-2xl border-2 p-3.5', tone === 'coral' ? 'border-coral-200 bg-coral-50' : 'border-teal-200 bg-teal-50')}>
      <div className={cx('text-[11px] font-extrabold uppercase tracking-wide', tone === 'coral' ? 'text-coral-600' : 'text-teal-700')}>
        {label}
      </div>
      <div className="mt-1 font-cjk text-[19px] font-bold text-ink">{values.length ? values.join('・') : '—'}</div>
      <div className="mt-1 text-[11.5px] leading-snug text-ink-soft">{hint}</div>
    </div>
  )
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button onClick={onClose} aria-label="Tutup" className="rounded-xl border-2 border-sand bg-paper px-2.5 py-1.5 text-ink-faint hover:bg-cream">
      <Icon name="close" size={18} />
    </button>
  )
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="anim-rise max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border-2 border-sand bg-paper p-6 shadow-[0_8px_0_0_var(--color-drop)]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export { Modal, CloseButton, LoadingCard, FilterRow, FilterChip, Callout }
