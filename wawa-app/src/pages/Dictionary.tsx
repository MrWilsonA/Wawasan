import { useEffect, useState } from 'react'
import { Wawa } from '@/brand/Wawa'
import {
  Button, Callout, Card, Chip, Icon, SearchInput, SectionTitle, Spinner, cx,
} from '@/components/ui'
import { useProgress } from '@/store/useProgress'

/* ----------------------------- dictionaryapi.dev ----------------------------- */

type Phonetic = { text?: string; audio?: string }
type Definition = { definition: string; example?: string; synonyms?: string[]; antonyms?: string[] }
type Meaning = { partOfSpeech: string; definitions: Definition[]; synonyms?: string[]; antonyms?: string[] }
type Entry = {
  word: string
  phonetic?: string
  phonetics?: Phonetic[]
  meanings?: Meaning[]
  sourceUrls?: string[]
  license?: { name: string; url: string }
}

const POS_ID: Record<string, string> = {
  noun: 'kata benda', verb: 'kata kerja', adjective: 'kata sifat', adverb: 'kata keterangan',
  pronoun: 'kata ganti', preposition: 'kata depan', conjunction: 'kata sambung',
  interjection: 'kata seru', determiner: 'determinatif', exclamation: 'kata seru',
  numeral: 'numeralia', article: 'artikel',
}

/* Words worth looking up first — the AWL/collocation set from the IELTS module. */
const SUGGESTED = [
  'conduct', 'substantial', 'crucial', 'demonstrate', 'illustrate', 'obtain',
  'pivotal', 'arguably', 'implementation', 'nevertheless', 'consequently',
  'phenomenon', 'significant', 'hypothesis', 'paramount',
]

export default function Dictionary() {
  const [q, setQ] = useState('')
  const [term, setTerm] = useState('')
  const [data, setData] = useState<Entry[] | null>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'notfound'>('idle')
  const [history, setHistory] = useState<string[]>([])
  const seedCards = useProgress((s) => s.seedCards)
  const [added, setAdded] = useState<string | null>(null)

  const look = async (word: string) => {
    const w = word.trim().toLowerCase()
    if (!w) return
    setTerm(w)
    setState('loading')
    setData(null)
    setAdded(null)
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(w)}`)
      if (res.status === 404) { setState('notfound'); return }
      if (!res.ok) throw new Error(String(res.status))
      const json = (await res.json()) as Entry[]
      setData(json)
      setState('idle')
      setHistory((h) => [w, ...h.filter((x) => x !== w)].slice(0, 12))
    } catch {
      setState('error')
    }
  }

  const addCard = (e: Entry) => {
    const first = e.meanings?.[0]?.definitions?.[0]?.definition ?? ''
    seedCards([{
      id: `en-${e.word}`,
      front: e.word,
      back: first,
      reading: e.phonetic ?? e.phonetics?.find((p) => p.text)?.text,
      lang: 'en',
      tag: 'Kosakata',
    }])
    setAdded(e.word)
  }

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="Gerbang 2 — Kosakata Akademik"
        title="Kamus Inggris"
        sub="Definisi, pelafalan, contoh kalimat, sinonim & antonim — langsung dari dictionaryapi.dev, gratis dan tanpa kunci API."
      />

      <Card className="space-y-3">
        <form onSubmit={(e) => { e.preventDefault(); look(q) }}>
          <SearchInput value={q} onChange={setQ} placeholder="Ketik kata bahasa Inggris lalu tekan Enter…" autoFocus />
        </form>

        <div>
          <div className="mb-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-ink-faint">
            Kata Academic Word List untuk dicoba
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED.map((w) => (
              <button
                key={w}
                onClick={() => { setQ(w); look(w) }}
                className="rounded-xl border-2 border-sand bg-paper px-2.5 py-1 text-[12.5px] font-bold text-ink-soft hover:bg-cream"
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {history.length > 0 ? (
          <div>
            <div className="mb-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-ink-faint">
              Riwayat
            </div>
            <div className="flex flex-wrap gap-1.5">
              {history.map((w) => (
                <button
                  key={w}
                  onClick={() => { setQ(w); look(w) }}
                  className="rounded-full border-2 border-teal-200 bg-teal-50 px-2.5 py-0.5 text-[12px] font-bold text-teal-700"
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </Card>

      {state === 'loading' ? (
        <Card className="flex flex-col items-center gap-3 py-14">
          <Spinner size={28} className="text-teal-500" />
          <span className="text-[14px] font-bold text-ink-soft">Mencari “{term}”…</span>
        </Card>
      ) : null}

      {state === 'notfound' ? (
        <Card className="py-10 text-center">
          <Wawa expression="thinking" size={130} className="mx-auto" />
          <h3 className="mt-2 text-xl">Kata “{term}” tidak ditemukan</h3>
          <p className="mx-auto mt-1.5 max-w-md text-[14px] text-ink-soft">
            Periksa ejaannya, atau coba bentuk dasarnya (mis. <em>running</em> → <em>run</em>).
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <a href={`https://www.oxfordlearnersdictionaries.com/definition/english/${encodeURIComponent(term)}`} target="_blank" rel="noreferrer noopener">
              <Button variant="secondary" iconRight="external">Cari di Oxford Learner&apos;s</Button>
            </a>
            <a href={`https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(term)}`} target="_blank" rel="noreferrer noopener">
              <Button variant="secondary" iconRight="external">Cari di Cambridge</Button>
            </a>
          </div>
        </Card>
      ) : null}

      {state === 'error' ? (
        <Callout kind="warning" title="Gagal menghubungi kamus">
          Periksa koneksi internet Anda, lalu coba lagi. Kamus ini mengambil data langsung dari
          dictionaryapi.dev sehingga membutuhkan koneksi — berbeda dari Bank Karakter yang sepenuhnya offline.
        </Callout>
      ) : null}

      {data?.map((entry, i) => (
        <EntryCard key={i} entry={entry} onAdd={addCard} added={added === entry.word} />
      ))}

      <Card tone="cream">
        <SectionTitle eyebrow="Kalau butuh lebih dalam" title="Kamus resmi & rujukan" />
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { name: "Oxford Learner's Dictionaries", desc: 'Definisi untuk pelajar + CEFR per kata', url: 'https://www.oxfordlearnersdictionaries.com/' },
            { name: 'Cambridge Dictionary', desc: 'Definisi + terjemahan Inggris–Indonesia', url: 'https://dictionary.cambridge.org/dictionary/english-indonesian/' },
            { name: 'Merriam-Webster', desc: 'Rujukan Amerika, etimologi lengkap', url: 'https://www.merriam-webster.com/' },
            { name: 'Collins COBUILD', desc: 'Definisi dalam kalimat penuh', url: 'https://www.collinsdictionary.com/dictionary/english' },
            { name: 'Ozdic (collocations)', desc: 'Kata apa yang wajar berpasangan — kunci band 7+', url: 'https://ozdic.com/' },
            { name: 'KBBI Daring', desc: 'Rujukan Bahasa Indonesia resmi', url: 'https://kbbi.kemdikbud.go.id/' },
          ].map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-start gap-2.5 rounded-2xl border-2 border-sand bg-paper p-3.5 transition-colors hover:bg-cream"
            >
              <Icon name="external" size={16} className="mt-0.5 shrink-0 text-teal-500" />
              <span className="min-w-0">
                <span className="block font-display text-[14px] font-extrabold text-ink">{s.name}</span>
                <span className="block text-[12.5px] leading-snug text-ink-soft">{s.desc}</span>
              </span>
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */

function EntryCard({
  entry, onAdd, added,
}: { entry: Entry; onAdd: (e: Entry) => void; added: boolean }) {
  const audio = entry.phonetics?.find((p) => p.audio)?.audio
  const phon = entry.phonetic ?? entry.phonetics?.find((p) => p.text)?.text

  return (
    <Card className="anim-rise">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[32px] leading-tight text-ink">{entry.word}</h2>
          {phon ? <div className="mt-0.5 font-mono text-[15px] text-ink-soft">{phon}</div> : null}
        </div>
        <div className="flex gap-2">
          {audio ? <AudioButton src={audio} /> : null}
          <Button
            size="sm"
            variant={added ? 'success' : 'secondary'}
            icon={added ? 'check' : 'plus'}
            onClick={() => onAdd(entry)}
            disabled={added}
          >
            {added ? 'Di dek' : 'Ke dek SRS'}
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {entry.meanings?.map((m, i) => (
          <div key={i}>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Chip color="grape" size="sm">{m.partOfSpeech}</Chip>
              {POS_ID[m.partOfSpeech] ? (
                <span className="text-[12px] font-bold text-ink-faint">{POS_ID[m.partOfSpeech]}</span>
              ) : null}
            </div>

            <ol className="space-y-2">
              {m.definitions.slice(0, 5).map((d, j) => (
                <li key={j} className="rounded-2xl border-2 border-sand bg-cream p-3.5">
                  <div className="flex gap-2">
                    <span className="font-display text-[13px] font-extrabold text-ink-faint">{j + 1}.</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14.5px] leading-relaxed text-ink">{d.definition}</span>
                      {d.example ? (
                        <span className="mt-1 block border-l-4 border-teal-200 pl-2.5 text-[13.5px] italic text-ink-soft">
                          “{d.example}”
                        </span>
                      ) : null}
                      {d.synonyms?.length ? (
                        <span className="mt-1.5 block text-[12.5px] text-ink-soft">
                          <strong className="text-ink">Sinonim:</strong> {d.synonyms.slice(0, 6).join(', ')}
                        </span>
                      ) : null}
                    </span>
                  </div>
                </li>
              ))}
            </ol>

            {m.synonyms?.length || m.antonyms?.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {m.synonyms?.slice(0, 8).map((s) => (
                  <Chip key={`s${s}`} size="sm" color="leaf">{s}</Chip>
                ))}
                {m.antonyms?.slice(0, 6).map((a) => (
                  <Chip key={`a${a}`} size="sm" color="coral">≠ {a}</Chip>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {entry.sourceUrls?.length ? (
        <a
          href={entry.sourceUrls[0]}
          target="_blank"
          rel="noreferrer noopener"
          className={cx('mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-ink-faint hover:text-teal-600')}
        >
          <Icon name="external" size={13} />
          Sumber: Wiktionary {entry.license?.name ? `(${entry.license.name})` : ''}
        </a>
      ) : null}
    </Card>
  )
}

function AudioButton({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false)
  const [audio] = useState(() => new Audio(src))

  useEffect(() => {
    const done = () => setPlaying(false)
    audio.addEventListener('ended', done)
    return () => { audio.removeEventListener('ended', done); audio.pause() }
  }, [audio])

  return (
    <Button
      size="sm"
      variant="secondary"
      icon={playing ? 'pause' : 'play'}
      onClick={() => {
        if (playing) { audio.pause(); setPlaying(false) }
        else { audio.currentTime = 0; void audio.play(); setPlaying(true) }
      }}
    >
      Dengar
    </Button>
  )
}
