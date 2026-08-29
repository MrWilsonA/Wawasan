import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Wawa, type WawaExpression } from '@/brand/Wawa'
import { Button, Card, Chip, Icon, ProgressBar, Ring, SectionTitle, Stat, cx } from '@/components/ui'
import { LANGUAGES } from '@/data/languages'
import { tint } from '@/lib/tint'
import { DAILY_TEMPLATE, WEEKLY_RHYTHM, WEEKLY_NOTE, MIN_SKILL_RULE } from '@/data/reference'
import { gateStatus, nextLesson, progressPct } from '@/data/curriculum'
import { useProgress, useDueCards, useXpToday } from '@/store/useProgress'
import { gateScore } from '@/lib/scoring'
import { forecast, todayISO } from '@/lib/srs'
import { startBgm } from '@/lib/sound'

export default function Dashboard() {
  const { activeLang, completed, name, dailyGoalMin, streak, xp, skillScores, deck } = useProgress()
  const lang = LANGUAGES[activeLang]
  const due = useDueCards()
  const xpToday = useXpToday()

  // Ensure BGM starts playing when arriving at Dashboard
  useEffect(() => {
    startBgm()
  }, [])

  const next = nextLesson(activeLang, completed)
  const gates = gateStatus(activeLang, completed)
  const pct = progressPct(activeLang, completed)

  // XP target scales with the chosen daily goal: roughly 1 XP per minute of work.
  const xpGoal = Math.max(20, dailyGoalMin)
  const goalPct = Math.min(100, Math.round((xpToday / xpGoal) * 100))

  const mood: WawaExpression =
    goalPct >= 100 ? 'celebrate' : streak === 0 ? 'wave' : due.length > 12 ? 'thinking' : 'happy'

  const avg = (arr: number[]) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0)
  const skills = skillScores[activeLang]
  const gs = gateScore({
    menyimak: avg(skills.menyimak), membaca: avg(skills.membaca),
    menulis: avg(skills.menulis), berbicara: avg(skills.berbicara),
  })

  const todayIdx = (new Date().getDay() + 6) % 7 // Mon = 0
  const fc = forecast(Object.values(deck), 10)

  return (
    <div className="space-y-6">
      {/* ---------------- Hero ---------------- */}
      <Card className="relative overflow-hidden !p-0">
        <div className="grid gap-0 md:grid-cols-[1fr_auto]">
          <div className="p-6">
            <Chip color="teal" className="mb-3" icon="grad">
              {lang.name} · {lang.exam}
            </Chip>
            <h1 className="text-3xl leading-tight sm:text-[34px]">
              {goalPct >= 100
                ? `Target hari ini tercapai, ${name || 'Pelajar'}!`
                : next
                  ? next.lesson.title
                  : 'Semua unit selesai!'}
            </h1>
            <p className="mt-2 max-w-lg text-[14.5px] text-ink-soft">
              {next
                ? `Gerbang ${next.gate.index} · ${next.gate.title} — ${next.unit.title}`
                : `Kamu sudah menyelesaikan seluruh jalur ${lang.name} yang tersedia. Jaga dengan kartu ulang harian.`}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Chip size="sm" color="ink" icon="script">{lang.script}</Chip>
              <Chip size="sm" color="sky" icon="words">{lang.wordOrder}</Chip>
              <Chip size="sm" color="amber" icon="sparkle">{lang.tagline}</Chip>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {next ? (
                <Link to={`/pelajaran/${activeLang}/${next.lesson.id}`}>
                  <Button size="lg" icon="play">Lanjut belajar</Button>
                </Link>
              ) : (
                <Link to={`/belajar/${activeLang}`}><Button size="lg">Lihat jalur</Button></Link>
              )}
              {due.length > 0 ? (
                <Link to="/ulang">
                  <Button size="lg" variant="secondary" icon="review">{due.length} kartu jatuh tempo</Button>
                </Link>
              ) : null}
            </div>
          </div>

          <div
            className="relative flex items-end justify-center overflow-hidden p-6 md:w-[300px]"
            style={{ backgroundColor: tint(lang.color, 14) }}
          >
            <span className="absolute -right-10 -top-12 h-36 w-36 rounded-full opacity-20" style={{ backgroundColor: lang.color }} />
            <span className="absolute -bottom-14 -left-12 h-32 w-32 rounded-full opacity-15" style={{ backgroundColor: lang.color }} />
            <div className="relative text-center">
              <Wawa expression={mood} size={185} accent={lang.color} className="anim-bob" />
              <div className="mt-1 rounded-2xl border-2 border-sand bg-paper px-3 py-2 text-[13px] font-bold text-ink-soft">
                {goalPct >= 100
                  ? 'Kerja bagus! Istirahat itu bagian dari belajar.'
                  : streak === 0
                    ? 'Ayo mulai — hari pertama selalu yang tersulit.'
                    : due.length > 12
                      ? `${due.length} kartu menumpuk. Kerjakan sebelum materi baru.`
                      : `Sisa ${Math.max(0, xpGoal - xpToday)} XP lagi menuju target hari ini.`}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ---------------- Stat row ---------------- */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4">
          <Ring value={goalPct} size={78} color="#00a191">
            <span className="font-display text-lg font-extrabold text-ink">{goalPct}%</span>
          </Ring>
          <div className="leading-tight">
            <div className="font-display text-[15px] font-extrabold text-ink">Target harian</div>
            <div className="text-[13px] text-ink-soft">{xpToday} / {xpGoal} XP</div>
            <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
              {dailyGoalMin} menit/hari
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <Ring value={pct} size={78} color={lang.color}>
            <span className="font-display text-lg font-extrabold text-ink">{pct}%</span>
          </Ring>
          <div className="leading-tight">
            <div className="font-display text-[15px] font-extrabold text-ink">Jalur {lang.name}</div>
            <div className="text-[13px] text-ink-soft">
              {gates.filter((g) => g.unlocked).length} dari {gates.length} level terbuka
            </div>
            <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
              {lang.exam}
            </div>
          </div>
        </Card>

        <Stat
          label="Rentetan belajar"
          value={`${streak} hari`}
          color="coral"
          icon="streak"
        />

        <Stat
          label="Total XP"
          value={xp.toLocaleString('id-ID')}
          color="amber"
          icon="xp"
        />
      </div>

      {/* ---------------- Gates + skills ---------------- */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <SectionTitle
            eyebrow="Alur wajib"
            title="Level Belajar Berurutan"
            sub="Mulai dari Level 1. Satu level harus selesai sebelum level berikutnya terbuka."
            right={<Link to={`/belajar/${activeLang}`}><Button size="sm" variant="secondary">Buka jalur</Button></Link>}
          />
          <div className="space-y-2">
            {gates.map((g, index) => (
              <div
                key={g.gate.index}
                className={cx(
                  'flex items-center gap-3 rounded-2xl border-2 px-3.5 py-2.5',
                  g.unlocked ? 'border-sand bg-paper' : 'border-sand/60 bg-shell opacity-60',
                )}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-lg"
                  style={{
                    backgroundColor: g.unlocked ? tint(lang.color) : 'var(--color-shell)',
                    borderColor: g.unlocked ? lang.color : 'var(--color-sand)',
                    color: g.unlocked ? lang.color : 'var(--color-ink-faint)',
                  }}
                  aria-hidden
                >
                  <Icon name={g.unlocked ? g.gate.icon : 'lock'} size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[14.5px] font-extrabold text-ink">
                      Level {index + 1} · {g.gate.title}
                    </span>
                    {g.gateQuizPct !== null ? (
                      <Chip size="sm" color={g.gateQuizPct >= 85 ? 'leaf' : 'coral'}>
                        kuis {g.gateQuizPct}%
                      </Chip>
                    ) : null}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <ProgressBar
                      value={g.done} max={Math.max(1, g.total)} height={9}
                      color={g.done === g.total && g.total > 0 ? 'leaf' : 'teal'}
                    />
                    <span className="shrink-0 text-[11px] font-bold text-ink-faint">{g.done}/{g.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle eyebrow="MIN(4 keterampilan)" title="Nilai Gerbang" />
          <div className="space-y-3">
            {(['menyimak', 'membaca', 'menulis', 'berbicara'] as const).map((k) => {
              const v = avg(skills[k])
              const weakest = k === gs.weakest && v > 0
              return (
                <div key={k}>
                  <div className="mb-1 flex items-center justify-between text-[13px]">
                    <span className={cx('font-bold capitalize', weakest ? 'text-coral-600' : 'text-ink-soft')}>
                      {k}{weakest ? ' ← terlemah' : ''}
                    </span>
                    <span className="font-display font-extrabold text-ink">{v || '—'}%</span>
                  </div>
                  <ProgressBar
                    value={v} height={11}
                    color={v >= 85 ? 'leaf' : v >= 70 ? 'amber' : v > 0 ? 'coral' : 'teal'}
                  />
                </div>
              )
            })}
          </div>
          <p className="mt-4 rounded-2xl border-2 border-amber-200 bg-amber-50 p-3 text-[12.5px] leading-relaxed text-ink-soft">
            {MIN_SKILL_RULE}
          </p>
        </Card>
      </div>

      {/* ---------------- Daily template ---------------- */}
      <Card>
        <SectionTitle
          eyebrow="Rutinitas"
          title="Template Sesi Harian — 60 menit"
          sub="Urutan ini bukan saran; ia menyeimbangkan konsolidasi, input, dan produksi dalam satu sesi."
        />
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
          {DAILY_TEMPLATE.map((t) => (
            <div key={t.range} className="rounded-2xl border-2 border-sand bg-cream p-3.5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xl leading-none" aria-hidden>{t.icon}</span>
                <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] font-extrabold text-ink-faint">
                  {t.range} mnt
                </span>
              </div>
              <div className="font-display text-[14px] font-extrabold text-ink">{t.activity}</div>
              <div className="mt-0.5 text-[12.5px] leading-snug text-ink-soft">{t.detail}</div>
              <div className="mt-2 text-[11px] font-bold uppercase tracking-wide text-teal-600">{t.goal}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ---------------- Weekly + forecast ---------------- */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle eyebrow="Ritme mingguan" title="Jumat = konsolidasi" />
          <div className="grid grid-cols-7 gap-1.5">
            {WEEKLY_RHYTHM.map((d, i) => {
              const tone =
                d.kind === 'new' ? 'bg-teal-50 border-teal-200'
                  : d.kind === 'review' ? 'bg-amber-50 border-amber-200'
                    : d.kind === 'immersion' ? 'bg-grape-50 border-grape-200'
                      : 'bg-shell border-sand'
              return (
                <div
                  key={d.day}
                  className={cx('rounded-xl border-2 px-1 py-2 text-center', tone, i === todayIdx && 'ring-3 ring-ink/15')}
                  title={d.focus}
                >
                  <div className="font-display text-[13px] font-extrabold text-ink">{d.short}</div>
                  <div className="mt-0.5 text-[9px] font-bold uppercase text-ink-faint">
                    {d.kind === 'new' ? 'baru' : d.kind === 'review' ? 'ulang' : d.kind === 'immersion' ? 'bebas' : 'libur'}
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-3.5 rounded-2xl border-2 border-sand bg-cream p-3 text-[12.5px] leading-relaxed text-ink-soft">
            {WEEKLY_NOTE}
          </p>
        </Card>

        <Card>
          <SectionTitle eyebrow="SRS · 1-3-7-16-35-90" title="Perkiraan 10 hari" />
          {Object.keys(deck).length === 0 ? (
            <p className="rounded-2xl border-2 border-dashed border-sand p-5 text-center text-[13.5px] text-ink-soft">
              Belum ada kartu. Selesaikan unit pertama untuk mengisi dek.
            </p>
          ) : (
            <>
              <div className="flex h-28 items-end gap-1.5">
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
                        style={{ height: `${Math.max(4, (f.count / max) * 72)}px` }}
                      />
                      <span className="text-[9px] font-bold text-ink-faint">{f.date.slice(8)}</span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 flex items-center justify-between text-[12.5px] text-ink-soft">
                <span>{Object.keys(deck).length} kartu total di dek</span>
                <Link to="/ulang" className="font-bold text-teal-600 underline underline-offset-4">Buka sesi ulang →</Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
