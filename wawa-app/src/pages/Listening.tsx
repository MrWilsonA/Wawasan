import { useEffect, useMemo, useState } from 'react'
import { Wawa } from '@/brand/Wawa'
import { Button, Card, Chip, Icon, SectionTitle, cx } from '@/components/ui'
import { LANGUAGES } from '@/data/languages'
import { useProgress } from '@/store/useProgress'
import { LISTENING_DATA, generateVocabListeningQuestions, type ListeningQuestion, type ListeningLevel } from '@/data/listeningData'
import { allCards } from '@/data/curriculum'
import { playSound } from '@/lib/sound'

type ListeningMode = 'scenario' | 'random_vocab'

export default function Listening() {
  const activeLang = useProgress((s) => s.activeLang)
  const lang = LANGUAGES[activeLang]
  const levels = useMemo(() => LISTENING_DATA[activeLang] || [], [activeLang])

  const [mode, setMode] = useState<ListeningMode>('scenario')
  const [activeLevelId, setActiveLevelId] = useState<string>(() => levels[0]?.id || 'n5')
  const [randomSeed, setRandomSeed] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [showText, setShowText] = useState(false)
  const [slow, setSlow] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [completedQuestions, setCompletedQuestions] = useState<Record<string, boolean>>({})

  // Fetch all curriculum cards for infinite randomized vocab drills
  const vocabCards = useMemo(() => allCards(activeLang), [activeLang])

  // Generate randomized questions when in random_vocab mode or seed changes
  const randomizedVocabQuestions = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    randomSeed
    return generateVocabListeningQuestions(activeLang, vocabCards, 25)
  }, [activeLang, vocabCards, randomSeed])

  // Update level when active language changes
  useEffect(() => {
    window.speechSynthesis?.cancel()
    if (levels.length > 0) {
      setActiveLevelId(levels[0].id)
      setQuestionIndex(0)
      setPicked(null)
      setShowText(false)
    }
  }, [activeLang, levels])

  const currentLevel: ListeningLevel | undefined = useMemo(() => {
    return levels.find((l) => l.id === activeLevelId) || levels[0]
  }, [levels, activeLevelId])

  const questions: ListeningQuestion[] = useMemo(() => {
    if (mode === 'random_vocab') {
      return randomizedVocabQuestions.length > 0 ? randomizedVocabQuestions : currentLevel?.questions || []
    }
    return currentLevel?.questions || []
  }, [mode, randomizedVocabQuestions, currentLevel])

  const question: ListeningQuestion | undefined = questions[questionIndex] || questions[0]

  const supported = useMemo(() => typeof window !== 'undefined' && 'speechSynthesis' in window, [])

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  const playAudio = () => {
    if (!supported || !question) return
    window.speechSynthesis.cancel()
    setIsPlaying(true)
    playSound('tap')

    const utterance = new SpeechSynthesisUtterance(question.text)
    utterance.lang = question.voice
    utterance.rate = slow ? 0.7 : 0.95

    const voices = window.speechSynthesis.getVoices()
    const prefix = question.voice.slice(0, 2).toLowerCase()
    const matchingVoice = voices.find((v) => v.lang.toLowerCase().startsWith(prefix))
    if (matchingVoice) utterance.voice = matchingVoice

    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    window.speechSynthesis.speak(utterance)
  }

  const handlePickOption = (index: number) => {
    if (picked !== null || !question) return
    setPicked(index)
    if (index === question.answer) {
      playSound('correct')
      setCompletedQuestions((prev) => ({ ...prev, [question.id]: true }))
    } else {
      playSound('wrong')
    }
  }

  const handleNextQuestion = () => {
    playSound('tap')
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1)
      setPicked(null)
      setShowText(false)
    } else {
      setQuestionIndex(0)
      setPicked(null)
      setShowText(false)
      playSound('levelComplete')
    }
  }

  const handleSelectLevel = (levelId: string) => {
    playSound('tap')
    window.speechSynthesis?.cancel()
    setActiveLevelId(levelId)
    setQuestionIndex(0)
    setPicked(null)
    setShowText(false)
  }

  const handleShuffleRandomVocab = () => {
    playSound('tap')
    window.speechSynthesis?.cancel()
    setRandomSeed((s) => s + 1)
    setQuestionIndex(0)
    setPicked(null)
    setShowText(false)
  }

  if (!question) {
    return (
      <div className="p-6 text-center text-ink-soft">
        Tidak ada data latihan menyimak untuk bahasa ini.
      </div>
    )
  }

  const levelProgress = questions.filter((q) => completedQuestions[q.id]).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionTitle
        eyebrow={`Latihan Menyimak · ${lang.name} (${lang.nativeName})`}
        title="Dengar Dulu, Pahami Makna, Lalu Buka Transkrip"
        sub="Latihan menyimak terstruktur mulai dari level dasar pemula (anak TK/fondasi) hingga tingkat mahir fasih (HSK/JLPT/TOPIK/CEFR)."
        right={
          <Chip color="teal" icon="listen">
            {mode === 'scenario' ? `Level ${currentLevel?.badge}` : `Acak ${questions.length} Kosakata`}
          </Chip>
        }
      />

      {/* Mode Switcher & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-2xl border-2 border-sand bg-shell p-1 shadow-[0_2px_0_0_var(--color-drop)]">
          <button
            type="button"
            onClick={() => {
              playSound('tap')
              setMode('scenario')
              setQuestionIndex(0)
              setPicked(null)
              setShowText(false)
            }}
            className={cx(
              'flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-black transition-all cursor-pointer',
              mode === 'scenario'
                ? 'bg-paper text-teal-800 shadow-[0_2px_0_0_var(--color-drop)] -translate-y-0.5'
                : 'text-ink-soft hover:text-ink',
            )}
          >
            <Icon name="exam" size={15} />
            <span>Skenario Bertingkat ({levels.length} Level)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('tap')
              setMode('random_vocab')
              setQuestionIndex(0)
              setPicked(null)
              setShowText(false)
            }}
            className={cx(
              'flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-black transition-all cursor-pointer',
              mode === 'random_vocab'
                ? 'bg-paper text-teal-800 shadow-[0_2px_0_0_var(--color-drop)] -translate-y-0.5'
                : 'text-ink-soft hover:text-ink',
            )}
          >
            <Icon name="sort" size={15} />
            <span>Acak Seluruh Kosakata ({vocabCards.length} Kata)</span>
            <Chip size="sm" color="amber">Brutal</Chip>
          </button>
        </div>

        {mode === 'random_vocab' && (
          <button
            type="button"
            onClick={handleShuffleRandomVocab}
            className="flex items-center gap-2 rounded-2xl border-2 border-teal-500 bg-teal-50 px-4 py-2 font-display text-[13px] font-black text-teal-900 shadow-sm hover:bg-teal-100 active:scale-95 cursor-pointer"
          >
            <Icon name="reset" size={16} />
            <span>Acak Soal Baru (Shuffle)</span>
          </button>
        )}
      </div>

      {/* Level Selector Tabs (When in scenario mode) */}
      {mode === 'scenario' && currentLevel ? (
        <Card className="!p-4 bg-paper border-2 border-sand shadow-[0_4px_0_0_var(--color-drop)]">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Icon name="exam" size={17} className="text-teal-600" />
              <span className="font-display text-[14px] font-extrabold text-ink">
                Pilih Tingkat Kesulitan / Level:
              </span>
              <span className="text-[12px] font-bold text-ink-soft">
                ({levels.length} Tingkat Tersedia)
              </span>
            </div>
            <div className="text-[12px] font-extrabold text-teal-700">
              Progres Level: {levelProgress} / {questions.length} Selesai
            </div>
          </div>

          {/* Level Badges Row */}
          <div className="flex flex-wrap gap-2">
            {levels.map((lvl) => {
              const isSelected = lvl.id === activeLevelId
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => handleSelectLevel(lvl.id)}
                  className={cx(
                    'flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-[13px] font-extrabold transition-all cursor-pointer select-none',
                    isSelected
                      ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-[0_3px_0_0_var(--color-teal-700)] -translate-y-0.5'
                      : 'border-sand bg-cream text-ink-soft hover:border-teal-300 hover:bg-paper shadow-[0_2px_0_0_var(--color-drop)]',
                  )}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: isSelected ? lang.color : 'var(--color-ink-faint)' }} />
                  <span>{lvl.badge}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex items-start gap-2 text-[13px] font-medium text-ink-soft border-t border-sand pt-2.5">
            <Icon name="words" size={16} className="shrink-0 text-teal-600 mt-0.5" />
            <div>
              <strong className="text-ink">Fokus {currentLevel.name}:</strong> {currentLevel.desc}
            </div>
          </div>
        </Card>
      ) : null}

      {/* Main Interactive Listening Card */}
      <Card className="relative overflow-hidden border-2 border-sand shadow-[0_6px_0_0_var(--color-drop)]">
        {/* Top Progress & Scenario Info */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-sand pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-teal-300 bg-teal-50 font-display text-[13px] font-extrabold text-teal-800">
              #{questionIndex + 1}
            </span>
            <div>
              <div className="font-display text-[15px] font-extrabold text-ink">
                {question.title}
              </div>
              <div className="text-[12px] font-medium text-ink-faint">
                {question.scenario}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-ink-soft">
              Soal {questionIndex + 1} dari {questions.length}
            </span>
            <div className="flex gap-1 max-w-[140px] overflow-hidden">
              {questions.map((q, idx) => (
                <span
                  key={q.id}
                  className={cx(
                    'h-2.5 min-w-3 rounded-full border transition-all',
                    idx === questionIndex
                      ? 'border-teal-500 bg-teal-400 w-6'
                      : completedQuestions[q.id]
                        ? 'border-leaf-400 bg-leaf-400 w-3'
                        : 'border-sand bg-shell w-3',
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[170px_1fr]">
          {/* Mascot Side View */}
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-sand bg-cream p-4 text-center">
            <Wawa
              expression={picked === null ? (isPlaying ? 'celebrate' : 'teach') : picked === question.answer ? 'happy' : 'thinking'}
              size={130}
              accent={lang.color}
              className={cx('anim-bob', isPlaying && 'scale-105 transition-transform')}
            />
            <span className="mt-2 font-display text-[12px] font-bold text-ink-soft">
              {isPlaying ? 'Sedang Memutar...' : picked === null ? 'Dengarkan baik-baik' : picked === question.answer ? 'Hebat! Jawaban Tepat' : 'Coba dengar lagi ya'}
            </span>
          </div>

          {/* Player & Content Area */}
          <div>
            {/* Audio Control Bar */}
            <div className="mb-4 flex flex-wrap gap-2.5">
              <Button
                size="lg"
                icon="listen"
                onClick={playAudio}
                disabled={!supported}
                className={cx(isPlaying && 'ring-4 ring-teal-200 animate-pulse')}
              >
                {isPlaying ? 'Memutar Audio...' : 'Putar Audio'}
              </Button>

              <Button
                variant="secondary"
                icon={slow ? 'check' : 'sound'}
                onClick={() => {
                  playSound('tap')
                  setSlow((v) => !v)
                }}
              >
                {slow ? 'Kecepatan 0,7× (Lambat)' : 'Kecepatan Normal 1,0×'}
              </Button>

              <Button
                variant="ghost"
                icon="read"
                onClick={() => {
                  playSound('tap')
                  setShowText((v) => !v)
                }}
              >
                {showText ? 'Sembunyikan Transkrip' : 'Buka Transkrip'}
              </Button>
            </div>

            {!supported ? (
              <p className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-3 text-[13px] text-ink-soft">
                Browser ini tidak menyediakan suara bawaan Web Speech API. Buka di Chrome atau Edge untuk memutar latihan.
              </p>
            ) : null}

            {/* Transcript Box */}
            {showText ? (
              <div className="anim-rise mb-4 rounded-2xl border-2 border-teal-200 bg-teal-50/70 p-4 space-y-1">
                <div className="text-[11px] font-extrabold uppercase tracking-wide text-teal-700">
                  Transkrip & Bacaan:
                </div>
                <div className="font-cjk text-[22px] font-bold text-ink leading-relaxed">
                  {question.text}
                </div>
                <div className="text-[13px] font-bold text-ink-soft">
                  {question.reading}
                </div>
                <div className="text-[12.5px] italic text-ink-faint">
                  "{question.translation}"
                </div>
              </div>
            ) : (
              <div
                onClick={playAudio}
                className="mb-4 flex h-[90px] cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-sand bg-shell hover:bg-cream transition-colors text-ink-soft select-none"
              >
                <Icon name="listen" size={32} className="text-teal-600 animate-bounce" />
                <span className="font-display text-[14px] font-extrabold">
                  Klik di sini untuk mendengarkan audio rekaman
                </span>
              </div>
            )}

            {/* Prompt */}
            <div className="mb-3 flex items-center gap-2">
              <Icon name="help" size={20} className="text-teal-600" />
              <h3 className="font-display text-[17px] font-extrabold text-ink">
                {question.prompt}
              </h3>
            </div>

            {/* Options List */}
            <div className="grid gap-2.5 sm:grid-cols-1">
              {question.options.map((option, i) => {
                const state = picked === null ? 'idle' : i === question.answer ? 'right' : i === picked ? 'wrong' : 'idle'
                return (
                  <button
                    key={`${option}-${i}`}
                    type="button"
                    disabled={picked !== null}
                    onClick={() => handlePickOption(i)}
                    className={cx(
                      'flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left text-[14px] font-bold transition-all cursor-pointer select-none',
                      state === 'idle' && 'border-sand bg-paper text-ink hover:border-teal-300 hover:bg-cream shadow-[0_2px_0_0_var(--color-drop)]',
                      state === 'right' && 'border-leaf-400 bg-leaf-50 text-leaf-700 shadow-[0_3px_0_0_var(--color-leaf-600)] font-extrabold',
                      state === 'wrong' && 'border-coral-400 bg-coral-50 text-coral-700 shadow-[0_2px_0_0_var(--color-coral-600)]',
                    )}
                  >
                    <span
                      className={cx(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border-2 text-[12px] font-extrabold',
                        state === 'right'
                          ? 'border-leaf-500 bg-leaf-500 text-white'
                          : state === 'wrong'
                            ? 'border-coral-500 bg-coral-500 text-white'
                            : 'border-sand bg-shell text-ink-soft',
                      )}
                    >
                      {state === 'right' ? <Icon name="check" size={14} /> : state === 'wrong' ? <Icon name="close" size={14} /> : String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{option}</span>
                  </button>
                )
              })}
            </div>

            {/* Answer Feedback & Deep Explanation */}
            {picked !== null ? (
              <div className="anim-rise mt-5 space-y-4 rounded-2xl border-2 border-sand bg-cream p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={cx('flex h-7 w-7 items-center justify-center rounded-xl border-2', picked === question.answer ? 'border-leaf-400 bg-leaf-100 text-leaf-700' : 'border-coral-400 bg-coral-100 text-coral-700')}>
                      <Icon name={picked === question.answer ? 'party' : 'tip'} size={16} />
                    </span>
                    <span className="font-display text-[15px] font-extrabold text-ink">
                      {picked === question.answer ? 'Jawaban Benar!' : 'Belum Tepat, Ini Pembahasannya:'}
                    </span>
                  </div>
                  <Button size="sm" icon="next" onClick={handleNextQuestion}>
                    {questionIndex < questions.length - 1 ? 'Soal Berikutnya' : 'Selesai Latihan Ini'}
                  </Button>
                </div>

                {/* Explanation */}
                <div className="rounded-xl border border-sand bg-paper p-3 text-[13.5px] leading-relaxed text-ink-soft">
                  <strong className="text-ink">Penjelasan Kunci:</strong> {question.explanation}
                </div>

                {/* Key Vocab */}
                {question.keyVocab?.length ? (
                  <div>
                    <div className="mb-1.5 text-[12px] font-extrabold uppercase tracking-wide text-ink-faint">
                      Kosakata Kunci Audio:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {question.keyVocab.map((v) => (
                        <span key={v.word} className="rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-[12.5px] font-bold text-teal-900">
                          <span className="font-cjk font-extrabold">{v.word}</span> = {v.meaning}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  )
}
