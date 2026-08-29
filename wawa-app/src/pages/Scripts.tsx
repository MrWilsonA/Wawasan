import { useMemo, useState } from 'react'
import { Card, Chip, DataTable, SectionTitle, Tabs, cx, Callout } from '@/components/ui'
import { Wawa } from '@/brand/Wawa'
import {
  HIRAGANA, KATAKANA, KANJI_ORIGINS, RADICALS, JAMO_CONSONANTS, JAMO_VOWELS,
  CONFUSABLES, HANZI_EVOLUTION, JP_SCRIPT_TIMELINE, KR_SCRIPT_TIMELINE,
  SEJONG_QUOTE, RIKUSHO,
} from '@/data/scripts'
import type { ScriptChar } from '@/data/types'

type TabId = 'hiragana' | 'katakana' | 'kanji' | 'radikal' | 'hangeul' | 'sejarah'

export default function Scripts() {
  const [tab, setTab] = useState<TabId>('hiragana')
  const [picked, setPicked] = useState<ScriptChar | null>(null)
  const [query, setQuery] = useState('')

  const tabs = [
    { id: 'hiragana' as const, label: 'ひらがな', count: HIRAGANA.length },
    { id: 'katakana' as const, label: 'カタカナ', count: KATAKANA.length },
    { id: 'kanji' as const, label: '漢字 asal-usul', count: KANJI_ORIGINS.length },
    { id: 'radikal' as const, label: '部首 radikal', count: RADICALS.length },
    { id: 'hangeul' as const, label: '한글', count: JAMO_CONSONANTS.length + JAMO_VOWELS.length },
    { id: 'sejarah' as const, label: '📜 Sejarah' },
  ]

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="Prinsip 2 — Aksara lewat cerita"
        title="Penjelajah Aksara"
        sub="Setiap huruf punya bagian “Dari Mana Asalnya?”. Karakter yang punya cerita bertahan di memori 5–10× lebih lama."
      />

      <Tabs tabs={tabs} value={tab} onChange={(v) => { setTab(v); setPicked(null) }} />

      {tab !== 'sejarah' && tab !== 'radikal' ? (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari huruf, romanisasi, atau arti…"
          className="w-full rounded-2xl border-2 border-sand bg-white px-4 py-3 text-[15px] font-semibold text-ink outline-none placeholder:text-ink-faint focus:border-teal-400"
        />
      ) : null}

      {tab === 'hiragana' ? <KanaGrid chars={HIRAGANA} query={query} onPick={setPicked} accent="#e8564f" /> : null}
      {tab === 'katakana' ? <KanaGrid chars={KATAKANA} query={query} onPick={setPicked} accent="#e8564f" /> : null}
      {tab === 'kanji' ? <KanjiGrid query={query} onPick={setPicked} /> : null}
      {tab === 'radikal' ? <RadicalList /> : null}
      {tab === 'hangeul' ? <HangeulView query={query} onPick={setPicked} /> : null}
      {tab === 'sejarah' ? <HistoryView /> : null}

      {picked ? <CharDetail char={picked} onClose={() => setPicked(null)} /> : null}

      {tab === 'hiragana' || tab === 'katakana' ? <ConfusableCard lang="jp" /> : null}
      {tab === 'radikal' ? <ConfusableCard lang="cn" /> : null}
      {tab === 'hangeul' ? <ConfusableCard lang="kr" /> : null}
    </div>
  )
}

/* ------------------------------ Kana grid ------------------------------ */
function KanaGrid({
  chars, query, onPick, accent,
}: { chars: ScriptChar[]; query: string; onPick: (c: ScriptChar) => void; accent: string }) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return chars
    return chars.filter(
      (c) => c.char.includes(q) || (c.roman ?? '').toLowerCase().includes(q) ||
        (c.from ?? '').includes(q) || (c.fromMeaning ?? '').toLowerCase().includes(q),
    )
  }, [chars, query])

  return (
    <Card>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
        {filtered.map((c) => (
          <button
            key={c.char}
            onClick={() => onPick(c)}
            className="group rounded-2xl border-2 border-sand bg-white px-1 py-3 text-center transition-colors hover:bg-cream"
          >
            <div className="font-cjk text-[30px] leading-none text-ink">{c.char}</div>
            <div className="mt-1.5 text-[11px] font-extrabold uppercase text-ink-faint">{c.roman}</div>
            {c.from ? (
              <div className="mt-1 font-cjk text-[13px] leading-none" style={{ color: accent }}>
                ← {c.from}
              </div>
            ) : null}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-[14px] text-ink-faint">Tidak ada yang cocok dengan “{query}”.</p>
      ) : null}
    </Card>
  )
}

/* ------------------------------ Kanji grid ------------------------------ */
function KanjiGrid({ query, onPick }: { query: string; onPick: (c: ScriptChar) => void }) {
  const [group, setGroup] = useState<string>('semua')
  const groups = ['semua', ...new Set(KANJI_ORIGINS.map((k) => k.group!))]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return KANJI_ORIGINS.filter((k) => {
      if (group !== 'semua' && k.group !== group) return false
      if (!q) return true
      return k.char.includes(q) || (k.meaning ?? '').toLowerCase().includes(q) ||
        (k.onyomi ?? '').toLowerCase().includes(q) || (k.kunyomi ?? '').toLowerCase().includes(q) ||
        (k.pinyin ?? '').toLowerCase().includes(q) || (k.story ?? '').toLowerCase().includes(q)
    })
  }, [query, group])

  return (
    <>
      <div className="mb-3">
        <Tabs
          size="sm"
          tabs={groups.map((g) => ({ id: g, label: g === 'semua' ? 'Semua' : g }))}
          value={group}
          onChange={setGroup}
        />
      </div>
      <Card>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((k) => (
            <button
              key={k.char}
              onClick={() => onPick(k)}
              className="flex items-start gap-3 rounded-2xl border-2 border-sand bg-white p-3.5 text-left transition-colors hover:bg-cream"
            >
              <span className="font-cjk text-[40px] leading-none text-ink">{k.char}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[14.5px] font-extrabold text-ink">{k.meaning}</span>
                <span className="block text-[12px] text-ink-faint">
                  {k.onyomi} · {k.kunyomi}
                </span>
                <span className="mt-1 block line-clamp-2 text-[12px] leading-snug text-ink-soft">{k.story}</span>
              </span>
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-[14px] text-ink-faint">Tidak ada yang cocok.</p>
        ) : null}
      </Card>
    </>
  )
}

/* ------------------------------ Radicals ------------------------------ */
function RadicalList() {
  const [onlyDanger, setOnlyDanger] = useState(false)
  const list = onlyDanger ? RADICALS.filter((r) => r.danger) : RADICALS

  return (
    <>
      <Callout kind="tip" title="Tiga langkah menebak kanji/hanzi asing">
        <strong className="text-ink">① Radikal apa?</strong> 氵 = AIR ·{' '}
        <strong className="text-ink">② Sisanya apa?</strong> 胡 = dibaca “ko” ·{' '}
        <strong className="text-ink">③ Kesimpulan:</strong> sesuatu berhubungan air, dibaca “ko” → 湖 = DANAU ✅
        <br />
        Tingkat keberhasilan menebak bidang makna: <strong className="text-ink">±70%</strong>. Ini bukan
        tebak-tebakan — ini membaca desain sistemnya.
      </Callout>

      <div className="my-3">
        <Tabs
          size="sm"
          tabs={[
            { id: 'all', label: `Semua radikal`, count: RADICALS.length },
            { id: 'danger', label: '⚠️ Radikal berbahaya', count: RADICALS.filter((r) => r.danger).length },
          ]}
          value={onlyDanger ? 'danger' : 'all'}
          onChange={(v) => setOnlyDanger(v === 'danger')}
        />
      </div>

      <Card>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {list.map((r) => (
            <div
              key={r.radical}
              className={cx(
                'rounded-2xl border-2 p-3.5',
                r.danger ? 'border-coral-200 bg-coral-50' : 'border-sand bg-white',
              )}
            >
              <div className="flex items-baseline gap-2.5">
                <span className="font-cjk text-[30px] leading-none text-ink">{r.radical}</span>
                <span className="min-w-0">
                  <span className="block font-display text-[14px] font-extrabold text-ink">{r.meaning}</span>
                  <span className="block text-[11.5px] text-ink-faint">dari {r.full}</span>
                </span>
              </div>
              <div className="mt-2 font-cjk text-[16px] text-ink-soft">{r.examples}</div>
              {r.danger ? (
                <div className="mt-2 border-t-2 border-coral-200 pt-2 text-[12.5px] leading-relaxed text-coral-600">
                  ⚠️ {r.danger}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

/* ------------------------------ Hangeul ------------------------------ */
function HangeulView({ query, onPick }: { query: string; onPick: (c: ScriptChar) => void }) {
  const q = query.trim().toLowerCase()
  const match = (c: ScriptChar) =>
    !q || c.char.includes(q) || (c.roman ?? '').toLowerCase().includes(q) || (c.story ?? '').toLowerCase().includes(q)

  const groups = [
    { title: 'Konsonan dasar — gambar organ bicara', items: JAMO_CONSONANTS.filter((c) => c.group === 'Dasar') },
    { title: 'Konsonan beraspirasi 격음 — +guratan = +hembusan', items: JAMO_CONSONANTS.filter((c) => c.group === 'Aspirasi') },
    { title: 'Konsonan tegang 경음 — huruf digandakan', items: JAMO_CONSONANTS.filter((c) => c.group === 'Tegang') },
    { title: 'Vokal dasar — 천 · 지 · 인', items: JAMO_VOWELS.filter((c) => c.group === 'Dasar') },
    { title: 'Vokal gabungan', items: JAMO_VOWELS.filter((c) => c.group === 'Gabungan') },
  ]

  return (
    <>
      <Callout kind="story" title="Aksara yang dirancang, bukan diwariskan">
        Hangeul unik di antara semua sistem tulisan besar dunia: ia tidak berevolusi, ia{' '}
        <strong className="text-ink">dirancang</strong> — oleh orang yang diketahui namanya (Raja Sejong,
        1443), pada tanggal yang diketahui, dengan alasan yang tertulis jelas. Bentuk hurufnya{' '}
        <strong className="text-ink">menggambarkan posisi organ bicara</strong>.
      </Callout>

      <div className="mt-4 space-y-4">
        {groups.map((g) => {
          const items = g.items.filter(match)
          if (!items.length) return null
          return (
            <Card key={g.title}>
              <h3 className="mb-3 font-display text-[15px] font-extrabold text-ink">{g.title}</h3>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                {items.map((c) => (
                  <button
                    key={c.char}
                    onClick={() => onPick(c)}
                    className="rounded-2xl border-2 border-sand bg-white px-1 py-3 text-center transition-colors hover:bg-cream"
                  >
                    <div className="font-cjk text-[30px] leading-none text-ink">{c.char}</div>
                    <div className="mt-1.5 text-[11px] font-extrabold uppercase text-ink-faint">{c.roman}</div>
                  </button>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </>
  )
}

/* ------------------------------ History ------------------------------ */
function HistoryView() {
  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle
          eyebrow="六書 / 六书"
          title="Enam cara karakter dibentuk"
          sub="Angka 82% adalah informasi paling berharga di seluruh modul aksara."
        />
        <div className="space-y-2.5">
          {RIKUSHO.map((r) => (
            <div key={r.name} className="rounded-2xl border-2 border-sand bg-white p-3.5">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-cjk text-[22px] font-bold text-ink">{r.name}</span>
                <span className="text-[12px] font-bold text-ink-faint">{r.roman}</span>
                <Chip size="sm" color={r.share >= 80 ? 'amber' : 'ink'}>
                  {r.share > 0 ? `±${r.share}%` : 'langka'}
                </Chip>
                <span className="ml-auto font-display text-[14px] font-extrabold text-ink">{r.label}</span>
              </div>
              <p className="mt-1.5 text-[13.5px] text-ink-soft">{r.desc}</p>
              <div className="mt-1.5 font-cjk text-[17px] text-ink-soft">{r.examples}</div>
              {r.share > 0 ? (
                <div className="mt-2 h-2.5 overflow-hidden rounded-full border-2 border-sand bg-shell">
                  <div
                    className={cx('h-full rounded-full', r.share >= 80 ? 'bg-amber-300' : 'bg-teal-300')}
                    style={{ width: `${r.share}%` }}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle eyebrow="3.300 tahun" title="Evolusi Hanzi — lima tahap" />
        <DataTable
          head={['Tahap', 'Periode', 'Media', 'Ciri']}
          rows={HANZI_EVOLUTION.map((e) => [
            <span key="s"><span className="font-cjk text-[17px] font-bold text-ink">{e.stage}</span><br /><span className="text-[11px] text-ink-faint">{e.name.split('—')[1]}</span></span>,
            e.period,
            e.medium,
            e.trait,
          ])}
          dense
        />
        <Callout kind="warning" title="隶变 lìbiàn — kenapa banyak hanzi tidak mirip apa pun">
          Di tahap 隶书 (±200 SM), karakter berhenti menjadi gambar dan menjadi simbol. Bentuk diluruskan
          demi kecepatan tulis dengan kuas di bambu. Kalau sebagian karakter terasa “tidak mirip apa pun”,
          itu <strong className="text-ink">bukan karena Anda kurang imajinatif</strong> — kemiripannya
          memang hilang 2.200 tahun lalu, secara sengaja.
        </Callout>
      </Card>

      <Card>
        <SectionTitle eyebrow="Jepang" title="Bagaimana aksara tiba di Jepang" />
        <Timeline items={JP_SCRIPT_TIMELINE} accent="#e8564f" />
      </Card>

      <Card>
        <SectionTitle eyebrow="Korea" title="Sejarah Hangeul" />
        <Timeline items={KR_SCRIPT_TIMELINE} accent="#4a7fe0" />
        <div className="mt-5 rounded-3xl border-2 border-kr bg-sky-50 p-5" style={{ borderColor: '#4a7fe0' }}>
          <div className="mb-2 font-display text-[15px] font-extrabold text-ink">
            Kata pengantar Raja Sejong — 훈민정음
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap font-cjk text-[16px] leading-relaxed text-ink">
            {SEJONG_QUOTE.hanja}
          </pre>
          <p className="mt-3 border-t-2 border-white pt-3 text-[14px] italic leading-relaxed text-ink-soft">
            “{SEJONG_QUOTE.id}”
          </p>
          <div className="mt-3 flex items-start gap-3 rounded-2xl border-2 border-white bg-white/70 p-3">
            <Wawa expression="teach" size={56} accent="#4a7fe0" cropped className="shrink-0" />
            <p className="text-[13px] leading-relaxed text-ink-soft">{SEJONG_QUOTE.note}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function Timeline({ items, accent }: { items: { period: string; event: string }[]; accent: string }) {
  return (
    <ol className="relative space-y-3 border-l-4 pl-5" style={{ borderColor: accent + '44' }}>
      {items.map((t) => (
        <li key={t.period} className="relative">
          <span
            className="absolute -left-[29px] top-1.5 h-3.5 w-3.5 rounded-full border-[3px] border-white"
            style={{ backgroundColor: accent }}
            aria-hidden
          />
          <div className="font-display text-[13.5px] font-extrabold" style={{ color: accent }}>{t.period}</div>
          <p className="text-[13.5px] leading-relaxed text-ink-soft">{t.event}</p>
        </li>
      ))}
    </ol>
  )
}

/* ------------------------------ Detail ------------------------------ */
function CharDetail({ char, onClose }: { char: ScriptChar; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="anim-rise w-full max-w-lg rounded-3xl border-2 border-sand bg-white p-6 shadow-[0_8px_0_0_rgba(23,49,60,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border-2 border-sand bg-cream px-5 py-3">
            <div className="font-cjk text-[62px] leading-none text-ink">{char.char}</div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-xl font-extrabold text-ink">{char.meaning ?? char.roman}</div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {char.roman ? <Chip size="sm" color="teal">{char.roman}</Chip> : null}
              {char.onyomi ? <Chip size="sm" color="coral">音 {char.onyomi}</Chip> : null}
              {char.kunyomi ? <Chip size="sm" color="amber">訓 {char.kunyomi}</Chip> : null}
              {char.pinyin ? <Chip size="sm" color="amber">{char.pinyin}</Chip> : null}
              {char.strokes ? <Chip size="sm" color="ink">{char.strokes} guratan</Chip> : null}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-xl border-2 border-sand bg-white px-2.5 py-1.5 text-ink-faint"
          >
            ✕
          </button>
        </div>

        {char.from ? (
          <div className="mt-4 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
            <div className="mb-1 font-display text-[13px] font-extrabold uppercase tracking-wide text-amber-600">
              Dari mana asalnya?
            </div>
            <div className="font-cjk text-[24px] text-ink">{char.from}</div>
            {char.fromMeaning ? (
              <div className="mt-1 text-[13.5px] text-ink-soft">{char.fromMeaning}</div>
            ) : null}
          </div>
        ) : null}

        {char.story ? (
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">{char.story}</p>
        ) : null}
      </div>
    </div>
  )
}

/* ------------------------------ Confusables ------------------------------ */
function ConfusableCard({ lang }: { lang: 'jp' | 'cn' | 'kr' }) {
  const pairs = CONFUSABLES[lang]
  return (
    <Card>
      <SectionTitle
        eyebrow="Jurnal kesalahan"
        title="Pasangan yang paling sering tertukar"
        sub="Karakter mirip dilatih BERPASANGAN, jangan terpisah — itu satu-satunya cara yang bekerja."
      />
      <div className="grid gap-2.5 sm:grid-cols-2">
        {pairs.map((p) => (
          <div key={p.a + p.b} className="rounded-2xl border-2 border-sand bg-cream p-3.5">
            <div className="flex items-center gap-3">
              <span className="font-cjk text-[26px] font-bold text-ink">{p.a}</span>
              <span className="text-ink-faint" aria-hidden>vs</span>
              <span className="font-cjk text-[26px] font-bold text-ink">{p.b}</span>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{p.key}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
