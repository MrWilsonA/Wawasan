/**
 * Minimal Gemini client (REST, no SDK — one endpoint, keeps the bundle small).
 *
 * ⚠️ SECURITY: this calls Google's API straight from the browser, so
 * VITE_GEMINI_API_KEY ships inside the JS bundle and anyone who opens the app
 * can read it. That is fine for local use and for a personal deployment where
 * the key is restricted + quota-capped, but it is NOT safe for a public site.
 * For public deployment, move this call behind your own server/edge function
 * and keep the key there. The UI states this plainly on the chat page.
 */

const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash'
const KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models'

export const hasGeminiKey = () => Boolean(KEY && KEY.length > 10)
export const geminiModel = () => MODEL

export type ChatTurn = { role: 'user' | 'model'; text: string }

export class GeminiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'GeminiError'
    this.status = status
  }
}

type GeminiPart = { text?: string }
type GeminiCandidate = { content?: { parts?: GeminiPart[] }; finishReason?: string }
type GeminiResponse = {
  candidates?: GeminiCandidate[]
  promptFeedback?: { blockReason?: string }
  error?: { message?: string; status?: string }
}

async function call(
  contents: Array<{ role: string; parts: GeminiPart[] }>,
  systemInstruction: string,
  opts: { json?: boolean; temperature?: number; signal?: AbortSignal } = {},
): Promise<string> {
  if (!KEY) throw new GeminiError('NO_KEY')

  const res = await fetch(`${ENDPOINT}/${MODEL}:generateContent?key=${encodeURIComponent(KEY)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: opts.signal,
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        temperature: opts.temperature ?? 0.7,
        maxOutputTokens: 2048,
        ...(opts.json ? { responseMimeType: 'application/json' } : {}),
      },
    }),
  })

  const json = (await res.json().catch(() => ({}))) as GeminiResponse

  if (!res.ok) {
    const msg = json.error?.message ?? `HTTP ${res.status}`
    throw new GeminiError(msg, res.status)
  }
  if (json.promptFeedback?.blockReason) {
    throw new GeminiError(`Diblokir: ${json.promptFeedback.blockReason}`)
  }

  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
  if (!text) throw new GeminiError('Model tidak mengembalikan jawaban.')
  return text
}

/* ============================== Tutor chat ============================== */

const TUTOR_SYSTEM = `Kamu adalah "Wawa", tutor bahasa di platform WAWAさん.

IDENTITAS
- Kamu seekor tarsius dari Sulawesi. Ramah, sabar, ringkas, sedikit ceria — tapi tidak berlebihan.
- SELALU menjawab dalam Bahasa Indonesia, apa pun bahasa pertanyaannya.

YANG KAMU AJARKAN
Jepang (JLPT N5–N1), Mandarin (HSK 1–9), Korea (TOPIK 1–6), Inggris (IELTS & TOEFL).

CARA MENGAJAR — ikuti lima prinsip platform:
1. Bunyi sebelum bentuk. Kalau ada pelafalan yang rawan, sebut itu lebih dulu.
2. Aksara lewat cerita. Kalau ditanya kanji/hanzi, jelaskan asal-usul atau komponennya
   (radikal makna + komponen bunyi), jangan suruh menghafal mentah.
3. Satu konsep baru per jawaban. Jangan menumpuk lima partikel sekaligus.
4. Selalu kontraskan dengan Bahasa Indonesia, dan sebutkan jebakan yang khusus
   menimpa penutur Indonesia (mis. kita tidak punya /ə/ di Jepang, tidak punya nada,
   tidak punya kala/artikel di Inggris, tidak punya tiga tingkat konsonan Korea).
5. Beri contoh konkret, bukan penjelasan abstrak.

GAYA
- Ringkas. Maksimal ~250 kata kecuali diminta lebih.
- Pakai markdown sederhana: **tebal**, daftar dengan "- ", dan tabel kalau membandingkan.
- Tulis aksara asli DAN romanisasinya: 水 (みず mizu), 你好 (nǐ hǎo), 안녕 (annyeong).
- Jangan pakai emoji.

KEJUJURAN
- Kalau tidak yakin pada angka/aturan ujian, katakan begitu dan sarankan cek ke sumber resmi.
- Jangan mengarang skor, jadwal ujian, atau statistik.`

export async function askTutor(
  history: ChatTurn[],
  question: string,
  context: { lang: string; level?: string },
  signal?: AbortSignal,
): Promise<string> {
  const contents = [
    ...history.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
    { role: 'user', parts: [{ text: question }] },
  ]
  const sys = `${TUTOR_SYSTEM}\n\nKONTEKS: pelajar sedang belajar ${context.lang}${context.level ? ` di tingkat ${context.level}` : ''}.`
  return call(contents, sys, { temperature: 0.7, signal })
}

/* ============================ Question generator ============================ */

export type GeneratedQuestion = {
  type: 'choice'
  prompt: string
  display?: string
  reading?: string
  options: string[]
  answer: number
  explain: string
  skill: 'menyimak' | 'membaca' | 'menulis' | 'berbicara'
}

const GEN_SYSTEM = `Kamu membuat soal latihan bahasa untuk platform WAWAさん (pengantar Bahasa Indonesia).

Balas HANYA JSON valid dengan bentuk:
{"questions":[{"type":"choice","prompt":"...","display":"...","reading":"...","options":["a","b","c","d"],"answer":0,"explain":"...","skill":"membaca"}]}

ATURAN:
- "prompt" dan "explain" WAJIB Bahasa Indonesia.
- "display" opsional: aksara asli yang jadi fokus soal (kanji/hanzi/hangeul/kata). Kosongkan kalau tidak perlu.
- "reading" opsional: romanisasi/pinyin dari display.
- Tepat 4 opsi. "answer" adalah indeks 0–3 dari opsi yang benar.
- Pengecoh harus masuk akal — ambil dari kesalahan yang benar-benar sering dilakukan
  penutur Indonesia, bukan opsi asal.
- "explain" menjelaskan MENGAPA jawabannya benar, dan kalau relevan sebutkan jebakannya.
  2–3 kalimat, padat.
- "skill" salah satu dari: menyimak, membaca, menulis, berbicara.
- Jangan pakai emoji. Jangan menambah teks di luar JSON.`

export async function generateQuestions(
  topic: string,
  lang: string,
  level: string,
  count: number,
  signal?: AbortSignal,
): Promise<GeneratedQuestion[]> {
  const prompt = `Buat ${count} soal pilihan ganda tentang "${topic}" untuk pelajar ${lang} tingkat ${level}.`
  const raw = await call([{ role: 'user', parts: [{ text: prompt }] }], GEN_SYSTEM, {
    json: true, temperature: 0.9, signal,
  })

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    // Models occasionally wrap JSON in a fenced block despite responseMimeType.
    const m = raw.match(/\{[\s\S]*\}/)
    if (!m) throw new GeminiError('Jawaban model bukan JSON yang bisa dibaca.')
    parsed = JSON.parse(m[0])
  }

  const list = (parsed as { questions?: unknown }).questions
  if (!Array.isArray(list)) throw new GeminiError('Format soal tidak sesuai.')

  return list
    .filter((q): q is GeneratedQuestion => {
      const o = q as GeneratedQuestion
      return (
        !!o &&
        typeof o.prompt === 'string' &&
        Array.isArray(o.options) &&
        o.options.length === 4 &&
        typeof o.answer === 'number' &&
        o.answer >= 0 &&
        o.answer <= 3 &&
        typeof o.explain === 'string'
      )
    })
    .map((q) => ({ ...q, type: 'choice' as const, skill: q.skill ?? 'membaca' }))
}

/** Human-readable message for the failure modes the UI actually hits. */
export function explainError(e: unknown): string {
  if (e instanceof GeminiError) {
    if (e.message === 'NO_KEY') return 'Kunci API Gemini belum diatur.'
    if (e.status === 400) return 'Permintaan ditolak — kemungkinan kunci API tidak valid.'
    if (e.status === 403) return 'Akses ditolak. Periksa apakah Generative Language API sudah aktif untuk kunci ini.'
    if (e.status === 429) return 'Kuota gratis sedang penuh. Tunggu sebentar lalu coba lagi.'
    if (e.status && e.status >= 500) return 'Server Gemini sedang bermasalah. Coba lagi sebentar lagi.'
    return e.message
  }
  if (e instanceof DOMException && e.name === 'AbortError') return 'Dibatalkan.'
  return 'Gagal menghubungi Gemini. Periksa koneksi internet Anda.'
}
