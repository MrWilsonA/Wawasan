import { Link } from 'react-router-dom'
import { Wawa } from '@/brand/Wawa'
import { Button, Callout, Card, Chip, DataTable, Mono, SectionTitle, cx } from '@/components/ui'
import { PRINCIPLES, GATE_RULE, MIN_SKILL_RULE, GRADE_RUBRIC, DAILY_TEMPLATE, WEEKLY_RHYTHM, WEEKLY_NOTE } from '@/data/reference'
import { LANGUAGES, langList } from '@/data/languages'
import { gatesFor } from '@/data/curriculum'
import { useProgress } from '@/store/useProgress'

const TONE: Record<string, string> = {
  sky: 'border-sky-200 bg-sky-50', amber: 'border-amber-200 bg-amber-50',
  coral: 'border-coral-200 bg-coral-50', grape: 'border-grape-200 bg-grape-50',
  leaf: 'border-leaf-200 bg-leaf-50',
}

export default function Method() {
  const activeLang = useProgress((s) => s.activeLang)
  const gates = gatesFor(activeLang)

  return (
    <div className="space-y-6">
      <Card className="!p-0 overflow-hidden">
        <div className="grid md:grid-cols-[1fr_auto]">
          <div className="p-6">
            <Chip color="teal" className="mb-3">Filosofi & Metode</Chip>
            <h1 className="text-3xl leading-tight sm:text-[38px]">Lima prinsip yang tidak bisa ditawar</h1>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-soft">
              WAWAさん dibangun di atas lima prinsip. Setiap modul di platform ini wajib mematuhi kelimanya —
              termasuk urutan gerbang yang tidak boleh dilompati.
            </p>
          </div>
          <div className="flex items-end justify-center bg-cream p-6 md:w-[260px]">
            <Wawa expression="teach" size={170} className="anim-bob" />
          </div>
        </div>
      </Card>

      {/* -------------------- Principles -------------------- */}
      <div className="grid gap-4 md:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <Card key={p.n} className={cx('!border-2', TONE[p.color])}>
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-white bg-white text-2xl">
                {p.icon}
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink-faint">
                  Prinsip {p.n}
                </div>
                <h3 className="text-lg leading-tight text-ink">{p.title}</h3>
                <div className="text-[12.5px] font-bold italic text-ink-faint">{p.subtitle}</div>
              </div>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{p.body}</p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {p.flow.map((f, i) => (
                <span key={f + i} className="contents">
                  <span className="rounded-lg border-2 border-white bg-white px-2.5 py-1 font-cjk text-[13px] font-extrabold text-ink">
                    {f}
                  </span>
                  {i < p.flow.length - 1 ? <span className="text-ink-faint" aria-hidden>→</span> : null}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* -------------------- Prinsip 4 illustration -------------------- */}
      <Card>
        <SectionTitle eyebrow="Prinsip 4 dalam praktik" title="Satu konsep baru per sesi" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-coral-200 bg-coral-50 p-4">
            <div className="mb-1.5 font-display text-[14px] font-extrabold text-coral-600">❌ Cara yang membingungkan</div>
            <p className="font-cjk text-[15px] text-ink-soft">
              “Pelajari partikel は、が、を、に、で sekaligus”
            </p>
          </div>
          <div className="rounded-2xl border-2 border-leaf-200 bg-leaf-50 p-4">
            <div className="mb-1.5 font-display text-[14px] font-extrabold text-leaf-600">✅ Cara WAWAさん</div>
            <p className="text-[13.5px] leading-relaxed text-ink-soft">
              Unit 4: hanya <span className="font-cjk">は</span>. Unit 5: hanya <span className="font-cjk">を</span>{' '}
              (memakai kosakata Unit 4). Unit 6: <span className="font-cjk">が</span> dikontraskan dengan{' '}
              <span className="font-cjk">は</span> yang sudah dikuasai.
            </p>
          </div>
        </div>
      </Card>

      {/* -------------------- Gates -------------------- */}
      <Card>
        <SectionTitle
          eyebrow="Alur belajar wajib"
          title="Enam gerbang — urutan tidak boleh dilompati"
          sub={`Ditampilkan untuk ${LANGUAGES[activeLang].name}. Setiap bahasa mengikuti struktur yang sama.`}
          right={
            <Link to={`/belajar/${activeLang}`}>
              <Button size="sm" variant="secondary">Buka jalur</Button>
            </Link>
          }
        />
        <div className="space-y-2.5">
          {gates.map((g, i) => (
            <div key={g.index} className="relative">
              <div className="flex items-start gap-3 rounded-2xl border-2 border-sand bg-white p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-sand bg-cream text-xl">
                  {g.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-[16px] font-extrabold text-ink">
                      GERBANG {g.index} — {g.title.toUpperCase()}
                    </span>
                    <Chip size="sm" color="ink">⏱ {g.duration}</Chip>
                  </div>
                  <p className="mt-0.5 text-[13.5px] text-ink-soft">{g.subtitle}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {g.units.map((u) => (
                      <Chip key={u.id} size="sm" color="teal">{u.title}</Chip>
                    ))}
                  </div>
                </div>
              </div>
              {i < gates.length - 1 ? (
                <div className="flex justify-center py-1 text-xl text-ink-faint" aria-hidden>▼</div>
              ) : null}
            </div>
          ))}
        </div>
        <Callout kind="warning" title="Aturan kelulusan gerbang">{GATE_RULE}</Callout>
      </Card>

      {/* -------------------- Scoring -------------------- */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle eyebrow="Sistem penilaian internal" title="Rubrik kuis" />
          <div className="space-y-2">
            {GRADE_RUBRIC.map((r) => (
              <div
                key={r.label}
                className={cx(
                  'flex items-start gap-3 rounded-2xl border-2 p-3.5',
                  r.color === 'leaf' ? 'border-leaf-200 bg-leaf-50'
                    : r.color === 'teal' ? 'border-teal-200 bg-teal-50'
                      : r.color === 'amber' ? 'border-amber-200 bg-amber-50'
                        : 'border-coral-200 bg-coral-50',
                )}
              >
                <span className="w-[74px] shrink-0 font-display text-[15px] font-extrabold text-ink">
                  {r.min === 95 ? '95–100%' : r.min === 85 ? '85–94%' : r.min === 70 ? '70–84%' : '< 70%'}
                </span>
                <span className="min-w-0">
                  <span className="block font-cjk text-[15px] font-bold text-ink">{r.label}</span>
                  <span className="block text-[13px] leading-relaxed text-ink-soft">{r.action}</span>
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle eyebrow="MIN, bukan rata-rata" title="Nilai gerbang" />
          <Mono>{'Nilai Gerbang = MIN(Menyimak, Membaca, Menulis, Berbicara)'}</Mono>
          <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{MIN_SKILL_RULE}</p>
          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            {[
              { k: 'Menyimak', v: 60, bad: true },
              { k: 'Membaca', v: 95 },
              { k: 'Menulis', v: 88 },
              { k: 'Berbicara', v: 82 },
            ].map((s) => (
              <div
                key={s.k}
                className={cx(
                  'rounded-2xl border-2 p-3',
                  s.bad ? 'border-coral-300 bg-coral-50' : 'border-sand bg-white',
                )}
              >
                <div className={cx('font-display text-xl font-extrabold', s.bad ? 'text-coral-600' : 'text-ink')}>
                  {s.v}%
                </div>
                <div className="text-[10.5px] font-bold uppercase text-ink-faint">{s.k}</div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-[13px] font-bold text-coral-600">
            → Nilai gerbang = 60%, bukan 81% (rata-rata)
          </p>
        </Card>
      </div>

      {/* -------------------- Routine -------------------- */}
      <Card>
        <SectionTitle eyebrow="Rutinitas" title="Sesi harian & ritme mingguan" />
        <DataTable
          head={['Menit', 'Aktivitas', 'Detail', 'Tujuan']}
          rows={DAILY_TEMPLATE.map((t) => [
            <strong key="m" className="text-ink">{t.range}</strong>,
            `${t.icon} ${t.activity}`, t.detail, t.goal,
          ])}
          dense
        />
        <div className="mt-4">
          <DataTable
            head={['Hari', 'Fokus']}
            rows={WEEKLY_RHYTHM.map((d) => [<strong key="d" className="text-ink">{d.day}</strong>, d.focus])}
            dense
          />
        </div>
        <Callout kind="tip" title="Kenapa Jumat tanpa materi baru">{WEEKLY_NOTE}</Callout>
      </Card>

      {/* -------------------- Languages -------------------- */}
      <Card>
        <SectionTitle eyebrow="Empat bahasa" title="Apa yang membuat masing-masing sulit bagi kita" />
        <div className="grid gap-3 sm:grid-cols-2">
          {langList().map((l) => (
            <Link
              key={l.id}
              to={`/belajar/${l.id}`}
              className="rounded-2xl border-2 p-4 transition-colors hover:bg-cream"
              style={{ borderColor: l.color, backgroundColor: l.colorSoft }}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl" aria-hidden>{l.flag}</span>
                <span className="font-display text-[16px] font-extrabold text-ink">{l.name}</span>
                <span className="font-cjk text-[14px] text-ink-soft">{l.nativeName}</span>
                <span className="ml-auto text-[12px] font-extrabold" style={{ color: l.color }}>{l.exam}</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{l.hookForIndonesians}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
