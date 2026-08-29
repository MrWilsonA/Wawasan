import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Wawa, type WawaExpression } from '@/brand/Wawa'
import { Button, Card, Chip, Icon, FlagIcon, ProgressBar, SectionTitle, Stat, cx } from '@/components/ui'
import { LANGUAGES, LANG_ORDER } from '@/data/languages'
import { tint } from '@/lib/tint'
import { progressPct, gateStatus, allLessons } from '@/data/curriculum'
import { useProgress } from '@/store/useProgress'
import { useAudio, getCurrentTrack } from '@/store/useAudio'
import { playSound, type SoundName } from '@/lib/sound'
import { gateScore } from '@/lib/scoring'
import { todayISO, addDays } from '@/lib/srs'

const EXPRESSIONS: WawaExpression[] = ['happy', 'excited', 'wave', 'teach', 'thinking', 'celebrate', 'love', 'wow', 'sleep', 'sad']

export default function Profile() {
  const s = useProgress()
  const [confirmReset, setConfirmReset] = useState(false)

  const {
    bgmEnabled,
    bgmVolume,
    sfxEnabled,
    sfxVolume,
    isPlaying,
    currentTrackId,
    toggleBgm,
    setBgmEnabled,
    setBgmVolume,
    setSfxEnabled,
    setSfxVolume,
  } = useAudio()

  const track = getCurrentTrack(currentTrackId)
  const bgmPct = Math.round(bgmVolume * 100)
  const sfxPct = Math.round(sfxVolume * 100)

  const totalLessons = LANG_ORDER.reduce((n, l) => n + allLessons(l).length, 0)
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
              <Stat icon="xp" value={s.xp} label="total XP" color="teal" />
              <Stat icon="streak" value={s.streak} label="beruntun" color="amber" />
              <Stat icon="trophy" value={s.bestStreak} label="rekor" color="coral" />
              <Stat icon="words" value={`${doneLessons}/${totalLessons || '—'}`} label="pelajaran" color="leaf" />
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
        <div className="space-y-3">
          {LANG_ORDER.map((id) => {
            const l = LANGUAGES[id]
            const pct = progressPct(id, s.completed)
            const gs = gateStatus(id, s.completed)
            const sk = s.skillScores[id]
            const g = gateScore({
              menyimak: avg(sk.menyimak),
              membaca: avg(sk.membaca),
              menulis: avg(sk.menulis),
              berbicara: avg(sk.berbicara),
            })
            return (
              <div key={id} className="rounded-2xl border-2 p-4" style={{ borderColor: l.color, backgroundColor: tint(l.color) }}>
                <div className="flex flex-wrap items-center gap-2">
                  <FlagIcon lang={id} size={26} />
                  <span className="font-display text-[16px] font-extrabold text-ink">{l.name}</span>
                  <span className="font-cjk text-[14px] text-ink-soft">{l.nativeName}</span>
                  <Chip size="sm" color="ink">{gs.filter((x) => x.unlocked).length}/{gs.length} level</Chip>
                  <Link
                    to={`/belajar/${id}`}
                    className="ml-auto text-[13px] font-extrabold underline underline-offset-4"
                    style={{ color: l.color }}
                  >
                    Buka <Icon name="right" size={14} className="inline" />
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
      </Card>

      {/* ---------------- sound & music settings ---------------- */}
      <Card>
        <SectionTitle
          eyebrow="Audio & Suara"
          title="Pengaturan Musik & Efek Suara"
          sub="Atur musik latar relaksasi saat belajar serta volume efek bunyi interaksi."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {/* Background Music Card */}
          <div className="rounded-2xl border-2 border-teal-200 bg-teal-50/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={cx(
                    'flex h-10 w-10 items-center justify-center rounded-2xl border-2 transition-colors',
                    isPlaying
                      ? 'border-teal-400 bg-teal-500 text-white shadow-[0_2px_0_0_var(--color-teal-700)]'
                      : 'border-teal-200 bg-paper text-teal-600',
                  )}
                >
                  <Icon name="music" size={20} />
                </div>
                <div>
                  <div className="font-display text-[16px] font-extrabold text-ink leading-tight">Musik Latar (BGM)</div>
                  <div className="text-[12px] text-ink-soft">Lagu fokus & relaksasi</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playSound('tap')
                  setBgmEnabled(!bgmEnabled)
                }}
                className={cx(
                  'rounded-full border-2 px-3 py-1 text-[12px] font-extrabold transition-all select-none',
                  bgmEnabled
                    ? 'border-teal-600 bg-teal-500 text-white shadow-[0_2px_0_0_var(--color-teal-700)]'
                    : 'border-sand bg-paper text-ink-faint',
                )}
              >
                {bgmEnabled ? 'Aktif' : 'Mati'}
              </button>
            </div>

            {/* Track Info Box */}
            <div className="mt-4 rounded-xl border-2 border-teal-200/80 bg-paper p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 font-display text-[14px] font-extrabold text-ink">
                    <Icon name="disc" size={15} className={cx(isPlaying ? 'animate-[spin_3s_linear_infinite] text-teal-600' : 'text-ink-faint')} />
                    <span className="truncate">{track.title}</span>
                  </div>
                  <div className="text-[11.5px] text-ink-soft truncate">{track.subtitle}</div>
                </div>

                <Button
                  size="sm"
                  variant={isPlaying ? 'primary' : 'secondary'}
                  icon={isPlaying ? 'pause' : 'play'}
                  onClick={() => {
                    playSound('tap')
                    toggleBgm()
                  }}
                >
                  {isPlaying ? 'Jeda' : 'Putar'}
                </Button>
              </div>
            </div>

            {/* BGM Volume Slider */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-[13px]">
                <span className="font-bold text-ink-soft">Volume Musik</span>
                <span className="font-mono font-extrabold text-teal-700">{bgmEnabled ? `${bgmPct}%` : 'Mati'}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={bgmEnabled ? bgmPct : 0}
                onChange={(e) => {
                  const val = Number(e.target.value) / 100
                  setBgmVolume(val)
                  if (!bgmEnabled && val > 0) setBgmEnabled(true)
                }}
                className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-paper accent-teal-500 border border-teal-200"
              />
              <div className="mt-2 flex justify-between gap-1">
                {[15, 35, 60, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => {
                      playSound('tap')
                      setBgmVolume(pct / 100)
                      if (!bgmEnabled) setBgmEnabled(true)
                    }}
                    className={cx(
                      'rounded-lg border px-2 py-0.5 text-[11px] font-bold transition-all',
                      bgmEnabled && bgmPct === pct
                        ? 'border-teal-500 bg-teal-500 text-white'
                        : 'border-teal-200 bg-paper text-ink-soft hover:bg-teal-100/50',
                    )}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sound Effects Card */}
          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-amber-200 bg-paper text-amber-600">
                  <Icon name="sound" size={20} />
                </div>
                <div>
                  <div className="font-display text-[16px] font-extrabold text-ink leading-tight">Efek Suara (SFX)</div>
                  <div className="text-[12px] text-ink-soft">Bunyi interaksi & jawaban kuis</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSfxEnabled(!sfxEnabled)
                  if (!sfxEnabled) playSound('tap')
                }}
                className={cx(
                  'rounded-full border-2 px-3 py-1 text-[12px] font-extrabold transition-all select-none',
                  sfxEnabled
                    ? 'border-amber-600 bg-amber-400 text-ink shadow-[0_2px_0_0_var(--color-amber-600)]'
                    : 'border-sand bg-paper text-ink-faint',
                )}
              >
                {sfxEnabled ? 'Aktif' : 'Mati'}
              </button>
            </div>

            {/* SFX Volume Slider */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-[13px]">
                <span className="font-bold text-ink-soft">Volume Efek</span>
                <span className="font-mono font-extrabold text-amber-700">{sfxEnabled ? `${sfxPct}%` : 'Mati'}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={sfxEnabled ? sfxPct : 0}
                onChange={(e) => {
                  const val = Number(e.target.value) / 100
                  setSfxVolume(val)
                  if (!sfxEnabled && val > 0) setSfxEnabled(true)
                }}
                className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-paper accent-amber-500 border border-amber-200"
              />
              <div className="mt-2 flex justify-between gap-1">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => {
                      setSfxVolume(pct / 100)
                      if (!sfxEnabled) setSfxEnabled(true)
                      playSound('tap')
                    }}
                    className={cx(
                      'rounded-lg border px-2 py-0.5 text-[11px] font-bold transition-all',
                      sfxEnabled && sfxPct === pct
                        ? 'border-amber-500 bg-amber-400 text-ink'
                        : 'border-amber-200 bg-paper text-ink-soft hover:bg-amber-100/50',
                    )}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Test SFX Buttons */}
            <div className="mt-4 rounded-xl border-2 border-amber-200/80 bg-paper p-3">
              <div className="mb-2 text-[12px] font-extrabold text-ink">Uji Coba Efek Suara:</div>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {[
                  { name: 'tap' as SoundName, label: 'Ketuk', color: 'bg-shell hover:bg-cream border-sand text-ink-soft' },
                  { name: 'correct' as SoundName, label: 'Benar', color: 'bg-leaf-50 hover:bg-leaf-100 border-leaf-200 text-leaf-700' },
                  { name: 'wrong' as SoundName, label: 'Salah', color: 'bg-coral-50 hover:bg-coral-100 border-coral-200 text-coral-700' },
                  { name: 'levelComplete' as SoundName, label: 'Selesai', color: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700' },
                ].map((btn) => (
                  <button
                    key={btn.name}
                    type="button"
                    onClick={() => playSound(btn.name)}
                    className={cx('rounded-xl border-2 px-2 py-1.5 text-center text-[11.5px] font-extrabold transition-transform active:translate-y-[1px]', btn.color)}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ---------------- daily goal & avatar settings ---------------- */}
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
                  s.dailyGoalMin === m ? 'border-teal-500 bg-teal-500 text-white' : 'border-sand bg-paper text-ink-faint',
                )}
              >
                {m} menit
              </button>
            ))}
          </div>

          <p className="mt-5 rounded-2xl border-2 border-teal-200 bg-teal-50 p-3 text-[12.5px] leading-relaxed text-ink-soft">
            Jawaban salah tetap dicatat sebagai bahan evaluasi. Anda dapat mengulang pelajaran kapan saja
            tanpa batas dan tanpa kehilangan akses belajar.
          </p>
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

      {/* ---------------- danger zone ---------------- */}
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
