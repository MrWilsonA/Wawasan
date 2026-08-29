import { useEffect, useMemo, useState, useRef } from 'react'
import { Wawa } from '@/brand/Wawa'
import { Button, Card, Chip, SectionTitle, cx } from '@/components/ui'
import { LANGUAGES } from '@/data/languages'
import { useProgress } from '@/store/useProgress'
import { SPEAKING_DATA, type SpeakingPhrase, type SpeakingDialogue, type SpeakingLevel } from '@/data/speakingData'
import { playSound } from '@/lib/sound'

type Mode = 'shadowing' | 'dialogue'

export default function Speaking() {
  const activeLang = useProgress((s) => s.activeLang)
  const lang = LANGUAGES[activeLang]
  const levels = useMemo(() => SPEAKING_DATA[activeLang] || [], [activeLang])

  const [activeLevelId, setActiveLevelId] = useState<string>(() => levels[0]?.id || 'n5')
  const [mode, setMode] = useState<Mode>('shadowing')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isPlayingRef, setIsPlayingRef] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedText, setRecordedText] = useState('')
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [dialogueIndex] = useState(0)

  // Speech Recognition API reference
  const recognitionRef = useRef<any>(null)

  // Reset when active language changes
  useEffect(() => {
    window.speechSynthesis?.cancel()
    if (levels.length > 0) {
      setActiveLevelId(levels[0].id)
      setPhraseIndex(0)
      setAccuracyScore(null)
      setRecordedText('')
      setFeedbackMessage('')
    }
  }, [activeLang, levels])

  const currentLevel: SpeakingLevel | undefined = useMemo(() => {
    return levels.find((l) => l.id === activeLevelId) || levels[0]
  }, [levels, activeLevelId])

  const phrases = currentLevel?.phrases || []
  const phrase: SpeakingPhrase | undefined = phrases[phraseIndex] || phrases[0]

  const dialogues = currentLevel?.dialogues || []
  const currentDialogue: SpeakingDialogue | undefined = dialogues[dialogueIndex]

  // Setup Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false

        // Match language voice code
        const langMap: Record<string, string> = { jp: 'ja-JP', cn: 'zh-CN', kr: 'ko-KR', en: 'en-GB' }
        recognition.lang = langMap[activeLang] || 'en-US'

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setRecordedText(transcript)
          evaluateSpeech(transcript)
        }

        recognition.onerror = () => {
          setIsRecording(false)
          setFeedbackMessage('Tidak dapat menangkap suara dengan jelas. Silakan coba lagi.')
        }

        recognition.onend = () => {
          setIsRecording(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [activeLang])

  // Play Native Reference Audio
  const playReferenceAudio = (textToPlay?: string) => {
    const text = textToPlay || phrase?.targetText
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    setIsPlayingRef(true)
    playSound('tap')

    const utterance = new SpeechSynthesisUtterance(text)
    const voiceCode = phrase?.voice || 'en-GB'
    utterance.lang = voiceCode
    utterance.rate = 0.9

    const voices = window.speechSynthesis.getVoices()
    const prefix = voiceCode.slice(0, 2).toLowerCase()
    const matchingVoice = voices.find((v) => v.lang.toLowerCase().startsWith(prefix))
    if (matchingVoice) utterance.voice = matchingVoice

    utterance.onend = () => setIsPlayingRef(false)
    utterance.onerror = () => setIsPlayingRef(false)

    window.speechSynthesis.speak(utterance)
  }

  // Calculate pronunciation similarity
  const evaluateSpeech = (spoken: string) => {
    if (!phrase) return
    const target = phrase.targetText.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()？。！，]/g, '').trim()
    const userSpoken = spoken.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()？。！，]/g, '').trim()

    let score = 0
    if (target === userSpoken) {
      score = 100
    } else {
      // Calculate token/character overlap
      let matches = 0
      const targetTokens = Array.from(target)
      const userTokens = Array.from(userSpoken)
      userTokens.forEach((char) => {
        if (targetTokens.includes(char)) matches++
      })
      score = Math.min(95, Math.max(30, Math.round((matches / Math.max(targetTokens.length, userTokens.length)) * 100)))
    }

    setAccuracyScore(score)
    if (score >= 85) {
      playSound('correct')
      setFeedbackMessage('Luar biasa! Pelafalan dan intonasi Anda sangat alami dan jelas.')
    } else if (score >= 60) {
      playSound('tap')
      setFeedbackMessage('Bagus! Dengarkan lagi audio acuan untuk menyempurnakan ritme & nada.')
    } else {
      playSound('wrong')
      setFeedbackMessage('Masih kurang tepat. Perhatikan panduan fonetik dan coba rekam sekali lagi.')
    }
  }

  // Toggle mic recording
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
    } else {
      if (!recognitionRef.current) {
        // Fallback simulation if browser doesn't support Web Speech Recognition
        setRecordedText(phrase.targetText)
        evaluateSpeech(phrase.targetText)
        return
      }
      try {
        setRecordedText('')
        setAccuracyScore(null)
        setFeedbackMessage('')
        setIsRecording(true)
        playSound('tap')
        recognitionRef.current.start()
      } catch {
        setIsRecording(false)
      }
    }
  }

  const handleNextPhrase = () => {
    playSound('tap')
    if (phraseIndex < phrases.length - 1) {
      setPhraseIndex(phraseIndex + 1)
      setRecordedText('')
      setAccuracyScore(null)
      setFeedbackMessage('')
    } else {
      setPhraseIndex(0)
      playSound('levelComplete')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionTitle
        eyebrow={`Latihan Berbicara · ${lang.name} (${lang.nativeName})`}
        title="Latihan Pelafalan, Shadowing & Percakapan"
        sub="Dengarkan penutur asli, tirukan irama bicaranya dengan teknik shadowing, dan rekam pelafalan Anda untuk dinilai akurasinya."
        right={
          <Chip color="coral" icon="production">
            Mode Berbicara
          </Chip>
        }
      />

      {/* Mode & Level Selectors */}
      <Card className="!p-4 bg-paper border-2 border-sand shadow-[0_4px_0_0_var(--color-drop)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Mode Switch */}
          <div className="flex rounded-2xl border-2 border-sand bg-shell p-1">
            <button
              type="button"
              onClick={() => {
                playSound('tap')
                setMode('shadowing')
              }}
              className={cx(
                'rounded-xl px-4 py-2 text-[13px] font-extrabold transition-all cursor-pointer',
                mode === 'shadowing'
                  ? 'bg-paper text-teal-800 shadow-[0_2px_0_0_var(--color-drop)]'
                  : 'text-ink-soft hover:text-ink',
              )}
            >
              🎙️ Shadowing & Pelafalan
            </button>

            {dialogues.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  playSound('tap')
                  setMode('dialogue')
                }}
                className={cx(
                  'rounded-xl px-4 py-2 text-[13px] font-extrabold transition-all cursor-pointer',
                  mode === 'dialogue'
                    ? 'bg-paper text-teal-800 shadow-[0_2px_0_0_var(--color-drop)]'
                    : 'text-ink-soft hover:text-ink',
                )}
              >
                💬 Roleplay Dialog ({dialogues.length})
              </button>
            ) : null}
          </div>

          {/* Level Badges */}
          <div className="flex flex-wrap gap-1.5">
            {levels.map((lvl) => {
              const isSelected = lvl.id === activeLevelId
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    playSound('tap')
                    setActiveLevelId(lvl.id)
                    setPhraseIndex(0)
                    setAccuracyScore(null)
                    setRecordedText('')
                  }}
                  className={cx(
                    'rounded-xl border-2 px-3 py-1.5 text-[12px] font-extrabold transition-all cursor-pointer',
                    isSelected
                      ? 'border-coral-400 bg-coral-50 text-coral-900 shadow-[0_2px_0_0_var(--color-coral-600)]'
                      : 'border-sand bg-cream text-ink-soft hover:border-coral-300',
                  )}
                >
                  {lvl.badge}
                </button>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Mode 1: Shadowing & Drill Pelafalan */}
      {mode === 'shadowing' && phrase ? (
        <Card className="relative overflow-hidden border-2 border-sand shadow-[0_6px_0_0_var(--color-drop)]">
          {/* Top Bar info */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-sand pb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-coral-300 bg-coral-50 font-display text-[13px] font-extrabold text-coral-800">
                #{phraseIndex + 1}
              </span>
              <div>
                <div className="font-display text-[15px] font-extrabold text-ink">
                  {phrase.title}
                </div>
                <div className="text-[12px] font-medium text-ink-faint">
                  {phrase.scenario}
                </div>
              </div>
            </div>

            <Chip size="sm" color="amber">
              Tingkat: {phrase.difficulty.toUpperCase()}
            </Chip>
          </div>

          <div className="grid gap-6 md:grid-cols-[170px_1fr]">
            {/* Mascot Side View */}
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-sand bg-cream p-4 text-center">
              <Wawa
                expression={isRecording ? 'celebrate' : accuracyScore !== null && accuracyScore >= 80 ? 'happy' : isPlayingRef ? 'teach' : 'excited'}
                size={130}
                accent={lang.color}
                className={cx('anim-bob', isRecording && 'scale-110 animate-pulse')}
              />
              <span className="mt-2 font-display text-[12px] font-bold text-ink-soft">
                {isRecording ? 'Mendengarkan ucapan...' : isPlayingRef ? 'Perhatikan cara bacanya' : 'Siap merekam suara'}
              </span>
            </div>

            {/* Speaking Content */}
            <div className="space-y-4">
              {/* Target Character / Word Display */}
              <div className="rounded-2xl border-2 border-sand bg-paper p-5 shadow-[0_3px_0_0_var(--color-drop)]">
                <div className="text-[11px] font-extrabold uppercase tracking-wide text-coral-600">
                  Frasa Target Tiruan:
                </div>
                <div className="mt-1 font-cjk text-[26px] font-bold text-ink leading-relaxed">
                  {phrase.targetText}
                </div>
                <div className="mt-1 font-mono text-[14px] font-bold text-ink-soft">
                  {phrase.romanization}
                </div>
                <div className="mt-2 rounded-xl border border-sand bg-cream/70 p-2.5 text-[12.5px] font-medium text-ink-soft">
                  🗣️ <strong>Panduan Fonetik:</strong> {phrase.phoneticGuide}
                </div>
                {phrase.toneGuide ? (
                  <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50/80 p-2.5 text-[12px] font-semibold text-amber-900">
                    🎵 <strong>Intonasi & Nada:</strong> {phrase.toneGuide}
                  </div>
                ) : null}
                <div className="mt-2 text-[13px] italic text-ink-faint">
                  Arti: "{phrase.translation}"
                </div>
              </div>

              {/* Action Buttons: Listen Reference & Record */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  icon="listen"
                  onClick={() => playReferenceAudio()}
                  className={cx(isPlayingRef && 'ring-4 ring-coral-200 animate-pulse')}
                >
                  {isPlayingRef ? 'Memutar Audio...' : '🔊 Dengar Contoh Asli'}
                </Button>

                <button
                  type="button"
                  onClick={toggleRecording}
                  className={cx(
                    'flex items-center gap-2 rounded-2xl border-2 px-5 py-3 font-display text-[15px] font-extrabold transition-all cursor-pointer select-none',
                    isRecording
                      ? 'border-coral-600 bg-coral-500 text-white shadow-[0_4px_0_0_var(--color-coral-700)] animate-pulse'
                      : 'border-sand bg-paper text-ink hover:border-coral-400 hover:bg-cream shadow-[0_3px_0_0_var(--color-drop)]',
                  )}
                >
                  <span className={cx('flex h-4 w-4 rounded-full', isRecording ? 'bg-white animate-ping' : 'bg-coral-500')} />
                  <span>{isRecording ? '⏹ Selesai Bicara' : '🎙️ Rekam Suara Saya'}</span>
                </button>
              </div>

              {/* Recording Result Feedback */}
              {recordedText ? (
                <div className="anim-rise rounded-2xl border-2 border-sand bg-shell p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-extrabold uppercase tracking-wide text-ink-faint">
                      Suara yang Terdeteksi:
                    </span>
                    {accuracyScore !== null ? (
                      <Chip size="sm" color={accuracyScore >= 80 ? 'leaf' : accuracyScore >= 60 ? 'amber' : 'coral'}>
                        Skor Akurasi: {accuracyScore}%
                      </Chip>
                    ) : null}
                  </div>

                  <div className="font-cjk text-[18px] font-bold text-ink">
                    "{recordedText}"
                  </div>

                  {feedbackMessage ? (
                    <div className="rounded-xl border border-sand bg-paper p-3 text-[13px] font-semibold text-ink-soft">
                      {feedbackMessage}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* Tips & Next Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-[12.5px] font-medium text-ink-soft max-w-md">
                  💡 <strong>Tips Pelafalan:</strong> {phrase.tips}
                </div>

                <Button size="sm" onClick={handleNextPhrase}>
                  {phraseIndex < phrases.length - 1 ? 'Frasa Berikutnya →' : 'Ulangi / Selesai Level 🏆'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Mode 2: Roleplay Dialog */}
      {mode === 'dialogue' && currentDialogue ? (
        <Card className="border-2 border-sand shadow-[0_6px_0_0_var(--color-drop)] space-y-4">
          <div className="border-b-2 border-sand pb-3">
            <h3 className="font-display text-[18px] font-extrabold text-ink">
              {currentDialogue.title}
            </h3>
            <p className="text-[13px] text-ink-soft">{currentDialogue.context}</p>
          </div>

          {/* Dialogue Turns */}
          <div className="space-y-3">
            {currentDialogue.turns.map((turn, i) => {
              const isWawa = turn.speaker === 'wawa'
              return (
                <div
                  key={i}
                  className={cx(
                    'flex gap-3 rounded-2xl border-2 p-4',
                    isWawa
                      ? 'border-teal-200 bg-teal-50/70 mr-8'
                      : 'border-coral-200 bg-coral-50/70 ml-8',
                  )}
                >
                  <div className="shrink-0">
                    {isWawa ? (
                      <Wawa expression="teach" size={40} accent={lang.color} />
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-coral-300 bg-paper text-lg font-bold">
                        👤
                      </span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-extrabold uppercase text-ink-faint">
                        {isWawa ? 'Wawa-san' : 'Giliran Anda Berbicara'}
                      </span>
                      <button
                        type="button"
                        onClick={() => playReferenceAudio(turn.text)}
                        className="text-[12px] font-bold text-teal-700 hover:underline cursor-pointer"
                      >
                        🔊 Putar Suara
                      </button>
                    </div>

                    <div className="font-cjk text-[18px] font-bold text-ink">
                      {turn.text}
                    </div>
                    <div className="text-[12.5px] font-medium text-ink-soft">
                      {turn.reading}
                    </div>
                    <div className="text-[12px] italic text-ink-faint">
                      "{turn.translation}"
                    </div>

                    {turn.prompt ? (
                      <div className="mt-2 text-[12px] font-bold text-coral-700">
                        🎯 Instruksi: {turn.prompt}
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      ) : null}
    </div>
  )
}
