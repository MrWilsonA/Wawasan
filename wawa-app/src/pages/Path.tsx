import { Link, useParams, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Wawa } from '@/brand/Wawa'
import { Card, Chip, Icon, FlagIcon, ProgressBar, cx } from '@/components/ui'
import { LANGUAGES } from '@/data/languages'
import { tint } from '@/lib/tint'
import type { LangId, Lesson, Unit } from '@/data/types'
import { gatesFor, gateStatus, GATE_PASS_PCT } from '@/data/curriculum'
import { useProgress } from '@/store/useProgress'

const isLang = (v: string | undefined): v is LangId => !!v && ['jp', 'cn', 'kr', 'en'].includes(v)

export default function Path() {
  const { lang: param } = useParams()
  const setActiveLang = useProgress((s) => s.setActiveLang)
  const completed = useProgress((s) => s.completed)

  useEffect(() => {
    if (isLang(param)) setActiveLang(param)
  }, [param, setActiveLang])

  if (!isLang(param)) return <Navigate to="/belajar/jp" replace />

  const lang = LANGUAGES[param]
  const gates = gatesFor(param)
  const statuses = gateStatus(param, completed)
  const unitOffsets = gates.map((_, gateIndex) =>
    gates.slice(0, gateIndex).reduce((total, gate) => total + gate.units.length, 0),
  )
  const currentLevel = Math.max(0, statuses.findIndex((status) => status.unlocked && status.done < status.total))

  return (
    <div className="space-y-6">
      {/* header */}
      <Card className="!p-0">
        <div className="flex flex-wrap items-center gap-4 p-5" style={{ backgroundColor: tint(lang.color) }}>
          <FlagIcon lang={param} size={40} />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl leading-tight">
              {lang.name} <span className="font-cjk text-ink-soft">{lang.nativeName}</span>
            </h1>
            <p className="text-[13.5px] text-ink-soft">{lang.examFull}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {lang.levels.map((lv) => (
              <span
                key={lv}
                className="rounded-full border-2 bg-paper px-2.5 py-1 text-[11px] font-extrabold"
                style={{ borderColor: lang.color, color: lang.color }}
              >
                {lv}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t-2 border-sand p-4 text-[13.5px] leading-relaxed text-ink-soft">
          <strong className="text-ink">Untuk pelajar Indonesia:</strong> {lang.hookForIndonesians}
        </div>
      </Card>

      {/* compact roadmap keeps the full order visible before the detailed path */}
      <Card>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-teal-600">Peta pembelajaran</div>
            <h2 className="mt-1 text-[22px]">Level berurutan</h2>
          </div>
          <p className="max-w-md text-[12.5px] leading-relaxed text-ink-soft">
            Ikuti dari Level 1. Level berikutnya terbuka setelah evaluasi level sebelumnya lulus {GATE_PASS_PCT}%.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {statuses.map((status, index) => {
            const finished = status.total > 0 && status.done === status.total
            const current = index === currentLevel && status.unlocked && !finished
            const content = (
              <>
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 font-display text-[14px] font-extrabold"
                  style={status.unlocked ? { borderColor: lang.color, backgroundColor: tint(lang.color), color: lang.color } : undefined}
                >
                  {finished ? <Icon name="check" size={17} /> : status.unlocked ? index + 1 : <Icon name="lock" size={15} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wide text-ink-faint">Level {index + 1}</span>
                  <span className="block truncate font-display text-[13.5px] font-extrabold text-ink">{status.gate.title}</span>
                </span>
                <span className="text-[11px] font-extrabold text-ink-faint">{status.done}/{status.total}</span>
              </>
            )
            const classes = cx(
              'flex items-center gap-2.5 rounded-2xl border-2 p-2.5 text-left transition-colors',
              finished ? 'border-leaf-200 bg-leaf-50' : current ? 'border-teal-200 bg-teal-50' : status.unlocked ? 'border-sand bg-paper hover:bg-cream' : 'border-sand/60 bg-shell opacity-60',
            )
            return status.unlocked ? (
              <a key={status.gate.index} href={`#level-${index + 1}`} className={classes}>{content}</a>
            ) : (
              <div key={status.gate.index} className={classes}>{content}</div>
            )
          })}
        </div>
      </Card>

      {/* the path */}
      <div className="space-y-8">
        {gates.map((gate, gi) => {
          const st = statuses[gi]
          return (
            <section key={gate.index} id={`level-${gi + 1}`} className="scroll-mt-36">
              <div
                className={cx(
                  'sticky top-[70px] z-20 mb-4 flex flex-wrap items-center gap-3 rounded-2xl border-2 px-4 py-3 lg:top-2',
                  st.unlocked ? 'border-sand bg-paper' : 'border-sand/60 bg-shell',
                )}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 text-xl"
                  style={{
                    backgroundColor: st.unlocked ? tint(lang.color) : 'var(--color-shell)',
                    borderColor: st.unlocked ? lang.color : 'var(--color-sand)',
                    color: st.unlocked ? lang.color : 'var(--color-ink-faint)',
                  }}
                  aria-hidden
                >
                  <Icon name={st.unlocked ? gate.icon : 'lock'} size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[17px] font-extrabold text-ink">
                    Level {gi + 1} <span className="text-ink-faint">· Gerbang {gate.index}</span> — {gate.title}
                  </div>
                  <div className="text-[13px] text-ink-soft">{gate.subtitle}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Chip color="ink" size="sm">⏱ {gate.duration}</Chip>
                  <Chip color={st.done === st.total && st.total ? 'leaf' : 'teal'} size="sm">
                    {st.done}/{st.total}
                  </Chip>
                </div>
              </div>

              {!st.unlocked ? (
                <Card tone="shell" className="border-dashed text-center">
                  <div className="mb-2 flex justify-center opacity-50">
                    <Wawa expression="sleep" size={110} accent={lang.color} />
                  </div>
                  <p className="mx-auto max-w-md text-[14px] text-ink-soft">
                    Gerbang ini terkunci. Lulus kuis Gerbang {gate.index - 1} dengan minimal{' '}
                    <strong className="text-ink">{GATE_PASS_PCT}%</strong> untuk membukanya.
                    Nilai 84% = ulang gerbang, tanpa pengecualian.
                  </p>
                </Card>
              ) : (
                <div className="space-y-6">
                  {gate.units.map((unit, ui) => (
                    <UnitRow key={unit.id} unit={unit} lang={param} order={unitOffsets[gi] + ui + 1} />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function UnitRow({ unit, lang, order }: { unit: Unit; lang: LangId; order: number }) {
  const completed = useProgress((s) => s.completed)
  const l = LANGUAGES[lang]
  const done = unit.lessons.filter((x) => completed[x.id]).length
  const allDone = done === unit.lessons.length

  return (
    <Card className={cx('relative overflow-hidden', allDone && 'border-leaf-200')}>
      <div className="flex flex-col gap-4 md:flex-row">
        {/* unit summary */}
        <div className="md:w-[300px] md:shrink-0">
          <div className="flex items-start gap-3">
            <span
              className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border-2 font-display font-extrabold"
              style={{ backgroundColor: tint(l.color), borderColor: l.color, color: l.color }}
            >
              <span className="text-[9px] uppercase tracking-wide">Unit</span>
              <span className="text-xl leading-none">{order}</span>
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <Chip size="sm" color="ink">{unit.level}</Chip>
                <Chip size="sm" color="teal">{unit.badge.slice(0, 8)}</Chip>
                {allDone ? <Chip size="sm" color="leaf" icon="check">selesai</Chip> : null}
              </div>
              <h3 className="mt-1 text-[17px] leading-tight text-ink">{unit.title}</h3>
              <p className="mt-0.5 text-[13px] leading-snug text-ink-soft">{unit.subtitle}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <ProgressBar value={done} max={unit.lessons.length} height={10} color={allDone ? 'leaf' : 'teal'} />
            <span className="shrink-0 text-[11px] font-bold text-ink-faint">
              {done}/{unit.lessons.length}
            </span>
          </div>

          {unit.notes?.length ? (
            <Link
              to={`/materi/${lang}/${unit.id}`}
              className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-extrabold text-teal-600 underline underline-offset-4"
            >
              <Icon name="words" size={15} />Baca materi ({unit.notes.length})
            </Link>
          ) : null}
        </div>

        {/* lesson nodes */}
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {unit.lessons.map((lesson, i) => (
            <LessonNode key={lesson.id} lesson={lesson} lang={lang} index={i} />
          ))}
        </div>
      </div>
    </Card>
  )
}

function LessonNode({ lesson, lang, index }: { lesson: Lesson; lang: LangId; index: number }) {
  const completed = useProgress((s) => s.completed)
  const l = LANGUAGES[lang]
  const result = completed[lesson.id]
  const isGate = lesson.kind === 'gate'
  const passed = result && (!isGate || result.pct >= GATE_PASS_PCT)

  return (
    <Link
      to={`/pelajaran/${lang}/${lesson.id}`}
      className="group flex w-[124px] flex-col items-center gap-2 text-center"
    >
      <span
        className={cx(
          'relative flex h-[68px] w-[68px] items-center justify-center rounded-full border-[3px] text-2xl transition-transform',
          'shadow-[0_5px_0_0_var(--color-drop)] group-hover:-translate-y-0.5 group-active:translate-y-[3px] group-active:shadow-[0_2px_0_0_var(--color-drop)]',
        )}
        style={{
          backgroundColor: passed ? '#79d162' : result ? '#ffcd3c' : isGate ? tint(l.color) : 'var(--color-paper)',
          borderColor: passed ? '#2c7a1c' : result ? '#ad7a05' : isGate ? l.color : 'var(--color-sand)',
          // completed/attempted nodes keep dark ink on their bright fill in both themes
          color: passed || result ? '#17313c' : isGate ? l.color : 'var(--color-ink)',
        }}
        aria-hidden
      >
        {passed ? <Icon name="star" size={26} /> : isGate ? <Icon name="strategy" size={24} /> : index + 1}
        {isGate ? (
          <span className="absolute -bottom-1 rounded-full border-2 border-ink bg-paper px-1.5 text-[9px] font-extrabold uppercase text-ink">
            gerbang
          </span>
        ) : null}
      </span>
      <span className="text-[12.5px] font-bold leading-tight text-ink-soft group-hover:text-ink">
        {lesson.title}
      </span>
      <span className="text-[10.5px] font-extrabold uppercase tracking-wide text-ink-faint">
        {result ? `${result.pct}%` : `+${lesson.xp} XP`}
      </span>
    </Link>
  )
}
