import { useEffect, useRef, useState } from 'react'
import { Wawa } from '@/brand/Wawa'
import {
  Button, Callout, Card, Chip, Icon, SectionTitle, Spinner, Tabs, cx, Mono,
} from '@/components/ui'
import { LANGUAGES } from '@/data/languages'
import { useProgress } from '@/store/useProgress'
import type { LangId } from '@/data/types'
import {
  askTutor, generateQuestions, hasGeminiKey, geminiModel, explainError,
  type ChatTurn, type GeneratedQuestion,
} from '@/lib/gemini'

type Mode = 'chat' | 'soal'

export default function Tutor() {
  const [mode, setMode] = useState<Mode>('chat')
  const activeLang = useProgress((s) => s.activeLang)
  const lang = LANGUAGES[activeLang]

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="Ditenagai Gemini Flash"
        title="Tanya Wawa"
        sub="Tanya apa saja tentang bahasa yang sedang kamu pelajari, atau minta Wawa membuatkan soal latihan baru."
        right={<Chip color="grape" icon="bot">{geminiModel()}</Chip>}
      />

      {!hasGeminiKey() ? <SetupNotice /> : null}

      <Tabs
        tabs={[
          { id: 'chat' as const, label: 'Ngobrol', icon: 'chat' },
          { id: 'soal' as const, label: 'Buat soal', icon: 'wand' },
        ]}
        value={mode}
        onChange={setMode}
      />

      {mode === 'chat' ? <ChatPanel langName={lang.name} langId={activeLang} /> : <GeneratorPanel />}
    </div>
  )
}

/* ============================== setup notice ============================== */

function SetupNotice() {
  return (
    <Card tone="cream" className="!border-amber-200">
      <div className="flex flex-wrap items-start gap-4">
        <Wawa expression="teach" size={92} cropped className="shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg text-ink">Kunci API belum diatur</h3>
          <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">
            Fitur ini memakai Google Gemini. Ambil kunci gratis, lalu simpan di berkas{' '}
            <code className="rounded bg-shell px-1.5 py-0.5 font-mono text-[13px]">.env</code>{' '}
            di folder <code className="rounded bg-shell px-1.5 py-0.5 font-mono text-[13px]">wawa-app/</code>:
          </p>
          <Mono>{'VITE_GEMINI_API_KEY=kunci_anda_di_sini\nVITE_GEMINI_MODEL=gemini-2.5-flash'}</Mono>
          <p className="mt-2 text-[13px] text-ink-soft">
            Lalu jalankan ulang <code className="rounded bg-shell px-1.5 py-0.5 font-mono text-[12.5px]">npm run dev</code>{' '}
            (Vite hanya membaca .env saat start).
          </p>
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer noopener">
            <Button className="mt-3" iconRight="external">Ambil kunci di Google AI Studio</Button>
          </a>
        </div>
      </div>

      <Callout kind="warning" title="Catatan keamanan yang perlu Anda tahu">
        Aplikasi ini memanggil Gemini <strong className="text-ink">langsung dari browser</strong>, jadi
        kunci API ikut terbundel ke dalam berkas JavaScript dan bisa dibaca siapa pun yang membuka
        aplikasi. Aman untuk pemakaian lokal atau deployment pribadi dengan kunci yang dibatasi dan
        berkuota. <strong className="text-ink">Jangan dipakai untuk situs publik</strong> — untuk itu,
        pindahkan pemanggilannya ke server Anda sendiri dan simpan kuncinya di sana.
      </Callout>
    </Card>
  )
}

/* ================================= chat ================================= */

const STARTERS: Record<LangId, string[]> = {
  jp: [
    'Apa bedanya は dan が? Beri contoh yang jelas.',
    'Kenapa 学校 dibaca がっこう, bukan がくこう?',
    'Bedah kanji 部 — radikal dan komponen bunyinya apa?',
    'Buat latihan singkat partikel を untuk level N5.',
  ],
  cn: [
    'Jelaskan nada 3 Mandarin dan kapan berubah jadi nada 2.',
    'Apa bedanya 会 dan 能?',
    'Bedah hanzi 请 — radikal dan komponen bunyinya apa?',
    'Buat latihan singkat 把 untuk tingkat HSK 3.',
  ],
  kr: [
    'Kapan pakai 에 dan kapan pakai 에서?',
    'Jelaskan perubahan bunyi pada 한국말.',
    'Apa beda konsonan ㅂ, ㅍ, dan ㅃ?',
    'Buat latihan singkat partikel 은/는.',
  ],
  en: [
    'Apa kesalahan grammar Inggris yang paling sering dilakukan orang Indonesia?',
    'Jelaskan perbedaan present perfect dan simple past.',
    'Buat latihan connected speech tingkat B1.',
    'Koreksi satu contoh jawaban IELTS Speaking Part 1.',
  ],
}

function ChatPanel({ langName, langId }: { langName: string; langId: LangId }) {
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abort = useRef<AbortController | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [turns, busy])
  useEffect(() => () => abort.current?.abort(), [])

  const send = async (text: string) => {
    const q = text.trim()
    if (!q || busy) return
    setInput('')
    setError(null)
    setTurns((t) => [...t, { role: 'user', text: q }])
    setBusy(true)

    abort.current = new AbortController()
    try {
      const answer = await askTutor(turns, q, { lang: langName }, abort.current.signal)
      setTurns((t) => [...t, { role: 'model', text: answer }])
    } catch (e) {
      setError(explainError(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="!p-0 overflow-hidden">
      <div className="max-h-[58vh] min-h-[340px] space-y-4 overflow-y-auto p-5">
        {turns.length === 0 ? (
          <div className="py-6 text-center">
            <Wawa expression="wave" size={130} className="mx-auto anim-bob" />
            <p className="mt-2 text-[14.5px] font-bold text-ink-soft">
              Tanya apa saja — Wawa menjawab dalam Bahasa Indonesia.
            </p>
            <div className="mx-auto mt-4 grid max-w-xl gap-2 sm:grid-cols-2">
              {STARTERS[langId].map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  disabled={!hasGeminiKey()}
                  className="rounded-2xl border-2 border-sand bg-cream p-3 text-left text-[13px] font-semibold text-ink-soft transition-colors hover:bg-paper disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {turns.map((t, i) => <Bubble key={i} turn={t} />)}

        {busy ? (
          <div className="flex items-start gap-3">
            <Wawa expression="thinking" size={44} cropped className="shrink-0" />
            <div className="rounded-2xl rounded-tl-md border-2 border-sand bg-cream px-4 py-3">
              <Spinner size={17} className="text-teal-500" />
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border-2 border-coral-200 bg-coral-50 px-4 py-3 text-[13.5px] font-semibold text-coral-600">
            {error}
          </div>
        ) : null}

        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input) }}
        className="flex items-end gap-2 border-t-2 border-sand bg-shell p-3"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
          }}
          rows={1}
          disabled={!hasGeminiKey()}
          placeholder={hasGeminiKey() ? 'Tulis pertanyaanmu… (Enter kirim, Shift+Enter baris baru)' : 'Atur kunci API dulu'}
          className="max-h-32 min-h-[46px] flex-1 resize-y rounded-2xl border-2 border-sand bg-paper px-4 py-3 text-[14.5px] font-semibold text-ink outline-none placeholder:text-ink-faint focus:border-teal-400 disabled:opacity-60"
        />
        {busy ? (
          <Button type="button" variant="secondary" icon="close" onClick={() => abort.current?.abort()}>
            Stop
          </Button>
        ) : (
          <Button type="submit" icon="send" disabled={!input.trim() || !hasGeminiKey()}>
            Kirim
          </Button>
        )}
      </form>
    </Card>
  )
}

function Bubble({ turn }: { turn: ChatTurn }) {
  const isUser = turn.role === 'user'
  return (
    <div className={cx('flex items-start gap-3', isUser && 'flex-row-reverse')}>
      {isUser ? (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-sand bg-paper text-ink-faint">
          <Icon name="profile" size={17} />
        </span>
      ) : (
        <Wawa expression="teach" size={40} cropped className="shrink-0" />
      )}
      <div
        className={cx(
          'max-w-[85%] rounded-2xl border-2 px-4 py-3 text-[14.5px] leading-relaxed',
          isUser
            ? 'rounded-tr-md border-teal-200 bg-teal-50 text-ink'
            : 'rounded-tl-md border-sand bg-cream text-ink-soft',
        )}
      >
        <Markdown text={turn.text} />
      </div>
    </div>
  )
}

/** Tiny markdown renderer — bold, inline code, bullets, and CJK-safe text. */
function Markdown({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return null
        const bullet = /^\s*[-*]\s+/.test(line)
        const content = bullet ? line.replace(/^\s*[-*]\s+/, '') : line
        return (
          <p key={i} className={cx(bullet && 'flex gap-2')}>
            {bullet ? <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" /> : null}
            <span className="min-w-0">{inline(content)}</span>
          </p>
        )
      })}
    </div>
  )
}

function inline(s: string) {
  const parts = s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={i} className="text-ink">{p.slice(2, -2)}</strong>
    }
    if (p.startsWith('`') && p.endsWith('`')) {
      return <code key={i} className="rounded bg-shell px-1 py-0.5 font-mono text-[13px] text-ink">{p.slice(1, -1)}</code>
    }
    return <span key={i}>{p}</span>
  })
}

/* ============================== generator ============================== */

const TOPIC_IDEAS: Record<string, string[]> = {
  Jepang: ['partikel は vs が', 'bentuk て', 'keigo dasar', 'kanji alam', 'mora & vokal panjang', 'kosakata N5'],
  Mandarin: ['empat nada', 'kata bantu bilangan 量词', 'partikel 了', 'urutan keterangan', 'radikal hanzi', 'kosakata HSK 2'],
  Korea: ['partikel 은/는 vs 이/가', 'batchim & 연음', 'tingkat tutur 해요체', 'dua sistem angka', 'kosakata TOPIK 1'],
  Inggris: ['collocation akademik', 'mixed conditionals', 'artikel a/an/the', 'kesalahan khas pelajar Indonesia', 'kosakata AWL'],
}

function GeneratorPanel() {
  const activeLang = useProgress((s) => s.activeLang)
  const lang = LANGUAGES[activeLang]

  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState(lang.levels[0])
  const [count, setCount] = useState(5)
  const [items, setItems] = useState<GeneratedQuestion[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { setLevel(lang.levels[0]); setItems(null) }, [lang])

  const run = async () => {
    if (!topic.trim() || busy) return
    setBusy(true); setError(null); setItems(null)
    try {
      setItems(await generateQuestions(topic.trim(), lang.name, level, count))
    } catch (e) {
      setError(explainError(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-ink-faint">
            Topik soal
          </label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
            disabled={!hasGeminiKey()}
            placeholder="mis. partikel に vs で, atau kosakata makanan"
            className="w-full rounded-2xl border-2 border-sand bg-paper px-4 py-3 text-[15px] font-semibold text-ink outline-none placeholder:text-ink-faint focus:border-teal-400 disabled:opacity-60"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(TOPIC_IDEAS[lang.name] ?? []).map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className="rounded-xl border-2 border-sand bg-cream px-2.5 py-1 text-[12px] font-bold text-ink-soft hover:bg-paper"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-ink-faint">
              Tingkat
            </label>
            <div className="flex flex-wrap gap-1.5">
              {lang.levels.map((lv) => (
                <button
                  key={lv}
                  onClick={() => setLevel(lv)}
                  className={cx(
                    'rounded-xl border-2 px-3 py-1.5 text-[12.5px] font-extrabold',
                    level === lv ? 'border-teal-500 bg-teal-500 text-white' : 'border-sand bg-paper text-ink-soft',
                  )}
                >
                  {lv}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-ink-faint">
              Jumlah soal
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[3, 5, 8, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={cx(
                    'rounded-xl border-2 px-3.5 py-1.5 text-[12.5px] font-extrabold',
                    count === n ? 'border-teal-500 bg-teal-500 text-white' : 'border-sand bg-paper text-ink-soft',
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button full size="lg" icon="wand" onClick={run} disabled={!topic.trim() || busy || !hasGeminiKey()}>
          {busy ? 'Wawa sedang menyusun soal…' : 'Buatkan soal'}
        </Button>

        {error ? (
          <div className="rounded-2xl border-2 border-coral-200 bg-coral-50 px-4 py-3 text-[13.5px] font-semibold text-coral-600">
            {error}
          </div>
        ) : null}
      </Card>

      {busy ? (
        <Card className="flex flex-col items-center gap-3 py-14">
          <Wawa expression="thinking" size={110} className="anim-bob" />
          <Spinner size={22} className="text-teal-500" />
        </Card>
      ) : null}

      {items?.length ? <QuizRunner items={items} onRegenerate={run} /> : null}

      {items && items.length === 0 ? (
        <Callout kind="warning" title="Tidak ada soal yang valid">
          Model mengembalikan format yang tidak sesuai. Coba jalankan lagi atau persempit topiknya.
        </Callout>
      ) : null}

      <Callout kind="tip" title="Soal buatan AI adalah latihan tambahan, bukan pengganti kurikulum">
        Jalur belajar utama ditulis dan diperiksa manusia. Soal di sini bagus untuk mengulang topik yang
        baru saja kamu pelajari — tapi kalau ada penjelasan yang bertentangan dengan materi unit,{' '}
        <strong className="text-ink">materi unit yang benar</strong>.
      </Callout>
    </div>
  )
}

function QuizRunner({ items, onRegenerate }: { items: GeneratedQuestion[]; onRegenerate: () => void }) {
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => { setIdx(0); setPicked(null); setScore(0); setDone(false) }, [items])

  const q = items[idx]
  const locked = picked !== null

  const next = () => {
    if (idx + 1 >= items.length) { setDone(true); return }
    setIdx(idx + 1)
    setPicked(null)
  }

  if (done) {
    const pct = Math.round((score / items.length) * 100)
    return (
      <Card className="py-8 text-center">
        <Wawa expression={pct >= 80 ? 'celebrate' : pct >= 50 ? 'happy' : 'thinking'} size={160} className="mx-auto anim-pop" />
        <div className="mt-3 font-display text-[52px] font-extrabold leading-none text-ink">{pct}%</div>
        <p className="mt-1 text-[14px] text-ink-soft">{score} dari {items.length} benar</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          <Button icon="reset" onClick={() => { setIdx(0); setPicked(null); setScore(0); setDone(false) }}>
            Ulangi
          </Button>
          <Button variant="secondary" icon="wand" onClick={onRegenerate}>Soal baru</Button>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <Chip color="grape" icon="bot">Soal {idx + 1} dari {items.length}</Chip>
        {q.skill ? <Chip size="sm" color="teal">{q.skill}</Chip> : null}
      </div>

      {q.display ? (
        <div className="mb-4 rounded-3xl border-2 border-sand bg-cream px-6 py-6 text-center">
          <div className="font-cjk text-[42px] leading-tight text-ink">{q.display}</div>
          {q.reading ? <div className="mt-1 text-[13.5px] font-bold text-ink-faint">{q.reading}</div> : null}
        </div>
      ) : null}

      <h3 className="mb-4 text-[19px] leading-snug text-ink">{q.prompt}</h3>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {q.options.map((opt, i) => {
          const isAnswer = i === q.answer
          const state = !locked ? 'idle' : isAnswer ? 'right' : i === picked ? 'wrong' : 'idle'
          return (
            <button
              key={i}
              disabled={locked}
              onClick={() => { setPicked(i); if (i === q.answer) setScore((s) => s + 1) }}
              className={cx(
                'rounded-2xl border-2 px-4 py-3.5 text-left text-[15px] font-bold transition-colors',
                'shadow-[0_3px_0_0_var(--color-drop)] active:translate-y-[2px] active:shadow-none',
                state === 'idle' && 'border-sand bg-paper text-ink hover:bg-cream',
                state === 'right' && 'border-leaf-400 bg-leaf-50 text-leaf-600',
                state === 'wrong' && 'border-coral-400 bg-coral-50 text-coral-600',
              )}
            >
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-lg border-2 border-current text-[11px] font-extrabold opacity-60">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          )
        })}
      </div>

      {locked ? (
        <div className={cx('mt-4 rounded-2xl border-2 p-4', picked === q.answer ? 'border-leaf-200 bg-leaf-50' : 'border-coral-200 bg-coral-50')}>
          <div className={cx('mb-1 font-display text-[15px] font-extrabold', picked === q.answer ? 'text-leaf-600' : 'text-coral-600')}>
            {picked === q.answer ? 'Benar!' : 'Belum tepat'}
          </div>
          <p className="text-[14px] leading-relaxed text-ink-soft">{q.explain}</p>
          <Button full className="mt-3" variant={picked === q.answer ? 'success' : 'danger'} onClick={next}>
            {idx + 1 >= items.length ? 'Lihat hasil' : 'Lanjut'}
          </Button>
        </div>
      ) : null}
    </Card>
  )
}
