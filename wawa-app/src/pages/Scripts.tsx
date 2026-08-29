import { useEffect, useMemo, useState } from 'react'
import { Card, Chip, DataTable, Icon, SectionTitle, Tabs, cx, Callout } from '@/components/ui'
import {
  HIRAGANA, KATAKANA, KANJI_ORIGINS, RADICALS, JAMO_CONSONANTS, JAMO_VOWELS,
  CONFUSABLES, HANZI_EVOLUTION, JP_SCRIPT_TIMELINE, KR_SCRIPT_TIMELINE,
  SEJONG_QUOTE, RIKUSHO,
} from '@/data/scripts'
import type { ScriptChar } from '@/data/types'
import type { LangId } from '@/data/types'
import { useProgress } from '@/store/useProgress'
import { LANGUAGES } from '@/data/languages'
import { playSound } from '@/lib/sound'

type TabId = 'hiragana' | 'katakana' | 'kanji' | 'radikal' | 'hangeul' | 'alphabet' | 'sejarah'

const DEFAULT_TAB: Record<LangId, TabId> = { jp: 'hiragana', cn: 'kanji', kr: 'hangeul', en: 'alphabet' }

export default function Scripts() {
  const activeLang = useProgress((s) => s.activeLang)
  const lang = LANGUAGES[activeLang]
  const [tab, setTab] = useState<TabId>(() => DEFAULT_TAB[activeLang])
  const [picked, setPicked] = useState<ScriptChar | null>(null)
  const [query, setQuery] = useState('')

  const tabs = useMemo(() => {
    const history = { id: 'sejarah' as const, label: `Sejarah ${lang.name}`, icon: 'story' as const }
    if (activeLang === 'jp') return [
      { id: 'hiragana' as const, label: 'ひらがな', count: HIRAGANA.length },
      { id: 'katakana' as const, label: 'カタカナ', count: KATAKANA.length },
      { id: 'kanji' as const, label: '漢字 Kanji', count: KANJI_ORIGINS.length },
      history,
    ]
    if (activeLang === 'cn') return [
      { id: 'kanji' as const, label: '汉字 Hanzi', count: KANJI_ORIGINS.length },
      { id: 'radikal' as const, label: '部首 Radikal', count: RADICALS.length },
      history,
    ]
    if (activeLang === 'kr') return [
      { id: 'hangeul' as const, label: '한글 Hangeul', count: JAMO_CONSONANTS.length + JAMO_VOWELS.length },
      history,
    ]
    return [
      { id: 'alphabet' as const, label: 'Sound & spelling', count: 12 },
      history,
    ]
  }, [activeLang, lang.name])

  useEffect(() => {
    setTab(DEFAULT_TAB[activeLang])
    setPicked(null)
    setQuery('')
  }, [activeLang])

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow={`Mode ${lang.name} · konten terpisah`}
        title={activeLang === 'en' ? 'Bunyi & Ejaan Inggris' : `Penjelajah Aksara ${lang.name}`}
        sub={`Halaman ini hanya menampilkan sistem tulisan, sejarah, dan contoh yang relevan untuk ${lang.name}.`}
      />

      <Tabs tabs={tabs} value={tab} onChange={(v) => { setTab(v); setPicked(null) }} />

      {tab !== 'sejarah' && tab !== 'radikal' ? (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari huruf, romanisasi, atau arti…"
          className="w-full rounded-2xl border-2 border-sand bg-paper px-4 py-3 text-[15px] font-semibold text-ink outline-none placeholder:text-ink-faint focus:border-teal-400"
        />
      ) : null}

      {tab === 'hiragana' ? <KanaGrid chars={HIRAGANA} query={query} onPick={setPicked} accent="#e8564f" /> : null}
      {tab === 'katakana' ? <KanaGrid chars={KATAKANA} query={query} onPick={setPicked} accent="#e8564f" /> : null}
      {tab === 'kanji' ? <KanjiGrid query={query} onPick={setPicked} lang={activeLang === 'cn' ? 'cn' : 'jp'} /> : null}
      {tab === 'radikal' ? <RadicalList /> : null}
      {tab === 'hangeul' ? <HangeulView query={query} onPick={setPicked} /> : null}
      {tab === 'alphabet' ? <AlphabetView query={query} /> : null}
      {tab === 'sejarah' ? <HistoryView lang={activeLang} /> : null}

      {picked ? <CharDetail char={picked} onClose={() => setPicked(null)} /> : null}

      {tab === 'hiragana' || tab === 'katakana' ? <ConfusableCard lang="jp" /> : null}
      {tab === 'kanji' && activeLang === 'cn' ? <ConfusableCard lang="cn" /> : null}
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
            className="group rounded-2xl border-2 border-sand bg-paper px-1 py-3 text-center transition-colors hover:bg-cream"
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
function KanjiGrid({ query, onPick, lang }: { query: string; onPick: (c: ScriptChar) => void; lang: 'jp' | 'cn' }) {
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
              className="flex items-start gap-3 rounded-2xl border-2 border-sand bg-paper p-3.5 text-left transition-colors hover:bg-cream"
            >
              <span className="font-cjk text-[40px] leading-none text-ink">{k.char}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[14.5px] font-extrabold text-ink">{k.meaning}</span>
                <span className="block text-[12px] text-ink-faint">
                  {lang === 'cn' ? k.pinyin : `${k.onyomi} · ${k.kunyomi}`}
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
            { id: 'danger', label: 'Radikal berbahaya', icon: 'warning' as const, count: RADICALS.filter((r) => r.danger).length },
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
                r.danger ? 'border-coral-200 bg-coral-50' : 'border-sand bg-paper',
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
                  {r.danger}
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
                    className="rounded-2xl border-2 border-sand bg-paper px-1 py-3 text-center transition-colors hover:bg-cream"
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

/* ------------------------------ English sounds ------------------------------ */
const ENGLISH_SOUND_GROUPS = [
  { symbol: 'A', sound: '/æ/ · /eɪ/ · /ə/', examples: 'cat · name · about', trap: 'Satu huruf tidak selalu satu bunyi.' },
  { symbol: 'E', sound: '/e/ · /iː/ · diam', examples: 'bed · me · make', trap: 'Final -e sering tidak dibunyikan.' },
  { symbol: 'I', sound: '/ɪ/ · /aɪ/ · /i/', examples: 'sit · time · taxi', trap: '/ɪ/ bukan /i/ Indonesia.' },
  { symbol: 'O', sound: '/ɒ/ · /oʊ/ · /ə/', examples: 'hot · home · memory', trap: 'Vokal lemah sering berubah menjadi schwa.' },
  { symbol: 'U', sound: '/ʌ/ · /uː/ · /juː/', examples: 'cup · rule · use', trap: '/ʌ/ tidak sama dengan /a/ penuh.' },
  { symbol: 'TH', sound: '/θ/ · /ð/', examples: 'think · this', trap: 'Lidah menyentuh ringan di antara gigi.' },
  { symbol: 'SH', sound: '/ʃ/', examples: 'ship · nation', trap: 'Bunyi sama bisa punya ejaan berbeda.' },
  { symbol: 'CH', sound: '/tʃ/ · /k/ · /ʃ/', examples: 'chair · chemistry · machine', trap: 'Asal kata memengaruhi bunyinya.' },
  { symbol: 'OO', sound: '/uː/ · /ʊ/', examples: 'food · good', trap: 'Panjang-pendek mengubah kualitas vokal.' },
  { symbol: 'EA', sound: '/iː/ · /e/ · /eɪ/', examples: 'team · head · break', trap: 'Jangan menebak hanya dari huruf.' },
  { symbol: 'R', sound: '/r/', examples: 'right · carry', trap: 'Bukan getar /r/ seperti Bahasa Indonesia.' },
  { symbol: '-ED', sound: '/t/ · /d/ · /ɪd/', examples: 'walked · played · wanted', trap: 'Tentukan dari bunyi terakhir kata dasar.' },
]

function AlphabetView({ query }: { query: string }) {
  const q = query.trim().toLowerCase()
  const groups = ENGLISH_SOUND_GROUPS.filter((g) =>
    !q || [g.symbol, g.sound, g.examples, g.trap].join(' ').toLowerCase().includes(q),
  )
  return (
    <div className="space-y-4">
      <Callout kind="tip" title="Mode Inggris dimulai dari bunyi, bukan nama huruf">
        Alfabetnya sudah dikenal, tetapi hubungan huruf–bunyi tidak konsisten. Fokus di sini adalah pola
        ejaan yang paling sering mengecoh penutur Bahasa Indonesia.
      </Callout>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <Card key={g.symbol}>
            <div className="flex items-start gap-3">
              <span className="flex h-14 min-w-14 items-center justify-center rounded-2xl bg-leaf-50 px-3 font-display text-xl font-extrabold text-leaf-600">
                {g.symbol}
              </span>
              <div>
                <div className="font-mono text-[14px] font-bold text-ink">{g.sound}</div>
                <div className="mt-1 text-[13px] text-ink-soft">{g.examples}</div>
              </div>
            </div>
            <p className="mt-3 border-t-2 border-sand pt-3 text-[12.5px] leading-relaxed text-ink-faint">{g.trap}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------ History ------------------------------ */
const EN_SCRIPT_TIMELINE = [
  { period: 'abad 5 M', event: 'Alfabet Latin tiba bersama penutur Jermanik yang menulis Old English.' },
  { period: '1066', event: 'Penaklukan Norman memasukkan ribuan kata Prancis dan membuat ejaan makin berlapis.' },
  { period: 'abad 15–17', event: 'Great Vowel Shift mengubah bunyi vokal panjang, sementara banyak ejaan lama tetap dipertahankan.' },
  { period: '1476', event: 'Percetakan William Caxton membantu membakukan ejaan sebelum perubahan bunyi selesai.' },
  { period: 'hari ini', event: 'Ejaan Inggris menyimpan sejarah kata; bunyi harus dipelajari bersama contoh, bukan ditebak huruf demi huruf.' },
]

function HistoryView({ lang }: { lang: LangId }) {
  if (lang === 'kr') {
    return (
      <Card>
        <SectionTitle eyebrow="Korea" title="Sejarah Hangeul" />
        <Timeline items={KR_SCRIPT_TIMELINE} accent="#4a7fe0" />
        <div className="mt-5 rounded-3xl border-2 border-sky-200 bg-sky-50 p-5">
          <div className="mb-2 font-display text-[15px] font-extrabold text-ink">Kata pengantar Raja Sejong — 훈민정음</div>
          <pre className="overflow-x-auto whitespace-pre-wrap font-cjk text-[16px] leading-relaxed text-ink">{SEJONG_QUOTE.hanja}</pre>
          <p className="mt-3 text-[14px] italic leading-relaxed text-ink-soft">“{SEJONG_QUOTE.id}”</p>
        </div>
      </Card>
    )
  }
  if (lang === 'en') {
    return (
      <Card>
        <SectionTitle eyebrow="Inggris" title="Kenapa ejaannya tidak konsisten?" sub="Bunyinya terus berubah; banyak ejaannya membeku." />
        <Timeline items={EN_SCRIPT_TIMELINE} accent="#56bd3d" />
      </Card>
    )
  }
  return (
    <div className="space-y-5">
      <RikushoSection />

      {lang === 'cn' ? (
        <Card>
          <SectionTitle eyebrow="3.300 tahun" title="Evolusi Hanzi — lima tahap" />
          <DataTable
            head={['Tahap', 'Periode', 'Media', 'Ciri']}
            rows={HANZI_EVOLUTION.map((e) => [
              <span key="s">
                <span className="font-cjk text-[17px] font-bold text-ink">{e.stage}</span>
                <br />
                <span className="text-[11px] text-ink-faint">{e.name.split('—')[1]}</span>
              </span>,
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
      ) : null}

      {lang === 'jp' ? (
        <Card>
          <SectionTitle eyebrow="Jepang" title="Bagaimana aksara tiba di Jepang" />
          <Timeline items={JP_SCRIPT_TIMELINE} accent="#e8564f" />
        </Card>
      ) : null}
    </div>
  )
}

function RikushoSection() {
  const [expanded, setExpanded] = useState<string | null>('形声')

  const toggle = (name: string) => {
    playSound('tap')
    setExpanded((prev) => (prev === name ? null : name))
  }

  return (
    <Card>
      <SectionTitle
        eyebrow="六書 / 六书 · Enam Metode Pembentukan"
        title="Bagaimana Karakter Hanzi & Kanji Dibentuk"
        sub="Bilah persentase di bawah adalah proporsi sebaran populasi seluruh karakter di dunia nyata — 82% adalah rumus Makna + Bunyi."
      />

      {/* Visual Population Distribution Stack */}
      <div className="mb-4 rounded-2xl border-2 border-sand bg-cream p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon name="reference" size={17} className="text-teal-600" />
            <span className="font-display text-[14px] font-extrabold text-ink">
              Komposisi Sebaran Populasi Karakter
            </span>
          </div>
          <span className="text-[12px] font-extrabold text-teal-700">
            Klik kartu di bawah untuk bedah rumus
          </span>
        </div>

        <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
          Bilah persentase pada setiap kartu menunjukkan <strong>proporsi jumlah karakter</strong> yang dibentuk dengan metode tersebut di seluruh bahasa Mandarin/Jepang (bukan tingkat kemajuan akun belajar Anda).
        </p>

        <div className="mt-3 flex h-4 w-full overflow-hidden rounded-full border-2 border-sand bg-shell">
          <div style={{ width: '82%' }} className="bg-amber-400" title="形声 Fonosemantik (82%)" />
          <div style={{ width: '13%' }} className="bg-teal-400" title="会意 Ideogram Gabungan (13%)" />
          <div style={{ width: '4%' }} className="bg-sky-400" title="象形 Piktogram (4%)" />
          <div style={{ width: '1%' }} className="bg-leaf-400" title="指事 Ideogram Penunjuk (1%)" />
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4 text-[12px] font-bold text-ink-soft">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 shrink-0 rounded-full bg-amber-400" />
            <span>形声 Fonosemantik (<strong>82%</strong>)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 shrink-0 rounded-full bg-teal-400" />
            <span>会意 Gabungan (<strong>13%</strong>)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 shrink-0 rounded-full bg-sky-400" />
            <span>象形 Piktogram (<strong>4%</strong>)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 shrink-0 rounded-full bg-leaf-400" />
            <span>指事 Penunjuk (<strong>1%</strong>)</span>
          </div>
        </div>
      </div>

      {/* Interactive Rikusho Cards List */}
      <div className="space-y-3">
        {RIKUSHO.map((r) => {
          const isSelected = expanded === r.name
          return (
            <div
              key={r.name}
              className={cx(
                'rounded-2xl border-2 transition-all duration-200 overflow-hidden',
                isSelected
                  ? 'border-teal-500 bg-paper shadow-[0_4px_0_0_var(--color-teal-700)]'
                  : 'border-sand bg-paper hover:border-teal-300 hover:bg-cream/50 shadow-[0_2px_0_0_var(--color-drop)]',
              )}
            >
              {/* Clickable Header */}
              <button
                type="button"
                onClick={() => toggle(r.name)}
                className="w-full p-4 text-left select-none cursor-pointer"
                aria-expanded={isSelected}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-cjk text-[24px] font-bold text-ink">{r.name}</span>
                  <span className="text-[12.5px] font-bold text-ink-faint">{r.roman}</span>
                  <Chip size="sm" color={r.share >= 80 ? 'amber' : r.share > 0 ? 'teal' : 'ink'}>
                    {r.share > 0 ? `Porsi Populasi ±${r.share}%` : 'Sangat Langka'}
                  </Chip>

                  <div className="ml-auto flex items-center gap-2">
                    <span className="font-display text-[14px] font-extrabold text-ink hidden sm:inline">
                      {r.label}
                    </span>
                    <span
                      className={cx(
                        'flex h-7 w-7 items-center justify-center rounded-xl border-2 transition-transform duration-200',
                        isSelected ? 'border-teal-300 bg-teal-50 text-teal-700 rotate-180' : 'border-sand bg-shell text-ink-faint',
                      )}
                    >
                      <Icon name="down" size={15} />
                    </span>
                  </div>
                </div>

                <div className="mt-1 font-display text-[13.5px] font-extrabold text-teal-700 sm:hidden">
                  {r.label}
                </div>

                <p className="mt-1 text-[13.5px] text-ink-soft">{r.desc}</p>

                {/* Progress bar per card with explicit label */}
                {r.share > 0 ? (
                  <div className="mt-2.5">
                    <div className="mb-1 flex items-center justify-between text-[11px] font-bold text-ink-faint">
                      <span>Porsi dalam total karakter:</span>
                      <span className="font-mono font-extrabold text-ink-soft">{r.share}% dari seluruh aksara</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full border border-sand bg-shell">
                      <div
                        className={cx('h-full rounded-full transition-[width] duration-500', r.share >= 80 ? 'bg-amber-400' : 'bg-teal-400')}
                        style={{ width: `${r.share}%` }}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="mt-2.5 flex items-center justify-between text-[12.5px]">
                  <div className="font-cjk text-[16px] text-ink font-bold tracking-wider">{r.examples}</div>
                  <span className="flex items-center gap-1 font-extrabold text-teal-600 hover:underline">
                    <span>{isSelected ? 'Tutup Detail' : 'Buka Penjelasan & Rumus'}</span>
                    <Icon name={isSelected ? 'next' : 'down'} size={14} className={cx(isSelected && '-rotate-90')} />
                  </span>
                </div>
              </button>

              {/* Expanded Detail Panel */}
              {isSelected ? (
                <div className="border-t-2 border-sand bg-shell/60 p-4 space-y-4 text-[13.5px] animate-[wawa-rise_0.25s_ease-out]">
                  {/* Detailed Explanation */}
                  <div className="rounded-xl border-2 border-sand bg-paper p-3.5 leading-relaxed text-ink-soft">
                    <div className="mb-1.5 flex items-center gap-1.5 font-display text-[14px] font-extrabold text-ink">
                      <Icon name="info" size={16} className="text-teal-600" />
                      <span>Konsep & Cara Kerja:</span>
                    </div>
                    <p>{r.explanation}</p>
                    <div className="mt-2.5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/80 p-2.5 text-[12.5px] font-semibold text-amber-950 leading-relaxed">
                      <Icon name="tip" size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-950">Insight Pembelajaran:</strong> {r.keyInsight}
                      </div>
                    </div>
                  </div>

                  {/* Character Formula Breakdowns */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Icon name="search" size={16} className="text-teal-600" />
                        <span className="font-display text-[13.5px] font-extrabold text-ink">
                          Bedah Anatomi Contoh Karakter:
                        </span>
                      </div>
                      <span className="text-[11.5px] font-bold text-ink-faint">
                        {r.breakdowns.length} contoh dibedah
                      </span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {r.breakdowns.map((b) => (
                        <div key={b.char} className="rounded-xl border-2 border-sand bg-paper p-3 shadow-[0_2px_0_0_var(--color-drop)]">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-teal-200 bg-teal-50 font-cjk text-[22px] font-bold text-ink">
                              {b.char}
                            </span>
                            <div className="min-w-0">
                              <div className="font-display text-[13.5px] font-extrabold text-teal-700 truncate">
                                {b.meaning}
                              </div>
                              <div className="text-[11px] font-bold text-ink-faint truncate">
                                {b.formula}
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-[12px] leading-relaxed text-ink-soft">
                            {b.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </Card>
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
        className="anim-rise w-full max-w-lg rounded-3xl border-2 border-sand bg-paper p-6 shadow-[0_8px_0_0_var(--color-drop)]"
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
            className="rounded-xl border-2 border-sand bg-paper px-2.5 py-1.5 text-ink-faint"
          >
            <Icon name="close" size={18} />
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
