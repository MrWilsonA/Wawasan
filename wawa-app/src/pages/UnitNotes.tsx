import { Link, Navigate, useParams } from 'react-router-dom'
import { Wawa } from '@/brand/Wawa'
import { Button, Callout, Card, Chip, DataTable, Icon, Mono, cx } from '@/components/ui'
import { LANGUAGES } from '@/data/languages'
import { tint } from '@/lib/tint'
import type { LangId, Note } from '@/data/types'
import { findUnit } from '@/data/curriculum'
import { useProgress } from '@/store/useProgress'

const isLang = (v: string | undefined): v is LangId => !!v && ['jp', 'cn', 'kr', 'en'].includes(v)

export default function UnitNotes() {
  const { lang: param, unitId } = useParams()
  const completed = useProgress((s) => s.completed)

  if (!isLang(param)) return <Navigate to="/belajar/jp" replace />
  const found = unitId ? findUnit(param, unitId) : null
  if (!found) return <Navigate to={`/belajar/${param}`} replace />

  const { gate, unit } = found
  const l = LANGUAGES[param]

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center gap-2 text-[13px] font-bold text-ink-faint">
        <Link to={`/belajar/${param}`} className="underline underline-offset-4 hover:text-ink">
          ← {l.name}
        </Link>
        <span aria-hidden>·</span>
        <span>Gerbang {gate.index} — {gate.title}</span>
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="flex items-center gap-4 p-5" style={{ backgroundColor: tint(l.color) }}>
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 bg-paper font-cjk text-xl font-bold"
            style={{ borderColor: l.color, color: l.color }}
            aria-hidden
          >
            {unit.badge.slice(0, 3)}
          </span>
          <div className="min-w-0">
            <Chip size="sm" color="ink">{unit.level}</Chip>
            <h1 className="mt-1 text-2xl leading-tight">{unit.title}</h1>
            <p className="text-[14px] text-ink-soft">{unit.subtitle}</p>
          </div>
        </div>
      </Card>

      {unit.notes?.map((n, i) => <NoteBlock key={i} note={n} />)}

      {unit.cards?.length ? (
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Icon name="layers" size={20} className="text-grape-500" />
            <h2 className="text-xl">Kartu Hari Ini</h2>
            <Chip size="sm" color="grape">{unit.cards.length} kartu</Chip>
          </div>
          <p className="mb-3 text-[13.5px] text-ink-soft">
            Kartu ini otomatis masuk dek SRS (1–3–7–16–35–90 hari) setelah kamu lulus pelajaran unit ini.
          </p>
          <ul className="space-y-2">
            {unit.cards.map((c) => (
              <li key={c.id} className="rounded-2xl border-2 border-sand bg-cream px-4 py-3">
                <div className="font-cjk text-[17px] font-bold text-ink">{c.front}</div>
                <div className="mt-0.5 text-[13.5px] text-ink-soft">{c.back}</div>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card tone="cream">
        <div className="flex flex-wrap items-center gap-4">
          <Wawa expression="teach" size={92} accent={l.color} cropped />
          <div className="min-w-0 flex-1">
            <div className="font-display text-[16px] font-extrabold text-ink">Siap latihan?</div>
            <p className="text-[13.5px] text-ink-soft">
              Materi ini menjelaskan <em>mengapa</em>. Latihannya yang membuatnya menempel.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-2">
          {unit.lessons.map((les, i) => {
            const r = completed[les.id]
            return (
              <Link
                key={les.id}
                to={`/pelajaran/${param}/${les.id}`}
                className={cx(
                  'flex items-center gap-3 rounded-2xl border-2 bg-paper px-4 py-3 transition-colors hover:bg-cream',
                  r ? 'border-leaf-200' : 'border-sand',
                )}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 font-display text-[14px] font-extrabold"
                  style={{
                    backgroundColor: r ? '#d3f2c9' : tint(l.color),
                    borderColor: r ? '#56bd3d' : l.color,
                    color: r ? '#2c7a1c' : l.color,
                  }}
                  aria-hidden
                >
                  {les.kind === 'gate' ? <Icon name="strategy" size={17} /> : r ? <Icon name="star" size={17} /> : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[14.5px] font-extrabold text-ink">{les.title}</span>
                  <span className="block text-[12.5px] text-ink-faint">
                    {les.exercises.length} soal · +{les.xp} XP
                  </span>
                </span>
                <span className="shrink-0 text-[13px] font-extrabold text-ink-faint">
                  {r ? `${r.pct}%` : <Icon name="right" size={16} />}
                </span>
              </Link>
            )
          })}
        </div>
        <Link to={`/pelajaran/${param}/${unit.lessons[0].id}`}>
          <Button full size="lg" className="mt-4" icon="play">Mulai unit ini</Button>
        </Link>
      </Card>
    </div>
  )
}

function NoteBlock({ note }: { note: Note }) {
  if (note.kind === 'table' && note.head && note.rows) {
    return (
      <Card>
        <h2 className="mb-3 text-xl">{note.title}</h2>
        <DataTable head={note.head} rows={note.rows} dense />
        {note.body ? <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{note.body}</p> : null}
      </Card>
    )
  }

  if (note.kind === 'formula' && note.pre) {
    return (
      <Card>
        <h2 className="mb-3 text-xl">{note.title}</h2>
        <Mono>{note.pre}</Mono>
        {note.body ? <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{note.body}</p> : null}
      </Card>
    )
  }

  const kindMap = {
    concept: 'concept', warning: 'warning', tip: 'tip',
    contrast: 'contrast', story: 'story', table: 'tip', formula: 'formula',
  } as const

  return (
    <Callout kind={kindMap[note.kind]} title={note.title}>
      {note.body}
    </Callout>
  )
}
