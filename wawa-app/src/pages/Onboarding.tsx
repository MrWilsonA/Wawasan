import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wawa } from '@/brand/Wawa'
import { Logo } from '@/brand/Logo'
import { Button, Card, Chip, Icon, FlagIcon, cx } from '@/components/ui'
import { LANGUAGES, langList } from '@/data/languages'
import { tint } from '@/lib/tint'
import type { LangId } from '@/data/types'
import { useProgress } from '@/store/useProgress'
import { PRINCIPLES } from '@/data/reference'
import { playSound, startBgm } from '@/lib/sound'

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [lang, setLang] = useState<LangId | null>(null)
  const [goal, setGoal] = useState(60)
  const init = useProgress((s) => s.init)
  const navigate = useNavigate()

  const finish = () => {
    playSound('tap')
    startBgm()
    init(name.trim() || 'Pelajar', lang ?? 'jp', goal)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-shell bg-dots">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <Logo size={42} badgeColor={lang ? LANGUAGES[lang].color : '#00a191'} />
          <div className="flex gap-1.5" aria-label={`Langkah ${step + 1} dari 4`}>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cx('h-2.5 rounded-full transition-all', i <= step ? 'w-7 bg-teal-500' : 'w-2.5 bg-sand')}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          {step === 0 ? <StepWelcome onNext={() => setStep(1)} /> : null}
          {step === 1 ? <StepName name={name} setName={setName} onNext={() => setStep(2)} /> : null}
          {step === 2 ? <StepLang lang={lang} setLang={setLang} onNext={() => setStep(3)} /> : null}
          {step === 3 ? <StepGoal goal={goal} setGoal={setGoal} lang={lang!} onFinish={finish} /> : null}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------- Step 0 ------------------------------- */
function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="anim-rise grid w-full items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <Chip color="amber" className="mb-4" icon="star">Bahasa pengantar: Indonesia</Chip>
        <h1 className="text-[38px] leading-[1.08] text-ink sm:text-[52px]">
          Belajar <span className="font-cjk text-jp">日本語</span>,{' '}
          <span className="font-cjk text-cn">汉语</span>,{' '}
          <span className="font-cjk text-kr">한국어</span>, dan{' '}
          <span className="text-en">English</span> — dari nol.
        </h1>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-soft">
          Kurikulum berjenjang penuh sampai <strong className="text-ink">JLPT N1</strong>,{' '}
          <strong className="text-ink">HSK 9</strong>, <strong className="text-ink">TOPIK 6</strong>, dan{' '}
          <strong className="text-ink">IELTS 8.5</strong>. Dijelaskan dalam Bahasa Indonesia, dengan
          jebakan-jebakan yang khusus menimpa pelajar Indonesia.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {['JLPT N5→N1', 'HSK 1→9', 'TOPIK 1→6', 'IELTS & TOEFL 2026'].map((t) => (
            <Chip key={t} color="teal">{t}</Chip>
          ))}
        </div>

        <Button size="lg" className="mt-8" onClick={onNext} iconRight="right">Mulai perjalanan</Button>
      </div>

      <div className="relative flex justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-64 w-64 rounded-full border-4 border-dashed border-teal-200" />
        </div>
        <div className="anim-bob relative">
          <Wawa expression="wave" size={260} title="Wawa, maskot WAWAさん" />
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-2xl border-2 border-sand bg-paper px-4 py-2 text-center shadow-[0_4px_0_0_var(--color-drop)]">
          <div className="font-display text-[15px] font-extrabold text-ink">Wawa</div>
          <div className="text-[11px] text-ink-faint">Tarsius dari Sulawesi</div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------- Step 1 ------------------------------- */
function StepName({ name, setName, onNext }: { name: string; setName: (v: string) => void; onNext: () => void }) {
  return (
    <Card className="anim-rise w-full max-w-lg text-center">
      <div className="mb-2 flex justify-center"><Wawa expression="happy" size={140} /></div>
      <h2 className="text-2xl">Kenalan dulu, yuk!</h2>
      <p className="mt-1.5 text-[14.5px] text-ink-soft">Wawa mau memanggil kamu apa?</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onNext()}
        placeholder="Nama panggilan"
        maxLength={20}
        autoFocus
        className="mt-5 w-full rounded-2xl border-2 border-sand bg-cream px-4 py-3.5 text-center font-display text-lg font-extrabold text-ink outline-none placeholder:font-sans placeholder:font-semibold placeholder:text-ink-faint focus:border-teal-400"
      />
      <Button size="lg" full className="mt-4" onClick={onNext} iconRight="right">Lanjut</Button>
      <button onClick={onNext} className="mt-3 text-[13px] font-bold text-ink-faint underline underline-offset-4">
        Lewati
      </button>
    </Card>
  )
}

/* ------------------------------- Step 2 ------------------------------- */
function StepLang({ lang, setLang, onNext }: { lang: LangId | null; setLang: (l: LangId) => void; onNext: () => void }) {
  return (
    <div className="anim-rise w-full max-w-3xl">
      <div className="mb-5 text-center">
        <h2 className="text-3xl">Mau mulai dari bahasa apa?</h2>
        <p className="mt-1.5 text-[14.5px] text-ink-soft">
          Bisa tambah bahasa lain kapan saja — tapi jangan mulai dua bahasa baru di gerbang yang sama.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {langList().map((l) => {
          const active = lang === l.id
          return (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              aria-pressed={active}
              className={cx(
                'rounded-3xl border-2 p-5 text-left transition-all',
                active ? 'shadow-[0_5px_0_0_var(--color-drop)]' : 'border-sand bg-paper hover:bg-cream',
              )}
              style={active ? { borderColor: l.color, backgroundColor: tint(l.color) } : undefined}
            >
              <div className="flex items-center gap-3">
                <FlagIcon lang={l.id} size={30} />
                <span className="leading-tight">
                  <span className="block font-display text-xl font-extrabold text-ink">{l.name}</span>
                  <span className="block font-cjk text-[15px] text-ink-soft">{l.nativeName}</span>
                </span>
                <span className="ml-auto">
                  <span
                    className="rounded-full border-2 px-2.5 py-1 text-[11px] font-extrabold text-white"
                    style={{ backgroundColor: l.color, borderColor: l.color }}
                  >
                    {l.exam}
                  </span>
                </span>
              </div>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">{l.hookForIndonesians}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Chip size="sm" color="ink">{l.script}</Chip>
                <Chip size="sm" color="ink">{l.wordOrder}</Chip>
              </div>
            </button>
          )
        })}
      </div>

      <Button size="lg" full className="mt-5" disabled={!lang} onClick={onNext}>
        {lang ? `Belajar ${LANGUAGES[lang].name}` : 'Pilih satu bahasa dulu'}
      </Button>
    </div>
  )
}

/* ------------------------------- Step 3 ------------------------------- */
const GOALS = [
  { min: 15, label: 'Santai', desc: '15 menit/hari', icon: 'seedling' as const },
  { min: 30, label: 'Serius', desc: '30 menit/hari', icon: 'leaf' as const },
  { min: 60, label: 'Sesi penuh', desc: '60 menit — template resmi WAWAさん', icon: 'tree' as const },
  { min: 120, label: 'Intensif', desc: '2 jam/hari', icon: 'streak' as const },
]

function StepGoal({
  goal, setGoal, lang, onFinish,
}: { goal: number; setGoal: (g: number) => void; lang: LangId; onFinish: () => void }) {
  const l = LANGUAGES[lang]
  return (
    <div className="anim-rise w-full max-w-3xl">
      <div className="mb-5 text-center">
        <div className="mb-2 flex justify-center">
          <Wawa expression="excited" size={130} accent={l.color} />
        </div>
        <h2 className="text-3xl">Berapa lama per hari?</h2>
        <p className="mt-1.5 text-[14.5px] text-ink-soft">
          Faktor terbesar bukan bakat, melainkan <strong className="text-ink">konsistensi harian</strong>.
        </p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {GOALS.map((g) => (
          <button
            key={g.min}
            onClick={() => setGoal(g.min)}
            aria-pressed={goal === g.min}
            className={cx(
              'flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-colors',
              goal === g.min ? 'border-teal-400 bg-teal-50' : 'border-sand bg-paper hover:bg-cream',
            )}
          >
            <Icon name={g.icon} size={22} className="text-ink-soft" />
            <span className="leading-tight">
              <span className="block font-display text-[16px] font-extrabold text-ink">{g.label}</span>
              <span className="block text-[13px] text-ink-soft">{g.desc}</span>
            </span>
          </button>
        ))}
      </div>

      <Card tone="cream" className="mt-5">
        <div className="mb-2 font-display text-[15px] font-extrabold text-ink">Lima prinsip yang akan kamu ikuti</div>
        <ol className="grid gap-1.5 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <li key={p.n} className="flex gap-2 text-[13.5px] text-ink-soft">
              <Icon name={p.icon} size={15} />
              <span><strong className="text-ink">{p.title}</strong> — {p.subtitle}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Button size="lg" full className="mt-5" onClick={onFinish} iconRight="right">Masuk ke WAWAさん</Button>
    </div>
  )
}
