import { useEffect, useState } from 'react'
import { Wawa } from '@/brand/Wawa'
import { Callout, Card, Chip, DataTable, SectionTitle, Tabs, cx } from '@/components/ui'
import {
  JLPT_LEVELS, JLPT_SECTIONS, JLPT_NOTES, HSK_20, TOPIK_LEVELS, TOPIK_II_PARTS,
  IELTS_ROUNDING, IELTS_TARGETS, TOEFL_CONCORDANCE, TOEFL_TARGETS, STUDY_HOURS,
} from '@/data/reference'
import {
  scoreJlpt, ieltsOverall, ieltsRoundingExplain, ieltsRawToBand, ieltsBandName,
  toeflOverall, toeflToOld, toeflCefr, scoreTopik, scoreHsk, monthsFor,
} from '@/lib/scoring'
import { useProgress } from '@/store/useProgress'
import type { LangId } from '@/data/types'

type Tab = 'jlpt' | 'hsk' | 'topik' | 'ielts' | 'toefl' | 'jam'
const DEFAULT_EXAM: Record<LangId, Tab> = { jp: 'jlpt', cn: 'hsk', kr: 'topik', en: 'ielts' }

export default function Exams() {
  const activeLang = useProgress((s) => s.activeLang)
  const [tab, setTab] = useState<Tab>(() => DEFAULT_EXAM[activeLang])
  useEffect(() => setTab(DEFAULT_EXAM[activeLang]), [activeLang])
  const tabs = activeLang === 'en'
    ? [
        { id: 'ielts' as const, label: 'IELTS' },
        { id: 'toefl' as const, label: 'TOEFL' },
        { id: 'jam' as const, label: 'Jam belajar' },
      ]
    : [
        { id: DEFAULT_EXAM[activeLang], label: DEFAULT_EXAM[activeLang].toUpperCase() },
        { id: 'jam' as const, label: 'Jam belajar' },
      ]
  return (
    <div className="space-y-5">
      <SectionTitle
        eyebrow="Gerbang 5 — Strategi Ujian"
        title="Kalkulator Ujian"
        sub="Hitung skor dengan aturan resmi masing-masing ujian — termasuk jebakan yang paling sering membuat kandidat gagal."
      />
      <Tabs
        tabs={tabs}
        value={tab}
        onChange={setTab}
      />
      {tab === 'jlpt' ? <JlptCalc /> : null}
      {tab === 'hsk' ? <HskCalc /> : null}
      {tab === 'topik' ? <TopikCalc /> : null}
      {tab === 'ielts' ? <IeltsCalc /> : null}
      {tab === 'toefl' ? <ToeflCalc /> : null}
      {tab === 'jam' ? <HoursCalc /> : null}
    </div>
  )
}

/* ------------------------------ shared ------------------------------ */
function Slider({
  label, value, max, min = 0, onChange, danger, dangerAt,
}: {
  label: string; value: number; max: number; min?: number
  onChange: (v: number) => void; danger?: boolean; dangerAt?: number
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className={cx('text-[13.5px] font-bold', danger ? 'text-coral-600' : 'text-ink-soft')}>
          {label}
          {dangerAt !== undefined ? (
            <span className="ml-1.5 text-[11px] font-extrabold text-ink-faint">min {dangerAt}</span>
          ) : null}
        </span>
        <span className="font-display text-[17px] font-extrabold text-ink">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cx(
          'h-3 w-full cursor-pointer appearance-none rounded-full border-2 border-sand',
          danger ? 'bg-coral-100 accent-coral-400' : 'bg-shell accent-teal-500',
        )}
        aria-label={label}
      />
    </div>
  )
}

function Verdict({ pass, title, body }: { pass: boolean; title: string; body: string }) {
  return (
    <div
      className={cx(
        'flex items-start gap-4 rounded-3xl border-2 p-5',
        pass ? 'border-leaf-200 bg-leaf-50' : 'border-coral-200 bg-coral-50',
      )}
    >
      <Wawa expression={pass ? 'celebrate' : 'sad'} size={82} cropped className="shrink-0" />
      <div className="min-w-0">
        <div className={cx('font-display text-xl font-extrabold', pass ? 'text-leaf-600' : 'text-coral-600')}>
          {title}
        </div>
        <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{body}</p>
      </div>
    </div>
  )
}

/* ------------------------------- JLPT ------------------------------- */
function JlptCalc() {
  const [level, setLevel] = useState('N1')
  const sections = JLPT_SECTIONS[level]
  const [scores, setScores] = useState<Record<string, number>>({ lang: 45, read: 40, listen: 20 })
  const r = scoreJlpt(level, scores)
  const meta = JLPT_LEVELS.find((l) => l.level === level)!

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4">
          <Tabs
            size="sm"
            tabs={JLPT_LEVELS.map((l) => ({ id: l.level, label: l.level }))}
            value={level}
            onChange={setLevel}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-4">
            {sections.map((s) => (
              <Slider
                key={s.key}
                label={s.label}
                value={scores[s.key] ?? 0}
                max={s.max}
                dangerAt={s.min}
                danger={(scores[s.key] ?? 0) < s.min}
                onChange={(v) => setScores({ ...scores, [s.key]: v })}
              />
            ))}
            <div className="flex items-center justify-between rounded-2xl border-2 border-sand bg-cream px-4 py-3">
              <span className="text-[13.5px] font-bold text-ink-soft">
                Total (lulus ≥ {meta.pass})
              </span>
              <span className={cx('font-display text-2xl font-extrabold', r.total >= meta.pass ? 'text-leaf-600' : 'text-coral-600')}>
                {r.total} <span className="text-[14px] text-ink-faint">/ 180</span>
              </span>
            </div>
          </div>

          <Verdict
            pass={r.pass}
            title={r.pass ? '✅ LULUS' : '❌ GAGAL'}
            body={
              r.reason === 'lulus'
                ? `Total ${r.total} ≥ ${r.threshold} DAN semua bagian di atas minimumnya. Sertifikat JLPT berlaku seumur hidup.`
                : r.reason === 'total'
                  ? `Semua bagian aman, tetapi total ${r.total} masih di bawah ambang ${r.threshold}.`
                  : r.reason === 'bagian'
                    ? `Total ${r.total} sudah melewati ambang ${r.threshold}, tetapi ${r.failedSections.join(' & ')} di bawah minimum. Ambang bagian bersifat MUTLAK — total tinggi tidak menolong.`
                    : `Total ${r.total} di bawah ambang ${r.threshold}, dan ${r.failedSections.join(' & ')} juga di bawah minimum.`
            }
          />
        </div>
      </Card>

      <Callout kind="warning" title="Jebakan skor bagian — kenapa kalkulator ini ada">
        Kandidat N1 dengan Bahasa 55, Baca 55, Simak 18 punya total <strong className="text-ink">128</strong> —
        lebih tinggi dari kandidat dengan total 117 yang LULUS. Tetapi ia{' '}
        <strong className="text-ink">GAGAL</strong>, karena Simak 18 &lt; 19.
        <br /><br />
        Implikasinya untuk cara belajar: pelajar Indonesia cenderung kuat di Membaca (karena belajar dari
        buku) dan lemah di Menyimak. <strong className="text-ink">Alokasikan minimal 30% waktu belajar
        untuk audio, sejak N5</strong> — bukan sebulan sebelum ujian.
      </Callout>

      <Card>
        <SectionTitle eyebrow="Referensi" title="Semua level JLPT" />
        <DataTable
          head={['Level', 'Kanji', 'Kosakata', 'Jam belajar*', 'Lulus', 'Min per bagian', 'Waktu']}
          rows={JLPT_LEVELS.map((l) => [
            <strong key="l" className="text-ink">{l.level}</strong>,
            l.kanji, l.vocab, l.hours,
            <span key="p" className="font-display font-extrabold text-ink">{l.pass}/180</span>,
            l.sections, l.time,
          ])}
          dense
        />
        <p className="mt-2 text-[12px] text-ink-faint">
          * Estimasi kumulatif untuk pelajar tanpa latar belakang kanji (seperti orang Indonesia).
          Bukan angka resmi penyelenggara.
        </p>
        <ul className="mt-3 space-y-1.5">
          {JLPT_NOTES.map((n, i) => (
            <li key={i} className="text-[13px] leading-relaxed text-ink-soft">• {n}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

/* ------------------------------- HSK ------------------------------- */
function HskCalc() {
  const [level, setLevel] = useState('HSK 4')
  const row = HSK_20.find((h) => h.level === level)!
  const [score, setScore] = useState(190)
  const r = scoreHsk(level, Math.min(score, row.total))

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4">
          <Tabs size="sm" tabs={HSK_20.map((h) => ({ id: h.level, label: h.level }))} value={level} onChange={setLevel} />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-4">
            <Slider label={`Skor total (maks ${row.total})`} value={Math.min(score, row.total)} max={row.total} onChange={setScore} />
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl border-2 border-sand bg-cream px-3.5 py-2.5">
                <div className="text-[11px] font-extrabold uppercase text-ink-faint">Kosakata</div>
                <div className="font-display text-lg font-extrabold text-ink">{row.vocab}</div>
              </div>
              <div className="rounded-2xl border-2 border-sand bg-cream px-3.5 py-2.5">
                <div className="text-[11px] font-extrabold uppercase text-ink-faint">Setara CEFR</div>
                <div className="font-display text-lg font-extrabold text-ink">{row.cefr}</div>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-sand bg-paper px-3.5 py-2.5 text-[13px] text-ink-soft">
              <strong className="text-ink">Struktur:</strong> {row.structure} · {row.time}
            </div>
          </div>
          <Verdict
            pass={r.pass}
            title={r.pass ? '✅ LULUS' : '❌ BELUM LULUS'}
            body={
              r.pass
                ? `Skor ${Math.min(score, row.total)} ≥ ambang ${r.threshold}. HSK memakai ambang tunggal — tidak ada minimum per bagian seperti JLPT.`
                : `Butuh ${r.threshold - Math.min(score, row.total)} poin lagi untuk mencapai ambang ${r.threshold} dari total ${r.total}.`
            }
          />
        </div>
      </Card>

      <Callout kind="warning" title="Wajib dipahami sebelum mendaftar">
        <strong className="text-ink">HSK 7, 8, dan 9 bukan tiga ujian.</strong> Ketiganya adalah SATU ujian
        gabungan (七—九级); level 7, 8, atau 9 ditentukan dari skor akhir, bukan dari ujian yang Anda pilih.
        <br /><br />
        <strong className="text-ink">Status transisi 2026:</strong> silabus 3.0 berlaku sejak Juli 2026,
        tetapi sesi ujian reguler HSK 1–6 sepanjang 2026 masih memakai daftar kosakata HSK 2.0.
        Konfirmasikan versi yang dipakai ke pusat ujian Anda sebelum menyusun target hafalan — selisihnya
        bisa ratusan kata.
      </Callout>

      <Card>
        <SectionTitle eyebrow="HSK 2.0" title="Sistem yang masih dipakai untuk ujian reguler 2026" />
        <DataTable
          head={['Level', 'Kosakata', 'Karakter', 'Total', 'Lulus', 'Struktur', 'Waktu', 'CEFR']}
          rows={HSK_20.map((h) => [
            <strong key="l" className="text-ink">{h.level}</strong>,
            h.vocab, h.chars, String(h.total),
            <span key="p" className="font-display font-extrabold text-ink">{h.pass}</span>,
            h.structure, h.time, h.cefr,
          ])}
          dense
        />
      </Card>
    </div>
  )
}

/* ------------------------------- TOPIK ------------------------------- */
function TopikCalc() {
  const [exam, setExam] = useState<'I' | 'II'>('II')
  const [score, setScore] = useState(195)
  const max = exam === 'I' ? 200 : 300
  const r = scoreTopik(exam, Math.min(score, max))

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4">
          <Tabs
            size="sm"
            tabs={[
              { id: 'I' as const, label: 'TOPIK I (Level 1–2)' },
              { id: 'II' as const, label: 'TOPIK II (Level 3–6)' },
            ]}
            value={exam}
            onChange={setExam}
          />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-4">
            <Slider label={`Skor PBT (maks ${max})`} value={Math.min(score, max)} max={max} onChange={setScore} />
            <div className="space-y-1.5">
              {TOPIK_LEVELS.filter((t) => t.exam === `TOPIK ${exam}`).map((t) => {
                const active = r.label === t.level
                return (
                  <div
                    key={t.level}
                    className={cx(
                      'flex items-center justify-between rounded-xl border-2 px-3.5 py-2 text-[13px]',
                      active ? 'border-kr bg-sky-50' : 'border-sand bg-paper',
                    )}
                    style={active ? { borderColor: '#4a7fe0' } : undefined}
                  >
                    <span className="font-bold text-ink">{t.level}</span>
                    <span className="text-ink-soft">PBT {t.pbt} · IBT {t.ibt}</span>
                    <Chip size="sm" color="ink">{t.cefr}</Chip>
                  </div>
                )
              })}
            </div>
          </div>
          <Verdict
            pass={r.level !== null}
            title={r.level !== null ? `🎓 ${r.label}` : '❌ 불합격'}
            body={
              r.level !== null
                ? `Anda tidak memilih level — Anda memilih UJIAN. Skor ${Math.min(score, max)} menempatkan Anda di ${r.label}. Sertifikat berlaku 2 tahun sejak tanggal pengumuman.`
                : `Skor ${Math.min(score, max)} di bawah ambang minimum. Ini "tidak bersertifikat", bukan "gagal level tertentu".`
            }
          />
        </div>
      </Card>

      <Callout kind="warning" title="Tiga hal yang sering disalahpahami">
        ① <strong className="text-ink">PBT ≠ IBT</strong> — skala mentah berbeda, tidak bisa dibandingkan
        langsung. ② Sertifikat berlaku <strong className="text-ink">2 tahun</strong> sejak pengumuman.
        ③ TOPIK 말하기 (Speaking) adalah <strong className="text-ink">ujian terpisah</strong> dengan
        pendaftaran & jadwal sendiri, tidak otomatis termasuk.
      </Callout>

      {exam === 'II' ? (
        <Card>
          <SectionTitle
            eyebrow="쓰기 bernilai 100 dari 300"
            title="Distribusi nilai TOPIK II"
            sub="Esai 600–700 kata bernilai 50 poin — hampir 17% total. Inilah pembeda Level 5–6."
          />
          <DataTable
            head={['Bagian', 'Jumlah soal', 'Skor', 'Catatan']}
            rows={TOPIK_II_PARTS.map((p) => [p.part, p.count, String(p.score), p.note])}
            dense
          />
        </Card>
      ) : null}
    </div>
  )
}

/* ------------------------------- IELTS ------------------------------- */
function IeltsCalc() {
  const [l, setL] = useState(6.5)
  const [r, setR] = useState(6.5)
  const [w, setW] = useState(5.5)
  const [s, setS] = useState(6.0)
  const [rawL, setRawL] = useState(28)
  const [rawR, setRawR] = useState(28)
  const [rType, setRType] = useState<'reading-academic' | 'reading-general'>('reading-academic')

  const exp = ieltsRoundingExplain(l, r, w, s)
  const overall = ieltsOverall(l, r, w, s)
  const bands = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].flatMap((b) => (b === 9 ? [9] : [b, b + 0.5])).filter((x) => x <= 9)

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle eyebrow="Overall band" title="Rata-rata 4 bagian, dibulatkan ke 0,5 terdekat" />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            {([['Listening', l, setL], ['Reading', r, setR], ['Writing', w, setW], ['Speaking', s, setS]] as const).map(
              ([label, val, set]) => (
                <div key={label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[13.5px] font-bold text-ink-soft">{label}</span>
                    <span className="font-display text-[17px] font-extrabold text-ink">{val.toFixed(1)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {bands.filter((b) => b >= 3).map((b) => (
                      <button
                        key={b}
                        onClick={() => set(b)}
                        className={cx(
                          'w-[42px] rounded-lg border-2 py-1 text-[11.5px] font-extrabold',
                          val === b ? 'border-teal-500 bg-teal-500 text-white' : 'border-sand bg-paper text-ink-faint hover:bg-cream',
                        )}
                      >
                        {b.toFixed(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>

          <div>
            <div className="rounded-3xl border-2 border-teal-200 bg-teal-50 p-6 text-center">
              <div className="text-[12px] font-extrabold uppercase tracking-widest text-teal-600">Overall Band</div>
              <div className="font-display text-[64px] font-extrabold leading-none text-ink">{overall.toFixed(1)}</div>
              <div className="mt-1 font-display text-[15px] font-extrabold text-ink-soft">{ieltsBandName(overall)}</div>
            </div>
            <div className="mt-3 space-y-1.5 rounded-2xl border-2 border-sand bg-paper p-4 text-[13px] text-ink-soft">
              <div>Jumlah: <strong className="text-ink">{exp.sum.toFixed(1)}</strong></div>
              <div>Rata-rata: <strong className="text-ink">{exp.mean}</strong></div>
              <div>Aturan: <strong className="text-ink">{exp.rule}</strong></div>
            </div>
            <Callout kind="warning" title="Minimum per bagian">
              Banyak institusi menetapkan minimum per bagian, bukan hanya keseluruhan. “Overall 6.5 dengan
              tidak ada bagian di bawah 6.0” berarti Writing 5.5 tetap <strong className="text-ink">ditolak</strong>.
            </Callout>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle
          eyebrow="Nilai mentah → band"
          title="Konversi Listening & Reading (40 soal)"
          sub="Indikatif — ambang sebenarnya bergeser sedikit tiap sesi sesuai tingkat kesulitan."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Slider label="Listening — jawaban benar" value={rawL} max={40} onChange={setRawL} />
            <div className="mt-2 rounded-2xl border-2 border-sand bg-cream px-4 py-3 text-center">
              <span className="text-[12px] font-extrabold uppercase text-ink-faint">Band</span>
              <div className="font-display text-3xl font-extrabold text-ink">
                {ieltsRawToBand(rawL, 'listening').toFixed(1)}
              </div>
            </div>
          </div>
          <div>
            <Slider label="Reading — jawaban benar" value={rawR} max={40} onChange={setRawR} />
            <div className="mt-2 flex gap-1.5">
              {(['reading-academic', 'reading-general'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setRType(t)}
                  className={cx(
                    'flex-1 rounded-lg border-2 py-1.5 text-[11.5px] font-extrabold',
                    rType === t ? 'border-teal-500 bg-teal-500 text-white' : 'border-sand bg-paper text-ink-faint',
                  )}
                >
                  {t === 'reading-academic' ? 'Academic' : 'General Training'}
                </button>
              ))}
            </div>
            <div className="mt-2 rounded-2xl border-2 border-sand bg-cream px-4 py-3 text-center">
              <span className="text-[12px] font-extrabold uppercase text-ink-faint">Band</span>
              <div className="font-display text-3xl font-extrabold text-ink">
                {ieltsRawToBand(rawR, rType).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
        <Callout kind="tip" title="General Training jauh lebih ketat">
          Untuk band 7.0 Anda butuh <strong className="text-ink">34–35</strong> benar di General, sementara
          Academic hanya <strong className="text-ink">30–32</strong>. Ini karena teks General lebih mudah,
          jadi standarnya dinaikkan.
        </Callout>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle eyebrow="Delapan kemungkinan" title="Aturan pembulatan" />
          <DataTable
            head={['Rata-rata berakhir', 'Dibulatkan ke', 'Contoh']}
            rows={IELTS_ROUNDING.map((x) => [x.frac, x.rule, x.example])}
            dense
          />
        </Card>
        <Card>
          <SectionTitle eyebrow="Target" title="Ambang yang umum diminta" />
          <DataTable head={['Tujuan', 'IELTS']} rows={IELTS_TARGETS.map((t) => [t.goal, t.band])} dense />
        </Card>
      </div>
    </div>
  )
}

/* ------------------------------- TOEFL ------------------------------- */
function ToeflCalc() {
  const [r, setR] = useState(5.5)
  const [l, setL] = useState(5.0)
  const [s, setS] = useState(5.0)
  const [w, setW] = useState(5.5)
  const overall = toeflOverall(r, l, s, w)
  const bands = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6]

  return (
    <div className="space-y-4">
      <Callout kind="warning" title="Perubahan besar — 21 Januari 2026">
        TOEFL iBT kini melaporkan skor pada <strong className="text-ink">skala 1–6</strong> (bukan 0–120),
        dan skor keseluruhan adalah <strong className="text-ink">rata-rata</strong> empat bagian, bukan
        penjumlahan. Selama masa transisi <strong className="text-ink">±2 tahun</strong>, laporan skor tetap
        mencantumkan padanan pada skala 0–120 — jadi Anda tidak perlu mengonversi sendiri. Tapi tanyakan ke
        kampus tujuan: mereka minta skala yang mana?
      </Callout>

      <Card>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            {([['Reading', r, setR], ['Listening', l, setL], ['Speaking', s, setS], ['Writing', w, setW]] as const).map(
              ([label, val, set]) => (
                <div key={label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[13.5px] font-bold text-ink-soft">{label}</span>
                    <span className="font-display text-[17px] font-extrabold text-ink">{val.toFixed(1)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {bands.map((b) => (
                      <button
                        key={b}
                        onClick={() => set(b)}
                        className={cx(
                          'w-[42px] rounded-lg border-2 py-1 text-[11.5px] font-extrabold',
                          val === b ? 'border-teal-500 bg-teal-500 text-white' : 'border-sand bg-paper text-ink-faint hover:bg-cream',
                        )}
                      >
                        {b.toFixed(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>

          <div>
            <div className="rounded-3xl border-2 border-sky-200 bg-sky-50 p-6 text-center">
              <div className="text-[12px] font-extrabold uppercase tracking-widest text-sky-600">Skor Keseluruhan</div>
              <div className="font-display text-[64px] font-extrabold leading-none text-ink">{overall.toFixed(1)}</div>
              <div className="mt-1 text-[13px] font-bold text-ink-soft">
                Skala lama ≈ <strong className="text-ink">{toeflToOld(overall)}</strong> · CEFR{' '}
                <strong className="text-ink">{toeflCefr(overall)}</strong>
              </div>
            </div>
            <div className="mt-3 rounded-2xl border-2 border-sand bg-paper p-4 font-mono text-[12.5px] leading-relaxed text-ink-soft">
              ({r.toFixed(1)} + {l.toFixed(1)} + {s.toFixed(1)} + {w.toFixed(1)}) ÷ 4 ={' '}
              {((r + l + s + w) / 4).toFixed(2)}
              <br />
              → dibulatkan ke 0,5 terdekat = <strong className="text-ink">{overall.toFixed(1)}</strong>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle eyebrow="Konkordansi ETS" title="Skala baru ↔ lama" />
          <DataTable
            head={['Band', 'Reading', 'Listening', 'Speaking', 'Writing', 'Total lama', 'CEFR']}
            rows={TOEFL_CONCORDANCE.map((c) => [
              <strong key="b" className="text-ink">{c.band.toFixed(1)}</strong>,
              c.reading, c.listening, c.speaking, c.writing, c.total, c.cefr,
            ])}
            dense
          />
          <p className="mt-2 text-[12px] text-ink-faint">
            Ambangnya berbeda per bagian. Untuk band 6.0, Reading butuh 29–30 sedangkan Listening 28–30 —
            ini bukan kesalahan tabel, tiap bagian punya distribusi skor sendiri.
          </p>
        </Card>
        <Card>
          <SectionTitle eyebrow="Target" title="Ambang yang umum diminta" />
          <DataTable
            head={['Tujuan', 'Skala lama', 'Perkiraan baru']}
            rows={TOEFL_TARGETS.map((t) => [t.goal, t.old, t.neu])}
            dense
          />
          <p className="mt-2 text-[12px] text-ink-faint">
            Kolom “Perkiraan baru” adalah perkiraan berdasarkan tabel konkordansi, bukan pengumuman resmi
            institusi. Selalu konfirmasi ke institusi tujuan.
          </p>
        </Card>
      </div>
    </div>
  )
}

/* ------------------------------- Hours ------------------------------- */
function HoursCalc() {
  const [perDay, setPerDay] = useState(2)
  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle
          eyebrow="Estimasi perencanaan"
          title="Berapa lama sampai target?"
          sub="Untuk pelajar Indonesia tanpa latar belakang aksara Han, belajar konsisten dari nol."
        />
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-[13.5px] font-bold text-ink-soft">Jam per hari:</span>
          {[1, 2, 3, 4].map((h) => (
            <button
              key={h}
              onClick={() => setPerDay(h)}
              className={cx(
                'rounded-xl border-2 px-4 py-2 font-display text-[15px] font-extrabold',
                perDay === h ? 'border-teal-500 bg-teal-500 text-white' : 'border-sand bg-paper text-ink-faint',
              )}
            >
              {h} jam
            </button>
          ))}
        </div>
        <DataTable
          head={['Target', 'Jam kumulatif', `@${perDay} jam/hari`, 'Tahun']}
          rows={STUDY_HOURS.map((s) => {
            const m = monthsFor(s.hours, perDay)
            return [
              <strong key="t" className="text-ink">{s.target}</strong>,
              `±${s.hours.toLocaleString('id-ID')}`,
              <span key="m" className="font-display font-extrabold text-ink">{m} bulan</span>,
              (m / 12).toFixed(1),
            ]
          })}
          dense
        />
      </Card>
      <Callout kind="tip" title="Angka ini estimasi perencanaan, bukan janji">
        Faktor terbesar bukan bakat, melainkan <strong className="text-ink">konsistensi harian</strong> dan{' '}
        <strong className="text-ink">kualitas latihan output</strong> (bicara & menulis) — bukan sekadar jam
        menonton/membaca pasif.
      </Callout>
    </div>
  )
}
