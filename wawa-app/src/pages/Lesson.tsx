import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Wawa } from '@/brand/Wawa'
import { Button, Chip, Icon, ProgressBar, cx } from '@/components/ui'
import { LANGUAGES } from '@/data/languages'
import type { Exercise, LangId, Skill } from '@/data/types'
import { findLesson, cardsForUnit, GATE_PASS_PCT } from '@/data/curriculum'
import { useProgress } from '@/store/useProgress'
import { gradeFor } from '@/lib/scoring'
import { todayISO } from '@/lib/srs'
import { playSound } from '@/lib/sound'
import {
  ChoiceView, JudgeView, FillView, TypeView, MatchView, OrderView, SortView, checkTyped,
} from '@/components/lesson/Exercises'

const isLang = (v: string | undefined): v is LangId => !!v && ['jp', 'cn', 'kr', 'en'].includes(v)

type Answer =
  | { kind: 'choice'; value: number | null }
  | { kind: 'judge'; value: boolean | null }
  | { kind: 'fill'; value: (string | null)[] }
  | { kind: 'type'; value: string }
  | { kind: 'match'; value: Record<number, number | null> }
  | { kind: 'order'; value: number[] }
  | { kind: 'sort'; value: Record<number, number | null> }

function blankAnswer(ex: Exercise): Answer {
  switch (ex.type) {
    case 'choice': return { kind: 'choice', value: null }
    case 'judge': return { kind: 'judge', value: null }
    case 'fill': return { kind: 'fill', value: ex.answers.map(() => null) }
    case 'type': return { kind: 'type', value: '' }
    case 'match': return { kind: 'match', value: Object.fromEntries(ex.pairs.map((_, i) => [i, null])) }
    case 'order': return { kind: 'order', value: [] }
    case 'sort': return { kind: 'sort', value: Object.fromEntries(ex.items.map((_, i) => [i, null])) }
  }
}

function isReady(ex: Exercise, a: Answer): boolean {
  switch (ex.type) {
    case 'choice': return (a as { value: number | null }).value !== null
    case 'judge': return (a as { value: boolean | null }).value !== null
    case 'fill': return (a.value as (string | null)[]).every((v) => v !== null)
    case 'type': return (a.value as string).trim().length > 0
    case 'match': return Object.values(a.value as Record<number, number | null>).every((v) => v !== null)
    case 'order': return (a.value as number[]).length === ex.chunks.length
    case 'sort': return Object.values(a.value as Record<number, number | null>).every((v) => v !== null)
  }
}

function grade(ex: Exercise, a: Answer): boolean {
  switch (ex.type) {
    case 'choice': return a.value === ex.answer
    case 'judge': return a.value === ex.answer
    case 'fill': return (a.value as (string | null)[]).every((v, i) => v === ex.answers[i])
    case 'type': return checkTyped(ex, a.value as string)
    case 'match': return Object.entries(a.value as Record<number, number | null>).every(([k, v]) => Number(k) === v)
    case 'order': {
      const p = a.value as number[]
      return p.length === ex.answer.length && p.every((v, i) => v === ex.answer[i])
    }
    case 'sort': return Object.entries(a.value as Record<number, number | null>).every(([k, v]) => ex.items[Number(k)].bucket === v)
  }
}

export default function LessonPage() {
  const { lang: param, id } = useParams()
  const navigate = useNavigate()
  const { completeLesson, seedCards } = useProgress()

  const found = isLang(param) && id ? findLesson(param, id) : null

  const [step, setStep] = useState(0)
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [locked, setLocked] = useState(false)
  const [verdict, setVerdict] = useState<boolean | null>(null)
  const [results, setResults] = useState<Array<{ ex: Exercise; ok: boolean }>>([])
  const [finished, setFinished] = useState(false)

  const exercises = useMemo(() => found?.lesson.exercises ?? [], [found])
  const current = exercises[step]

  if (!isLang(param)) return <Navigate to="/belajar/jp" replace />
  if (!found) return <Navigate to={`/belajar/${param}`} replace />

  const lang = LANGUAGES[param]
  const { lesson, unit, gate } = found
  const a = answer ?? blankAnswer(current)

  const check = () => {
    const ok = grade(current, a)
    playSound(ok ? 'correct' : 'wrong')
    setVerdict(ok)
    setLocked(true)
    setResults((r) => [...r, { ex: current, ok }])
  }

  const advance = () => {
    if (step + 1 >= exercises.length) {
      finish([...results])
      return
    }
    setStep(step + 1)
    setAnswer(null)
    setLocked(false)
    setVerdict(null)
  }

  const finish = (all: Array<{ ex: Exercise; ok: boolean }>) => {
    const correct = all.filter((r) => r.ok).length
    const pct = Math.round((correct / Math.max(1, all.length)) * 100)

    // per-skill tallies feed the MIN() gate score
    const skills: Partial<Record<Skill, { correct: number; total: number }>> = {}
    for (const r of all) {
      const s = r.ex.skill
      if (!s) continue
      skills[s] ??= { correct: 0, total: 0 }
      skills[s]!.total += 1
      if (r.ok) skills[s]!.correct += 1
    }

    completeLesson({ lessonId: lesson.id, correct, total: all.length, pct, date: todayISO() }, skills, param)
    if (pct >= GATE_PASS_PCT) seedCards(cardsForUnit(param, unit.id))
    if (lesson.kind === 'gate' && pct >= GATE_PASS_PCT) playSound('levelComplete')
    setFinished(true)
  }

  if (finished) {
    const correct = results.filter((r) => r.ok).length
    const pct = Math.round((correct / Math.max(1, results.length)) * 100)
    return (
      <Summary
        pct={pct} correct={correct} total={results.length}
        lang={param} lessonKind={lesson.kind} unitTitle={unit.title}
        wrong={results.filter((r) => !r.ok).map((r) => r.ex)}
        onRetry={() => {
          setStep(0); setAnswer(null); setLocked(false); setVerdict(null)
          setResults([]); setFinished(false)
        }}
      />
    )
  }

  const ready = isReady(current, a)

  return (
    <div className="mx-auto max-w-3xl">
      {/* ---------- top bar ---------- */}
      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={() => navigate(`/belajar/${param}`)}
          aria-label="Keluar dari pelajaran"
          className="rounded-xl border-2 border-sand bg-paper px-3 py-2 text-lg leading-none text-ink-faint shadow-[0_3px_0_0_var(--color-drop)] active:translate-y-[2px] active:shadow-none"
        >
          <Icon name="close" size={20} />
        </button>
        <div className="flex-1">
          <ProgressBar value={step} max={exercises.length} height={16} color={lesson.kind === 'gate' ? 'grape' : 'leaf'} />
        </div>
        <span className="min-w-[54px] text-right font-display text-[13px] font-extrabold text-ink-faint">
          {step + 1}/{exercises.length}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Chip size="sm" color="ink">G{gate.index} · {gate.title}</Chip>
        <Chip size="sm" color="ink">{unit.title}</Chip>
        {lesson.kind === 'gate' ? <Chip size="sm" color="grape" icon="strategy">Kuis gerbang — lulus {GATE_PASS_PCT}%</Chip> : null}
        {current.skill ? <Chip size="sm" color="teal">{current.skill}</Chip> : null}
      </div>

      {/* ---------- question ---------- */}
      <div key={current.id} className="anim-rise">
        {current.display ? (
          <div className="mb-4 rounded-3xl border-2 border-sand bg-paper px-6 py-7 text-center">
            <div className="font-cjk text-[42px] leading-tight text-ink sm:text-[54px]">{current.display}</div>
            {current.reading ? (
              <div className="mt-1.5 text-[14px] font-bold text-ink-faint">{current.reading}</div>
            ) : null}
          </div>
        ) : null}

        <h1 className="mb-5 text-[21px] leading-snug text-ink sm:text-[24px]">
          {current.type === 'judge' ? (current.prompt ?? 'Benar atau salah?') : current.prompt}
        </h1>

        {current.type === 'choice' ? (
          <ChoiceView
            ex={current} locked={locked} correct={verdict}
            selected={a.value as number | null}
            onSelect={(i) => setAnswer({ kind: 'choice', value: i })}
          />
        ) : null}
        {current.type === 'judge' ? (
          <JudgeView
            ex={current} locked={locked}
            selected={a.value as boolean | null}
            onSelect={(v) => setAnswer({ kind: 'judge', value: v })}
          />
        ) : null}
        {current.type === 'fill' ? (
          <FillView
            ex={current} locked={locked}
            answers={a.value as (string | null)[]}
            onChange={(v) => setAnswer({ kind: 'fill', value: v })}
          />
        ) : null}
        {current.type === 'type' ? (
          <TypeView
            ex={current} locked={locked} verdict={verdict}
            value={a.value as string}
            onChange={(v) => setAnswer({ kind: 'type', value: v })}
          />
        ) : null}
        {current.type === 'match' ? (
          <MatchView
            ex={current} locked={locked}
            pairs={a.value as Record<number, number | null>}
            onChange={(v) => setAnswer({ kind: 'match', value: v })}
          />
        ) : null}
        {current.type === 'order' ? (
          <OrderView
            ex={current} locked={locked}
            picked={a.value as number[]}
            onChange={(v) => setAnswer({ kind: 'order', value: v })}
          />
        ) : null}
        {current.type === 'sort' ? (
          <SortView
            ex={current} locked={locked}
            assigned={a.value as Record<number, number | null>}
            onChange={(v) => setAnswer({ kind: 'sort', value: v })}
          />
        ) : null}
      </div>

      {/* ---------- footer ---------- */}
      <div
        className={cx(
          'sticky bottom-0 -mx-4 mt-6 border-t-2 px-4 py-4 sm:-mx-6 sm:px-6',
          locked
            ? verdict ? 'border-leaf-200 bg-leaf-50' : 'border-coral-200 bg-coral-50'
            : 'border-sand bg-shell',
        )}
      >
        {locked ? (
          <div className={cx('mb-3 flex items-start gap-3', !verdict && 'anim-shake')}>
            <Wawa
              expression={verdict ? 'celebrate' : 'sad'}
              size={62} accent={lang.color} cropped
              className="shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className={cx('font-display text-[17px] font-extrabold', verdict ? 'text-leaf-600' : 'text-coral-600')}>
                {verdict ? 'Benar!' : 'Belum tepat'}
              </div>
              <p className="mt-0.5 text-[14px] leading-relaxed text-ink-soft">{current.explain}</p>
            </div>
          </div>
        ) : null}

        {locked ? (
          <Button full size="lg" variant={verdict ? 'success' : 'danger'} onClick={advance}>
            {step + 1 >= exercises.length ? 'Selesai' : 'Lanjut'}
          </Button>
        ) : (
          <Button full size="lg" disabled={!ready} onClick={check}>
            {ready ? 'Periksa' : 'Pilih jawabanmu'}
          </Button>
        )}
      </div>
    </div>
  )
}

/* ------------------------------ Summary ------------------------------ */
function Summary({
  pct, correct, total, lang, lessonKind, unitTitle, wrong, onRetry,
}: {
  pct: number; correct: number; total: number; lang: LangId
  lessonKind: 'drill' | 'gate'; unitTitle: string; wrong: Exercise[]; onRetry: () => void
}) {
  const g = gradeFor(pct)
  const l = LANGUAGES[lang]
  const passedGate = lessonKind !== 'gate' || pct >= GATE_PASS_PCT

  return (
    <div className="mx-auto max-w-2xl py-6 text-center">
      <Wawa
        expression={pct >= 85 ? 'celebrate' : pct >= 70 ? 'thinking' : 'sad'}
        size={200} accent={l.color} className="mx-auto anim-pop"
      />

      <div className="anim-rise mt-4">
        <div className="font-display text-[64px] font-extrabold leading-none text-ink">{pct}%</div>
        <div className="mt-1 font-cjk text-2xl text-ink-soft">{g.label}</div>
        <p className="mt-1 text-[14px] text-ink-faint">{correct} dari {total} benar · {unitTitle}</p>
      </div>

      <div
        className={cx(
          'mt-6 rounded-3xl border-2 p-5 text-left',
          g.color === 'leaf' ? 'border-leaf-200 bg-leaf-50'
            : g.color === 'teal' ? 'border-teal-200 bg-teal-50'
              : g.color === 'amber' ? 'border-amber-200 bg-amber-50'
                : 'border-coral-200 bg-coral-50',
        )}
      >
        <div className="font-display text-[15px] font-extrabold text-ink">Tindakan wajib</div>
        <p className="mt-1 text-[14.5px] leading-relaxed text-ink-soft">{g.action}</p>
        {lessonKind === 'gate' ? (
          <p className="mt-2.5 border-t-2 border-sand/70 pt-2.5 text-[13.5px] font-bold text-ink-soft">
            {passedGate
              ? `Gerbang lulus (≥${GATE_PASS_PCT}%). Gerbang berikutnya terbuka.`
              : `Gerbang belum lulus. Butuh minimal ${GATE_PASS_PCT}% — nilai ${pct}% berarti ulang gerbang, tanpa pengecualian.`}
          </p>
        ) : null}
      </div>

      {wrong.length ? (
        <div className="mt-5 rounded-3xl border-2 border-sand bg-paper p-5 text-left">
          <div className="mb-2.5 font-display text-[15px] font-extrabold text-ink">
            Butir yang salah ({wrong.length}) — tandai untuk ulangan H+3
          </div>
          <ul className="space-y-2.5">
            {wrong.map((e) => (
              <li key={e.id} className="rounded-2xl border-2 border-sand bg-cream px-3.5 py-2.5">
                <div className="text-[13.5px] font-bold text-ink">
                  {e.type === 'judge' ? e.statement : e.prompt}
                </div>
                <div className="mt-1 text-[13px] leading-relaxed text-ink-soft">{e.explain}</div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <Link to={`/belajar/${lang}`}><Button size="lg">Kembali ke jalur</Button></Link>
        <Button size="lg" variant="secondary" onClick={onRetry}>Ulangi pelajaran</Button>
        {pct >= 85 ? <Link to="/ulang"><Button size="lg" variant="amber" icon="review">Kartu ulang</Button></Link> : null}
      </div>
    </div>
  )
}
