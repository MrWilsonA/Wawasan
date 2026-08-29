import { Link, useParams, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Wawa } from '@/brand/Wawa'
import { Card, Chip, ProgressBar, cx } from '@/components/ui'
import { LANGUAGES } from '@/data/languages'
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

  return (
    <div className="space-y-6">
      {/* header */}
      <Card className="!p-0">
        <div className="flex flex-wrap items-center gap-4 p-5" style={{ backgroundColor: lang.colorSoft }}>
          <span className="text-4xl leading-none" aria-hidden>{lang.flag}</span>
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
                className="rounded-full border-2 bg-white px-2.5 py-1 text-[11px] font-extrabold"
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

      {/* the path */}
      <div className="space-y-8">
        {gates.map((gate, gi) => {
          const st = statuses[gi]
          return (
            <section key={gate.index}>
              <div
                className={cx(
                  'sticky top-[70px] z-20 mb-4 flex flex-wrap items-center gap-3 rounded-2xl border-2 px-4 py-3 lg:top-2',
                  st.unlocked ? 'border-sand bg-white' : 'border-sand/60 bg-shell',
                )}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 text-xl"
                  style={{
                    backgroundColor: st.unlocked ? lang.colorSoft : '#f0ece1',
                    borderColor: st.unlocked ? lang.color : '#ded7c6',
                  }}
                  aria-hidden
                >
                  {st.unlocked ? gate.icon : '🔒'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-[17px] font-extrabold text-ink">
                    Gerbang {gate.index} — {gate.title}
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
                <Card tone="sand" className="border-dashed text-center">
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
                    <UnitRow key={unit.id} unit={unit} lang={param} align={ui % 2 === 0 ? 'left' : 'right'} />
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

function UnitRow({ unit, lang, align }: { unit: Unit; lang: LangId; align: 'left' | 'right' }) {
  const completed = useProgress((s) => s.completed)
  const l = LANGUAGES[lang]
  const done = unit.lessons.filter((x) => completed[x.id]).length
  const allDone = done === unit.lessons.length

  return (
    <Card className={cx('relative overflow-hidden', allDone && 'border-leaf-200')}>
      <div className={cx('flex flex-col gap-4 md:flex-row', align === 'right' && 'md:flex-row-reverse')}>
        {/* unit summary */}
        <div className="md:w-[280px] md:shrink-0">
          <div className="flex items-start gap-3">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 font-cjk text-lg font-bold"
              style={{ backgroundColor: l.colorSoft, borderColor: l.color, color: l.color }}
              aria-hidden
            >
              {unit.badge.slice(0, 3)}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <Chip size="sm" color="ink">{unit.level}</Chip>
                {allDone ? <Chip size="sm" color="leaf">✓ selesai</Chip> : null}
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
              📖 Baca materi ({unit.notes.length})
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
          'shadow-[0_5px_0_0_rgba(23,49,60,0.18)] group-hover:-translate-y-0.5 group-active:translate-y-[3px] group-active:shadow-[0_2px_0_0_rgba(23,49,60,0.18)]',
        )}
        style={{
          backgroundColor: passed ? '#79d162' : result ? '#ffcd3c' : isGate ? l.colorSoft : '#ffffff',
          borderColor: passed ? '#2c7a1c' : result ? '#ad7a05' : isGate ? l.color : '#ded7c6',
        }}
        aria-hidden
      >
        {passed ? '★' : isGate ? '🏁' : index + 1}
        {isGate ? (
          <span className="absolute -bottom-1 rounded-full border-2 border-ink bg-white px-1.5 text-[9px] font-extrabold uppercase text-ink">
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
