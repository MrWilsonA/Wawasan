import { useMemo, useState } from 'react'
import { cx, Button } from '@/components/ui'
import type {
  ChoiceExercise, FillExercise, TypeExercise, MatchExercise,
  OrderExercise, SortExercise, JudgeExercise,
} from '@/data/types'

/** Deterministic shuffle so a re-render never reorders mid-answer. */
function seededShuffle<T>(arr: T[], seed: string): T[] {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) >>> 0
    const j = h % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export type ExerciseHandle = {
  /** null while unanswerable */
  check: () => boolean | null
}

/* ============================== Choice ============================== */
export function ChoiceView({
  ex, locked, selected, onSelect, correct,
}: {
  ex: ChoiceExercise; locked: boolean; selected: number | null
  onSelect: (i: number) => void; correct: boolean | null
}) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {ex.options.map((opt, i) => {
        const isPicked = selected === i
        const isAnswer = i === ex.answer
        const state = !locked ? (isPicked ? 'picked' : 'idle')
          : isAnswer ? 'right' : isPicked ? 'wrong' : 'idle'
        return (
          <button
            key={i}
            disabled={locked}
            onClick={() => onSelect(i)}
            aria-pressed={isPicked}
            className={cx(
              'rounded-2xl border-2 px-4 py-3.5 text-left text-[15px] font-bold transition-colors',
              'shadow-[0_3px_0_0_var(--sh,#e8e1d0)] active:translate-y-[2px] active:shadow-none disabled:active:translate-y-0',
              ex.big && 'font-cjk text-2xl',
              state === 'idle' && 'border-sand bg-white text-ink hover:bg-cream',
              state === 'picked' && 'border-teal-400 bg-teal-50 text-teal-700 [--sh:var(--color-teal-200)]',
              state === 'right' && 'border-leaf-400 bg-leaf-50 text-leaf-600 [--sh:var(--color-leaf-200)]',
              state === 'wrong' && 'border-coral-400 bg-coral-50 text-coral-600 [--sh:var(--color-coral-200)]',
            )}
          >
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-lg border-2 border-current text-[11px] font-extrabold opacity-60">
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
            {locked && isAnswer ? <span className="ml-2" aria-hidden>✓</span> : null}
            {locked && isPicked && !isAnswer ? <span className="ml-2" aria-hidden>✕</span> : null}
          </button>
        )
      })}
      {correct === null ? null : <span className="sr-only">{correct ? 'Benar' : 'Salah'}</span>}
    </div>
  )
}

/* ============================== Judge ============================== */
export function JudgeView({
  ex, locked, selected, onSelect,
}: { ex: JudgeExercise; locked: boolean; selected: boolean | null; onSelect: (v: boolean) => void }) {
  const labels = ex.labels ?? ['Benar', 'Salah']
  return (
    <div>
      <div className="mb-4 rounded-2xl border-2 border-sand bg-cream px-4 py-4 text-[16px] font-bold leading-relaxed text-ink">
        “{ex.statement}”
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {[true, false].map((v, i) => {
          const isPicked = selected === v
          const isAnswer = v === ex.answer
          const state = !locked ? (isPicked ? 'picked' : 'idle')
            : isAnswer ? 'right' : isPicked ? 'wrong' : 'idle'
          return (
            <button
              key={String(v)}
              disabled={locked}
              onClick={() => onSelect(v)}
              className={cx(
                'rounded-2xl border-2 px-4 py-4 font-display text-[17px] font-extrabold transition-colors',
                'shadow-[0_3px_0_0_var(--sh,#e8e1d0)] active:translate-y-[2px] active:shadow-none disabled:active:translate-y-0',
                state === 'idle' && 'border-sand bg-white text-ink hover:bg-cream',
                state === 'picked' && 'border-teal-400 bg-teal-50 text-teal-700 [--sh:var(--color-teal-200)]',
                state === 'right' && 'border-leaf-400 bg-leaf-50 text-leaf-600 [--sh:var(--color-leaf-200)]',
                state === 'wrong' && 'border-coral-400 bg-coral-50 text-coral-600 [--sh:var(--color-coral-200)]',
              )}
            >
              {i === 0 ? '⭕ ' : '❌ '}{labels[i]}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* =============================== Fill =============================== */
export function FillView({
  ex, locked, answers, onChange,
}: { ex: FillExercise; locked: boolean; answers: (string | null)[]; onChange: (a: (string | null)[]) => void }) {
  const parts = ex.sentence.split('___')
  const [active, setActive] = useState(0)

  const place = (token: string) => {
    if (locked) return
    const next = [...answers]
    const slot = next[active] === null ? active : next.findIndex((a) => a === null)
    next[slot === -1 ? active : slot] = token
    onChange(next)
    const following = next.findIndex((a) => a === null)
    setActive(following === -1 ? active : following)
  }

  const clear = (i: number) => {
    if (locked) return
    const next = [...answers]
    next[i] = null
    onChange(next)
    setActive(i)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-1 gap-y-3 rounded-2xl border-2 border-sand bg-cream px-4 py-5 font-cjk text-[22px] leading-relaxed text-ink">
        {parts.map((p, i) => (
          <span key={i} className="contents">
            <span>{p}</span>
            {i < parts.length - 1 ? (
              <button
                onClick={() => clear(i)}
                disabled={locked}
                className={cx(
                  'mx-1 inline-flex min-w-[74px] items-center justify-center rounded-xl border-2 border-dashed px-2 py-1 text-[20px] transition-colors',
                  answers[i]
                    ? locked
                      ? answers[i] === ex.answers[i]
                        ? 'border-solid border-leaf-400 bg-leaf-50 text-leaf-600'
                        : 'border-solid border-coral-400 bg-coral-50 text-coral-600'
                      : 'border-solid border-teal-400 bg-white text-ink'
                    : active === i
                      ? 'border-teal-400 bg-white'
                      : 'border-sand bg-white/60',
                )}
              >
                {answers[i] ?? ' '}
              </button>
            ) : null}
          </span>
        ))}
      </div>

      {locked && answers.some((a, i) => a !== ex.answers[i]) ? (
        <div className="mt-3 rounded-2xl border-2 border-leaf-200 bg-leaf-50 px-4 py-2.5 font-cjk text-[16px] text-leaf-600">
          Jawaban: {ex.answers.join(' · ')}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {ex.bank.map((token) => {
          const used = answers.includes(token) && ex.bank.filter((b) => b === token).length <= answers.filter((a) => a === token).length
          return (
            <button
              key={token}
              disabled={locked || used}
              onClick={() => place(token)}
              className={cx(
                'rounded-xl border-2 px-4 py-2.5 font-cjk text-[19px] font-bold transition-colors',
                'shadow-[0_3px_0_0_#e8e1d0] active:translate-y-[2px] active:shadow-none',
                used ? 'border-sand bg-shell text-ink-faint opacity-40' : 'border-sand bg-white text-ink hover:bg-cream',
              )}
            >
              {token}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* =============================== Type =============================== */
export function TypeView({
  ex, locked, value, onChange, verdict,
}: { ex: TypeExercise; locked: boolean; value: string; onChange: (v: string) => void; verdict: boolean | null }) {
  return (
    <div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={locked}
        placeholder={ex.placeholder ?? 'Ketik jawabanmu…'}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        className={cx(
          'w-full rounded-2xl border-2 bg-white px-4 py-4 font-cjk text-[22px] text-ink outline-none transition-colors',
          'placeholder:font-sans placeholder:text-[16px] placeholder:font-semibold placeholder:text-ink-faint',
          locked
            ? verdict ? 'border-leaf-400 bg-leaf-50' : 'border-coral-400 bg-coral-50'
            : 'border-sand focus:border-teal-400',
        )}
      />
      {locked && !verdict ? (
        <div className="mt-3 rounded-2xl border-2 border-leaf-200 bg-leaf-50 px-4 py-2.5 font-cjk text-[17px] text-leaf-600">
          Jawaban benar: {ex.accept[0]}
        </div>
      ) : null}
    </div>
  )
}

export function checkTyped(ex: TypeExercise, value: string): boolean {
  const norm = (s: string) => s.trim().toLowerCase().replace(/[\s。、.,!?？！]/g, '')
  return ex.accept.some((a) => norm(a) === norm(value))
}

/* =============================== Match =============================== */
export function MatchView({
  ex, locked, pairs, onChange,
}: {
  ex: MatchExercise; locked: boolean
  pairs: Record<number, number | null>; onChange: (p: Record<number, number | null>) => void
}) {
  const rights = useMemo(
    () => seededShuffle(ex.pairs.map((p, i) => ({ text: p[1], i })), ex.id),
    [ex],
  )
  const [pickedLeft, setPickedLeft] = useState<number | null>(null)

  const chosenRights = new Set(Object.values(pairs).filter((v): v is number => v !== null))

  const tapLeft = (i: number) => {
    if (locked) return
    if (pairs[i] !== null && pairs[i] !== undefined) {
      onChange({ ...pairs, [i]: null })
      setPickedLeft(i)
      return
    }
    setPickedLeft(pickedLeft === i ? null : i)
  }

  const tapRight = (ri: number) => {
    if (locked || pickedLeft === null || chosenRights.has(ri)) return
    onChange({ ...pairs, [pickedLeft]: ri })
    setPickedLeft(null)
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-2">
        {ex.pairs.map(([left], i) => {
          const linked = pairs[i]
          const ok = locked ? linked === i : null
          return (
            <button
              key={i}
              disabled={locked}
              onClick={() => tapLeft(i)}
              className={cx(
                'flex w-full items-center justify-between gap-2 rounded-2xl border-2 px-4 py-3 text-left font-cjk text-[18px] font-bold transition-colors',
                ok === true && 'border-leaf-400 bg-leaf-50 text-leaf-600',
                ok === false && 'border-coral-400 bg-coral-50 text-coral-600',
                ok === null && pickedLeft === i && 'border-teal-400 bg-teal-50',
                ok === null && pickedLeft !== i && (linked !== null && linked !== undefined ? 'border-grape-300 bg-grape-50' : 'border-sand bg-white hover:bg-cream'),
              )}
            >
              <span>{left}</span>
              {linked !== null && linked !== undefined ? (
                <span className="rounded-lg bg-white px-2 py-0.5 font-sans text-[11px] font-extrabold text-ink-faint">
                  {rights.findIndex((r) => r.i === linked) + 1}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <div className="space-y-2">
        {rights.map((r, idx) => {
          const taken = chosenRights.has(r.i)
          return (
            <button
              key={r.i}
              disabled={locked || taken}
              onClick={() => tapRight(r.i)}
              className={cx(
                'flex w-full items-center gap-2 rounded-2xl border-2 px-4 py-3 text-left text-[14.5px] font-bold transition-colors',
                taken ? 'border-sand bg-shell text-ink-faint opacity-50' : 'border-sand bg-white text-ink hover:bg-cream',
                !locked && pickedLeft !== null && !taken && 'border-teal-300',
              )}
            >
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 border-sand text-[11px] font-extrabold text-ink-faint">
                {idx + 1}
              </span>
              {r.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* =============================== Order =============================== */
export function OrderView({
  ex, locked, picked, onChange,
}: { ex: OrderExercise; locked: boolean; picked: number[]; onChange: (p: number[]) => void }) {
  const shuffled = useMemo(
    () => seededShuffle(ex.chunks.map((c, i) => ({ c, i })), ex.id),
    [ex],
  )
  const correct = locked ? picked.every((v, i) => v === ex.answer[i]) && picked.length === ex.answer.length : null

  return (
    <div>
      <div
        className={cx(
          'flex min-h-[68px] flex-wrap content-start items-start gap-2 rounded-2xl border-2 border-dashed p-3',
          correct === true ? 'border-leaf-400 bg-leaf-50'
            : correct === false ? 'border-coral-400 bg-coral-50'
              : 'border-sand bg-cream',
        )}
      >
        {picked.length === 0 ? (
          <span className="px-2 py-2 text-[13.5px] font-semibold text-ink-faint">
            Ketuk potongan di bawah untuk menyusun…
          </span>
        ) : null}
        {picked.map((idx, pos) => (
          <button
            key={pos}
            disabled={locked}
            onClick={() => onChange(picked.filter((_, i) => i !== pos))}
            className="rounded-xl border-2 border-sand bg-white px-3.5 py-2 font-cjk text-[17px] font-bold text-ink shadow-[0_3px_0_0_#e8e1d0] active:translate-y-[2px] active:shadow-none"
          >
            {ex.chunks[idx]}
          </button>
        ))}
      </div>

      {locked && correct === false ? (
        <div className="mt-3 rounded-2xl border-2 border-leaf-200 bg-leaf-50 px-4 py-2.5 font-cjk text-[16px] text-leaf-600">
          Urutan benar: {ex.answer.map((i) => ex.chunks[i]).join(' → ')}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {shuffled.map(({ c, i }) => {
          const used = picked.includes(i)
          return (
            <button
              key={i}
              disabled={locked || used}
              onClick={() => onChange([...picked, i])}
              className={cx(
                'rounded-xl border-2 px-3.5 py-2 font-cjk text-[17px] font-bold transition-colors',
                'shadow-[0_3px_0_0_#e8e1d0] active:translate-y-[2px] active:shadow-none',
                used ? 'border-sand bg-shell text-transparent opacity-40' : 'border-sand bg-white text-ink hover:bg-cream',
              )}
            >
              {c}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* =============================== Sort =============================== */
export function SortView({
  ex, locked, assigned, onChange,
}: {
  ex: SortExercise; locked: boolean
  assigned: Record<number, number | null>; onChange: (a: Record<number, number | null>) => void
}) {
  const unassigned = ex.items.map((_, i) => i).filter((i) => assigned[i] === null || assigned[i] === undefined)
  const [held, setHeld] = useState<number | null>(null)

  const drop = (bucket: number) => {
    if (locked || held === null) return
    onChange({ ...assigned, [held]: bucket })
    setHeld(null)
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {unassigned.length === 0 ? (
          <span className="py-2 text-[13.5px] font-semibold text-ink-faint">Semua sudah dikelompokkan.</span>
        ) : null}
        {unassigned.map((i) => (
          <button
            key={i}
            disabled={locked}
            onClick={() => setHeld(held === i ? null : i)}
            className={cx(
              'rounded-xl border-2 px-3.5 py-2 font-cjk text-[16px] font-bold transition-colors',
              'shadow-[0_3px_0_0_#e8e1d0] active:translate-y-[2px] active:shadow-none',
              held === i ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-sand bg-white text-ink hover:bg-cream',
            )}
          >
            {ex.items[i].text}
          </button>
        ))}
      </div>

      <div className={cx('grid gap-3', ex.buckets.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}>
        {ex.buckets.map((b, bi) => {
          const mine = ex.items.map((_, i) => i).filter((i) => assigned[i] === bi)
          return (
            <button
              key={bi}
              disabled={locked || held === null}
              onClick={() => drop(bi)}
              className={cx(
                'min-h-[112px] rounded-2xl border-2 border-dashed p-3 text-left align-top transition-colors',
                held !== null && !locked ? 'border-teal-400 bg-teal-50/60' : 'border-sand bg-cream',
              )}
            >
              <div className="mb-2 font-display text-[13.5px] font-extrabold text-ink">{b}</div>
              <div className="flex flex-wrap gap-1.5">
                {mine.map((i) => {
                  const ok = locked ? ex.items[i].bucket === bi : null
                  return (
                    <span
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!locked) onChange({ ...assigned, [i]: null })
                      }}
                      className={cx(
                        'cursor-pointer rounded-lg border-2 px-2.5 py-1 font-cjk text-[14.5px] font-bold',
                        ok === true && 'border-leaf-400 bg-leaf-50 text-leaf-600',
                        ok === false && 'border-coral-400 bg-coral-50 text-coral-600',
                        ok === null && 'border-sand bg-white text-ink',
                      )}
                    >
                      {ex.items[i].text}
                    </span>
                  )
                })}
              </div>
            </button>
          )
        })}
      </div>

      {locked ? (
        <div className="mt-3 text-[12.5px] font-semibold text-ink-faint">
          Kotak hijau = benar · kotak merah = salah tempat.
        </div>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */
export function SkipButton({ onSkip }: { onSkip: () => void }) {
  return (
    <Button variant="ghost" size="md" onClick={onSkip}>
      Lewati
    </Button>
  )
}
