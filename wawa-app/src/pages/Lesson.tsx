import { useMemo, useState, useEffect } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Wawa } from '@/brand/Wawa'
import { Button, Card, Chip, Icon, ProgressBar, cx } from '@/components/ui'
import { LANGUAGES } from '@/data/languages'
import type { Exercise, LangId, Skill, Note } from '@/data/types'
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

  // State: 'theory' for initial explanation phase, 'drill' for interactive exercises
  const [phase, setPhase] = useState<'theory' | 'drill'>('theory')
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [step, setStep] = useState(0)
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [locked, setLocked] = useState(false)
  const [verdict, setVerdict] = useState<boolean | null>(null)
  const [results, setResults] = useState<Array<{ ex: Exercise; ok: boolean }>>([])
  const [finished, setFinished] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  const exercises = useMemo(() => found?.lesson.exercises ?? [], [found])
  const current = exercises[step]

  // If lesson has no notes or is a gate exam, default directly to drill or allow user choice
  useEffect(() => {
    if (found?.lesson.kind === 'gate') {
      setPhase('drill')
    } else {
      setPhase('theory')
    }
  }, [found?.lesson.id, found?.lesson.kind])

  if (!isLang(param)) return <Navigate to="/belajar/jp" replace />
  if (!found) return <Navigate to={`/belajar/${param}`} replace />

  const lang = LANGUAGES[param]
  const { lesson, unit, gate } = found
  const a = answer ?? (current ? blankAnswer(current) : ({} as Answer))

  // Play audio for current exercise display / text
  const playCurrentAudio = (textToSpeak?: string) => {
    const text = textToSpeak || current?.display || current?.prompt
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    setIsPlayingAudio(true)
    playSound('tap')

    const utterance = new SpeechSynthesisUtterance(text)
    const voiceMap: Record<LangId, string> = { jp: 'ja-JP', cn: 'zh-CN', kr: 'ko-KR', en: 'en-GB' }
    utterance.lang = voiceMap[param] || 'en-US'
    utterance.rate = 0.9

    const voices = window.speechSynthesis.getVoices()
    const prefix = utterance.lang.slice(0, 2).toLowerCase()
    const matchingVoice = voices.find((v) => v.lang.toLowerCase().startsWith(prefix))
    if (matchingVoice) utterance.voice = matchingVoice

    utterance.onend = () => setIsPlayingAudio(false)
    utterance.onerror = () => setIsPlayingAudio(false)

    window.speechSynthesis.speak(utterance)
  }

  const check = () => {
    if (!current) return
    const ok = grade(current, a)
    playSound(ok ? 'correct' : 'wrong')
    setVerdict(ok)
    setLocked(true)
    setResults((r) => [...r, { ex: current, ok }])
  }

  const skipSpeaking = () => {
    if (!current) return
    playSound('tap')
    setVerdict(true)
    setLocked(true)
    setResults((r) => [...r, { ex: current, ok: true }])
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
          setResults([]); setFinished(false); setPhase('theory')
        }}
      />
    )
  }

  /* ------------------------------------------------------------------
     PHASE 1: THEORY & CONCEPT INTRODUCTION (Materi Pertama Kali)
     ------------------------------------------------------------------ */
  if (phase === 'theory') {
    const unitCards = unit.cards || []
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Top bar navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(`/belajar/${param}`)}
            aria-label="Kembali ke Jalur Belajar"
            className="flex items-center gap-1.5 rounded-xl border-2 border-sand bg-paper px-3 py-2 text-[13px] font-bold text-ink-soft shadow-sm hover:bg-cream cursor-pointer"
          >
            <Icon name="left" size={16} />
            <span>Jalur Belajar</span>
          </button>

          <div className="flex items-center gap-2">
            <Chip size="sm" color="ink">Gerbang {gate.index}</Chip>
            <Chip size="sm" color="teal">Level {unit.level}</Chip>
            <Chip size="sm" color="amber" icon="words">Fase 1 · Pahami Materi</Chip>
          </div>
        </div>

        {/* Mascot Intro Greeting */}
        <Card className="border-2 border-teal-300 bg-teal-50/80 shadow-[0_4px_0_0_var(--color-teal-700)]">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Wawa expression="teach" size={100} accent={lang.color} className="shrink-0 anim-bob" />
            <div className="flex-1 space-y-1">
              <div className="text-[11px] font-black uppercase tracking-wider text-teal-700">
                Pondasi Materi · {unit.title}
              </div>
              <h1 className="font-display text-2xl font-black text-ink">
                {lesson.title}
              </h1>
              <p className="text-[13.5px] leading-relaxed text-ink-soft font-medium">
                Sebelum memulai latihan soal, yuk kita pelajari konsep dasarnya terlebih dahulu. Ibarat mengajari dari nol, pahami materi singkat di bawah ini agar kamu bisa menjawab latihan dengan lancar!
              </p>
            </div>
          </div>
        </Card>

        {/* Teaching Notes Sections */}
        {unit.notes?.length ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-ink">
              <Icon name="words" size={18} className="text-teal-600" />
              <h2 className="font-display text-[17px] font-black">
                Catatan Penjelasan Konsep:
              </h2>
            </div>

            {unit.notes.map((note, idx) => (
              <TheoryNoteCard key={idx} note={note} lang={param} onPlayAudio={playCurrentAudio} />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center space-y-2">
            <h3 className="font-display text-lg font-black text-ink">Materi Latihan Mandiri</h3>
            <p className="text-[14px] text-ink-soft max-w-md mx-auto">
              Pelajaran ini berisi {exercises.length} soal latihan interaktif untuk menguji pemahaman kosakata dan tata bahasa Anda.
            </p>
          </Card>
        )}

        {/* Audio Example Vocab Preview (If unit has cards) */}
        {unitCards.length > 0 ? (
          <Card className="border-2 border-sand shadow-[0_4px_0_0_var(--color-drop)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="sound" size={18} className="text-teal-600" />
                <h3 className="font-display text-[15px] font-black text-ink">
                  Dengarkan Contoh Pelafalan ({unitCards.length} Kosakata):
                </h3>
              </div>
              <span className="text-[11.5px] font-bold text-ink-faint">Klik untuk mendengar</span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {unitCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => playCurrentAudio(card.front)}
                  className="flex items-center justify-between rounded-xl border border-sand bg-paper p-3 text-left transition-colors hover:bg-cream hover:border-teal-400 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                      <Icon name="sound" size={15} />
                    </span>
                    <div>
                      <div className="font-cjk text-[18px] font-bold text-ink">{card.front}</div>
                      <div className="text-[11.5px] font-bold text-ink-soft">{card.reading || card.front}</div>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold text-teal-800">{card.back}</span>
                </button>
              ))}
            </div>
          </Card>
        ) : null}

        {/* Bottom CTA to start exercises */}
        <div className="sticky bottom-4 rounded-3xl border-2 border-sand bg-paper/95 p-4 shadow-[0_6px_0_0_var(--color-drop)] backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <div className="font-display text-[14px] font-black text-ink">Sudah siap berlatih?</div>
            <div className="text-[12px] font-bold text-ink-faint">{exercises.length} soal interaktif menantimu (+{lesson.xp} XP)</div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              size="lg"
              full
              icon="next"
              onClick={() => {
                playSound('tap')
                setPhase('drill')
              }}
              className="font-black"
            >
              Mulai Latihan Soal Sekarang
            </Button>
          </div>
        </div>
      </div>
    )
  }

  /* ------------------------------------------------------------------
     PHASE 2: INTERACTIVE EXERCISES DRILL
     ------------------------------------------------------------------ */
  if (!current) return null
  const ready = isReady(current, a)
  const isSpeakingSkill = current.skill === 'berbicara'

  return (
    <div className="mx-auto max-w-3xl">
      {/* Top bar */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => setPhase('theory')}
          aria-label="Kembali ke Materi"
          className="rounded-xl border-2 border-sand bg-paper px-3 py-2 text-sm font-bold text-ink-soft shadow-[0_2px_0_0_var(--color-drop)] active:translate-y-[2px] active:shadow-none hover:bg-cream cursor-pointer"
        >
          <Icon name="words" size={16} />
        </button>

        <div className="flex-1">
          <ProgressBar value={step} max={exercises.length} height={16} color={lesson.kind === 'gate' ? 'grape' : 'leaf'} />
        </div>

        <button
          type="button"
          onClick={() => setShowNotesModal(true)}
          className="flex items-center gap-1 rounded-xl border-2 border-teal-300 bg-teal-50 px-2.5 py-1.5 text-[11.5px] font-black text-teal-900 shadow-sm hover:bg-teal-100 cursor-pointer"
        >
          <Icon name="doc" size={13} />
          <span>Catatan</span>
        </button>

        <span className="min-w-[48px] text-right font-display text-[13px] font-extrabold text-ink-faint">
          {step + 1}/{exercises.length}
        </span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Chip size="sm" color="ink">G{gate.index} · {gate.title}</Chip>
        <Chip size="sm" color="ink">{unit.title}</Chip>
        {lesson.kind === 'gate' ? <Chip size="sm" color="grape" icon="strategy">Kuis gerbang — lulus {GATE_PASS_PCT}%</Chip> : null}
        {current.skill ? <Chip size="sm" color="teal">{current.skill}</Chip> : null}
      </div>

      {/* Question Card */}
      <div key={current.id} className="anim-rise">
        {current.display ? (
          <div className="mb-4 rounded-3xl border-2 border-sand bg-paper px-6 py-6 text-center space-y-2">
            <div className="font-cjk text-[42px] leading-tight text-ink sm:text-[54px]">{current.display}</div>
            {current.reading ? (
              <div className="text-[14px] font-bold text-ink-faint">{current.reading}</div>
            ) : null}

            {/* Native Audio Button */}
            <div className="pt-1 flex justify-center">
              <button
                type="button"
                onClick={() => playCurrentAudio()}
                className={cx(
                  'inline-flex items-center gap-1.5 rounded-full border-2 border-teal-300 bg-teal-50 px-4 py-1.5 text-[12.5px] font-extrabold text-teal-900 shadow-sm transition-all hover:bg-teal-100 cursor-pointer',
                  isPlayingAudio && 'ring-4 ring-teal-200 animate-pulse',
                )}
              >
                <Icon name="sound" size={15} />
                <span>{isPlayingAudio ? 'Memutar Suara...' : 'Dengar Pelafalan Asli'}</span>
              </button>
            </div>
          </div>
        ) : null}

        <h1 className="mb-5 text-[20px] font-black leading-snug text-ink sm:text-[23px]">
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

      {/* Footer / Answer Checking */}
      <div
        className={cx(
          'sticky bottom-0 -mx-4 mt-6 border-t-2 px-4 py-4 sm:-mx-6 sm:px-6 rounded-t-3xl',
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
              <p className="mt-0.5 text-[14px] leading-relaxed text-ink-soft font-medium">{current.explain}</p>
            </div>
          </div>
        ) : null}

        {locked ? (
          <Button full size="lg" variant={verdict ? 'success' : 'danger'} icon="next" onClick={advance}>
            {step + 1 >= exercises.length ? 'Selesai Latihan' : 'Lanjut ke Soal Berikutnya'}
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            {isSpeakingSkill && (
              <Button
                variant="ghost"
                size="lg"
                onClick={skipSpeaking}
                className="text-[13px] text-ink-faint hover:text-ink"
              >
                Lewati Latihan Bicara
              </Button>
            )}
            <Button full size="lg" disabled={!ready} onClick={check}>
              {ready ? 'Periksa Jawaban' : 'Pilih Jawabanmu'}
            </Button>
          </div>
        )}
      </div>

      {/* Floating Notes Modal */}
      {showNotesModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={() => setShowNotesModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="anim-rise w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border-2 border-sand bg-paper p-6 shadow-[0_8px_0_0_var(--color-drop)] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-sand pb-3">
              <div>
                <Chip size="sm" color="teal">Materi Pembelajaran</Chip>
                <h3 className="mt-1 font-display text-xl font-black text-ink">{unit.title}</h3>
                <p className="text-[13px] text-ink-soft">{unit.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNotesModal(false)}
                className="rounded-xl border-2 border-sand bg-paper px-2.5 py-1.5 text-ink-faint hover:text-ink cursor-pointer"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {unit.notes?.map((note, i) => (
                <TheoryNoteCard key={i} note={note} lang={param} onPlayAudio={playCurrentAudio} />
              ))}
            </div>

            <Button full size="md" onClick={() => setShowNotesModal(false)}>
              Tutup & Lanjutkan Latihan
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------
   THEORY NOTE CARD COMPONENT
   ------------------------------------------------------------------ */
function TheoryNoteCard({
  note,
}: {
  note: Note
  lang?: LangId
  onPlayAudio?: (text: string) => void
}) {
  const iconMap: Record<string, string> = {
    concept: 'concept',
    warning: 'warning',
    tip: 'tip',
    contrast: 'contrast',
    story: 'story',
    formula: 'formula',
    table: 'doc',
  }

  return (
    <Card
      className={cx(
        'border-2 shadow-[0_3px_0_0_var(--color-drop)] space-y-2.5',
        note.kind === 'warning' && 'border-coral-200 bg-coral-50/70',
        note.kind === 'tip' && 'border-amber-200 bg-amber-50/70',
        note.kind === 'concept' && 'border-teal-200 bg-teal-50/50',
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cx(
            'flex h-7 w-7 items-center justify-center rounded-lg border text-sm',
            note.kind === 'warning' ? 'border-coral-300 bg-coral-100 text-coral-700' : 'border-teal-300 bg-teal-100 text-teal-700',
          )}
        >
          <Icon name={(iconMap[note.kind] as any) || 'words'} size={15} />
        </span>
        <h3 className="font-display text-[15px] font-black text-ink">{note.title}</h3>
      </div>

      {note.body ? (
        <p className="text-[13.5px] leading-relaxed text-ink-soft font-medium">
          {note.body}
        </p>
      ) : null}

      {/* Table Note */}
      {note.kind === 'table' && note.head && note.rows ? (
        <div className="overflow-x-auto rounded-xl border border-sand bg-paper mt-2">
          <table className="w-full text-left text-[12.5px]">
            <thead className="border-b border-sand bg-cream/70 font-display font-extrabold text-ink">
              <tr>
                {note.head.map((h, hi) => (
                  <th key={hi} className="p-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/60">
              {note.rows.map((r, ri) => (
                <tr key={ri} className="hover:bg-cream/40 transition-colors">
                  {r.map((cell, ci) => (
                    <td key={ci} className="p-2.5 font-medium text-ink-soft">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Formula Pre */}
      {note.pre ? (
        <pre className="mt-2 overflow-x-auto rounded-xl border border-sand bg-paper p-3 font-mono text-[13px] font-bold text-ink">
          {note.pre}
        </pre>
      ) : null}
    </Card>
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
        <Link to={`/belajar/${lang}`}><Button size="lg" icon="path">Kembali ke Jalur</Button></Link>
        <Button size="lg" variant="secondary" icon="reset" onClick={onRetry}>Ulangi Pelajaran</Button>
        {pct >= 85 ? <Link to="/ulang"><Button size="lg" variant="amber" icon="review">Kartu Ulang</Button></Link> : null}
      </div>
    </div>
  )
}
