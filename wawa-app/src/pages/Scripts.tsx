import { useEffect, useMemo, useState } from 'react'
import { Card, Chip, DataTable, Icon, SectionTitle, Tabs, cx, Callout, Button } from '@/components/ui'
import {
  HIRAGANA, KATAKANA, KANJI_ORIGINS, RADICALS, JAMO_CONSONANTS, JAMO_VOWELS,
  HANZI_EVOLUTION, JP_SCRIPT_TIMELINE, KR_SCRIPT_TIMELINE,
  SEJONG_QUOTE, RIKUSHO,
} from '@/data/scripts'
import type { ScriptChar, LangId } from '@/data/types'
import { useProgress } from '@/store/useProgress'
import { LANGUAGES } from '@/data/languages'
import { playSound } from '@/lib/sound'

type TabId = 'hiragana' | 'katakana' | 'kanji' | 'radikal' | 'hangeul' | 'alphabet' | 'tebak' | 'sejarah'

const DEFAULT_TAB: Record<LangId, TabId> = { jp: 'hiragana', cn: 'kanji', kr: 'hangeul', en: 'alphabet' }

export default function Scripts() {
  const activeLang = useProgress((s) => s.activeLang)
  const lang = LANGUAGES[activeLang]
  const [tab, setTab] = useState<TabId>(() => DEFAULT_TAB[activeLang])
  const [picked, setPicked] = useState<ScriptChar | null>(null)
  const [query, setQuery] = useState('')

  const tabs = useMemo(() => {
    const drillTab = { id: 'tebak' as const, label: 'Latihan Tebak Aksara', icon: 'exam' as const }
    const history = { id: 'sejarah' as const, label: `Sejarah ${lang.name}`, icon: 'story' as const }
    if (activeLang === 'jp') return [
      { id: 'hiragana' as const, label: 'ひらがな', count: HIRAGANA.length },
      { id: 'katakana' as const, label: 'カタカナ', count: KATAKANA.length },
      { id: 'kanji' as const, label: '漢字 Kanji', count: KANJI_ORIGINS.length },
      drillTab,
      history,
    ]
    if (activeLang === 'cn') return [
      { id: 'kanji' as const, label: '汉字 Hanzi', count: KANJI_ORIGINS.length },
      { id: 'radikal' as const, label: '部首 Radikal', count: RADICALS.length },
      drillTab,
      history,
    ]
    if (activeLang === 'kr') return [
      { id: 'hangeul' as const, label: '한글 Hangeul', count: JAMO_CONSONANTS.length + JAMO_VOWELS.length },
      drillTab,
      history,
    ]
    return [
      { id: 'alphabet' as const, label: 'Sound & spelling', count: 12 },
      drillTab,
      history,
    ]
  }, [activeLang, lang.name])

  useEffect(() => {
    setTab(DEFAULT_TAB[activeLang])
    setPicked(null)
    setQuery('')
  }, [activeLang])

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow={`Mode ${lang.name} · konten terpisah`}
        title={activeLang === 'en' ? 'Bunyi & Ejaan Inggris' : `Penjelajah Aksara ${lang.name}`}
        sub={`Halaman ini menampilkan sistem tulisan, latihan tebak karakter interaktif, sejarah mendalam, dan anatomi pembentukan huruf.`}
      />

      <Tabs tabs={tabs} value={tab} onChange={(v) => { setTab(v); setPicked(null) }} />

      {tab !== 'sejarah' && tab !== 'radikal' && tab !== 'tebak' ? (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari huruf, romanisasi, atau arti…"
          className="w-full rounded-2xl border-2 border-sand bg-paper px-4 py-3 text-[15px] font-semibold text-ink outline-none placeholder:text-ink-faint focus:border-teal-400"
        />
      ) : null}

      {tab === 'hiragana' ? <KanaGrid chars={HIRAGANA} query={query} onPick={setPicked} /> : null}
      {tab === 'katakana' ? <KanaGrid chars={KATAKANA} query={query} onPick={setPicked} /> : null}
      {tab === 'kanji' ? <KanjiGrid query={query} onPick={setPicked} lang={activeLang === 'cn' ? 'cn' : 'jp'} /> : null}
      {tab === 'radikal' ? <RadicalList /> : null}
      {tab === 'hangeul' ? <HangeulView query={query} onPick={setPicked} /> : null}
      {tab === 'alphabet' ? <AlphabetView query={query} /> : null}
      {tab === 'tebak' ? <ScriptDrillView activeLang={activeLang} /> : null}
      {tab === 'sejarah' ? <HistoryView lang={activeLang} /> : null}

      {picked ? <CharDetail char={picked} onClose={() => setPicked(null)} /> : null}
    </div>
  )
}

/* =====================================================================
   INTERACTIVE CHARACTER GUESSING DRILL & FLASHCARDS
   ===================================================================== */
function ScriptDrillView({ activeLang }: { activeLang: LangId }) {
  type Category = 'hiragana' | 'katakana' | 'hangul_cons' | 'hangul_vowel' | 'kanji_hanzi' | 'radicals'
  type Mode = 'quiz' | 'flashcard'

  const [category, setCategory] = useState<Category>(() => {
    if (activeLang === 'jp') return 'hiragana'
    if (activeLang === 'kr') return 'hangul_cons'
    if (activeLang === 'cn') return 'kanji_hanzi'
    return 'hiragana'
  })
  const [mode, setMode] = useState<Mode>('quiz')
  const [cardIndex, setCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0, streak: 0 })
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)

  // Build character pool based on chosen category
  const pool = useMemo(() => {
    if (category === 'hiragana') return HIRAGANA
    if (category === 'katakana') return KATAKANA
    if (category === 'hangul_cons') return JAMO_CONSONANTS
    if (category === 'hangul_vowel') return JAMO_VOWELS
    if (category === 'radicals') {
      return RADICALS.map((r) => ({
        char: r.radical,
        roman: r.full !== '—' ? r.full : r.radical,
        meaning: r.meaning,
        story: r.examples,
      } as ScriptChar))
    }
    return KANJI_ORIGINS
  }, [category])

  const currentChar: ScriptChar = pool[cardIndex % pool.length] || pool[0]

  // Play Native Speech
  const playAudio = (text?: string) => {
    const textToSpeak = text || currentChar.char
    if (!textToSpeak || typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    setIsPlayingAudio(true)
    playSound('tap')

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    const langMap: Record<string, string> = { jp: 'ja-JP', cn: 'zh-CN', kr: 'ko-KR', en: 'en-GB' }
    utterance.lang = langMap[activeLang] || 'ja-JP'
    utterance.rate = 0.85

    utterance.onend = () => setIsPlayingAudio(false)
    utterance.onerror = () => setIsPlayingAudio(false)
    window.speechSynthesis.speak(utterance)
  }

  // Generate 4 randomized options for the quiz
  const quizOptions = useMemo(() => {
    const correctLabel = currentChar.roman || currentChar.meaning || currentChar.char
    const others = pool
      .filter((c) => c.char !== currentChar.char)
      .map((c) => c.roman || c.meaning || c.char)
      .filter(Boolean)

    // Pick 3 random distractors
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3)
    const all = [correctLabel, ...shuffledOthers].sort(() => 0.5 - Math.random())

    return {
      options: all,
      correctIndex: all.indexOf(correctLabel),
    }
  }, [currentChar, pool])

  const handlePickOption = (idx: number) => {
    if (isAnswerChecked) return
    setSelectedOption(idx)
    setIsAnswerChecked(true)

    const isCorrect = idx === quizOptions.correctIndex
    if (isCorrect) {
      playSound('correct')
      setScore((s) => ({ correct: s.correct + 1, total: s.total + 1, streak: s.streak + 1 }))
    } else {
      playSound('wrong')
      setScore((s) => ({ ...s, total: s.total + 1, streak: 0 }))
    }
  }

  const handleNext = () => {
    playSound('tap')
    setIsAnswerChecked(false)
    setSelectedOption(null)
    setIsFlipped(false)
    setCardIndex((i) => (i + 1) % pool.length)
  }

  const handlePrev = () => {
    playSound('tap')
    setIsAnswerChecked(false)
    setSelectedOption(null)
    setIsFlipped(false)
    setCardIndex((i) => (i - 1 + pool.length) % pool.length)
  }

  return (
    <div className="space-y-6">
      {/* Top Controls: Category & Mode Selectors */}
      <Card className="!p-4 bg-paper border-2 border-sand shadow-[0_4px_0_0_var(--color-drop)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Mode Switcher */}
          <div className="flex rounded-2xl border-2 border-sand bg-shell p-1">
            <button
              type="button"
              onClick={() => {
                playSound('tap')
                setMode('quiz')
                setIsAnswerChecked(false)
                setSelectedOption(null)
              }}
              className={cx(
                'flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-black transition-all cursor-pointer',
                mode === 'quiz' ? 'bg-paper text-teal-800 shadow-[0_2px_0_0_var(--color-drop)]' : 'text-ink-soft hover:text-ink',
              )}
            >
              <Icon name="exam" size={15} />
              <span>Kuis Tebak Huruf</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('tap')
                setMode('flashcard')
                setIsFlipped(false)
              }}
              className={cx(
                'flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-black transition-all cursor-pointer',
                mode === 'flashcard' ? 'bg-paper text-teal-800 shadow-[0_2px_0_0_var(--color-drop)]' : 'text-ink-soft hover:text-ink',
              )}
            >
              <Icon name="review" size={15} />
              <span>Kartu Flashcard (Balik)</span>
            </button>
          </div>

          {/* Category Selector */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => { setCategory('hiragana'); setCardIndex(0); setIsAnswerChecked(false) }}
              className={cx('rounded-xl border-2 px-3 py-1.5 text-[12px] font-bold cursor-pointer transition-all', category === 'hiragana' ? 'border-coral-400 bg-coral-50 text-coral-900 shadow-sm' : 'border-sand bg-cream text-ink-soft')}
            >
              Hiragana
            </button>
            <button
              type="button"
              onClick={() => { setCategory('katakana'); setCardIndex(0); setIsAnswerChecked(false) }}
              className={cx('rounded-xl border-2 px-3 py-1.5 text-[12px] font-bold cursor-pointer transition-all', category === 'katakana' ? 'border-coral-400 bg-coral-50 text-coral-900 shadow-sm' : 'border-sand bg-cream text-ink-soft')}
            >
              Katakana
            </button>
            <button
              type="button"
              onClick={() => { setCategory('hangul_cons'); setCardIndex(0); setIsAnswerChecked(false) }}
              className={cx('rounded-xl border-2 px-3 py-1.5 text-[12px] font-bold cursor-pointer transition-all', category === 'hangul_cons' ? 'border-sky-400 bg-sky-50 text-sky-900 shadow-sm' : 'border-sand bg-cream text-ink-soft')}
            >
              Hangul Konsonan
            </button>
            <button
              type="button"
              onClick={() => { setCategory('hangul_vowel'); setCardIndex(0); setIsAnswerChecked(false) }}
              className={cx('rounded-xl border-2 px-3 py-1.5 text-[12px] font-bold cursor-pointer transition-all', category === 'hangul_vowel' ? 'border-sky-400 bg-sky-50 text-sky-900 shadow-sm' : 'border-sand bg-cream text-ink-soft')}
            >
              Hangul Vokal
            </button>
            <button
              type="button"
              onClick={() => { setCategory('kanji_hanzi'); setCardIndex(0); setIsAnswerChecked(false) }}
              className={cx('rounded-xl border-2 px-3 py-1.5 text-[12px] font-bold cursor-pointer transition-all', category === 'kanji_hanzi' ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-sm' : 'border-sand bg-cream text-ink-soft')}
            >
              Kanji / Hanzi
            </button>
            <button
              type="button"
              onClick={() => { setCategory('radicals'); setCardIndex(0); setIsAnswerChecked(false) }}
              className={cx('rounded-xl border-2 px-3 py-1.5 text-[12px] font-bold cursor-pointer transition-all', category === 'radicals' ? 'border-teal-400 bg-teal-50 text-teal-900 shadow-sm' : 'border-sand bg-cream text-ink-soft')}
            >
              Radikal 部首
            </button>
          </div>
        </div>
      </Card>

      {/* MODE 1: KUIS TEBAK HURUF */}
      {mode === 'quiz' ? (
        <Card className="border-2 border-sand shadow-[0_6px_0_0_var(--color-drop)] space-y-6">
          {/* Header Score & Streak */}
          <div className="flex items-center justify-between border-b border-sand pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-black uppercase tracking-wider text-teal-700">
                Kartu #{cardIndex + 1} dari {pool.length}
              </span>
              {score.streak > 1 ? (
                <Chip size="sm" color="amber" icon="streak">
                  {score.streak} Beruntun!
                </Chip>
              ) : null}
            </div>

            <div className="flex items-center gap-2 text-[12px] font-bold text-ink-soft">
              <span>Akurasi: {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 100}%</span>
              <span className="text-leaf-600 font-extrabold font-mono">({score.correct}/{score.total})</span>
            </div>
          </div>

          {/* Big Character Presentation Box */}
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-sand bg-paper py-10 shadow-[0_4px_0_0_var(--color-drop)] space-y-3">
            <div className="font-cjk text-[72px] font-black text-ink sm:text-[92px] leading-none transition-transform hover:scale-105 select-none">
              {currentChar.char}
            </div>

            <button
              type="button"
              onClick={() => playAudio()}
              className={cx(
                'flex items-center gap-1.5 rounded-full border-2 border-teal-300 bg-teal-50 px-4 py-1.5 text-[13px] font-extrabold text-teal-900 shadow-sm hover:bg-teal-100 cursor-pointer transition-all',
                isPlayingAudio && 'ring-4 ring-teal-200 animate-pulse',
              )}
            >
              <Icon name="sound" size={16} />
              <span>{isPlayingAudio ? 'Memutar...' : 'Dengar Pelafalan'}</span>
            </button>
          </div>

          {/* Prompt */}
          <div className="text-center font-display text-[16px] font-extrabold text-ink">
            Bagaimana cara membaca atau apa arti huruf di atas?
          </div>

          {/* 4 Options Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {quizOptions.options.map((opt, i) => {
              const isSelected = selectedOption === i
              const isCorrect = i === quizOptions.correctIndex

              let btnStyle = 'border-sand bg-paper text-ink hover:bg-cream'
              if (isAnswerChecked) {
                if (isCorrect) {
                  btnStyle = 'border-leaf-500 bg-leaf-50 text-leaf-900 shadow-[0_3px_0_0_var(--color-leaf-600)]'
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'border-coral-500 bg-coral-50 text-coral-900 shadow-[0_3px_0_0_var(--color-coral-600)]'
                } else {
                  btnStyle = 'border-sand/60 bg-shell text-ink-faint opacity-50'
                }
              }

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isAnswerChecked}
                  onClick={() => handlePickOption(i)}
                  className={cx(
                    'flex items-center justify-between rounded-2xl border-2 px-5 py-4 font-display text-[16px] font-black transition-all cursor-pointer select-none',
                    btnStyle,
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-current text-[12px] font-extrabold opacity-60">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isAnswerChecked && isCorrect ? <Icon name="check" size={18} className="text-leaf-600" /> : null}
                  {isAnswerChecked && isSelected && !isCorrect ? <Icon name="close" size={18} className="text-coral-600" /> : null}
                </button>
              )
            })}
          </div>

          {/* Post Answer Feedback & Next Button */}
          {isAnswerChecked ? (
            <div className="anim-rise rounded-2xl border-2 border-sand bg-shell p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="font-display text-[15px] font-extrabold text-ink">
                  {selectedOption === quizOptions.correctIndex ? 'Jawaban Benar! 🎉' : 'Belum Tepat!'}
                </div>
                <div className="text-[13px] font-medium text-ink-soft">
                  Huruf <strong className="font-cjk text-ink">{currentChar.char}</strong> dibaca: <strong className="text-teal-800">{currentChar.roman || currentChar.meaning}</strong>
                  {currentChar.story ? ` — ${currentChar.story}` : ''}
                </div>
              </div>

              <Button size="lg" icon="next" onClick={handleNext} className="w-full sm:w-auto font-black">
                Huruf Berikutnya →
              </Button>
            </div>
          ) : null}
        </Card>
      ) : null}

      {/* MODE 2: KARTU FLASHCARD BOLAK-BALIK */}
      {mode === 'flashcard' ? (
        <Card className="border-2 border-sand shadow-[0_6px_0_0_var(--color-drop)] space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-3">
            <span className="text-[12px] font-black uppercase tracking-wider text-teal-700">
              Kartu #{cardIndex + 1} dari {pool.length}
            </span>
            <span className="text-[12px] font-bold text-ink-faint">Klik kartu untuk membalik</span>
          </div>

          {/* Flip Card Container */}
          <div
            onClick={() => {
              playSound('tap')
              setIsFlipped(!isFlipped)
            }}
            className="group relative min-h-[300px] w-full rounded-3xl border-3 border-sand bg-paper p-8 text-center shadow-[0_8px_0_0_var(--color-drop)] transition-all hover:border-teal-400 cursor-pointer flex flex-col items-center justify-center select-none"
          >
            {!isFlipped ? (
              /* Sisi Depan: Karakter Besar */
              <div className="space-y-3 anim-rise">
                <div className="text-[11px] font-black uppercase tracking-wider text-teal-600">Sisi Depan</div>
                <div className="font-cjk text-[84px] font-black text-ink sm:text-[104px] leading-none">
                  {currentChar.char}
                </div>
                <div className="text-[13px] font-bold text-ink-faint">
                  Sentuh/Klik untuk melihat bacaan & arti ↺
                </div>
              </div>
            ) : (
              /* Sisi Belakang: Bacaan, Arti & Cerita */
              <div className="space-y-3 anim-rise max-w-lg">
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-600">Sisi Belakang</div>
                <div className="font-display text-[26px] font-black text-teal-800">
                  {currentChar.roman || currentChar.meaning}
                </div>
                {currentChar.onyomi || currentChar.kunyomi || currentChar.pinyin ? (
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {currentChar.onyomi ? <Chip size="sm" color="coral">On: {currentChar.onyomi}</Chip> : null}
                    {currentChar.kunyomi ? <Chip size="sm" color="amber">Kun: {currentChar.kunyomi}</Chip> : null}
                    {currentChar.pinyin ? <Chip size="sm" color="amber">Pinyin: {currentChar.pinyin}</Chip> : null}
                  </div>
                ) : null}
                {currentChar.meaning ? (
                  <div className="text-[15px] font-bold text-ink">
                    Arti: {currentChar.meaning}
                  </div>
                ) : null}
                {currentChar.from ? (
                  <div className="text-[12.5px] font-semibold text-ink-soft bg-cream/70 rounded-xl p-2 border border-sand">
                    Asal Bentuk: {currentChar.from} ({currentChar.fromMeaning})
                  </div>
                ) : null}
                {currentChar.story ? (
                  <p className="text-[13px] italic text-ink-soft leading-relaxed">
                    "{currentChar.story}"
                  </p>
                ) : null}
              </div>
            )}
          </div>

          {/* Flashcard Action Bar */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-1.5 rounded-2xl border-2 border-sand bg-paper px-4 py-2.5 font-display text-[13px] font-black text-ink shadow-sm hover:bg-cream cursor-pointer"
            >
              <Icon name="left" size={15} />
              <span>Sebelumnya</span>
            </button>

            <button
              type="button"
              onClick={() => playAudio()}
              className="flex items-center gap-1.5 rounded-full border-2 border-teal-400 bg-teal-50 px-5 py-2 font-display text-[13px] font-black text-teal-900 shadow-sm hover:bg-teal-100 cursor-pointer"
            >
              <Icon name="sound" size={16} />
              <span>Dengar Suara</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-2xl border-2 border-teal-500 bg-teal-600 px-4 py-2.5 font-display text-[13px] font-black text-white shadow-sm hover:bg-teal-700 cursor-pointer"
            >
              <span>Selanjutnya</span>
              <Icon name="next" size={15} />
            </button>
          </div>
        </Card>
      ) : null}
    </div>
  )
}

/* ------------------------------ Grid Components ------------------------------ */
function KanaGrid({ chars, query, onPick }: { chars: ScriptChar[]; query: string; onPick: (c: ScriptChar) => void }) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return chars
    return chars.filter((c) => c.char.includes(q) || (c.roman && c.roman.toLowerCase().includes(q)) || (c.meaning && c.meaning.toLowerCase().includes(q)))
  }, [chars, query])

  return (
    <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-8 md:grid-cols-10">
      {filtered.map((c) => (
        <button
          key={c.char}
          onClick={() => onPick(c)}
          className="group flex flex-col items-center justify-center rounded-2xl border-2 border-sand bg-paper p-3 transition-transform hover:-translate-y-0.5 hover:border-teal-400 cursor-pointer shadow-[0_2px_0_0_var(--color-drop)]"
        >
          <span className="font-cjk text-[28px] font-bold text-ink group-hover:text-teal-700">{c.char}</span>
          <span className="text-[11px] font-extrabold text-ink-faint">{c.roman}</span>
        </button>
      ))}
    </div>
  )
}

function KanjiGrid({ query, onPick, lang }: { query: string; onPick: (c: ScriptChar) => void; lang: 'jp' | 'cn' }) {
  const chars = KANJI_ORIGINS
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return chars
    return chars.filter((c) => c.char.includes(q) || (c.meaning && c.meaning.toLowerCase().includes(q)) || (c.pinyin && c.pinyin.toLowerCase().includes(q)) || (c.onyomi && c.onyomi.toLowerCase().includes(q)))
  }, [chars, query])

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {filtered.map((c) => (
        <button
          key={c.char}
          onClick={() => onPick(c)}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-sand bg-paper p-3.5 transition-transform hover:-translate-y-0.5 hover:border-teal-400 cursor-pointer shadow-[0_2px_0_0_var(--color-drop)]"
        >
          <span className="font-cjk text-[36px] font-bold text-ink">{c.char}</span>
          <span className="font-display text-[13px] font-extrabold text-ink truncate w-full text-center">{c.meaning}</span>
          <span className="text-[10.5px] font-bold text-ink-faint">{lang === 'cn' ? c.pinyin : c.onyomi || c.kunyomi}</span>
        </button>
      ))}
    </div>
  )
}

function RadicalList() {
  const list = RADICALS

  return (
    <div className="space-y-4">
      <Callout kind="tip" title="Tiga langkah menebak kanji/hanzi asing">
        <strong className="text-ink">① Radikal apa?</strong> 氵 = AIR ·{' '}
        <strong className="text-ink">② Sisanya apa?</strong> 胡 = dibaca “ko” ·{' '}
        <strong className="text-ink">③ Kesimpulan:</strong> sesuatu berhubungan air, dibaca “ko” → 湖 = DANAU
      </Callout>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <div key={r.radical} className="rounded-2xl border-2 border-sand bg-paper p-3.5 shadow-sm space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-teal-200 bg-teal-50 font-cjk text-[22px] font-bold text-ink">
                {r.radical}
              </span>
              <div>
                <div className="font-display text-[14px] font-black text-ink">{r.radical} {r.full !== '—' ? `(${r.full})` : ''}</div>
                <div className="text-[12px] font-bold text-teal-700">Makna: {r.meaning}</div>
              </div>
            </div>
            <p className="text-[12px] text-ink-soft leading-snug">Contoh: {r.examples}</p>
            {r.danger ? <p className="text-[11px] font-bold text-amber-700 bg-amber-50 p-1.5 rounded-lg border border-amber-200">{r.danger}</p> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function HangeulView({ query, onPick }: { query: string; onPick: (c: ScriptChar) => void }) {
  const q = query.trim().toLowerCase()
  const consonants = useMemo(() => {
    if (!q) return JAMO_CONSONANTS
    return JAMO_CONSONANTS.filter((c) => c.char.includes(q) || (c.roman && c.roman.toLowerCase().includes(q)) || (c.story && c.story.toLowerCase().includes(q)))
  }, [q])

  const vowels = useMemo(() => {
    if (!q) return JAMO_VOWELS
    return JAMO_VOWELS.filter((c) => c.char.includes(q) || (c.roman && c.roman.toLowerCase().includes(q)) || (c.story && c.story.toLowerCase().includes(q)))
  }, [q])

  return (
    <div className="space-y-6">
      <Card tone="shell">
        <SectionTitle eyebrow="Konsonan Dasar & Rangkap (자음)" title="19 Konsonan Hangeul" />
        <div className="mt-3 grid grid-cols-4 gap-2.5 sm:grid-cols-6 md:grid-cols-8">
          {consonants.map((c) => (
            <button
              key={c.char}
              onClick={() => onPick(c)}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-sand bg-paper p-3 hover:border-teal-400 cursor-pointer shadow-sm"
            >
              <span className="font-cjk text-[32px] font-bold text-ink">{c.char}</span>
              <span className="text-[11px] font-extrabold text-ink-soft">{c.roman}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card tone="shell">
        <SectionTitle eyebrow="Vokal Tunggal & Difton (모음)" title="21 Vokal Hangeul (천지인 Cheonjiin)" />
        <div className="mt-3 grid grid-cols-4 gap-2.5 sm:grid-cols-6 md:grid-cols-8">
          {vowels.map((v) => (
            <button
              key={v.char}
              onClick={() => onPick(v)}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-sand bg-paper p-3 hover:border-teal-400 cursor-pointer shadow-sm"
            >
              <span className="font-cjk text-[32px] font-bold text-ink">{v.char}</span>
              <span className="text-[11px] font-extrabold text-ink-soft">{v.roman}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}

function AlphabetView({ query }: { query: string }) {
  const q = query.trim().toLowerCase()
  const cards = [
    { title: 'Vowel Digraphs (ea, ee, ou, ai)', desc: 'Kombinasi dua huruf vokal yang melahirkan bunyi vokal panjang atau diftong: "meat" (/iː/) vs "great" (/eɪ/) vs "threat" (/e/).' },
    { title: 'Silent Letters (konsonan bisu: kn-, wr-, -mb)', desc: 'Warisan Old English di mana bunyi tersebut dahulunya diucapkan: "knife" (dahulu /kniːf/), "write" (/wriːt/), "climb" (/klimb/).' },
    { title: 'Consonant Digraphs (th, sh, ch, ph)', desc: 'Dua konsonan yang bersatu membentuk satu fonem baru: voiced "th" (/ð/ the) vs voiceless "th" (/θ/ think).' },
    { title: 'The Flap /t/ & Glottal Stop /ʔ/', desc: 'Karakteristik khas ucapan Amerika ("water" → "wader") dan Cockney ("bottle" → "bo-ul").' },
  ]

  const filtered = q ? cards.filter((c) => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)) : cards

  return (
    <Card>
      <SectionTitle eyebrow="Inggris" title="Hubungan Huruf & Fonem IPA" sub="Mengapa 26 huruf alfabet menghasilkan 44 bunyi fonetik yang berbeda." />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {filtered.map((c) => (
          <div key={c.title} className="rounded-2xl border-2 border-sand bg-cream p-4 space-y-1.5">
            <div className="font-display text-[15px] font-extrabold text-ink">{c.title}</div>
            <p className="text-[13px] text-ink-soft leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

/* =====================================================================
   EXPANDED HISTORY VIEW FOR KOREA, ENGLAND, JAPAN, CHINA
   ===================================================================== */
function HistoryView({ lang }: { lang: LangId }) {
  if (lang === 'kr') {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-sky-300 bg-sky-50/70 shadow-[0_4px_0_0_var(--color-sky-700)]">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-sky-600 px-2.5 py-0.5 text-[10px] font-black uppercase text-white">
              Sejarah Hangeul (훈민정음 1446)
            </span>
            <span className="text-[12px] font-bold text-sky-900">Mahakarya Linguistik Raja Sejong</span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-ink">
            Kelahiran Aksara Paling Ilmiah di Dunia
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            Sebelum tahun 1443, rakyat Korea menggunakan aksara Hanja Cina (Hanja) yang berjumlah puluhan ribu. Hanya bangsawan Yangban terpelajar yang mampu membaca dan menulis, sementara rakyat jelata buta huruf dan sering dirugikan secara hukum.
          </p>

          <div className="mt-4 rounded-2xl border-2 border-sky-200 bg-paper p-4">
            <div className="font-display text-[14px] font-black text-sky-900">Kata Pengantar Raja Sejong (1446 M):</div>
            <pre className="mt-1 overflow-x-auto whitespace-pre-wrap font-cjk text-[16px] leading-relaxed text-ink font-bold">
              {SEJONG_QUOTE.hanja}
            </pre>
            <p className="mt-2 text-[13px] italic text-ink-soft">“{SEJONG_QUOTE.id}”</p>
          </div>
        </Card>

        {/* Filosofi Cheonjiin */}
        <Card className="border-2 border-sand shadow-sm space-y-4">
          <SectionTitle
            eyebrow="Filosofi Kosmologi & Anatomi"
            title="Desain Cheon-Ji-In (천지인) & Bentuk Organ Bicara"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border-2 border-sand bg-cream p-4 text-center">
              <span className="font-cjk text-3xl font-black text-teal-700">•</span>
              <div className="mt-1 font-display text-[14px] font-black text-ink">Langit (Cheon 天)</div>
              <p className="text-[12px] text-ink-soft">Titik melambangkan kubah langit yang bulat (Yang/Positif).</p>
            </div>
            <div className="rounded-2xl border-2 border-sand bg-cream p-4 text-center">
              <span className="font-cjk text-3xl font-black text-teal-700">ㅡ</span>
              <div className="mt-1 font-display text-[14px] font-black text-ink">Bumi (Ji 地)</div>
              <p className="text-[12px] text-ink-soft">Garis datar melambangkan permukaan bumi yang luas (Yin/Negatif).</p>
            </div>
            <div className="rounded-2xl border-2 border-sand bg-cream p-4 text-center">
              <span className="font-cjk text-3xl font-black text-teal-700">ㅣ</span>
              <div className="mt-1 font-display text-[14px] font-black text-ink">Manusia (In 人)</div>
              <p className="text-[12px] text-ink-soft">Garis tegak melambangkan manusia yang berdiri di antara langit dan bumi.</p>
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle eyebrow="Garis Waktu" title="Kronologi Evolusi Hangeul 600 Tahun" />
          <Timeline items={KR_SCRIPT_TIMELINE} accent="#0284c7" />
        </Card>
      </div>
    )
  }

  if (lang === 'en') {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-leaf-300 bg-leaf-50/70 shadow-[0_4px_0_0_var(--color-leaf-700)]">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-leaf-600 px-2.5 py-0.5 text-[10px] font-black uppercase text-white">
              Sejarah Bahasa Inggris
            </span>
            <span className="text-[12px] font-bold text-leaf-900">Dari Dialek Suku Pulau ke Bahasa Global</span>
          </div>
          <h2 className="mt-2 font-display text-2xl font-black text-ink">
            Mengapa Ejaan Bahasa Inggris Tidak Cocok dengan Bunyinya?
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            Bahasa Inggris adalah percampuran tiga gelombang penaklukan: Suku Jermanik Anglo-Saxon (450 M), Bangsa Viking Old Norse (abad ke-9), dan Penaklukan Norman-Prancis (1066 M). Akibatnya, bahasa Inggris memiliki kosakata ganda: kata rakyat jelata berbasis Jermanik (cow, pig, ask) dan kata bangsawan istana berbasis Prancis/Latin (beef, pork, inquire).
          </p>
        </Card>

        <Card>
          <SectionTitle eyebrow="Garis Waktu" title="Kronologi Evolusi Bahasa Inggris" />
          <Timeline
            items={[
              { period: '450–1100 M (Old English)', event: 'Suku Anglo-Saxon dan Jutes membawa bahasa Jermanik ke kepulauan Britania. Syair epik Beowulf ditulis di era ini.' },
              { period: '1066 (Penaklukan Norman)', event: 'William the Conqueror menaklukkan Inggris, menjadikan bahasa Prancis Anglo-Norman bahasa resmi istana, hukum, dan sastra.' },
              { period: '1400–1700 (The Great Vowel Shift)', event: 'Terjadi pergeseran fonetik besar-besaran di mana seluruh vokal panjang berubah bunyi, sementara mesin cetak Caxton membekukan ejaan lama.' },
              { period: '1755 (Kamus Samuel Johnson)', event: 'Standardisasi ejaan bahasa Inggris modern pertama kali dibukukan secara luas.' },
              { period: 'Modern & Global', event: 'Bahasa Inggris berkembang menjadi Lingua Franca global di bidang sains, teknologi, diplomasi, dan internet.' },
            ]}
            accent="#16a34a"
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <RikushoSection />

      {lang === 'cn' ? (
        <Card>
          <SectionTitle eyebrow="3.300 tahun" title="Evolusi Hanzi — lima tahap" />
          <DataTable
            head={['Tahap', 'Periode', 'Media', 'Ciri']}
            rows={HANZI_EVOLUTION.map((e) => [
              <span key="s">
                <span className="font-cjk text-[17px] font-bold text-ink">{e.stage}</span>
                <br />
                <span className="text-[11px] text-ink-faint">{e.name.split('—')[1]}</span>
              </span>,
              e.period,
              e.medium,
              e.trait,
            ])}
            dense
          />
        </Card>
      ) : null}

      {lang === 'jp' ? (
        <Card>
          <SectionTitle eyebrow="Jepang" title="Bagaimana Aksara Tiba di Jepang" />
          <Timeline items={JP_SCRIPT_TIMELINE} accent="#e8564f" />
        </Card>
      ) : null}
    </div>
  )
}

function RikushoSection() {
  const [expanded, setExpanded] = useState<string | null>('形声')

  const toggle = (name: string) => {
    playSound('tap')
    setExpanded((prev) => (prev === name ? null : name))
  }

  return (
    <Card>
      <SectionTitle
        eyebrow="六書 / 六书 · Enam Metode Pembentukan"
        title="Bagaimana Karakter Hanzi & Kanji Dibentuk"
        sub="Bilah persentase di bawah adalah proporsi sebaran populasi seluruh karakter di dunia nyata — 82% adalah rumus Makna + Bunyi."
      />

      {/* Visual Population Distribution Stack */}
      <div className="mb-4 rounded-2xl border-2 border-sand bg-cream p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon name="reference" size={17} className="text-teal-600" />
            <span className="font-display text-[14px] font-extrabold text-ink">
              Komposisi Sebaran Populasi Karakter
            </span>
          </div>
          <span className="text-[12px] font-extrabold text-teal-700">
            Klik kartu di bawah untuk bedah rumus
          </span>
        </div>

        <div className="mt-3 flex h-4 w-full overflow-hidden rounded-full border-2 border-sand bg-shell">
          <div style={{ width: '82%' }} className="bg-amber-400" title="形声 Fonosemantik (82%)" />
          <div style={{ width: '13%' }} className="bg-teal-400" title="会意 Ideogram Gabungan (13%)" />
          <div style={{ width: '4%' }} className="bg-sky-400" title="象形 Piktogram (4%)" />
          <div style={{ width: '1%' }} className="bg-leaf-400" title="指事 Ideogram Penunjuk (1%)" />
        </div>
      </div>

      {/* Interactive Rikusho Cards List */}
      <div className="space-y-3">
        {RIKUSHO.map((r) => {
          const isSelected = expanded === r.name
          return (
            <div
              key={r.name}
              className={cx(
                'rounded-2xl border-2 transition-all duration-200 overflow-hidden',
                isSelected
                  ? 'border-teal-500 bg-paper shadow-[0_4px_0_0_var(--color-teal-700)]'
                  : 'border-sand bg-paper hover:border-teal-300 hover:bg-cream/50 shadow-[0_2px_0_0_var(--color-drop)]',
              )}
            >
              <button
                type="button"
                onClick={() => toggle(r.name)}
                className="w-full p-4 text-left select-none cursor-pointer"
                aria-expanded={isSelected}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-cjk text-[24px] font-bold text-ink">{r.name}</span>
                  <span className="text-[12.5px] font-bold text-ink-faint">{r.roman}</span>
                  <Chip size="sm" color={r.share >= 80 ? 'amber' : r.share > 0 ? 'teal' : 'ink'}>
                    {r.share > 0 ? `Porsi Populasi ±${r.share}%` : 'Sangat Langka'}
                  </Chip>

                  <div className="ml-auto flex items-center gap-2">
                    <span className="font-display text-[14px] font-extrabold text-ink hidden sm:inline">
                      {r.label}
                    </span>
                    <span
                      className={cx(
                        'flex h-7 w-7 items-center justify-center rounded-xl border-2 transition-transform duration-200',
                        isSelected ? 'border-teal-300 bg-teal-50 text-teal-700 rotate-180' : 'border-sand bg-shell text-ink-faint',
                      )}
                    >
                      <Icon name="down" size={15} />
                    </span>
                  </div>
                </div>

                <div className="mt-1 font-display text-[13.5px] font-extrabold text-teal-700 sm:hidden">
                  {r.label}
                </div>

                <p className="mt-1 text-[13.5px] text-ink-soft">{r.desc}</p>
              </button>

              {isSelected ? (
                <div className="border-t-2 border-sand bg-shell/60 p-4 space-y-4 text-[13.5px]">
                  <div className="rounded-xl border-2 border-sand bg-paper p-3.5 leading-relaxed text-ink-soft">
                    <div className="mb-1.5 flex items-center gap-1.5 font-display text-[14px] font-extrabold text-ink">
                      <Icon name="info" size={16} className="text-teal-600" />
                      <span>Konsep & Cara Kerja:</span>
                    </div>
                    <p>{r.explanation}</p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-1.5">
                      <Icon name="search" size={16} className="text-teal-600" />
                      <span className="font-display text-[13.5px] font-extrabold text-ink">
                        Bedah Anatomi Contoh Karakter:
                      </span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {r.breakdowns.map((b) => (
                        <div key={b.char} className="rounded-xl border-2 border-sand bg-paper p-3 shadow-[0_2px_0_0_var(--color-drop)]">
                          <div className="flex items-center gap-2.5">
                            <span className={cx(
                              'flex min-h-10 min-w-10 px-2 py-1 shrink-0 items-center justify-center rounded-xl border-2 border-teal-200 bg-teal-50 font-cjk font-bold text-ink shadow-sm',
                              b.char.length > 4 ? 'text-[13px]' : b.char.length > 1 ? 'text-[16px]' : 'text-[22px]',
                            )}>
                              {b.char}
                            </span>
                            <div className="min-w-0">
                              <div className="font-display text-[13.5px] font-extrabold text-teal-700 truncate">
                                {b.meaning}
                              </div>
                              <div className="text-[11px] font-bold text-ink-faint truncate">
                                {b.formula}
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-[12px] leading-relaxed text-ink-soft">
                            {b.note}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function Timeline({ items, accent }: { items: { period: string; event: string }[]; accent: string }) {
  return (
    <ol className="relative space-y-3 border-l-4 pl-5" style={{ borderColor: accent + '44' }}>
      {items.map((t) => (
        <li key={t.period} className="relative">
          <span
            className="absolute -left-[29px] top-1.5 h-3.5 w-3.5 rounded-full border-[3px] border-white"
            style={{ backgroundColor: accent }}
            aria-hidden
          />
          <div className="font-display text-[13.5px] font-extrabold" style={{ color: accent }}>{t.period}</div>
          <p className="text-[13.5px] leading-relaxed text-ink-soft">{t.event}</p>
        </li>
      ))}
    </ol>
  )
}

function CharDetail({ char, onClose }: { char: ScriptChar; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="anim-rise w-full max-w-lg rounded-3xl border-2 border-sand bg-paper p-6 shadow-[0_8px_0_0_var(--color-drop)] space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border-2 border-sand bg-cream px-5 py-3">
              <div className="font-cjk text-[62px] leading-none text-ink">{char.char}</div>
            </div>
            <div>
              <div className="font-display text-xl font-extrabold text-ink">{char.meaning ?? char.roman}</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {char.roman ? <Chip size="sm" color="teal">{char.roman}</Chip> : null}
                {char.onyomi ? <Chip size="sm" color="coral">音 {char.onyomi}</Chip> : null}
                {char.kunyomi ? <Chip size="sm" color="amber">訓 {char.kunyomi}</Chip> : null}
                {char.pinyin ? <Chip size="sm" color="amber">{char.pinyin}</Chip> : null}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-xl border-2 border-sand bg-paper px-2.5 py-1.5 text-ink-faint hover:text-ink cursor-pointer"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {char.from ? (
          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
            <div className="text-[11px] font-extrabold uppercase tracking-wide text-amber-600">Asal Mula Karakter:</div>
            <div className="font-cjk text-[24px] font-bold text-ink">{char.from}</div>
            {char.fromMeaning ? <div className="mt-1 text-[13px] text-ink-soft">{char.fromMeaning}</div> : null}
          </div>
        ) : null}

        {char.story ? (
          <p className="text-[13.5px] leading-relaxed text-ink-soft font-medium">{char.story}</p>
        ) : null}
      </div>
    </div>
  )
}
