import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Wawa, type WawaExpression } from '@/brand/Wawa'
import { Button, Card, Chip, ProgressBar, SectionTitle, Stat, cx, EmptyState } from '@/components/ui'
import { LANGUAGES, langList } from '@/data/languages'
import { progressPct, gateStatus, allLessons } from '@/data/curriculum'
import { useProgress } from '@/store/useProgress'
import { gateScore } from '@/lib/scoring'
import { todayISO, addDays } from '@/lib/srs'

const EXPRESSIONS: WawaExpression[] = ['happy', 'excited', 'wave', 'teach', 'thinking', 'celebrate', 'love', 'wow', 'sleep', 'sad']

export default function Profile() {
  const s = useProgress()
  const [confirmReset, setConfirmReset] = useState(false)

  const totalLessons = s.languages.reduce((n, l) => n + allLessons(l).length, 0)
  const doneLessons = Object.keys(s.completed).length
  const avg = (arr: number[]) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0)

  // last 12 weeks of activity, as a contribution-style grid
  const days: { date: string; xp: number }[] = []
  for (let i = 83; i >= 0; i--) {
    const d = addDays(todayISO(), -i)
    days.push({ date: d, xp: s.xpByDay[d] ?? 0 })
  }

  return (
    <div className="space-y-5">
      {/* ---------------- identity ---------------- */}
      <Card className="!p-0 overflow-hidden">
        <div className="grid md:grid-cols-[auto_1fr]">
          <div className="flex items-center justify-center bg-cream p-6 md:w-[240px]">
            <Wawa expression={s.streak > 6 ? 'celebrate' : 'happy'} size={170} accent={LANGUAGES[s.activeLang].color} />
          </div>
          <div className="p-6">
            <h1 className="text-3xl">{s.name || 'Pelajar'}</h1>
            <p className="mt-1 text-[14px] text-ink-soft">
              Belajar sejak {s.lastActiveDate ? 'aktif hari ini' : 'baru mulai'} · target {s.dailyGoalMin} menit/hari
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <Stat icon="⚡" value={s.xp} label="total XP" color="teal" />
              <Stat icon="🔥" value={s.streak} label="beruntun" color="amber" />
              <Stat icon="🏆" value={s.bestStreak} label="rekor" color="coral" />
              <Stat icon="📘" value={`${doneLessons}/${totalLessons || '—'}`} label="pelajaran" color="leaf" />
            </div>
          </div>
        </div>
      </Card>

      {/* ---------------- activity grid ---------------- */}
      <Card>
        <SectionTitle eyebrow="12 minggu terakhir" title="Kartu kemajuan" sub="Satu kotak = satu hari. Jumat konsolidasi, Minggu libur." />
        <div className="overflow-x-auto pb-1">
          <div className="grid grid-flow-col grid-rows-7 gap-1" style={{ width: 'max-content' }}>
            {days.map((d) => {
              const level = d.xp === 0 ? 0 : d.xp < 15 ? 1 : d.xp < 40 ? 2 : d.xp < 80 ? 3 : 4
              const shades = ['bg-shell border-sand', 'bg-teal-100 border-teal-200', 'bg-teal-200 border-teal-300', 'bg-teal-400 border-teal-500', 'bg-teal-500 border-teal-700']
              return (
                <span
                  key={d.date}
                  title={`${d.date} · ${d.xp} XP`}
                  className={cx('h-4 w-4 rounded-[5px] border-2', shades[level])}
                />
              )
            })}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11.5px] font-bold text-ink-faint">
          <span>Sedikit</span>
          {['bg-shell border-sand', 'bg-teal-100 border-teal-200', 'bg-teal-200 border-teal-300', 'bg-teal-400 border-teal-500', 'bg-teal-500 border-teal-700'].map((c) => (
            <span key={c} className={cx('h-3.5 w-3.5 rounded-[4px] border-2', c)} />
          ))}
          <span>Banyak</span>
        </div>
      </Card>

      {/* ---------------- per language ---------------- */}
      <Card>
        <SectionTitle eyebrow="Kemajuan" title="Per bahasa" />
        {s.languages.length === 0 ? (
          <EmptyState
            title="Belum ada bahasa aktif"
            body="Pilih satu bahasa untuk mulai membuka jalur belajarnya."
            action={<Link to="/belajar/jp"><Button>Mulai Jepang</Button></Link>}
          />
        ) : (
          <div className="space-y-3">
            {s.languages.map((id) => {
              const l = LANGUAGES[id]
              const pct = progressPct(id, s.completed)
              const gs = gateStatus(id, s.completed)
              const sk = s.skillScores[id]
              const g = gateScore({
                menyimak: avg(sk.menyimak), membaca: avg(sk.membaca),
                menulis: avg(sk.menulis), berbicara: avg(sk.berbicara),
              })
              return (
                <div key={id} className="rounded-2xl border-2 p-4" style={{ borderColor: l.color, backgroundColor: l.colorSoft }}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-2xl" aria-hidden>{l.flag}</span>
                    <span className="font-display text-[16px] font-extrabold text-ink">{l.name}</span>
                    <span className="font-cjk text-[14px] text-ink-soft">{l.nativeName}</span>
                    <Chip size="sm" color="ink">{gs.filter((x) => x.unlocked).length}/6 gerbang</Chip>
                    <Link
                      to={`/belajar/${id}`}
                      className="ml-auto text-[13px] font-extrabold underline underline-offset-4"
                      style={{ color: l.color }}
                    >
                      Buka →
                    </Link>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <ProgressBar value={pct} height={12} color="leaf" />
                    <span className="shrink-0 font-display text-[13px] font-extrabold text-ink">{pct}%</span>
                  </div>
                  {g.score > 0 ? (
                    <div className="mt-2 text-[12.5px] text-ink-soft">
                      Nilai gerbang <strong className="text-ink">{g.score}%</strong> · terlemah:{' '}
                      <strong className="text-coral-600 capitalize">{g.weakest}</strong> (rata-rata {g.average}%)
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-4">
          <div className="mb-2 text-[12px] font-extrabold uppercase tracking-wide text-ink-faint">
            Tambah bahasa
          </div>
          <div className="flex flex-wrap gap-2">
            {langList()
              .filter((l) => !s.languages.includes(l.id))
              .map((l) => (
                <button
                  key={l.id}
                  onClick={() => s.setActiveLang(l.id)}
                  className="flex items-center gap-2 rounded-2xl border-2 border-sand bg-white px-3.5 py-2 text-[13.5px] font-extrabold text-ink hover:bg-cream"
                >
                  <span aria-hidden>{l.flag}</span> {l.name}
                </button>
              ))}
            {s.languages.length === 4 ? (
              <span className="text-[13px] text-ink-faint">Semua bahasa sudah aktif 🎉</span>
            ) : null}
          </div>
          <p className="mt-2 text-[12.5px] text-ink-faint">
            Aturan emas: jangan mulai dua bahasa baru di gerbang yang sama. Bahasa kedua baru boleh dimulai
            saat bahasa pertama sudah melewati Gerbang 3.
          </p>
        </div>
      </Card>

      {/* ---------------- settings ---------------- */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle eyebrow="Pengaturan" title="Target harian" />
          <div className="flex flex-wrap gap-2">
            {[15, 30, 60, 120].map((m) => (
              <button
                key={m}
                onClick={() => s.setDailyGoal(m)}
                className={cx(
                  'rounded-2xl border-2 px-4 py-2.5 font-display text-[15px] font-extrabold',
                  s.dailyGoalMin === m ? 'border-teal-500 bg-teal-500 text-white' : 'border-sand bg-white text-ink-faint',
                )}
              >
                {m} menit
              </button>
            ))}
          </div>

          <div className="mt-5">
            <div className="mb-2 text-[12px] font-extrabold uppercase tracking-wide text-ink-faint">Nyawa</div>
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl font-extrabold text-ink">{s.hearts}/5</span>
              <Button size="sm" variant="secondary" onClick={s.refillHearts}>Isi ulang</Button>
            </div>
            <p className="mt-1.5 text-[12.5px] text-ink-faint">
              Nyawa terisi otomatis setiap hari. Habisnya nyawa berarti materinya belum menempel — baca ulang
              materinya, itu bagian dari metodenya.
            </p>
          </div>
        </Card>

        <Card>
          <SectionTitle eyebrow="Wawa" title="Semua ekspresi maskot" />
          <div className="flex flex-wrap justify-center gap-1">
            {EXPRESSIONS.map((e) => (
              <div key={e} className="w-[74px] text-center">
                <Wawa expression={e} size={74} accent={LANGUAGES[s.activeLang].color} />
                <div className="-mt-1 text-[10px] font-bold uppercase text-ink-faint">{e}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card tone="cream" className="!border-coral-200">
        <SectionTitle eyebrow="Zona berbahaya" title="Reset semua kemajuan" />
        <p className="mb-3 text-[13.5px] text-ink-soft">
          Menghapus XP, streak, dek SRS, jurnal kesalahan, dan seluruh riwayat pelajaran. Tidak bisa dibatalkan.
        </p>
        {confirmReset ? (
          <div className="flex flex-wrap gap-2">
            <Button variant="danger" onClick={() => { s.reset(); location.href = '/' }}>
              Ya, hapus semuanya
            </Button>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>Batal</Button>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setConfirmReset(true)}>Reset kemajuan…</Button>
        )}
      </Card>
    </div>
  )
}
