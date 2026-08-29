import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Wawa } from '@/brand/Wawa'
import { Button, Card, Chip, DataTable, EmptyState, ProgressBar, SectionTitle, Stat, cx } from '@/components/ui'
import { LANGUAGES } from '@/data/languages'
import { useProgress, useDueCards } from '@/store/useProgress'
import { INTERVALS, stageLabel, forecast, todayISO } from '@/lib/srs'

export default function Review() {
  const due = useDueCards()
  const { deck, reviewCard, activeLang } = useProgress()
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(0)
  const [startCount] = useState(due.length)

  const l = LANGUAGES[activeLang]
  const item = due[idx]

  const rate = (rating: 'lupa' | 'susah' | 'gampang') => {
    if (!item) return
    reviewCard(item.state.id, rating)
    setDone((d) => d + 1)
    setFlipped(false)
    // the store re-filters `due`, so the queue shrinks under us — stay at 0
    setIdx(0)
  }

  if (Object.keys(deck).length === 0) {
    return (
      <div className="space-y-5">
        <SectionTitle
          eyebrow="Spaced Repetition"
          title="Kartu Ulang"
          sub="Interval tetap 1 – 3 – 7 – 16 – 35 – 90 hari, sesuai kurikulum."
        />
        <EmptyState
          title="Dek masih kosong"
          body="Kartu terisi otomatis setiap kali kamu lulus sebuah unit dengan nilai ≥85%. Selesaikan unit pertama dulu."
          action={<Link to={`/belajar/${activeLang}`}><Button size="lg">Buka jalur belajar</Button></Link>}
        />
        <LadderCard />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="space-y-5">
        <div className="py-8 text-center">
          <Wawa expression="celebrate" size={200} accent={l.color} className="mx-auto anim-pop" />
          <h1 className="mt-4 text-3xl">Semua kartu selesai! 🎉</h1>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-ink-soft">
            {done > 0
              ? `${done} kartu diulang hari ini. Kartu berikutnya akan muncul sesuai jadwalnya.`
              : 'Tidak ada kartu jatuh tempo hari ini. Istirahat itu bagian dari SRS.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            <Link to={`/belajar/${activeLang}`}><Button size="lg">Lanjut belajar</Button></Link>
            <Link to="/menulis"><Button size="lg" variant="secondary">✍️ Latihan menulis</Button></Link>
          </div>
        </div>
        <DeckStats />
        <LadderCard />
      </div>
    )
  }

  const progress = startCount > 0 ? (done / startCount) * 100 : 0

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center gap-3">
        <Link
          to="/"
          aria-label="Keluar"
          className="rounded-xl border-2 border-sand bg-white px-3 py-2 text-lg leading-none text-ink-faint shadow-[0_3px_0_0_#e8e1d0]"
        >
          ✕
        </Link>
        <div className="flex-1"><ProgressBar value={progress} height={16} color="grape" /></div>
        <Chip color="grape">{due.length} tersisa</Chip>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b-2 border-sand bg-cream px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span aria-hidden>{LANGUAGES[item.card.lang].flag}</span>
            <Chip size="sm" color="ink">{item.card.tag}</Chip>
          </div>
          <div className="flex items-center gap-2">
            {item.state.flagged ? <Chip size="sm" color="coral">⚠ bermasalah</Chip> : null}
            <Chip size="sm" color="grape">{stageLabel(item.state.stage)}</Chip>
          </div>
        </div>

        <button
          onClick={() => setFlipped(true)}
          disabled={flipped}
          className="flex min-h-[260px] w-full flex-col items-center justify-center px-6 py-10 text-center"
        >
          <div className="font-cjk text-[38px] leading-tight text-ink sm:text-[46px]">{item.card.front}</div>
          {item.card.reading ? (
            <div className="mt-2 text-[15px] font-bold text-ink-faint">{item.card.reading}</div>
          ) : null}

          {flipped ? (
            <div className="anim-rise mt-6 w-full border-t-2 border-dashed border-sand pt-6">
              <div className="text-[19px] font-bold leading-relaxed text-ink-soft">{item.card.back}</div>
              {item.card.hint ? (
                <div className="mt-2 text-[13.5px] text-ink-faint">{item.card.hint}</div>
              ) : null}
            </div>
          ) : (
            <div className="mt-8 text-[13px] font-extrabold uppercase tracking-widest text-ink-faint">
              Ketuk untuk membalik
            </div>
          )}
        </button>
      </Card>

      <div className="mt-4">
        {!flipped ? (
          <Button full size="lg" onClick={() => setFlipped(true)}>Tampilkan jawaban</Button>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            <Button variant="danger" size="lg" onClick={() => rate('lupa')}>
              Lupa
            </Button>
            <Button variant="amber" size="lg" onClick={() => rate('susah')}>
              Susah
            </Button>
            <Button variant="success" size="lg" onClick={() => rate('gampang')}>
              Gampang
            </Button>
          </div>
        )}
        {flipped ? (
          <p className="mt-3 text-center text-[12.5px] text-ink-faint">
            Lupa = turun dua anak tangga · Susah = ulang interval yang sama · Gampang = naik satu tangga
          </p>
        ) : null}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function DeckStats() {
  const deck = useProgress((s) => s.deck)
  const cards = Object.values(deck)
  const fc = forecast(cards, 14)
  const mature = cards.filter((c) => c.stage >= 4).length
  const young = cards.filter((c) => c.stage >= 1 && c.stage < 4).length
  const fresh = cards.filter((c) => c.stage === 0).length

  return (
    <Card>
      <SectionTitle eyebrow="Dek" title="Statistik" />
      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        <Stat icon="🃏" value={cards.length} label="total kartu" color="grape" />
        <Stat icon="🌱" value={fresh} label="baru" color="teal" />
        <Stat icon="🌿" value={young} label="muda (H+1–16)" color="amber" />
        <Stat icon="🌳" value={mature} label="matang (H+35+)" color="leaf" />
      </div>

      <div className="flex h-32 items-end gap-1.5">
        {fc.map((f) => {
          const max = Math.max(1, ...fc.map((x) => x.count))
          return (
            <div key={f.date} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-extrabold text-ink-faint">{f.count || ''}</span>
              <div
                className={cx(
                  'w-full rounded-t-md border-2 border-b-0',
                  f.date === todayISO() ? 'border-coral-400 bg-coral-300' : 'border-grape-300 bg-grape-200',
                )}
                style={{ height: `${Math.max(4, (f.count / max) * 84)}px` }}
              />
              <span className="text-[9px] font-bold text-ink-faint">{f.date.slice(8)}</span>
            </div>
          )
        })}
      </div>
      <p className="mt-2 text-center text-[12px] font-bold uppercase tracking-wide text-ink-faint">
        Perkiraan 14 hari ke depan
      </p>
    </Card>
  )
}

function LadderCard() {
  return (
    <Card>
      <SectionTitle
        eyebrow="Prinsip 5"
        title="Tangga interval"
        sub="Interval sengaja tetap, bukan adaptif — supaya latihan di aplikasi dan di kertas jatuh di hari yang sama."
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {INTERVALS.map((d, i) => (
          <span key={d} className="contents">
            <span className="rounded-2xl border-2 border-grape-200 bg-grape-50 px-3.5 py-2 font-display text-[15px] font-extrabold text-grape-600">
              H+{d}
            </span>
            {i < INTERVALS.length - 1 ? <span className="text-ink-faint" aria-hidden>→</span> : null}
          </span>
        ))}
      </div>
      <DataTable
        head={['Pengulangan ke-', 'Hari', 'Volume latihan menulis']}
        rows={[
          ['1', 'H+1', 'Dikte saja (3×)'],
          ['2', 'H+3', 'Dikte saja (3×)'],
          ['3', 'H+7', 'Dikte saja (2×)'],
          ['4', 'H+16', 'Dikte dalam KATA, bukan karakter tunggal'],
          ['5', 'H+35', 'Dikte dalam KALIMAT'],
          ['6', 'H+90', 'Dikte dalam KALIMAT'],
        ]}
        dense
      />
    </Card>
  )
}
