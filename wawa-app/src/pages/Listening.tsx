import { useEffect, useMemo, useState } from 'react'
import { Wawa } from '@/brand/Wawa'
import { Button, Card, Chip, Icon, SectionTitle, cx } from '@/components/ui'
import { LANGUAGES } from '@/data/languages'
import { useProgress } from '@/store/useProgress'
import type { LangId } from '@/data/types'

type ListeningItem = {
  text: string
  reading: string
  prompt: string
  options: string[]
  answer: number
  voice: string
}

const ITEMS: Record<LangId, ListeningItem[]> = {
  jp: [
    { text: '駅はどこですか。', reading: 'Eki wa doko desu ka?', prompt: 'Apa yang ditanyakan?', options: ['Lokasi stasiun', 'Harga tiket', 'Jam berangkat'], answer: 0, voice: 'ja-JP' },
    { text: '明日は七時に起きます。', reading: 'Ashita wa shichi-ji ni okimasu.', prompt: 'Pukul berapa pembicara bangun besok?', options: ['Pukul enam', 'Pukul tujuh', 'Pukul delapan'], answer: 1, voice: 'ja-JP' },
    { text: 'コーヒーを二つください。', reading: 'Kōhī o futatsu kudasai.', prompt: 'Apa yang dipesan?', options: ['Satu teh', 'Dua kopi', 'Tiga kopi'], answer: 1, voice: 'ja-JP' },
  ],
  cn: [
    { text: '地铁站在哪儿？', reading: 'Dìtiě zhàn zài nǎr?', prompt: 'Apa yang ditanyakan?', options: ['Lokasi stasiun MRT', 'Harga makanan', 'Nama jalan'], answer: 0, voice: 'zh-CN' },
    { text: '我明天上午八点上班。', reading: 'Wǒ míngtiān shàngwǔ bā diǎn shàngbān.', prompt: 'Kapan pembicara mulai bekerja?', options: ['Besok pukul delapan pagi', 'Hari ini pukul delapan', 'Besok pukul sembilan'], answer: 0, voice: 'zh-CN' },
    { text: '请给我两杯茶。', reading: 'Qǐng gěi wǒ liǎng bēi chá.', prompt: 'Apa yang diminta?', options: ['Dua cangkir teh', 'Satu gelas air', 'Dua mangkuk nasi'], answer: 0, voice: 'zh-CN' },
  ],
  kr: [
    { text: '지하철역이 어디예요?', reading: 'Jihacheol-yeogi eodiyeyo?', prompt: 'Apa yang ditanyakan?', options: ['Lokasi stasiun MRT', 'Nomor bus', 'Harga tiket'], answer: 0, voice: 'ko-KR' },
    { text: '내일 아침 일곱 시에 일어나요.', reading: 'Naeil achim ilgop sie ireonayo.', prompt: 'Pukul berapa pembicara bangun?', options: ['Pukul enam', 'Pukul tujuh', 'Pukul sembilan'], answer: 1, voice: 'ko-KR' },
    { text: '커피 두 잔 주세요.', reading: 'Keopi du jan juseyo.', prompt: 'Apa yang dipesan?', options: ['Dua kopi', 'Satu teh', 'Tiga jus'], answer: 0, voice: 'ko-KR' },
  ],
  en: [
    { text: 'Could you tell me where the nearest station is?', reading: 'Connected speech: could-you / where-the', prompt: 'Apa yang ditanyakan?', options: ['Lokasi stasiun terdekat', 'Jadwal kereta terakhir', 'Harga tiket'], answer: 0, voice: 'en-GB' },
    { text: 'I should have finished it by Friday.', reading: 'Perhatikan weak form: should’ve /əv/', prompt: 'Kapan tugas seharusnya selesai?', options: ['Sebelum Jumat', 'Setelah Jumat', 'Hari Senin'], answer: 0, voice: 'en-GB' },
    { text: 'The meeting has been moved to half past three.', reading: 'half past three = 15.30', prompt: 'Rapat dipindah ke pukul berapa?', options: ['15.00', '15.30', '16.30'], answer: 1, voice: 'en-GB' },
  ],
}

export default function Listening() {
  const activeLang = useProgress((s) => s.activeLang)
  const lang = LANGUAGES[activeLang]
  const items = ITEMS[activeLang]
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [showText, setShowText] = useState(false)
  const [slow, setSlow] = useState(false)
  const supported = useMemo(() => typeof window !== 'undefined' && 'speechSynthesis' in window, [])
  const item = items[index]

  useEffect(() => {
    window.speechSynthesis?.cancel()
    setIndex(0)
    setPicked(null)
    setShowText(false)
  }, [activeLang])

  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  const play = () => {
    if (!supported) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(item.text)
    utterance.lang = item.voice
    utterance.rate = slow ? 0.7 : 0.95
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith(item.voice.slice(0, 2).toLowerCase()))
    if (voice) utterance.voice = voice
    window.speechSynthesis.speak(utterance)
  }

  const next = () => {
    setIndex((index + 1) % items.length)
    setPicked(null)
    setShowText(false)
  }

  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow={'Latihan menyimak · ' + lang.name}
        title="Dengar dulu, baru lihat teks"
        sub="Putar audio tanpa transkrip, jawab maknanya, lalu buka teks untuk shadowing. Konten mengikuti bahasa aktif."
        right={<Chip color="grape" icon="listen">{index + 1} / {items.length}</Chip>}
      />

      <Card className="relative overflow-hidden">
        <div className="grid gap-6 md:grid-cols-[180px_1fr]">
          <div className="flex items-center justify-center rounded-3xl bg-cream p-4">
            <Wawa expression="teach" size={150} accent={lang.color} className="anim-bob" />
          </div>
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Button size="lg" icon="listen" onClick={play} disabled={!supported}>Putar audio</Button>
              <Button variant="secondary" icon={slow ? 'check' : 'sound'} onClick={() => setSlow((v) => !v)}>
                {slow ? 'Kecepatan 0,7×' : 'Kecepatan normal'}
              </Button>
              <Button variant="ghost" icon="read" onClick={() => setShowText((v) => !v)}>
                {showText ? 'Sembunyikan teks' : 'Buka transkrip'}
              </Button>
            </div>

            {!supported ? (
              <p className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-3 text-[13px] text-ink-soft">
                Browser ini tidak menyediakan suara bawaan. Buka di Chrome atau Edge untuk memutar latihan.
              </p>
            ) : null}

            {showText ? (
              <div className="anim-rise mb-4 rounded-2xl border-2 border-sand bg-paper p-4">
                <div className="font-cjk text-2xl font-bold text-ink">{item.text}</div>
                <div className="mt-1 text-[13px] font-semibold text-ink-faint">{item.reading}</div>
              </div>
            ) : (
              <div className="mb-4 flex h-[86px] items-center justify-center rounded-2xl border-2 border-dashed border-sand bg-shell text-ink-faint">
                <Icon name="listen" size={28} />
              </div>
            )}

            <h3 className="mb-3 text-lg text-ink">{item.prompt}</h3>
            <div className="grid gap-2 sm:grid-cols-3">
              {item.options.map((option, i) => {
                const state = picked === null ? 'idle' : i === item.answer ? 'right' : i === picked ? 'wrong' : 'idle'
                return (
                  <button
                    key={option}
                    disabled={picked !== null}
                    onClick={() => setPicked(i)}
                    className={cx(
                      'rounded-2xl border-2 px-3 py-3 text-left text-[13.5px] font-bold',
                      state === 'idle' && 'border-sand bg-paper text-ink-soft hover:bg-cream',
                      state === 'right' && 'border-leaf-400 bg-leaf-50 text-leaf-600',
                      state === 'wrong' && 'border-coral-400 bg-coral-50 text-coral-600',
                    )}
                  >
                    {option}
                  </button>
                )
              })}
            </div>

            {picked !== null ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-sand bg-cream p-3">
                <span className="font-display text-[14px] font-extrabold text-ink">
                  {picked === item.answer ? 'Tepat. Putar lagi dan tirukan.' : 'Belum tepat. Dengarkan sekali lagi.'}
                </span>
                <Button size="sm" onClick={next}>Soal berikutnya</Button>
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  )
}
